import API from '../API';
import Lang from '../Lang';
import User from '../User';
import { Log } from '../Logs';
import { createTranslationWindow } from '../Translations';

import {
    setArtifacts,
    setPreviewAction,
    startPreview,
    stopPreview
} from './ActivityPreview';

function targetFromAPI(obj, lang) {
    return {
        id: obj.id,
        name: obj.name
    };
}

function actionFromAPI(obj, lang) {
    const action = {
        id: obj.id,
        tag: obj.tag,
        name: {[lang]: obj.name},
        description: {[lang]: obj.description},
        hint: {[lang]: obj.hint},
        type: obj.type,
        artifact: null, // TODO : intialized after when fetching targets
        targets: obj.targets,
        position: obj.position,
        choice: obj.choice
            ? {
                left: {
                    target: obj.choice.left.target,
                    name: {[lang]: obj.choice.left.name}
                },
                right: {
                    target: obj.choice.right.target,
                    name: {[lang]: obj.choice.right.name}
                }
            }
            : undefined,
        ressource: {
            name: obj.ressource ? 'ressource.' + obj.ressource.split(".")[1] : null,
            file: null,
            changed: false
        },
        previous: obj.previous,
        next: obj.next
    };

    if (obj.ressource) {
        API.execute("/data/actions/" + obj.id + "/ressources/" + obj.ressource).then(res => {
            action.ressource.file = res;
        }).catch(err => console.error(err));
    }

    return action;
}

function loadActivity(obj) {
    return new Promise((resolve, reject) => {
        const params = obj.$route.query;
        if (!params.id) {
            console.error("Invalid URL (id: " + params.id + ")");
            obj.$router.go(-1);
        }

        obj.activity.data = {
            id: params.id,
            name: {},
            description: {},
            actions: [],
            languages: [],
        }
        
        // first fetch the activity languages
        API.execute(API.ROUTE.ACTIVITIES + params.id + "/languages").then(langs => {
            const addedArtifacts = [];
            const lang = langs[0];
            obj.activity.data.languages = langs;

            const tryFetchActions = id => {
                const fetchNextAction = (id) => {
                    if (!id) return;
                    
                    // fetch the action
                    API.execute(API.ROUTE.ACTIONS + id + "?language_code=" + lang).then(res => {
                        const action = actionFromAPI(res, lang);
                        obj.activity.data.actions.push(action);
                        fetchNextAction(res.next);

                        // fetch all the action's translations
                        langs.forEach((lang, index) => {
                            if (index === 0) return; // skip the base language (already fetched)
                            API.execute(API.ROUTE.ACTIONS + id + "?language_code=" + lang).then(res => {
                                action.name[lang] = res.name;
                                action.description[lang] = res.description;
                                action.hint[lang] = res.hint;
                                if (action.type === 'choice') {
                                    action.choice.left.name[lang] = res.choice.left.name;
                                    action.choice.right.name[lang] = res.choice.right.name;
                                }
                            }).catch(err => console.error("Error fetching action " + id + " in language " + lang, err));
                        });

                        // fetch all the action's targets
                        if (res.targets.length === 0) reject("No targets for action " + id);
                        res.targets.forEach((target, index) => {
                            API.execute(API.ROUTE.TARGETS + target).then(res2 => {
                                res.targets[index] = targetFromAPI(res2, lang);
                                if (index === 0) {
                                    // fetch the action's artifact
                                    const artifactID = res2.artifact;
                                    const index = addedArtifacts.indexOf(artifactID);
                                    if (index < 0) {
                                        addedArtifacts.push(artifactID);
                                        API.execute(API.ROUTE.ARTIFACTS + artifactID + "/languages").then(langs => {
                                            const lang = langs.includes(Lang.CurrentCode) ? Lang.CurrentCode : langs[0];
                                            addArtifact(obj, {id: artifactID, language: lang}).then(res => {
                                                action.artifact = res;
                                                obj.$forceUpdate();
                                                resolve();
                                            });
                                        });
                                    } else {
                                        action.artifact = obj.artifacts[index];
                                    }
                                }
                            }).catch(err => reject("Error fetching action target " + target));
                        });
                        
                    }).catch(err => reject("Error fetching action " + id));
                }
                fetchNextAction(id);
            };

            langs.forEach((lang, index) => { // fetch activity translations
                API.execute(API.ROUTE.ACTIVITIES + params.id + "?language_code=" + lang).then(res => {
                    obj.activity.data.name[lang] = res.name;
                    obj.activity.data.description[lang] = res.description;
                    if (index === 0) {
                        if (res.start) tryFetchActions(res.start);
                        else resolve();
                    }
                }).catch(err => reject(err));
            });
        }).catch(err => reject(err));
    });
}

function scrollToAction(index) {
    const domAction = document.getElementById("action-"+index);
    let shift;
    if (!domAction) shift = 0;
    else shift = domAction.offsetTop - 6;
    const domContainer = document.getElementById("actions-zone");
    domContainer.scroll({
        top: shift,
        behavior: 'smooth'
    })
}

function startActivity(obj) {
    obj.activity.running = true;
    obj.activity.actionIndex = 0;
    scrollToAction(obj.activity.actionIndex);
    startPreview();
}

function nextAction(obj) {
    if (obj.activity.actionIndex >= obj.activity.data.actions.length - 1) return;
    obj.activity.actionIndex++;
    scrollToAction(obj.activity.actionIndex);
    setPreviewAction(obj.activity.data.actions[obj.activity.actionIndex]);
}

function prevAction(obj) {
    if (obj.activity.actionIndex <= 0) return;
    obj.activity.actionIndex--;
    scrollToAction(obj.activity.actionIndex);
    setPreviewAction(obj.activity.data.actions[obj.activity.actionIndex]);
}

function stopActivity(obj) {
    obj.activity.running = false;
    scrollToAction(); // go to top
    stopPreview();
}

function saveActivity(obj) {
    console.log("Saving activity", obj.activity.data)
    const langs = Object.keys(obj.activity.data.name)
    const lang = langs[0];
    langs.splice(0, 1); // remove the first lang from translations (already send in first request, duh)

    const logZone = obj.$refs["log-zone"];
    const log = logZone.log(Lang.CurrentLang.SAVING, Log.INFO);

    const actionCreationPromises = [];
    // first, create the actions (in the first activity's language)
    obj.activity.data.actions.forEach(action => {
        actionCreationPromises.push(new Promise((resolve, reject) => {
            API.execute_logged(API.ROUTE.ACTIONS, API.METHOD.POST, User.currentUser.getCredentials(), {
                tag: action.tag,
                previous: null,
                next: null,
                type: action.type,
                position: {
                    x: action.position.x,
                    y: action.position.y,
                    z: action.position.z
                },
                name: action.name[lang],
                description: action.description[lang],
                hint: action.hint[lang],
                artifactID: action.artifact.id,
                language: lang,
                targets: action.targets.map(t => t.id),
                choice: action.type === "choice"
                    ? {
                        left: {
                            target: null,
                            name: action.choice.left.name[lang],
                        },
                        right: {
                            target: null,
                            name: action.choice.right.name[lang]
                        }
                    }
                    : undefined
            }).then(res => {
                action.id = res.id;
                obj.activity.data.actions.find(el => el.tag === action.tag).id = res.id;
                if (action.ressource.file !== null) {
                    console.debug("Adding ressource file ", action.ressource.file);
                    API.execute_logged(API.ROUTE.ACTIONS + action.id + "/ressource", API.METHOD.POST, User.currentUser.getCredentials(), action.ressource.file, API.TYPE.FILE, [], 'ressource_file').then(res => {
                        // ressource added
                    }).catch(err => {
                        console.error(err);
                    });
                }
                resolve(action); // we resolve before all the translations, to avoid waiting too much to save
                // add all the translations
                langs.forEach(language => {
                    if (language === lang) return; // already added
                    API.execute_logged(API.ROUTE.ACTIONS + action.id + "?language_code=" + language, API.METHOD.PATCH, User.currentUser.getCredentials(), {
                        name: action.name[language],
                        hint: action.hint[language],
                        description: action.description[language],
                        choice: action.type === 'choice'
                            ? {
                                left: { name: action.choice.left.name[language] },
                                right: { name: action.choice.right.name[language] }
                            }
                            : undefined
                    }).then(res => {
                        // translation added
                    }).catch(err => console.error("Error adding action translation " + language, err));
                })
            }).catch(err => { console.error("Error creating action ", err); });
        }));
    });

    // when they are all created
    Promise.all(actionCreationPromises).then(ress => {
        const actions = obj.activity.data.actions;
        // link the actions together (if more than one)
        if (actions.length > 1 || actions.some(a => a.type === 'choice')) {
            actions.forEach((action, index) => {
                API.execute_logged(API.ROUTE.ACTIONS + action.id + "?language_code=" + lang, API.METHOD.PATCH, User.currentUser.getCredentials(), {
                    next: index < actions.length-1 ? actions[index+1].id : null,
                    previous: index > 0 ? actions[index-1].id : null,
                    choice: action.type === 'choice'
                        ? {
                            left: {
                                target: actions.find(el => el.tag === action.choice.left.target).id,
                                name: action.choice.left.name[lang]
                            },
                            right: {
                                target: actions.find(el => el.tag === action.choice.right.target).id,
                                name: action.choice.right.name[lang]
                            }
                        }
                        : undefined
                }).then(res => {
                    // linked
                }).catch(err => console.error("Error linking action", err));
            });
        }

        // create the activity (in the first activity's language)
        API.execute_logged(API.ROUTE.ACTIVITIES, API.METHOD.POST, User.currentUser.getCredentials(), {
            name: obj.activity.data.name[lang],
            description: obj.activity.data.description[lang],
            language: lang,
            start: obj.activity.data.actions[0].id,
            artifacts: obj.artifacts.map(el => el.id)
        }).then(res => {
            obj.activity.data.id = res.id;
            // add all the activity's translations
            const promises = [];
            langs.forEach(language => {
                promises.push(API.execute_logged(API.ROUTE.ACTIVITIES + res.id + "?language_code=" + language, API.METHOD.PATCH, User.currentUser.getCredentials(), {
                    name: obj.activity.data.name[language],
                    description: obj.activity.data.description[language],
                    choice: action.type === 'choice'
                        ? {
                            left: { name: action.choice.left.name[language] },
                            right: { name: action.choice.right.name[language] }
                        }
                        : undefined
                }));
            });
            Promise.all(promises).then(() => {
                log.update(Lang.CurrentLang.SAVED, Log.SUCCESS);
                setTimeout(() => {
                    log.delete();
                    obj.$router.push('/activities');
                }, 1000);
            }).catch(err => console.error("Error adding activity translations ", err));
        }).catch(err => console.error("Error creating activity ", err));
    }).catch(err => {});
}

function editActivity(obj) {
    const logZone = obj.$refs["log-zone"];
    const log = logZone.log(Lang.CurrentLang.EDITING, Log.INFO);

    // first check for translations
    const addedTranslations = [];
    const modifiedTranslations = [];
    const removedTranslations = [];

    const langs = Object.keys(obj.activity.data.name);
    const oldLangs = Object.keys(obj.old.name);
    langs.forEach(lang => {
        if (!oldLangs.includes(lang))
            addedTranslations.push(lang);
        else if (obj.activity.data.name[lang] !== obj.old.name[lang] || obj.activity.data.description[lang] !== obj.old.description[lang])
            modifiedTranslations.push(lang);
    });
    oldLangs.forEach(lang => { if (!langs.includes(lang)) removedTranslations.push(lang); });
    
    console.debug("Added translations: ", addedTranslations);
    console.debug("Modified translations: ", modifiedTranslations);
    console.debug("Removed translations: ", removedTranslations);

    // add/remove/modify the translations
    const translationsPromises = [];
    addedTranslations.forEach(lang => {
        translationsPromises.push(API.execute_logged(API.ROUTE.ACTIVITIES + obj.activity.data.id + "?language_code=" + lang, API.METHOD.PATCH, User.currentUser.getCredentials(), {
            name: obj.activity.data.name[lang],
            description: obj.activity.data.description[lang]
        }));
    });
    modifiedTranslations.forEach(lang => {
        translationsPromises.push(API.execute_logged(API.ROUTE.ACTIVITIES + obj.activity.data.id + "?language_code=" + lang, API.METHOD.PATCH, User.currentUser.getCredentials(), {
            name: obj.activity.data.name[lang],
            description: obj.activity.data.description[lang]
        }));
    });
    removedTranslations.forEach(lang => {
        translationsPromises.push(API.execute_logged(API.ROUTE.ACTIVITIES + obj.activity.data.id + "?language_code=" + lang, API.METHOD.DELETE, User.currentUser.getCredentials()));
    });

    // next, check for actions
    const addedActions = [];
    const modifiedActions = [];
    const removedActions = [];

    const actions = obj.activity.data.actions;
    const oldActions = obj.old.actions;
    actions.forEach((action, index) => {
        const oldAction = oldActions.find(el => el.id === action.id);
        if (!oldAction) {
            addedActions.push(action);
            return;
        }

        action.previous = index > 0 ? actions[index-1].id : null;
        action.next = index < actions.length-1 ? actions[index+1].id : null;

        const checks = [
            (a, b) => a.tag === b.tag,
            (a, b) => {
                if (!Object.keys(a.hint).length === Object.keys(b.hint).length) return false;
                return Object.keys(a.hint).every(key => a.hint[key] === b.hint[key]);
            },
            (a, b) => {
                if (!Object.keys(a.name).length === Object.keys(b.name).length) return false;
                return Object.keys(a.name).every(key => a.name[key] === b.name[key]);
            },
            (a, b) => {
                if (!Object.keys(a.description).length === Object.keys(b.description).length) return false;
                return Object.keys(a.description).every(key => a.description[key] === b.description[key]);
            },
            (a, b) => a.type === b.type,
            (a, b) => a.next === b.next,
            (a, b) => a.previous === b.previous,
            (a, b) => a.position.x === b.position.x && a.position.y === b.position.y && a.position.z === b.position.z,
            (a, b) => !a.choice || a.choice.left.target === b.choice.left.target,
            (a, b) => !a.choice || a.choice.left.name === b.choice.left.name,
            (a, b) => !a.choice || a.choice.right.target === b.choice.right.target,
            (a, b) => !a.choice || a.choice.right.name === b.choice.right.name,
            (a, b) => {
                if (!a.targets.length === b.targets.length) return false;
                return a.targets.every(target => b.targets.map(t => t.id).includes(target.id));
            },
        ];

        checks.forEach((check, index) => {
            if (!check(action, oldAction)) {
                console.debug("Action " + action.tag + " has been modified (check " + index + ") | ", action, oldAction);
                modifiedActions.push(action);
            }
        });
    });

    oldActions.forEach(action => {
        if (!actions.find(el => el.id === action.id)) removedActions.push(action);
    });

    console.debug("Added actions: ", addedActions);
    console.debug("Modified actions: ", modifiedActions);
    console.debug("Removed actions: ", removedActions);

    // add/remove/modify the actions
    const addedPromises = [];
    addedActions.forEach(action => {
        const langs = Object.keys(action.name);
        const lang = langs[0];

        addedPromises.push(new Promise((resolve, reject) => {
            console.debug("Adding action " + action.tag + "...");
            API.execute_logged(API.ROUTE.ACTIONS, API.METHOD.POST, User.currentUser.getCredentials(), {
                tag: action.tag,
                hint: action.hint[lang],
                name: action.name[lang],
                language: lang,
                description: action.description[lang],
                type: action.type,
                position: action.position,
                choice: action.type === "choice"
                    ? {
                        left: {
                            target: null,
                            name: action.choice.left.name[lang],
                        },
                        right: {
                            target: null,
                            name: action.choice.right.name[lang]
                        }
                    }
                    : undefined
            }).then(res => {
                action.id = res.id;

                // update neighbors (next/previous)
                console.debug("Updating neighbors for action " + action.id + "...");
                modifiedActions.push(action);
                // const index = obj.activity.data.actions.findIndex(el => el.tag === action.tag);
                // if (index > 0)                                    modifiedActions.push(obj.activity.data.actions[index-1]);
                // if (index < obj.activity.data.actions.length - 1) modifiedActions.push(obj.activity.data.actions[index+1]);
                
                langs.forEach((lang, index) => {
                    if (index === 0) return;
                    console.debug("Sending translation for action " + action.id + " in language " + lang + "...");
                    API.execute_logged(API.ROUTE.ACTIONS + action.id + "?language_code=" + lang, API.METHOD.PATCH, User.currentUser.getCredentials(), {
                        hint: action.hint[lang],
                        name: action.name[lang],
                        description: action.description[lang],
                        choice: action.type === 'choice'
                            ? {
                                left: { name: action.choice.left.name[language] },
                                right: { name: action.choice.right.name[language] }
                            }
                            : undefined
                    });
                });
                resolve();
            }).catch(reject);
        }));
    });

    Promise.all(addedPromises).then(ress => {
        const actionsPromises = [];

        const uniqueModifiedActions = [];
        modifiedActions.forEach(action => {
            if (!uniqueModifiedActions.find(el => el.id === action.id)) uniqueModifiedActions.push(action);
        });

        uniqueModifiedActions.forEach(action => {
            const langs = Object.keys(action.name);
            const index = actions.findIndex(el => el.id === action.id);
            const old = oldActions.find(el => el.id === action.id);
            const addedTranslations = [];
            const modifiedTranslations = [];
            const removedTranslations = [];

            if (old) {
                const oldLangs = Object.keys(old.name);
                langs.forEach(lang => {
                    if (!oldLangs.includes(lang))
                        addedTranslations.push(lang);
                    else if (action.name[lang] !== old.name[lang] ||
                            action.description[lang] !== old.description[lang] ||
                            action.hint[lang] !== old.hint[lang])
                        modifiedTranslations.push(lang);
                });
                oldLangs.forEach(lang => { if (!langs.includes(lang)) removedTranslations.push(lang); });

                addedTranslations.forEach(lang => {
                    console.debug("Sending translation for action " + action.id + " in language " + lang + "...");
                    actionsPromises.push(API.execute_logged(API.ROUTE.ACTIONS + action.id + "?language_code=" + lang, API.METHOD.PATCH, User.currentUser.getCredentials(), {
                        hint: action.hint[lang],
                        name: action.name[lang],
                        description: action.description[lang],
                        choice: action.type === 'choice'
                            ? {
                                left: { name: action.choice.left.name[language] },
                                right: { name: action.choice.right.name[language] }
                            }
                            : undefined
                    }));
                });
                modifiedTranslations.forEach(lang => {
                    console.debug("Modifying translation for action " + action.id + " in language " + lang + "...");
                    actionsPromises.push(API.execute_logged(API.ROUTE.ACTIONS + action.id + "?language_code=" + lang, API.METHOD.PATCH, User.currentUser.getCredentials(), {
                        hint: action.hint[lang],
                        name: action.name[lang],
                        description: action.description[lang],
                        choice: action.type === 'choice'
                            ? {
                                left: { name: action.choice.left.name[language] },
                                right: { name: action.choice.right.name[language] }
                            }
                            : undefined
                    }));
                });
                removedTranslations.forEach(lang => {
                    console.debug("Removing translation for action " + action.id + " in language " + lang + "...");
                    actionsPromises.push(API.execute_logged(API.ROUTE.ACTIONS + action.id + "?language_code=" + lang, API.METHOD.DELETE, User.currentUser.getCredentials()));
                });

                console.debug("Updating action " + action.id + "...", action);
                actionsPromises.push(API.execute_logged(API.ROUTE.ACTIONS + action.id, API.METHOD.PATCH, User.currentUser.getCredentials(), {
                    tag: old.tag === action.tag ? undefined : action.tag,
                    type: old.type === action.type ? undefined : action.type,
                    position: (old.position.x === action.position.x && old.position.y === action.position.y && old.position.z === action.position.z) ? undefined : action.position,
                    choice: action.type === 'choice'
                        ? {
                            left: {
                                target: actions.find(el =>
                                    typeof(action.choice.left.target) === 'string'
                                        ? el.tag === action.choice.left.target
                                        : el.id === action.choice.left.target
                                ).id,
                                name: action.choice.left.name[langs[0]]
                            },
                            right: {
                                target: actions.find(el =>
                                    typeof(action.choice.right.target) === 'string'
                                        ? el.tag === action.choice.right.target
                                        : el.id === action.choice.right.target
                                ).id,
                                name: action.choice.right.name[langs[0]]
                            }
                        }
                        : undefined,
                    previous: index > 0 ? actions[index-1].id : null,
                    next: index < actions.length - 1 ? actions[index+1].id : null,
                    targets: action.targets.map(el => el.id)
                }));
            } else {
                actionsPromises.push(API.execute_logged(API.ROUTE.ACTIONS + action.id, API.METHOD.PATCH, User.currentUser.getCredentials(), {
                    tag: action.tag,
                    type: action.type,
                    position: action.position,
                    choice: action.type === 'choice'
                        ? {
                            left: {
                                target: actions.find(el => el.tag === action.choice.left.target).id,
                                name: action.choice.left.name[langs[0]]
                            },
                            right: {
                                target: actions.find(el => el.tag === action.choice.right.target).id,
                                name: action.choice.right.name[langs[0]]
                            }
                        }
                        : undefined,
                    previous: index > 0 ? actions[index-1].id : null,
                    next: index < actions.length - 1 ? actions[index+1].id : null,
                    targets: action.targets.map(el => el.id)
                }));
            }
        });

        removedActions.forEach(action => {
            console.debug("Removing action " + action.id + "...");
            actionsPromises.push(API.execute_logged(API.ROUTE.ACTIONS + action.id, API.METHOD.DELETE, User.currentUser.getCredentials()));
        });

        // check if ressource files have been modified
        actions.forEach(action => {
            const old = oldActions.find(el => el.id === action.id);
            if (!old) {
                if (action.ressource?.file) {
                    console.debug("Adding ressource file ", action.ressource.file);
                    actionsPromises.push(API.execute_logged(API.ROUTE.ACTIONS + action.id + "/ressource", API.METHOD.POST, User.currentUser.getCredentials(), action.ressource.file, API.TYPE.FILE, [], 'ressource_file'));
                }
                return;
            }
            if (action.ressource && action.ressource.changed) {
                if (old.ressource?.file)
                    actionsPromises.push(API.execute_logged(API.ROUTE.ACTIONS + action.id + "/ressource", API.METHOD.DELETE, User.currentUser.getCredentials()));
                console.debug("Adding ressource file ", action.ressource.file);
                actionsPromises.push(API.execute_logged(API.ROUTE.ACTIONS + action.id + "/ressource", API.METHOD.POST, User.currentUser.getCredentials(), action.ressource.file, API.TYPE.FILE, [], 'ressource_file'));
            }
        });

        // next, if the artifacts list has changed or first action has changed, update the activity 
        const artifacts = obj.artifacts.map(artifact => artifact.id);
        const hasArtifactsChanged = artifacts.length !== obj.old.artifacts.length || artifacts.some(el => !obj.old.artifacts.map(a => a.id).includes(el));
        const hasStartChanged = obj.old.actions.length === 0 || obj.activity.data.actions[0].id !== obj.old.actions[0].id;
        if (hasArtifactsChanged || hasStartChanged)
            translationsPromises.push(API.execute_logged(API.ROUTE.ACTIVITIES + obj.activity.data.id, API.METHOD.PATCH, User.currentUser.getCredentials(), {
                artifacts: hasArtifactsChanged ? artifacts : undefined,
                start: hasStartChanged ? obj.activity.data.actions[0].id : undefined
            }));

        Promise.all(actionsPromises).then(ress => {
            Promise.all(translationsPromises).then(ress => {
                log.update(Lang.CurrentLang.EDITED, Log.SUCCESS);
                setTimeout(() => {
                    log.delete();
                    obj.$router.push('/activities');
                }, 1000);
            }).catch(err => console.error("Error updating translations", err));
        }).catch(err => console.error("Error updating actions", err));
    }).catch(err => console.error("Error updating translations", err));
}

function deleteActivity(obj) {
    const popup = obj.$refs['delete-popup'];
    const btn = obj.$refs['delete-btn'];
    if (!btn) { // delete asked from err popup
        const loading = obj.$refs['loading'];
        const log = loading.log(Lang.CurrentLang.DELETING, Log.INFO);
        API.execute_logged(API.ROUTE.ACTIVITIES + obj.activity.data.id, API.METHOD.DELETE, User.currentUser.getCredentials()).then(res => {
            log.update(Lang.CurrentLang.DELETED, Log.SUCCESS);
            setTimeout(() => {
                log.delete();
                obj.$router.push('/activities');
            }, 2000);
        }).catch(err => console.error("Error deleting activity " + obj.activity.data.id, err));
    } else {
        popup.show(Lang.CurrentLang.DELETE_ACTIVITY, Lang.CurrentLang.DELETE_ACTIVITY_DESC, Lang.CurrentLang.CANCEL, Lang.CurrentLang.DELETE);
        popup.setPosition(btn.$el);
        popup.setCallback(() => {
            API.execute_logged(API.ROUTE.ACTIVITIES + obj.activity.data.id, API.METHOD.DELETE, User.currentUser.getCredentials()).then(res => {
                obj.$router.push('/activities');
            }).catch(err => console.error("Error deleting activity " + obj.activity.data.id, err));
        });
    }
}

function createDefaultAction() {
    return {
        tag: Lang.CurrentLang.NEW_ACTION_TAG,
        hint: {},
        name: {},
        description: {},
        type: 'action',
        artifact: null,
        targets: [],
        position: {x: 0, y: 0, z: 0},
        choice: undefined,
        ressource: {
            name: Lang.CurrentLang.SELECT_FILE,
            file: null,
            changed: false
        }
    };
}

function createDefaultActivity() {
    return {
        name: {},
        description: {},
        actions: [
            {...createDefaultAction()}
        ]
    };
}

function addAction(obj, index) {
    if (index <= obj.activity.actionIndex) {
        obj.activity.actionIndex = Math.min(Math.max(0, obj.activity.actionIndex+1), obj.activity.data.actions.length - 1);
    }
    obj.activity.data.actions.splice(index, 0, createDefaultAction());
}

function delAction(obj, index) {
    obj.activity.data.actions.splice(index, 1);
    if (index >= obj.activity.actionIndex) {
        obj.activity.actionIndex = Math.min(Math.max(0, obj.activity.actionIndex-1), obj.activity.data.actions.length - 1);
    }
}

function spawnTranslationWindow(obj) {
    const rect = {
        x: window.innerWidth * 0.2,
        y: window.innerHeight * 0.2,
        width: window.innerWidth * 0.6,
        height: window.innerHeight * 0.6
    };
    const onTranslations = (data) => {
        obj.activity.data = data;
        obj.$forceUpdate();
    };

    const win = createTranslationWindow(rect, obj.activity.data, onTranslations);
    obj.translations = win;
}

function addArtifact(obj, art) {
    return new Promise((resolve, reject) => {
        // fetch its informations
        API.execute(API.ROUTE.ARTIFACTS + art.id + "?language_code=" + (art.languages ? art.languages[0] : art.language)).then(res => {
            art.targets = res.targets;
            art.name = res.name;
            art.description = res.description;
            // fetch all its targets infos
            const promises = [];
            for (let i = 0; i < art.targets.length; i++) {
                promises.push(new Promise((resolve, reject) => {
                    API.execute(API.ROUTE.TARGETS + art.targets[i]).then(res => {
                        res.artifact = art;
                        art.targets[i] = res;
                        resolve();
                    }).catch(err => reject(err));
                }));
            }
            Promise.all(promises).then(res => {
                // add the artifact
                obj.artifacts.push(art);
                setArtifacts(obj.artifacts).then(() => {
                    resolve(art);
                }).catch(err => reject(err));
            });
        }).catch(err => reject(err));
    });
}

function delArtifact(obj, art) {
    // get the artifact position
    const index = obj.artifacts.findIndex(a => a.id === art.id);
    if (index < 0) return;
    // remove it
    obj.artifacts.splice(index, 1);
}

function upAction(obj, index) {
    if (index <= 0) return;
    obj.activity.data.actions.splice(index-1, 0, obj.activity.data.actions.splice(index, 1)[0]);
}
function downAction(obj, index) {
    if (index >= obj.activity.data.actions.length - 1) return;
    obj.activity.data.actions.splice(index+1, 0, obj.activity.data.actions.splice(index, 1)[0]);
}

function validateInputs(obj) {
    const logZone = obj.$refs['log-zone'];
    const log = logZone.log(Lang.CurrentLang.VALIDATING, Log.INFO);
    setTimeout(() => { window.onresize?.(); }, 300); // to avoid weird ui shifting because of the canvas

    // check if the activity has name and description in every language
    const langs = Object.keys(obj.activity.data.name);
    for (let i = 0; i < langs.length; i++) {
        const name = obj.activity.data.name[langs[i]]?.trim();
        const desc = obj.activity.data.description[langs[i]]?.trim();
        if (!name || name.length === 0) {
            log.update("("+ langs[i] +") " + Lang.CurrentLang.SPECIFY_NAME, Log.WARNING);
            setTimeout(() => { log.delete(); }, 4000);
            return false;
        }
        if (!desc || desc.length === 0) {
            log.update("("+ langs[i] +") " + Lang.CurrentLang.SPECIFY_DESC, Log.WARNING);
            setTimeout(() => { log.delete(); }, 4000);
            return false;
        }
    }
    // check if there is at least one language
    if (langs.length === 0) {
        log.update(Lang.CurrentLang.SPECIFY_TRANSLATIONS, Log.WARNING);
        setTimeout(() => { log.delete(); }, 4000);
        return false;
    }

    // check if the activity has at least one action
    if (obj.activity.data.actions.length === 0) {
        log.update(Lang.CurrentLang.SPECIFY_ACTIONS, Log.WARNING);
        setTimeout(() => { log.delete(); }, 4000);
        return false;
    }

    // check if the activity has at least one artifact
    if (obj.artifacts.length === 0) {
        log.update(Lang.CurrentLang.SPECIFY_ARTIFACTS, Log.WARNING);
        setTimeout(() => { log.delete(); }, 4000);
        return false;
    }

    // check if all actions have correct informations
    for (let i = 0; i < obj.activity.data.actions.length; i++) {
        const action = obj.activity.data.actions[i];
        // verify tag
        if (!action.tag || action.tag.trim().length === 0) {
            log.update("("+Lang.CurrentLang.ACTION+" "+(i+1)+") " + Lang.CurrentLang.SPECIFY_TAG, Log.WARNING);
            setTimeout(() => { log.delete(); }, 4000);
            return false;
        }
        // verify name and description
        for (let i = 0; i < langs.length; i++) {
            const action_langs = Object.keys(action.name);
            if (!action_langs.includes(langs[i])) {
                log.update("("+Lang.CurrentLang.ACTION+" "+(i+1)+") ("+ langs[i] +") " + Lang.CurrentLang.SPECIFY_ACTION_TRANSLATION, Log.WARNING);
                setTimeout(() => { log.delete(); }, 4000);
                return false;
            }
            const name = action.name[langs[i]]?.trim() || "";
            const desc = action.description[langs[i]]?.trim() || "";
            const hint = action.hint[langs[i]]?.trim() || "";
            if (name.length === 0) {
                log.update("("+Lang.CurrentLang.ACTION+" "+(i+1)+") ("+ langs[i] +") " + Lang.CurrentLang.SPECIFY_NAME, Log.WARNING);
                setTimeout(() => { log.delete(); }, 4000);
                return false;
            }
            if (desc.length === 0) {
                log.update("("+Lang.CurrentLang.ACTION+" "+(i+1)+") ("+ langs[i] +") " + Lang.CurrentLang.SPECIFY_DESC, Log.WARNING);
                setTimeout(() => { log.delete(); }, 4000);
                return false;
            }
            // if (hint.length === 0) {
            //     log.update("("+Lang.CurrentLang.ACTION+" "+(i+1)+") ("+ langs[i] +") " + Lang.CurrentLang.SPECIFY_HINT, Log.WARNING);
            //     setTimeout(() => { log.delete(); }, 4000);
            //     return false;
            // }
        }
        // verify target
        if (action.targets.length === 0) {
            log.update("("+Lang.CurrentLang.ACTION+" "+(i+1)+") " + Lang.CurrentLang.SPECIFY_TARGETS, Log.WARNING);
            setTimeout(() => { log.delete(); }, 4000);
            return false;
        }
        // if choice, verify choice targets
        if (action.type === "choice") {
            for (const lang of langs) {
                if (!action.choice.left.name || !action.choice.left.name[lang]) {
                    log.update("(" + lang + ") ("+Lang.CurrentLang.ACTION+" "+(i+1)+") " + Lang.CurrentLang.SPECIFY_LEFT_CHOICE_NAME, Log.WARNING);
                    setTimeout(() => { log.delete(); }, 4000);
                    return false;
                }
                if (!action.choice.right.name || !action.choice.right.name[lang]) {
                    log.update("(" + lang + ") ("+Lang.CurrentLang.ACTION+" "+(i+1)+") " + Lang.CurrentLang.SPECIFY_RIGHT_CHOICE_NAME, Log.WARNING);
                    setTimeout(() => { log.delete(); }, 4000);
                    return false;
                }
            }
            if (!action.choice.left.target) {
                log.update("("+Lang.CurrentLang.ACTION+" "+(i+1)+") " + Lang.CurrentLang.SPECIFY_LEFT_CHOICE_TARGET, Log.WARNING);
                setTimeout(() => { log.delete(); }, 4000);
                return false;
            }
            if (!action.choice.right.target) {
                log.update("("+Lang.CurrentLang.ACTION+" "+(i+1)+") " + Lang.CurrentLang.SPECIFY_RIGHT_CHOICE_TARGET, Log.WARNING);
                setTimeout(() => { log.delete(); }, 4000);
                return false;
            }
        }
    }

    // check if action tag is unique
    const tags = obj.activity.data.actions.map(a => a.tag);
    const unique_tags = [...new Set(tags)];
    if (tags.length !== unique_tags.length) {
        log.update(Lang.CurrentLang.ACTION_TAG_UNIQUE, Log.WARNING);
        setTimeout(() => { log.delete(); }, 4000);
        return false;
    }

    log.delete();
    return true;
}

export {
    targetFromAPI,
    actionFromAPI,
    loadActivity,
    scrollToAction,
    startActivity,
    nextAction,
    prevAction,
    stopActivity,
    saveActivity,
    editActivity,
    deleteActivity,
    createDefaultAction,
    createDefaultActivity,
    addAction,
    delAction,
    spawnTranslationWindow,
    addArtifact,
    delArtifact,
    upAction,
    downAction,
    validateInputs
};

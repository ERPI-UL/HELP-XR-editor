import API from '../API';
import Lang from '../Lang';
import User from '../User';
import { Log } from '../Logs';
import {
    setArtifacts,
    setAnchorPosRot
} from './WorkplaceEditor';

function saveWorkplace(obj) {
    const logZone = obj.$refs['log-zone'];
    const log = logZone.log(Lang.CurrentLang.SAVING, Log.INFO);
    const langs = Object.keys(obj.workplace);

    const data = {
        name: obj.workplace[langs[0]].name,
        description: obj.workplace[langs[0]].description,
        language: langs[0],
        anchor: obj.anchor,
        artifacts: obj.artifacts.map(art => {
            return {
                artifactID: art.id,
                position: {x: art.model.position.x, y: art.model.position.y, z: art.model.position.z},
                rotation: {x: art.model.rotation.x, y: art.model.rotation.y, z: art.model.rotation.z}
            };
        })
    };
    
    // first, send the workplace in the base language
    API.execute_logged(API.ROUTE.WORKPLACES, API.METHOD.POST, User.currentUser.getCredentials(), data).then(res => {
        const workplaceId = res.id;

        // then, send the translations
        const promises = [];
        langs.forEach((lang, index) => {
            if (index === 0) return; // already sent
            promises.push(API.execute_logged(API.ROUTE.WORKPLACES + workplaceId + "?language_code=" + lang, API.METHOD.PATCH, User.currentUser.getCredentials(), {
                name: obj.workplace[lang].name,
                description: obj.workplace[lang].description
            }));
        });

        Promise.all(promises).then(ress => {
            log.update(Lang.CurrentLang.SAVED, Log.SUCCESS);
            setTimeout(() => {
                log.delete();
                obj.$router.push('/workplaces');
            }, 1000);
        }).catch(err => console.error("Error creating workplace translations", err));
    }).catch(err => console.error("Error creating workplace", err));
}

function editWorkplace(obj) {
    const logZone = obj.$refs['log-zone'];
    const log = logZone.log(Lang.CurrentLang.EDITING, Log.INFO);

    // first send the instances modifications
    const addedArtifacts = [];
    const removedArtifacts = [];
    const modifiedArtifacts = [];
    
    obj.artifacts.forEach(art => {
        if (art.isCreated) {
            addedArtifacts.push(art);
            return;
        }

        const original = obj.old.artifacts.find(a => a.instanceId === art.instanceId);
        if (!original) {
            addedArtifacts.push(art);
            return;
        } else {
            if (art.model.position.x !== original.position.x ||
                art.model.position.y !== original.position.y ||
                art.model.position.z !== original.position.z ||
                art.model.rotation.x !== original.rotation.x ||
                art.model.rotation.y !== original.rotation.y ||
                art.model.rotation.z !== original.rotation.z ||
                art.id               !== original.id         ) {
                modifiedArtifacts.push(art);
            }
        }
    });

    obj.old.artifacts.forEach(art => {
        const res = obj.artifacts.find(a => a.id === art.id && a.instanceId === art.instanceId);
        if (!res) {
            removedArtifacts.push(art);
        }
    });

    const promises = [];
    addedArtifacts.forEach(art => {
        promises.push(API.execute_logged(API.ROUTE.WORKPLACES + obj.workplaceId + "/instances", API.METHOD.POST, User.currentUser.getCredentials(), {
            artifactID: art.id,
            position: {x: art.model.position.x, y: art.model.position.y, z: art.model.position.z},
            rotation: {x: art.model.rotation.x, y: art.model.rotation.y, z: art.model.rotation.z}
        }));
    });
    modifiedArtifacts.forEach(art => {
        promises.push(API.execute_logged(API.ROUTE.INSTANCES + art.instanceId, API.METHOD.PATCH, User.currentUser.getCredentials(), {
            position: {x: art.model.position.x, y: art.model.position.y, z: art.model.position.z},
            rotation: {x: art.model.rotation.x, y: art.model.rotation.y, z: art.model.rotation.z}
        }));
    });
    removedArtifacts.forEach(art => {
        promises.push(API.execute_logged(API.ROUTE.INSTANCES + art.instanceId, API.METHOD.DELETE, User.currentUser.getCredentials()));
    });
    
    // Then send the translations modifications
    const translations = Object.keys(obj.workplace);
    const oldTranslations = Object.keys(obj.old.workplace);
    translations.forEach(code => {
        if (!oldTranslations.includes(code)) {
            promises.push(API.execute_logged(API.ROUTE.WORKPLACES + obj.workplaceId + "?language_code=" + code, API.METHOD.PATCH, User.currentUser.getCredentials(), {
                name: obj.workplace[code].name,
                description: obj.workplace[code].description
            }));
            return;
        }

        if (obj.workplace[code].name !== obj.old.workplace[code].name ||
            obj.workplace[code].description !== obj.old.workplace[code].description) {
            promises.push(API.execute_logged(API.ROUTE.WORKPLACES + obj.workplaceId + "?language_code=" + code, API.METHOD.PATCH, User.currentUser.getCredentials(), {
                name: obj.workplace[code].name,
                description: obj.workplace[code].description
            }));
        }
    });

    oldTranslations.forEach(code => {
        if (!translations.includes(code)) {
            promises.push(API.execute_logged(API.ROUTE.WORKPLACES + obj.workplaceId + "?language_code=" + code, API.METHOD.DELETE, User.currentUser.getCredentials()));
        }
    });

    // Finally, send the workplace anchor modifications
    const positionChanged = obj.anchor.position.x !== obj.old.anchor.position.x ||
                            obj.anchor.position.y !== obj.old.anchor.position.y ||
                            obj.anchor.position.z !== obj.old.anchor.position.z;
    const rotationChanged = obj.anchor.rotation.x !== obj.old.anchor.rotation.x ||
                            obj.anchor.rotation.y !== obj.old.anchor.rotation.y ||
                            obj.anchor.rotation.z !== obj.old.anchor.rotation.z;
    if (positionChanged || rotationChanged) {
        promises.push(API.execute_logged(API.ROUTE.WORKPLACES + obj.workplaceId, API.METHOD.PATCH, User.currentUser.getCredentials(), {
            anchor: {
                position: {x: obj.anchor.position.x, y: obj.anchor.position.y, z: obj.anchor.position.z},
                rotation: {x: obj.anchor.rotation.x, y: obj.anchor.rotation.y, z: obj.anchor.rotation.z}
            }
        }));
    }

    Promise.all(promises).then(res => {
        log.update(Lang.CurrentLang.EDITED, Log.SUCCESS);
        setTimeout(() => {
            log.delete();
            obj.$router.push('/workplaces');
        }, 1000);
    }).catch(err => console.error("Error editing workplace", err));
}

function deleteWorkplace(obj) {
    const popup = obj.$refs['delete-popup'];
    const btn = obj.$refs['delete-btn'];
    popup.show(Lang.CurrentLang.DELETE_WORKPLACE, Lang.CurrentLang.DELETE_WORKPLACE_DESC, Lang.CurrentLang.CANCEL, Lang.CurrentLang.DELETE);
    popup.setPosition(btn.$el);
    popup.setCallback(() => {
        API.execute_logged(API.ROUTE.WORKPLACES + obj.workplaceId, API.METHOD.DELETE, User.currentUser.getCredentials()).then(res => {
            obj.$router.push('/workplaces');
        }).catch(err => console.error("Error deleting workplace " + obj.activity.data.id, err));
    });
}

let INSTANCE_COUNTER = 0;
function addArtifact(obj, art, instanceId) {
    return new Promise((resolve, reject) => {
        const instance = {...art};
        instance.instanceId = instanceId ?? INSTANCE_COUNTER;
        instance.isCreated = instanceId === undefined;
        obj.artifacts.push(instance);
        INSTANCE_COUNTER = instance.instanceId + 1;
        setArtifacts(obj.artifacts).then(resolve).catch(reject);
    });
}

function remArtifact(obj, art) {
    if (typeof(art) == 'number')
        obj.artifacts.splice(art, 1);
    else {
        const index = obj.artifacts.findIndex(a => a.instanceId == art.instanceId);
        if (index >= 0) obj.artifacts.splice(index, 1);
    }
    setArtifacts(obj.artifacts);
}

function loadWorkplace(obj, id) {
    return new Promise((resolve, reject) => {
        API.execute(API.ROUTE.WORKPLACES + obj.workplaceId + "/languages").then(langs => {
            // fetch all translations
            const translationsPromises = [];
            langs.forEach((lang, index) => {
                if (index === 0) return; // skip the base language
                translationsPromises.push(API.execute(API.ROUTE.WORKPLACES + id + "?language_code=" + lang).then(res => {
                    if (!obj.workplace[lang]) obj.workplace[lang] = {};
                    obj.workplace[lang].name = res.name;
                    obj.workplace[lang].description = res.description;
                }));
            });

            obj.translations = langs;
            setTimeout(() => {
                obj.selectedLang =
                    langs.includes(Lang.CurrentCode)
                        ? Lang.CurrentCode
                        : langs[0];
            }, 20);

            // fetch the original workplace
            API.execute(API.ROUTE.WORKPLACES + id + "?language_code=" + langs[0], API.METHOD.GET).then(res => {
                const lang = res.language;
                if (!obj.workplace[lang]) obj.workplace[lang] = {};
                obj.workplace[lang].name = res.name;
                obj.workplace[lang].description = res.description;
                obj.workplaceId = res.id;

                obj.anchor = res.anchor;
                setAnchorPosRot(res.anchor.position, res.anchor.rotation);

                obj.artifacts = [];
                const promises = [];
                // fetch all artifacts
                res.artifacts.forEach(art => {
                    promises.push(new Promise((resolve, reject) => {
                        // Get artifact languages
                        API.execute(API.ROUTE.ARTIFACTS + art.artifactID + "/languages", API.METHOD.GET).then(langs => {
                            let artifactLanguage;
                            if (langs.includes(obj.currentCode)) artifactLanguage = obj.currentCode;
                            else artifactLanguage = langs[0];
                            // fetch the artifact in our language or its base language
                            API.execute(API.ROUTE.ARTIFACTS + art.artifactID + "?language_code=" + artifactLanguage, API.METHOD.GET).then(res => {
                                res.position = art.position;
                                res.rotation = art.rotation;
                                addArtifact(obj, res, art.id).then(resolve).catch(reject);
                            }).catch(reject);
                        }).catch(reject);
                    }));
                });
                Promise.all(promises).then(ress => {
                    Promise.all(translationsPromises)
                        .then(resolve)
                        .catch(err => console.error("Error loading artifact translations", err));
                }).catch(err => console.error("Error loading workplace artifacts and translations", err));
            }).catch(err => console.error("Error loading workplace", err));
        }).catch(console.error);
    });
}

function validateInputs(obj) {
    const logZone = obj.$refs['log-zone'];
    const log = logZone.log(Lang.CurrentLang.VALIDATING, Log.INFO);

    // first check if there is at least one artifact
    if (obj.artifacts.length === 0) {
        log.update(Lang.CurrentLang.SPECIFY_ARTIFACTS, Log.WARNING);
        setTimeout(() => { log.delete(); }, 4000);
        return false;
    }

    // check if there is at least one translation
    const langs = Object.keys(obj.workplace);
    if (langs.length === 0) {
        log.update(Lang.CurrentLang.SPECIFY_TRANSLATIONS, Log.WARNING);
        setTimeout(() => { log.delete(); }, 4000);
        return false;
    }

    // check if all translations are valid
    for (let i = 0; i < langs.length; i++) {
        const lang = langs[i];
        if (!obj.workplace[lang].name || obj.workplace[lang].name.trim() === '') {
            log.update(" (" + lang + ") " + Lang.CurrentLang.SPECIFY_NAME, Log.WARNING);
            setTimeout(() => { log.delete(); }, 4000);
            return false;
        }
        if (!obj.workplace[lang].description || obj.workplace[lang].description.trim() === '') {
            log.update(" (" + lang + ") " + Lang.CurrentLang.SPECIFY_DESC, Log.WARNING);
            setTimeout(() => { log.delete(); }, 4000);
            return false;
        }
    }

    log.delete();
    return true;
}

export {
    saveWorkplace,
    editWorkplace,
    deleteWorkplace,
    addArtifact,
    remArtifact,
    loadWorkplace,
    validateInputs
}

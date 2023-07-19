import { getLuaCode } from '../../script/artifacts/BlocklyEditor';
import API from '../API';
import User from '../User';
import {
    getAnchorPosRot,
    selectPart,
    setAnchorPosRot
} from './ArtifactEditor';
import { Log } from '../Logs';

function logMessage(obj, msg, type=Log.INFO) {
    const logZone = obj.$refs['log-zone'];
    const log = logZone.log(msg, type);
    setTimeout(() => { log.delete(); }, 2000);
}

function selectProp(obj, prop) {
    if (obj.selectedProp === prop)
        obj.selectedProp = null;
    else obj.selectedProp = prop;
    obj.selectedComp = null;
    
    if (obj.selectedProp) {
        selectPart(obj.selectedProp.name);
    } else selectPart("");
}

function addTarget(obj, prop) {
    obj.targets.push(prop);
}

function removeTarget(obj, prop) {
    obj.selectedComp = null;
    prop.components = [];
    obj.targets.splice(obj.targets.indexOf(prop), 1);
}

function addComponent(obj, prop=obj.selectedProp) {
    prop.components.push({
        tag: Lang.CurrentLang.NEW_COMPONENT,
        type: { name: "" },
        properties: [],
        script: "",
        expanded: true,
        code: {
            blocks: {
                blocks: [],
                languageVersion: 0
            }
        }
    });
}

function deleteComponent(obj, index) {
    obj.selectedProp.components.splice(index, 1);
}

function initTranslation(obj) {
    if (!obj.translations) obj.translations = {};
    if (!obj.translations[obj.selectedLang])
        obj.translations[obj.selectedLang] = {name: '', description: ''};
}

function checkTranslation(obj) {
    if (!obj.translations) obj.translations = {};
    if (obj.translations[obj.selectedLang]) {
        if (!obj.translations[obj.selectedLang].name && !obj.translations[obj.selectedLang].description)
            delete obj.translations[obj.selectedLang];
    }
}

function setName(obj, str) {
    initTranslation(obj);
    obj.translations[obj.selectedLang].name = str;
    checkTranslation(obj);
}

function setDescription(obj, str) {
    initTranslation(obj);
    obj.translations[obj.selectedLang].description = str;
    checkTranslation(obj);
}

function deleteArtifact(obj) {
    const popup = obj.$refs['delete-popup'];
    const btn = obj.$refs['delete-btn'];
    popup.show(Lang.CurrentLang.DELETE_ARTIFACT, Lang.CurrentLang.DELETE_ARTIFACT_DESC, Lang.CurrentLang.CANCEL, Lang.CurrentLang.DELETE);
    popup.setPosition(btn.$el);
    popup.setCallback(() => {
        API.execute_logged(API.ROUTE.ARTIFACTS + obj.artifactId, API.METHOD.DELETE, User.currentUser.getCredentials()).then(res => {
            obj.$router.push('/artifacts');
        }).catch(err => console.error("Error deleting activity " + obj.activity.data.id, err));
    });
}

function targetsEqual(t1, t2) {
    return t1.name === t2.name && t1.artifact === t2.artifact;
}

function componentsEqual(c1, c2) {
    return c1.tag === c2.tag &&
        c1.script === c2.script &&
        JSON.stringify(c1.code) === JSON.stringify(c2.code) &&
        JSON.stringify(c1.properties) === JSON.stringify(c2.properties) &&
        c1.type === c2.type;
}

function validateInputs(obj) {
    const logZone = obj.$refs['log-zone'];
    const log = logZone.log(Lang.CurrentLang.VALIDATING, Log.INFO);

    // check if all translations are valid
    if (Object.keys(obj.translations).length === 0) {
        log.update(Lang.CurrentLang.SPECIFY_TRANSLATIONS, Log.WARNING);
        setTimeout(() => { window.onresize?.(); }, 250);
        setTimeout(() => { log.delete(); }, 4000);
        return false;
    }
    for (const code in obj.translations) {
        if (!obj.translations[code].name) {
            log.update(" (" + code + ") " + Lang.CurrentLang.SPECIFY_NAME, Log.WARNING);
            setTimeout(() => { window.onresize?.(); }, 250);
            setTimeout(() => { log.delete(); }, 4000);
            return false;
        }
        if (!obj.translations[code].description) {
            log.update(" (" + code + ") " + Lang.CurrentLang.SPECIFY_DESC, Log.WARNING);
            setTimeout(() => { window.onresize?.(); }, 250);
            setTimeout(() => { log.delete(); }, 4000);
            return false;
        }
    }

    // check if 3D model is valid
    if (!obj.model || !obj.model.file) {
        log.update(Lang.CurrentLang.SPECIFY_MODEL, Log.WARNING);
        setTimeout(() => { window.onresize?.(); }, 250);
        setTimeout(() => { log.delete(); }, 4000);
        return false;
    }

    // check if all targets are valid
    const targetNames = [];
    const compTags = [];
    for (const target of obj.targets) {
        if (!target.name) {
            log.update(Lang.CurrentLang.SPECIFY_TARGET_NAME, Log.WARNING);
            setTimeout(() => { window.onresize?.(); }, 250);
            setTimeout(() => { log.delete(); }, 4000);
            return false;
        }
        if (targetNames.includes(target.name)) {
            log.update(Lang.CurrentLang.DUPLICATE_TARGET_NAME, Log.WARNING);
            setTimeout(() => { window.onresize?.(); }, 250);
            setTimeout(() => { log.delete(); }, 4000);
            return false;
        }
        targetNames.push(target.name);

        for (const comp of target.components) {
            if (!comp.tag) {
                log.update(Lang.CurrentLang.SPECIFY_COMPONENT_TAG, Log.WARNING);
                setTimeout(() => { window.onresize?.(); }, 250);
                setTimeout(() => { log.delete(); }, 4000);
                return false;
            }
            if (compTags.includes(comp.tag)) {
                log.update(Lang.CurrentLang.DUPLICATE_COMP_TAG, Log.WARNING);
                setTimeout(() => { window.onresize?.(); }, 250);
                setTimeout(() => { log.delete(); }, 4000);
                return false;
            }
            compTags.push(comp.tag);
        }
    }

    log.delete();
    return true;
}

function editArtifact(obj) {
    // juste des fois que le mec appuye sur "edit" sans avoir désélectionné le champ tag d'un composant -_-'
    if (obj.selectedComp)
        obj.selectedComp.script = getLuaCode();
    
    if (!validateInputs(obj)) return;
    // First send the translations modifications
    const transPromises = [];
    const translations = Object.keys(obj.translations);
    const oldTranslations = Object.keys(obj.old.translations);
    translations.forEach(code => {
        if (!oldTranslations.includes(code) && obj.translations[code].name !== "") {
            console.debug("Adding translation for ", code);
            transPromises.push(API.execute_logged(API.ROUTE.ARTIFACTS + obj.artifactId + "?language_code=" + code, API.METHOD.PATCH, User.currentUser.getCredentials(), {
                name: obj.translations[code].name,
                description: obj.translations[code].description
            }));
            return;
        }

        if (obj.translations[code].name !== obj.old.translations[code].name ||
            obj.translations[code].description !== obj.old.translations[code].description) {
            console.debug("Updating translation for ", code)
            transPromises.push(API.execute_logged(API.ROUTE.ARTIFACTS + obj.artifactId + "?language_code=" + code, API.METHOD.PATCH, User.currentUser.getCredentials(), {
                name: obj.translations[code].name,
                description: obj.translations[code].description
            }));
        }
    });

    oldTranslations.forEach(code => {
        if (!translations.includes(code)) {
            console.debug("Deleting translation for ", code);
            transPromises.push(API.execute_logged(API.ROUTE.ARTIFACTS + obj.artifactId + "?language_code=" + code, API.METHOD.DELETE, User.currentUser.getCredentials()));
        }
    });

    // Next, send the targets modifications
    const targetPromises = [];
    const targets = obj.targets;
    const oldTargets = obj.old.targets;

    targets.forEach(target => {
        if (target.id === undefined) {
            console.debug("Adding target ", target.name);
            targetPromises.push(new Promise((resolve, reject) => {
                API.execute_logged(API.ROUTE.TARGETS, API.METHOD.POST, User.currentUser.getCredentials(), {
                    name: target.name,
                    artifact: obj.artifactId
                }).then(res => {
                    target.id = res.id;
                    const compPromises = [];
                    target.components.map(comp => ({...comp, type: typeof(comp.type) === 'string' ? comp.type : comp.type.name})).forEach(comp => {
                        compPromises.push(API.execute_logged(API.ROUTE.COMPONENTS, API.METHOD.POST, User.currentUser.getCredentials(), {
                            tag: comp.tag,
                            target: target.id,
                            script: comp.startScript + comp.script,
                            blocks: JSON.stringify(comp.code),
                            type: comp.type,
                            properties: comp.properties
                        }));
                    });
                    Promise.all(compPromises).then(resolve).catch(reject);
                }).catch(reject);
            }));
            return;
        }

        const oldTarget = obj.old.targets.find(el => el.id === target.id);
        if (!targetsEqual(target, oldTarget)) {
            console.debug("Updating target ", target.name);
            targetPromises.push(API.execute_logged(API.ROUTE.TARGETS + target.id, API.METHOD.PATCH, User.currentUser.getCredentials(), {
                name: target.name,
                artifact: obj.artifactId
            }));
        }

        // In the meantime, send the components modifications
        const compPromises = [];
        const oldComponents = oldTarget.components;
        const components = target.components.map(comp => ({...comp, type: typeof(comp.type) === 'string' ? comp.type : comp.type.name}));

        components.forEach(async comp => {
            if (comp.id === undefined) {
                compPromises.push(new Promise(async (resolve, reject) => {
                    console.debug("Adding component ", comp.tag);
                    await preProcessComponent(comp);
                    try {
                        await API.execute_logged(API.ROUTE.COMPONENTS, API.METHOD.POST, User.currentUser.getCredentials(), {
                            tag: comp.tag,
                            target: target.id,
                            script: comp.startScript + comp.script,
                            blocks: JSON.stringify(comp.code),
                            type: comp.type,
                            properties: comp.properties
                        });
                        resolve();
                    } catch (err) {
                        console.error(err);
                        reject(err);
                    }
                }));
                return;
            }

            const oldComp = oldComponents.find(el => el.id === comp.id);
            if (!componentsEqual(comp, oldComp)) {
                compPromises.push(new Promise(async (resolve, reject) => {
                    console.debug("Updating component ", comp.tag);
                    await preProcessComponent(comp);
                    try {
                        await API.execute_logged(API.ROUTE.COMPONENTS + comp.id, API.METHOD.PATCH, User.currentUser.getCredentials(), {
                            tag: comp.tag === oldComp.tag ? undefined : comp.tag,
                            script: (comp.startScript + comp.script) === oldComp.script ? undefined : (comp.startScript + comp.script),
                            blocks: JSON.stringify(comp.code) === JSON.stringify(oldComp.code) ? undefined : JSON.stringify(comp.code),
                            type: comp.type === oldComp.type ? undefined : comp.type,
                            properties: JSON.stringify(comp.properties) === JSON.stringify(oldComp.properties) ? undefined : comp.properties
                        });
                        resolve();
                    } catch (err) {
                        console.error(err);
                        reject(err);
                    }
                }));
            }
        });

        oldComponents.forEach(comp => {
            if (!components.map(el => el.id).includes(comp.id)) {
                console.debug("Deleting component ", comp.tag);
                compPromises.push(new Promise(async (resolve, reject) => {
                    await preProcessComponent(comp, true);
                    try {
                        await API.execute_logged(API.ROUTE.COMPONENTS + comp.id, API.METHOD.DELETE, User.currentUser.getCredentials())
                        resolve();
                    } catch (err) {
                        console.error(err);
                        reject(err);
                    }
                }));
            }
        });

        targetPromises.push(Promise.all(compPromises));
    });

    oldTargets.forEach(target => {
        if (!targets.map(el => el.id).includes(target.id)) {
            console.debug("Deleting target ", target.name);
            targetPromises.push(API.execute_logged(API.ROUTE.TARGETS + target.id, API.METHOD.DELETE, User.currentUser.getCredentials()));
        }
    });

    transPromises.push(Promise.all(targetPromises));

    // if the artifact model has changed, send the new model
    if (obj.model.modified) {
        API.execute_logged(API.ROUTE.ARTIFACTS + obj.artifactId + "/model", API.METHOD.PUT, User.currentUser.getCredentials(), obj.model.file, API.TYPE.FILE).then(res => {
            // logMessage("Artefact créé avec succès");
            resolve();
        }).catch(err => {
            // logMessage("Erreur lors de l'ajout du modèle");
            reject(err);
        });
    }

    // Finally, send the anchor modifications
    const anchor = getAnchorPosRot();
    if (anchor.position.x !== obj.old.anchor.position.x ||
        anchor.position.y !== obj.old.anchor.position.y ||
        anchor.position.z !== obj.old.anchor.position.z ||
        anchor.rotation.x !== obj.old.anchor.rotation.x ||
        anchor.rotation.y !== obj.old.anchor.rotation.y ||
        anchor.rotation.z !== obj.old.anchor.rotation.z) {
        console.debug("Updating anchor");
        transPromises.push(API.execute_logged(API.ROUTE.ARTIFACTS + obj.artifactId, API.METHOD.PATCH, User.currentUser.getCredentials(), {
            anchor: anchor
        }));
    }

    return Promise.all(transPromises);
}

function saveArtifact(obj) {
    return new Promise((resolve, reject) => {
        if (!validateInputs(obj)) return reject("Invalid inputs");
        obj.anchor = getAnchorPosRot();

        // first, create the artifact
        API.execute_logged(API.ROUTE.ARTIFACTS, API.METHOD.POST, User.currentUser.getCredentials(), {
            name: obj.translations[obj.selectedLang].name,
            description: obj.translations[obj.selectedLang].description,
            language: obj.selectedLang,
            anchor: obj.anchor,
        }).then(res => {
            const id = res.id;

            // get the artifact translations
            const promisesTranslation = [];
            for (let lcode in obj.translations) {
                if (lcode === obj.selectedLang) continue;
                promisesTranslation.push(API.execute_logged(API.ROUTE.ARTIFACTS + id + "?language_code=" + lcode, API.METHOD.PATCH, User.currentUser.getCredentials(), {
                    name: obj.translations[lcode].name,
                    description: obj.translations[lcode].description
                }));
            }

            // then, send all the translations
            Promise.all(promisesTranslation).then(ress => {

                const promisesTargets = [];
                const promisesComponents = [];

                // get all the targets
                for (let target of obj.targets) {
                    promisesTargets.push(new Promise((resolve, reject) => {
                        API.execute_logged(API.ROUTE.TARGETS, API.METHOD.POST, User.currentUser.getCredentials(), {
                            name: target.name,
                            artifact: id,
                        }).then(res => {
                            const targetID = res.id;
                            // if we find components in this target, get them too
                            target.components.map(comp => ({...comp, type: comp.type.name})).forEach(comp => {
                                promisesComponents.push(new Promise( async (resolve, reject) => {
                                    if (comp.type === 'Sound') {
                                        for (const prop of comp.properties) {
                                            if (prop.name === 'sound') {
                                                const file = prop.file;
                                                try {
                                                    const res = await API.execute_logged(API.ROUTE.RESSOURCES, API.METHOD.POST, User.currentUser.getCredentials(), file, API.TYPE.FILE, [], 'file')
                                                    prop.value = res.id;
                                                } catch (err) {
                                                    console.error(err);
                                                    reject(err);
                                                    return;
                                                }
                                                generateComponentPropertiesScript(comp);
                                            }
                                        }
                                    }
                                    
                                    try {
                                        await API.execute_logged(API.ROUTE.COMPONENTS, API.METHOD.POST, User.currentUser.getCredentials(), {
                                            tag: comp.tag,
                                            target: targetID,
                                            script: comp.startScript + comp.script,
                                            blocks: JSON.stringify(comp.code),
                                            type: comp.type,
                                            properties: comp.properties,
                                        });
                                        resolve();
                                    } catch (err) {
                                        console.error(err);
                                        reject(err);
                                    }
                                }));
                            });
                            resolve(res);
                        }).catch(reject);
                    }));
                }

                // next, send all the targets
                Promise.all(promisesTargets).then(ress => {

                    // next, send all the components
                    Promise.all(promisesComponents).then(ress => {

                        // finally, send the artifact model
                        API.execute_logged(API.ROUTE.ARTIFACTS + id + "/model", API.METHOD.PUT, User.currentUser.getCredentials(), obj.model.file, API.TYPE.FILE).then(res => {
                            // logMessage("Artefact créé avec succès");
                            resolve();
                        }).catch(err => {
                            logMessage(obj, "Erreur lors de l'ajout du modèle", Log.ERROR);
                            reject(err);
                        });

                    }).catch(err => {
                        logMessage(obj, "Erreur lors de l'ajout des composants", Log.ERROR);
                        reject(err);
                    });

                }).catch(err => {
                    logMessage(obj, "Erreur lors de l'ajout des cibles", Log.ERROR);
                    reject(err);
                });

            }).catch(err => {
                logMessage(obj, "Erreur lors de l'ajout des traductions", Log.ERROR);
                reject(err);
            });

        }).catch(err => {
            // logMessage("Erreur lors de l'ajout de l'artefact");
            reject(err);
        });
    });
}

function getCode(obj) {
    if (typeof(obj) !== 'object') return obj;

    if (window.location.pathname.split("/").pop() !== 'view') return obj;

    Object.keys(obj).forEach(key => {
        obj[key] = getCode(obj[key]);
    });
    if (obj.id !== undefined) {
        obj.movable = false;
        obj.deletable = false;
    }
    return obj;
}

function loadArtifact(obj) {
    return new Promise((resolve, reject) => {
        // get the 3D Model
        API.execute(API.ROUTE.ARTIFACTS + obj.artifactId + "/model").then(res => {
            obj.model.modified = false;
            obj.model.data = res;
            if (!obj.model.file) obj.model.file = {};
            obj.model.file.name = "artifact.glb";
            const modelLoading = obj.load3DModel();

            const translationsPromises = [];
            API.execute(API.ROUTE.ARTIFACTS + obj.artifactId + "/languages").then(langs => {
                langs.forEach((lang, index) => {
                    translationsPromises.push(API.execute(API.ROUTE.ARTIFACTS + obj.artifactId + "?language_code=" + lang).then(res => {
                        if (!Object.keys(obj.translations).includes(lang))
                            obj.translations[lang] = {};
                        obj.translations[lang].name = res.name;
                        obj.translations[lang].description = res.description;
                        if (index !== 0) return;

                        modelLoading.then(model => {
                            obj.anchor = res.anchor;
                            setAnchorPosRot(res.anchor.position, res.anchor.rotation);

                            const targetsPromises = [];
                            res.targets.forEach(targetId => {
                                // get the targets informations
                                targetsPromises.push(new Promise((resolve, reject) => {
                                    API.execute(API.ROUTE.TARGETS + targetId).then(target => {
                                        // add target in targets list
                                        const prop = obj.props.find(el => el.name === target.name)
                                        if (!prop) {
                                            console.error("Target "+target.name+" not found in props list");
                                            resolve();
                                            return;
                                        }
                                        prop.id = target.id;
                                        addTarget(obj, prop);
                                        // get the target's components
                                        const componentsPromises = [];
                                        target.components.forEach(compId => {
                                            componentsPromises.push(new Promise((resolve, reject) => {
                                                API.execute(API.ROUTE.COMPONENTS + compId).then(comp => {
                                                    if (comp.type === 'Sound') {
                                                        for (const prop of comp.properties) {
                                                            if (prop.name === 'sound' && typeof(prop.value) === 'number') {
                                                                API.execute_logged(API.ROUTE.RESSOURCES + prop.value, API.METHOD.GET, User.currentUser.getCredentials()).then(res => {
                                                                    prop.id = prop.value;
                                                                    prop.value = res.name;
                                                                }).catch(err => {
                                                                    console.error(err);
                                                                    reject(err);
                                                                });
                                                            }
                                                        }
                                                    }

                                                    // add components to target
                                                    const scriptCode = getCode(JSON.parse(comp.blocks));
                                                    prop.components.push({
                                                        id: comp.id,
                                                        tag: comp.tag,
                                                        type: comp.type,
                                                        properties: comp.properties,
                                                        script: comp.script,
                                                        expanded: false,
                                                        code: scriptCode
                                                    });
                                                    resolve();
                                                }).catch(console.error);
                                            }));
                                        });
                                        Promise.all(componentsPromises).then(() => { resolve(); }).catch(console.error);
                                    });
                                }));
                            });
                            Promise.all(targetsPromises).then(() => {
                                Promise.all(translationsPromises).then(() => {
                                    resolve();
                                }).catch(console.error)
                            }).catch(console.error)
                        }).catch(console.error);
                    }));
                });
            }).catch(console.error);
        }).catch(err => {
            console.error(err);
            reject(err);
        });
    })
}

async function preProcessComponent(comp, deleteComp=false) {
    if (comp.type === 'Sound' || comp.type?.name === 'Sound') {
        for (const prop of comp.properties) {
            if (prop.name === 'sound') {
                if (prop.id) prop.value = prop.id;
                if (prop.id !== undefined && prop.file !== undefined && prop.value) {
                    try {
                        await API.execute_logged(API.ROUTE.RESSOURCES + prop.id, API.METHOD.DELETE, User.currentUser.getCredentials());
                    } catch (err) {
                        console.error(err);
                        // error (should reject ?)
                        return;
                    }
                }
                if (deleteComp || !prop.file || !prop.value) return;
                try {
                    const res = await API.execute_logged(API.ROUTE.RESSOURCES, API.METHOD.POST, User.currentUser.getCredentials(), prop.file, API.TYPE.FILE, [], 'file');
                    prop.value = res.id;
                } catch (err) {
                    console.error(err);
                    // error (should reject ?)
                    return;
                }
                generateComponentPropertiesScript(comp);
            }
        }
    }
}

function generateComponentPropertiesScript(comp) {
    let script = `_G["${comp.tag}"].events.Start = function()\n`;
    for (const prop of comp.properties) {
        const value = (prop.value === undefined)? prop.default : prop.value;
        const typedValue = typeof(value) === 'string' ? `"${value}"` : value;
        script += `    _G["${comp.tag}"].interactable.${prop.method}(${typedValue})\n`;
    }
    script += "end\n";
    // eslint-disable-next-line vue/no-mutating-props
    comp.startScript = script;
}

export {
    selectProp,
    addTarget,
    removeTarget,
    addComponent,
    deleteComponent,
    initTranslation,
    setName,
    setDescription,
    deleteArtifact,
    targetsEqual,
    componentsEqual,
    editArtifact,
    saveArtifact,
    loadArtifact,
    generateComponentPropertiesScript
};

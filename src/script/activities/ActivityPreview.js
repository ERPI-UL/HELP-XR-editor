import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { TTFLoader } from "three/examples/jsm/loaders/TTFLoader";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import API from "../API";

/** @type {Label[]} */
let labels = [];
/** @type {THREE.Scene} */
let scene = null
/** @type {THREE.Camera} */
let camera = null
/** @type {THREE.Renderer} */
let renderer = null
/** @type {{id:number,model:THREE.Group}[]} */
let artifacts = [];
/** @type {OrbitControls} */
let orbitControls = null;
/** @type {TransformControls} */
let transformControls = null;
let targetPos = {x: 0, y: 0, z: 0};

let isRendering = false;
const loaderGLTF = new GLTFLoader();
const loaderTTF = new TTFLoader();
const loaderFont = new FontLoader();


let __font = null;
/**
 * Returns the font used for 3D text rendering (if not loaded, load it first)
 * @returns The font user for text rendering
 */
function getFont() {
    return new Promise((resolve, reject) => {
        if (__font != null) resolve(__font);
        const FONT_URL = window.location.origin + "/fonts/Roboto-Regular.ttf";
        loaderTTF.load(FONT_URL, f => {
            const font = loaderFont.parse(f);
            __font = font;
            resolve(font)
        });
    });
}

/**
 * Checks for canvas setup, three.js setup and starts rendering if not started
 */
function checkForCanvasSetup(canvas=document.getElementById("DDD-view")) {
    return new Promise((resolve, reject) => {
        /**@type {HTMLCanvasElement} */
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width; canvas.height = rect.height;
        setupThree(canvas);
        resolve();
    })
}

let timeoutID = -1;
/**
 * Resize the given canvas to the new 3D view
 * @param {HTMLCanvasElement} canvas canvas used for three.js rendering
 * @param {THREE.Camera} camera Three js camera used for rendering
 * @param {THREE.Renderer} renderer Three js renderer used for rendering
 */
function resizeCanvas(canvas, camera, renderer) {
    // premier resize pour suivre le changement de taille des sections
    const width = canvas.clientWidth; const height = canvas.clientHeight;
    canvas.width = width; canvas.height = height;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setViewport(0, 0, width, height);

    if (timeoutID > 0) clearTimeout(timeoutID);
    
    // deuxieme resize en cas de changement de ratio de la fenetre (pour etre sur d'etre au bon ratio)
    timeoutID = setTimeout(() => {
        timeoutID = -1;
        const width = canvas.clientWidth; const height = canvas.clientHeight;
        canvas.width = width; canvas.height = height;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setViewport(0, 0, width, height);
    }, 200);
}

/**
 * Setups the three.js scene, renderer, camera, controls, etc.
 * @param {HTMLCanvasElement} canvas canvas used for three.js rendering
 */
function setupThree(canvas) {
    const thereWasAScene = scene != null;
    if (thereWasAScene) {
        setArtifacts([]);
    }
    // create the scene, camera and renderer
    scene = scene ?? new THREE.Scene();
    camera = camera ?? new THREE.PerspectiveCamera( 75, canvas.width / canvas.height, 0.01, 1000 );
    renderer = new THREE.WebGLRenderer({canvas: canvas, alpha: true, antialias: true});

    // enable shadows for the renderer
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 2.5;
    // set the resize callback and resize the canvas
    const oldResize = window.onresize;
    window.onresize = ev => { oldResize?.(ev); resizeCanvas(canvas, camera, renderer); };
    window.onresize();

    if (!thereWasAScene) {
        // add an ambient light (to avoid black shadows)
        scene.add(new THREE.AmbientLight(0xffffff, 0.5));
        { // add the first light
            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.castShadow = true;
            light.shadow.bias = -0.0001;
            light.shadow.mapSize.width = 1024;
            light.shadow.mapSize.height = 1024;
            light.position.set(1, 2, 2);
            scene.add(light);
        }
        { // add the second light
            const light = new THREE.DirectionalLight(0xffffff, 0.5);
            light.castShadow = true;
            light.shadow.bias = -0.0001;
            light.shadow.mapSize.width = 1024;
            light.shadow.mapSize.height = 1024;
            light.position.set(2, 2, -1);
            scene.add(light);
        }
        // set the scene's floor (3D platform object)
        loaderGLTF.loadAsync('/platform.glb').then(obj => {
            obj.scene.traverse(child => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            scene.add(obj.scene);
        }).catch(err => {console.error(err);})
    }

    // set the default camera position and set the orbit controls
    camera.position.set(2, 2, 2);
    orbitControls = new OrbitControls( camera, renderer.domElement );
    orbitControls.update();

    // init the transform controls (and attach the edited label to it if needed)
    transformControls = new TransformControls(camera, renderer.domElement);
    transformControls.detach();
    if (labels.length > 0) transformControls.attach(labels[0].model);
    transformControls.addEventListener('mouseDown', function () {
        orbitControls.enabled = false; // to avoid rotating the camera when moving the object
    });
    transformControls.addEventListener('mouseUp', function () {
        orbitControls.enabled = true; // to enable camera rotation when we are done moving the object
    });
    scene.add(transformControls);
    getPreviewControls();
}

/**
 * Enables three.js rendering (called when the canvas is displayed)
 */
function startRendering() {
    if (isRendering) return;
    isRendering = true;
    renderer.setAnimationLoop(gameloop);
}

/**
 * Disables three.js rendering (called when the canvas is hidden)
 */
function stopRendering() {
    if (!isRendering) return;
    isRendering = false;
    renderer.setAnimationLoop(null);
}

let lastTime = 0;
let camRotTarget = new THREE.Group();
const gameloop = (time) => {
    let delta = (time - lastTime) / 1000;
    lastTime = time;
    if (artifacts.needsUpdate) {
        updateArtifacts();
        artifacts.needsUpdate = false;
    }

    if (delta > 0.1) delta = 0.1;
    
    camRotTarget.position.set(
        previewControls?.position.x ?? 0,
        previewControls?.position.y ?? 0,
        previewControls?.position.z ?? 0,
    );
    camRotTarget.lookAt(camera.position);
    if (previewControls !== null) {
        previewControls.rotation.set(
            previewControls.rotation.x + (camRotTarget.rotation.x - previewControls.rotation.x) * delta * 4,
            previewControls.rotation.y + (camRotTarget.rotation.y - previewControls.rotation.y) * delta * 4,
            previewControls.rotation.z + (camRotTarget.rotation.z - previewControls.rotation.z) * delta * 4,
        );
        previewControls.position.set(
            previewControls.position.x + (targetPos.x - previewControls.position.x) * delta * 4,
            previewControls.position.y + (targetPos.y - previewControls.position.y) * delta * 4,
            previewControls.position.z + (targetPos.z - previewControls.position.z) * delta * 4,
        );
    }

    orbitControls.update();
    renderer.render(scene, camera);
};

function getArtifact(id) {
    return new Promise((resolve, reject) => {
        // we could use the API url directly in the loader,
        // but just to be able to see if the status code is correct,
        // we do a fetch in the url and recreate a blob url for the loader after
        fetch(API.API_URL + API.ROUTE.ARTIFACTS + id + "/model").then(res => {
            if (res.status == 200) {
                // when the model is received, get the blob object
                res.blob().then(data => {
                    // generate a local url to use the blob object
                    let url = URL.createObjectURL(data);
                    // load the blob object as a GLTF model
                    loaderGLTF.loadAsync(url).then(obj => {
                        obj.scene.traverse(child => {
                            // for each mesh child, enable shadows
                            // and if the material is glass, make it transparent
                            // FIXME
                            if (child.isMesh) {
                                if (child.material.name.includes("vitre")) {
                                    child.material.transparent = true;
                                    child.material.opacity = 0.4;
                                }
                                child.castShadow = true;
                                child.receiveShadow = true;
                            }
                        });
                        resolve(obj.scene);
                    }).catch(err => {console.error(err);})
                })
            } else { // error
                console.error(res);
            }
        }).catch(err => {console.error(err);});
    })
}

function updateArtifacts() {
    if (artifacts.length === 0) return;

    // position each artifact in circle
    if (artifacts.length === 1 && artifacts[0]?.model) {
        artifacts[0].model.position.set(0, 0, 0);
        artifacts[0].model.rotation.set(0, 0, 0);
    } else {
        const radius = 2; // radius (meters) of artifacts circle
        const angleShift = (Math.PI * 2) / artifacts.length; // delta angle (radians) between each machines

        let angle = 0; // angle counter for machine angle and position
        artifacts.forEach(art => {
            if (!art.model) return;
            art.model.position.set(
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
            );
            art.model.rotation.set(0, angle - Math.PI/2, 0);
            angle += angleShift;
        });
    }

    if (currentArtifact && currentAction && currentArtifact.model && currentAction.position) {
        currentArtifact.model.updateMatrixWorld();
        targetPos = currentArtifact.model.localToWorld(new THREE.Vector3().copy(currentAction.position));
    } // else console.error("Error something is null : ", currentArtifact, currentAction);
}

function setArtifacts(list) {
    return new Promise((resolve, reject) => {
        const listIds = list.map(el => el.id);
        const artsIds = artifacts.map(el => el.id);

        // find the artifacts to add and remove
        const toAdd = listIds.filter(el => !artsIds.includes(el));
        const toRemove = artsIds.filter(el => !listIds.includes(el));

        const promises = [];

        // remove the needed artifacts
        toRemove.forEach(id => {
            const index = artifacts.findIndex(el => el.id === id);
            if (index < 0) return;

            scene.remove(artifacts[index].model);
            artifacts.splice(index, 1)
            artifacts.needsUpdate = true; // indicate changes
        });

        // add the needed artifacts
        toAdd.forEach(id => {
            const art = {id};
            artifacts.push(art);
            // fetch the machine model for 3D view
            promises.push(new Promise((resolve, reject) => {
                getArtifact(id).then(model => {
                    art.model = model;
                    scene.add(model);
                    artifacts.needsUpdate = true; // indicate changes
                    resolve();
                });
            }));
        });

        Promise.all(promises).then(resolve).catch(reject);
    })
}

/**
 * Displays or hides the move controls of the editor
 * @returns {number} if the controls are displayed or not
 */
function toggleTransformEnabled() {
    if (transformControls.object == null && labels.length > 0)
        transformControls.attach(labels[0].model);
    else transformControls.detach();
    return transformControls.object != null;
}

/**
 * Resets the camera's transform to focus the machine at the scene's center
 */
function resetCameraTransform() {
    camera.position.set(2, 2, 2);
    camera.lookAt(0, 0, 0);
    orbitControls.reset();
}

let previewControls = null;
let previewControlsLoading = false;
let previewControlsPromise = null;
function getPreviewControls() {
    const promise = new Promise((resolve, reject) => {
        if (previewControlsLoading) {
            previewControlsPromise.then(resolve)
            return;
        }

        if (previewControls != null) {
            if (previewControls._added_to_scene === false) {
                scene.add(previewControls);
                previewControls._added_to_scene = true;
            }
            resolve(previewControls);
        } else {
            previewControlsLoading = true;
            loaderGLTF.loadAsync('/previewControls.glb').then(obj => {
                previewControls = obj.scene;
                scene.add(previewControls);
                previewControls._added_to_scene = true;
                resolve(previewControls);
                previewControlsLoading = false;
            }).catch(err => {console.error(err);})
        }
    });
    previewControlsPromise = promise;
    return promise;
}

function startPreview() {
    getPreviewControls();
}

function stopPreview() {
    // nothing to do here, it's just in case we need to do something
}

function setPreviewAction(action) {
    setSelectedAction(action);
}

let currentAction = null;
let currentArtifact = null;
function setSelectedAction(action) {
    if (!action) return;
    targetPos = new THREE.Vector3();
    currentAction = action;
    currentArtifact = artifacts.find(el => el.id === action.artifact?.id);
    if (!currentArtifact) return; // no artifact found (not a problem for creation, but still ...)

    getPreviewControls().then(controls => {
        targetPos = currentArtifact.model.localToWorld(new THREE.Vector3().copy(action.position));
        if (window.location.pathname.split("/").pop() !== 'view') { // if not in view mode
            if (transformControls.object !== controls) {
                controls.position.copy(targetPos);
                transformControls.attach(controls);
            }
        }
    });
}

function setOnTransformChange(callback) {
    transformControls.addEventListener('change', ev => {
        if (transformControls.object == null) return;
        if (currentAction == null) return console.error("No action selected");
        if (currentArtifact == null) return console.error("No artifact selected");
        targetPos = transformControls.object.position;
        const finalPos = currentArtifact.model.worldToLocal(targetPos.clone());
        callback(finalPos);
    });
}

export {
    checkForCanvasSetup,
    stopRendering,
    startRendering,
    setArtifacts,
    toggleTransformEnabled,
    resetCameraTransform,
    startPreview,
    stopPreview,
    setPreviewAction,
    setSelectedAction,
    setOnTransformChange
};
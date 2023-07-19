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

/**@type {THREE.Mesh} */
let qrCode = null;

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
        const rect = canvas.parentElement.getBoundingClientRect();
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

    if (!qrCode) createQRCode();
}

function createQRCode() {
    return new Promise((resolve, reject) => {
        // create the QR Code object
        qrCode = new THREE.Group();
        const front = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 0.08), new THREE.MeshBasicMaterial({color: 0xffffff}));
        const back = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 0.08), new THREE.MeshBasicMaterial({color: 0xffffff}));
        back.position.set(0, 0.0, 0)
        back.setRotationFromEuler(new THREE.Euler(0, Math.PI, 0));
        qrCode.add(front);
        qrCode.add(back);
        qrCode.name = 'anchor';
        qrCode.position.set(0, 0.2, 0);
        qrCode._added_to_scene = false;

        // fetch the qrcode image and set it as the qrCode texture
        fetch("/qrcode.png").then(res => res.blob()).then(blob => {
            const url = URL.createObjectURL(blob);
            const loader = new THREE.TextureLoader();
            loader.load(url, texture => {
                front.material.map = texture;
                front.material.needsUpdate = true;
                resolve();
            });
        });
    });
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

const gameloop = (time) => {
    if (boundingBox) boundingBox.update();
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
                            // FIXIT
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
                reject(res);
            }
        }).catch(err => {console.error(err);});
    })
}

function setArtifacts(list) {
    return new Promise((resolve, reject) => {
        const listIds = list.map(el => el.instanceId);
        const artsIds = artifacts.map(el => el.instanceId);

        // find the artifacts to add and remove
        const toAdd = listIds.filter(el => !artsIds.includes(el));
        const toRemove = artsIds.filter(el => !listIds.includes(el));

        // remove the needed artifacts
        toRemove.forEach(id => {
            const index = artifacts.findIndex(el => el.instanceId === id);
            if (index < 0) return;

            artifacts[index].model?.removeFromParent();
            artifacts.splice(index, 1)
        });

        // add the needed artifacts
        toAdd.forEach(id => {
            const art = list.find(el => el.instanceId === id);
            artifacts.push(art);
            // fetch the machine model for 3D view
            getArtifact(art.id).then(model => {
                art.model = model;
                art.model.instanceId = art.instanceId;
                if (art.position) model.position.set(art.position.x, art.position.y, art.position.z);
                if (art.rotation) model.rotation.set(art.rotation.x, art.rotation.y, art.rotation.z);
                scene.add(model);
                resolve(model);
            }).catch(err => {
                resolve(null);
                console.error(err);
            })
        });
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

function getObjectModel(obj) {
    while (obj.parent != null && obj.parent.type !== "Scene") {
        obj = obj.parent;
    }
    if (obj.type !== "Group") return null;
    else return artifacts.find(el => el.instanceId === obj.instanceId);
}

function raycastArtifact(x, y) {
    return new Promise((resolve, reject) => {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        mouse.x = (x / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = - (y / renderer.domElement.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children);

        if (intersects.length > 0) {
            for (let i = 0; i < intersects.length; i++) {
                const el = intersects[i];
                const model = getObjectModel(el.object);
                if (model != null) {
                    resolve(model);
                    return;
                }
            }
            resolve(null);
        } else resolve(null);
    });
}

let selectedArtifact = null;
let boundingBox = null;
function selectArtifact(x, y) {
    return new Promise((resolve, reject) => {
        raycastArtifact(x, y).then(art => {
            if (boundingBox != null) scene.remove(boundingBox);
            transformControls.detach();

            selectedArtifact = art;
            if (selectedArtifact == null) {
                deselectArtifact();
                resolve(null);
                return;
            }

            boundingBox = new THREE.BoxHelper(art.model, 0xffff00);
            if (window.location.pathname.split("/").pop() !== 'view') // not in view mode
                transformControls.attach(art.model);
            scene.add(boundingBox);
            resolve(art);
        });
    });
}

function deselectArtifact() {
    if (boundingBox != null) scene.remove(boundingBox);
    selectedArtifact = null;
    boundingBox = null;
    transformControls.detach();
}

function setTransformMode(mode) {
    transformControls.setMode(mode);
}

function getAnchorPosRot() {
    if (!qrCode) return {position: {x: 0, y: 0, z: 0}, rotation: {x: 0, y: 0, z: 0}};
    return {
        position: {
            x: qrCode.position.x,
            y: qrCode.position.y,
            z: qrCode.position.z
        },
        rotation: {
            x: qrCode.rotation.x,
            y: qrCode.rotation.y,
            z: qrCode.rotation.z
        }
    };
}

function setAnchorPosRot(pos, rot) {
    if (!qrCode) createQRCode();
    if (!qrCode._added_to_scene) {
        scene.add(qrCode);
        qrCode._added_to_scene = true;
    }
    qrCode.position.set(pos.x ?? qrCode.position.x, pos.y ?? qrCode.position.y, pos.z ?? qrCode.position.z);
    qrCode.rotation.set(rot.x ?? qrCode.rotation.x, rot.y ?? qrCode.rotation.y, rot.z ?? qrCode.rotation.z);
}

function enableAnchorControls(state) {
    if (state) {
        if (!qrCode._added_to_scene) {
            scene.add(qrCode);
            qrCode._added_to_scene = true;
        }
        if (window.location.pathname.split("/").pop() !== 'view') // not in view mode
            transformControls.attach(qrCode);
    } else {
        transformControls.detach();
    }
}

export {
    checkForCanvasSetup,
    stopRendering,
    startRendering,
    setArtifacts,
    toggleTransformEnabled,
    resetCameraTransform,
    setTransformMode,
    selectArtifact,
    deselectArtifact,
    getAnchorPosRot,
    setAnchorPosRot,
    enableAnchorControls
};
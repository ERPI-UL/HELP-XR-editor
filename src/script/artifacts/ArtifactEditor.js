import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import API from "../API";

/**@type {Label[]} */
let labels = [];
/**@type {THREE.Scene} */
let scene = null
/**@type {THREE.Camera} */
let camera = null
/**@type {THREE.Renderer} */
let renderer = null
/**@type {THREE.Mesh} */
let machineModel = null;
/**@type {OrbitControls} */
let orbitControls = null;
/**@type {transformControls} */
let transformControls = null;

/**@type {THREE.Mesh} */
let qrCode = null;
let qrImage = null;

const selectionMaterial = new THREE.MeshStandardMaterial({color: 0x00ff00});

// const pointer = new THREE.Vector2(0.5, 0.5);
let isRendering = false;
const loaderGLTF = new GLTFLoader();
/**
 * Checks for canvas setup, three.js setup and starts rendering if not started
 */
function checkForCanvasSetup(el) {
    /**@type {HTMLCanvasElement} */
    const canvas = el ?? document.getElementById("3D-view");
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width; canvas.height = rect.height;
    setupThree(canvas);
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
    if (thereWasAScene && machineModel != null) {
        scene.remove(machineModel);
        machineModel = null;
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

        // if the machine is already selected before the scene is loaded, add it to the scene
        if (machineModel != null)
            scene.add(machineModel);
            
        if (!qrCode) createQRCode();
    }

    // set the default camera position and set the orbit controls
    camera.position.set(2, 2, 2);
    orbitControls = new OrbitControls( camera, renderer.domElement );
    orbitControls.update();

    // init the transform controls
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

let lastTime = 0;
/**
 * Main gameloop, updates the labels, the controls, and renders the scene
 * @param {number} time absolute time since three.js initialization (in ms)
 */
const gameloop = (time) => {
    const dt = time/1000 - lastTime/1000;
    lastTime = time;
    camera.lookAt(0, 0.5, 0);

    selectionMaterial.color.setHex(time % 1000 < 500 ? 0x68e00b : 0x00ed5b);

    orbitControls.update();
    labels.forEach(l => l.update(dt));
    renderer.render(scene, camera);
};

function loadMachineFromModel(obj) {
    machineModel = obj.scene;
    machineModel.traverse(child => {
        // for each mesh child, enable shadows
        // and if the material is glass, make it transparent
        if (child.isMesh) {
            if (child.material.name.includes("vitre")) {
                child.material.transparent = true;
                child.material.opacity = 0.4;
            }
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    // add the model to the scene (is the scene exists, else it will be added when the scene is loaded)
    if (scene != null)
        scene.add(machineModel);
}

function loadMachineFromID(id) {
    // we could use the API url directly in the loader,
    // but just to be able to see if the status code is correct,
    // we do a fetch in the url and recreate a blob url for the loader after
    fetch(API.API_URL+`/activities/artifacts/${machineID}/model`).then(res => {
        if (res.status == 200) {
            // when the model is received, get the blob object
            res.blob().then(data => {
                // generate a local url to use the blob object
                let url = URL.createObjectURL(data);
                // load the blob object as a GLTF model
                loaderGLTF.loadAsync(url)
                    .then(loadMachineFromModel)
                    .catch(err => {console.error(err);})
            })
        } else { // error
            console.error(res);
        }
    }).catch(err => {console.error(err);});
}

/**
 * Sets the machine displayed in the scene (from the machine's ID).
 * Makes an API call to retreive the machine's model, and then displays it
 * @param {number|object} machine ID of the machine to show or the machine object
 */
function set3DMachineModel(machine) {
    if (machineModel != null)
        scene.remove(machineModel);

    if (typeof(machine) === 'object') {
        loadMachineFromModel(machine)
    } else {
        loadMachineFromID(machine);
    }
}

/**
 * Resets the camera's transform to focus the machine at the scene's center
 */
function resetCameraTransform() {
    camera.position.set(2, 2, 2);
    camera.lookAt(0, 0, 0);
    orbitControls.reset();
}

function makeHighlight(obj, name, target, shouldFocus=true) {
    const isTarget = name === target;
    const fun = isTarget ?
        (ob) => {
            if (ob._mat_selected) return;

            ob._material_old = ob.material;
            ob.material = selectionMaterial;
            ob._mat_selected = true;
        } :
        (ob) => {
            if (!ob._mat_selected) return;

            if (ob._material_old != null)
                ob.material = ob._material_old;
            ob._mat_selected = false;
        };

    if (isTarget && shouldFocus) {
        // focus the camera on the target
        const box = new THREE.Box3().setFromObject(obj);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const distance = Math.max(size.x, size.y, size.z, 0.1);
        const direction = camera.position.clone().sub(center).normalize().multiplyScalar(distance);
        camera.position.copy(center).add(direction);
        orbitControls.target.copy(center);
        orbitControls.update();
    }

    fun(obj);
    if (obj.children != null)
        obj.children.forEach(child => makeHighlight(child, isTarget? name: child.name, target, (!isTarget && shouldFocus)));
}

function selectPart(name) {
    machineModel.children.forEach(child => {
        makeHighlight(child, child.name, name);
    });
}

function enableAnchorControls(state) {
    if (state) {
        if (!qrCode._added_to_scene) {
            scene.add(qrCode);
            qrCode._added_to_scene = true;
        }
        transformControls.attach(qrCode);
    } else {
        transformControls.detach();
    }
}

function getAnchorPosRot() {
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

function setTransformMode(mode) {
    transformControls.setMode(mode);
}

export {
    checkForCanvasSetup,
    stopRendering,
    startRendering,
    set3DMachineModel,
    resetCameraTransform,
    selectPart,
    enableAnchorControls,
    getAnchorPosRot,
    setAnchorPosRot,
    setTransformMode
};

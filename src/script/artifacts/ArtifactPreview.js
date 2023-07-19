import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import API from "../API";

/**
 * Checks for canvas setup, three.js setup and starts rendering if not started
 */
function checkForCanvasSetup(canvas=document.getElementById("DDD-view")) {
    return new Promise((resolve, reject) => {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width; canvas.height = rect.height;
        const context = setupThree(canvas);
        resolve(context);
    })
}

let timeoutID = -1;
/**
 * Resize the given canvas to the new 3D view
 * @param {HTMLCanvasElement} canvas canvas used for three.js rendering
 * @param {THREE.Camera} camera Three js camera used for rendering
 * @param {THREE.Renderer} renderer Three js renderer used for rendering
 */
function resizeCanvas(context, canvas) {
    // premier resize pour suivre le changement de taille des sections
    const width = canvas.clientWidth; const height = canvas.clientHeight;
    canvas.width = width; canvas.height = height;
    context.camera.aspect = width / height;
    context.camera.updateProjectionMatrix();
    context.renderer.setViewport(0, 0, width, height);

    if (timeoutID > 0) clearTimeout(timeoutID);
    
    // deuxieme resize en cas de changement de ratio de la fenetre (pour etre sur d'etre au bon ratio)
    timeoutID = setTimeout(() => {
        timeoutID = -1;
        const width = canvas.clientWidth; const height = canvas.clientHeight;
        canvas.width = width; canvas.height = height;
        context.camera.aspect = width / height;
        context.camera.updateProjectionMatrix();
        context.renderer.setViewport(0, 0, width, height);
    }, 200);
}

/**
 * Setups the three.js scene, renderer, camera, controls, etc.
 * @param {HTMLCanvasElement} canvas canvas used for three.js rendering
 */
function setupThree(canvas) {
    // create the scene, camera and renderer
    const context = {
        scene: new THREE.Scene(),
        camera: new THREE.PerspectiveCamera( 75, canvas.width / canvas.height, 0.1, 1000 ),
        renderer: new THREE.WebGLRenderer({canvas: canvas, alpha: true, antialias: true}),
        box: {x: 1, y: 1, z: 1},
        distance: 1,
        canvas
    };

    context.renderer.toneMapping = THREE.ReinhardToneMapping;
    context.renderer.toneMappingExposure = 2.5;
    // set the resize callback and resize the canvas
    const oldResize = window.onresize;
    window.onresize = ev => { oldResize?.(ev); resizeCanvas(context, canvas); };
    window.onresize();

    // add an ambient light (to avoid black shadows)
    context.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    { // add the first light
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 2, 2);
        context.scene.add(light);
    }

    // if the machine is already selected before the scene is loaded, add it to the scene
    if (context.artifactModel != null)
        context.scene.add(context.artifactModel);

    // set the default camera position and set the orbit controls
    context.camera.position.set(2, 2, 2);
    return context;
}

/**
 * Enables three.js rendering (called when the canvas is displayed)
 */
function startRendering(context) {
    context.renderer.setAnimationLoop(time => gameloop(context, time));
}

/**
 * Disables three.js rendering (called when the canvas is hidden)
 */
function stopRendering(context) {
    context.renderer.setAnimationLoop(null);
}

/**
 * Main gameloop, updates the labels, the controls, and renders the scene
 * @param {number} time absolute time since three.js initialization (in ms)
 */
const gameloop = (context, time) => {
    context.camera.position.set(
        Math.cos(time / 2000) * context.distance,
        context.box.y * 1.1,
        Math.sin(-time / 2000) * context.distance,
    );

    context.camera.lookAt(0, context.box.y / 2, 0);
    context.renderer.render(context.scene, context.camera);
};

function loadArtifactFromModel(context, obj) {
    return new Promise((resolve, reject) => {
        context.artifactModel = obj.scene;
        context.artifactModel.traverse(child => {
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
        if (context.scene != null)
            context.scene.add(context.artifactModel);

        // set camera distance to object using bounding box
        const box = new THREE.Box3().setFromObject( obj.scene );
        const size = box.getSize(new THREE.Vector3());
        const maxSize = Math.max(size.x, size.y, size.z);
        context.box = size;
        context.distance = maxSize;

        resolve(context.artifactModel);
    });
}

function loadArtifactFromID(context, id) {
    return new Promise((resolve, reject) => {
        // we could use the API url directly in the loader,
        // but just to be able to see if the status code is correct,
        // we do a fetch in the url and recreate a blob url for the loader after
        fetch(API.API_URL + API.ROUTE.ARTIFACTS + id + '/model').then(res => {
            if (res.status == 200) {
                // when the model is received, get the blob object
                res.blob().then(data => {
                    // generate a local url to use the blob object
                    let url = URL.createObjectURL(data);
                    // load the blob object as a GLTF model
                    const loader = new GLTFLoader();
                    loader.loadAsync(url)
                        .then(model => {
                            loadArtifactFromModel(context, model)
                                .then(resolve)
                                .catch(reject);
                        }).catch(err => {console.error(err);})
                })
            } else { // error
                console.error(res);
            }
        }).catch(err => {console.error(err);});
    })
}

/**
 * Sets the machine displayed in the scene (from the machine's ID).
 * Makes an API call to retreive the machine's model, and then displays it
 * @param {number|object} artifact ID of the machine to show or the machine object
 * @param {HTMLCanvasElement} canvas The canvas to use for three setup if needed
 */
function setArtifactModel(context, artifact, canvas) {
    return new Promise((resolve, reject) => {
        if (context?.artifactModel != null)
            context?.scene.remove(context?.artifactModel);

        let promise;
        if (!context) {
            promise = new Promise((resolve, reject) => {
                checkForCanvasSetup(canvas).then(context => {
                    startRendering(context);
                    resolve(context);
                });
            })
        } else promise = new Promise((resolve, reject) => resolve(context));

        promise.then(c => {
            if (typeof(artifact) === 'object') {
                loadArtifactFromModel(c, artifact).then(() => resolve(c)).catch(reject);
            } else {
                loadArtifactFromID(c, artifact).then(() => resolve(c)).catch(reject);
            }
        })
    })
}

export {
    checkForCanvasSetup,
    stopRendering,
    startRendering,
    setArtifactModel
};

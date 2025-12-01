import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as lil from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new lil.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene()

/**
 * Fog
 */

const fog = new THREE.Fog("black", 20, 60);
scene.fog = fog;

/**
 * Background
 */
const params = {
    squareOutlineWidth: 0.04,
    boundRows: 35,
    boundCols: 35,
}

const { squareOutlineWidth, boundRows, boundCols } = params;

const background = new THREE.Group();

const geometry = new THREE.PlaneGeometry(3, 3, 3);
const outlineMaterial = new THREE.MeshBasicMaterial({ color: 'red' });


//Create Bounds
for (let boundNum = 0; boundNum < 2; boundNum++) {
    const bound = new THREE.Group();
    for (let row = 0; row < boundRows; row++) {
        for (let col = 0; col < boundCols; col++) {
            const material = new THREE.MeshBasicMaterial({ color: 'black' });

            const plane = new THREE.Mesh(geometry, material);
            const planeOutline = new THREE.Mesh(geometry, outlineMaterial);
            const square = new THREE.Group();

            const gap = plane.geometry.parameters.width + squareOutlineWidth;

            plane.rotation.x = - Math.PI * 0.5;

            //Outline Position
            planeOutline.position.copy(plane.position);
            planeOutline.position.y -= 0.1
            planeOutline.rotation.copy(plane.rotation);
            planeOutline.scale.multiplyScalar(1 + squareOutlineWidth);

            square.add(plane, planeOutline);
            square.position.set(col * gap, 0, row * gap);
            bound.add(square);
        }
    }
    if (boundNum === 0) {
        background.add(bound);
    }
    else if (boundNum === 1) {
        bound.position.y = boundRows + 1;
        bound.position.z = boundRows * 3;

        bound.rotation.z = Math.PI;
        bound.rotation.y = Math.PI;
        background.add(bound);
    }

}
scene.add(background);


/**
 * Bound Effect on Click
 */


let hasClicked = false;
const startRow = Math.floor(boundRows / 2);
const startCol = 0;

const timeInterval = 20;

const maxDistance = startRow * 3;

//Clear bound
function clearBound(bound) {
    for (let i = 0; i < bound.children.length; i++) {
        bound.children[i].children[0].material.color.set("black");
    }
}
//Start Effect on click
window.addEventListener('click', () => {
    if (!hasClicked) {

        hasClicked = true;
        setTimeout(()=>hasClicked = false, 700);

        background.children.forEach(bound => {
            let step = 0;


            //Create Wave
            const createWave = setInterval(() => {
                const prevStep = step - 1;

                if (prevStep >= 0) {
                    for (let i = 0; i < bound.children.length; i++) {
                        const square = bound.children[i];

                        const r = Math.floor(i / boundCols);
                        const c = i % boundCols;

                        const distance = Math.abs(r - startRow) + Math.abs(c - startCol);
                        if (distance === prevStep) {
                            square.children[0].material.color.set('black');
                        }
                    }
                }

                for (let i = 0; i < bound.children.length; i++) {
                    const square = bound.children[i];

                    const r = Math.floor(i / boundCols);
                    const c = i % boundCols;

                    const distance = Math.abs(r - startRow) + Math.abs(c - startCol);
                    if (distance === step) {
                        square.children[0].material.color.set('red');
                    }
                }
                step++;
                if (step > maxDistance + 1) {
                    clearInterval(createWave)
                }
            }, timeInterval)
        })
    }
})


/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(- 5, 5, 0)
scene.add(directionalLight)



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(12, 10, -20);
camera.rotation.y = Math.PI * 0.5;
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(10, 5, 5)
controls.enableDamping = true
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
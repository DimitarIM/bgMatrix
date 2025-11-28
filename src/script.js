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
 * Floor
 */
const params = {
    squareOutlineWidth: 0.04,
    floorRows: 20,
    floorCols: 20,
}

const {squareOutlineWidth, floorRows, floorCols} = params;

const floor = new THREE.Group();
const geometry = new THREE.PlaneGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 'black' });
const outlineMaterial = new THREE.MeshBasicMaterial({ color: 'red' });

for (let row = 0; row < floorRows; row++) {
    for (let col = 0; col < floorCols; col++) {
        console.log(col);

        const plane = new THREE.Mesh(geometry, material);
        const planeOutline = new THREE.Mesh(geometry, outlineMaterial);
        const square = new THREE.Group();

        const gap = plane.geometry.parameters.width + squareOutlineWidth;

        plane.rotation.x = - Math.PI * 0.5;

        //Outline Position
        planeOutline.position.copy(plane.position);
        planeOutline.position.y -= 0.001
        planeOutline.rotation.copy(plane.rotation);
        planeOutline.scale.multiplyScalar(1 + squareOutlineWidth);

        square.add(plane, planeOutline);
        square.position.set(col * gap, 0, row * gap);
        floor.add(square);
    }
}
scene.add(floor);


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
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
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
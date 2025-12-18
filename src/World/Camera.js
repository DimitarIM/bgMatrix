import * as THREE from 'three'
import World from './World.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'

export default class Camera {
    constructor() {
        this.world = new World()
        this.sizes = this.world.sizes
        this.scene = this.world.scene
        this.canvas = this.world.canvas
        this.setInstance()
        //this.setControls()

    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(70, this.sizes.width / this.sizes.height, 0.1, 100);
        this.instance.position.set(70, 10, 67);
        this.target = new THREE.Vector3(10,15,67)
        this.scene.add(this.instance)
    }

    startAnim(action, state) {
        if (action === "click") {
            return new Promise((resolve) => {
                gsap.to(this.instance.position, { x: 65, duration: 1, ease: "power1.inOut"}).then(() => {
                    gsap.to(this.instance.position, { x: 95, duration: 2, ease: "power1.out" })
                    gsap.to(this.instance.position, { y: 10, duration: 2, ease: "power1.out" })
                    gsap.to(this.target, { y: 30, duration: 2, ease: "power1.inOut" })
                });
                resolve();
            })
        }
    }

    setControls() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.target = new THREE.Vector3(10, 15, 67);
        this.controls.enableDamping = true
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix()
    }

    update() {
        this.instance.lookAt(this.target);
        //this.controls.update()
    }
}
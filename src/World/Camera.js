import * as THREE from 'three'
import World from './World.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera
{
    constructor()
    {
        this.experience = new World()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas

        this.setInstance()
        this.setControls()
    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(70, this.sizes.width / this.sizes.height, 0.1, 100)
        this.instance.position.set(70, 10, 66.9);
        //this.instance.position.set(0, 2, 2);

        this.scene.add(this.instance)
    }

    setControls()
    {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.target = new THREE.Vector3(10, 15, 67);
        //this.controls.target = new THREE.Vector3(0, 0, 0);
        this.controls.enableDamping = true
    }

    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix()
    }

    update()
    {
        this.controls.update()
    }
}
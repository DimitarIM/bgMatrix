import World from "./World";
import * as THREE from "three";

export default class Lights {
    constructor() {
        this.world = new World();
        this.scene = this.world.scene;

        this.setLights();
    }

    setLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight();
        directionalLight.castShadow = true
        directionalLight.shadow.mapSize.set(1024, 1024)
        directionalLight.shadow.camera.far = 15
        directionalLight.shadow.camera.left = - 7
        directionalLight.shadow.camera.top = 7
        directionalLight.shadow.camera.right = 7
        directionalLight.shadow.camera.bottom = - 7
        directionalLight.position.set(- 5, 5, 0)
        //this.scene.add(directionalLight)
    }
}
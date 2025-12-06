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

        const light = new THREE.HemisphereLight( 0xd6e6ff, 0xa38c08, 1);
        this.scene.add(light);
    }
}
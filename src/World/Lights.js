import World from "./World";
import * as THREE from "three";
import gsap from "gsap";
import { directPointLight } from "three/src/nodes/TSL.js";

export default class Lights {
    constructor() {
        this.world = new World();
        this.scene = this.world.scene;

        this.directionaLights = [];

        this.setLights();
        this.onClickFunc();
    }

    onClickFunc(){
        let hasClicked = false;
        window.addEventListener('click', () => {
            if(hasClicked) return;
            hasClicked = true;
            this.directionaLights.forEach(directionalLight => {
                gsap.to(directionalLight, {intensity: 0, duration: 0.8});
            })
        })
    }

    setLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(ambientLight);

        const directionalLightLower = new THREE.DirectionalLight('red', 3)
        directionalLightLower.castShadow = true
        directionalLightLower.shadow.mapSize.set(1024, 1024)
        directionalLightLower.shadow.camera.far = 15
        directionalLightLower.shadow.normalBias = 0.05

        directionalLightLower.position.set(0, 12, 67);
        directionalLightLower.target.position.set(20, 4, 67)
        this.scene.add(directionalLightLower)
        this.scene.add(directionalLightLower.target);

        //const helper1 = new THREE.DirectionalLightHelper(directionalLightLower, 2);
        //this.scene.add(helper1);

        this.directionaLights.push(directionalLightLower);
        const hemisphereLight = new THREE.HemisphereLight( 0xd6e6ff, 0xa38c08, 1);
        this.scene.add(hemisphereLight);
    }
}
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
    }

    startAnim(action, state) {
        let hasClicked = false;
        if (hasClicked) return;
        hasClicked = true;
        this.directionaLights.forEach(directionalLight => {
            gsap.to(directionalLight, { intensity: 0, duration: 0.8 });
        })
    }

    setLights() {

        const ambientLight = new THREE.AmbientLight("white", 1);

        const directionalLight1 = new THREE.DirectionalLight('red', 3)
        directionalLight1.castShadow = true
        directionalLight1.shadow.mapSize.set(1024, 1024)
        directionalLight1.shadow.camera.far = 15
        directionalLight1.shadow.normalBias = 0.05

        directionalLight1.position.set(0, 12, 67);
        directionalLight1.target.position.set(20, 4, 67);
        this.scene.add(directionalLight1, directionalLight1.target)

        const directionalLight2 = directionalLight1.clone(true);
        directionalLight2.castShadow = true
        directionalLight2.shadow.mapSize.set(1024, 1024)
        directionalLight2.shadow.camera.far = 15
        directionalLight2.shadow.normalBias = 0.05
        directionalLight2.position.set(70, 35, 67);
        directionalLight2.target.position.set(65, 10, 67);

        //this.scene.add(directionalLight2, directionalLight2.target)


        const helper1 = new THREE.DirectionalLightHelper(directionalLight1, 2);
        const helper2 = new THREE.DirectionalLightHelper(directionalLight2, 2);
        
        const hemisphereLight = new THREE.HemisphereLight(0xd6e6ff, 0xa38c08, 1);
        this.scene.add(hemisphereLight, ambientLight);

        this.directionaLights.push(directionalLight1);

    }
}
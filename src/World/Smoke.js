import * as THREE from "three";
import World from "./World";


export default class Smoke {
    constructor() {
        this.world = new World();
        this.clock = new THREE.Clock();

        this.debug = this.world.debug;

        this.textureLoader = new THREE.TextureLoader();

        this.delta = 0;

        this.scene = this.world.scene;
        this.camera = this.world.camera;

        this.resources = this.world.resources;
        this.setSmoke();

    }

    setSmoke() {
        this.smokeTexture = this.resources.items.smokeTexture;
        this.smokeTexture.colorSpace = THREE.SRGBColorSpace;
        this.smokeTexture.wrapS = THREE.RepeatWrapping;
        this.smokeTexture.wrapT = THREE.RepeatWrapping;
        this.smokeTexture.repeat.set(1/6, 1/5);

        this.animTotalFrames = 30;
        this.animCols = 6;
        this.animRows = 5;
        this.animCurrentFrame = 0;
        this.animFrameTimer = 0;
        this.animFrameDuration  = 0.095;

        this.smokeGeometry = new THREE.PlaneGeometry(100, 100);
        this.smokeMaterial = new THREE.MeshLambertMaterial({
            map: this.smokeTexture,
            emissive: 0x222222, //0x222222, //0x1e1e1e //0x1b1b1b, //0x171717, //0x141414
            opacity: 0.3,
            transparent: true,
        });
        this.smokeParticles = [];

        for (let i = 0; i < 12; i++) {
            let smokeElement = new THREE.Mesh(this.smokeGeometry, this.smokeMaterial);
            smokeElement.scale.set(1, 1, 1);

            smokeElement.position.set(10 + Math.random() * 50, Math.random() * 50 - 15, Math.random() * 100 );

            smokeElement.rotation.z = (Math.random() * 360);
            smokeElement.rotation.y = Math.PI * 0.5;

            this.scene.add(smokeElement);
            this.smokeParticles.push(smokeElement);
        }

        //DEBUG
        if(this.debug.active){
            this.debug.ui.addColor(this.smokeMaterial,'emissive').name("smokeEmissive");
            this.debug.ui.add(this.smokeMaterial,'opacity').min(0).max(1).step(0.01).name("smokeOpacity");
        }  

    }

    update(){
        this.delta = this.clock.getDelta();
        //this.animFrameTimer += this.delta;

        // if(this.animFrameTimer > this.animFrameDuration) {
        //     this.animFrameTimer = 0;
        //     this.animCurrentFrame = (this.animCurrentFrame + 1) % this.animTotalFrames;

        //     const frameWidth = 1 / this.animCols;
        //     const frameHeight = 1 / this.animRows;

        //     const currentCol = this.animCurrentFrame % this.animCols;
        //     const currentRow = Math.floor(this.animCurrentFrame / this.animCols);

        //     this.smokeMaterial.map.offset.x = currentCol * frameWidth;
        //     this.smokeMaterial.map.offset.y = 1 - frameHeight - currentRow * frameHeight;
        // }

         for(let i = 0; i < this.smokeParticles.length; i ++){
             this.smokeParticles[i].rotation.z += (this.delta * 0.12);
         }
    }
}
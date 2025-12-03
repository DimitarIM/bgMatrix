import World from "./World";
import * as THREE from "three";

export default class Renderer {
    constructor(worldColor){
        this.world = new World();
        this.canvas = this.world.canvas;
        this.sizes = this.world.sizes;
        this.scene = this.world.scene;
        this.camera = this.world.camera;

        this.worldColor = worldColor

        this.setInstance();
    }

    setInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        })
        this.instance.shadowMap.enabled = true;
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setClearColor(this.worldColor);
        this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    resize()
    {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
    }

    update(){
        this.instance.render(this.scene, this.camera.instance);
    }

}
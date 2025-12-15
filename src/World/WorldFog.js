import World from "./World";
import * as THREE from "three";

export default class WorldFog{
    constructor(){
        this.world = new World();
        this.scene = this.world.scene;

        this.fog = new THREE.Fog("black", 20, 45);
        this.scene.fog = this.fog;
    }
}
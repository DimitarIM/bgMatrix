import World from "../World";
import * as THREE from "three";
import EventEmitter from "./EventEmitter";

export default class AnimationManager extends EventEmitter {
    constructor(anims) {
        super();
        this.world = new World();
        this.renderer = this.world.renderer.instance
        this.camera = this.world.camera;
        this.scene = this.world.scene;
        this.raycaster = this.world.raycaster;

        this.stateManager = this.world.stateManager;
        this.currentState = this.stateManager.currentState;
        this.anims = anims;
        console.log(anims);

        this.raycaster.on("click",() => {
            console.log(this.anims.pentagram.hasStarted);
            console.log(this.anims.door.hasStarted);
            this.anims.pentagram.hasStarted = true;
            this.anims.door.hasStarted = true;

            this.anims.pentagram.start().then(() => {
                this.anims.pentagram.hasStarted = false
            });
            
            this.anims.door.start().then(() => {
                this.anims.door.hasStarted = false
            });
            console.log(this.anims.pentagram.hasStarted);
        })

        this.raycaster.on("hover",() => {
        })
    }

    update() {

    }
}
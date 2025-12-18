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
        console.log(this.stateManager.states);
        this.currentState = this.stateManager.currentState;
        this.anims = anims;
        console.log(anims);

        this.raycaster.on("click", () => {
            this.playAnimsOnClick();
        })

        this.raycaster.on("hoverEnter", () => {
            this.playAnimsOnHoverEnter();
        })

        this.raycaster.on("hoverLeave", () => {
            this.playAnimsOnHoverLeave();
        })
    }

    async playAnimsOnClick() {
        switch (this.currentState.name) {
            case "initial":
                console.log("initial");
                await Promise.all([
                    this.anims.camera.start("click", this.currentState),
                    this.anims.lights.start("click", this.currentState),
                    this.anims.smoke.start("click", this.currentState),
                    this.anims.pentagram.start("click", this.currentState),
                    this.anims.door.start().then(() => {
                        this.anims.background.start('',this.currentState);
                    })
                ]);

                this.currentState = this.stateManager.setCurrentState("obelisk");
                return;
            case "obelisk":
                console.log("obelisk");
                return;
            case "obelisk_ring1":
                console.log("obelisk_ring1");

                return;
            case "obelisk_ring2":
                console.log("obelisk_ring2");

                return;
            case "obelisk_ring3":
                console.log("obelisk_ring3");

                return;
            case "obelisk_ring4":
                console.log("obelisk_ring4");

                return;
            default: console.log("No valid state");
        }
    }

    async playAnimsOnHoverEnter() {
        switch (this.currentState.name) {
            case "initial":
                this.anims.pentagram.hasStarted = true;
                await this.anims.pentagram.start("hoverEnter", this.currentState)
                console.log("initial");
                return;
            case "obelisk":
                console.log("obelisk");
                return;
            case "obelisk_ring1":
                console.log("obelisk_ring1");

                return;
            case "obelisk_ring2":
                console.log("obelisk_ring2");

                return;
            case "obelisk_ring3":
                console.log("obelisk_ring3");

                return;
            case "obelisk_ring4":
                console.log("obelisk_ring4");

                return;
            default: console.log("No valid state");
        }
    }

    async playAnimsOnHoverLeave() {
        switch (this.currentState.name) {
            case "initial":
                this.anims.pentagram.hasStarted = true;
                await this.anims.pentagram.start("hoverLeave", this.currentState)
                return;
            case "obelisk":
                console.log("obelisk");
                return;
            case "obelisk_ring1":
                console.log("obelisk_ring1");

                return;
            case "obelisk_ring2":
                console.log("obelisk_ring2");

                return;
            case "obelisk_ring3":
                console.log("obelisk_ring3");

                return;
            case "obelisk_ring4":
                console.log("obelisk_ring4");

                return;
            default: console.log("No valid state");
        }
    }

    update() {

    }
}
import * as THREE from "three";
import World from "./World";
import EventEmitter from "./utils/EventEmitter";

export default class WorldRaycaster extends EventEmitter {
    constructor() {
        super();

        this.world = new World();
        this.renderer = this.world.renderer.instance;
        this.camera = this.world.camera.instance;
        this.scene = this.world.scene;
        this.needsRaycast = false;
        this.setMouse();
        this.currentObj = null;
        this.isHovering = false;
    }

    setMouse() {
        this.mouse = new THREE.Vector2();

        const hover = (event) => {
            this.clientX = event.clientX;
            this.clientY = event.clientY;
            this.needsRaycast = true;
        }
        this.renderer.domElement.addEventListener("mousemove", hover, false);
        this.renderer.domElement.addEventListener("click", () => {
            if (this.currentObj) {
                this.trigger("click");
            }
        })
    }

    Raycast() {
        const raycaster = new THREE.Raycaster();

        raycaster.setFromCamera(this.mouse, this.camera);
        this.mouse.set(
            (this.clientX / this.renderer.domElement.clientWidth) * 2 - 1,
            -(this.clientY / this.renderer.domElement.clientHeight) * 2 + 1
        );
        raycaster.setFromCamera(this.mouse, this.camera);

        const intersects = raycaster.intersectObjects(this.scene.children);
        if (intersects.length > 0) {
            const found = intersects.find(intersect => intersect.object.name.includes("Star", 0)
                || intersect.object.name.includes("Circle", 0)
                || intersect.object.name.includes("InvisCover", 0))
            if (found) {
                if (!this.isHovering) {
                    this.isHovering = true;
                    this.trigger("hoverEnter");
                }
                this.currentObj = found;
            }
            else {
                if (this.isHovering) {
                    this.isHovering = false;
                    this.trigger("hoverLeave")
                }
                this.currentObj = null;
            }
        }
    }
    update() {
        if (this.needsRaycast) {
            this.Raycast();
            this.neeedsRaycast = false;
        }
    }
}
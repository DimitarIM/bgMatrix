import * as THREE from "three";
import World from "../World";
import gsap from "gsap";

export default class Obelisk {
    constructor() {
        this.world = new World();

        this.debug = this.world.debug;
        this.scene = this.world.scene;
        this.camera = this.world.camera;
        this.time = this.world.time;

        this.resources = this.world.resources;
        this.obelisk = null;
        this.tip = null;

        this.setObelisk();

        this.t0 = this.time.elapsed;

        this.isClicked = false;
    }

    setObelisk() {
        this.obelisk = this.resources.items.obeliskModel.scene;
        this.obelisk.scale.set(2, 2, 2);
        this.obelisk.position.z = 66.93;
        this.obelisk.position.x = 73;
        this.obelisk.position.y = 0;

        this.obelisk.children[0].material = new THREE.MeshStandardMaterial({ color: "#1c0104" });
        this.obelisk.children[1].material = new THREE.MeshStandardMaterial({ color: "black" });

        this.tip = this.obelisk.children[1];

        this.obeliskOutline = this.obelisk.clone(true);
        this.obeliskOutline.children[1].removeFromParent()
        this.obeliskOutline.scale.multiplyScalar(1.008);
        this.obeliskOutline.children[0].material = new THREE.MeshBasicMaterial({
                color: 0xff0000,
                side: THREE.BackSide
            });
        this.obelisk.traverse((child) => {
            if (!child.isMesh && !child.material) return;
            child.material.roughness = 0;
            child.material.metalness = 1;
        });

        this.scene.add(this.obelisk, this.obeliskOutline);
    }

    startAnim(){
        this.current = this.time.delta - this.t0;
        console.log(Math.sin(this.current))
        this.tip.position.y = Math.sin(this.current);
    }

    update() {
        if (!this.tip) return;

        // accumulate time using delta in seconds

    }
}
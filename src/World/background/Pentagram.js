import * as THREE from "three";
import World from "../World";
import gsap from "gsap";

export default class Pentagram {
    constructor() {
        this.world = new World();

        this.debug = this.world.debug;
        this.scene = this.world.scene;
        this.camera = this.world.camera;
        this.resources = this.world.resources;

        this.star = null;
        this.circle = new THREE.Group();
        this.circle.name = "circle";
        this.pentagram = new THREE.Group();
        this.pentagram.name = "pentagram";

        this.setPentagram();

        this.isClicked = false;
    }

    setPentagram() {
        const invisCover = new THREE.Mesh(
            new THREE.PlaneGeometry(14, 14),
            new THREE.MeshBasicMaterial({ transparent: true })
        )
        invisCover.rotation.y = Math.PI * 0.5
        invisCover.position.z = 66.93;
        invisCover.position.x = -1
        invisCover.position.y = 15;
        invisCover.material.opacity = 0;

        invisCover.name = "InvisCover"

        this.star = this.resources.items.starModel.scene;

        this.star.scale.set(2.5, 2.5, 2.5);

        this.star.rotation.x = Math.PI * 0.5;
        this.star.rotation.z = Math.PI * 0.5;

        this.star.position.z = 66.93;
        this.star.position.y = 15;

        this.star.name = "star";

        this.starOutline = this.star.clone(true);
        this.starOutline.scale.multiplyScalar(1.008);
        this.starOutline.children[0].material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            side: THREE.BackSide
        });

        this.star.add(this.starOutline);
        for (let i = 1; i <= 5; i++) {
            const itemName = `circlePart${i}Model`;
            const circlePart = this.resources.items[itemName].scene;
            this.circle.add(circlePart);
        }
        this.circle.scale.set(3, 3, 3);
        this.circle.rotation.x = Math.PI * 0.5;
        this.circle.rotation.z = Math.PI * 0.5;
        this.circle.position.z = 66.93;
        this.circle.position.x = 0
        this.circle.position.y = 15;

        this.pentagram.add(this.star, this.circle, invisCover);
        this.pentagram.traverse((child) => {
            if (!child.isMesh && !child.material) return;
            child.material.color.set("#63151d");
        });
        this.scene.add(this.pentagram);
    }

    startAnim(action, state) {
        if (action === "click") {
            if (this.isClicked) return;
            this.isClicked = true;

            return new Promise((resolve) => {
                gsap.to(this.star.scale, { x: 0, y: 0, z: 0, duration: 0.7, ease: "power1.inOut" });
                gsap.to(this.circle.scale, { x: 0, y: 0, z: 0, duration: 1, ease: "power1.inOut" });

                gsap.to(this.star.rotation, { x: 4, duration: 1, ease: "power1.inOut" }).then(() => {
                    this.star.rotation.x = Math.PI * 0.5;
                    this.star.scale.set(3, 3, 3);
                    this.isClicked = false;
                    resolve();
                })
                gsap.to(this.circle.rotation, { x: -4, duration: 2, ease: "power1.inOut" }).then(() => {
                    this.circle.rotation.x = Math.PI * 0.5;
                    gsap.to(this.star.scale, { x: 4, y: 4, z: 4, duration: 1, ease: "power1.inOut" });
                    gsap.to(this.circle.scale, { x: 5, y: 5, z: 5, duration: 1, ease: "power1.inOut" });
                    gsap.to(this.star.position, { x: 68, y: 20, duration: 1, ease: "power1.inOut" })
                    gsap.to(this.circle.position, { x: 68, y: 20, duration: 1, ease: "power1.inOut" })

                    this.isClicked = false;
                    resolve();
                })
            })
        } else if (action === "hoverEnter" && !this.isClicked) {
            this.isHovered = true;
            return new Promise((resolve) => {
                gsap.to(this.circle.scale, { x: 2.8, y: 2.8, z: 2.8, duration: 0.4, ease: "power1.inOut" });
                resolve();
            })
        } else if (action === "hoverLeave" && !this.isClicked) {
            return new Promise((resolve) => {
                this.isHovered = false;
                gsap.to(this.circle.scale, { x: 3, y: 3, z: 3, duration: 0.4, ease: "power1.inOut" });
                resolve();
            })
        }
    }



    update() {

    }
}
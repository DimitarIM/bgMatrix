import * as THREE from "three";
import World from "../World";
import gsap from "gsap";

export default class Pentagram {
    constructor() {
            this.world = new World();
            this.clock = new THREE.Clock();
            
            this.debug = this.world.debug;            
            this.delta = 0;
            
            this.scene = this.world.scene;
            this.camera = this.world.camera;
            
            this.resources = this.world.resources;
            this.star = null;
            this.circle = new THREE.Group();
            this.setPentagram();
            this.pentagramAnim();
    }

    pentagramAnim(){
        let hasClicked = false;
        window.addEventListener("click",() => {
            if(hasClicked) return;
            hasClicked = true;
            console.log(this.circle.position);
            
            //gsap.to(this.circle.position, {x:"-=5", duration: 1})
            //gsap.to(this.star.position, {x:"-=5", duration: 1})
            gsap.to(this.star.scale, {x:0, y:0, z:0, duration: 0.7, ease:"power1.inOut"});
            gsap.to(this.circle.scale, {x:0, y:0, z:0, duration: 1, ease:"power1.inOut"});

            gsap.to(this.star.rotation, {x:4, duration: 1, ease:"power1.inOut"}).then(()=>{
                this.star.rotation.x = Math.PI * 0.5;
                this.star.scale.set(3,3,3);
            })
            gsap.to(this.circle.rotation, {x:-4, duration: 2, ease:"power1.inOut"}).then(()=>{
                this.circle.rotation.x = Math.PI * 0.5;
                this.circle.scale.set(3,3,3);
            })
            
        })
    }

    setPentagram(){
        this.star = this.resources.items.starModel.scene;
        this.star.scale.set(2.5,2.5,2.5);
        this.star.rotation.x = Math.PI * 0.5;
        this.star.rotation.z = Math.PI * 0.5;
        this.star.position.z = 66.93;
        this.star.position.x = 0
        this.star.position.y = 15;
        this.scene.add(this.star);

        for(let i = 1; i<=5; i ++) {
            const itemName = `circlePart${i}Model`;
            const circlePart = this.resources.items[itemName].scene;
            this.circle.add(circlePart);
        }
        this.circle.scale.set(3,3,3);
        this.circle.rotation.x = Math.PI * 0.5;
        this.circle.rotation.z = Math.PI * 0.5;
        this.circle.position.z = 66.93;
        this.circle.position.x = 0
        this.circle.position.y = 15;

        this.scene.add(this.circle);
    }

    update(){

    }
}
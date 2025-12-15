import * as THREE from "three";

import doorVertexShader from '../shaders/doorVertex.glsl';
import doorFragmentShader from '../shaders/doorFragment.glsl';
import World from "../World";
import EventEmitter from "../utils/EventEmitter";

export default class Door extends EventEmitter {
    constructor(bgParams) {
        super();
        const { squareScale, squareOutlineWidth, boundRows, boundCols } = bgParams;

        this.background = null;
        this.squareScale = squareScale;
        this.squareOutlineWidth = squareOutlineWidth;
        this.boundRows = boundRows;
        this.boundCols = boundCols;

        this.instance = null;
        this.doorHasOpened = false;

        this.doorEffectDuration = 600;
        this.doorEffectT0 = Date.now();
        this.newElapsed = 0;
        this.doorOpeningX = 0.00;
        this.doorOpeningY = 0.00;
        this.doorEffectsFinished = false;

        this.world = new World();
        this.scene = this.world.scene;
        this.debug = this.world.debug;

        this.setDoor();
    }
    setDoor() {
        const doorGeometry = new THREE.PlaneGeometry(15, this.boundCols + 1, 32, 32)

        const doorMaterial = new THREE.RawShaderMaterial({
            vertexShader: doorVertexShader,
            fragmentShader: doorFragmentShader,
            uniforms: {
                uColor: { value: new THREE.Color("red") },
                uIncreaseX: { value: this.doorOpeningX },
                uIncreaseY: { value: this.doorOpeningY },
            }

        })
        this.instance = new THREE.Mesh(doorGeometry, doorMaterial);

        const doorStartPos = this.instance.geometry.parameters.width / 2 - this.squareScale / 2 - this.squareOutlineWidth;

        this.instance.position.y = this.instance.geometry.parameters.height / 2;
        this.instance.position.x -= 1.5;
        this.instance.position.z = doorStartPos + (this.boundRows * this.squareScale / 2) - this.instance.geometry.parameters.width / 2 + 1;
        this.instance.rotation.y = Math.PI * 0.5;
        this.scene.add(this.instance);

        //DEBUG
        if (this.debug.active) {
            this.debug.ui.addColor(doorMaterial.uniforms.uColor, 'value').name("doorColor");
        }

    }

    startAnim() {
        if (!this.doorHasOpened) this.doorEffectT0 = Date.now();
        this.doorHasOpened = true;
    }

    doorAnim() {
        if (!this.doorHasOpened || this.doorEffectsFinished) return;
        const now = Date.now();
        const elapsed = now - this.doorEffectT0;
        const nt1 = Math.min(elapsed / this.doorEffectDuration, 1);

        this.doorOpeningX = THREE.MathUtils.lerp(0.00, 0.5, nt1 * nt1);
        this.instance.material.uniforms.uIncreaseX.value = this.doorOpeningX;
        if (nt1 >= 1) {
            this.doorEffectsFinished = true;
            this.instance.opacity = 0;
            this.trigger("startWave");
        }
    }

    update() {
        this.doorAnim();
    }
}
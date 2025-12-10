import * as THREE from 'three'

import Debug from './utils/Debug.js';
import Sizes from './utils/Sizes.js';
import Time from './utils/Time.js';
import Camera from './Camera.js';
import Renderer from './Renderer.js';
import Background from './Background.js';
import WorldFog from './WorldFog.js';
import Lights from './Lights.js';
import Smoke from './Smoke.js';
import Resources from './utils/Resources.js';
import sources from './sources.js';


let instance = null

export default class World {
    constructor(_canvas) {
        if (instance) {
            return instance
        }
        instance = this;

        window.experience = this;

        this.canvas = _canvas;
        this.sizes = new Sizes();
        this.debug = new Debug();
        this.time = new Time();
        this.scene = new THREE.Scene();
        this.resources = new Resources(sources);

        this.camera = new Camera();

        this.renderer = new Renderer("black");

        this.worldFog = new WorldFog();
        this.resources.on('ready', () => {
            this.smoke = new Smoke();
        })
        this.lights = new Lights();

        this.background = new Background(3, 0.04, "black", "red", 35, 35);


        this.sizes.on('resize', () => {
            this.resize()
        })

        this.time.on('tick', () => {
            this.update()
        })
    }

    resize() {
        this.camera.resize()
        this.renderer.resize()
    }

    update() {
        this.background.update();
        this.camera.update()
        this.renderer.update()
        if (this.smoke) this.smoke.update();
    }
}
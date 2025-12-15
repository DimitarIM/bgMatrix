import * as THREE from 'three'

import Debug from './utils/Debug.js';
import Sizes from './utils/Sizes.js';
import Time from './utils/Time.js';
import Camera from './Camera.js';
import Renderer from './Renderer.js';
import Background from './background/Background.js';
import WorldFog from './WorldFog.js';
import Lights from './Lights.js';
import Smoke from './background/Smoke.js';
import Resources from './utils/Resources.js';
import sources from './sources.js';
import Pentagram from './background/Pentagram.js';
import StateManager from './utils/StateManager.js';
import states from './states.js';


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
        this.stateManager = new StateManager(states);
        this.resources = new Resources(sources);

        this.camera = new Camera();
        this.renderer = new Renderer("black");
        this.worldFog = new WorldFog();

        this.stateManager.on('startTransition', () => {
            this.stateManager.isTransitioning = true;
        })

        this.stateManager.on('endTransition', () => {
            this.stateManager.isTransitioning = false;
        })

        this.resources.on('ready', () => {
            this.lights = new Lights();
            this.background = new Background(3, 0.04, 45, 35);
            this.smoke = new Smoke();
            this.pentagram = new Pentagram();
        });

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
        if(this.background) this.background.update();
        this.camera.update()
        this.renderer.update()
        if (this.smoke) this.smoke.update();
    }
}
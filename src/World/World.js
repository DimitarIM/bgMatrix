import * as THREE from 'three'

import sources from './sources.js';
import states from './states.js';

import Resources from './utils/Resources.js';
import Debug from './utils/Debug.js';
import Sizes from './utils/Sizes.js';
import Time from './utils/Time.js';
import Camera from './Camera.js';
import Renderer from './Renderer.js';
import WorldFog from './WorldFog.js';
import Lights from './Lights.js';
import Smoke from './background/Smoke.js';
import Pentagram from './background/Pentagram.js';
import Door from './background/Door.js';
import Background from './background/Background.js';

import StateManager from './utils/StateManager.js';
import AnimationManager from './utils/AnimationManager.js';

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

        const bgParams = {
            squareScale: 3,
            squareOutlineWidth: 0.04,
            boundRows: 45,
            boundCols: 35,
        }

        this.resources.on('ready', () => {
            this.lights = new Lights();
            this.smoke = new Smoke();

            this.door = new Door(bgParams);
            this.background = new Background(bgParams);
            this.door.background = this.background;
            this.background.door = this.door;

            this.pentagram = new Pentagram();

            this.setAnims({
                lights: {
                    start: this.lights.startAnim.bind(this.lights)
                },
                smoke: {
                    start: this.smoke.startAnim.bind(this.smoke)
                },
                door: {
                    start: this.door.startAnim.bind(this.door)
                },
                background: {
                    start: this.background.startAnim.bind(this.background)
                },
                pentagram: {
                    start: this.pentagram.startAnim.bind(this.pentagram)
                },
            });
        });

        this.sizes.on('resize', () => {
            this.resize()
        })

        this.time.on('tick', () => {
            this.update()
        })
    }

    setAnims(anims){
        this.animManager = new AnimationManager(anims)
    }

    resize() {
        this.camera.resize();
        this.renderer.resize();
    }

    update() {
        this.camera.update();
        this.renderer.update();

        if (this.smoke) this.smoke.update();
        if (this.door) this.door.update();
        if (this.background) this.background.update();
    }
}
import World from "./World";
import * as THREE from "three";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { GammaCorrectionShader} from 'three/examples/jsm/shaders/GammaCorrectionShader.js';

export default class Renderer {
    constructor(worldColor) {
        this.world = new World();
        this.canvas = this.world.canvas;
        this.sizes = this.world.sizes;
        this.scene = this.world.scene;
        this.camera = this.world.camera;

        this.worldColor = worldColor
        this.setInstance();
        this.setComposer();

    }

    setInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: false,
        })
        this.instance.shadowMap.enabled = true;
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setClearColor(this.worldColor);
        this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.instance.toneMapping = THREE.LinearToneMapping;
        this.instance.toneMappingExposure = 1.5;
        this.instance.outputColorSpace = THREE.SRGBColorSpace;
    }

    setComposer() {
        const renderTarget = new THREE.WebGLRenderTarget(
            800,
            600,
            {
                samples: this.instance.getPixelRatio() === 1 ? 4 : 0,
            }
        );
        this.composer = new EffectComposer(this.instance, renderTarget);

        const renderPass = new RenderPass(this.scene, this.camera.instance);
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(this.sizes.width, this.sizes.height),
            1.6,
            0.005,
            0.1,
        )
        bloomPass.strength = 0.7;
        bloomPass.radius = 0.01;
        bloomPass.threshold = 0.1;

        const smaaPass = new SMAAPass(this.sizes.width, this.sizes.height);
        const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);

        bloomPass.enabled = true;
        gammaCorrectionPass.enabled = false;
        smaaPass.enabled = true;


        this.composer.addPass(renderPass);
        this.composer.addPass(bloomPass);
        this.composer.addPass(gammaCorrectionPass);
        this.composer.addPass(smaaPass);
    }

    resize() {
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.composer.setSize(this.sizes.width, this.sizes.height);
    }

    update() {
        this.composer.render();
    }

}
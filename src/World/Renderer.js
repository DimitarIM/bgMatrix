import World from "./World";
import * as THREE from "three";
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js'
import { OutputPass} from 'three/examples/jsm/postprocessing/OutputPass.js';
import bloomVertexShader from './shaders/bloomVertex.glsl';
import bloomFragmentShader from './shaders/bloomFragment.glsl';


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
        this.composer = new EffectComposer(this.instance);

        this.finalComposer = new EffectComposer(this.instance);


        this.renderPass = new RenderPass(this.scene, this.camera.instance);

        this.fxaaPass = new ShaderPass(FXAAShader);

        this.mixPass = new ShaderPass(
            new THREE.ShaderMaterial({
                uniforms: {
                    baseTexture: {value: null},
                    bloomTexture: {value: this.composer.renderTarget2.texture}
                },
                vertexShader: bloomVertexShader,
                fragmentShader: bloomFragmentShader,
            }), 'baseTexture'
        );


        this.fxaaPass.material.uniforms['resolution'].value.set(
            1 / window.innerWidth,
            1 / window.innerHeight
        );

        this.smaaPass = new SMAAPass(this.sizes.width, this.sizes.height);

        this.bloomPass = new UnrealBloomPass(
            new THREE.Vector3(this.sizes.width, this.sizes.height),
            1.6,
            0.005,
            0.1,
        )
        this.bloomPass.strength = 0.7;
        this.bloomPass.radius = 0.01;
        this.bloomPass.threshold = 0.1;

        this.outputPass = new OutputPass();

        // this.finalComposer.addPass(this.renderPass);
        // this.finalComposer.addPass(this.mixPass);
        // this.finalComposer.addPass(this.bloomPass);
        // this.finalComposer.addPass(this.outputPass);

        this.composer.addPass(this.renderPass);
        this.composer.addPass(this.bloomPass);
        //this.composer.addPass(this.fxaaPass);
        this.composer.addPass(this.smaaPass);
        //this.composer.addPass(this.outputPass);



    }

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
        this.composer.setSize(this.sizes.width, this.sizes.height);
        this.finalComposer.setSize(this.sizes.width, this.sizes.height);
    }

    update() {
        this.composer.render();
        this.finalComposer.render();
    }

}
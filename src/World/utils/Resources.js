import EventEmitter from "./EventEmitter";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as THREE from 'three'
import World from "../World";

export default class Resources extends EventEmitter{
    constructor(sources) {
        super();
        this.sources = sources;

        this.world = new World;
        this.scene = this.world.scene;

        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0

        this.setLoaders()
        this.startLoading()
    }
    setLoaders() {
        this.loaders = {}
        this.loaders.gltfLoader = new GLTFLoader()
        this.loaders.textureLoader = new THREE.TextureLoader()
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader()
    }

    startLoading() {
        for (const source of this.sources) {
            if (source.type === 'gltfModel') {
                this.loaders.gltfLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file)
                    }
                )
            }
            else if (source.type === 'texture') {
                this.loaders.textureLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file)
                    }
                )
            }
            else if (source.type === 'cubeTexture') {
                this.loaders.cubeTextureLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file)
                    }
                )
            }
        }
    }

    updateAllMaterials(){
            this.scene.traverse((child) => {
                if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                    child.material.envMapIntensity = 2.5
                    child.material.needsUpdate = true;
                    child.castShadow = true
                    child.receiveShadow = true
                    child.material.metalness = 0.5;
                    child.material.roughness = 0.1;
                }
            })
    }

    sourceLoaded(source, file) {
        this.items[source.name] = file
        this.loaded++;
        if (this.loaded === this.toLoad) {
            this.trigger('ready');
            this.updateAllMaterials();
        }
    }


}
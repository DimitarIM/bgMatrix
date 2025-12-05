import * as THREE from 'three'

import Debug from './utils/Debug.js'
import Sizes from './utils/Sizes.js'
import Time from './utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import Background from './Background.js'
import WorldFog from './WorldFog.js'
import Lights from './Lights.js'


let instance = null

export default class World
{
    constructor(_canvas)
    {
        if(instance)
        {
            return instance
        }
        instance = this
        
        window.experience = this

        this.canvas = _canvas

        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.camera = new Camera()
        this.renderer = new Renderer("grey");

        //this.worldFog = new WorldFog();
        this.lights = new Lights();

        this.background = new Background(3, 0.04, "black", "red", 25, 25)

        this.sizes.on('resize', () =>
        {
            this.resize()
        })

        this.time.on('tick', () =>
        {
            this.update()
        })
    }

    resize()
    {
        this.camera.resize()
        this.renderer.resize()
    }

    update()
    {
        this.background.update();
        this.camera.update()
        this.renderer.update()
    }
}
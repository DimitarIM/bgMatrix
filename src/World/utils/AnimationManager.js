import World from "../World";

export default class AnimationManager{
    constructor(anims) {
        this.world = new World();
        this.stateManager = this.world.stateManager;
        this.currentState = this.stateManager.currentState;
        this.anims = anims;
    }

    setRayCaster(){
        
    }

    update(){

    }
}
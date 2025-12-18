import EventEmitter from "./EventEmitter";

export default class StateManager extends EventEmitter {
    constructor(states) {
        super();
        this.states = states;

        this.prevState = null;
        this.currentState = null;
        this.isTransitioning = false;
        if (this.states) this.setCurrentState("initial");
    }

    setCurrentState(stateName) {
        const newState = this.states.find(state => state.name === stateName);
        if (this.currentState === null) {
            this.currentState = newState;
        }
        else if (
            newState
            && this.currentState !== newState
            && newState.sharedStates.includes(this.currentState.name)
            && !this.isTransitioning
        ) {
            this.prevState = this.currentState;
            this.currentState = newState;
            return this.currentState;
        }
        else {
            console.log("Invalid name")
        };
    }

    startTransition() {
        if (!this.isTransitioning) {
            this.trigger = "startTransition";
        }
    }
    endTransition() {
        if (this.isTransitioning) {
            this.trigger = "endTransition";
        }
    }
}



import EventEmitter from "./EventEmitter";

export default class Time extends EventEmitter {
    constructor() {
        super();

        this.start = Date.now();
        this.current = this.start;
        this.elapsed = 0;
        this.delta = 16;

        window.requestAnimationFrame(() => {
            this.tick();
        })
    }

    tick() {
        const currentT = Date.now();
        this.delta = currentT - this.current;
        this.current = currentT;
        this.elapsed = this.current - this.start;

        this.trigger('tick');

        window.requestAnimationFrame(() => {
            this.tick();
        })
    }
}
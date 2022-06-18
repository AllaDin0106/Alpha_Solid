export class Stopwatch {

    #start: number;
    #end: number;
    #elapsed: any;

    Start = () => this.#start = performance.now();

    Stop = () => {
        this.#end = performance.now();
        this.#elapsed = (this.#end - this.#start) / 1000;
    }

    Elapsed = () => this.#elapsed;
}
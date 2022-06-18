import { IMiddleware } from "./Middleware";

class ApplicationBuilder {

    #Pipeline: Array<IMiddleware>;

    constructor(debug = false) {
        this.#Pipeline = [];
    }

    Add = (middleware: IMiddleware) => this.#Pipeline.push(middleware);

    Run = async () => new Promise(async resolve => {
        for (let middleware of this.#Pipeline)
            await middleware.next();

        resolve(true);
    });

}

export const AppBuilder = new ApplicationBuilder();

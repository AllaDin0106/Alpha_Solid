import { AbstractModule } from "../AbstractModule";

class DXDY extends AbstractModule {

    constructor() {
        super();

        this.Name = 'dYdX';
        this.Category = 'Modules';
        this.SVG = '/logos/dydx.svg';

        this.Component = <></>

        this.PostConstructor();
    }

}

export default DXDY;
import { AbstractModule } from "../Modules/AbstractModule"
import { Compound, Dashboard, DYDX, History, Settings, Uniswap, Wallet } from "../Modules/Collection";

import { ModuleMutable } from "../UI/Extension/Controller"

const Add = (module: AbstractModule) => ModuleMutable.List.push(module);

export const InitModules = () => {

    Add(new Dashboard());
    Add(new Wallet());
    Add(new History())
    Add(new Settings());
    Add(new Compound());
    Add(new Uniswap());
    Add(new DYDX());

}
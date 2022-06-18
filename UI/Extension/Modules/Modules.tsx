import './Modules.css';
import { Component } from "solid-js";
import { User } from "../../../Core/User";
import { Cache } from "../../../Core/Cache";
import { ModuleMutable } from "../Controller";

const Modules: Component = () => <section class='modules'>

    {ModuleMutable.Current && ModuleMutable.List.filter(m => m.ID == ModuleMutable.Current)[0].Component}

</section>;

export default Modules;
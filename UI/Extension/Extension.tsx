import './Extension.css';
import { Component } from "solid-js";
import Modules from "./Modules/Modules";
import Menu from "./Menu/Menu";

const Extension: Component = () => <div class='extension'>
    <Menu />
    <Modules />
</div>;

export default Extension;
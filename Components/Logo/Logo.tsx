import './Logo.css';
import { Component, createSignal } from "solid-js";

const [animation, setAnimation] = createSignal(false);
export const Jiggle = () => {
    setAnimation(true);
    setTimeout(() =>  setAnimation(false), 400);
}

const Logo: Component = () => {

    return <div classList={{ bigLogo: true, animation: animation() }}>
        <img onClick={() => Jiggle()} src='/images/logo.svg' />
        <div></div>
        <div></div>
        <div></div>
    </div>;
}

export default Logo;
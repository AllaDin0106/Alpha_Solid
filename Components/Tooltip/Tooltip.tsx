import './Tooltip.css';
import { Component } from "solid-js";

type Props = {
    anchor: 'top' | 'right' | 'bottom' | 'left'
}

const Tooltip: Component<Props> = props => {

    return <div class={`component tooltip ${props.anchor}`}>{props.children}</div>;
}

export default Tooltip;
import './Button.css';
import { Component } from "solid-js"
import { Generic } from '../../Definitions/Methods';
import { Icon } from '../Components';

type Props = {
    icon?: string,
    type?: 'primary' | 'secondary' | 'critical',
    active?: boolean
} & Generic;

const Button: Component<Props> = props => {
    return <button class='component button' data-active={props.active} data-type={props.type} onClick={props.onClick}>
        {props.icon && <Icon value={props.icon}/>}
        {props.value && <span>{props.value}</span>}
    </button>
}

export default Button;
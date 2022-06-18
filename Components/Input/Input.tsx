import './Input.css';
import { Component } from "solid-js";
import { Generic } from "../../Definitions/Methods";
import { Icon } from '../Components';

type Props = {
    header?: string,
    required?: boolean,
    onInput?: any,
    placeholder?: string,
    type?: string,
    icon?: {
        name: string,
        side: 'left' | 'right'
    }
} & Generic;

const Input: Component<Props> = props => {
    return <div class='component input' data-icon-side={props.icon && props.icon.side}>
        {props.header && <span classList={{ header: true, required: props.required != undefined && props.required }}>{props.header}</span>}
        <div>
            {props.icon && <Icon value={props.icon.name} />}
            <input type={props.type} onInput={e => { if (props.onInput) props.onInput(e) }} placeholder={props.placeholder} value={props.value}/>
        </div>
    </div>;
}

export default Input;
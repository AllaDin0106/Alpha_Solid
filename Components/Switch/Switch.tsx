import './Switch.css';
import { Accessor, Component, createSignal, Setter } from "solid-js";
import { Generic } from '../../Definitions/Methods';

type Props = {
    id: string
} & Generic;

const Switch: Component<Props> = props => {

    let id = 'switch-' + props.id.toLowerCase();
    
    const [checked] = createSignal<boolean>(props.value);

    return <div class='component switch'>
        <input checked={checked()} type='checkbox' id={id} />
        <label onClick={props.onClick} for={id}></label>
        <div class='toggler'><div></div></div>
    </div>;
}

export default Switch;
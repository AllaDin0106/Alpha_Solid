import './Options.css';
import { Accessor, Component, Setter } from "solid-js";
import { Generic } from '../../Definitions/Methods';

type Props = {
    getter: Accessor<number>,
    setter: Setter<number>,
    items: Array<string>
} & Generic;

const Options: Component<Props> = props => {

    return <div class='component options-menu'>
        {props.items.map((item, index) => <div
            classList={{ selected: props.getter() === index }}
            onClick={() => props.setter(index)}>
            {item}
        </div>
        )}
    </div>;
}

export default Options;
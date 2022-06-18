import { Component } from "solid-js";
import { Generic } from "../../Definitions/Methods";

type Props = {
    value: string
} & Generic;

const Icon: Component<Props> = props => {
    return <div class='component icon'><i class={`fa-solid fa-${props.value}`}></i></div>
}

export default Icon;
import './Breadcrumbs.css';
import { Component, For } from "solid-js"
import { Generic } from "../../Definitions/Methods";
import { Icon } from "../Components";

type Props = {
    list: Array<string>
    index: any
} & Generic;

const Breadcrumbs: Component<Props> = props => {
    return <div class='component breadcrumbs'>
        {props.list.map((item, index) => <>
            <span classList={{ active: index === props.index - 1 }}>{item}</span>
            {index < props.list.length - 1 && <Icon value='angle-right' />}
        </>
        )}
    </div>
}

export default Breadcrumbs;
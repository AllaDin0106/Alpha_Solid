import './SettingsItem.css';
import { Component } from "solid-js";
import { Generic } from "../../Definitions/Methods";


const Item: Component<{ header: string, subheader?: string, flex?: boolean }> = props => {

    if (!props.flex) props.flex = false;

    return <div classList={{ 'setting': true, 'item': true, flex: props.flex }}>
        <div>
            <h3>{props.header}</h3>
            {props.subheader && <p>{props.subheader}</p>}
        </div>
        {props.children}
    </div>

}
const Category: Component<Generic> = props => () =>
    <h2 class='setting category'>{props.value}</h2>

const SettingComponents = { Item, Category }

export default SettingComponents;
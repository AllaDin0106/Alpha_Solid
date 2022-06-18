import './Modal.css';
import { Component, createSignal, JSX } from "solid-js";
import { Generic } from '../../Definitions/Methods';

type Props = {} & Generic;

const Modal: Component<Props> = props => {

    let [visible, setVisible] = createSignal(false);
    let ref;

    return <>
        <span class='component modal-trigger' onClick={() => setVisible(true)}>{props.value}</span>
        {visible() && <div ref={ref} class='component modal-content' onClick={event => {
            if (event.target === ref)
                setVisible(false);
        }}>
            <div onClick={e => { if (e.target.hasAttribute('data-close-modal')) setVisible(false); }}>
                {props.children}
            </div>
        </div>}
    </>;
}

export default Modal;
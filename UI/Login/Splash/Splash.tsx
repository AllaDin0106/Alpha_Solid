import './Splash.css';
import { Component } from "solid-js";
import { Button } from "../../../Components/Components";
import { LoginMutable, LoginScreen } from '../Controller';

const Splash: Component = () => {

    const GoTo = {
        Create: () => LoginMutable.Screen = LoginScreen.Create,
        Import: () => LoginMutable.Screen = LoginScreen.Import
    }

    return <div data-login='splash'>

        <h1>Alpha</h1>
        <br />
        <p>All your decentralized financial needs under one banner.</p>
        <br />
        <br />
        <br />
        <Button value='Create Wallet' icon='user' type='primary' onClick={GoTo.Create} />
        <p class='sub'>Generate a new wallet and seed phrase.</p>
        <br />
        <br />
        <Button value='Import Wallet' icon='key' type='secondary' onClick={GoTo.Import} />
        <p class='sub'>Restore an existing wallet.</p>
    </div>;
}

export default Splash;
import './Debug.css';
import { Component } from "solid-js";
import { Cache } from '../../Core/Cache';
import { LoginMode, LoginMutable, LoginScreen } from '../Login/Controller';
import { User } from '../../Core/User';

const Debug: Component = () => {
    return <div class='dev debug'>
        <button onClick={() => User.SignOut()}>Sign Out</button>
    </div>;
}

export default Debug;
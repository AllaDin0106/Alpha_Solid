import './SignIn.css';
import { Component, createSignal } from "solid-js";
import { Button, Input, Modal } from '../../../Components/Components';
import { LoginMode, LoginMutable } from '../Controller';
import { User } from '../../../Core/User';
import { Cache } from '../../../Core/Cache';
import { Hash } from '../../../Core/Crypto';

const SignIn: Component = () => {

    const [invalid, setInvalid] = createSignal(false);
    const TryLogin = () => {

        const Hashed = Hash(Cache.User.Temp.Password1);

        if (Hashed === Cache.User.Encrypted.Password) {
            LoginMutable.Mode = LoginMode.Post;
            User.LogIn();
        }
        else
            setInvalid(true);
    }

    return <div data-login="signin" classList={{ invalid: invalid() }}>
        <h1>Sign In</h1>
        <br />
        <p>All your decentralized financial needs under one banner.</p>
        <br />
        <br />
        <br />
        <div class='password'>
            <Input onInput={(e: any) => Cache.User.Temp.Password1 = e.currentTarget.value} placeholder='Password' type='password' icon={{ name: 'key', side: 'right' }} />
            <Button type='primary' value='Sign In' onClick={(e: any) => TryLogin()} />
        </div>
        <p class='invalid-message'>Invalid password.</p>
        <br />
        <br />
        <Modal value='Forgot your password?'>
            <p>You can create or import another account, resetting your current account and its settings.</p>
            <br />
            <p class='warning'>This action is irrecoverable.</p>
            <br />
            <Button type='critical' value='New account' onClick={() => User.SignOut()} />
        </Modal>
    </div>;
}

export default SignIn;
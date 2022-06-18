import './Import.css';
import { Component } from "solid-js";
import { Container, LoginMode, LoginMutable, LoginScreen } from "../Controller";
import { Input, Modal } from '../../../Components/Components';
import { Cache } from '../../../Core/Cache';
import { User } from '../../../Core/User';
import { createMutable } from 'solid-js/store';

const Step1: Component = () => {

    Cache.Clear.Temp();

    LoginMutable.Next.Active = false;
    LoginMutable.Next.Action = () => LoginMutable.Import = 2;
    LoginMutable.Prev.Action = () => LoginMutable.Screen = LoginScreen.Splash;

    return <div data-import-stage="1">
        <Input type='password' header='Enter password' required onInput={(e: { currentTarget: { value: string; }; }) => {
            Cache.User.Temp.Password1 = e.currentTarget.value;
            User.ValidatePassword();
        }} icon={{ name: 'key', side: 'right' }} />
        <br />
        <Input type='password' header='Verify password' required onInput={(e: { currentTarget: { value: string; }; }) => {
            Cache.User.Temp.Password2 = e.currentTarget.value;
            User.ValidatePassword();
        }} />
        <br />
        <br />
        <Modal value='Is this secure?'>
            <h2>Is this secure?</h2>
            <br />
            <p>You're in good hands.<br />Your credentials are both encrypted and hashed using AES and SHA256 algorithms.</p>
        </Modal>
    </div>
}

const Step2: Component = () => {
    LoginMutable.Next.Active = false;
    LoginMutable.Next.Action = () => { LoginMutable.Mode = LoginMode.Post; User.LogIn(); }
    LoginMutable.Prev.Action = () => LoginMutable.Import = 1;

    let t1: any;
    let t2: any;

    const Mutable = createMutable({
        Validating: false,
        Valid: null
    });

    const Validate = value => {

        clearTimeout(t1);
        if (value == '') {
            LoginMutable.Next.Active = false;
            Mutable.Valid = null;
            return;
        }

        t1 = setTimeout(() => {

            Mutable.Validating = true;

            clearTimeout(t2);
            t2 = setTimeout(() => {
                Mutable.Validating = false;
                Mutable.Valid = User.Import.IsValid(value);
                LoginMutable.Next.Active = Mutable.Valid;
            }, 1000);

        }, 250);

    }

    return <div data-import-stage="2" classList={{ validating: Mutable.Validating }}>
        <Input onInput={(e: any) => Validate(e.currentTarget.value)} type='text' required={true} header='Enter a valid seed phrase' icon={{ name: 'spinner', side: 'right' }} />
        {Mutable.Valid === false && <div class='attention invalid'>
            <b>This doesn't seem quite right.</b><br />Are you sure this phrase is correct?
            <br />
            <br />
            Perhaps <span onClick={() => {
                LoginMutable.Create = 1;
                LoginMutable.Import = 1;
                LoginMutable.Screen = LoginScreen.Create;
            }}>try generating a new wallet</span>.
        </div>}
        {Mutable.Valid && <div class='attention valid'>
            <b>Very nice.</b><br /> We'll import your wallet right away!
        </div>}
    </div>
}

const Import: Component = () => {
    return <Container index={LoginMutable.Import} data='import' breadcrumbs={['Password', 'Seed Phrase']} title='Import Existing Wallet'>
        {LoginMutable.Import === 1 && <Step1 />}
        {LoginMutable.Import === 2 && <Step2 />}
    </Container>;
}

export default Import;
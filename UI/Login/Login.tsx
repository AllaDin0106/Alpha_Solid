import './Login.css';
import { Component } from "solid-js";
import { LoginMode, LoginMutable, LoginScreen } from "./Controller";
import { Logo } from '../../Components/Components';
import Create from "./Create/Create";
import Import from "./Import/Import";
import Splash from "./Splash/Splash";
import SignIn from "./SignIn/SignIn";
import { Cache } from '../../Core/Cache';

const Login: Component = () => {

    if (Cache.User.Auth.Level === 'login')
        LoginMutable.Screen = LoginScreen.SignIn;

    return <div class='login'>

        {LoginMutable.Mode == LoginMode.Pre &&
            <div class='pre'>
                <div class='content'>
                    {LoginMutable.Screen === LoginScreen.Splash && <Splash />}
                    {LoginMutable.Screen === LoginScreen.Create && <Create />}
                    {LoginMutable.Screen === LoginScreen.Import && <Import />}
                    {LoginMutable.Screen === LoginScreen.SignIn && <SignIn />}
                </div>
                <Logo />
            </div>
        }

        {LoginMutable.Mode == LoginMode.Post &&
            <div class='post'>
                <div class='flip'>
                    <div>
                        <div class='front'>
                            <div data-bg></div>
                            <div data-checkmark></div>
                            <div data-clockwise='1'></div>
                            <div data-clockwise='2'></div>
                            <div data-clockwise='3'></div>
                            <div data-clockwise='4'></div>
                            <div data-clockwise='5'></div>
                            <div data-clockwise='6'></div>
                        </div>
                        <div class='back'>
                            <img src='/images/logo.svg' />
                        </div>
                    </div>
                </div>

                <div class='text'><b>Success!</b><br /><br /> Logging in...</div>
            </div>}
    </div>;
}

export default Login;
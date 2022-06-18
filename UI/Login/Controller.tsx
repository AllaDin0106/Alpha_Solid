import { Component } from "solid-js";
import { createMutable } from "solid-js/store";
import { Breadcrumbs, Button } from "../../Components/Components";

export enum LoginMode { Pre, Post }
export enum LoginScreen { Splash, Create, Import, SignIn }

type ButtonType = {
    Text?: string,
    Icon?: string
    Action?: Function,
    Active: boolean
};
type T = {
    Mode: LoginMode,
    Screen: LoginScreen,
    Create: 1 | 2 | 3,
    Import: 1 | 2 | 3,
    Next: ButtonType,
    Prev: ButtonType
}

export const LoginMutable = createMutable<T>({
    Mode: LoginMode.Pre,
    Screen: LoginScreen.Splash,
    Create: 1,
    Import: 1,
    Next: { Active: false },
    Prev: { Active: true }
});


type C = {
    data: string
    title: string,
    breadcrumbs: Array<string>,
    index: 1 | 2 | 3
};

export const Container: Component<C> = props => {

    LoginMutable.Next.Text = 'Next';
    LoginMutable.Next.Icon = 'arrow-right';
    LoginMutable.Prev.Icon = 'arrow-left';

    return <div data-login={props.data}>
        <h2>{props.title}</h2>
        <br />
        <Breadcrumbs index={props.index} list={props.breadcrumbs} />
        <br />
        <br />
        {props.children}
        <div class='buttons'>
            <Button active={LoginMutable.Prev.Active} value={LoginMutable.Prev.Text} icon={LoginMutable.Prev.Icon} onClick={() => LoginMutable.Prev.Action()} />
            <Button active={LoginMutable.Next.Active} type='primary' value={LoginMutable.Next.Text} icon={LoginMutable.Next.Icon} onClick={() => LoginMutable.Next.Action()} />
        </div>
    </div>;
}

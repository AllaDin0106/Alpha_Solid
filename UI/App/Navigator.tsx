import { Component } from "solid-js";
import { Cache } from '../../Core/Cache';
import Debug from "../Debug/Debug";
import Extension from "../Extension/Extension";
import Login from "../Login/Login";

const Navigator: Component = () => <>
    {Cache.User.Auth.Level === 'authorized' ? <Extension /> : <Login />}
    {Cache.Settings.DebugMode && false && <Debug />}
</>;

export default Navigator;
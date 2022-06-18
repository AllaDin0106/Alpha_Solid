import './Settings.css';
import { createSignal } from "solid-js";
import { Icon, Input, Options, SettingComponents, Switch } from "../../Components/Components";
import { ModuleMutable } from "../../UI/Extension/Controller";
import { AbstractModule } from "../AbstractModule";
import { Cache } from '../../Core/Cache';
import { ChangeWalletSize, SetProvider } from './Controller';

class Settings extends AbstractModule {

    constructor() {
        super();

        this.Name = 'Settings';
        this.AlwaysEnabled = true;
        this.Category = 'Options';
        this.Title = 'User Settings'
        this.Icon = 'gear';
        this.Description = 'The settings panel, impossible to toggle off.'

        this.Component = () => this.Content();

        this.PostConstructor();
    }

    Content = () => {

        const Items = ['Account', 'Interface', 'Integration'];
        const [selected, setSelected] = createSignal<number>(0);

        const Account = <div data-setting="account">
            <SettingComponents.Category value='API Keys' />
            <SettingComponents.Item header='Infura' subheader='Insert your Infura project key, this will be used to perform Web3 related actions.'>
                <Input value={Cache.Settings.Infura.Key} onInput={e => SetProvider(e.currentTarget.value)} />
            </SettingComponents.Item>
            <SettingComponents.Item header='Compound' subheader='In order to interact with the Compound service, insert your Compound API key here.'>
                <Input />
            </SettingComponents.Item>

            <SettingComponents.Category value='HD Wallet' />
            <SettingComponents.Item flex={true} header='Sub-wallets' subheader='Number of wallets to display. This directly affects your Infura requests volume.'>
                <div class='sub-wallet-amount'>
                    <button onClick={() => ChangeWalletSize(-1)}>-</button>
                    <span>{Cache.Wallet.Size}</span>
                    <button onClick={() => ChangeWalletSize(1)}>+</button>
                </div>
            </SettingComponents.Item>
        </div>;

        const Interface = <div data-setting="interface">
            <SettingComponents.Category value='User Themes' />
            <SettingComponents.Item flex={true} header='Dark Mode' subheader='Sets the theme of the extension to a dark theme.'>
                <Switch value={true} id='theme' />
            </SettingComponents.Item>
        </div>;

        const Integration = <div data-setting="integration">
            {ModuleMutable.List.map(module => {
                return <div classList={{ permanent: module.AlwaysEnabled }}>
                    <div class='header'>
                        {module.Icon && <Icon value={module.Icon} />}
                        {module.SVG && <img src={module.SVG} />}
                        <span>{module.Name}</span>
                        <Switch value={module.Enabled} onClick={() => module.ToggleEnabled()} id={module.Name} />
                    </div>
                    <p>{module.Description}</p>
                </div>
            })}
        </div>;

        return <>
            <Options setter={setSelected} getter={selected} items={Items} />
            {selected() === 0 && Account}
            {selected() === 1 && Interface}
            {selected() === 2 && Integration}
        </>
    }

}

export default Settings;
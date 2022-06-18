import { Accessor, createSignal, JSX, Setter } from "solid-js";
import { Categories, ModuleMutable } from "../UI/Extension/Controller";
import { Cache } from "../Core/Cache";


export abstract class AbstractModule {

    #enabled: Accessor<boolean>;
    #setEnabled: Setter<boolean>;

    #title: string | JSX.Element;

    Name: string;
    Description: string;
    #component: JSX.Element;

    ID: string;
    AlwaysEnabled: boolean;
    Category: Categories;
    Order: number;

    Icon: string;
    SVG: string;

    get Enabled() { return this.#enabled(); }
    set Enabled(value: boolean) { this.#setEnabled(value); }

    get Title() { return !this.#title ? this.Name : this.#title; }
    set Title(value: string | JSX.Element) { this.#title = value; }

    get Component() { return this.#component; }
    set Component(jsx: JSX.Element) {
        this.#component = () => <div class={`module ${this.Name.toLowerCase()}`}>
            <h1>{this.Title}</h1>
            {jsx}
        </div>
    }

    constructor() {

        [this.#enabled, this.#setEnabled] = createSignal<boolean>(true);

        this.ID = crypto.randomUUID();
        this.AlwaysEnabled = false;
        this.Category = 'Home'
        this.Order = 0;

        this.Component = <></>;
    }

    #EnableFromCache = () => {
        if (Cache.Settings.Modules[this.Name] != null)
            this.Enabled = Cache.Settings.Modules[this.Name];
    }

    PostConstructor = () => {
        this.#EnableFromCache();
    }

    ToggleEnabled = () => {
        this.Enabled = !this.Enabled;
        Cache.Settings.Modules[this.Name] = this.Enabled;

        ModuleMutable.Categories.forEach(category => {
            category.Size = ModuleMutable.List.filter(module => module.Enabled === true && module.Category === category.Name).length;
        });
    }

    Select = () => {
        ModuleMutable.Current = this.ID;
    }
}
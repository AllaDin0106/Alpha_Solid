import './Menu.css';
import { Component, createEffect } from "solid-js";
import { InitMenu, ModuleMutable } from '../Controller';
import { Icon } from '../../../Components/Components';

const Menu: Component = () => {

    InitMenu();

    return <section class='menu'>

        {ModuleMutable.Categories.sort((a, b) => a.Order - b.Order).map(category => {
            return category.Size > 0 && <div data-category={category.Name.toLowerCase()}>
                <h4>
                    <span></span>
                    <label>{category.Name.toUpperCase()}</label>
                </h4>
                {ModuleMutable.List.filter(m => m.Enabled && m.Category === category.Name).map(module => {
                    return <div classList={{ selected: ModuleMutable.Current === module.ID }} onClick={() => module.Select()}>
                        <span>
                            {module.Icon && <Icon value={module.Icon} />}
                            {module.SVG && <img src={module.SVG} />}
                        </span>
                        <label>{module.Name}</label>
                    </div>
                })}
            </div>
        })}

    </section>;
}

export default Menu;
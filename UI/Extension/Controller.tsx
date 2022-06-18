import { createMutable } from "solid-js/store";
import { AbstractModule } from "../../Modules/AbstractModule";

export type Categories = 'Home' | 'Modules' | 'Options';

type T = {
    List: Array<AbstractModule>,
    Categories: Array<{ Name: Categories, Order: number, Size: number }>,
    Current: string
}

export const ModuleMutable = createMutable<T>({
    List: [],
    Categories: [
        { Name: 'Home', Order: 1, Size: 0 },
        { Name: 'Modules', Order: 2, Size: 0 },
        { Name: 'Options', Order: 3, Size: 0 }
    ],
    Current: null
});

export const InitMenu = () => {
    ModuleMutable.Categories.forEach(category => {
        category.Size = ModuleMutable.List.filter(module => module.Enabled === true && module.Category === category.Name).length;
    });
}
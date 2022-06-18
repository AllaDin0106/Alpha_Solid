import { createMutable } from 'solid-js/store';
import { AppBuilder } from './ApplicationBuilder';
import { Cache, InitCache } from './Cache';
import { InitUser } from './User';
import { InitWeb3 } from './Web3';
import { InitModules } from './Modules';
import { InitWallet } from './Wallet';

type A = { Cache: boolean, User: boolean, Web3: boolean, Wallet: boolean, Modules: boolean, Ready: boolean }

export const MutableMiddleware = createMutable<A>({
    Cache: false,
    User: false,
    Web3: false,
    Wallet: false,
    Modules: false,
    Ready: false
});

export interface IMiddleware {
    next(): Promise<boolean>;
}

abstract class Middleware implements IMiddleware {

    abstract promise: Function;
    abstract name: string;
    timeout: number;

    constructor(timeout = 50) {
        this.timeout = timeout;
    };

    next(): Promise<boolean> {
        return new Promise(resolve => {
            this.promise();

            if (Cache.Settings.DebugMode) console.log(`[DEBUG] ${this.name} initialized.`);

            setTimeout(() => resolve(true), this.timeout);
        });
    }
}   

export class CacheMiddleware extends Middleware {

    name: string = 'Cache';

    promise: Function = () => {
        InitCache();
        MutableMiddleware.Cache = true;
    }
}

export class UserMiddleware extends Middleware {
    name: string = 'User';
    promise: Function = () => {
        InitUser();
        MutableMiddleware.User = true;
    };

}

export class Web3Middleware extends Middleware {
    name: string = 'Web3';
    promise: Function = () => {
        InitWeb3();
        MutableMiddleware.Web3 = true;
    }
}

export class WalletMiddleware extends Middleware {
    name: string = 'Wallet';
    promise: Function = () => {
        InitWallet();
        MutableMiddleware.Wallet = true;
    }
}

export class ModulesMiddleware extends Middleware {
    name: string = 'Modules';
    promise: Function = () => {
        InitModules();
        MutableMiddleware.Modules = true;
    }
}

export class ReadyMiddleware implements IMiddleware {

    next(): Promise<boolean> {

        let { Cache, Web3, Wallet, Modules } = MutableMiddleware;

        return new Promise(resolve => {
            if (Cache && Web3 && Wallet && Modules) {
                MutableMiddleware.Ready = true;
                resolve(true);
            }
        })
    }
}
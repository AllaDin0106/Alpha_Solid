import { createMutable } from "solid-js/store";

type Authorization = { Level: 'new' | 'login' | 'authorized', Timeout: string }
type UserData = { Master: any, Password: any }
type UserEncryption = { Master: any, Password: any };
type UserTemp = { Seedphrase: string, Password1: string, Password2: string, TempSeed: any };
type Meta = { Key: string };
type Infura = { Key: string };

type Transaction = {
    From: string,
    To: string,
    Token?: string,
    Date: { Day: number, Month: number, Year: number, Minutes: number, Hours: number, Seconds: number, DayOfYear: number },
    Hash: string,
    Amount?: number,
    Type: 'Transfer' | 'CompoundSupply' | 'CompoundBorrow' | 'Uniswap' | 'Other',
    Exchange?: {
        Token1: string,
        Value1: number,
        Token2: string,
        Value2: number
    }
};

type Compound = { SelectedAccountIndex: number };
type Uniswap = { SelectedAccountIndex: number };

type E = Meta & { Last24H: number, Price: number, MarketCap: number, Volume: number, Timeout: string }
type S = Meta & { ID: string, Infura: Infura, Modules: any, DebugMode: boolean, Compound: Compound, Uniswap: Uniswap }
type U = Meta & { Auth: Authorization, Data: UserData, Encrypted: UserEncryption, Temp: UserTemp };
type W = Meta & { Network: 'Mainnet' | 'Ropsten', Size: number, MaxSize: number, History: Array<Transaction> };
type P = Meta & { List: {}, Timeout: string }

class CacheClass {

    Prices = createMutable<P>({
        Key: 'Prices',
        Timeout: null,
        List: {}
    })

    Ethereum = createMutable<E>({
        Key: 'Ethereum',
        Last24H: null,
        Price: null,
        MarketCap: null,
        Volume: null,
        Timeout: null
    });

    Settings = createMutable<S>({
        Key: 'Settings',
        ID: null,
        Infura: {
            Key: null
        },
        Modules: {},
        DebugMode: false,
        Compound: {
            SelectedAccountIndex: 0
        },
        Uniswap: {
            SelectedAccountIndex: 0
        }

    });

    User = createMutable<U>({
        Key: 'User',
        Data: { Master: null, Password: null },
        Encrypted: { Master: null, Password: null },
        Auth: { Level: 'new', Timeout: null },
        Temp: { Password1: null, Password2: null, Seedphrase: null, TempSeed: null }
    });

    Wallet = createMutable<W>({
        Key: 'Wallet',
        Size: 1,
        MaxSize: 10,
        Network: 'Ropsten',
        History: [],
    });

    constructor() {

        if (!localStorage['cache']) this.#Stringify();

        this.#Mutate([this.Ethereum, this.Settings, this.User, this.Wallet, this.Prices]);

        setInterval(() => this.#Stringify(), 50);
    }

    #Stringify = () => localStorage['cache'] = JSON.stringify({
        Ethereum: this.Ethereum,
        Settings: this.Settings,
        User: this.User,
        Wallet: this.Wallet,
        Prices: this.Prices
    });

    #Mutate = (mutables: Array<any>) => {

        mutables.forEach(mutable => {
            let item = JSON.parse(localStorage['cache'])[mutable.Key];

            if (!item) return; // Needed?

            Object.keys(mutable).forEach(key => {
                if (key != 'Temp' && item[key]) mutable[key] = item[key];
            });
        });
    }

    Clear = {
        Ethereum: () => {
            this.Ethereum.Last24H = null;
            this.Ethereum.MarketCap = null;
            this.Ethereum.Price = null;
            this.Ethereum.Volume = null;
            this.Ethereum.Timeout = null;
        },
        Settings: () => {
            this.Settings.ID = null;
        },
        User: () => {
            this.User.Data.Master = null;
            this.User.Data.Password = null;
            this.User.Encrypted.Master = null;
            this.User.Encrypted.Password = null;
            this.User.Auth.Level = 'new';
            this.User.Auth.Timeout = null;
        },
        Wallet: () => {
            this.Wallet.Size = 1;
            this.Wallet.MaxSize = 10;
            this.Wallet.Network = 'Ropsten';
        },
        Temp: () => {
            this.User.Temp = {
                Password1: null,
                Password2: null,
                Seedphrase: null,
                TempSeed: null
            }
        }
    }
}

export let Cache: CacheClass;
export const InitCache = () => Cache = new CacheClass();
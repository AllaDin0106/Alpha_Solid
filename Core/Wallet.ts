import { createSignal } from "solid-js";
import { createMutable } from "solid-js/store";
import { Expiration } from "../Definitions/Methods";
import { Cache } from "./Cache";
import { AccountKey } from "./Mnemonic";
import { InitTokens, Token } from "./Token";
import { User } from "./User";
import { Web3 } from "./Web3";

export class Account {

    #active; #setActive;
    #Tokens: Array<Token>;
    #TokenTimeout: any;
    #QueriedOnce: boolean;

    #Query: boolean;

    Index: number;
    Keys: AccountKey;

    get Active() { return this.#active(); }
    set Active(value: boolean) { this.#setActive(value); }

    get Tokens() {

        if (this.#Query) {
            if (!this.#QueriedOnce || (this.#TokenTimeout && Expiration.IsExpired(this.#TokenTimeout))) {
                this.#QueriedOnce = true;
                this.Query();
            }
        }

        return this.#Tokens;
    }

    constructor(index: number) {

        [this.#active, this.#setActive] = createSignal<boolean>(false);

        this.#QueriedOnce = false;
        this.#Query = true;

        this.Index = index;
        this.Keys = User.GetKey(this.Index)
        this.#Tokens = createMutable(InitTokens());
        this.#TokenTimeout = Expiration.MakeString(0.5);
    }

    ReadableAmount = (wei: number): number => wei / 1000000000000000000;
    ToWei = (num: number): number => num * 1000000000000000000;

    Query = () => {
        Web3.GetEthBalance(this.Keys.Address).then(result => this.#Tokens[0].Amount = this.ReadableAmount(result));

        for (let i = 1; i < this.#Tokens.length; i++)
            Web3.GetTokenBalance(this.Keys.Address, this.#Tokens[i].Address).then(result => this.#Tokens[i].Amount = this.ReadableAmount(result));

        this.#TokenTimeout = Expiration.MakeString(0.5);
    }
}

class WalletClass {

    Accounts: Array<Account>;

    constructor() {

        this.Accounts = [];
        for (let i = 0; i < Cache.Wallet.MaxSize; i++)
            this.Accounts.push(new Account(i));

        for (let i = 0; i < Cache.Wallet.Size; i++)
            this.Accounts[i].Active = true;
    }
}

export let Wallet: WalletClass;
export const InitWallet = () => Wallet = new WalletClass();
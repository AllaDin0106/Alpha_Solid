import { createMutable } from "solid-js/store";
import { Cache } from "../../Core/Cache";
import { Account, Wallet } from "../../Core/Wallet";
import { Web3 } from "../../Core/Web3";
import { DateOfYear } from "../Dashboard/Controller";

type Token = {
    Symbol: string,
    Max: number,
    Value: number,
    Valid: boolean
}

type T = {
    SelectedAccountIndex: number,
    SelectedAccountAddress: string,
    Account: Account,
    Tokens: Array<Token>,
    Valid: boolean,
    Fetching: boolean,
    Rate: number,
}

export const Mutable = createMutable<T>({
    SelectedAccountIndex: 0,
    SelectedAccountAddress: null,
    Account: null,
    Tokens: [],
    Valid: false,
    Fetching: null,
    Rate: 0
});

export const List = ['ETH', 'DAI', 'UNI', 'SHIB', 'THETA', 'CRO'];


export const InitUniswap = () => {
    Mutable.SelectedAccountIndex = Cache.Settings.Uniswap.SelectedAccountIndex
    Mutable.SelectedAccountAddress = Wallet.Accounts[Mutable.SelectedAccountIndex].Keys.Address;

    Mutable.Tokens.push({
        Symbol: 'ETH',
        Max: 0.0,
        Value: 0.0,
        Valid: false
    })

    Mutable.Tokens.push({
        Symbol: null,
        Max: 0.0,
        Value: 0.0,
        Valid: false
    })

    setTimeout(() => {
        Mutable.Tokens[0].Max = Wallet.Accounts[Cache.Settings.Uniswap.SelectedAccountIndex].Tokens[0].Amount
    }, 500);
}

export const SetToken = (token: Token, symbol) => {

    token.Symbol = symbol;
    let value = 0;
    let temp = Wallet.Accounts[Mutable.SelectedAccountIndex].Tokens.filter(token => token.Key === symbol);
    if (temp.length > 0) value = temp[0].Amount;
    token.Max = value;
}

export const Convert = () => {
    let price0 = Cache.Prices.List[Mutable.Tokens[0].Symbol];
    let price1 = Cache.Prices.List[Mutable.Tokens[1].Symbol];

    let ratio0 = Mutable.Tokens[0].Value * price0;
    let ratio1 = ratio0 / price1;

    Mutable.Fetching = true;

    setTimeout(() => {
        Mutable.Tokens[1].Value = ratio1;
        Mutable.Tokens[1].Valid = true;
        Mutable.Fetching = false;
    }, 2000);
}

export const TryGetWalletValue = (symbol: string) => {
    let value = 0;
    let token = Wallet.Accounts[Mutable.SelectedAccountIndex].Tokens.filter(token => token.Key === symbol);
    if (token.length > 0) value = token[0].Amount;

    return value;
}

export const TrySetValue = (token: Token, value: string) => {

    Mutable.Tokens[1].Valid = false;
    Mutable.Tokens[1].Value = 0;

    let a = parseFloat(value);
    if (isNaN(a)) { token.Valid = false; return; }

    token.Valid = a <= token.Max && a > 0;
    token.Value = a;

    if (Mutable.Tokens[0].Symbol && Mutable.Tokens[1].Symbol)
        Convert();

}

export const PerformSwap = () => {
    setTimeout(() => {
        let date = new Date();
                Cache.Wallet.History.push({
            From: null,
            To: null,
            Hash: Web3.Web3.utils.randomHex(32),
            Type: 'Uniswap',
            Date: {
                Day: date.getDate(),
                Month: date.getMonth() + 1,
                Year: date.getFullYear(),
                Seconds: date.getSeconds(),
                Minutes: date.getMinutes(),
                Hours: date.getHours(),
                DayOfYear: DateOfYear(date.getDate(), date.getMonth(), date.getFullYear())
            },
            Exchange: {
                Token1: Mutable.Tokens[0].Symbol,
                Token2: Mutable.Tokens[1].Symbol,
                Value1: Mutable.Tokens[0].Value,
                Value2: Mutable.Tokens[1].Value
            }
        });
    }, 3000);

}
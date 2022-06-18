import { createMutable } from "solid-js/store";
import { Cache } from "../../Core/Cache";
import { Web3 } from "../../Core/Web3";
import { DateOfYear } from "../Dashboard/Controller";

export const Mutable = createMutable({
    Address: {
        Valid: null,
        Value: null
    },
    Amount: {
        Valid: null,
        Value: null
    },
    Transaction: {
        From: null,
        Token: null
    },
    Gas: null,
    Sent: false
});

export const InitSendMutable = () => {
    Mutable.Address.Valid = null;
    Mutable.Address.Value = null;
    Mutable.Amount.Valid = null;
    Mutable.Amount.Value = null;
    Mutable.Transaction.From = null;
    Mutable.Transaction.Token = null;
    Mutable.Gas = null;
    Mutable.Sent = false;
}

export const TryAddress = (address: string) => {

    Mutable.Address.Value = null;

    if (address === '') Mutable.Address.Valid = null;
    else {
        Mutable.Address.Valid = Web3.IsValidAddress(address);
        Mutable.Address.Value = address;
    }
}

export const TryParseAmount = (amount: string, max: number) => {

    Mutable.Amount.Value = null;
    Mutable.Gas = null;

    if (amount === '') { Mutable.Amount.Valid = null; return; }

    let a = parseFloat(amount);

    if (isNaN(a)) { Mutable.Amount.Valid = false; return; }

    Mutable.Amount.Valid = a <= max && a > 0;
    Mutable.Amount.Value = a;
}

const AddTransactionToHistory = (result: any) => {

    let date = new Date();

    Cache.Wallet.History.push({
        From: Mutable.Transaction.From,
        To: Mutable.Address.Value,
        Token: Mutable.Transaction.Token,
        Amount: Mutable.Amount.Value,
        Hash: result.transactionHash,
        Date: {
            Day: date.getDate(),
            Month: date.getMonth() + 1,
            Year: date.getFullYear(),
            Seconds: date.getSeconds(),
            Minutes: date.getMinutes(),
            Hours: date.getHours(),
            DayOfYear: DateOfYear(date.getDate(), date.getMonth(), date.getFullYear())
        },
        Type: 'Transfer'
    });
}

export const SendEthereumTransaction = (privateKey) => {
    if (Mutable.Address.Valid && Mutable.Amount.Valid)
        Web3.SendEthereumTransaction(privateKey, Mutable.Address.Value, Mutable.Amount.Value)
            .then(AddTransactionToHistory);
    Mutable.Sent = true;
}

export const SendTokenTransaction = (privateKey, fromAddress, tokenAddress: string) => {
    if (Mutable.Address.Valid && Mutable.Amount.Valid)
        Web3.SendTokenTranscation(privateKey, fromAddress, Mutable.Address.Value, tokenAddress, Mutable.Amount.Value)
            .then(AddTransactionToHistory);
    Mutable.Sent = true;
}

export const TrySetIcon = (bool: boolean): any => {
    if (bool === null) return null;
    if (bool) return { name: 'check', side: 'right' };
    else return { name: 'xmark', side: 'right' };
}
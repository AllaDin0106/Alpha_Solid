import { Cache } from "../../Core/Cache"
import { Web3Wrapper } from "../../Core/Crypto";
import { Wallet } from "../../Core/Wallet";
import { Web3 } from "../../Core/Web3";

export const ChangeWalletSize = (direction: -1 | 1) => {
    let size = Cache.Wallet.Size + direction;
    if (size < 1) size = 1;
    if (size > Cache.Wallet.MaxSize) size = Cache.Wallet.MaxSize;
    Cache.Wallet.Size = size;

    for (let i = 0; i < size; i++)
        Wallet.Accounts[i].Active = true;
    for (let i = size; i < Cache.Wallet.MaxSize; i++)
        Wallet.Accounts[i].Active = false;
}

export const SetProvider = (provider: string) => {
    Cache.Settings.Infura.Key = provider;
    Web3.Web3 = Web3Wrapper.New(Web3.Provider);
}
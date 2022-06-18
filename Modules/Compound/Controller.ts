import { createMutable } from 'solid-js/store';
import { Wallet } from '../../Core/Wallet';
import { Web3 } from '../../Core/Web3';
import { Cache } from '../../Core/Cache'
import { DateOfYear } from '../Dashboard/Controller';

import Ropsten from './JSON/ropsten';
import RopstenABI from './JSON/ropsten-abi';
import ERC20ABI from './JSON/erc20-abi';

export type Token = {
    Symbol: string,
    Name: string,
    Address: string,
    Contract?: any
    Balance?: number,
    Decimals?: number,
    USD?: number
};

export type cToken = Token & {
    APY?: {
        Supply?: number,
        Borrow?: number
    },
    Underlying?: {
        Balance?: number,
        Address?: string
    }
    cBalance: {
        Supply: number,
        Borrow: number
    }

};

type TransactionValues = {
    Value: number,
    Token: string,
    Valid: boolean,
    Executed: boolean
}

type T = {
    Timeout: any,
    Tokens: Array<Token>,
    cTokens: Array<cToken>,
    Transaction: TransactionValues,
    Accrued: number,
    SelectedAccountAddress: string,
    TotalBorrowUSD: number,
    TotalSupplyUSD: number,
    AverageAPY: number
}

export const Mutable = createMutable<T>({
    Timeout: null,
    Tokens: [],
    cTokens: [],
    Transaction: {
        Value: null,
        Token: null,
        Valid: false,
        Executed: false
    },
    Accrued: 0,
    SelectedAccountAddress: null,
    TotalBorrowUSD: 0,
    TotalSupplyUSD: 0,
    AverageAPY: 0
})

const List = ['ETH', 'COMP', 'BAT', 'DAI', 'UNI', 'USDT', "USDC"];

let Comptroller: any;

export const GetAPY = async (token: cToken) => {
    const EthMantissa = 1e18;
    const BlocksPerDay = 6570;
    const DaysPerYear = 365;

    const supplyRatePerBlock = await token.Contract.methods.supplyRatePerBlock().call();
    const borrowRatePerBlock = await token.Contract.methods.borrowRatePerBlock().call();
    const supplyApy = (((Math.pow((supplyRatePerBlock / EthMantissa * BlocksPerDay) + 1, DaysPerYear))) - 1) * 100;
    const borrowApy = (((Math.pow((borrowRatePerBlock / EthMantissa * BlocksPerDay) + 1, DaysPerYear))) - 1) * 100;

    return {
        SupplyAPY: supplyApy,
        BorrowAPY: borrowApy
    }
}

export const IsValidTransacton = (value, max) => {
    let a = parseFloat(value);

    if (isNaN(a)) {
        Mutable.Transaction.Valid = false;
        return;
    }
    Mutable.Transaction.Value = value;
    Mutable.Transaction.Valid = a <= max && a > 0;
}

export const GetBalance = async (token: Token | cToken, address: string) => {
    return await token.Contract.methods.balanceOf(address).call() / 1e8;
}

export const GetBorrowBalance = async (token: cToken) => {
    return await token.Contract.methods.borrowBalanceCurrent(Mutable.SelectedAccountAddress).call();
}

export const GetSupplyBalance = async (token: cToken) => {
    return await token.Contract.methods.balanceOfUnderlying(Mutable.SelectedAccountAddress).call();
}

export const GetUSDPrice = (symbol: string) => {
    return Cache.Prices.List[symbol];
};

export const GetUnderlyingBalance = async (token: cToken) => {

    const cTokenDecimals = token.Decimals;
    const underlying = new Web3.Web3.eth.Contract(ERC20ABI, token.Address);
    const underlyingDecimals = await underlying.methods.decimals().call();
    const exchangeRateCurrent = await token.Contract.methods.exchangeRateCurrent().call();
    const mantissa = 18 + parseInt(underlyingDecimals) - cTokenDecimals;
    const oneCTokenInUnderlying = exchangeRateCurrent / Math.pow(10, mantissa);

    return token.Balance * oneCTokenInUnderlying / 10000000000;
}


export const InitCompound = async () => {

    Mutable.SelectedAccountAddress = Wallet.Accounts[Cache.Settings.Compound.SelectedAccountIndex].Keys.Address;
    Mutable.Tokens = [];
    Mutable.cTokens = [];
    Comptroller = new Web3.Web3.eth.Contract(RopstenABI['Comptroller'], Ropsten.Contracts['Comptroller']);

    // Tokens
    List.forEach(token => {

        if (token !== 'ETH') {
            let t = Ropsten.Tokens[token];

            Mutable.Tokens.push({
                Name: t.name,
                Symbol: t.symbol,
                Balance: 0,
                USD: GetUSDPrice(t.symbol),
                Address: Ropsten.Tokens[token].address,
                Contract: new Web3.Web3.eth.Contract(RopstenABI[t.symbol], Ropsten.Contracts[t.symbol]),
                Decimals: Ropsten.Tokens['c' + t.symbol].decimals
            })
        }
    });

    Mutable.Tokens.forEach(token => {
        GetBalance(token, Mutable.SelectedAccountAddress).then(result => {
            token.Balance = result / 10000000000
            token.USD = token.Balance
        });

    })

    Mutable.Tokens.push({
        Name: 'Ether',
        Address: null,
        Symbol: 'ETH',
        Balance: 0,
        USD: 0
    });

    Web3.GetEthBalance(Wallet.Accounts[Cache.Settings.Compound.SelectedAccountIndex].Keys.Address).then(result => {
        Mutable.Tokens.filter(token => token.Symbol === 'ETH')[0].Balance = result / 1e18;
        Mutable.Tokens.filter(token => token.Symbol === 'ETH')[0].USD = Cache.Prices.List['ETH'] * result / 1e18;
    });

    // cTokens
    List.forEach(ctoken => {

        let t = Ropsten.Tokens[ctoken];

        Mutable.cTokens.push({
            Name: t.name,
            Balance: 0,
            USD: 0,
            Symbol: 'c' + t.symbol,
            Address: Ropsten.Tokens['c' + ctoken].address,
            Underlying: {
                Balance: 0,
                Address: Ropsten.Tokens['c' + ctoken].underlying
            },
            APY: {
                Borrow: 0,
                Supply: 0
            },
            Contract: new Web3.Web3.eth.Contract(RopstenABI['c' + t.symbol], Ropsten.Contracts['c' + t.symbol]),
            Decimals: Ropsten.Tokens['c' + t.symbol].decimals,
            cBalance: {
                Borrow: 0,
                Supply: 0
            }
        })
    });

    Mutable.cTokens.forEach(ctoken => {
        GetAPY(ctoken).then(result => ctoken.APY = { Borrow: result.BorrowAPY, Supply: result.SupplyAPY });
        GetBalance(ctoken, Mutable.SelectedAccountAddress).then(result => ctoken.Balance = result);
        GetUnderlyingBalance(ctoken).then(result => ctoken.Underlying.Balance = result);
        GetBorrowBalance(ctoken).then(result => {
            ctoken.cBalance.Borrow = result / 1e18;
            ctoken.USD = ctoken.cBalance.Borrow * GetUSDPrice(ctoken.Symbol.substring(1));
        });
        GetSupplyBalance(ctoken).then(result => {
            ctoken.cBalance.Supply = result / 1e18;
            ctoken.USD = result / 1e18 * GetUSDPrice(ctoken.Symbol.substring(1));
        });
    });

    await Comptroller.methods.compAccrued(Mutable.SelectedAccountAddress).call().then(result => {
        Mutable.Accrued = result / 1e17;
    });

    setTimeout(() => {
        Mutable.TotalBorrowUSD = Mutable.cTokens.filter(ctoken => ctoken.cBalance.Borrow > 0).reduce((a, b) => b.USD + a, 0);
        Mutable.TotalSupplyUSD = Mutable.cTokens.filter(ctoken => ctoken.cBalance.Supply > 0).reduce((a, b) => b.USD + a, 0);

        let [avg, size] = [0, 0];
        Mutable.cTokens.filter(ctoken => ctoken.cBalance.Borrow > 0).forEach(ctoken => { avg += ctoken.APY.Borrow; size++; });
        Mutable.AverageAPY = avg / size;
    }, 1000);
}

const MakeAddres = () => {
    let privateKey = Wallet.Accounts[Cache.Settings.Compound.SelectedAccountIndex].Keys.Private;
    Web3.Web3.eth.accounts.wallet.add('0x' + privateKey);
    return Web3.Web3.eth.accounts.wallet[0].address;
}

const Supply = (token: Token) => {

    Mutable.Transaction.Executed = true;
    Mutable.Transaction.Token = token.Symbol;

    let cToken = Mutable.cTokens.filter(ctoken => ctoken.Symbol === 'c' + token.Symbol)[0];
    let address = MakeAddres();

    cToken.Contract.methods.mint().send({ from: address, value: Web3.ToWei(Mutable.Transaction.Value), gas: "20000000" })
        .then(receipt => {
            let date = new Date();
            Cache.Wallet.History.push({
                From: null,
                To: null,
                Token: Mutable.Transaction.Token,
                Amount: Mutable.Transaction.Value,
                Hash: receipt.transactionHash,
                Type: 'CompoundSupply',
                Date: {
                    Day: date.getDate(),
                    Month: date.getMonth() + 1,
                    Year: date.getFullYear(),
                    Seconds: date.getSeconds(),
                    Minutes: date.getMinutes(),
                    Hours: date.getHours(),
                    DayOfYear: DateOfYear(date.getDate(), date.getMonth(), date.getFullYear())
                }
            });
            return;
        })
}

const Withdraw = (token: cToken) => {
    Mutable.Transaction.Executed = true;
    Mutable.Transaction.Token = token.Symbol;

    let cToken = Mutable.cTokens.filter(ctoken => ctoken.Symbol === token.Symbol)[0];
    let address = MakeAddres();

    cToken.Contract.methods.redeemUnderlying(Web3.ToWei(Mutable.Transaction.Value)).send({ from: address, gas: "20000000" })
        .then(receipt => {
            let date = new Date();
            Cache.Wallet.History.push({
                From: null,
                To: null,
                Token: Mutable.Transaction.Token,
                Amount: Mutable.Transaction.Value,
                Hash: receipt.transactionHash,
                Type: 'CompoundSupply',
                Date: {
                    Day: date.getDate(),
                    Month: date.getMonth() + 1,
                    Year: date.getFullYear(),
                    Seconds: date.getSeconds(),
                    Minutes: date.getMinutes(),
                    Hours: date.getHours(),
                    DayOfYear: DateOfYear(date.getDate(), date.getMonth(), date.getFullYear())
                }
            });
            return;
        })
}

const Borrow = (token) => {
    Mutable.Transaction.Executed = true;
    Mutable.Transaction.Token = token.Symbol;

    let cToken = Mutable.cTokens.filter(ctoken => ctoken.Symbol === 'c' + token.Symbol)[0];
    let address = MakeAddres();

    cToken.Contract.methods.borrow(Web3.ToWei(Mutable.Transaction.Value)).send({ from: address, gas: '20000000' })
        .then(receipt => {
            let date = new Date();
            Cache.Wallet.History.push({
                From: null,
                To: null,
                Token: Mutable.Transaction.Token,
                Amount: Mutable.Transaction.Value,
                Hash: receipt.transactionHash,
                Type: 'CompoundBorrow',
                Date: {
                    Day: date.getDate(),
                    Month: date.getMonth() + 1,
                    Year: date.getFullYear(),
                    Seconds: date.getSeconds(),
                    Minutes: date.getMinutes(),
                    Hours: date.getHours(),
                    DayOfYear: DateOfYear(date.getDate(), date.getMonth(), date.getFullYear())
                }
            });
            return;
        })
}

const Repay = (token) => {
    Mutable.Transaction.Executed = true;
    Mutable.Transaction.Token = token.Symbol;

    let address = MakeAddres();

    try {
        token.Contract.methods.repayBorrow(Web3.ToWei(Mutable.Transaction.Value)).send({ from: address, gas: '20000000' })
            .then(receipt => {
                let date = new Date();
                Cache.Wallet.History.push({
                    From: null,
                    To: null,
                    Token: Mutable.Transaction.Token,
                    Amount: Mutable.Transaction.Value,
                    Hash: receipt.transactionHash,
                    Type: 'CompoundBorrow',
                    Date: {
                        Day: date.getDate(),
                        Month: date.getMonth() + 1,
                        Year: date.getFullYear(),
                        Seconds: date.getSeconds(),
                        Minutes: date.getMinutes(),
                        Hours: date.getHours(),
                        DayOfYear: DateOfYear(date.getDate(), date.getMonth(), date.getFullYear())
                    }
                });
                return;
            })
    } catch (e) {
        console.log(e.message);
    }
}

export const Actions = {
    Supply: Supply,
    Borrow: Borrow,
    Withdraw: Withdraw,
    Repay: Repay
}
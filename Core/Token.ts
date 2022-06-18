import { Cache } from "./Cache";

export type Token = {
    Key: string,
    Name: string,
    Address?: string,
    Amount: number
};

export const InitTokens = () => {

    let List: Array<Token> = [];

    const Push = (key, name, address?) => List.push({
        Key: key,
        Name: name,
        Address: address,
        Amount: 0
    });

    if (Cache.Wallet.Network === 'Mainnet') {

        Push('ETH', 'Ethereum');
        Push('USDT', 'Tether USD', '0xdAC17F958D2ee523a2206206994597C13D831ec7');
        Push('BNB', 'BNB', '0xB8c77482e45F1F44dE1745F52C74426C631bDD52');
        Push('USDC', 'USD Coin', '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48');
        Push('HEX', 'HEX', '0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39');
        Push('LUNA', 'Wrapped Luna', '0xd2877702675e6cEb975b4A1dFf9fb7BAF4C91ea9');
        Push('BUSD', 'Binance USD', '0x4Fabb145d64652a948d72533023f6E7A623C7C53');
        Push('SHIB', 'SHIBA INU', '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE');
        Push('stETH', 'stETH', '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84');
        Push('wstETH', 'Wrapped Liquid Staked Ether 2.0', '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0');
        Push('WBTC', 'Wrapped BTC', '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599');
        Push('DAI', 'Dai Stablecoin', '0x6B175474E89094C44Da98b954EedeAC495271d0F');
        Push('MATIC', 'Matic', '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0');
        Push('CRO', 'Cronos Coin', '0xA0b73E1Ff0B80914AB6fe0444E65848C4C34450b');
        Push('LEO', 'Bitfinex LEO', '0x2AF5D2aD76741191D15Dfe7bF6aC92d4Bd912Ca3');
        Push('THETA', 'Theta', '0x3883f5e181fccaF8410FA61e12b59BAd963fb645');
        Push('LINK', 'ChainLink', '0x514910771AF9Ca656af840dff83E8264EcF986CA');
        Push('OKB', 'OKB', '0x75231F58b43240C9718Dd58B4967c5114342a86c');
        Push('UNI', 'Uniswap', '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984');
    }

    if (Cache.Wallet.Network === 'Ropsten') {

        Push('ETH', 'Ethereum');
        Push('DAI', 'Dai Stablecoin', '0xaD6D458402F60fD3Bd25163575031ACDce07538D');
        Push('UNI', 'Uniswap', '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984');
    }

    return List;
}
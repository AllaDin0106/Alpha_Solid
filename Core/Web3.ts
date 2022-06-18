import { Expiration } from "../Definitions/Methods";
import { Cache } from "./Cache";
import { Web3Wrapper } from "./Crypto";

class Web3Class {

    Web3: any;

    ChainIDs;

    get Provider() {
        if (Cache.Wallet.Network === 'Mainnet') return `https://mainnet.infura.io/v3/${Cache.Settings.Infura.Key}`;
        if (Cache.Wallet.Network === 'Ropsten') return `https://ropsten.infura.io/v3/${Cache.Settings.Infura.Key}`;
    }

    constructor() {
        this.Web3 = Web3Wrapper.New(this.Provider);
        this.ChainIDs = {
            'Mainnet': 1,
            'Ropsten': 3
        }

        this.GetAllPrices();
    }

    SetProvider = (network: typeof Cache.Wallet.Network) => {
        Cache.Wallet.Network = network;
        this.Web3.setProvider(this.Provider)
    }

    GetEthBalance = async (address: string) => this.Web3.eth.getBalance(address);

    GetTokenBalance = async (walletAddress: string, tokenAddress: string) => {
        let ABI = [{
            constant: true,
            inputs: [{ name: "_owner", type: "address" }],
            name: "balanceOf",
            outputs: [{ name: "balance", type: "uint256" }],
            type: "function"
        }];

        try {
            const contract = new this.Web3.eth.Contract(ABI, tokenAddress);
            return await contract.methods.balanceOf(walletAddress).call();
        } catch (e) {
            return 0;
        }
    }

    GetAllPrices = async () => {

        if (!Cache.Prices.Timeout || Expiration.IsExpired(Cache.Prices.Timeout))
            fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false')
                .then(result => result.json())
                .then(result => {
                    result.forEach(token => {
                        Cache.Prices.List[(token.symbol as string).toUpperCase()] = token.current_price;
                        console.log(token.symbol, token.current_price)
                    });

                    Cache.Prices.List['cETH'] = Cache.Prices.List['ETH'];
                })

        if (!Cache.Prices.Timeout || Expiration.IsExpired(Cache.Prices.Timeout))
            Cache.Prices.Timeout = Expiration.MakeString(30);
    }

    IsValidAddress = (address: string) => {
        return this.Web3.utils.isAddress(address);
    }

    ToBN = (amount: number) => this.Web3.utils.toBN(amount);
    ToWei = (amount: number) => this.Web3.utils.toWei(amount.toString(), 'ether');

    SendEthereumTransaction = async (privateKey, toAddress, amount) => {
        const signer = this.Web3.eth.accounts.privateKeyToAccount(privateKey);

        this.Web3.eth.accounts.wallet.add(signer);

        const limit = this.Web3.eth.estimateGas({
            from: signer.address,
            to: toAddress,
            value: this.ToWei(amount)
        });

        const tx = {
            from: signer.address,
            to: toAddress,
            value: this.Web3.utils.numberToHex(this.ToWei(amount)),
            gas: this.Web3.utils.toHex(limit),
            nonce: this.Web3.eth.getTransactionCount(signer.address),
            maxPriorityFeePerGas: this.Web3.utils.toHex(this.Web3.utils.toWei('2', 'gwei')),
            chainId: this.ChainIDs[Cache.Wallet.Network],
            type: 0x2
        };

        const signedTx = await this.Web3.eth.accounts.signTransaction(tx, signer.privateKey)

        try { return await this.Web3.eth.sendSignedTransaction(signedTx.rawTransaction); }
        catch (error) { console.log(error.message); }
    }

    SendTokenTranscation = async (privateKey, fromAddress, toAddress, tokenAddress, amount) => {

        // https://gist.github.com/veox/8800debbf56e24718f9f483e1e40c35c
        let ABI = [{
            "constant": false,
            "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }],
            "name": "transfer",
            "outputs": [{ "name": "", "type": "bool" }],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }];

        const signer = this.Web3.eth.accounts.privateKeyToAccount(privateKey);
        const nonce = this.Web3.eth.getTransactionCount(signer.address);
        const tokenAmount = this.ToWei(amount);

        this.Web3.eth.accounts.wallet.add(signer);

        let contract = new this.Web3.eth.Contract(ABI, tokenAddress, { from: signer.address })
        let data = contract.methods.transfer(toAddress, tokenAmount).encodeABI()

        const tx = {
            value: '0x0',
            nonce: nonce,
            data: data,
            from: signer.address,
            to: tokenAddress,
            gas: this.Web3.eth.gasPrice,
            gasLimit: 100000,
            chainId: this.ChainIDs[Cache.Wallet.Network],
            type: 0x2
        };

        const signedTx = await this.Web3.eth.accounts.signTransaction(tx, signer.privateKey)

        try { return await this.Web3.eth.sendSignedTransaction(signedTx.rawTransaction); }
        catch (error) { console.log(error.message); }
    }
}

export let Web3: Web3Class;
export const InitWeb3 = () => Web3 = new Web3Class();


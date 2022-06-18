import CryptoJS from 'crypto-js';

declare global {
    interface Window {
        cryptojs: any;
        wallet: {
            HDKey: any,
            BitcoinAddress: any,
            EthereumAddress: any,
            Mnemonic: any
        },
        buffer: any,
        web3: any
    }
};

const _crypto = window.cryptojs;

const _wallet = window.wallet;
const _buffer = window.buffer;
const _web3 = window.web3;

const Crypto = {
    createHmac: (alg, key) => _crypto.createHmac(alg, key),
    randomBytes: (size, cb = null) => _crypto.randomBytes(size, cb)
};

const Buffer = {
    from: (value, encodingOffset) => _buffer.Buffer.from(value, encodingOffset),
    fromArray: array => _buffer.Buffer.from(array)
};

const Wallet = {
    Mnemonic: {
        Generate: entropy => _wallet.Mnemonic.generate(entropy),
        Parse: phrase => _wallet.Mnemonic.parse(phrase)
    },
    HDKey: {
        ParseMasterSeed: seed => _wallet.HDKey.parseMasterSeed(seed),
        ParseExtendedKey: extendedprivatekey => _wallet.HDKey.parseExtendedKey(extendedprivatekey),
        New: (privateKey, chainCode) => new _wallet.HDKey({ algorithm: "secp256k1", privateKey: privateKey, chainCode: chainCode })
    },
    Address: publicKey => _wallet.EthereumAddress.from(Buffer.from(publicKey, 'hex')).address
};

const Web3Wrapper = {
    New: provider => new _web3(provider),
    Web3Client: provider => new _web3(new _web3.providers.HttpProvider(provider))
}

const Hash = message => CryptoJS.SHA256(message).toString(CryptoJS.enc.hex);
const Encrypt = (message, key) => CryptoJS.AES.encrypt(message, key).toString();
const Decrypt = (cipher, key) => {
    let bytes = CryptoJS.AES.decrypt(cipher, key);
    return bytes.toString(CryptoJS.enc.Utf8);
};

export { Crypto, Wallet, Buffer, Web3Wrapper };
export { Encrypt, Decrypt, Hash }

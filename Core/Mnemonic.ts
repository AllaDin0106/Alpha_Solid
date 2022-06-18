import { Wallet, Crypto } from "./Crypto";

export type AccountKey = {
    Public: string | null,
    Private: string | null,
    Address: string | null
}

const Generate = (bytes = 16) => {
    const mnemonic = Wallet.Mnemonic.Generate(Crypto.randomBytes(bytes));

    return {
        Phrase: mnemonic.phrase,
        Seed: mnemonic.toSeed()
    };
};

const Parse = (phrase: string) => {
    const mnemonic = Wallet.Mnemonic.Parse(phrase);

    return {
        Entropy: mnemonic.entropy,
        Phrase: mnemonic.phrase,
        Seed: mnemonic.toSeed()
    };
};

const GetMaster = seed => Wallet.HDKey.ParseMasterSeed(seed);

const GetKey = (master, index = 0): AccountKey => {

    if (!master) return { Private: null, Public: null, Address: null };

    let extendedPrivateKey = master.derive("m/44'/60'/0'/0").extendedPrivateKey;
    let childKey = Wallet.HDKey.ParseExtendedKey(extendedPrivateKey);
    let wallet = childKey.derive(index.toString());
    let privateKey = wallet.privateKey.toString('hex');
    let publicKey = wallet.publicKey.toString('hex');

    return {
        Private: privateKey,
        Public: publicKey,
        Address: Wallet.Address(publicKey)
    }
}

const NewHDKey = (privateKey, chainCode) => Wallet.HDKey.New(privateKey, chainCode);

export { Generate, Parse, GetMaster, GetKey, NewHDKey };

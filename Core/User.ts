import { Expiration } from "../Definitions/Methods";
import { LoginMode, LoginMutable, LoginScreen } from "../UI/Login/Controller";
import { Cache } from "./Cache";
import { Decrypt, Encrypt, Hash, Buffer } from "./Crypto";
import { AccountKey, Generate, GetKey, GetMaster, NewHDKey, Parse } from "./Mnemonic";

class UserClass {
    constructor() {
        this.#Timeout();
        this.#Authenticate();
    }

    #Authenticate = () => {

        if (Cache.User.Encrypted.Master && Cache.User.Encrypted.Password && Cache.User.Data.Password) {
            if (Hash(Cache.User.Data.Password) === Cache.User.Encrypted.Password)
                Cache.User.Auth.Level = "authorized";
        }

        else if (Cache.User.Encrypted.Master && Cache.User.Encrypted.Password)
            Cache.User.Auth.Level = 'login';

        else Cache.User.Auth.Level = 'new';
    };

    #Timeout = () => {
        if (Cache.User.Auth.Timeout)
            if (Expiration.IsExpired(Cache.User.Auth.Timeout))
                Cache.User.Data.Password = null;
    };

    ValidatePassword = () => {
        let matching = Cache.User.Temp.Password1 === Cache.User.Temp.Password2;
        let validLength = Cache.User.Temp.Password1.length >= 6;
        LoginMutable.Next.Active = matching && validLength;
    }

    Create = {
        Generate: () => {
            const Generated = Generate();
            Cache.User.Temp.TempSeed = Generated.Seed;
            Cache.User.Temp.Seedphrase = Generated.Phrase;
        }
    };

    Import = {
        IsValid: (phrase: string) => {
            try {
                const Data = Parse(phrase);
                Cache.User.Temp.Seedphrase = Data.Phrase;
                Cache.User.Temp.TempSeed = Data.Seed;
                return true;
            } catch (e) {
                return false;
            }
        },
    };

    LogIn = () => {

        Cache.User.Encrypted.Password = Hash(Cache.User.Temp.Password1);

        if (Cache.User.Temp.Password1)
            Cache.User.Data.Password = Cache.User.Temp.Password1;

        if (Cache.User.Temp.TempSeed)
            Cache.User.Encrypted.Master = Encrypt(JSON.stringify(GetMaster(Cache.User.Temp.TempSeed)), Cache.User.Data.Password);

        Cache.User.Data.Master = JSON.parse(Decrypt(Cache.User.Encrypted.Master, Cache.User.Data.Password));
        Cache.User.Auth.Timeout = Expiration.MakeString(30);

        setTimeout(() => Cache.User.Auth.Level = 'authorized', 3500);
    }

    SignOut = () => {
        Cache.Clear.Ethereum();
        Cache.Clear.Settings();
        Cache.Clear.User();
        Cache.Clear.Temp();
        Cache.Clear.Wallet();

        LoginMutable.Mode = LoginMode.Pre;
        LoginMutable.Screen = LoginScreen.Splash;
    }

    get #Master() {
        try {
            const Transient = Cache.User.Data.Master;
            const Buffer1 = Buffer.fromArray(Transient._privateKey.data);
            const Buffer2 = Buffer.fromArray(Transient._chainCode.data);
            const MasterKey = NewHDKey(Buffer1, Buffer2);
            return MasterKey;
        } catch (e) { }
    }

    GetKey = (index: number): AccountKey => GetKey(this.#Master, index);
}

export let User: UserClass;
export const InitUser = () => User = new UserClass();
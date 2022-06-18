import './Wallet.css';
import { createSignal } from "solid-js";
import { Wallet as WalletObject } from "../../Core/Wallet";
import { Button, Icon, Input, Modal, Options, Tooltip } from "../../Components/Components";
import { Cache } from "../../Core/Cache";
import { AbstractModule } from "../AbstractModule";
import { StringEllipsis, ToClipboard } from "../../Definitions/Methods";
import { Hash } from '../../Core/Crypto';
import { InitSendMutable, Mutable, SendEthereumTransaction, SendTokenTransaction, TryAddress, TryParseAmount, TrySetIcon } from './Controller';
import { ModuleMutable } from '../../UI/Extension/Controller';

class Wallet extends AbstractModule {

    constructor() {
        super();

        this.Name = 'Wallet';
        this.AlwaysEnabled = true;
        this.Icon = 'wallet';

        this.Component = () => this.Content();

        this.PostConstructor();
    }

    Content = () => {

        const Items = WalletObject.Accounts.filter(a => a.Active);
        const [selected, setSelected] = createSignal<number>(0);

        return <>
            {!Cache.Settings.Infura.Key && <div class='no-infura-key'>
                <label>Infura Project API key was not found.</label>
                <br />
                <br />
                <span onClick={() => ModuleMutable.Current = ModuleMutable.List.filter(m => m.Name === 'Settings')[0].ID}>Go to the settings panel to add a key.</span>
            </div>}
            {Cache.Settings.Infura.Key && <><Options getter={selected} setter={setSelected} items={Items.map((_, i) => `Account #${i + 1}`)} />

                {Items.map((Account) => {

                    const [tooltip, setTooltip] = createSignal<boolean>(false);
                    const [privateShowing, setPrivateShowing] = createSignal<boolean>(false);

                    return Account.Index === selected() && <div class='account'>
                        <div class='keys'>
                            <div onClick={() => ToClipboard(Account.Keys.Address)}>
                                <span>Address</span>
                                <span>{StringEllipsis(Account.Keys.Address)}</span>
                            </div>
                            <div onClick={() => ToClipboard(Account.Keys.Public)}>
                                <span>Public</span>
                                <span>{StringEllipsis(Account.Keys.Public)}</span>
                            </div>
                            <div classList={{ private: true, open: tooltip() }} onClick={() => {
                                if (!privateShowing()) setTooltip(true)
                                else ToClipboard(Account.Keys.Private);
                            }}>
                                <span>Private</span>
                                <span>
                                    {!privateShowing() && <><Icon value='key' /> Unlock</>}
                                    {privateShowing() && StringEllipsis(Account.Keys.Private)}
                                </span>
                                {tooltip() && !privateShowing() && <Tooltip anchor='bottom'>
                                    <h4>Confirm Password</h4>
                                    <br />
                                    <Input type='password' onInput={e => {
                                        if (Cache.User.Encrypted.Password === Hash(e.currentTarget.value)) {
                                            setTooltip(false);
                                            setPrivateShowing(true);
                                        }
                                    }} />
                                </Tooltip>}
                            </div>
                        </div>
                        <br />
                        <br />
                        <div class='assets'>
                            {Account.Tokens.filter(token => token.Amount > 0).map(token => {
                                return <div>
                                    <div class='asset-wrapper'>
                                        <div class='asset'>
                                            <h5>{token.Name}</h5>
                                            <div>
                                                <span class='amount'>{token.Amount.toFixed(2)}</span>
                                                <span class='key'>{token.Key}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <Modal value={<Button type='secondary' icon='arrow-right' value='Send' onClick={() => InitSendMutable()} />}>
                                                {!Mutable.Sent &&
                                                    <div class='send-wrapper'>
                                                        <h3><img src={`/tokens/${token.Key}.webp`} /> Send {token.Name}</h3>
                                                        <div>
                                                            <div class='address'>
                                                                <span>Address</span>
                                                                <Input
                                                                    placeholder='Enter a valid address'
                                                                    onInput={e => TryAddress(e.currentTarget.value)}
                                                                    icon={TrySetIcon(Mutable.Address.Valid)} />
                                                            </div>
                                                            <div class='amount'>
                                                                <span>Amount</span>
                                                                <Input
                                                                    placeholder={`Enter a valid amount (MAX: ${token.Amount.toFixed(2)})`}
                                                                    onInput={e => {
                                                                        TryParseAmount(e.currentTarget.value, token.Amount);
                                                                    }}
                                                                    icon={TrySetIcon(Mutable.Amount.Valid)} />
                                                            </div>
                                                            <br />
                                                            <br />
                                                            <div>
                                                                <Button
                                                                    active={Mutable.Address.Valid === true && Mutable.Amount.Valid === true}
                                                                    value='SEND'
                                                                    onClick={() => {
                                                                        Mutable.Transaction.From = Account.Keys.Address;
                                                                        Mutable.Transaction.Token = token.Key;
                                                                        if (token.Key === 'ETH') SendEthereumTransaction(Account.Keys.Private)
                                                                        if (token.Key !== 'ETH') SendTokenTransaction(Account.Keys.Private, Account.Keys.Address, token.Address)
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                                {Mutable.Sent && <div class='sent-wrapper'>
                                                    <Icon value='check' />
                                                    <br />
                                                    <br />
                                                    <div>The transaction was successfully created.</div>
                                                    <br />
                                                    <p>A transaction hash will shortly appear in your history panel.</p>
                                                </div>}
                                            </Modal>
                                        </div>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>

                })}</>}
        </>
    }
}

export default Wallet;
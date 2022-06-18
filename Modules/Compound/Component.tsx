import './Compound.css';
import { Component, createSignal } from "solid-js";
import { Button, Icon, Input, Modal, Options, SettingComponents } from "../../Components/Components";
import { AbstractModule } from "../AbstractModule";
import { Wallet } from '../../Core/Wallet';
import { Actions, cToken, InitCompound, IsValidTransacton, Mutable, Token } from './Controller';
import { StringEllipsis } from '../../Definitions/Methods';
import { Cache } from '../../Core/Cache';

class Compound extends AbstractModule {

    selected: any; setSelected: any;

    constructor() {
        super();

        [this.selected, this.setSelected] = createSignal<number>(0);

        this.Name = 'Compound';
        this.Category = 'Modules';
        this.SVG = '/logos/compound.svg';
        this.Title = () => <>
            <span class='logospan'>
                <img src='/logos/compound.svg' />
                Compound
            </span>
            <div>
                <Modal value={<><img src='logos/compound.svg' /> {Mutable.Accrued.toFixed(4)} COMP</>}>
                    <h3>COMP Balance</h3>
                    <br />
                    <div class='center'>
                        <div><img src='logos/compound.svg' /></div>
                        <br />
                        <div>{Mutable.Accrued.toFixed(7)} COMP</div>
                        <div>$0.05</div>
                    </div>
                    <br />
                    <br />
                    <p><span>Wallet Balance</span><span>{Mutable.Tokens.filter(token => token.Symbol === 'COMP')[0].Balance}</span></p>
                    <hr />
                    <p><span>Unclaimed Balance</span><span>{Mutable.Accrued.toFixed(4)}</span></p>
                    <br />
                    <br />
                    <Button value='CLAIM' />
                </Modal>
                <label onClick={() => this.setSelected(3)}>{StringEllipsis(Wallet.Accounts[Cache.Settings.Compound.SelectedAccountIndex].Keys.Address)}</label>
            </div>
        </>

        InitCompound();
        this.Component = () => this.Content();

        this.PostConstructor();
    }

    ModalSupply = (token: Token) => {
        Mutable.Transaction.Executed = false;
        return <>
            <div><img src={`/tokens/${token.Symbol}.webp`} /><span>{token.Name}</span></div>
            <div class='rates'><span>Supply APY</span><span>{Mutable.cTokens.filter(ctoken => token.Name === ctoken.Name)[0].APY.Supply.toFixed(2)}%</span></div>
            <div class='max'><span>Maximum amount</span><span>{token.Balance && token.Balance.toFixed(2)} {token.Symbol}</span></div>
            <Input onInput={e => IsValidTransacton(e.currentTarget.value, token.Balance)} placeholder={`Enter a valid amount (MAX: ${token.Balance.toFixed(4)})`} />
            <Button type='primary' active={Mutable.Transaction.Valid} value='Supply' onClick={() => Actions.Supply(token)} />
        </>
    }

    ModalWithdraw = (token: cToken) => {
        Mutable.Transaction.Executed = false;
        return <>
            <div><img src={`/tokens/${token.Symbol}.webp`} /><span>{token.Name}</span></div>
            <div class='rates'><span>Supply APY</span><span>{token.APY.Supply.toFixed(2)}%</span></div>
            <div class='max'><span>Maximum amount</span><span>{token.cBalance.Supply && token.cBalance.Supply.toFixed(2)} {token.Symbol.substring(1)}</span></div>
            <Input onInput={e => IsValidTransacton(e.currentTarget.value, token.cBalance.Supply)} placeholder={`Enter a valid amount (MAX: ${token.cBalance.Supply.toFixed(2)})`} />
            <Button type='primary' active={Mutable.Transaction.Valid} value='Withdraw' onClick={() => Actions.Withdraw(token)} />
        </>
    }

    ModalBorrow = (token: Token) => {
        let max = Mutable.TotalSupplyUSD * 0.75 / Cache.Prices.List[token.Symbol]
        Mutable.Transaction.Executed = false;
        return <>
            <div><img src={`/tokens/${token.Symbol}.webp`} /><span>{token.Name}</span></div>
            <div class='rates'><span>Borrow APY</span><span>{Mutable.cTokens.filter(ctoken => token.Name === ctoken.Name)[0].APY.Borrow.toFixed(2)}%</span></div>
            <div class='max'><span>Maximum amount</span><span>{max.toFixed(2)} {token.Symbol}</span></div>
            <Input onInput={e => IsValidTransacton(e.currentTarget.value, max)} placeholder={`Enter a valid amount (MAX: ${max.toFixed(2)})`} />
            <Button type='primary' active={Mutable.Transaction.Valid} value='Borrow' onClick={() => Actions.Borrow(token)} />
        </>
    }

    ModalRepay = (token: cToken) => {
        Mutable.Transaction.Executed = false;
        return <>
            <div><img src={`/tokens/${token.Symbol}.webp`} /><span>{token.Name}</span></div>
            <div class='rates'><span>Borrow APY</span><span>{token.APY.Borrow.toFixed(2)}%</span></div>
            <div class='max'><span>Maximum amount</span><span>{token.cBalance.Borrow.toFixed(2)} {token.Symbol.substring(1)}</span></div>
            <Input onInput={e => IsValidTransacton(e.currentTarget.value, token.cBalance.Borrow)} placeholder={`Enter a valid amount (MAX: ${token.cBalance.Borrow.toFixed(2)})`} />
            <Button type='primary' active={Mutable.Transaction.Valid} value='Repay' onClick={() => Actions.Repay(token)} />
        </>
    }

    ModalExecuted = () => <div class='sent-wrapper'>
        <Icon value='check' />
        <br />
        <br />
        <div>The transaction was successfully created.</div>
        <br />
        <p>A transaction hash will shortly appear in your history panel.</p>
    </div>

    Content = () => {
        const Items = ['Balance', 'Supply', 'Borrow', 'Settings'];

        const Balance = <div class='comp balance'>
            <div>
                <div data-type='supply' onClick={() => this.setSelected(1)}>
                    <label>Supply Balance</label>
                    <span>${Mutable.TotalSupplyUSD.toFixed(6)}</span>
                </div>
                <div data-type='apy'>
                    <div title='Interest earned and paid, plus COMP'>
                        <label>Net APY</label>
                        <span>{Mutable.AverageAPY.toFixed(2)}%</span>
                    </div>
                </div>
                <div data-type='borrow' onClick={() => this.setSelected(2)}>
                    <label>Borrow Balance</label>
                    <span>${Mutable.TotalBorrowUSD.toFixed(6)}</span>
                </div>
            </div>

            <div class='limit'>
                <span>Borrow Limit</span>
                <div><span style={{ width: `${Mutable.TotalBorrowUSD / Mutable.TotalSupplyUSD * 100}%` }}></span></div>
                <span>${(Mutable.TotalSupplyUSD * 0.75).toFixed(2)}</span>
            </div>
        </div>;

        const Supply = <div class='comp supply'>

            <table>
                <thead>
                    <tr>
                        <td data-h="1" colspan='100%'>Supplying</td>
                    </tr>
                    <tr>
                        <th class='_name'>Asset</th>
                        <th class='_apy'>APY</th>
                        <th class='_value'>Balance</th>
                        <th ></th>
                    </tr>
                </thead>
                <tbody>
                    {Mutable.cTokens.filter(token => token.Balance > 0).map(token => <tr class='token'>
                        <td class='name'><span><img src={`/tokens/${token.Symbol}.webp`} /> {token.Name}</span></td>
                        <td class='apy'>{token.APY.Supply.toFixed(2)}%</td>
                        <td class='value'>
                            <span>
                                <span>${token.USD && token.USD.toFixed(2)}</span>
                                <span>{token.cBalance.Supply.toFixed(2)} {token.Symbol.substring(1)}</span>
                            </span>
                        </td>
                        <td><Modal value='Withdraw'>
                            {!Mutable.Transaction.Executed && this.ModalWithdraw(token)}
                            {Mutable.Transaction.Executed && this.ModalExecuted()}
                        </Modal></td>
                    </tr>)}
                    <tr>
                        <td data-h="2" colspan='100%'>Market</td>
                    </tr>
                    {Mutable.Tokens.filter(token => {
                        let t = Mutable.cTokens.filter(ctoken => ctoken.Name === token.Name);
                        if (!t.length) return true;
                        if (t[0].cBalance.Supply > 0) return false;
                        else return true;
                    }).map(token =>
                        <tr class='token'>
                            <td class='name'><span><img src={`/tokens/${token.Symbol}.webp`} /> {token.Name}</span></td>
                            <td class='apy'>{Mutable.cTokens.filter(ctoken => token.Name === ctoken.Name)[0].APY.Supply.toFixed(2)}%</td>
                            <td class='value'><span>
                                <span>{token.Balance.toFixed(2)} {token.Symbol}</span>
                                <span>${token.USD && token.USD.toFixed(2)}</span>
                            </span></td>
                            <td><Modal value='Supply'>
                                {!Mutable.Transaction.Executed && this.ModalSupply(token)}
                                {Mutable.Transaction.Executed && this.ModalExecuted()}
                            </Modal></td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>;

        const Borrow = <div class='comp borrow'>
            <table>
                <thead>
                    <tr>
                        <td data-h="1" colspan='100%'>Borrowing</td>
                    </tr>
                    <tr>
                        <th class='_name'>Asset</th>
                        <th class='_apy'>APY</th>
                        <th class='_value'>Balance</th>
                        <th ></th>
                    </tr>
                </thead>
                <tbody>
                    {Mutable.cTokens.filter(token => token.cBalance.Borrow > 0.001).map(token => <tr class='token'>
                        <td class='name'><span><img src={`/tokens/${token.Symbol}.webp`} /> {token.Name}</span></td>
                        <td class='apy'>{token.APY.Borrow.toFixed(2)}%</td>
                        <td class='value'>
                            <span>
                                <span>${token.USD && token.USD.toFixed(2)}</span>
                                <span>{token.cBalance.Borrow.toFixed(2)} {token.Symbol.substring(1)}</span>
                            </span>
                        </td>
                        <td><Modal value='Repay'>
                            {!Mutable.Transaction.Executed && this.ModalRepay(token)}
                            {Mutable.Transaction.Executed && this.ModalExecuted()}
                        </Modal></td>
                    </tr>)}
                    <tr>
                        <td data-h="2" colspan='100%'>Market</td>
                    </tr>
                    {Mutable.Tokens.filter(token => {
                        let t = Mutable.cTokens.filter(ctoken => ctoken.Name === token.Name);
                        if (!t.length) return true;
                        if (t[0].cBalance.Borrow > 0) return false;
                        else return true;
                    }).map(token =>
                        <tr class='token'>
                            <td class='name'><span><img src={`/tokens/${token.Symbol}.webp`} /> {token.Name}</span></td>
                            <td class='apy'>{Mutable.cTokens.filter(ctoken => token.Name === ctoken.Name)[0].APY.Supply.toFixed(2)}%</td>
                            <td class='value'>{token.Balance.toFixed(2)} {token.Symbol}</td>
                            <td>
                                <Modal value='Borrow'>
                                    {!Mutable.Transaction.Executed && this.ModalBorrow(token)}
                                    {Mutable.Transaction.Executed && this.ModalExecuted()}
                                </Modal></td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>;

        const Settings = <div class='comp settings'>

            <SettingComponents.Item header='Accounts' subheader='Select the account you want to interface Compound API with.'>
                <div class='accounts'>
                    {Wallet.Accounts.filter(a => a.Active).map(account =>
                        <div
                            classList={{ selected: Cache.Settings.Compound.SelectedAccountIndex === account.Index }}
                            onClick={() => { Cache.Settings.Compound.SelectedAccountIndex = account.Index; InitCompound(); }}
                            title={account.Keys.Address}
                        >
                            {StringEllipsis(account.Keys.Address)}
                        </div>)}
                </div>
            </SettingComponents.Item>

        </div>

        return <>
            <Options getter={this.selected} setter={this.setSelected} items={Items} />
            {this.selected() === 0 && Balance}
            {this.selected() === 1 && Supply}
            {this.selected() === 2 && Borrow}
            {this.selected() === 3 && Settings}
        </>
    }
}

export default Compound;
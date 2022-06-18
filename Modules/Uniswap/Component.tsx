import './Uniswap.css';
import { StringEllipsis } from "../../Definitions/Methods";
import { AbstractModule } from "../AbstractModule";
import { Cache } from '../../Core/Cache';
import { Wallet } from "../../Core/Wallet";
import { createSignal } from 'solid-js';
import { Button, Icon, Input, Modal, Options } from '../../Components/Components';
import { InitUniswap, List, Mutable, PerformSwap, SetToken, TryGetWalletValue, TrySetValue } from './Controller';

class Uniswap extends AbstractModule {

    selected: any; setSelected: any;

    constructor() {
        super();

        [this.selected, this.setSelected] = createSignal<number>(0);

        this.Name = 'Uniswap';
        this.Category = 'Modules';
        this.SVG = '/logos/uniswap.svg';
        this.Title = () => <>
            <span class='logospan'>
                <img src='/logos/uniswap.svg' />
                Uniswap
            </span>
            <div>
                <label><img src='tokens/ETH.webp' />{Wallet.Accounts[Cache.Settings.Uniswap.SelectedAccountIndex].Tokens[0].Amount.toFixed(4)} ETH</label>
                <label>{StringEllipsis(Wallet.Accounts[Cache.Settings.Uniswap.SelectedAccountIndex].Keys.Address)}</label>
            </div>
        </>

        this.Component = () => this.Content();

        InitUniswap();

        this.PostConstructor();
    }

    Content = () => {

        const Items = ['Swap', 'Pools', 'Settings'];

        const Token = (props) => {

            let Token = Mutable.Tokens[props.index];
            return <div class='token' token-data={props.index}>
                <div>
                    {props.master && <Input onInput={e => TrySetValue(Token, e.currentTarget.value)} placeholder='0.0' />}
                    {props.slave && <Input placeholder='0.0' value={Mutable.Tokens[1].Value.toFixed(4)} />}
                    <Modal value={Token.Symbol || 'Select a token'}>
                        <h3>Select a token</h3>
                        <div>
                            {List.map(symbol => {
                                return <div class='token-row' data-close-modal onClick={() => {
                                    SetToken(Token, symbol);
                                }}>
                                    <span class='name'><img src={`/tokens/${symbol}.webp`} /> {symbol}</span>
                                    <span class='value'><label>Balance</label> {TryGetWalletValue(symbol).toFixed(4)}</span>
                                </div>
                            })}
                        </div>
                    </Modal>
                </div>
                <div class='balance'>Balance: {Token.Max.toFixed(2)} {Token.Symbol} {props.master && Token.Max < Token.Value && <span class='error'>Insufficient balance!</span>}</div>
            </div>
        }

        const Swap = <>
            <div class='swap'>
                <div>
                    {<Token index={0} master />}
                    {<Token index={1} slave />}

                    <div class='conversion'>
                        {Mutable.Fetching === true && <>
                            <Icon value='spinner' />Fetching best prices...
                        </>}
                        {Mutable.Fetching === false && <>
                            1.0 {Mutable.Tokens[1].Symbol} = {(Mutable.Tokens[0].Value / Mutable.Tokens[1].Value).toFixed(4)} {Mutable.Tokens[0].Symbol}
                        </>}
                    </div>
                    <div classList={{ action: true, active: Mutable.Tokens[0].Valid && Mutable.Tokens[1].Valid }}>
                        <Modal value={<Button type='primary'
                            active={Mutable.Tokens[0].Valid && Mutable.Tokens[1].Valid}
                            value='SWAP'
                            onClick={() => PerformSwap()} />}>
                            <div class='sent-wrapper'>
                                <Icon value='check' />
                                <br />
                                <br />
                                <div>The transaction was successfully created.</div>
                                <br />
                                <p>A transaction hash will shortly appear in your history panel.</p>
                            </div>
                        </Modal>
                    </div>
                </div>
            </div>
        </>;
        const Pools = <></>;
        const Settings = <></>;

        return <>
            <Options getter={this.selected} setter={this.setSelected} items={Items} />
            {this.selected() === 0 && Swap}
            {this.selected() === 1 && Pools}
            {this.selected() === 2 && Settings}
        </>
    }
}

export default Uniswap;
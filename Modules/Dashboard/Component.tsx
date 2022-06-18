import './Dashboard.css';
import { Component } from "solid-js";
import { Cache } from "../../Core/Cache";
import { AbstractModule } from "../AbstractModule";
import { DateOfYear, GetEthereumStats } from './Controller';
import { Icon } from '../../Components/Components';
import { NumberTo, StringEllipsis } from '../../Definitions/Methods';
import { Wallet } from '../../Core/Wallet';

class Dashboard extends AbstractModule {

    Activities = new Array(120);

    constructor() {
        super();

        this.Name = 'Dashboard';
        this.AlwaysEnabled = true;
        this.Icon = 'home';
        this.Title = () => <>
            <span class='logospan'><img src='/images/logo.svg' /> Alpha</span>
            <span class='network'>{Cache.Wallet.Network}</span>
        </>

        GetEthereumStats();

        for (let i = 0; i < this.Activities.length; i++)
            this.Activities[i] = null;

        this.Component = () => <>
            <br />
            <br />
            <div class='flex'>

                <div>
                    {Cache.Settings.Infura.Key &&
                        <div class='wallet'>
                            <h3>Wallet</h3>
                            <br />
                            <div>
                                {Wallet.Accounts.filter(a => a.Active).map(account => {
                                    return <div>
                                        <span><b>#{account.Index + 1}</b> {StringEllipsis(account.Keys.Address)}</span>
                                        <span>{account.Tokens[0].Amount.toFixed(2)} ETH</span>
                                        <span>${(account.Tokens[0].Amount * Cache.Ethereum.Price).toFixed(2)}</span>
                                    </div>
                                })}
                            </div>
                        </div>}

                    <div class='ethereum'>
                        <h3>Ethereum</h3>
                        <br />
                        <div>
                            <div eth-tag="price">
                                <span>Price</span>
                                <span>${Cache.Ethereum.Price}</span>
                            </div>
                            <div eth-tag="24h" classList={{ up: Cache.Ethereum.Last24H >= 0, down: Cache.Ethereum.Last24H < 0 }}>
                                <span>24H</span>
                                <span>
                                    {Cache.Ethereum.Last24H > 0 ? <Icon value='arrow-trend-up' /> : <Icon value='arrow-trend-down' />}
                                    {Cache.Ethereum.Last24H.toFixed(2)}
                                </span>
                            </div>
                            <div eth-tag="volume">
                                <span>Vol.</span>
                                <span>${NumberTo.Billions(Cache.Ethereum.Volume)}</span>
                            </div>
                            <div eth-tag="cap">
                                <span>M.Cap</span>
                                <span>${NumberTo.Billions(Cache.Ethereum.MarketCap)}</span>
                            </div>
                        </div>
                    </div>

                    <div class='actions'>
                        <h3>Quick Actions</h3>
                        <br />
                    </div>
                </div>

                <div>
                    <div class='history'>
                        <h3>Transaction History</h3>
                        <br />
                        {() => {
                            let transactions = [];

                            let min = Math.max(Cache.Wallet.History.length - 5, 0)

                            for (let i = Cache.Wallet.History.length - 1; i >= min; i--) {
                                let tx = Cache.Wallet.History[i];
                                transactions.push(<div>
                                    {(tx.Type === 'CompoundBorrow' || tx.Type === 'CompoundSupply' || tx.Type === 'Transfer') && <img src={`/tokens/${tx.Token}.webp`} />}
                                    {tx.Type === 'Uniswap' && <img src='/logos/uniswap.svg' />}
                                    {tx.Type === 'Uniswap' && <span>Uniswap</span>}
                                    {(tx.Type === 'CompoundBorrow' || tx.Type === 'CompoundSupply' || tx.Type === 'Transfer') && <span>{tx.Amount} {tx.Token}</span>}
                                    <span>
                                        {tx.Type === 'Transfer' && <>
                                            <span>{tx.From && StringEllipsis(tx.From)}</span>
                                            <Icon value='angle-right' />
                                            <span>{tx.To && StringEllipsis(tx.To)}</span>
                                        </>}
                                        {tx.Type === 'CompoundSupply' && <>
                                            <span>Compound: Supply</span>
                                        </>}
                                        {tx.Type === 'CompoundBorrow' && <>
                                            <span>Compound: Borrow</span>
                                        </>}
                                        {tx.Type === 'Uniswap' && <>
                                            <span>{tx.Exchange.Value1} {tx.Exchange.Token1}</span>
                                            <label>to</label>
                                            <span>{tx.Exchange.Value2} {tx.Exchange.Token2}</span>
                                        </>}
                                    </span>
                                </div>)
                            }

                            return transactions;
                        }}
                    </div>
                    <div class='activity'>
                        <h3>Activity <span>({this.Activities.length}d)</span></h3>
                        <br />
                        <div>
                            {this.Activities.map((_, i) => {
                                let now = new Date();
                                let diff = Cache.Wallet.History.filter(tx => tx.Date.DayOfYear === DateOfYear(now.getDate(), now.getMonth() + 1, now.getFullYear()) - i).length;
                                let attr = diff > 5 ? '5+' : diff.toString();
                                let today = i === 0 ? 'today' : i + ' days ago';
                                return <div style={{ order: -i }} title={`${attr} transactions ${today}`} data-tx={attr}></div>
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>

        this.PostConstructor();
        this.Select();
    }

}

export default Dashboard;
import './History.css';
import { Component, createSignal } from "solid-js";
import { Cache } from "../../Core/Cache";
import { StringEllipsis } from "../../Definitions/Methods";
import { AbstractModule } from "../AbstractModule";
import { Icon } from '../../Components/Components';

class History extends AbstractModule {

    constructor() {
        super();

        this.Name = 'History';
        this.Category = 'Home';
        this.Icon = 'receipt';
        this.AlwaysEnabled = true;

        this.Component = () => <>
            <br />
            <br />
            <table>
                <thead>
                    <tr>
                        <th data-head="token"></th>
                        <th data-head="type">Type</th>
                        <th data-head="hash">Hash</th>
                        <th data-head="from">From</th>
                        <th data-head="to">To</th>
                        <th data-head="amount">Amount</th>
                        <th data-head="date">Time</th>
                    </tr>
                </thead>
                <tbody>
                    {Cache.Wallet.History.slice(0).reverse().map(item => {

                        const [open, setOpen] = createSignal<boolean>(false);

                        return <>
                            <tr onClick={() => setOpen(!open())}>
                                <td data-cell="token">
                                    {(item.Type === 'CompoundBorrow' || item.Type === 'CompoundSupply' || item.Type === 'Transfer') && <img src={`/tokens/${item.Token}.webp`} />}
                                    {item.Type === 'Uniswap' && <img src={`/logos/uniswap.svg`} />}
                                </td>
                                <td data-cell="type">{item.Type}</td>
                                <td data-cell="hash" title={item.Hash}>{StringEllipsis(item.Hash)}</td>
                                <td data-cell="from" title={item.From}>{item.From && StringEllipsis(item.From)}</td>
                                <td data-cell="to" title={item.To}>{item.To && StringEllipsis(item.To)}</td>
                                <td data-cell="amount">{item.Amount}</td>
                                <td data-cell="date"><span>{`${item.Date.Hours}:${item.Date.Minutes}:${item.Date.Seconds}`}</span>{`${item.Date.Day}/${item.Date.Month}/${item.Date.Year}`}</td>
                            </tr>
                            {
                                open() && <tr class='open'>
                                    <td colSpan={7}>
                                        <h3>Transaction Details</h3>
                                        <br />
                                        <div>
                                            <div>
                                                <span>Hash</span>
                                                <span>{item.Hash}</span>
                                            </div>
                                            {item.Type === 'Transfer' && <>
                                                <div>
                                                    <span>From</span>
                                                    <span>{item.From}</span>
                                                </div>
                                                <div>
                                                    <span>To</span>
                                                    <span>{item.To}</span>
                                                </div></>}
                                            <div>
                                                <span>Amount</span>
                                                {item.Type === 'Transfer' && <>
                                                    <span class='img'>
                                                        <img src={`/tokens/${item.Token}.webp`} />{item.Amount}
                                                    </span>
                                                </>}
                                                {item.Type === 'Uniswap' && <>
                                                    <span class='img'>
                                                        <label><img src={`/tokens/${item.Exchange.Token1}.webp`} />{item.Exchange.Value1}</label>
                                                        <Icon value='right-left' />
                                                        <label><img src={`/tokens/${item.Exchange.Token2}.webp`} />{item.Exchange.Value2}</label>
                                                    </span>
                                                </>}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            }</>
                    })}
                </tbody>
            </table></>

        this.PostConstructor();
    }

}

export default History;
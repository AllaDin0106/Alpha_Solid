import { Cache } from "../../Core/Cache"
import { Expiration } from "../../Definitions/Methods"

export const GetEthereumStats = () => {

    if (!Cache.Ethereum.Timeout || Expiration.IsExpired(Cache.Ethereum.Timeout)) {

        fetch('https://api.coingecko.com/api/v3/coins/ethereum')
            .then(res => res.json())
            .then(result => {

                Cache.Ethereum.Price = result.market_data.current_price.usd;
                Cache.Ethereum.Last24H = result.market_data.price_change_percentage_24h;
                Cache.Ethereum.MarketCap = result.market_data.market_cap.usd;
                Cache.Ethereum.Volume = result.market_data.total_volume.usd;

                Cache.Ethereum.Timeout = Expiration.MakeString(1);
            });
    }

}

export const DateOfYear = (day, month, year) => {

    const date = new Date(year, month - 1, day);
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = (date as any) - (start as any);

    const one = 1000 * 60 * 60 * 24;
    const res = Math.floor(diff / one);

    return res;
}
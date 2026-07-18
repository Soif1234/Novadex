import { useEffect, useState } from 'react';
import { useMarket } from './MarketContext';

export function useOrderBook() {
  const { currentSymbol } = useMarket();
  const [asks, setAsks] = useState<{ price: number, size: number, total: number }[]>([]);
  const [bids, setBids] = useState<{ price: number, size: number, total: number }[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);

  useEffect(() => {
    let ws: WebSocket;
    
    // We get the Binance symbol format, e.g., BTC-USD -> BTCUSDT
    const binanceSymbol = currentSymbol.replace('-', '').replace('USD', 'USDT').toLowerCase();
    
    // Connect to partial book depth stream
    ws = new WebSocket(`wss://fstream.binance.com/ws/${binanceSymbol}@depth20@100ms`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.a && data.b) {
        let totalAsk = 0;
        const newAsks = data.a.slice(0, 14).map((ask: string[]) => {
          const size = parseFloat(ask[1]);
          totalAsk += size;
          return { price: parseFloat(ask[0]), size, total: totalAsk };
        }).reverse();

        let totalBid = 0;
        const newBids = data.b.slice(0, 14).map((bid: string[]) => {
          const size = parseFloat(bid[1]);
          totalBid += size;
          return { price: parseFloat(bid[0]), size, total: totalBid };
        });

        setAsks(newAsks);
        setBids(newBids);
        
        if (newBids.length > 0) {
          setCurrentPrice(newBids[0].price);
        }
      }
    };

    return () => {
      if (ws) ws.close();
    };
  }, [currentSymbol]);

  return { asks, bids, currentPrice };
}

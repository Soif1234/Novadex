import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface MarketSymbol {
  symbol: string;
  price: string;
  volume: string;
  changePercent: string;
}

interface MarketContextType {
  currentSymbol: string;
  setCurrentSymbol: (sym: string) => void;
  symbols: MarketSymbol[];
  loading: boolean;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export function MarketProvider({ children }: { children: ReactNode }) {
  const [currentSymbol, setCurrentSymbol] = useState<string>('BTC-USDT');
  const [symbols, setSymbols] = useState<MarketSymbol[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch top coins from Binance Futures
    const fetchSymbols = async () => {
      try {
        const response = await fetch('https://fapi.binance.com/fapi/v1/ticker/24hr');
        const data = await response.json();
        
        // Filter for USDT pairs and sort by volume to get top pairs
        const usdtPairs = data
          .filter((item: any) => item.symbol.endsWith('USDT'))
          .sort((a: any, b: any) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
          .map((item: any) => ({
            symbol: item.symbol.replace('USDT', '-USDT'), // display as BTC-USDT
            price: parseFloat(item.lastPrice).toFixed(item.lastPrice < 1 ? 4 : 2),
            volume: parseFloat(item.quoteVolume).toFixed(2),
            changePercent: parseFloat(item.priceChangePercent).toFixed(2)
          }));
          
        setSymbols(usdtPairs.slice(0, 500)); // Get top 500
        setLoading(false);
      } catch (e) {
        console.error("Failed to fetch symbols", e);
        // Fallback
        setSymbols([{ symbol: 'BTC-USDT', price: '64000.00', volume: '10000', changePercent: '0.00' }]);
        setLoading(false);
      }
    };
    
    fetchSymbols();
  }, []);

  return (
    <MarketContext.Provider value={{ currentSymbol, setCurrentSymbol, symbols, loading }}>
      {children}
    </MarketContext.Provider>
  );
}

export function useMarket() {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
}

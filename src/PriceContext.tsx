import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMarket } from './MarketContext';

export interface Alert {
  id: string;
  targetPrice: number;
  condition: 'above' | 'below';
  isTriggered: boolean;
}

interface PriceContextType {
  currentPrice: number;
  alerts: Alert[];
  addAlert: (price: number, condition: 'above' | 'below') => void;
  removeAlert: (id: string) => void;
  clearTriggered: () => void;
}

const PriceContext = createContext<PriceContextType>({} as PriceContextType);

export const PriceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentSymbol } = useMarket();
  const { symbols } = useMarket();
  const [currentPrice, setCurrentPrice] = useState(0);

  useEffect(() => {
    if (currentPrice === 0 && symbols && symbols.length > 0) {
      const sym = symbols.find(s => s.symbol === currentSymbol);
      if (sym) {
        setCurrentPrice(parseFloat(sym.price));
      }
    }
  }, [symbols, currentSymbol, currentPrice]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const binanceSymbol = currentSymbol.replace('-', '').replace('USD', 'USDT').toLowerCase();
    const ws = new WebSocket(`wss://fstream.binance.com/ws/${binanceSymbol}@trade`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.p) {
        const newPrice = parseFloat(data.p);
        setCurrentPrice(newPrice);
        
        setAlerts(currentAlerts => {
          let updated = false;
          const nextAlerts = currentAlerts.map(a => {
            if (a.isTriggered) return a;
            if (a.condition === 'above' && newPrice >= a.targetPrice) {
              updated = true;
              return { ...a, isTriggered: true };
            }
            if (a.condition === 'below' && newPrice <= a.targetPrice) {
              updated = true;
              return { ...a, isTriggered: true };
            }
            return a;
          });
          return updated ? nextAlerts : currentAlerts;
        });
      }
    };

    return () => {
      ws.close();
    };
  }, [currentSymbol]);

  const addAlert = (targetPrice: number, condition: 'above' | 'below') => {
    setAlerts(prev => [{ id: Date.now().toString(), targetPrice, condition, isTriggered: false }, ...prev]);
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const clearTriggered = () => {
    setAlerts(prev => prev.filter(a => !a.isTriggered));
  };

  return (
    <PriceContext.Provider value={{ currentPrice, alerts, addAlert, removeAlert, clearTriggered }}>
      {children}
    </PriceContext.Provider>
  );
};

export const usePrice = () => useContext(PriceContext);

import React, { useState } from 'react';
import { useTrading } from '../TradingContext';
import { usePrice } from '../PriceContext';
import { useMarket } from '../MarketContext';

export function PositionsList() {
  const [activeTab, setActiveTab] = useState<'positions' | 'orders' | 'history'>('positions');
  const { positions, limitOrders, cancelLimitOrder, closePosition, history: transactionHistory } = useTrading();
  const { currentPrice } = usePrice();
  const { currentSymbol } = useMarket();
  const [closingLimitId, setClosingLimitId] = useState<string | null>(null);
  const [closingLimitPrice, setClosingLimitPrice] = useState<string>('');
  const { addLimitOrder } = useTrading();

  // Update PnL for current symbol
  const livePositions = positions.map(pos => {
    if (pos.market === currentSymbol && currentPrice > 0) {
      const priceDiff = pos.side === 'long' ? (currentPrice - pos.entryPrice) : (pos.entryPrice - currentPrice);
      const newPnl = priceDiff * pos.size;
      const newPnlPercent = (newPnl / pos.margin) * 100;
      return {
        ...pos,
        markPrice: currentPrice,
        pnl: newPnl,
        pnlPercent: newPnlPercent
      };
    }
    return pos;
  });

  return (
    <div className="w-full h-full bg-[#0B0E14] flex flex-col shrink-0 overflow-hidden">
      <div className="flex items-center space-x-8 px-4 border-b border-white/5 text-sm font-medium text-gray-400 shrink-0 bg-[#0F131A]">
        <button 
          onClick={() => setActiveTab('positions')}
          className={`h-12 flex items-center gap-2 transition-colors ${activeTab === 'positions' ? 'text-blue-400 border-b-2 border-blue-400' : 'hover:text-white'}`}
        >
          Positions <span className="bg-white/10 text-white px-2 py-0.5 rounded-full text-xs">{livePositions.length}</span>
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`h-12 transition-colors ${activeTab === 'orders' ? 'text-blue-400 border-b-2 border-blue-400' : 'hover:text-white'}`}
        >
          Orders <span className="bg-white/10 text-white px-2 py-0.5 rounded-full text-xs">{limitOrders ? limitOrders.length : 0}</span>
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`h-12 transition-colors ${activeTab === 'history' ? 'text-blue-400 border-b-2 border-blue-400' : 'hover:text-white'}`}
        >
          Trade History
        </button>
      </div>
      
      <div className="flex-1 overflow-auto no-scrollbar">
        {activeTab === 'positions' && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] text-gray-500 uppercase tracking-wider sticky top-0 bg-[#0B0E14] z-10 border-b border-white/5">
                <th className="py-3 px-4 font-medium">Market</th>
                <th className="py-3 px-4 font-medium">Size</th>
                <th className="py-3 px-4 font-medium">Entry Price</th>
                <th className="py-3 px-4 font-medium">Mark Price</th>
                <th className="py-3 px-4 font-medium">Liq. Price</th>
                <th className="py-3 px-4 font-medium">Margin Ratio</th>
                <th className="py-3 px-4 font-medium">Margin</th>
                <th className="py-3 px-4 font-medium text-right">PnL (ROE%)</th>
                <th className="py-3 px-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {livePositions.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-500">No open positions</td>
                </tr>
              )}
              {livePositions.map((pos) => {
                const marginRatio = ((pos.margin + pos.pnl) / (pos.size * pos.markPrice) * 100).toFixed(1);
                
                return (
                <tr key={pos.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-[10px] font-bold">
                        {pos.market.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white">{pos.market}</span>
                        <span className={`text-[10px] uppercase font-bold ${pos.side === 'long' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {pos.leverage}x {pos.side}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-mono text-gray-200">{pos.size.toFixed(4)}</td>
                  <td className="py-4 px-4 font-mono text-gray-400">${pos.entryPrice.toFixed(2)}</td>
                  <td className="py-4 px-4 font-mono text-gray-200">${pos.markPrice.toFixed(2)}</td>
                  <td className="py-4 px-4 font-mono text-orange-400">${pos.liqPrice.toFixed(2)}</td>
                  <td className="py-4 px-4 font-mono text-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 w-[15%]"></div>
                      </div>
                      <span className="text-[11px]">{marginRatio}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-mono text-gray-200">${pos.margin.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className={`font-mono ${pos.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)}
                      </span>
                      <span className={`text-[11px] font-mono ${pos.pnlPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {pos.pnlPercent >= 0 ? '+' : ''}{pos.pnlPercent.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {closingLimitId === pos.id ? (
                      <div className="flex items-center gap-2 justify-end">
                        <input
                          type="text"
                          placeholder="Price"
                          value={closingLimitPrice}
                          onChange={(e) => setClosingLimitPrice(e.target.value)}
                          className="w-16 bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            if (closingLimitPrice && !isNaN(parseFloat(closingLimitPrice))) {
                              addLimitOrder({
                                id: Math.random().toString(36).substr(2, 9),
                                market: pos.market,
                                side: pos.side === 'long' ? 'short' : 'long', // opposite side to close
                                leverage: pos.leverage,
                                size: pos.size,
                                limitPrice: parseFloat(closingLimitPrice),
                                margin: 0, // 0 margin so canceling doesn't give free money
                                timestamp: new Date().toLocaleString()
                              });
                              setClosingLimitId(null);
                              setClosingLimitPrice('');
                              setActiveTab('orders'); // Jump to orders tab to show it
                            }
                          }}
                          className="text-[11px] font-medium bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 px-2 py-1 rounded transition-colors"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => setClosingLimitId(null)}
                          className="text-[11px] font-medium text-gray-400 hover:text-white px-2 py-1"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => closePosition(pos.id, pos.pnl)}
                          className="text-[11px] font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1.5 rounded transition-colors"
                        >
                          Market
                        </button>
                        <button 
                          onClick={() => {
                            setClosingLimitId(pos.id);
                            setClosingLimitPrice(pos.markPrice.toFixed(2));
                          }}
                          className="text-[11px] font-medium bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 px-3 py-1.5 rounded transition-colors"
                        >
                          Limit
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        )}

        {activeTab === 'orders' && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] text-gray-500 uppercase tracking-wider sticky top-0 bg-[#0B0E14] z-10 border-b border-white/5">
                <th className="py-3 px-4 font-medium">Time</th>
                <th className="py-3 px-4 font-medium">Market</th>
                <th className="py-3 px-4 font-medium">Side</th>
                <th className="py-3 px-4 font-medium text-right">Limit Price</th>
                <th className="py-3 px-4 font-medium text-right">Size</th>
                <th className="py-3 px-4 font-medium text-right">Margin</th>
                <th className="py-3 px-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {(!limitOrders || limitOrders.length === 0) && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">No active limit orders</td>
                </tr>
              )}
              {limitOrders && limitOrders.map((order) => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 font-mono text-gray-400 text-xs">{order.timestamp}</td>
                  <td className="py-4 px-4 font-bold text-white">{order.market}</td>
                  <td className="py-4 px-4">
                    <span className={`text-[11px] uppercase font-bold px-2 py-1 rounded bg-white/5 ${order.side === 'long' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {order.leverage}x {order.side}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono text-gray-200 text-right">${order.limitPrice.toFixed(2)}</td>
                  <td className="py-4 px-4 font-mono text-gray-200 text-right">{order.size.toFixed(4)}</td>
                  <td className="py-4 px-4 font-mono text-gray-400 text-right">${order.margin.toFixed(2)}</td>
                  <td className="py-4 px-4 text-right">
                    <button 
                      onClick={() => cancelLimitOrder(order.id)}
                      className="text-[11px] font-medium bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'history' && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] text-gray-500 uppercase tracking-wider sticky top-0 bg-[#0B0E14] z-10 border-b border-white/5">
                <th className="py-3 px-4 font-medium">Time</th>
                <th className="py-3 px-4 font-medium">Market</th>
                <th className="py-3 px-4 font-medium">Type</th>
                <th className="py-3 px-4 font-medium">Side</th>
                <th className="py-3 px-4 font-medium text-right">Price</th>
                <th className="py-3 px-4 font-medium text-right">Size</th>
                <th className="py-3 px-4 font-medium text-right">Fee</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {transactionHistory.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">No trade history</td>
                </tr>
              )}
              {transactionHistory.map((tx) => (
                <tr key={tx.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 font-mono text-gray-400 text-xs">{tx.timestamp}</td>
                  <td className="py-4 px-4 font-bold text-white">{tx.market}</td>
                  <td className="py-4 px-4 text-gray-200">{tx.type}</td>
                  <td className="py-4 px-4">
                    <span className={`text-[11px] uppercase font-bold px-2 py-1 rounded bg-white/5 ${tx.side === 'long' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {tx.side}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono text-gray-200 text-right">${tx.price.toFixed(2)}</td>
                  <td className="py-4 px-4 font-mono text-gray-200 text-right">{tx.size}</td>
                  <td className="py-4 px-4 font-mono text-gray-400 text-right">${tx.fee.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

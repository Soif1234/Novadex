import React from 'react';
import { useOrderBook } from '../useOrderBook';

export function OrderBook() {
  const { asks, bids, currentPrice } = useOrderBook();

  const maxTotal = Math.max(...asks.map(a => a.total), ...bids.map(b => b.total), 1);
  const spread = asks.length && bids.length ? (asks[asks.length - 1].price - bids[0].price).toFixed(2) : '0.00';

  return (
    <div className="w-full h-full bg-[#0B0E14] flex flex-col shrink-0 text-xs">
      <div className="h-10 border-b border-white/5 flex items-center px-4 text-xs font-medium text-gray-400 shrink-0">
        Order Book
      </div>
      
      <div className="flex text-gray-500 px-4 py-2 text-[10px] font-medium tracking-wider">
        <div className="flex-1">Price</div>
        <div className="flex-1 text-right">Size</div>
        <div className="flex-1 text-right">Total</div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Asks */}
        <div className="flex flex-col justify-end flex-1 px-1">
          {asks.map((ask, i) => (
            <div key={`ask-${i}`} className="flex items-center px-3 py-0.5 relative group cursor-pointer hover:bg-white/5">
              <div 
                className="absolute right-0 top-0 bottom-0 bg-red-500/10 z-0" 
                style={{ width: `${(ask.total / maxTotal) * 100}%` }}
              />
              <div className="flex-1 text-red-400 font-mono z-10">{ask.price.toFixed(2)}</div>
              <div className="flex-1 text-right text-gray-300 font-mono z-10">{ask.size.toFixed(3)}</div>
              <div className="flex-1 text-right text-gray-500 font-mono z-10">{ask.total.toFixed(3)}</div>
            </div>
          ))}
        </div>

        {/* Spread */}
        <div className="py-2 px-4 flex items-center justify-between border-y border-white/5 bg-white/[0.02]">
          <div className="text-emerald-400 font-mono font-bold text-sm">${currentPrice.toFixed(2)}</div>
          <div className="text-gray-500 text-[10px] font-medium flex items-center gap-2">
            <span>Spread</span>
            <span className="text-white">{spread}</span>
          </div>
        </div>

        {/* Bids */}
        <div className="flex flex-col flex-1 px-1 mt-1">
          {bids.map((bid, i) => (
            <div key={`bid-${i}`} className="flex items-center px-3 py-0.5 relative group cursor-pointer hover:bg-white/5">
              <div 
                className="absolute right-0 top-0 bottom-0 bg-emerald-500/10 z-0" 
                style={{ width: `${(bid.total / maxTotal) * 100}%` }}
              />
              <div className="flex-1 text-emerald-400 font-mono z-10">{bid.price.toFixed(2)}</div>
              <div className="flex-1 text-right text-gray-300 font-mono z-10">{bid.size.toFixed(3)}</div>
              <div className="flex-1 text-right text-gray-500 font-mono z-10">{bid.total.toFixed(3)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

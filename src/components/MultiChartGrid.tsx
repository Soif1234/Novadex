import React from 'react';
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';
import { Maximize } from 'lucide-react';

const MiniChart: React.FC<{ ticker: string }> = ({ ticker }) => {
  const tvSymbol = `BINANCE:${ticker.replace('-', '')}`;
  return (
    <div className="bg-[#0B0E14] h-full w-full relative">
      <AdvancedRealTimeChart
        symbol={tvSymbol}
        theme="dark"
        autosize
        interval="15"
        hide_top_toolbar
        hide_legend
        hide_side_toolbar
        enable_publishing={false}
        allow_symbol_change={false}
      />
    </div>
  );
}

export function MultiChartGrid({ tickers, onToggleSingle }: { tickers: string[], onToggleSingle: () => void }) {
  return (
    <div className="flex-1 flex flex-col bg-[#0F131A]  overflow-hidden">
      <div className="h-10 border-b border-white/5 flex items-center justify-between px-4 shrink-0 bg-[#0B0E14]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-400">Multi-Chart View</span>
        </div>
        <button onClick={onToggleSingle} className="p-1.5 hover:bg-white/10 rounded-md text-gray-400 hover:text-white transition-colors">
          <Maximize className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-[1px] bg-white/5 overflow-hidden">
        {tickers.map(ticker => (
          <MiniChart key={ticker} ticker={ticker} />
        ))}
      </div>
    </div>
  );
}

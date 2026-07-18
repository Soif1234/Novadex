import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import { Grid } from 'lucide-react';
import { useMarket } from '../MarketContext';

export function TradingChart({ onToggleMultiChart }: { onToggleMultiChart?: () => void }) {
  const { currentSymbol } = useMarket();
  const tvSymbol = `BINANCE:${currentSymbol.replace('-', '')}`;

  return (
    <div className="flex-1 bg-[#0B0E14] flex flex-col min-h-[300px] w-full h-full">
      <div className="h-10 border-b border-white/5 flex items-center px-4 space-x-6 text-xs font-medium text-gray-400 shrink-0">
        <button className="text-blue-400 border-b-2 border-blue-400 h-full flex items-center">Price Chart</button>
        <div className="flex-1"></div>
        <div className="flex items-center space-x-3">
          {onToggleMultiChart && (
            <button onClick={onToggleMultiChart} className="ml-2 p-1.5 hover:bg-white/10 rounded-md text-gray-400 hover:text-white transition-colors">
              <Grid className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 p-0 relative">
        <div className="absolute inset-0 bg-[#0B0E14]">
          <AdvancedRealTimeChart
            symbol={tvSymbol}
            theme="dark"
            autosize
            interval="15"
            hide_side_toolbar={false}
            hide_top_toolbar={false}
            enable_publishing={false}
            allow_symbol_change={false}
          />
        </div>
      </div>
    </div>
  );
}

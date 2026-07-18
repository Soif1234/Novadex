import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, BellPlus, X, Search } from 'lucide-react';
import { usePrice } from '../PriceContext';
import { useMarket } from '../MarketContext';

export function MarketTicker() {
  const { currentPrice, addAlert } = usePrice();
  const { currentSymbol, setCurrentSymbol, symbols, loading } = useMarket();
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isSymbolDropdownOpen, setIsSymbolDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [targetPrice, setTargetPrice] = useState(currentPrice.toFixed(2));
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  
  const modalRef = useRef<HTMLDivElement>(null);
  const symbolDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsAlertModalOpen(false);
      }
      if (symbolDropdownRef.current && !symbolDropdownRef.current.contains(event.target as Node)) {
        setIsSymbolDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddAlert = () => {
    addAlert(Number(targetPrice), condition);
    setIsAlertModalOpen(false);
  };

  const filteredSymbols = useMemo(() => {
    return symbols.filter(s => s.symbol.toLowerCase().includes(search.toLowerCase()));
  }, [symbols, search]);

  const currentMarket = useMemo(() => {
    return symbols.find(s => s.symbol === currentSymbol) || { symbol: currentSymbol, price: currentPrice.toFixed(2), changePercent: '0.00', volume: '0' };
  }, [symbols, currentSymbol, currentPrice]);

  return (
    <div className="h-14 border-b border-white/5 flex items-center px-4 bg-[#0F131A] shrink-0 overflow-visible z-40 relative">
      <div className="relative" ref={symbolDropdownRef}>
        <button 
          onClick={() => setIsSymbolDropdownOpen(!isSymbolDropdownOpen)}
          className="flex items-center space-x-2 hover:bg-white/5 p-1.5 -ml-1.5 rounded-lg transition-colors shrink-0"
        >
          <div className="flex flex-col items-start">
            <span className="text-sm font-bold text-white flex items-center gap-1">{currentSymbol} <ChevronDown className="w-3 h-3 text-gray-400" /></span>
            <span className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">Perpetual</span>
          </div>
        </button>

        {isSymbolDropdownOpen && (
          <div className="absolute top-12 left-0 w-72 bg-[#0F131A] border border-white/10 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-white/5 relative">
              <Search className="w-4 h-4 text-gray-500 absolute left-5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search market..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 pl-8 pr-3 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="max-h-80 overflow-y-auto no-scrollbar py-2">
              {loading ? (
                <div className="p-4 text-center text-gray-500 text-sm">Loading markets...</div>
              ) : filteredSymbols.map(sym => (
                <button
                  key={sym.symbol}
                  onClick={() => {
                    setCurrentSymbol(sym.symbol);
                    setIsSymbolDropdownOpen(false);
                    setSearch('');
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2 hover:bg-white/5 transition-colors ${currentSymbol === sym.symbol ? 'bg-white/5' : ''}`}
                >
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-bold text-white">{sym.symbol}</span>
                    <span className="text-[10px] text-gray-500 font-medium">Vol {sym.volume}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-mono text-white">${sym.price}</span>
                    <span className={`text-[10px] font-mono ${parseFloat(sym.changePercent) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {parseFloat(sym.changePercent) > 0 ? '+' : ''}{sym.changePercent}%
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="h-6 w-px bg-white/10 mx-4 shrink-0"></div>
      
      <div className="flex items-center space-x-6 min-w-max">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[13px] font-mono font-medium text-emerald-400">${currentMarket.price}</span>
            <span className="text-[10px] text-gray-500">Mark Price</span>
          </div>
          <button 
            onClick={() => {
              setTargetPrice(currentMarket.price);
              setIsAlertModalOpen(!isAlertModalOpen);
            }}
            className="p-1.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            title="Set Price Alert"
          >
            <BellPlus className="w-3.5 h-3.5" />
          </button>
        </div>

        {isAlertModalOpen && (
          <div 
            ref={modalRef}
            className="absolute top-12 left-48 w-64 bg-[#0F131A] border border-white/10 rounded-xl shadow-2xl z-50 p-4 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-white">Set Alert</h3>
              <button onClick={() => setIsAlertModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex bg-white/5 p-1 rounded-lg">
              <button 
                onClick={() => setCondition('above')}
                className={`flex-1 py-1 text-xs font-medium rounded transition-colors ${condition === 'above' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400 hover:text-white'}`}
              >
                Price &gt;
              </button>
              <button 
                onClick={() => setCondition('below')}
                className={`flex-1 py-1 text-xs font-medium rounded transition-colors ${condition === 'below' ? 'bg-red-500/20 text-red-400' : 'text-gray-400 hover:text-white'}`}
              >
                Price &lt;
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-500">Target Price (USD)</label>
              <input 
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="bg-black/20 border border-white/10 rounded-md px-3 py-1.5 text-sm font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <button 
              onClick={handleAddAlert}
              className="mt-2 w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-1.5 rounded-md text-sm transition-colors"
            >
              Add Alert
            </button>
          </div>
        )}

        <div className="flex flex-col">
          <span className={`text-[13px] font-mono font-medium ${parseFloat(currentMarket.changePercent) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {parseFloat(currentMarket.changePercent) > 0 ? '+' : ''}{currentMarket.changePercent}%
          </span>
          <span className="text-[10px] text-gray-500">24h Change</span>
        </div>
        <div className="flex flex-col hidden sm:flex">
          <span className="text-[13px] font-mono font-medium text-gray-200">{parseFloat(currentMarket.volume).toLocaleString()} USDT</span>
          <span className="text-[10px] text-gray-500">24h Volume</span>
        </div>
        <div className="flex flex-col hidden md:flex">
          <span className="text-[13px] font-mono font-medium text-blue-400">0.0125%</span>
          <span className="text-[10px] text-gray-500">Funding / 1h</span>
        </div>
      </div>
    </div>
  );
}

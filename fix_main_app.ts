import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const mainAppStr = `
function MainApp({ view = 'trade' }: { view?: 'trade' | 'swap' | 'portfolio' | 'earn' | 'futures' }) {
  const [isMultiChart, setIsMultiChart] = useState(false);
  const [multiTickers] = useState(['BTC-USDT', 'ETH-USDT', 'SOL-USDT', 'ARB-USDT']);
  const { theme } = useTheme();

  const getBgClass = () => {
    if (theme === 'midnight') return 'bg-[#090514]';
    if (theme === 'cyberpunk') return 'bg-[#0a040b]';
    return 'bg-[#05070A]';
  };

  const getAccent1 = () => {
    if (theme === 'midnight') return 'bg-purple-500/10';
    if (theme === 'cyberpunk') return 'bg-pink-500/10';
    return 'bg-blue-500/10';
  };

  const getAccent2 = () => {
    if (theme === 'midnight') return 'bg-indigo-500/5';
    if (theme === 'cyberpunk') return 'bg-cyan-500/5';
    return 'bg-emerald-500/5';
  };

  const renderContent = () => {
    if (view === 'swap') {
      return (
        <div className="flex-1 flex justify-center items-center overflow-y-auto p-4 z-10">
          <div className="w-full max-w-md bg-[#0F131A] border border-white/10 rounded-2xl flex flex-col max-h-[80vh] overflow-hidden">
             <div className="p-4 border-b border-white/5 font-bold text-lg">Swap</div>
             <OrderForm forceMode="swap" />
          </div>
        </div>
      );
    }
    
    if (view === 'portfolio') {
      return (
        <div className="flex-1 flex flex-col overflow-y-auto p-4 z-10 space-y-6 max-w-7xl mx-auto w-full">
          <h2 className="text-2xl font-bold">Portfolio</h2>
          <PortfolioSummary />
          <PositionsList />
        </div>
      );
    }
    
    if (view === 'earn') {
      return (
        <div className="flex-1 flex flex-col overflow-y-auto p-4 z-10 space-y-6 max-w-7xl mx-auto w-full items-center justify-center">
          <h2 className="text-2xl font-bold text-gray-400">Earn Features Coming Soon</h2>
        </div>
      );
    }

    // Default trade/futures view
    return (
      <div className="flex-1 flex flex-col overflow-y-auto lg:overflow-hidden z-10 bg-[#05070A]">
        <MarketTicker />
        
        {/* Desktop Layout - Professional Split */}
        <div className="hidden lg:flex flex-1 overflow-hidden">
          {/* Left Column: Chart (top) + Positions (bottom) */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 flex flex-col overflow-hidden relative">
              {isMultiChart ? (
                <MultiChartGrid tickers={multiTickers} onToggleSingle={() => setIsMultiChart(false)} />
              ) : (
                <TradingChart onToggleMultiChart={() => setIsMultiChart(true)} />
              )}
            </div>
            
            <div className="h-[320px] shrink-0 border-t border-white/5 flex flex-col overflow-hidden bg-[#0B0E14]">
               <PositionsList />
            </div>
          </div>
          
          {/* Right Column: OrderBook (Top) + OrderForm (Bottom) */}
          <div className="w-[340px] shrink-0 flex flex-col overflow-hidden border-l border-white/5 bg-[#0B0E14]">
            {/* OrderBook at Upper Right */}
            <div className="flex-1 flex flex-col overflow-hidden border-b border-white/5 min-h-[300px]">
               <OrderBook />
            </div>

            {/* OrderForm (Sell/Swap) at Lower Right */}
            <div className="h-[550px] shrink-0 flex flex-col overflow-hidden bg-[#0F131A] shadow-2xl relative z-20 border-t border-white/5">
               <OrderForm forceMode={view === 'futures' ? 'perp' : undefined} />
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex lg:hidden flex-col bg-[#05070A]">
          <div className="h-[450px] shrink-0 relative">
            {isMultiChart ? (
              <MultiChartGrid tickers={multiTickers} onToggleSingle={() => setIsMultiChart(false)} />
            ) : (
              <TradingChart onToggleMultiChart={() => setIsMultiChart(true)} />
            )}
          </div>
          
          {/* Buy/Sell (OrderForm) below chart */}
          <div className="border-t border-white/5 shadow-2xl z-20">
             <OrderForm forceMode={view === 'futures' ? 'perp' : undefined} />
          </div>

          {/* OrderBook */}
          <div className="h-[400px] border-t border-white/5">
             <OrderBook />
          </div>

          {/* Positions */}
          <div className="min-h-[400px] border-t border-white/5">
             <PositionsList />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={\`h-screen \${getBgClass()} text-white flex flex-col font-sans selection:bg-blue-500/30 overflow-hidden relative\`}>
      <div className={\`absolute top-0 left-1/4 w-[500px] h-[500px] \${getAccent1()} rounded-full blur-[120px] pointer-events-none\`}></div>
      <div className={\`absolute bottom-0 right-1/4 w-[600px] h-[600px] \${getAccent2()} rounded-full blur-[150px] pointer-events-none\`}></div>
      
      <Header />
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderContent()}
      </div>
      <Toasts />
    </div>
  );
}
`;

content = content.replace("import { TradingProvider", mainAppStr + "\nimport { TradingProvider");
fs.writeFileSync('src/App.tsx', content);


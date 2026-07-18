import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldLayout = `    // Default trade/futures view
    return (
      <div className="flex-1 flex flex-col overflow-y-auto lg:overflow-hidden z-10">
        <MarketTicker />
        <div className="flex-none lg:flex-1 h-[400px] lg:h-auto flex flex-col lg:flex-row overflow-hidden shrink-0">
          {isMultiChart ? (
            <MultiChartGrid tickers={multiTickers} onToggleSingle={() => setIsMultiChart(false)} />
          ) : (
            <>
              <TradingChart onToggleMultiChart={() => setIsMultiChart(true)} />
              <div className="hidden lg:flex w-[320px] border-l border-white/5 flex-col overflow-hidden">
                <OrderBook />
              </div>
            </>
          )}
        </div>
        <div className="flex-none lg:h-[350px] shrink-0 border-t border-white/5 flex flex-col lg:flex-row bg-[#0B0E14]">
           <div className="w-full lg:flex-1 h-[400px] lg:h-auto overflow-hidden order-2 lg:order-1 border-t lg:border-t-0 border-white/5">
              <PositionsList />
           </div>
           <div className="w-full lg:w-[350px] h-[500px] lg:h-auto lg:border-l border-white/5 overflow-hidden flex flex-col order-1 lg:order-2">
              <OrderForm forceMode={view === 'futures' ? 'perp' : undefined} />
           </div>
        </div>
      </div>
    );`;

const newLayout = `    // Default trade/futures view
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
          
          {/* Right Area: OrderBook + OrderForm */}
          <div className="w-[620px] shrink-0 flex overflow-hidden border-l border-white/5">
            {/* Middle Column: OrderBook */}
            <div className="w-[300px] shrink-0 flex flex-col overflow-hidden border-r border-white/5 bg-[#0B0E14]">
               <OrderBook />
            </div>

            {/* Right Column: OrderForm (Sell/Swap) */}
            <div className="w-[320px] shrink-0 flex flex-col overflow-hidden bg-[#0F131A] shadow-2xl relative z-20">
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
    );`;

content = content.replace(oldLayout, newLayout);
fs.writeFileSync('src/App.tsx', content);


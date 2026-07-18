import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldLayout = `          {/* Right Area: OrderBook + OrderForm */}
          <div className="w-[620px] shrink-0 flex overflow-hidden border-l border-white/5">
            {/* Middle Column: OrderBook */}
            <div className="w-[300px] shrink-0 flex flex-col overflow-hidden border-r border-white/5 bg-[#0B0E14]">
               <OrderBook />
            </div>

            {/* Right Column: OrderForm (Sell/Swap) */}
            <div className="w-[320px] shrink-0 flex flex-col overflow-hidden bg-[#0F131A] shadow-2xl relative z-20">
               <OrderForm forceMode={view === 'futures' ? 'perp' : undefined} />
            </div>
          </div>`;

const newLayout = `          {/* Right Column: OrderBook (Top) + OrderForm (Bottom) */}
          <div className="w-[340px] shrink-0 flex flex-col overflow-hidden border-l border-white/5 bg-[#0B0E14]">
            {/* OrderBook at Upper Right */}
            <div className="flex-1 flex flex-col overflow-hidden border-b border-white/5 min-h-[300px]">
               <OrderBook />
            </div>

            {/* OrderForm (Sell/Swap) at Lower Right */}
            <div className="h-[550px] shrink-0 flex flex-col overflow-hidden bg-[#0F131A] shadow-2xl relative z-20">
               <OrderForm forceMode={view === 'futures' ? 'perp' : undefined} />
            </div>
          </div>`;

content = content.replace(oldLayout, newLayout);
fs.writeFileSync('src/App.tsx', content);


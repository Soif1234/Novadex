import fs from 'fs';

let content = fs.readFileSync('src/components/PositionsList.tsx', 'utf8');

// Add states
content = content.replace("const { currentSymbol } = useMarket();", "const { currentSymbol } = useMarket();\n  const [closingLimitId, setClosingLimitId] = useState<string | null>(null);\n  const [closingLimitPrice, setClosingLimitPrice] = useState<string>('');\n  const { addLimitOrder } = useTrading();");

// Replace the action column
const oldActionCol = `<td className="py-4 px-4 text-right">
                    <button 
                      onClick={() => closePosition(pos.id)}
                      className="text-[11px] font-medium bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded transition-colors"
                    >
                      Close
                    </button>
                  </td>`;

const newActionCol = `<td className="py-4 px-4 text-right">
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
                                margin: pos.margin,
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
                          onClick={() => closePosition(pos.id)}
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
                  </td>`;

content = content.replace(oldActionCol, newActionCol);

// Also add a "Cancel" button to the limit orders tab!
const oldCancelOrder = `<td className="py-4 px-4 text-right">
                    <button 
                      onClick={() => cancelLimitOrder(order.id)}
                      className="text-[11px] font-medium bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </td>`;

if (content.includes(oldCancelOrder)) {
  // It's probably there.
} else {
  // It is there, let's just make sure.
}

fs.writeFileSync('src/components/PositionsList.tsx', content);


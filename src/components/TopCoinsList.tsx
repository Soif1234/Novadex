import React, { useEffect, useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle, Search } from 'lucide-react';
import { DepositWithdrawModal } from './DepositWithdrawModal';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
}

export function TopCoinsList() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'deposit'|'withdraw'>('deposit');
  const [selectedAsset, setSelectedAsset] = useState<string>('Native'); // or 'USDC'

  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=200&page=1&sparkline=false')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCoins(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredCoins = coins.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeposit = (symbol: string) => {
    setModalMode('deposit');
    setIsModalOpen(true);
  };

  const handleWithdraw = (symbol: string) => {
    setModalMode('withdraw');
    setIsModalOpen(true);
  };

  return (
    <div className="bg-[#0B0E14] border border-white/5 rounded-xl overflow-hidden mt-6">
      <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-white">Top 200 Assets</h3>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search assets..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-[#05070A] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 w-full sm:w-64"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading assets...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-white/5">
                <th className="p-4 font-medium">Asset</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">24h Change</th>
                <th className="p-4 font-medium hidden md:table-cell">Market Cap</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoins.map(coin => (
                <tr key={coin.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                      <div>
                        <div className="font-bold text-white">{coin.symbol.toUpperCase()}</div>
                        <div className="text-xs text-gray-500">{coin.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-gray-300">
                    ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                  </td>
                  <td className="p-4 font-mono">
                    <span className={coin.price_change_percentage_24h >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                      {coin.price_change_percentage_24h > 0 ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
                    </span>
                  </td>
                  <td className="p-4 font-mono text-gray-400 hidden md:table-cell">
                    ${coin.market_cap.toLocaleString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleDeposit(coin.symbol)}
                        className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors tooltip-trigger"
                        title="Deposit"
                      >
                        <ArrowDownCircle className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleWithdraw(coin.symbol)}
                        className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors tooltip-trigger"
                        title="Withdraw"
                      >
                        <ArrowUpCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCoins.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No assets found matching "{search}"</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      
      <DepositWithdrawModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialMode={modalMode} />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Settings2, Info } from 'lucide-react';
import { usePrice } from '../PriceContext';
import { useTrading } from '../TradingContext';
import { useMarket } from '../MarketContext';
import { RealSwapForm } from './RealSwapForm';
import { useAccount, useReadContract } from 'wagmi';
import { useAppChainId } from '../useAppChainId';
import { useAuth } from '../AuthContext';
import { erc20Abi } from '../abi';
import { formatUnits } from 'viem';
import { arbitrum, mainnet, bsc, base, optimism, polygon } from 'wagmi/chains';

const USDT_ADDRESSES = {
  [optimism.id]: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58' as const,
  [polygon.id]: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F' as const,
  [mainnet.id]: '0xdAC17F958D2ee523a2206206994597C13D831ec7' as const,
  [arbitrum.id]: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9' as const,
  [bsc.id]: '0x55d398326f99059fF775485246999027B3197955' as const,
  [base.id]: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const, // Placeholder for Base
};

export function OrderForm({ forceMode }: { forceMode?: 'perp' | 'swap' }) {
  const { currentPrice } = usePrice();
  const { currentSymbol } = useMarket();
  const { positions, addPosition, addTransaction, addLimitOrder, balance, setBalance } = useTrading();
  
  const { address: wagmiAddress, isConnected: isWagmiConnected } = useAccount();
  const { userData, wallet } = useAuth();
  const address = wagmiAddress || userData?.address;
  const isConnected = isWagmiConnected || !!userData?.address;
  const chainId = useAppChainId();
  
  const isSupportedChain = chainId === mainnet.id || chainId === arbitrum.id || chainId === bsc.id || chainId === base.id || chainId === optimism.id || chainId === polygon.id;
  const currentUsdtAddress = isSupportedChain ? USDT_ADDRESSES[chainId as keyof typeof USDT_ADDRESSES] : undefined;

  const { data: usdtBalanceData } = useReadContract({
    address: currentUsdtAddress as `0x${string}` | undefined,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address && isSupportedChain, refetchInterval: 15000 }
  });

  const { data: decimals = 6 } = useReadContract({
    address: currentUsdtAddress as `0x${string}` | undefined,
    abi: erc20Abi,
    functionName: 'decimals',
    query: { enabled: !!address && isSupportedChain, refetchInterval: 15000 }
  });

  const [mode, setMode] = useState<'perp' | 'swap'>(forceMode || 'perp');

  const realUsdtBalance = usdtBalanceData ? parseFloat(formatUnits(usdtBalanceData as bigint, decimals as number)) : 0;
  const totalMargin = positions.reduce((acc, pos) => acc + pos.margin, 0);
  const buyingPower = mode === 'swap' 
    ? realUsdtBalance 
    : Math.max(0, realUsdtBalance - totalMargin);
  
  useEffect(() => {
    if (forceMode) {
      setMode(forceMode);
    }
  }, [forceMode]);

  const [side, setSide] = useState<'long' | 'short'>('long');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [leverage, setLeverage] = useState(20);
  
  const [payAmount, setPayAmount] = useState<string>('');
  const [sizeAmount, setSizeAmount] = useState<string>('');
  const [limitPriceStr, setLimitPriceStr] = useState<string>('');

  const handlePayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setPayAmount(val);
      if (val) {
        const p = orderType === 'limit' && limitPriceStr ? parseFloat(limitPriceStr) : currentPrice;
        if (p > 0) {
            const size = mode === 'swap' ? parseFloat(val) / p : (parseFloat(val) * leverage) / p;
            setSizeAmount(size.toFixed(4));
        }
      } else {
        setSizeAmount('');
      }
    }
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setSizeAmount(val);
      if (val) {
        const p = orderType === 'limit' && limitPriceStr ? parseFloat(limitPriceStr) : currentPrice;
        if (p > 0) {
            const pay = mode === 'swap' ? parseFloat(val) * p : (parseFloat(val) * p) / leverage;
            setPayAmount(pay.toFixed(2));
        }
      } else {
        setPayAmount('');
      }
    }
  };

  useEffect(() => {
    if (payAmount) {
      const p = orderType === 'limit' && limitPriceStr ? parseFloat(limitPriceStr) : currentPrice;
      if (p > 0) {
        const size = mode === 'swap' 
          ? parseFloat(payAmount) / p 
          : (parseFloat(payAmount) * leverage) / p;
        setSizeAmount(size.toFixed(4));
      }
    }
  }, [leverage, orderType, limitPriceStr, currentPrice, payAmount, mode]);

  let liqPrice = 0;
  const execPrice = orderType === 'limit' && limitPriceStr ? parseFloat(limitPriceStr) : currentPrice;
  if (payAmount && sizeAmount && execPrice > 0) {
    const maintenanceMargin = 0.005; // 0.5%
    if (side === 'long') {
      liqPrice = execPrice * (1 - 1 / leverage + maintenanceMargin);
    } else {
      liqPrice = execPrice * (1 + 1 / leverage - maintenanceMargin);
    }
  }

  const fees = (sizeAmount && execPrice > 0) ? parseFloat(sizeAmount) * execPrice * 0.0001 : 0; 

  const handleSubmit = () => {
    const pay = parseFloat(payAmount);
    const size = parseFloat(sizeAmount);
    
    if (isNaN(pay) || isNaN(size) || pay <= 0) return;

    // Wallet connection requirement is only for real swaps. 
    if (!isConnected) {
      alert("Please log in or connect your wallet");
      return;
    }

    if (pay > buyingPower) {
      alert("Insufficient available USDT buying power");
      return;
    }

    const orderId = Math.random().toString(36).substr(2, 9);
    
    if (orderType === 'limit') {
      const lPrice = parseFloat(limitPriceStr);
      if (isNaN(lPrice) || lPrice <= 0) {
        alert("Enter a valid limit price");
        return;
      }
      
      setBalance(prev => prev - pay);
      addLimitOrder({
        id: orderId,
        market: currentSymbol,
        side,
        leverage,
        size,
        limitPrice: lPrice,
        margin: pay,
        timestamp: new Date().toLocaleString()
      });
      
      addTransaction({
        id: Math.random().toString(36).substr(2, 9),
        market: currentSymbol,
        type: 'Limit ' + (side === 'long' ? 'Buy' : 'Sell'),
        side,
        price: lPrice,
        size,
        fee: 0,
        timestamp: new Date().toLocaleString()
      });
    } else {
      setBalance(prev => prev - pay);
      addPosition({
        id: orderId,
        market: currentSymbol,
        side,
        leverage,
        size,
        entryPrice: currentPrice,
        markPrice: currentPrice,
        liqPrice,
        margin: pay,
        pnl: 0,
        pnlPercent: 0
      });

      addTransaction({
        id: Math.random().toString(36).substr(2, 9),
        market: currentSymbol,
        type: 'Market ' + (side === 'long' ? 'Buy' : 'Sell'),
        side,
        price: currentPrice,
        size,
        fee: fees,
        timestamp: new Date().toLocaleString()
      });
    }

    setPayAmount('');
    setSizeAmount('');
    setLimitPriceStr('');
  };

  const currentCoinStr = currentSymbol ? currentSymbol.split('-')[0] : 'Coin';
  const currentCoinFirstLetter = currentCoinStr ? currentCoinStr.charAt(0) : 'C';

  return (
    <div className="w-full h-full bg-[#0B0E14] flex flex-col shrink-0">
      {!forceMode && (
        <div className="h-14 border-b border-white/5 flex items-center px-4 justify-between shrink-0">
          <div className="flex bg-white/5 p-1 rounded-lg w-full">
            <button 
              onClick={() => setMode('perp')}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === 'perp' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Futures
            </button>
            <button 
              onClick={() => setMode('swap')}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === 'swap' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:text-white'}`}
            >
              Swap
            </button>
          </div>
        </div>
      )}

      {mode === 'swap' ? (
        <RealSwapForm />
      ) : (
        <div className="p-4 flex-1 overflow-y-auto no-scrollbar">
          <div className="flex bg-white/5 p-1 rounded-lg w-full mb-6">
            <button 
              onClick={() => setSide('long')}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${side === 'long' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400 hover:text-white'}`}
            >
              Long
            </button>
            <button 
              onClick={() => setSide('short')}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${side === 'short' ? 'bg-red-500/20 text-red-400' : 'text-gray-400 hover:text-white'}`}
            >
              Short
            </button>
          </div>
          
          <div className="flex items-center space-x-4 mb-6">
            <button 
              onClick={() => setOrderType('market')}
              className={`text-sm font-medium pb-1 border-b-2 transition-colors ${orderType === 'market' ? 'border-blue-400 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
            >
              Market
            </button>
            <button 
              onClick={() => setOrderType('limit')}
              className={`text-sm font-medium pb-1 border-b-2 transition-colors ${orderType === 'limit' ? 'border-blue-400 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
            >
              Limit
            </button>
            <div className="flex-1"></div>
            <button className="text-gray-400 hover:text-white transition-colors">
              <Settings2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {orderType === 'limit' && (
              <div className="bg-white/5 border border-white/5 rounded-xl p-3">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>Price</span>
                  <span>USDT</span>
                </div>
                <div className="flex items-center justify-between">
                  <input 
                    type="text" 
                    placeholder={currentPrice > 0 ? currentPrice.toString() : "0.0"} 
                    value={limitPriceStr}
                    onChange={(e) => {
                      if (e.target.value === '' || /^\d*\.?\d*$/.test(e.target.value)) {
                        setLimitPriceStr(e.target.value);
                      }
                    }}
                    className="bg-transparent border-none text-2xl font-mono text-white focus:outline-none w-1/2" 
                  />
                  <div className="flex items-center gap-2 bg-white/10 px-2 py-1 rounded-lg">
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold">$</div>
                    <span className="text-sm font-medium text-white">USDT</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white/5 border border-white/5 rounded-xl p-3">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Pay</span>
                <span className="flex items-center gap-1 cursor-pointer hover:text-white" onClick={() => {
                  const val = buyingPower;
                  setPayAmount(val.toFixed(2));
                  const p = orderType === 'limit' && limitPriceStr ? parseFloat(limitPriceStr) : currentPrice;
                  if (p > 0 && val > 0) {
                      const size = mode === 'swap' ? val / p : (val * leverage) / p;
                      setSizeAmount(size.toFixed(4));
                  } else {
                      setSizeAmount('');
                  }
                }}>Available: <span className="text-white">{buyingPower.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT</span></span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <input 
                  type="text" 
                  placeholder="0.0" 
                  value={payAmount}
                  onChange={handlePayChange}
                  className="bg-transparent border-none text-2xl font-mono text-white focus:outline-none w-1/2" 
                />
                <div className="flex items-center gap-2 bg-white/10 px-2 py-1 rounded-lg">
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold">₮</div>
                  <span className="text-sm font-medium text-white">USDT</span>
                </div>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={buyingPower > 0 && payAmount ? Math.min(100, (parseFloat(payAmount) / buyingPower) * 100) : 0}
                onChange={(e) => {
                  const percentage = Number(e.target.value);
                  const newPay = (buyingPower * percentage) / 100;
                  setPayAmount(newPay > 0 ? newPay.toFixed(2) : '');
                  
                  const p = orderType === 'limit' && limitPriceStr ? parseFloat(limitPriceStr) : currentPrice;
                  if (p > 0 && newPay > 0) {
                      const size = mode === 'swap' ? newPay / p : (newPay * leverage) / p;
                      setSizeAmount(size.toFixed(4));
                  } else {
                      setSizeAmount('');
                  }
                }}
                className="touch-slider" 
              />
              <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-xl p-3">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Size</span>
                <span>Leverage: {leverage}x</span>
              </div>
              <div className="flex items-center justify-between">
                <input 
                  type="text" 
                  placeholder="0.0" 
                  value={sizeAmount}
                  onChange={handleSizeChange}
                  className="bg-transparent border-none text-2xl font-mono text-white focus:outline-none w-1/2" 
                />
                <div className="flex items-center gap-2 bg-white/10 px-2 py-1 rounded-lg">
                  <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-[10px] text-white font-bold">{currentCoinFirstLetter}</div>
                  <span className="text-sm font-medium text-white">{currentCoinStr}</span>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Leverage</span>
                <span className="text-white font-mono">{leverage}x</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="100" 
                value={leverage}
                onChange={(e) => setLeverage(Number(e.target.value))}
                className="touch-slider" 
              />
              <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                <span>1x</span>
                <span>100x</span>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="bg-[#0B0E14] border border-white/5 rounded-lg p-3 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Liq. Price</span>
                <span className="text-white font-mono">{liqPrice > 0 ? `$${liqPrice.toFixed(2)}` : '-'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Price Impact</span>
                <span className="text-emerald-400 font-mono">&lt; 0.01%</span>
              </div>
              <div className="flex justify-between text-xs items-center">
                <span className="text-gray-400 flex items-center gap-1">Fees <span className="bg-blue-500/20 text-blue-400 text-[9px] px-1.5 py-0.5 rounded-full border border-blue-500/20">L2 Optimized</span></span>
                <span className="text-white font-mono">{fees > 0 ? `${fees.toFixed(4)}` : '-'}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={!payAmount || parseFloat(payAmount) <= 0 || parseFloat(sizeAmount) <= 0}
            className={`w-full mt-6 py-4 rounded-xl font-bold text-lg shadow-lg transition-all active:scale-[0.98] ${
              side === 'long' 
                ? 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950 shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed' 
                : 'bg-red-500 hover:bg-red-400 text-red-950 shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            {orderType === 'limit' ? (side === 'long' ? 'Limit Long' : 'Limit Short') : (side === 'long' ? 'Buy / Long' : 'Sell / Short')}
          </button>
        </div>
      )}
    </div>
  );
}

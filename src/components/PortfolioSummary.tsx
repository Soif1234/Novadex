import React, { useState } from 'react';
import { PieChart, TrendingUp, ShieldAlert, Wallet, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { useAccount, useReadContract, useChainId } from 'wagmi';
import { useAuth } from '../AuthContext';
import { useTrading } from '../TradingContext';
import { usePrice } from '../PriceContext';
import { useMarket } from '../MarketContext';
import { erc20Abi } from '../abi';
import { formatUnits } from 'viem';
import { arbitrum, mainnet, bsc, base } from 'wagmi/chains';
import { DepositWithdrawModal } from './DepositWithdrawModal';

// USDC Token addresses
const USDC_ADDRESSES = {
  [mainnet.id]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as const,
  [arbitrum.id]: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831' as const,
  [bsc.id]: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d' as const,
  [base.id]: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const,
};

export function PortfolioSummary() {
  const { address: wagmiAddress, isConnected: isWagmiConnected } = useAccount();
  const { userData, wallet } = useAuth();
  const address = wagmiAddress || userData?.address;
  const isConnected = isWagmiConnected || !!userData?.address;
  const chainId = useChainId();
  const { positions, balance } = useTrading();
  const { currentPrice } = usePrice();
  const { currentSymbol } = useMarket();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'deposit'|'withdraw'>('deposit');

  
  const isSupportedChain = chainId === mainnet.id || chainId === arbitrum.id || chainId === bsc.id || chainId === base.id;
  const currentUsdcAddress = isSupportedChain ? USDC_ADDRESSES[chainId as keyof typeof USDC_ADDRESSES] : undefined;

  // Read real USDC balance from connected wallet
  const { data: usdcBalanceData } = useReadContract({
    address: currentUsdcAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address && isSupportedChain, refetchInterval: 15000 }
  });

  const { data: decimals = 6 } = useReadContract({
    address: currentUsdcAddress,
    abi: erc20Abi,
    functionName: 'decimals',
    query: { enabled: !!address && isSupportedChain, refetchInterval: 15000 }
  });

  const realUsdcBalance = usdcBalanceData ? parseFloat(formatUnits(usdcBalanceData as bigint, decimals as number)) : 0;

  // Compute live stats based on actual positions
  const unrealizedPnL = positions.reduce((acc, pos) => {
    let pnl = pos.pnl;
    if (pos.market === currentSymbol && currentPrice > 0) {
      const priceDiff = pos.side === 'long' ? (currentPrice - pos.entryPrice) : (pos.entryPrice - currentPrice);
      pnl = priceDiff * pos.size;
    }
    return acc + pnl;
  }, 0);
  
  const totalMargin = positions.reduce((acc, pos) => acc + pos.margin, 0);
  
  // Buying power is real USDC balance minus margin used
  const buyingPower = Math.max(0, (realUsdcBalance > 0 ? realUsdcBalance : balance) - totalMargin);
  const totalBalance = (realUsdcBalance > 0 ? realUsdcBalance : balance) + unrealizedPnL;
  
  const pnlPercent = totalBalance > 0 ? (unrealizedPnL / totalBalance) * 100 : 0;
  const actualUsdc = realUsdcBalance > 0 ? realUsdcBalance : balance;
  const collateralUsage = actualUsdc > 0 ? (totalMargin / actualUsdc) * 100 : 0;

  if (!isConnected) {
    return (
      <div className="h-16 bg-[#0B0E14] border-t border-white/5 flex items-center justify-center shrink-0">
        <span className="text-sm text-gray-500">Sign in or connect wallet to view portfolio</span>
      </div>
    );
  }

  return (
    <div className="h-20 bg-[#0B0E14] border-t border-white/5 flex items-center px-6 shrink-0 gap-8">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
          <PieChart className="w-5 h-5 text-blue-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Total Portfolio Value</span>
          <span className="text-lg font-mono font-bold text-white">${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>

      <div className="h-8 w-px bg-white/10 hidden md:block"></div>

      <div className="items-center gap-4 hidden md:flex">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Unrealized PnL</span>
          <div className="flex items-end gap-2">
            <span className={`text-base font-mono font-bold ${unrealizedPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {unrealizedPnL >= 0 ? '+' : ''}${unrealizedPnL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={`text-xs font-mono mb-0.5 ${unrealizedPnL >= 0 ? 'text-emerald-400/80' : 'text-red-400/80'}`}>
              ({unrealizedPnL >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      <div className="h-8 w-px bg-white/10 hidden lg:block"></div>

      <div className="items-center gap-4 hidden lg:flex">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> Margin Usage</span>
          <div className="flex items-center gap-3">
            <span className="text-base font-mono font-bold text-white">{collateralUsage.toFixed(1)}%</span>
            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden mt-0.5">
              <div 
                className={`h-full ${collateralUsage > 80 ? 'bg-red-500' : collateralUsage > 50 ? 'bg-orange-500' : 'bg-emerald-500'}`} 
                style={{ width: `${collateralUsage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1"></div>

      <div className="flex items-center gap-6">
        <div className="flex gap-2">
          <button 
            onClick={() => { setModalMode('deposit'); setIsModalOpen(true); }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium transition-colors"
          >
            <ArrowDownCircle className="w-4 h-4" /> Deposit
          </button>
          <button 
            onClick={() => { setModalMode('withdraw'); setIsModalOpen(true); }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <ArrowUpCircle className="w-4 h-4" /> Withdraw
          </button>
        </div>
        <div className="flex flex-col items-end hidden sm:flex">
          <span className="text-xs text-gray-500 flex items-center gap-1">Wallet Buying Power (USDC) <Wallet className="w-3 h-3 text-blue-400 ml-1" /></span>
          <span className="text-base font-mono font-bold text-gray-200">${buyingPower.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>
      <DepositWithdrawModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialMode={modalMode} />
    </div>
  );
}

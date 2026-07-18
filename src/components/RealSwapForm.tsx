import React, { useState, useEffect } from 'react';
import { useAccount, useSwitchChain, useReadContract } from 'wagmi';
import { useAppChainId } from '../useAppChainId';
import { arbitrum, mainnet, bsc, base, optimism, polygon } from 'wagmi/chains';
import { formatUnits, erc20Abi } from 'viem';
import { ArrowDown, ChevronDown } from 'lucide-react';
import { useTrading } from '../TradingContext';
import { useAuth } from '../AuthContext';

export const ROUTERS = {
  [mainnet.id]: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  [arbitrum.id]: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506', // Sushi
  [base.id]: '0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24', // Sushi
  [bsc.id]: '0x10ED43C718714eb63d5aA57B78B54704E256024E' // Pancake
};

export const TOKENS_BY_CHAIN: Record<number, any[]> = {
  [mainnet.id]: [
    { symbol: 'WETH', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', decimals: 18, logo: 'Ξ' },
    { symbol: 'USDC', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6, logo: '$' },
    { symbol: 'USDT', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6, logo: '₮' },
    { symbol: 'BNB', address: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52', decimals: 18, logo: 'B' },
    { symbol: 'WBTC', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', decimals: 8, logo: '₿' }
  ],
  [bsc.id]: [
    { symbol: 'WBNB', address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', decimals: 18, logo: 'B' },
    { symbol: 'USDC', address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', decimals: 18, logo: '$' },
    { symbol: 'USDT', address: '0x55d398326f99059fF775485246999027B3197955', decimals: 18, logo: '₮' },
    { symbol: 'ETH', address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', decimals: 18, logo: 'Ξ' }
  ],
  [arbitrum.id]: [
    { symbol: 'WETH', address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', decimals: 18, logo: 'Ξ' },
    { symbol: 'USDC', address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6, logo: '$' },
    { symbol: 'USDT', address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', decimals: 6, logo: '₮' },
    { symbol: 'WBTC', address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f', decimals: 8, logo: '₿' }
  ],
  [base.id]: [
    { symbol: 'WETH', address: '0x4200000000000000000000000000000000000006', decimals: 18, logo: 'Ξ' },
    { symbol: 'USDC', address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', decimals: 6, logo: '$' },
    { symbol: 'cbBTC', address: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf', decimals: 8, logo: '₿' }
  ]
};

export function RealSwapForm() {
  const { address: wagmiAddress, isConnected: isWagmiConnected } = useAccount();
  const { userData, wallet } = useAuth();
  const address = wagmiAddress || userData?.address;
  const isConnected = isWagmiConnected || !!wallet;
  const chainId = useAppChainId();
  
  const currentTokens = TOKENS_BY_CHAIN[chainId as keyof typeof TOKENS_BY_CHAIN] || TOKENS_BY_CHAIN[mainnet.id];
  const currentRouter = ROUTERS[chainId as keyof typeof ROUTERS] || ROUTERS[mainnet.id];

  const [payToken, setPayToken] = useState(currentTokens[0]);
  const [receiveToken, setReceiveToken] = useState(currentTokens[1]);
  
  // Keep tokens in sync when chain changes
  useEffect(() => {
    const tokens = TOKENS_BY_CHAIN[chainId as keyof typeof TOKENS_BY_CHAIN] || TOKENS_BY_CHAIN[mainnet.id];
    setPayToken(tokens[0]);
    setReceiveToken(tokens[1]);
  }, [chainId]);
  
  const [isPayDropdownOpen, setIsPayDropdownOpen] = useState(false);
  const [isReceiveDropdownOpen, setIsReceiveDropdownOpen] = useState(false);
  
  const { data: balanceRaw } = useReadContract({
    address: payToken.address as any,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: chainId || mainnet.id,
    query: { enabled: !!address, refetchInterval: 15000 }
  });
  
  const balance = balanceRaw !== undefined ? formatUnits(balanceRaw as bigint, payToken.decimals) : '0.00';
  
  const { executeSwap, checkAllowance, approveToken } = useTrading();
  
  const [amount, setAmount] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [allowance, setAllowance] = useState('0');
  const [hash, setHash] = useState('');
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (isConnected && address && payToken.address) {
      checkAllowance(payToken.address, currentRouter).then(setAllowance).catch(console.error);
    }
  }, [amount, isConnected, address, payToken, currentRouter]);

  const handleApprove = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first.");
      return;
    }
    setIsApproving(true);
    setError(null);
    try {
      await approveToken(payToken.address, currentRouter, amount);
      const newAllowance = await checkAllowance(payToken.address, currentRouter);
      setAllowance(newAllowance);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsApproving(false);
    }
  };

  const handleSwap = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first.");
      return;
    }
    if (!chainId) return; // Should not happen if connected

    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return;
    
    setIsPending(true);
    setError(null);
    setHash('');
    
    try {
      const receipt = await executeSwap(amount, payToken.address, receiveToken.address, payToken.decimals, currentRouter);
      setHash(receipt.hash);
      setAmount('');
      const newAllowance = await checkAllowance(payToken.address, currentRouter);
      setAllowance(newAllowance);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsPending(false);
    }
  };

  const needsApproval = parseFloat(amount) > 0 && parseFloat(allowance) < parseFloat(amount);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col gap-4">
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-sm text-blue-200">
        This executes a real swap on the connected network. Use with caution.
      </div>

      {/* Pay Section */}
      <div className="bg-white/5 border border-white/5 rounded-xl p-3 relative">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>Pay</span>
          <span>Balance: {parseFloat(balance).toFixed(4)} {payToken.symbol}</span>
        </div>
        <div className="flex items-center justify-between">
          <input 
            type="text" 
            placeholder="0.0" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-transparent border-none text-2xl font-mono text-white focus:outline-none w-1/2" 
          />
          
          <div className="relative">
            <button 
              onClick={() => setIsPayDropdownOpen(!isPayDropdownOpen)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-2 py-1 rounded-lg transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold">{payToken.logo}</div>
              <span className="text-sm font-medium text-white">{payToken.symbol}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {isPayDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-[#0F131A] border border-white/10 rounded-lg shadow-2xl z-50 overflow-hidden">
                {currentTokens.map((t, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPayToken(t);
                      setIsPayDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 text-sm text-white"
                  >
                    <div className="w-4 h-4 rounded-full bg-blue-500/50 flex items-center justify-center text-[8px] font-bold">{t.logo}</div>
                    {t.symbol}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center -my-2 relative z-10">
        <div className="bg-[#0F131A] p-1 rounded-full border border-white/5 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => {
          const temp = payToken;
          setPayToken(receiveToken);
          setReceiveToken(temp);
        }}>
          <ArrowDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Receive Section */}
      <div className="bg-white/5 border border-white/5 rounded-xl p-3 relative">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>Receive</span>
          <span>Estimated</span>
        </div>
        <div className="flex items-center justify-between opacity-70">
          <input 
            type="text" 
            placeholder="0.0" 
            disabled
            value={amount ? (parseFloat(amount) * 0.99).toFixed(4) : ''}
            className="bg-transparent border-none text-xl font-mono text-white focus:outline-none w-1/2" 
          />
          <div className="relative">
            <button 
              onClick={() => setIsReceiveDropdownOpen(!isReceiveDropdownOpen)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-2 py-1 rounded-lg transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold">{receiveToken.logo}</div>
              <span className="text-sm font-medium text-white">{receiveToken.symbol}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {isReceiveDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-[#0F131A] border border-white/10 rounded-lg shadow-2xl z-50 overflow-hidden">
                {currentTokens.map((t, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setReceiveToken(t);
                      setIsReceiveDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 text-sm text-white"
                  >
                    <div className="w-4 h-4 rounded-full bg-blue-500/50 flex items-center justify-center text-[8px] font-bold">{t.logo}</div>
                    {t.symbol}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 flex justify-between px-1">
        <span>Slippage Tolerance</span>
        <span className="text-white">0.5%</span>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs text-red-400 break-words">
          {error.message}
        </div>
      )}

      {hash && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-xs text-emerald-400">
          Tx Submitted: {hash}
        </div>
      )}

      {needsApproval ? (
        <button 
          onClick={handleApprove}
          disabled={isApproving || parseFloat(amount) <= 0 || isNaN(parseFloat(amount))}
          className="w-full mt-2 py-4 rounded-xl font-bold text-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white transition-all active:scale-[0.98]"
        >
          {isApproving ? `Approving ${payToken.symbol}...` : `Approve ${payToken.symbol}`}
        </button>
      ) : (
        <button 
          onClick={handleSwap}
          disabled={isPending || parseFloat(amount) <= 0 || isNaN(parseFloat(amount))}
          className="w-full mt-2 py-4 rounded-xl font-bold text-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white transition-all active:scale-[0.98]"
        >
          {isPending ? 'Confirming in Wallet...' : !isConnected ? 'Sign in / Connect' : 'Swap'}
        </button>
      )}
    </div>
  );
}

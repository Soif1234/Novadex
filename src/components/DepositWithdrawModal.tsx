import React, { useState } from 'react';
import { X, ArrowDown, ArrowUp, Copy, Check, Send } from 'lucide-react';
import { useAccount, useWriteContract, useBalance, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { useAppChainId } from '../useAppChainId';
import { parseEther, formatEther } from 'viem';
import { arbitrum, mainnet, bsc, base, optimism, polygon } from 'wagmi/chains';
import { useAuth } from '../AuthContext';
import { ethers } from 'ethers';
import { erc20Abi } from '../abi';

const WNATIVE_ADDRESSES = {
  [optimism.id]: { address: '0x4200000000000000000000000000000000000006', symbol: 'WETH' },
  [polygon.id]: { address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', symbol: 'WMATIC' },
  [mainnet.id]: { address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', symbol: 'WETH' },
  [arbitrum.id]: { address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', symbol: 'WETH' },
  [base.id]: { address: '0x4200000000000000000000000000000000000006', symbol: 'WETH' },
  [bsc.id]: { address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', symbol: 'WBNB' }
};

const USDC_ADDRESSES = {
  [optimism.id]: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
  [polygon.id]: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
  [mainnet.id]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  [arbitrum.id]: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  [bsc.id]: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  [base.id]: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
};

const WNATIVE_ABI = [
  {
    "constant": false,
    "inputs": [],
    "name": "deposit",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{ "name": "wad", "type": "uint256" }],
    "name": "withdraw",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export function DepositWithdrawModal({ isOpen, onClose, initialMode = 'deposit' }: { isOpen: boolean, onClose: () => void, initialMode?: 'deposit' | 'withdraw' }) {
  const [mode, setMode] = useState<'deposit' | 'withdraw'>(initialMode);
  const [amount, setAmount] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [selectedToken, setSelectedToken] = useState<'Native' | 'USDC'>('Native');
  const [copied, setCopied] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState('');

  const { address: wagmiAddress, isConnected: isWagmiConnected } = useAccount();
  const chainId = useAppChainId();
  const { userData, wallet } = useAuth();
  
  const address = wagmiAddress || userData?.address;
  const isEmailWallet = !isWagmiConnected && !!wallet;

  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setAmount('');
      setTxHash('');
      setSendError('');
      setDestinationAddress('');
    }
  }, [isOpen, initialMode]);

  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  
  const isSupportedChain = chainId === mainnet.id || chainId === arbitrum.id || chainId === bsc.id || chainId === base.id || chainId === optimism.id || chainId === polygon.id;
  const targetContract = isSupportedChain ? WNATIVE_ADDRESSES[chainId as keyof typeof WNATIVE_ADDRESSES] : null;
  const currentUsdcAddress = isSupportedChain ? USDC_ADDRESSES[chainId as keyof typeof USDC_ADDRESSES] : null;
  
  const nativeSymbol = chainId === bsc.id ? 'BNB' : chainId === polygon.id ? 'MATIC' : 'ETH';

  // Get Balances using wagmi (works for both wagmi connected and internal wallet address)
  const { data: nativeBalanceData } = useBalance({
    address: address as any,
    query: { enabled: !!address && isSupportedChain, refetchInterval: 15000 }
  });

  const { data: wrappedBalanceDataRaw } = useReadContract({
    address: targetContract?.address as any,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address as any] : undefined,
    query: { enabled: !!address && !!targetContract, refetchInterval: 15000 }
  });

  const { data: usdcBalanceDataRaw } = useReadContract({
    address: currentUsdcAddress as any,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address as any] : undefined,
    query: { enabled: !!address && !!currentUsdcAddress, refetchInterval: 15000 }
  });

  if (!isOpen) return null;

  const handleCopy = () => {
    if (userData?.address) {
      navigator.clipboard.writeText(userData.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleInternalWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet || !destinationAddress || !amount || parseFloat(amount) <= 0) return;
    
    setIsSending(true);
    setSendError('');
    setTxHash('');

    try {
      const rpcUrl = chainId === arbitrum.id ? 'https://arb1.arbitrum.io/rpc' 
         : chainId === bsc.id ? 'https://bsc-dataseed.binance.org/' 
         : chainId === base.id ? 'https://mainnet.base.org' 
         : chainId === optimism.id ? 'https://mainnet.optimism.io'
         : chainId === polygon.id ? 'https://polygon-rpc.com'
         : 'https://eth.llamarpc.com'; // fallback to eth mainnet
      
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const connectedWallet = wallet.connect(provider);

      if (selectedToken === 'Native') {
        const tx = await connectedWallet.sendTransaction({
          to: destinationAddress,
          value: parseEther(amount)
        });
        setTxHash(tx.hash);
      } else if (selectedToken === 'USDC' && currentUsdcAddress) {
        const decimals = chainId === bsc.id ? 18 : 6;
        const usdcContract = new ethers.Contract(currentUsdcAddress, erc20Abi, connectedWallet);
        const parsedAmount = ethers.parseUnits(amount, decimals);
        const tx = await usdcContract.transfer(destinationAddress, parsedAmount);
        setTxHash(tx.hash);
      }
    } catch (err: any) {
      console.error(err);
      setSendError(err.message || 'Transaction failed');
    } finally {
      setIsSending(false);
    }
  };

  const handleWagmiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetContract || !amount || parseFloat(amount) <= 0) return;
    
    try {
      if (mode === 'deposit') {
        // @ts-ignore
        writeContract({
          address: targetContract.address as any,
          abi: WNATIVE_ABI,
          functionName: 'deposit',
          value: parseEther(amount),
        });
      } else {
        // @ts-ignore
        writeContract({
          address: targetContract.address as any,
          abi: WNATIVE_ABI,
          functionName: 'withdraw',
          args: [parseEther(amount)],
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getBalanceDisplay = () => {
    if (isEmailWallet && mode === 'withdraw') {
      if (selectedToken === 'Native') {
         return nativeBalanceData ? formatEther(nativeBalanceData.value).substring(0, 8) : '0';
      } else {
         return usdcBalanceDataRaw ? ethers.formatUnits(usdcBalanceDataRaw as bigint, chainId === bsc.id ? 18 : 6).substring(0, 8) : '0';
      }
    }

    if (mode === 'deposit') {
      return nativeBalanceData ? formatEther(nativeBalanceData.value).substring(0, 8) : '0';
    } else {
      return wrappedBalanceDataRaw ? formatEther(wrappedBalanceDataRaw as bigint).substring(0, 8) : '0';
    }
  };

  const setMaxAmount = () => {
    setAmount(getBalanceDisplay());
  };

  if (isEmailWallet) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
        <div className="bg-[#0F131A] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden flex flex-col relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
          
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-2">Internal Wallet</h2>
            <p className="text-xs text-gray-400 mb-6">
              You are connected with an email account. This uses a dedicated wallet address for your funds.
            </p>

            <div className="flex bg-white/5 p-1 rounded-lg w-full mb-6">
              <button 
                onClick={() => setMode('deposit')}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === 'deposit' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400 hover:text-white'}`}
              >
                Deposit
              </button>
              <button 
                onClick={() => setMode('withdraw')}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === 'withdraw' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:text-white'}`}
              >
                Withdraw
              </button>
            </div>

            {mode === 'deposit' ? (
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center space-y-4">
                  <div className="flex flex-col items-center w-full">
                    <span className="text-xs text-gray-500 mb-1">Your Dedicated Deposit Address</span>
                    <div className="flex items-center gap-2 bg-[#0B0E14] px-3 py-2 rounded-lg w-full border border-white/10">
                      <span className="text-sm font-mono text-white break-all flex-1">{userData?.address}</span>
                      <button onClick={handleCopy} className="text-gray-400 hover:text-white shrink-0 p-1">
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-xs text-blue-200 text-center">
                  Funds sent to this address on supported chains (Ethereum, Arbitrum, BSC, Base) will automatically appear in your portfolio.
                </div>
              </div>
            ) : (
              <form onSubmit={handleInternalWithdraw} className="space-y-4">
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400">Destination Address</label>
                    <input 
                      type="text" 
                      placeholder="0x..." 
                      value={destinationAddress}
                      onChange={(e) => setDestinationAddress(e.target.value)}
                      className="bg-[#0B0E14] border border-white/10 rounded-lg w-full p-2.5 text-sm font-mono text-white focus:outline-none focus:border-blue-500/50" 
                    />
                  </div>
                  <div className="space-y-1 pt-2 border-t border-white/5">
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <label>Amount & Asset</label>
                      <span className="cursor-pointer hover:text-white" onClick={setMaxAmount}>Balance: <span className="text-white">{getBalanceDisplay()}</span></span>
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="0.0" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-[#0B0E14] border border-white/10 rounded-lg flex-1 p-2.5 text-lg font-mono text-white focus:outline-none focus:border-blue-500/50" 
                      />
                      <select
                        value={selectedToken}
                        onChange={(e) => setSelectedToken(e.target.value as any)}
                        className="bg-[#0B0E14] border border-white/10 rounded-lg px-3 py-2 text-sm font-medium text-white focus:outline-none"
                      >
                        <option value="Native">{nativeSymbol}</option>
                        <option value="USDC">USDC</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {sendError && (
                  <div className="text-red-400 text-xs bg-red-400/10 p-2 rounded-lg border border-red-400/20 break-words">
                    {sendError}
                  </div>
                )}
                {txHash && (
                  <div className="text-emerald-400 text-xs bg-emerald-400/10 p-2 rounded-lg border border-emerald-400/20 break-words flex flex-col gap-1">
                    <span>Transaction Submitted!</span>
                    <span className="font-mono">{txHash}</span>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isSending || !amount || !destinationAddress || parseFloat(amount) <= 0}
                  className="w-full py-3.5 rounded-xl font-bold text-base bg-blue-600 hover:bg-blue-500 text-white transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSending ? 'Sending...' : <><Send className="w-4 h-4" /> Withdraw Funds</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-[#0F131A] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden flex flex-col relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-2">Vault Transfer</h2>
          <p className="text-xs text-gray-400 mb-6">
            To provide a fully decentralized and functional experience, depositing native tokens wraps them into a usable Vault format ({targetContract?.symbol}) on-chain.
          </p>

          <div className="flex bg-white/5 p-1 rounded-lg w-full mb-6">
            <button 
              onClick={() => setMode('deposit')}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === 'deposit' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400 hover:text-white'}`}
            >
              Deposit
            </button>
            <button 
              onClick={() => setMode('withdraw')}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === 'withdraw' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:text-white'}`}
            >
              Withdraw
            </button>
          </div>

          {!isSupportedChain ? (
            <div className="text-center text-red-400 p-4 bg-red-400/10 rounded-lg text-sm border border-red-400/20">
              Please connect to a supported mainnet (Ethereum, Arbitrum, BSC, or Base).
            </div>
          ) : (
            <form onSubmit={handleWagmiSubmit} className="space-y-4">
              <div className="bg-white/5 border border-white/5 rounded-xl p-3">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>{mode === 'deposit' ? 'Deposit Amount' : 'Withdraw Amount'}</span>
                  <span className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors" onClick={setMaxAmount}>
                    Balance: <span className="text-white">{getBalanceDisplay()} {mode === 'deposit' ? nativeSymbol : targetContract?.symbol}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <input 
                    type="text" 
                    placeholder="0.0" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-transparent border-none text-2xl font-mono text-white focus:outline-none w-1/2" 
                  />
                  <div className="flex items-center gap-2 bg-white/10 px-2 py-1 rounded-lg">
                    <span className="text-sm font-medium text-white">
                      {mode === 'deposit' ? nativeSymbol : targetContract?.symbol}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center -my-3 relative z-10">
                <div className="bg-[#0F131A] p-1.5 rounded-full border border-white/5">
                  {mode === 'deposit' ? <ArrowDown className="w-4 h-4 text-emerald-400" /> : <ArrowUp className="w-4 h-4 text-blue-400" />}
                </div>
              </div>

              <div className="bg-white/5 border border-white/5 rounded-xl p-3 opacity-70">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>Receive</span>
                </div>
                <div className="flex items-center justify-between">
                  <input 
                    type="text" 
                    disabled
                    value={amount || '0.0'}
                    className="bg-transparent border-none text-2xl font-mono text-white focus:outline-none w-1/2" 
                  />
                  <div className="flex items-center gap-2 bg-white/10 px-2 py-1 rounded-lg">
                    <span className="text-sm font-medium text-white">
                      {mode === 'deposit' ? targetContract?.symbol : nativeSymbol}
                    </span>
                  </div>
                </div>
              </div>

              {(writeError) && (
                <div className="text-red-400 text-xs bg-red-400/10 p-2 rounded-lg border border-red-400/20 break-words">
                  {writeError?.message}
                </div>
              )}

              {hash && (
                <div className="text-emerald-400 text-xs bg-emerald-400/10 p-2 rounded-lg border border-emerald-400/20 break-words">
                  Transaction hash: {hash}
                  {isConfirming && ' (Confirming...)'}
                  {isConfirmed && ' (Confirmed!)'}
                </div>
              )}

              <button 
                type="submit"
                disabled={isPending || isConfirming || !amount || parseFloat(amount) <= 0}
                className={`w-full py-3.5 rounded-xl font-bold text-base transition-all active:scale-[0.98] disabled:opacity-50
                  ${mode === 'deposit' 
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                    : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
              >
                {isPending ? 'Confirm in Wallet...' : isConfirming ? 'Processing...' : mode === 'deposit' ? `Deposit ${nativeSymbol}` : `Withdraw ${targetContract?.symbol}`}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

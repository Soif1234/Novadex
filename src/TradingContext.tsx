import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { useChainId } from 'wagmi';
import { arbitrum, mainnet, bsc, base } from 'wagmi/chains';
import { useAuth } from './AuthContext';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export type Position = {
  id: string;
  market: string;
  side: 'long' | 'short';
  leverage: number;
  size: number;
  entryPrice: number;
  markPrice: number;
  liqPrice: number;
  margin: number;
  pnl: number;
  pnlPercent: number;
};

export type Transaction = {
  id: string;
  market: string;
  type: string;
  side: 'long' | 'short';
  price: number;
  size: number;
  fee: number;
  timestamp: string;
};

export type LimitOrder = {
  id: string;
  market: string;
  side: 'long' | 'short';
  leverage: number;
  size: number;
  limitPrice: number;
  margin: number;
  timestamp: string;
};

interface TradingContextType {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  positions: Position[];
  addPosition: (pos: Position) => void;
  closePosition: (id: string, pnl?: number) => void;
  limitOrders: LimitOrder[];
  addLimitOrder: (order: LimitOrder) => void;
  cancelLimitOrder: (id: string) => void;
  history: Transaction[];
  addTransaction: (tx: Transaction) => void;
  executeSwap: (amount: string, tokenIn: string, tokenOut: string, decimalsIn?: number, customRouter?: string) => Promise<any>;
  executeAddLiquidity: (tokenA: string, tokenB: string, amountA: string, amountB: string) => Promise<any>;
  checkAllowance: (tokenAddress: string, spenderAddress: string) => Promise<string>;
  approveToken: (tokenAddress: string, spenderAddress: string, amount?: string) => Promise<any>;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export function TradingProvider({ children }: { children: ReactNode }) {
  const { user, wallet } = useAuth();
  const chainId = useChainId();
  const [balance, setBalance] = useState<number>(100000);
  const [positions, setPositions] = useState<Position[]>([]);
  const [limitOrders, setLimitOrders] = useState<LimitOrder[]>([]);
  const [history, setHistory] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('trading_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Sync with Firestore when user logs in
  useEffect(() => {
    if (user) {
      const docRef = doc(db, 'userData', user.uid);
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.positions) setPositions(data.positions);
          if (data.limitOrders) setLimitOrders(data.limitOrders);
          if (data.history) setHistory(data.history);
          if (data.balance) setBalance(data.balance);
        }
      });
      return () => unsubscribe();
    }
  }, [user]);

  // Save to Firestore and local storage on changes
  useEffect(() => {
    localStorage.setItem('trading_history', JSON.stringify(history));
    if (user) {
      setDoc(doc(db, 'userData', user.uid), {
        positions,
        limitOrders,
        history,
        balance
      }, { merge: true }).catch(console.error);
    }
  }, [history, positions, limitOrders, balance, user]);

  const addPosition = (pos: Position) => {
    setPositions(prev => [...prev, pos]);
  };

  const closePosition = (id: string, pnl: number = 0) => {
    setPositions(prev => {
      const pos = prev.find(p => p.id === id);
      if (pos) {
        setBalance(b => b + pos.margin + pnl);
      }
      return prev.filter(p => p.id !== id);
    });
  };

  const addLimitOrder = (order: LimitOrder) => {
    setLimitOrders(prev => [...prev, order]);
  };

  const cancelLimitOrder = (id: string) => {
    setLimitOrders(prev => {
      const order = prev.find(o => o.id === id);
      if (order) {
        setBalance(b => b + order.margin);
      }
      return prev.filter(o => o.id !== id);
    });
  };

  const addTransaction = (tx: Transaction) => {
    setHistory(prev => [tx, ...prev]);
  };

  const executeSwap = async (amountIn: string, tokenIn: string, tokenOut: string, decimalsIn: number = 18, customRouter?: string) => {
    let signer;
    if (wallet) {
      // Use the generated wallet connected to a default provider (e.g. Ethereum mainnet or Arbitrum)
            const rpcUrl = chainId === arbitrum.id ? 'https://arb1.arbitrum.io/rpc' 
        : chainId === bsc.id ? 'https://bsc-dataseed.binance.org/' 
        : chainId === base.id ? 'https://mainnet.base.org' 
        : 'https://eth.llamarpc.com'; // fallback to eth mainnet
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      signer = wallet.connect(provider);
    } else if (window.ethereum) {
      // Fallback to Wagmi/Injected
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      signer = await provider.getSigner();
    } else {
      throw new Error("No crypto wallet found. Please sign in or connect a wallet.");
    }
    
    const routerAddress = customRouter || '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
    
    const routerAbi = [
      "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)"
    ];
    
    const router = new ethers.Contract(routerAddress, routerAbi, signer);
    
    const tx = await router.swapExactTokensForTokens(
      ethers.parseUnits(amountIn, decimalsIn),
      0, // amountOutMin
      [tokenIn, tokenOut],
      signer.address,
      Math.floor(Date.now() / 1000) + 60 * 20
    );
    
    const receipt = await tx.wait();
    
    addTransaction({
      id: receipt.hash.substring(0, 8),
      market: 'SWAP',
      type: 'Real Swap',
      side: 'long',
      price: 0,
      size: parseFloat(amountIn),
      fee: 0,
      timestamp: new Date().toLocaleString()
    });
    
    return receipt;
  };

  const executeAddLiquidity = async (tokenA: string, tokenB: string, amountA: string, amountB: string) => {
    let signer;
    if (wallet) {
            const rpcUrl = chainId === arbitrum.id ? 'https://arb1.arbitrum.io/rpc' 
        : chainId === bsc.id ? 'https://bsc-dataseed.binance.org/' 
        : chainId === base.id ? 'https://mainnet.base.org' 
        : 'https://eth.llamarpc.com'; // fallback to eth mainnet
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      signer = wallet.connect(provider);
    } else if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      signer = await provider.getSigner();
    } else {
      throw new Error("No crypto wallet found");
    }
    
    const routerAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
    const routerAbi = [
      "function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB, uint liquidity)"
    ];
    
    const router = new ethers.Contract(routerAddress, routerAbi, signer);
    const tx = await router.addLiquidity(
      tokenA,
      tokenB,
      ethers.parseUnits(amountA, 18), 
      ethers.parseUnits(amountB, 18),
      0,
      0,
      signer.address,
      Math.floor(Date.now() / 1000) + 60 * 20
    );
    return tx.wait();
  };

  const checkAllowance = async (tokenAddress: string, spenderAddress: string) => {
    let signer;
    if (wallet) {
            const rpcUrl = chainId === arbitrum.id ? 'https://arb1.arbitrum.io/rpc' 
        : chainId === bsc.id ? 'https://bsc-dataseed.binance.org/' 
        : chainId === base.id ? 'https://mainnet.base.org' 
        : 'https://eth.llamarpc.com'; // fallback to eth mainnet
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      signer = wallet.connect(provider);
    } else if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      signer = await provider.getSigner();
    } else {
      return "0";
    }

    const erc20Abi = ["function allowance(address owner, address spender) external view returns (uint256)"];
    const contract = new ethers.Contract(tokenAddress, erc20Abi, signer);
    try {
      const allowance = await contract.allowance(signer.address, spenderAddress);
      return ethers.formatUnits(allowance, 18); // assuming 18 decimals for simplicity
    } catch (e) {
      return "0";
    }
  };

  const approveToken = async (tokenAddress: string, spenderAddress: string, amount?: string) => {
    let signer;
    if (wallet) {
            const rpcUrl = chainId === arbitrum.id ? 'https://arb1.arbitrum.io/rpc' 
        : chainId === bsc.id ? 'https://bsc-dataseed.binance.org/' 
        : chainId === base.id ? 'https://mainnet.base.org' 
        : 'https://eth.llamarpc.com'; // fallback to eth mainnet
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      signer = wallet.connect(provider);
    } else if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      signer = await provider.getSigner();
    } else {
      throw new Error("No crypto wallet found");
    }

    const erc20Abi = ["function approve(address spender, uint256 amount) external returns (bool)"];
    const contract = new ethers.Contract(tokenAddress, erc20Abi, signer);
    
    const tx = await contract.approve(spenderAddress, amount === 'max' ? ethers.MaxUint256 : ethers.parseUnits(amount || '100000000', 18));
    return tx.wait();
  };

  return (
    <TradingContext.Provider value={{ 
      balance, setBalance, positions, addPosition, closePosition, limitOrders, addLimitOrder, cancelLimitOrder, history, addTransaction, executeSwap, executeAddLiquidity, checkAllowance, approveToken
    }}>
      {children}
    </TradingContext.Provider>
  );
}

export function useTrading() {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
}

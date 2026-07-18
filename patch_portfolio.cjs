const fs = require('fs');
let code = fs.readFileSync('src/components/PortfolioSummary.tsx', 'utf-8');

code = code.replace(
`const USDC_ADDRESSES = {
  [optimism.id]: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85' as const,
  [polygon.id]: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359' as const,
  [mainnet.id]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as const,
  [arbitrum.id]: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831' as const,
  [bsc.id]: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d' as const,
  [base.id]: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const,
};`,
`const USDT_ADDRESSES = {
  [optimism.id]: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58' as const,
  [polygon.id]: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F' as const,
  [mainnet.id]: '0xdAC17F958D2ee523a2206206994597C13D831ec7' as const,
  [arbitrum.id]: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9' as const,
  [bsc.id]: '0x55d398326f99059fF775485246999027B3197955' as const,
  [base.id]: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const,
};`
);

code = code.replace(
`  const currentUsdcAddress = isSupportedChain ? USDC_ADDRESSES[chainId as keyof typeof USDC_ADDRESSES] : undefined;

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

  const realUsdcBalance = usdcBalanceData ? parseFloat(formatUnits(usdcBalanceData as bigint, decimals as number)) : 0;`,
`  const currentUsdtAddress = isSupportedChain ? USDT_ADDRESSES[chainId as keyof typeof USDT_ADDRESSES] : undefined;

  // Read real USDT balance from connected wallet
  const { data: usdtBalanceData } = useReadContract({
    address: currentUsdtAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address && isSupportedChain, refetchInterval: 15000 }
  });

  const { data: decimals = 6 } = useReadContract({
    address: currentUsdtAddress,
    abi: erc20Abi,
    functionName: 'decimals',
    query: { enabled: !!address && isSupportedChain, refetchInterval: 15000 }
  });

  const realUsdtBalance = usdtBalanceData ? parseFloat(formatUnits(usdtBalanceData as bigint, decimals as number)) : 0;`
);

code = code.replace(
`  // Buying power is real USDC balance minus margin used
  const buyingPower = Math.max(0, realUsdcBalance + balance);
  const totalBalance = realUsdcBalance + (balance + totalMargin) + unrealizedPnL;
  
  const pnlPercent = totalBalance > 0 ? (unrealizedPnL / totalBalance) * 100 : 0;
  const actualUsdc = realUsdcBalance + (balance + totalMargin);
  const collateralUsage = actualUsdc > 0 ? (totalMargin / actualUsdc) * 100 : 0;`,
`  // Buying power is real USDT balance minus margin used
  const buyingPower = Math.max(0, realUsdtBalance - totalMargin);
  const totalBalance = realUsdtBalance + unrealizedPnL;
  
  const pnlPercent = totalBalance > 0 ? (unrealizedPnL / totalBalance) * 100 : 0;
  const actualUsdt = realUsdtBalance;
  const collateralUsage = actualUsdt > 0 ? (totalMargin / actualUsdt) * 100 : 0;`
);

code = code.replace(
`          <span className="text-xs text-gray-500 flex items-center gap-1">Wallet Buying Power (USDC) <Wallet className="w-3 h-3 text-blue-400 ml-1" /></span>`,
`          <span className="text-xs text-gray-500 flex items-center gap-1">Wallet Buying Power (USDT) <Wallet className="w-3 h-3 text-blue-400 ml-1" /></span>`
);

fs.writeFileSync('src/components/PortfolioSummary.tsx', code);

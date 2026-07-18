const fs = require('fs');

let code = fs.readFileSync('src/components/DepositWithdrawModal.tsx', 'utf-8');

code = code.replace(
`const USDC_ADDRESSES = {
  [optimism.id]: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
  [polygon.id]: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
  [mainnet.id]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  [arbitrum.id]: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  [bsc.id]: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  [base.id]: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
};`,
`const USDC_ADDRESSES = {
  [optimism.id]: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
  [polygon.id]: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
  [mainnet.id]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  [arbitrum.id]: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  [bsc.id]: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  [base.id]: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
};

const USDT_ADDRESSES = {
  [optimism.id]: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
  [polygon.id]: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  [mainnet.id]: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  [arbitrum.id]: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
  [bsc.id]: '0x55d398326f99059fF775485246999027B3197955',
  [base.id]: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
};`
);

// We need chains in modal
code = code.replace(
`  const { userData, wallet } = useAuth();`,
`  const { userData, wallet, setEmailChainId } = useAuth();
  const chainsList = [mainnet, arbitrum, bsc, base, optimism, polygon];`
);

code = code.replace(
`  const [selectedToken, setSelectedToken] = useState<'Native' | 'USDC'>('Native');`,
`  const [selectedToken, setSelectedToken] = useState<'Native' | 'USDC' | 'USDT'>('Native');`
);

code = code.replace(
`  const currentUsdcAddress = isSupportedChain ? USDC_ADDRESSES[chainId as keyof typeof USDC_ADDRESSES] : null;`,
`  const currentUsdcAddress = isSupportedChain ? USDC_ADDRESSES[chainId as keyof typeof USDC_ADDRESSES] : null;
  const currentUsdtAddress = isSupportedChain ? USDT_ADDRESSES[chainId as keyof typeof USDT_ADDRESSES] : null;`
);

code = code.replace(
`  const { data: usdcBalanceDataRaw } = useReadContract({
    address: currentUsdcAddress as any,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address as any] : undefined,
    query: { enabled: !!address && !!currentUsdcAddress, refetchInterval: 15000 }
  });`,
`  const { data: usdcBalanceDataRaw } = useReadContract({
    address: currentUsdcAddress as any,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address as any] : undefined,
    query: { enabled: !!address && !!currentUsdcAddress, refetchInterval: 15000 }
  });
  const { data: usdtBalanceDataRaw } = useReadContract({
    address: currentUsdtAddress as any,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address as any] : undefined,
    query: { enabled: !!address && !!currentUsdtAddress, refetchInterval: 15000 }
  });`
);

fs.writeFileSync('src/components/DepositWithdrawModal.tsx', code);

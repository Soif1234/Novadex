const fs = require('fs');

const filesToUpdate = [
  'src/components/DepositWithdrawModal.tsx',
  'src/components/PortfolioSummary.tsx',
  'src/components/OrderForm.tsx',
  'src/components/RealSwapForm.tsx'
];

filesToUpdate.forEach(file => {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf-8');
    
    code = code.replace(/import \{ arbitrum, mainnet, bsc, base \} from 'wagmi\/chains';/g, 
      "import { arbitrum, mainnet, bsc, base, optimism, polygon } from 'wagmi/chains';");
      
    code = code.replace(/chainId === mainnet\.id \|\| chainId === arbitrum\.id \|\| chainId === bsc\.id \|\| chainId === base\.id/g,
      "chainId === mainnet.id || chainId === arbitrum.id || chainId === bsc.id || chainId === base.id || chainId === optimism.id || chainId === polygon.id");
      
    if (file.includes('DepositWithdrawModal.tsx') || file.includes('RealSwapForm.tsx')) {
        code = code.replace(/const WNATIVE_ADDRESSES = {/g, 
        `const WNATIVE_ADDRESSES = {
  [optimism.id]: { address: '0x4200000000000000000000000000000000000006', symbol: 'WETH' },
  [polygon.id]: { address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', symbol: 'WMATIC' },`);
    }
    
    code = code.replace(/const USDC_ADDRESSES = {/g, 
    `const USDC_ADDRESSES = {
  [optimism.id]: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
  [polygon.id]: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',`);
    
    code = code.replace(/const USDT_ADDRESSES = {/g, 
    `const USDT_ADDRESSES = {
  [optimism.id]: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
  [polygon.id]: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',`);

    // fallback native symbol
    code = code.replace(/chainId === bsc\.id \? 'BNB' : 'ETH'/g,
      "chainId === bsc.id ? 'BNB' : chainId === polygon.id ? 'MATIC' : 'ETH'");

    fs.writeFileSync(file, code);
  }
});

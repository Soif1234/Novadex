const fs = require('fs');

const replaceRpc = (file) => {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf-8');
    
    // add wagmi chains import if missing in trading context
    if (file.includes('TradingContext.tsx')) {
        if (!code.includes("import { arbitrum, mainnet, bsc, base, optimism, polygon } from 'wagmi/chains';")) {
             code = code.replace(/import \{ arbitrum, mainnet, bsc, base \} from 'wagmi\/chains';/, 
               "import { arbitrum, mainnet, bsc, base, optimism, polygon } from 'wagmi/chains';");
        }
    }
    
    code = code.replace(/const rpcUrl = chainId === arbitrum\.id \? 'https:\/\/arb1\.arbitrum\.io\/rpc'\s*: chainId === bsc\.id \? 'https:\/\/bsc-dataseed\.binance\.org\/'\s*: chainId === base\.id \? 'https:\/\/mainnet\.base\.org'\s*: 'https:\/\/eth\.llamarpc\.com';/g,
    `const rpcUrl = chainId === arbitrum.id ? 'https://arb1.arbitrum.io/rpc' 
         : chainId === bsc.id ? 'https://bsc-dataseed.binance.org/' 
         : chainId === base.id ? 'https://mainnet.base.org' 
         : chainId === optimism.id ? 'https://mainnet.optimism.io'
         : chainId === polygon.id ? 'https://polygon-rpc.com'
         : 'https://eth.llamarpc.com';`);
         
    fs.writeFileSync(file, code);
  }
}

replaceRpc('src/TradingContext.tsx');
replaceRpc('src/components/DepositWithdrawModal.tsx');

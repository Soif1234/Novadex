const fs = require('fs');
let code = fs.readFileSync('src/wagmiConfig.ts', 'utf-8');

code = code.replace("import { arbitrum, mainnet, bsc, base } from 'wagmi/chains';",
"import { arbitrum, mainnet, bsc, base, optimism, polygon } from 'wagmi/chains';");

code = code.replace("chains: [arbitrum, mainnet, bsc, base],",
"chains: [arbitrum, base, optimism, polygon, mainnet, bsc],");

fs.writeFileSync('src/wagmiConfig.ts', code);

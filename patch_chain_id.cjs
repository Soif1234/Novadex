const fs = require('fs');

const replaceInFile = (file) => {
  let code = fs.readFileSync(file, 'utf-8');
  
  // Replace import
  code = code.replace(/import \{ ([^}]*)useChainId([^}]*) \} from 'wagmi';/, (match, p1, p2) => {
      // we remove useChainId from wagmi imports
      const newImports = (p1 + p2).split(',').map(s => s.trim()).filter(s => s).join(', ');
      if (newImports) {
          return `import { ${newImports} } from 'wagmi';\nimport { useAppChainId } from '../useAppChainId';`;
      } else {
          return `import { useAppChainId } from '../useAppChainId';`;
      }
  });

  // some files might just have useChainId in a larger import block, some might be in TradingContext (different path)
  if (file === 'src/TradingContext.tsx') {
      code = code.replace(/import \{([^}]*)useChainId([^}]*)\} from 'wagmi';/, `import {$1$2} from 'wagmi';\nimport { useAppChainId } from './useAppChainId';`);
  }

  // Replace usage
  code = code.replace(/const chainId = useChainId\(\);/g, `const chainId = useAppChainId();`);
  
  fs.writeFileSync(file, code);
};

['src/components/Header.tsx', 'src/components/RealSwapForm.tsx', 'src/components/DepositWithdrawModal.tsx', 'src/components/PortfolioSummary.tsx', 'src/components/OrderForm.tsx'].forEach(replaceInFile);

// TradingContext is in src/
let tcCode = fs.readFileSync('src/TradingContext.tsx', 'utf-8');
tcCode = tcCode.replace(/import \{\s*useChainId\s*\} from 'wagmi';/, "import { useAppChainId } from './useAppChainId';");
tcCode = tcCode.replace(/const chainId = useChainId\(\);/g, "const chainId = useAppChainId();");
fs.writeFileSync('src/TradingContext.tsx', tcCode);

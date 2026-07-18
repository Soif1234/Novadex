const fs = require('fs');
let code = fs.readFileSync('src/components/OrderForm.tsx', 'utf-8');

code = code.replace(
`  const buyingPower = mode === 'swap' 
    ? realUsdtBalance 
    : Math.max(0, balance - totalMargin);`,
`  const actualBalanceForPerp = realUsdtBalance > 0 ? realUsdtBalance : balance;
  const buyingPower = mode === 'swap' 
    ? realUsdtBalance 
    : Math.max(0, actualBalanceForPerp - totalMargin);`
);

// We need to fix PortfolioSummary as well
fs.writeFileSync('src/components/OrderForm.tsx', code);

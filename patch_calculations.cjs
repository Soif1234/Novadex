const fs = require('fs');

const fixOrderForm = () => {
    let code = fs.readFileSync('src/components/OrderForm.tsx', 'utf-8');
    code = code.replace(
        `const actualBalanceForPerp = realUsdtBalance > 0 ? realUsdtBalance : balance;
  const buyingPower = mode === 'swap' 
    ? realUsdtBalance 
    : Math.max(0, actualBalanceForPerp - totalMargin);`,
        `const buyingPower = mode === 'swap' 
    ? realUsdtBalance 
    : Math.max(0, realUsdtBalance + balance);`
    );
    // There might be another place where buyingPower was defined.
    // Let's just use string replace.
    fs.writeFileSync('src/components/OrderForm.tsx', code);
};

const fixPortfolioSummary = () => {
    let code = fs.readFileSync('src/components/PortfolioSummary.tsx', 'utf-8');
    
    // Replace buyingPower
    code = code.replace(
        `const buyingPower = Math.max(0, (realUsdcBalance > 0 ? realUsdcBalance : balance) - totalMargin);`,
        `const buyingPower = Math.max(0, realUsdcBalance + balance);`
    );
    
    // Replace totalBalance
    code = code.replace(
        `const totalBalance = (realUsdcBalance > 0 ? realUsdcBalance : balance) + unrealizedPnL;`,
        `const totalBalance = realUsdcBalance + (balance + totalMargin) + unrealizedPnL;`
    );
    
    // Replace actualUsdc and collateralUsage
    code = code.replace(
        `const actualUsdc = realUsdcBalance > 0 ? realUsdcBalance : balance;
  const collateralUsage = actualUsdc > 0 ? (totalMargin / actualUsdc) * 100 : 0;`,
        `const actualUsdc = realUsdcBalance + (balance + totalMargin);
  const collateralUsage = actualUsdc > 0 ? (totalMargin / actualUsdc) * 100 : 0;`
    );
    
    fs.writeFileSync('src/components/PortfolioSummary.tsx', code);
};

fixOrderForm();
fixPortfolioSummary();

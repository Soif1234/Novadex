const fs = require('fs');

let code = fs.readFileSync('src/components/OrderForm.tsx', 'utf-8');

code = code.replace(
`  const buyingPower = mode === 'swap' 
    ? realUsdtBalance 
    : Math.max(0, realUsdtBalance + balance);`,
`  const buyingPower = realUsdtBalance;`
);

fs.writeFileSync('src/components/OrderForm.tsx', code);

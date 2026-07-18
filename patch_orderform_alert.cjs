const fs = require('fs');
let code = fs.readFileSync('src/components/OrderForm.tsx', 'utf-8');

code = code.replace(
`    if (!isConnected) {
      alert("Please connect your wallet");
      return;
    }`,
`    if (!isConnected) {
      alert("Please log in or connect your wallet");
      return;
    }`
);

fs.writeFileSync('src/components/OrderForm.tsx', code);

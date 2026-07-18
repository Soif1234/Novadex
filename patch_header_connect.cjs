const fs = require('fs');

let code = fs.readFileSync('src/components/Header.tsx', 'utf-8');

code = code.replace(
`        <ConnectButton />`,
`        <ConnectButton chainStatus="full" showBalance={false} />`
);

fs.writeFileSync('src/components/Header.tsx', code);

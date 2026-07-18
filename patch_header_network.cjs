const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf-8');

code = code.replace(
`        <ConnectButton chainStatus="full" showBalance={false} />`,
`        <div className={user ? "hidden" : "block"}><ConnectButton chainStatus="full" showBalance={false} /></div>`
);

fs.writeFileSync('src/components/Header.tsx', code);

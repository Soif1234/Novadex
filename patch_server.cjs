const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace('const PORT = 3000;', 'const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;');

code = code.replace('process.env.NODE_ENV !== "production"', 'process.env.NODE_ENV !== "production" && !process.env.K_SERVICE');

fs.writeFileSync('server.ts', code);

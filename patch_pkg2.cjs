const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

pkg.scripts.build = "NODE_OPTIONS='--max-old-space-size=2048' vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs";

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));

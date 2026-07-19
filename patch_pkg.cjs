const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

for (const [key, value] of Object.entries(pkg.devDependencies || {})) {
  pkg.dependencies[key] = value;
}
pkg.devDependencies = {};

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));

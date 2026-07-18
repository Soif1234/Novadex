const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Add import
code = code.replace("import { PortfolioSummary } from './components/PortfolioSummary';",
"import { PortfolioSummary } from './components/PortfolioSummary';\nimport { TopCoinsList } from './components/TopCoinsList';");

// Add component to portfolio view
code = code.replace("<PositionsList />\n        </div>",
"<PositionsList />\n          <TopCoinsList />\n        </div>");

fs.writeFileSync('src/App.tsx', code);

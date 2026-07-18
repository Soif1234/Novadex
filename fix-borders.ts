import fs from 'fs';

// TradingChart
let tc = fs.readFileSync('src/components/TradingChart.tsx', 'utf8');
tc = tc.replace('border-r border-white/5', '');
fs.writeFileSync('src/components/TradingChart.tsx', tc);

// MultiChartGrid
let mc = fs.readFileSync('src/components/MultiChartGrid.tsx', 'utf8');
mc = mc.replace('border-r border-white/5', '');
fs.writeFileSync('src/components/MultiChartGrid.tsx', mc);


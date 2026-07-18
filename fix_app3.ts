import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Remove MobileBottomNav code
const mobileNavStart = content.indexOf('function MobileBottomNav() {');
const mobileNavEnd = content.indexOf('import { TradingProvider');

if (mobileNavStart !== -1 && mobileNavEnd !== -1) {
  content = content.substring(0, mobileNavStart) + "\n" + content.substring(mobileNavEnd);
}

// Remove from render
content = content.replace('<MobileBottomNav />\n      <Toasts />', '<Toasts />');
content = content.replace('<div className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0">', '<div className="flex-1 flex flex-col overflow-hidden">');

fs.writeFileSync('src/App.tsx', content);


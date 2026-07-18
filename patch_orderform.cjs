const fs = require('fs');
let code = fs.readFileSync('src/components/OrderForm.tsx', 'utf-8');

code = code.replace(
`<div className="flex justify-between text-xs">
                <span className="text-gray-400">Fees</span>
                <span className="text-white font-mono">{fees > 0 ? \`\$\${fees.toFixed(2)}\` : '-'}</span>
              </div>`,
`<div className="flex justify-between text-xs items-center">
                <span className="text-gray-400 flex items-center gap-1">Fees <span className="bg-blue-500/20 text-blue-400 text-[9px] px-1.5 py-0.5 rounded-full border border-blue-500/20">L2 Optimized</span></span>
                <span className="text-white font-mono">{fees > 0 ? \`\$\${fees.toFixed(4)}\` : '-'}</span>
              </div>`);

fs.writeFileSync('src/components/OrderForm.tsx', code);

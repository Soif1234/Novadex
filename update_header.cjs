const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf-8');

const target = `{user ? (
          <div className="flex items-center space-x-2">`;
const replacement = `{isConnected && !user && address && (
          <div className="flex items-center space-x-2">
             <div className="bg-white/10 text-white px-3 py-1.5 rounded-lg text-sm font-medium border border-white/5 flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-gray-400" />
                <span>user#{address.slice(2, 6)}</span>
             </div>
          </div>
        )}
        {user ? (
          <div className="flex items-center space-x-2">`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/Header.tsx', code);

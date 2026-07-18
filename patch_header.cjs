const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf-8');

code = code.replace(
`  const { user, wallet, logout } = useAuth();`,
`  const { user, wallet, logout, setEmailChainId } = useAuth();`
);

const userSection = 
`        {user ? (
          <div className="flex items-center space-x-2">`;

const replacement = 
`        {user ? (
          <div className="flex items-center space-x-2">
            {wallet && !isConnected && (
              <div className="relative group z-[60]">
                <button className="flex items-center space-x-1.5 bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border border-white/5">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span>{currentChain?.name || 'Network'}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#0F131A] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  {chains.map(c => (
                    <button 
                      key={c.id} 
                      onClick={() => setEmailChainId(c.id)}
                      className={\`flex items-center space-x-2 px-4 py-3 hover:bg-white/5 text-sm font-medium transition-colors w-full text-left \${chainId === c.id ? 'text-emerald-400 bg-white/5' : 'text-gray-300'}\`}
                    >
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}`;

code = code.replace(userSection, replacement);

fs.writeFileSync('src/components/Header.tsx', code);

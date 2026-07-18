import fs from 'fs';

let content = fs.readFileSync('src/components/Header.tsx', 'utf8');

// Add Menu and X to lucide-react imports
content = content.replace("import { UserIcon, Settings, LogOut, Bell, X, Trash2 } from 'lucide-react';", "import { UserIcon, Settings, LogOut, Bell, X, Trash2, Menu } from 'lucide-react';");

// Add state for mobile menu
content = content.replace('const [isSettingsOpen, setIsSettingsOpen] = useState(false);', 'const [isSettingsOpen, setIsSettingsOpen] = useState(false);\n  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);');

// Add mobile menu button
const newHeaderStart = `      <div className="flex items-center space-x-6">
        <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.4)]">
            <div className="w-2 h-2 rounded-full bg-[#0B0E14]"></div>
          </div>
          NovaDEX
        </div>
        <nav className="hidden md:flex items-center space-x-1 text-sm font-medium text-gray-400">`;

const menuButtonCode = `      <div className="flex items-center space-x-4">
        <button className="md:hidden p-2 text-gray-400 hover:text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.4)]">
            <div className="w-2 h-2 rounded-full bg-[#0B0E14]"></div>
          </div>
          NovaDEX
        </div>
        <nav className="hidden md:flex items-center space-x-1 text-sm font-medium text-gray-400">`;

content = content.replace(newHeaderStart, menuButtonCode);

// Add Mobile Menu rendering
const mobileMenuRender = `      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
      
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-[#0B0E14] border-b border-white/10 z-50 p-4 flex flex-col space-y-4 shadow-2xl">
          <button onClick={() => { navigate('/trade'); setIsMobileMenuOpen(false); }} className={\`text-left px-4 py-3 rounded-lg \${location.pathname === '/trade' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'}\`}>Trade</button>
          <button onClick={() => { navigate('/swap'); setIsMobileMenuOpen(false); }} className={\`text-left px-4 py-3 rounded-lg \${location.pathname === '/swap' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'}\`}>Swap</button>
          <button onClick={() => { navigate('/earn'); setIsMobileMenuOpen(false); }} className={\`text-left px-4 py-3 rounded-lg \${location.pathname === '/earn' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'}\`}>Earn</button>
          <button onClick={() => { navigate('/portfolio'); setIsMobileMenuOpen(false); }} className={\`text-left px-4 py-3 rounded-lg \${location.pathname === '/portfolio' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'}\`}>Portfolio</button>
          <button onClick={() => { navigate('/referrals'); setIsMobileMenuOpen(false); }} className={\`text-left px-4 py-3 rounded-lg flex items-center gap-2 \${location.pathname === '/referrals' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'}\`}>
            <UserIcon className="w-4 h-4 text-purple-400" />
            Referrals
          </button>
          <div className="h-px bg-white/10 my-2"></div>
          <button onClick={() => { setIsSettingsOpen(true); setIsMobileMenuOpen(false); }} className="text-left px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      )}
    </header>
  );
}`;

content = content.replace(`      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
    </header>
  );
}`, mobileMenuRender);

fs.writeFileSync('src/components/Header.tsx', content);


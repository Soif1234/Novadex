import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const bottomNav = `
function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { name: 'Trade', path: '/trade', icon: LineChart },
    { name: 'Swap', path: '/swap', icon: Repeat },
    { name: 'Earn', path: '/earn', icon: PiggyBank },
    { name: 'Portfolio', path: '/portfolio', icon: Briefcase },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-[68px] bg-[#0B0E14]/95 backdrop-blur-md border-t border-white/5 flex items-center justify-around z-50 pb-safe px-1">
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className={\`flex flex-col items-center justify-center w-full h-full space-y-1 \${isActive ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'}\`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.name}</span>
          </button>
        )
      })}
      
      <button
        onClick={() => document.getElementById('mobile-settings-btn')?.click()}
        className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-500 hover:text-gray-300"
      >
        <Settings className="w-5 h-5" />
        <span className="text-[10px] font-medium">Settings</span>
      </button>
    </div>
  );
}

`;

content = content.replace("function MainApp", bottomNav + "function MainApp");

const oldRender = `      <Header />
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderContent()}
      </div>
      <Toasts />
    </div>`;

const newRender = `      <Header />
      <div className="flex-1 flex flex-col overflow-hidden pb-[68px] md:pb-0">
        {renderContent()}
      </div>
      <MobileBottomNav />
      <Toasts />
    </div>`;

content = content.replace(oldRender, newRender);

fs.writeFileSync('src/App.tsx', content);


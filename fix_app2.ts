import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldNav = `    { name: 'Portfolio', path: '/portfolio', icon: Briefcase },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0B0E14] border-t border-white/5 flex items-center justify-around z-50 pb-safe">
      {navItems.map(item => {`;

const newNav = `    { name: 'Portfolio', path: '/portfolio', icon: Briefcase },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-[68px] bg-[#0B0E14]/95 backdrop-blur-md border-t border-white/5 flex items-center justify-around z-50 pb-safe px-1">
      {navItems.map(item => {`;

content = content.replace(oldNav, newNav);

const oldNavRender = `            <span className="text-[10px] font-medium">{item.name}</span>
          </button>
        )
      })}
    </div>`;

const newNavRender = `            <span className="text-[10px] font-medium">{item.name}</span>
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
    </div>`;

content = content.replace(oldNavRender, newNavRender);

// Also need to import Settings
if (!content.includes('Settings } from')) {
    content = content.replace('LineChart, Repeat, PiggyBank, Briefcase', 'LineChart, Repeat, PiggyBank, Briefcase, Settings');
}

fs.writeFileSync('src/App.tsx', content);


import { TradingProvider } from './TradingContext';
import { AuthProvider } from './AuthContext';
import { ThemeProvider, useTheme } from './ThemeContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { DocsPage } from './pages/DocsPage';
import { ReferralPage } from './pages/ReferralPage';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Header } from './components/Header';
import { MarketTicker } from './components/MarketTicker';
import { TradingChart } from './components/TradingChart';
import { OrderBook } from './components/OrderBook';
import { OrderForm } from './components/OrderForm';
import { PositionsList } from './components/PositionsList';
import { PortfolioSummary } from './components/PortfolioSummary';
import { TopCoinsList } from './components/TopCoinsList';
import { MultiChartGrid } from './components/MultiChartGrid';
import { PriceProvider, usePrice } from './PriceContext';
import { MarketProvider } from './MarketContext';
import { X, BellRing } from 'lucide-react';
import { useState } from 'react';

import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './wagmiConfig';
import { useNavigate, useLocation } from 'react-router-dom';
import { LineChart, Repeat, PiggyBank, Briefcase, Settings } from 'lucide-react';


const queryClient = new QueryClient();

function Toasts() {
  const { alerts, removeAlert } = usePrice();
  
  // Show only recently triggered alerts, let's say just the triggered ones that we haven't dismissed
  const triggeredAlerts = alerts.filter(a => a.isTriggered);

  if (triggeredAlerts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {triggeredAlerts.map(alert => (
        <div key={`toast-${alert.id}`} className="bg-[#0F131A] border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)] rounded-lg p-4 flex items-start gap-3 w-80 animate-in slide-in-from-right-8">
          <div className="bg-emerald-500/20 p-2 rounded-full shrink-0">
            <BellRing className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex-1">
            <h4 className="text-emerald-400 font-bold text-sm">Price Alert Triggered!</h4>
            <p className="text-xs text-gray-300 mt-1">
              BTC-USDT just crossed {alert.condition === 'above' ? 'above' : 'below'} <span className="font-mono text-white">${alert.targetPrice.toLocaleString()}</span>
            </p>
          </div>
          <button 
            onClick={() => removeAlert(alert.id)}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}




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
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
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

function MainApp({ view = 'trade' }: { view?: 'trade' | 'swap' | 'portfolio' | 'earn' | 'futures' }) {
  const [isMultiChart, setIsMultiChart] = useState(false);
  const [multiTickers] = useState(['BTC-USDT', 'ETH-USDT', 'SOL-USDT', 'ARB-USDT']);
  const { theme } = useTheme();

  const getBgClass = () => {
    if (theme === 'midnight') return 'bg-[#090514]';
    if (theme === 'cyberpunk') return 'bg-[#0a040b]';
    return 'bg-[#05070A]';
  };

  const getAccent1 = () => {
    if (theme === 'midnight') return 'bg-purple-500/10';
    if (theme === 'cyberpunk') return 'bg-pink-500/10';
    return 'bg-blue-500/10';
  };

  const getAccent2 = () => {
    if (theme === 'midnight') return 'bg-indigo-500/5';
    if (theme === 'cyberpunk') return 'bg-cyan-500/5';
    return 'bg-emerald-500/5';
  };

  const renderContent = () => {
    if (view === 'swap') {
      return (
        <div className="flex-1 flex justify-center items-center overflow-y-auto p-4 z-10">
          <div className="w-full max-w-md bg-[#0F131A] border border-white/10 rounded-2xl flex flex-col max-h-[80vh] overflow-hidden">
             <div className="p-4 border-b border-white/5 font-bold text-lg">Swap</div>
             <OrderForm forceMode="swap" />
          </div>
        </div>
      );
    }
    
    if (view === 'portfolio') {
      return (
        <div className="flex-1 flex flex-col overflow-y-auto p-4 z-10 space-y-6 max-w-7xl mx-auto w-full">
          <h2 className="text-2xl font-bold">Portfolio</h2>
          <PortfolioSummary />
          <PositionsList />
          <TopCoinsList />
        </div>
      );
    }
    
    if (view === 'earn') {
      return (
        <div className="flex-1 flex flex-col overflow-y-auto p-4 z-10 space-y-6 max-w-7xl mx-auto w-full items-center justify-center">
          <h2 className="text-2xl font-bold text-gray-400">Earn Features Coming Soon</h2>
        </div>
      );
    }

    // Default trade/futures view
    return (
      <div className="flex-1 flex flex-col overflow-y-auto lg:overflow-hidden z-10 bg-[#05070A]">
        <MarketTicker />
        
        {/* Desktop Layout - Professional Split */}
        <div className="hidden lg:flex flex-1 overflow-hidden">
          {/* Left Column: Chart (top) + Positions (bottom) */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 flex flex-col overflow-hidden relative">
              {isMultiChart ? (
                <MultiChartGrid tickers={multiTickers} onToggleSingle={() => setIsMultiChart(false)} />
              ) : (
                <TradingChart onToggleMultiChart={() => setIsMultiChart(true)} />
              )}
            </div>
            
            <div className="h-[320px] shrink-0 border-t border-white/5 flex flex-col overflow-hidden bg-[#0B0E14]">
               <PositionsList />
            </div>
          </div>
          
          {/* Right Column: OrderBook (Top) + OrderForm (Bottom) */}
          <div className="w-[340px] shrink-0 flex flex-col overflow-hidden border-l border-white/5 bg-[#0B0E14]">
            {/* OrderBook at Upper Right */}
            <div className="flex-1 flex flex-col overflow-hidden border-b border-white/5 min-h-[300px]">
               <OrderBook />
            </div>

            {/* OrderForm (Sell/Swap) at Lower Right */}
            <div className="h-[550px] shrink-0 flex flex-col overflow-hidden bg-[#0F131A] shadow-2xl relative z-20 border-t border-white/5">
               <OrderForm forceMode={view === 'futures' ? 'perp' : undefined} />
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex lg:hidden flex-col bg-[#05070A]">
          <div className="h-[450px] shrink-0 relative">
            {isMultiChart ? (
              <MultiChartGrid tickers={multiTickers} onToggleSingle={() => setIsMultiChart(false)} />
            ) : (
              <TradingChart onToggleMultiChart={() => setIsMultiChart(true)} />
            )}
          </div>
          
          {/* Buy/Sell (OrderForm) below chart */}
          <div className="border-t border-white/5 shadow-2xl z-20">
             <OrderForm forceMode={view === 'futures' ? 'perp' : undefined} />
          </div>

          {/* OrderBook */}
          <div className="h-[400px] border-t border-white/5">
             <OrderBook />
          </div>

          {/* Positions */}
          <div className="min-h-[400px] border-t border-white/5">
             <PositionsList />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`h-screen ${getBgClass()} text-white flex flex-col font-sans selection:bg-blue-500/30 overflow-hidden relative`}>
      <div className={`absolute top-0 left-1/4 w-[500px] h-[500px] ${getAccent1()} rounded-full blur-[120px] pointer-events-none`}></div>
      <div className={`absolute bottom-0 right-1/4 w-[600px] h-[600px] ${getAccent2()} rounded-full blur-[150px] pointer-events-none`}></div>
      
      <Header />
      <div className="flex-1 flex flex-col overflow-hidden pb-[68px] md:pb-0">
        {renderContent()}
      </div>
      <MobileBottomNav />
      <Toasts />
    </div>
  );
}



export default function App() {
  return (
    <ThemeProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={darkTheme({ accentColor: '#3b82f6', accentColorForeground: 'white' })}>
          <AuthProvider>
            <MarketProvider>
              <PriceProvider>
                <TradingProvider>
                  <BrowserRouter>
                    <Routes>
                      <Route path="/" element={<MainApp />} />
                      <Route path="/trade" element={<Navigate to="/" replace />} />
                      <Route path="/swap" element={<MainApp view="swap" />} />
                      <Route path="/portfolio" element={<MainApp view="portfolio" />} />
                      <Route path="/earn" element={<MainApp view="earn" />} />
                      <Route path="/docs" element={<DocsPage />} />
                      <Route path="/referrals" element={<ReferralPage />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </BrowserRouter>
                </TradingProvider>
              </PriceProvider>
            </MarketProvider>
          </AuthProvider>
        </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}

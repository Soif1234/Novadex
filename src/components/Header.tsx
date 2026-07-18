import { useState, useRef, useEffect } from 'react';
import { Wallet, Settings, Bell, Globe, X, Trash2, ChevronDown, User as UserIcon, LogOut } from 'lucide-react';
import { usePrice } from '../PriceContext';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { useAppChainId } from '../useAppChainId';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAuth } from '../AuthContext';
import { AuthModal } from './AuthModal';
import { SettingsModal } from './SettingsModal';
import { DepositWithdrawModal } from './DepositWithdrawModal';
import { useNavigate, useLocation } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { address, isConnected } = useAccount();
  const chainId = useAppChainId();
  const { switchChain, chains } = useSwitchChain();
  const { user, wallet, logout, setEmailChainId } = useAuth();
  
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const { alerts, removeAlert, clearTriggered } = usePrice();
  
  const alertsRef = useRef<HTMLDivElement>(null);
  const connectModalRef = useRef<HTMLDivElement>(null);
  const networkModalRef = useRef<HTMLDivElement>(null);
  
  const triggeredAlerts = alerts.filter(a => a.isTriggered);
  const hasTriggered = triggeredAlerts.length > 0;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (alertsRef.current && !alertsRef.current.contains(event.target as Node)) {
        setIsAlertsOpen(false);
      }
      if (connectModalRef.current && !connectModalRef.current.contains(event.target as Node)) {
        setIsConnectModalOpen(false);
      }
      if (networkModalRef.current && !networkModalRef.current.contains(event.target as Node)) {
        setIsNetworkModalOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentChain = chains.find(c => c.id === chainId);

  return (
    <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 bg-[#0B0E14] shrink-0">
      <div className="flex items-center space-x-6">
        <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.4)]">
            <div className="w-2 h-2 rounded-full bg-[#0B0E14]"></div>
          </div>
          NovaDEX
        </div>
        <nav className="hidden md:flex items-center space-x-1 text-sm font-medium text-gray-400">
          <button onClick={() => navigate('/trade')} className={`px-3 py-1.5 rounded-md transition-colors ${location.pathname === '/trade' ? 'text-white bg-white/5' : 'hover:text-white hover:bg-white/5'}`}>Trade</button>
          <button onClick={() => navigate('/swap')} className={`px-3 py-1.5 rounded-md transition-colors ${location.pathname === '/swap' ? 'text-white bg-white/5' : 'hover:text-white hover:bg-white/5'}`}>Swap</button>
          <button onClick={() => navigate('/earn')} className={`px-3 py-1.5 rounded-md transition-colors ${location.pathname === '/earn' ? 'text-white bg-white/5' : 'hover:text-white hover:bg-white/5'}`}>Earn</button>
          <button onClick={() => navigate('/portfolio')} className={`px-3 py-1.5 rounded-md transition-colors ${location.pathname === '/portfolio' ? 'text-white bg-white/5' : 'hover:text-white hover:bg-white/5'}`}>Portfolio</button>
          <button onClick={() => navigate('/referrals')} className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1 ${location.pathname === '/referrals' ? 'text-white bg-white/5' : 'hover:text-white hover:bg-white/5'}`}>
            <UserIcon className="w-4 h-4 text-purple-400" />
            Referrals
          </button>
        </nav>
      </div>
            <div className="flex items-center space-x-3">
        <div className="relative" ref={alertsRef}>
          <button 
            onClick={() => setIsAlertsOpen(!isAlertsOpen)}
            className={`p-2 rounded-lg transition-colors relative ${isAlertsOpen ? 'bg-white/10 text-white' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}
          >
            <Bell className="w-5 h-5" />
            {hasTriggered && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            )}
          </button>
          
          {isAlertsOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-[#0F131A] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[400px]">
              <div className="p-3 border-b border-white/5 flex justify-between items-center">
                <span className="text-sm font-medium text-white">Price Alerts</span>
                {triggeredAlerts.length > 0 && (
                  <button onClick={clearTriggered} className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Clear Triggered
                  </button>
                )}
              </div>
              <div className="overflow-y-auto p-2 flex flex-col gap-1">
                {alerts.length === 0 ? (
                  <div className="p-4 text-center text-xs text-gray-500">No active alerts</div>
                ) : (
                  alerts.map(alert => (
                    <div key={alert.id} className={`p-3 rounded-lg border ${alert.isTriggered ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-transparent'} relative group flex flex-col gap-1`}>
                      <div className="flex justify-between items-start">
                        <span className={`text-xs font-bold ${alert.isTriggered ? 'text-emerald-400' : 'text-gray-300'}`}>{alert.symbol}</span>
                        <button 
                          onClick={() => removeAlert(alert.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-400 p-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-gray-400">
                        <span>{alert.condition === 'above' ? 'Crosses above' : 'Crosses below'}</span>
                        <span className="font-mono text-white text-xs">${alert.targetPrice.toLocaleString()}</span>
                      </div>
                      {alert.isTriggered && (
                        <div className="text-[10px] text-emerald-400 mt-1 font-medium bg-emerald-400/10 inline-block px-2 py-0.5 rounded-full w-fit">
                          Triggered
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button 
          id="mobile-settings-btn" onClick={() => setIsSettingsOpen(true)}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>

        <div className="h-6 w-px bg-white/10 mx-1"></div>

        {isConnected && !user && address && (
          <div className="flex items-center space-x-2">
             <div className="bg-white/10 text-white px-3 py-1.5 rounded-lg text-sm font-medium border border-white/5 flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-gray-400" />
                <span>user#{address.slice(2, 6)}</span>
             </div>
          </div>
        )}
        {user ? (
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
                      className={`flex items-center space-x-2 px-4 py-3 hover:bg-white/5 text-sm font-medium transition-colors w-full text-left ${chainId === c.id ? 'text-emerald-400 bg-white/5' : 'text-gray-300'}`}
                    >
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button 
              onClick={() => setIsWalletModalOpen(true)}
              className="flex items-center space-x-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border border-emerald-500/20"
            >
              <Wallet className="w-4 h-4" />
              <span>Wallet</span>
            </button>
            <div className="relative group">
              <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border border-white/5">
                <UserIcon className="w-4 h-4 text-gray-400" />
                <span>{user.email?.split('@')[0]}</span>
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#0F131A] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <button 
                  onClick={() => setIsWalletModalOpen(true)}
                  className="flex items-center space-x-2 px-4 py-3 hover:bg-white/5 text-sm font-medium text-gray-300 transition-colors w-full text-left border-b border-white/5"
                >
                  <Wallet className="w-4 h-4" />
                  <span>Wallet</span>
                </button>
                <button 
                  onClick={logout}
                  className="flex items-center space-x-2 px-4 py-3 hover:bg-white/5 text-sm font-medium text-red-400 transition-colors w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <UserIcon className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        )}

        <ConnectButton />
      </div>

      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
      
      
    <DepositWithdrawModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} initialMode="deposit" /></header>
  );
}

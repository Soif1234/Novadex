import React, { useState } from 'react';
import { X, User, Bell, Shield, Key, Moon, Sun, Monitor, Zap, Hexagon } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';

interface SettingsModalProps {
  onClose: () => void;
}

function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <button 
        onClick={() => setTheme('dark')}
        className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl gap-3 transition-colors ${theme === 'dark' ? 'border-blue-500 bg-blue-500/10' : 'border-transparent bg-white/5 hover:bg-white/10'}`}
      >
        <Moon className={`w-8 h-8 ${theme === 'dark' ? 'text-blue-400' : 'text-gray-400'}`} />
        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-400'}`}>Standard Dark</span>
      </button>
      
      <button 
        onClick={() => setTheme('midnight')}
        className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl gap-3 transition-colors ${theme === 'midnight' ? 'border-purple-500 bg-purple-500/10' : 'border-transparent bg-white/5 hover:bg-white/10'}`}
      >
        <Hexagon className={`w-8 h-8 ${theme === 'midnight' ? 'text-purple-400' : 'text-gray-400'}`} />
        <span className={`text-sm font-medium ${theme === 'midnight' ? 'text-white' : 'text-gray-400'}`}>Midnight Purple</span>
      </button>

      <button 
        onClick={() => setTheme('cyberpunk')}
        className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl gap-3 transition-colors ${theme === 'cyberpunk' ? 'border-pink-500 bg-pink-500/10' : 'border-transparent bg-white/5 hover:bg-white/10'}`}
      >
        <Zap className={`w-8 h-8 ${theme === 'cyberpunk' ? 'text-pink-400' : 'text-gray-400'}`} />
        <span className={`text-sm font-medium ${theme === 'cyberpunk' ? 'text-white' : 'text-gray-400'}`}>Cyberpunk</span>
      </button>
    </div>
  );
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const { userData, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'notifications'>('profile');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#0B0E14] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/5 shrink-0">
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 border-r border-white/5 bg-[#0F131A] p-4 flex flex-col gap-2 shrink-0">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-blue-500/10 text-blue-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <User className="w-4 h-4" />
              Profile
            </button>
            <button 
              onClick={() => setActiveTab('appearance')}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'appearance' ? 'bg-blue-500/10 text-blue-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <Monitor className="w-4 h-4" />
              Appearance
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'notifications' ? 'bg-blue-500/10 text-blue-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <Bell className="w-4 h-4" />
              Notifications
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto no-scrollbar">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">Profile Details</h3>
                  <p className="text-sm text-gray-400">View your account information and preferences.</p>
                </div>
                
                {userData ? (
                  <div className="space-y-4">
                    <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-500 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                        {userData.username ? userData.username.charAt(0).toUpperCase() : userData.email?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xl font-bold text-white flex items-center gap-2">
                          {userData.username ? userData.username.split('#')[0] : 'User'}
                          <span className="text-sm font-normal text-gray-500">#{userData.usernameId || '0000'}</span>
                        </div>
                        <div className="text-sm text-gray-400">{userData.email}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-[#0B0E14] border border-white/5 p-4 rounded-xl">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Generated Wallet Address</label>
                        <div className="font-mono text-sm text-gray-300 break-all">{userData.address}</div>
                      </div>
                      
                      <button onClick={logout} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-sm font-medium transition-colors">
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500 border border-white/5 rounded-xl bg-white/5">
                    Please sign in to view your profile.
                  </div>
                )}
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">Appearance</h3>
                  <p className="text-sm text-gray-400">Customize the UI theme.</p>
                </div>
                
                <ThemeSelector />
                
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">Notifications</h3>
                  <p className="text-sm text-gray-400">Manage price alerts and updates.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-white">Price Alerts</span>
                      <span className="text-xs text-gray-400">Receive alerts when price targets are hit.</span>
                    </div>
                    <div className="w-10 h-6 bg-blue-500 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-white">Order Execution</span>
                      <span className="text-xs text-gray-400">Notify when orders are filled.</span>
                    </div>
                    <div className="w-10 h-6 bg-blue-500 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

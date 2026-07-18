import React from 'react';
import { ArrowLeft, BookOpen, Activity, Zap, Shield, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function DocsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#05070A] text-white font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12 md:py-6 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">NovaDex Documentation</span>
          </div>
        </div>
        <button 
          onClick={() => navigate('/trade')}
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
        >
          Launch App
        </button>
      </nav>

      <div className="flex max-w-7xl mx-auto px-6 py-12 gap-12">
        {/* Sidebar */}
        <div className="hidden md:block w-64 shrink-0">
          <div className="sticky top-24 space-y-8">
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Getting Started</h4>
              <ul className="space-y-2">
                <li><a href="#introduction" className="text-sm text-blue-400 font-medium block py-1">Introduction</a></li>
                <li><a href="#quickstart" className="text-sm text-gray-400 hover:text-white transition-colors block py-1">Quickstart</a></li>
                <li><a href="#wallets" className="text-sm text-gray-400 hover:text-white transition-colors block py-1">Supported Wallets</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Core Concepts</h4>
              <ul className="space-y-2">
                <li><a href="#perpetuals" className="text-sm text-gray-400 hover:text-white transition-colors block py-1">Perpetual Futures</a></li>
                <li><a href="#margin" className="text-sm text-gray-400 hover:text-white transition-colors block py-1">Margin & Leverage</a></li>
                <li><a href="#liquidations" className="text-sm text-gray-400 hover:text-white transition-colors block py-1">Liquidations</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 max-w-3xl">
          <section id="introduction" className="mb-16">
            <h1 className="text-4xl font-bold mb-6">Introduction to NovaDex</h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              NovaDex is a next-generation decentralized exchange (DEX) built for professional and retail traders alike. 
              Our platform offers high-performance perpetual futures trading with up to 100x leverage, seamless cross-chain swaps, and deep liquidity across major assets.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              By combining the security of self-custody with the performance of centralized exchanges, NovaDex aims to become the premier destination for DeFi trading.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="p-6 bg-[#0B0E14] border border-white/5 rounded-xl">
                <Activity className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="text-lg font-bold mb-2">High Performance</h3>
                <p className="text-sm text-gray-400">Optimized matching engine ensuring sub-second execution times with minimal slippage.</p>
              </div>
              <div className="p-6 bg-[#0B0E14] border border-white/5 rounded-xl">
                <Shield className="w-8 h-8 text-emerald-400 mb-4" />
                <h3 className="text-lg font-bold mb-2">Non-Custodial</h3>
                <p className="text-sm text-gray-400">Trade directly from your Web3 wallet. You retain full control of your assets at all times.</p>
              </div>
            </div>
          </section>

          <section id="quickstart" className="mb-16 pt-8 border-t border-white/10">
            <h2 className="text-3xl font-bold mb-6">Quickstart</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold shrink-0">1</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Connect Your Wallet</h3>
                  <p className="text-gray-400">Click "Launch App" and connect a supported Web3 wallet (MetaMask, WalletConnect, Coinbase Wallet).</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold shrink-0">2</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Deposit Collateral</h3>
                  <p className="text-gray-400">Deposit USDT or USDC as collateral to begin trading perpetual futures.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold shrink-0">3</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Open a Position</h3>
                  <p className="text-gray-400">Select your market, choose your leverage (up to 100x), and place a market or limit order.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

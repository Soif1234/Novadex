import React from 'react';
import { ArrowRight, Activity, Zap, Shield, Globe, Mail, MessageCircle, Twitter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#05070A] text-white font-sans overflow-x-hidden selection:bg-blue-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-emerald-500/10 rounded-full blur-[150px]"></div>
        <div className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] bg-purple-500/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12 md:py-6 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">NovaDex</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Features</a>
          <a href="#ecosystem" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Ecosystem</a>
          <a href="#community" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Community</a>
        </div>
        <button 
          onClick={() => navigate('/trade')}
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
        >
          Launch App
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-32 px-6 md:px-12 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          NovaDex V2 is Live
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter max-w-4xl leading-tight mb-6">
          The Next Generation <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-400">
            Decentralized Exchange
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
          Experience lightning-fast swaps, perpetual futures trading with up to 100x leverage, and deep liquidity across multiple chains. Welcome to the future of DeFi.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button 
            onClick={() => navigate('/trade')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-xl text-lg font-bold transition-all hover:bg-gray-200 hover:scale-105"
          >
            Start Trading <ArrowRight className="w-5 h-5" />
          </button>
          <button 
            onClick={() => navigate('/docs')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all hover:bg-white/10"
          >
            View Docs
          </button>
        </div>

        {/* Stats Preview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-24 w-full max-w-5xl border-t border-white/10 pt-12">
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-mono font-bold text-white mb-2">$1.2B+</span>
            <span className="text-sm text-gray-500">Total Trading Volume</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-mono font-bold text-white mb-2">50+</span>
            <span className="text-sm text-gray-500">Markets Available</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-mono font-bold text-white mb-2">12ms</span>
            <span className="text-sm text-gray-500">Execution Time</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-mono font-bold text-white mb-2">100k+</span>
            <span className="text-sm text-gray-500">Active Traders</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-24 px-6 md:px-12 bg-[#080B10]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Unrivaled Trading Experience</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">NovaDex is a modern, cross-chain decentralized perpetual exchange designed for the future of DeFi. Built to empower traders with deep liquidity and seamless execution.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#0B0E14] border border-white/5 p-8 rounded-2xl hover:border-blue-500/30 transition-colors group">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Perpetual Futures</h3>
              <p className="text-gray-400 leading-relaxed">Trade crypto perps with up to 100x leverage. Enjoy deep liquidity and tight spreads on over 50+ pairs.</p>
            </div>
            
            <div className="bg-[#0B0E14] border border-white/5 p-8 rounded-2xl hover:border-emerald-500/30 transition-colors group">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Instant Swaps</h3>
              <p className="text-gray-400 leading-relaxed">Swap tokens instantly with zero price impact. Our smart router finds the best rates across multiple DEXs.</p>
            </div>
            
            <div className="bg-[#0B0E14] border border-white/5 p-8 rounded-2xl hover:border-purple-500/30 transition-colors group">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Self-Custody</h3>
              <p className="text-gray-400 leading-relaxed">Your keys, your coins. Trade directly from your wallet with zero counterparty risk and full transparency.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Project Description Section */}
      <section id="ecosystem" className="relative z-10 py-24 px-6 md:px-12 bg-[#05070A] border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-2">
              <Globe className="w-3 h-3" />
              Cross-Chain Liquidity
            </div>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              One Exchange, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
                Infinite Possibilities
              </span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              NovaDEX is on a mission to democratize access to sophisticated trading tools by providing a secure, non-custodial environment where anyone can trade with confidence. By aggregating liquidity across Arbitrum, Base, Binance Smart Chain, and Ethereum mainnet, we ensure our users always receive the most optimal execution.
            </p>
            <ul className="space-y-4 text-gray-300 mt-8">
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                </div>
                <span>Trade spot or perpetual futures up to 100x</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                </div>
                <span>Zero slippage on highly liquid pairs</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                </div>
                <span>100% decentralized and verifiable</span>
              </li>
            </ul>
          </div>
          <div className="flex-1 relative w-full aspect-square md:aspect-auto md:h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-emerald-500/10 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm flex items-center justify-center">
               <div className="grid grid-cols-2 gap-4 p-8 w-full h-full opacity-80">
                 <div className="bg-white/5 rounded-xl flex items-center justify-center border border-white/5 shadow-2xl transform hover:-translate-y-2 transition-transform">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-1">Arbitrum</div>
                      <div className="text-sm text-gray-400">Sub-cent fees</div>
                    </div>
                 </div>
                 <div className="bg-white/5 rounded-xl flex items-center justify-center border border-white/5 shadow-2xl transform translate-y-8 hover:translate-y-6 transition-transform">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-1">Base</div>
                      <div className="text-sm text-gray-400">Seamless UX</div>
                    </div>
                 </div>
                 <div className="bg-white/5 rounded-xl flex items-center justify-center border border-white/5 shadow-2xl transform -translate-y-8 hover:-translate-y-10 transition-transform">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-1">BSC</div>
                      <div className="text-sm text-gray-400">High Volume</div>
                    </div>
                 </div>
                 <div className="bg-white/5 rounded-xl flex items-center justify-center border border-white/5 shadow-2xl transform hover:-translate-y-2 transition-transform">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-1">Ethereum</div>
                      <div className="text-sm text-gray-400">Max Security</div>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support & Community Section */}
      <section id="community" className="relative z-10 py-24 px-6 md:px-12 bg-[#05070A] border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Need Help or Support?</h2>
          <p className="text-gray-400 mb-12 text-lg">
            Our dedicated support team is available around the clock to assist you with any questions, technical issues, or feedback about the NovaDex platform. Connect with us through any of the channels below.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a href="mailto:soifmollick5@gmail.com" className="flex flex-col items-center p-8 bg-[#0B0E14] border border-white/5 rounded-2xl hover:border-blue-500/30 transition-colors group">
              <div className="w-14 h-14 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Email Support</h3>
              <p className="text-gray-500 text-sm mb-4">soifmollick5@gmail.com</p>
              <span className="text-blue-400 text-sm font-medium">Send an email</span>
            </a>
            
            <a href="https://t.me/Saifmallick5" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-8 bg-[#0B0E14] border border-white/5 rounded-2xl hover:border-blue-500/30 transition-colors group">
              <div className="w-14 h-14 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Telegram</h3>
              <p className="text-gray-500 text-sm mb-4">@Saifmallick5</p>
              <span className="text-blue-400 text-sm font-medium">Message us</span>
            </a>
            
            <a href="https://twitter.com/mollicksoif9" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-8 bg-[#0B0E14] border border-white/5 rounded-2xl hover:border-blue-500/30 transition-colors group">
              <div className="w-14 h-14 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Twitter className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Twitter / X</h3>
              <p className="text-gray-500 text-sm mb-4">@mollicksoif9</p>
              <span className="text-blue-400 text-sm font-medium">Follow us</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12 px-6 md:px-12 bg-[#05070A]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-tr from-blue-500 to-emerald-500 rounded flex items-center justify-center">
              <Activity className="w-3 h-3 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">NovaDex</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="https://twitter.com/mollicksoif9" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter</a>
            <a href="https://t.me/Saifmallick5" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Telegram</a>
            <a href="mailto:soifmollick5@gmail.com" className="hover:text-white transition-colors">Email Support</a>
            <button onClick={() => navigate('/docs')} className="hover:text-white transition-colors cursor-pointer text-left">Docs</button>
          </div>
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} NovaDex. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

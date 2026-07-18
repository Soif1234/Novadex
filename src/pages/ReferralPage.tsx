import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Copy, Gift, TrendingUp, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../AuthContext';

export function ReferralPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [referralLink, setReferralLink] = useState('');

  useEffect(() => {
    // Generate a pseudo-random referral link based on user or wallet
    const uniqueCode = user?.uid?.substring(0, 8) || Math.random().toString(36).substring(2, 10);
    setReferralLink(`${window.location.origin}/?ref=${uniqueCode}`);
  }, [user]);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-white font-sans overflow-x-hidden selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12 md:py-6 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Referrals</span>
          </div>
        </div>
        <button 
          onClick={() => navigate('/trade')}
          className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
        >
          Trade Now
        </button>
      </nav>

      {/* Hero / Overview */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Invite Friends & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Earn Crypto</span></h1>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-2xl">
              Share your unique referral link to invite friends to NovaDEX. Earn up to 30% of their trading fees for a lifetime. Your friends also get a 5% fee discount.
            </p>
            
            <div className="bg-[#0B0E14] border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Your Referral Link</h3>
              <div className="flex items-center gap-3 bg-black/40 border border-white/5 p-2 rounded-xl">
                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
                  <LinkIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  value={referralLink}
                  readOnly
                  className="bg-transparent border-none text-white w-full focus:outline-none font-mono text-sm"
                />
                <button 
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all shrink-0 ${
                    copied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-purple-600 hover:bg-purple-500 text-white'
                  }`}
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copy Link
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-[400px] shrink-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-[50px]"></div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Your Earnings
            </h3>
            
            <div className="space-y-6 relative z-10">
              <div>
                <div className="text-sm text-gray-400 mb-1">Total Earned</div>
                <div className="text-4xl font-mono font-bold text-white">$0.00 <span className="text-lg text-purple-400">USDT</span></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Total Referrals</div>
                  <div className="text-2xl font-bold text-white">0</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Active Traders</div>
                  <div className="text-2xl font-bold text-white">0</div>
                </div>
              </div>
              
              <button className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium transition-colors mt-2">
                Claim Rewards
              </button>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-24">
          <h2 className="text-2xl font-bold mb-8">How it Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0B0E14] border border-white/5 p-6 rounded-2xl">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                <LinkIcon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">1. Get your link</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Copy your unique referral link or share it directly with your network via social media.</p>
            </div>
            
            <div className="bg-[#0B0E14] border border-white/5 p-6 rounded-2xl">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">2. Invite friends</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Friends sign up using your link and receive a permanent 5% discount on all trading fees.</p>
            </div>
            
            <div className="bg-[#0B0E14] border border-white/5 p-6 rounded-2xl">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
                <Gift className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">3. Earn crypto</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Earn up to 30% commission on every trade your friends make, paid out daily in USDT.</p>
            </div>
          </div>
        </div>
        
        {/* Tier System */}
        <div className="mt-24 mb-12">
          <h2 className="text-2xl font-bold mb-8">Referral Tiers</h2>
          <div className="bg-[#0B0E14] border border-white/5 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-sm font-medium text-gray-400">
                  <th className="py-4 px-6 border-b border-white/5">Tier</th>
                  <th className="py-4 px-6 border-b border-white/5">Requirement</th>
                  <th className="py-4 px-6 border-b border-white/5">Your Commission</th>
                  <th className="py-4 px-6 border-b border-white/5">Friend's Discount</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="py-4 px-6 font-bold text-white">Tier 1 (Silver)</td>
                  <td className="py-4 px-6 text-gray-400">0 - 5 Referrals</td>
                  <td className="py-4 px-6 font-mono text-emerald-400">10%</td>
                  <td className="py-4 px-6 font-mono text-blue-400">5%</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="py-4 px-6 font-bold text-white flex items-center gap-2">Tier 2 (Gold) <span className="bg-yellow-500/20 text-yellow-500 text-[10px] px-2 py-0.5 rounded uppercase font-bold">Popular</span></td>
                  <td className="py-4 px-6 text-gray-400">6 - 20 Referrals</td>
                  <td className="py-4 px-6 font-mono text-emerald-400">20%</td>
                  <td className="py-4 px-6 font-mono text-blue-400">5%</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-4 px-6 font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Tier 3 (Diamond)</td>
                  <td className="py-4 px-6 text-gray-400">21+ Referrals</td>
                  <td className="py-4 px-6 font-mono text-emerald-400">30%</td>
                  <td className="py-4 px-6 font-mono text-blue-400">5%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

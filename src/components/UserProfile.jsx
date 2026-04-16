import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Wallet, History, Settings, LogOut, ChevronRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('pickcric_token');
        
        const response = await fetch('https://pickcric.onrender.com/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}` 
          }
        });
        
        const result = await response.json();
        if (result.success) {
          setProfile(result.data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('pickcric_token');
    localStorage.removeItem('pickcric_user');
    window.location.href = '/auth'; 
  };

  if (isLoading) {
    return (
        <div className="min-h-screen bg-navy-900 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-neon-green border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-neon-green font-bold animate-pulse tracking-widest uppercase text-sm">Loading Profile...</div>
        </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-navy-900 pb-24 md:pb-12 relative overflow-x-hidden">
        
        {/* Responsive Ambient Background Effects */}
        <div className="absolute top-[-10%] right-[-10%] w-[80%] md:w-[40%] h-[400px] md:h-[600px] bg-blue-600/10 rounded-full blur-[100px] md:blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[400px] bg-neon-green/5 rounded-full blur-[100px] md:blur-[120px] pointer-events-none" />
        
        {/* Main Dashboard Container - Expanded for Desktop, Clears Top Nav */}
        <div className="max-w-6xl mx-auto pt-12 md:pt-32 px-4 sm:px-6 md:px-8 relative z-10">
            
            <h1 className="font-display font-black text-3xl md:text-5xl text-white tracking-tight mb-8 md:mb-10 pl-2">
                My Profile
            </h1>

            {/* CSS Grid: 1 column on mobile, 12 columns on desktop (4/8 split) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

                {/* LEFT COLUMN (Desktop: Profile & Settings) */}
                <div className="lg:col-span-4 flex flex-col gap-6 order-1">
                    
                    {/* Profile Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-800/40 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-xl w-full"
                    >
                        <div className="flex items-center gap-5 md:flex-col md:text-center lg:flex-row lg:text-left">
                            <div className="w-20 h-20 md:w-28 md:h-28 lg:w-20 lg:h-20 shrink-0 rounded-full bg-gradient-to-br from-neon-green to-blue-500 p-1 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                                <div className="w-full h-full bg-navy-900 rounded-full flex items-center justify-center border-2 border-navy-900 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-blue-500/10"></div>
                                    <span className="text-3xl md:text-4xl lg:text-2xl font-black text-white uppercase relative z-10">
                                        {profile?.username?.charAt(0) || 'U'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="font-display font-bold text-2xl md:text-3xl lg:text-2xl text-white truncate">
                                    {profile?.username || 'Player'}
                                </h2>
                                <p className="text-slate-400 text-sm md:text-base lg:text-sm font-medium truncate">
                                    {profile?.email}
                                </p>
                                <div className="mt-3 inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 md:px-4 py-1.5 rounded-full">
                                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-neon-green animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                                    <span className="text-xs md:text-sm font-bold text-slate-300 tracking-wider">ONLINE</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Desktop Only Menu Options (Keeps Left column full) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="hidden lg:flex flex-col gap-3"
                    >
                        <button className="w-full bg-slate-800/40 hover:bg-slate-800/60 border border-white/5 hover:border-white/10 rounded-2xl p-4 flex items-center justify-between transition-all duration-300 group shadow-lg">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-500/10 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:scale-110 transition-all">
                                    <Settings className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-slate-200 group-hover:text-white transition-colors">Settings</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-neon-green group-hover:translate-x-1 transition-all" />
                        </button>

                        <button 
                            onClick={handleLogout}
                            className="w-full mt-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 rounded-2xl p-4 flex items-center justify-between transition-all duration-300 group shadow-lg"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 group-hover:scale-110 transition-all">
                                    <LogOut className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-red-400">Log Out</span>
                            </div>
                        </button>
                    </motion.div>

                </div>

                {/* RIGHT COLUMN (Desktop: Wallet & Contests) */}
                <div className="lg:col-span-8 flex flex-col gap-6 order-2">
                    
                    {/* Wallet Card - Expands beautifully on desktop */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-slate-800 to-navy-900 border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden group"
                    >
                        {/* Decorative Wallet Icon */}
                        <div className="absolute -right-6 -top-6 text-white/5 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12 pointer-events-none">
                            <Wallet className="w-32 h-32 md:w-56 md:h-56" />
                        </div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <Wallet className="w-4 h-4 md:w-5 md:h-5 text-slate-400" />
                                <p className="text-xs md:text-sm text-slate-400 font-bold uppercase tracking-widest">Total Balance</p>
                            </div>
                            
                            <h3 className="font-display font-black text-5xl md:text-6xl lg:text-7xl text-neon-green tracking-tighter filter drop-shadow-[0_0_15px_rgba(34,197,94,0.3)] mb-8">
                                ₹{profile?.walletBalance?.toFixed(2) || '0.00'}
                            </h3>
                            
                            <div className="flex flex-col sm:flex-row gap-3 md:gap-5 w-full lg:w-2/3">
                                <button className="flex-1 bg-neon-green hover:bg-green-400 text-navy-900 font-black py-3.5 md:py-4 rounded-xl md:rounded-2xl uppercase tracking-widest text-sm md:text-base shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] active:scale-95 transition-all duration-300">
                                    Add Cash
                                </button>
                                <button className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/20 font-bold py-3.5 md:py-4 rounded-xl md:rounded-2xl uppercase tracking-widest text-sm md:text-base active:scale-95 transition-all duration-300">
                                    Withdraw
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* My Contests Banner - Full width of right column */}
                    <motion.button 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="w-full bg-gradient-to-r from-blue-900/40 to-slate-800/40 hover:from-blue-900/60 hover:to-slate-800/60 border border-blue-500/20 rounded-3xl p-6 md:p-8 flex items-center justify-between transition-all duration-300 group shadow-xl"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-navy-900 transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                                <History className="w-7 h-7 md:w-8 md:h-8" />
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="font-display font-black text-xl md:text-2xl text-white tracking-tight group-hover:text-blue-400 transition-colors">My Contests</span>
                                <span className="text-xs md:text-sm text-slate-400 font-medium mt-1">View your active & past jackpots</span>
                            </div>
                        </div>
                        <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-2 transition-all duration-300" />
                    </motion.button>

                    {/* Mobile Only: Settings & Logout (Hides on desktop because it's in the left column) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex lg:hidden flex-col gap-3 mt-2"
                    >
                        <button className="w-full bg-slate-800/40 hover:bg-slate-800/60 border border-white/5 rounded-2xl p-4 flex items-center justify-between transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-500/10 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                                    <Settings className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-slate-200">Settings</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-500" />
                        </button>

                        <button 
                            onClick={handleLogout}
                            className="w-full mt-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-2xl p-4 flex items-center justify-between transition-colors group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
                                    <LogOut className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-red-400">Log Out</span>
                            </div>
                        </button>
                    </motion.div>

                </div>
            </div>
        </div>
    </div>
  );
};

export default UserProfile;
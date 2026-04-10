import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Wallet, History, Settings, LogOut, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('pickcric_token');
        
        const response = await fetch('https://pickcric.onrender.com/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}` // Send the token to the middleware!
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
    // 1. Clear Local Storage
    localStorage.removeItem('pickcric_token');
    localStorage.removeItem('pickcric_user');
    
    // 2. Redirect to Auth (This forces the ProtectedRoute to kick in)
    window.location.href = '/auth'; 
  };

  if (isLoading) {
    return <div className="min-h-screen bg-navy-900 flex items-center justify-center text-neon-green font-bold animate-pulse">Loading Profile...</div>;
  }

  return (
    <div className="w-full min-h-screen bg-navy-900 pb-24 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-md mx-auto pt-12 px-6 relative z-10">
            <h1 className="font-display font-black text-3xl text-white tracking-tight mb-8">My Profile</h1>

            {/* Profile Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800/40 border border-white/10 rounded-3xl p-6 backdrop-blur-xl mb-6 shadow-xl"
            >
                <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-green to-blue-500 p-1 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                        <div className="w-full h-full bg-navy-900 rounded-full flex items-center justify-center border-2 border-navy-900">
                            <span className="text-2xl font-black text-white uppercase">{profile?.username?.charAt(0) || 'U'}</span>
                        </div>
                    </div>
                    <div>
                        <h2 className="font-display font-bold text-2xl text-white">{profile?.username || 'Player'}</h2>
                        <p className="text-slate-400 text-sm font-medium">{profile?.email}</p>
                        <div className="mt-2 inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                            <span className="text-xs font-bold text-slate-300 tracking-wider">ONLINE</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Wallet Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-slate-800 to-navy-900 border border-white/10 rounded-3xl p-6 mb-8 shadow-xl relative overflow-hidden"
            >
                <div className="absolute -right-6 -top-6 text-white/5">
                    <Wallet className="w-32 h-32" />
                </div>
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mb-1">Total Balance</p>
                <h3 className="font-display font-black text-4xl text-neon-green tracking-tighter filter drop-shadow-[0_0_10px_rgba(34,197,94,0.4)]">
                    ₹{profile?.walletBalance?.toFixed(2) || '0.00'}
                </h3>
                <div className="flex gap-3 mt-5">
                    <button className="flex-1 bg-neon-green text-navy-900 font-bold py-2.5 rounded-xl uppercase tracking-wider text-sm shadow-[0_0_15px_rgba(34,197,94,0.3)] active:scale-95 transition-transform">Add Cash</button>
                    <button className="flex-1 bg-white/10 text-white border border-white/20 font-bold py-2.5 rounded-xl uppercase tracking-wider text-sm active:scale-95 transition-transform hover:bg-white/20">Withdraw</button>
                </div>
            </motion.div>

            {/* Menu Options */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col gap-3"
            >
                <button className="w-full bg-slate-800/40 hover:bg-slate-800/60 border border-white/5 rounded-2xl p-4 flex items-center justify-between transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                            <History className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-slate-200">My Contests</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-500" />
                </button>

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
                    className="w-full mt-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-2xl p-4 flex items-center justify-between transition-colors group"
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
  );
};

export default UserProfile;
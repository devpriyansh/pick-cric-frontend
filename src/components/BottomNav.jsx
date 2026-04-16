import React from 'react';
import { Home, Trophy, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide the nav on the Auth screen, Player Selection screen, or Success screen
  if (location.pathname === '/auth' || location.pathname.includes('/select-players') || location.pathname === '/success') {
      return null;
  }

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaders' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  return (
    // 1. Position: Bottom on mobile, Top on desktop (`md:top-0 md:bottom-auto`)
    // 2. Borders: Top border on mobile, Bottom border on desktop (`md:border-t-0 md:border-b`)
    <div className="fixed z-50 left-0 right-0 bottom-0 md:bottom-auto md:top-0 bg-navy-900/95 backdrop-blur-md border-t md:border-t-0 md:border-b border-white/10 pb-safe md:pb-0">
      
      <div className="max-w-7xl mx-auto px-6 flex justify-around md:justify-between items-center h-16 md:h-20">
        
        {/* DESKTOP ONLY: Logo on the left */}
        <div 
            className="hidden md:flex items-center cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={() => navigate('/')}
        >
            <h1 className="font-display font-black text-2xl tracking-tight text-white">
                Pick<span className="text-neon-green">Cric</span>.
            </h1>
        </div>

        {/* Navigation Links */}
        <div className="flex justify-around w-full md:w-auto md:gap-10 items-center h-full">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  // Mobile: Stacked (flex-col). Desktop: Row (flex-row)
                  className={`flex flex-col md:flex-row items-center justify-center w-16 md:w-auto h-full transition-all duration-300 group relative ${
                    isActive ? 'text-neon-green md:text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-1 md:mb-0 md:mr-2 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'drop-shadow-[0_0_8px_rgba(34,197,94,0.8)] md:text-neon-green' : ''}`} />
                  
                  <span className="text-[10px] md:text-sm font-bold uppercase tracking-wider">
                     {item.label}
                  </span>
                  
                  {/* MOBILE: Active Indicator Dot (Top) */}
                  {isActive && (
                    <div className="md:hidden absolute top-1 w-1 h-1 rounded-full bg-neon-green shadow-[0_0_8px_rgba(34,197,94,1)]" />
                  )}

                  {/* DESKTOP: Active Indicator Underline (Bottom) */}
                  {isActive && (
                    <div className="hidden md:block absolute bottom-0 left-0 right-0 h-0.5 bg-neon-green shadow-[0_0_8px_rgba(34,197,94,1)]" />
                  )}
                </button>
              );
            })}
        </div>

      </div>
    </div>
  );
};

export default BottomNav;
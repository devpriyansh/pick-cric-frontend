import React from 'react';
import { Home, Trophy, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide the bottom nav on the Auth screen or Player Selection screen
  if (location.pathname === '/auth' || location.pathname.includes('/select-players') || location.pathname === '/success') {
      return null;
  }

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaders' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-navy-900/95 backdrop-blur-md border-t border-white/10 pb-safe z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-6">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center w-16 h-full transition-all duration-300 ${
                isActive ? 'text-neon-green scale-110' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]' : ''}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
              
              {/* Active Indicator Dot */}
              {isActive && (
                <div className="absolute top-1 w-1 h-1 rounded-full bg-neon-green shadow-[0_0_8px_rgba(34,197,94,1)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
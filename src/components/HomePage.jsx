import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import JackpotCard from './JackpotCard';
import FeaturedBanner from './FeaturedBanner';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react'; // Added a few icons for premium empty/loading states

const FEATURED_MATCHES = [
  { teamA: 'IND', teamB: 'AUS', tournament: 'World T20 Cup', format: 'T20' },
  { teamA: 'ENG', teamB: 'NZ', tournament: 'The Hundred Men', format: '100' },
  { teamA: 'MI', teamB: 'CSK', tournament: 'Indian Premier L', format: 'T20' },
  { teamA: 'PAK', teamB: 'SA', tournament: 'Bilateral Series', format: 'ODI' },
  { teamA: 'WI', teamB: 'SL', tournament: 'Global T20', format: 'T20' }
];

const HomePage = () => {
  const navigate = useNavigate();
  
  // 1. Setup State for API Data (UNCHANGED)
  const [jackpots, setJackpots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Fetch Data on Component Mount (UNCHANGED)
  useEffect(() => {
    const fetchLiveJackpots = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://pickcric.onrender.com/api/getLiveJackpots'); 
        const result = await response.json();

        if (result.success) {
          const formattedJackpots = result.data.map((dbJackpot) => {
            const teams = dbJackpot.subtitle ? dbJackpot.subtitle.split(' vs ') : ['Team A', 'Team B'];
            
            return {
              id: dbJackpot.id,
              teamA: teams[0] || 'Team A',
              teamB: teams[1] || 'Team B',
              tournament: dbJackpot.leagueName || 'Cricket League',
              format: dbJackpot.matchType || 'T20',
              endDate: dbJackpot.endDate, 
              prizePool: dbJackpot.topPrizes && dbJackpot.topPrizes[0] 
                ? `₹${dbJackpot.topPrizes[0].amount.toLocaleString('en-IN')}` 
                : 'TBA',
              rawDbData: dbJackpot 
            };
          });

          setJackpots(formattedJackpots);
        } else {
          setError(result.message || 'Failed to load jackpots.');
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError('Unable to connect to the server.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiveJackpots();
  }, []);

  return (
    <div className="w-full min-h-screen relative pb-24 bg-navy-900 overflow-x-hidden">
      
      {/* Decorative ambient elements - Scaled for desktop */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] md:w-[40%] h-[500px] md:h-[800px] bg-blue-600/10 rounded-full blur-[100px] md:blur-[150px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[50%] md:w-[30%] h-[400px] md:h-[600px] bg-neon-green/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />

      {/* Header section */}
      <div className="pt-12 md:pt-32 px-4 sm:px-6 md:px-10 mb-6 md:mb-10 max-w-7xl mx-auto relative z-10">
         <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-4"
         >
            <div>
                <h1 className="font-display font-black text-4xl md:text-5xl lg:text-6xl tracking-tight bg-gradient-to-br from-white via-slate-200 to-slate-500 bg-clip-text text-transparent filter drop-shadow-sm">
                   PickCric<span className="text-neon-green">.</span>
                </h1>
                <p className="text-slate-400 mt-3 font-medium text-lg md:text-xl max-w-xl leading-relaxed">
                   Draft your ultimate fantasy team. Win massive jackpots tonight.
                </p>
            </div>
            
            {/* Desktop Only Extra Badge */}
            <div className="hidden lg:flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-full backdrop-blur-sm mb-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-bold text-slate-200 tracking-widest uppercase">Live Contests</span>
            </div>
         </motion.div>
      </div>

      {/* Featured Banner - Full width constraint for ultra-wide monitors */}
      <div className="relative z-10 max-w-[1600px] mx-auto w-full">
         <FeaturedBanner matches={FEATURED_MATCHES} />
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 mt-10 md:mt-16 relative z-10">
        
        <div className="flex items-center justify-between mb-8 md:mb-10 border-b border-white/10 pb-4">
            <h2 className="font-display font-black text-2xl md:text-3xl lg:text-4xl text-white flex items-center gap-3 tracking-tight">
              <span className="w-1.5 md:w-2 h-8 md:h-10 bg-neon-green rounded-full shadow-[0_0_15px_rgba(34,197,94,0.6)] block"></span>
              Live & Upcoming
            </h2>
        </div>

        {/* 3. Handle Loading, Error, and Empty States */}
        {/* ✅ RESPONSIVE GRID: 1 col on mobile, 2 cols on tablet, 3 cols on large desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8">
          
          {isLoading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400 bg-slate-800/20 rounded-3xl border border-white/5 backdrop-blur-sm">
              <Loader2 className="w-10 h-10 animate-spin text-neon-green mb-4" />
              <p className="font-display font-bold text-lg animate-pulse tracking-wide">Loading live jackpots...</p>
            </div>
          ) : error ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 text-red-400 bg-red-500/10 rounded-3xl border border-red-500/20 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
              <p className="font-bold text-lg">{error}</p>
              <button onClick={() => window.location.reload()} className="mt-4 text-sm underline hover:text-red-300">Try Again</button>
            </div>
          ) : jackpots.length === 0 ? (
            <div className="col-span-full text-center text-slate-400 py-20 bg-slate-800/20 rounded-3xl border border-white/5 backdrop-blur-sm flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">🏏</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No active matches</h3>
              <p className="text-sm">No live jackpots available right now. Check back soon!</p>
            </div>
          ) : (
            // Find this section inside your HomePage.jsx map function:
jackpots.map((match, idx) => (
  <motion.div 
     key={match.id}
     initial={{ opacity: 0, y: 30 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ delay: idx * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
     
     // ✅ THE FIX: Check the time before allowing navigation!
     onClick={() => {
        const now = new Date().getTime();
        const endTime = new Date(match.endDate).getTime();
        
        if (now < endTime) {
            // It is still live, allow navigation
            navigate(`/select-players/${match.id}`, { state: match.rawDbData });
        } else {
            // It is expired! Do not navigate. You can also show a toast message here.
            alert("This jackpot has closed!");
        }
     }}
     
     className="cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.5)] rounded-3xl group"
  >
     <div className="h-full group-hover:ring-1 group-hover:ring-neon-green/30 rounded-3xl transition-all">
        <JackpotCard match={match} />
     </div>
  </motion.div>
))
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
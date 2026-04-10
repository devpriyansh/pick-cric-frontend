import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import JackpotCard from './JackpotCard';
import FeaturedBanner from './FeaturedBanner';

const FEATURED_MATCHES = [
  { teamA: 'IND', teamB: 'AUS', tournament: 'World T20 Cup', format: 'T20' },
  { teamA: 'ENG', teamB: 'NZ', tournament: 'The Hundred Men', format: '100' },
  { teamA: 'MI', teamB: 'CSK', tournament: 'Indian Premier L', format: 'T20' },
  { teamA: 'PAK', teamB: 'SA', tournament: 'Bilateral Series', format: 'ODI' },
  { teamA: 'WI', teamB: 'SL', tournament: 'Global T20', format: 'T20' }
];

const HomePage = () => {
  const navigate = useNavigate();
  
  // 1. Setup State for API Data
  const [jackpots, setJackpots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Fetch Data on Component Mount
  useEffect(() => {
    const fetchLiveJackpots = async () => {
      try {
        setIsLoading(true);
        // Note: Ensure your backend has CORS enabled if running on a different port!
        const response = await fetch('https://pickcric.onrender.com/api/getLiveJackpots'); 
        const result = await response.json();

        if (result.success) {
          // Map backend DB fields to match what JackpotCard expects
          const formattedJackpots = result.data.map((dbJackpot) => {
            // Extract teams from subtitle (e.g., "MI vs CSK" -> ["MI", "CSK"])
            const teams = dbJackpot.subtitle ? dbJackpot.subtitle.split(' vs ') : ['Team A', 'Team B'];
            
            return {
              id: dbJackpot.id,
              teamA: teams[0] || 'Team A',
              teamB: teams[1] || 'Team B',
              tournament: dbJackpot.leagueName || 'Cricket League',
              format: dbJackpot.matchType || 'T20',
              // Passing the raw endDate so your card can calculate the countdown
              endDate: dbJackpot.endDate, 
              // Extracting the first prize amount from the JSONB array
              prizePool: dbJackpot.topPrizes && dbJackpot.topPrizes[0] 
                ? `₹${dbJackpot.topPrizes[0].amount.toLocaleString('en-IN')}` 
                : 'TBA',
              // Passing the full raw DB object just in case you need availablePlayers on the next screen
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
    <div className="w-full relative pb-20">
      
      {/* Decorative ambient elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-5%] w-[30%] h-[400px] bg-neon-green/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header section */}
      <div className="pt-12 px-6 md:px-10 mb-2 max-w-[1400px] mx-auto relative z-10">
         <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
         >
            <h1 className="font-display font-black text-4xl md:text-5xl lg:text-6xl tracking-tight bg-gradient-to-br from-white via-slate-200 to-slate-500 bg-clip-text text-transparent filter drop-shadow-sm">
               PickCric<span className="text-neon-green">.</span>
            </h1>
            <p className="text-slate-400 mt-3 font-medium text-lg md:text-xl max-w-xl leading-relaxed">
               Draft your ultimate fantasy team. Win massive jackpots tonight.
            </p>
         </motion.div>
      </div>

      <div className="relative z-10">
         <FeaturedBanner matches={FEATURED_MATCHES} />
      </div>

      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 md:px-10 mt-8 md:mt-12 relative z-10">
        <div className="flex items-center justify-between mb-8 md:mb-10">
            <h2 className="font-display font-black text-2xl md:text-4xl text-white flex items-center gap-4 tracking-tight">
              <span className="w-2 md:w-3 h-8 md:h-10 bg-neon-green rounded-full shadow-[0_0_15px_rgba(34,197,94,0.6)] block"></span>
              Live & Upcoming Jackpots
            </h2>
        </div>

        {/* 3. Handle Loading, Error, and Empty States */}
        <div className="flex flex-col gap-6 md:gap-8">
          {isLoading ? (
            <div className="text-center text-slate-400 py-10 animate-pulse">
              Loading live jackpots...
            </div>
          ) : error ? (
            <div className="text-center text-red-400 bg-red-500/10 py-6 rounded-xl border border-red-500/20">
              {error}
            </div>
          ) : jackpots.length === 0 ? (
            <div className="text-center text-slate-400 py-10 bg-slate-800/30 rounded-xl border border-slate-700/50">
              No live jackpots available right now. Check back soon!
            </div>
          ) : (
            jackpots.map((match, idx) => (
              <motion.div 
                 key={match.id}
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: idx * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                 // Note: We pass the rawDbData to the next screen so it has the availablePlayers list!
                 onClick={() => navigate(`/select-players/${match.id}`, { state: match.rawDbData })}
                 className="cursor-pointer"
              >
                 <JackpotCard match={match} />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
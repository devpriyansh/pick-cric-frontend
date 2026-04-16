// import React from 'react';
// import { motion } from 'framer-motion';
// import { Trophy, Clock, ShieldAlert, ShieldCheck } from 'lucide-react';

// const JackpotCard = ({ match }) => {
//   return (
//     <motion.div
//       whileHover={{ y: -5, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
//       whileTap={{ scale: 0.98 }}
//       className="relative w-full rounded-[2rem] bg-slate-800/20 backdrop-blur-2xl border border-white/5 p-5 md:p-6 overflow-hidden group transition-colors"
//     >
//       {/* Subtle glowing mesh behind */}
//       <div className="absolute -inset-2 bg-gradient-to-br from-neon-green/10 via-transparent to-gold-accent/10 opacity-30 group-hover:opacity-70 blur-3xl z-0 transition-opacity duration-700 pointer-events-none" />

//       <div className="relative z-10">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 shadow-inner">
//             <Trophy className="w-4 h-4 text-gold-accent" />
//             <span className="text-xs font-bold text-slate-300 tracking-widest uppercase">{match.tournament}</span>
//           </div>
//           <span className="text-xs font-black text-slate-400 bg-white/5 px-4 py-1.5 rounded-full shadow-inner">{match.format}</span>
//         </div>

//         {/* Teams Section */}
//         <div className="flex justify-between items-center mb-8 px-2 md:px-8">
//           {/* Team A */}
//           <div className="flex flex-col items-center gap-3">
//             <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-slate-700 to-navy-900 p-[2px] shadow-2xl border border-white/10 group-hover:border-white/20 transition-colors">
//               <div className="w-full h-full rounded-full bg-navy-900 flex items-center justify-center relative overflow-hidden">
//                  <div className="absolute inset-0 bg-blue-500/10"></div>
//                  <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-blue-400 relative z-10" />
//               </div>
//             </div>
//             <span className="font-display font-bold text-lg md:text-2xl text-slate-100">{match.teamA}</span>
//           </div>

//           {/* VS Badge */}
//           <div className="flex flex-col items-center">
//             <span className="font-display font-black text-2xl md:text-4xl bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent italic tracking-tighter">VS</span>
//           </div>

//           {/* Team B */}
//           <div className="flex flex-col items-center gap-3">
//             <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-slate-700 to-navy-900 p-[2px] shadow-2xl border border-white/10 group-hover:border-white/20 transition-colors">
//               <div className="w-full h-full rounded-full bg-navy-900 flex items-center justify-center relative overflow-hidden">
//                  <div className="absolute inset-0 bg-red-500/10"></div>
//                  <ShieldAlert className="w-8 h-8 md:w-10 md:h-10 text-red-500 relative z-10" />
//               </div>
//             </div>
//             <span className="font-display font-bold text-lg md:text-2xl text-slate-100">{match.teamB}</span>
//           </div>
//         </div>

//         {/* Info & Action */}
//         <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-navy-900/60 rounded-2xl p-4 md:p-5 border border-white/5 shadow-inner">
//            {/* Timer */}
//            <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start bg-navy-800/50 py-2 md:py-0 px-4 md:px-0 rounded-xl md:bg-transparent">
//              <Clock className="w-5 h-5 md:w-6 md:h-6 text-neon-green animate-pulse" />
//              <div className="flex flex-col">
//                <span className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest font-bold">Starts In</span>
//                <span className="text-neon-green font-display font-bold text-xl md:text-2xl tracking-wider tabular-nums filter drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]">{match.timeOut}</span>
//              </div>
//            </div>

//            {/* Prize & Action */}
//            <div className="flex items-center gap-4 md:gap-8 w-full sm:w-auto">
//              <div className="flex flex-col text-left sm:text-right flex-1 sm:flex-none">
//                <span className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest font-bold">Total Pool</span>
//                <span className="text-gold-accent font-display font-black text-xl md:text-3xl filter drop-shadow-[0_0_6px_rgba(234,179,8,0.4)]">{match.prizePool}</span>
//              </div>
             
//              <motion.button 
//                whileHover={{ scale: 1.05 }}
//                whileTap={{ scale: 0.95 }}
//                className="bg-neon-green text-navy-900 font-extrabold px-6 md:px-8 py-3 md:py-3.5 rounded-xl uppercase tracking-widest text-sm md:text-base shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:shadow-[0_0_30px_rgba(34,197,94,0.8)] transition-all duration-300 animate-pulse-fast flex items-center justify-center"
//              >
//                Join
//              </motion.button>
//            </div>
//         </div>

//       </div>
//     </motion.div>
//   );
// };

// export default JackpotCard;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, ShieldAlert, ShieldCheck } from 'lucide-react';

const JackpotCard = ({ match }) => {
  // --- REAL-TIME COUNTDOWN LOGIC ---
  const [timeLeft, setTimeLeft] = useState('Calculating...');
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!match.endDate) {
      setTimeLeft('Upcoming');
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const targetTime = new Date(match.endDate).getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft('Closed');
        setIsLive(false);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setIsLive(true); 

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else {
        const h = String(hours).padStart(2, '0');
        const m = String(minutes).padStart(2, '0');
        const s = String(seconds).padStart(2, '0');
        setTimeLeft(`${h}h ${m}m ${s}s`);
      }
    };

    calculateTimeLeft();
    const timerInterval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timerInterval);
  }, [match.endDate]);

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
      whileTap={{ scale: 0.98 }}
      className="relative w-full rounded-[2rem] bg-slate-800/20 backdrop-blur-2xl border border-white/5 p-4 md:p-6 overflow-hidden group transition-colors flex flex-col h-full"
    >
      <div className="absolute -inset-2 bg-gradient-to-br from-neon-green/10 via-transparent to-yellow-500/10 opacity-30 group-hover:opacity-70 blur-3xl z-0 transition-opacity duration-700 pointer-events-none" />

      <div className="relative z-10 flex flex-col flex-1">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6 gap-2">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 shadow-inner min-w-0 max-w-[75%]">
            <Trophy className="w-4 h-4 text-yellow-400 shrink-0" />
            <span className="text-[10px] md:text-xs font-bold text-slate-300 tracking-widest uppercase truncate">
              {match.tournament}
            </span>
          </div>
          <span className="text-[10px] md:text-xs font-black text-slate-400 bg-white/5 px-3 py-1.5 rounded-full shadow-inner shrink-0">
            {match.format}
          </span>
        </div>

        {/* Teams Section */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-3 mb-8 flex-1">
          {/* Team A */}
          <div className="flex flex-col items-center gap-3 min-w-0">
            <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-full bg-gradient-to-br from-slate-700 to-navy-900 p-[2px] shadow-2xl border border-white/10 group-hover:border-white/20 transition-colors">
              <div className="w-full h-full rounded-full bg-navy-900 flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-blue-500/10"></div>
                 <ShieldCheck className="w-7 h-7 md:w-8 md:h-8 text-blue-400 relative z-10" />
              </div>
            </div>
            {/* ✅ FIX: Replaced truncate with line-clamp-2 to allow text wrapping */}
            <span className="font-display font-bold text-sm md:text-base text-slate-100 text-center leading-tight line-clamp-2 w-full px-1">
              {match.teamA}
            </span>
          </div>

          {/* VS Badge */}
          <div className="flex flex-col items-center shrink-0 px-1">
            <span className="font-display font-black text-xl md:text-2xl bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent italic tracking-tighter">
              VS
            </span>
          </div>

          {/* Team B */}
          <div className="flex flex-col items-center gap-3 min-w-0">
            <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-full bg-gradient-to-br from-slate-700 to-navy-900 p-[2px] shadow-2xl border border-white/10 group-hover:border-white/20 transition-colors">
              <div className="w-full h-full rounded-full bg-navy-900 flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-red-500/10"></div>
                 <ShieldAlert className="w-7 h-7 md:w-8 md:h-8 text-red-500 relative z-10" />
              </div>
            </div>
            {/* ✅ FIX: Replaced truncate with line-clamp-2 to allow text wrapping */}
            <span className="font-display font-bold text-sm md:text-base text-slate-100 text-center leading-tight line-clamp-2 w-full px-1">
              {match.teamB}
            </span>
          </div>
        </div>

        {/* Info & Action Bar */}
        <div className="mt-auto flex flex-wrap sm:flex-nowrap justify-between items-center gap-3 bg-navy-900/60 rounded-2xl p-3 md:p-4 border border-white/5 shadow-inner">
           
           {/* Dynamic Timer */}
           <div className="flex items-center gap-2 justify-start shrink-0">
             <Clock className={`w-4 h-4 md:w-5 md:h-5 shrink-0 ${isLive ? 'text-neon-green animate-pulse' : 'text-red-500'}`} />
             <div className="flex flex-col min-w-0">
               <span className="text-[9px] md:text-[10px] text-slate-400 uppercase tracking-widest font-bold whitespace-nowrap">
                   {isLive ? 'Closes In' : 'Status'}
               </span>
               {/* ✅ FIX: Reduced font size and added whitespace-nowrap */}
               <span className={`font-display font-bold text-sm md:text-base tracking-wider tabular-nums whitespace-nowrap ${isLive ? 'text-neon-green filter drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'text-red-500'}`}>
                 {timeLeft}
               </span>
             </div>
           </div>

           {/* Prize Pool (Hidden on very tiny screens if needed, but flex-wrap handles it) */}
           <div className="hidden sm:flex flex-col text-right justify-center shrink-0 ml-auto mr-4">
             <span className="text-[9px] md:text-[10px] text-slate-400 uppercase tracking-widest font-bold whitespace-nowrap">Prize</span>
             <span className="text-yellow-500 font-display font-black text-sm md:text-base filter drop-shadow-[0_0_6px_rgba(234,179,8,0.4)] whitespace-nowrap">
               {match.prizePool || "TBA"}
             </span>
           </div>
           
           {/* Action Button */}
           <motion.button 
             whileHover={isLive ? { scale: 1.05 } : {}}
             whileTap={isLive ? { scale: 0.95 } : {}}
             disabled={!isLive}
             // ✅ FIX: Reduced padding and font-size so the button doesn't crush the text
             className={`w-full sm:w-auto font-extrabold px-5 md:px-6 py-2.5 md:py-3 rounded-xl uppercase tracking-widest text-xs md:text-sm transition-all duration-300 flex items-center justify-center shrink-0 ${isLive ? 'bg-neon-green text-navy-900 shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:shadow-[0_0_25px_rgba(34,197,94,0.7)]' : 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-80'}`}
           >
             {isLive ? 'Join' : 'Closed'}
           </motion.button>
           
        </div>

      </div>
    </motion.div>
  );
};

export default JackpotCard;
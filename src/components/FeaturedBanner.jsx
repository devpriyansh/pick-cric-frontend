import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const FeaturedBanner = ({ matches }) => {
  return (
    <div className="w-full relative py-6 md:py-8 overflow-hidden h-40">
        {/* Gradient fades on edges to hide scrolling cut-offs */}
        <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-navy-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-navy-900 to-transparent z-10 pointer-events-none" />

        <div className="flex overflow-x-auto scrollbar-hide gap-4 md:gap-6 px-6 md:px-12 pb-4 absolute inset-0 pt-4">
            {matches.map((match, idx) => (
                <motion.div 
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    key={idx} 
                    className="flex-none w-[280px] bg-white/5 border border-white/5 rounded-2xl p-4 md:p-5 backdrop-blur-xl cursor-pointer group hover:bg-slate-800/40 hover:border-white/10 transition-all duration-300 shadow-lg"
                >
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                           <span className="relative flex h-2 w-2">
                             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
                             <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
                           </span>
                           <span className="text-[10px] font-bold text-slate-300 tracking-widest uppercase">Live Match</span>
                        </div>
                        <div className="bg-white/5 rounded-full p-1.5 group-hover:bg-neon-green/20 transition-colors">
                           <Play className="w-3.5 h-3.5 text-slate-400 group-hover:text-neon-green transition-colors" />
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-display font-bold text-xl">{match.teamA}</span>
                        <span className="text-slate-500 font-black italic text-sm px-2">VS</span>
                        <span className="font-display font-bold text-xl">{match.teamB}</span>
                    </div>

                    <div className="text-xs text-slate-400 font-medium">
                        {match.tournament} <span className="text-slate-600 px-1">•</span> <span className="text-neon-green font-bold">{match.format}</span>
                    </div>
                </motion.div>
            ))}
        </div>
    </div>
  );
}

export default FeaturedBanner;

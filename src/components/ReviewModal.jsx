import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const ReviewModal = ({ onClose, onConfirm, players }) => {
  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 pointer-events-auto"
      />
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 bg-navy-900 border-t border-white/10 rounded-t-[2rem] z-[60] max-h-[85vh] flex flex-col shadow-[0_-10px_50px_rgba(0,0,0,0.6)]"
      >
         <div className="flex justify-center pt-4 pb-2">
            <div className="w-12 h-1.5 bg-slate-700/50 rounded-full"></div>
         </div>
         
         <div className="flex justify-between items-center px-6 md:px-8 py-4 border-b border-white/5">
            <h2 className="font-display font-black text-2xl tracking-tight text-white">Review Team</h2>
            <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/5">
               <X className="w-5 h-5 text-slate-300" />
            </button>
         </div>

         <div className="overflow-y-auto px-6 md:px-8 py-6 relative flex-grow">
             {/* Selected Players Grid */}
             <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                 {players.map(player => (
                     <div key={player.id} className="bg-slate-800/40 rounded-xl p-3 border border-white/5 flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-slate-700 to-navy-900 border-2 border-white/10 shrink-0 p-[1px]">
                             <img src={player.image} alt={player.name} className="w-full h-full rounded-full object-cover" />
                         </div>
                         <div className="flex flex-col overflow-hidden">
                             <span className="font-display font-bold text-[13px] md:text-sm text-slate-100 truncate">{player.name}</span>
                             <span className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">{player.role} <span className="text-neon-green/80 px-0.5">•</span> {player.team}</span>
                         </div>
                     </div>
                 ))}
             </div>
         </div>

         <div className="px-6 md:px-8 py-6 md:py-8 bg-navy-900 border-t border-white/5 flex justify-center backdrop-blur-xl shrink-0 z-10 w-full relative">
            <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-transparent to-navy-900 -translate-y-[99%] pointer-events-none" />
             <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                className="w-full max-w-sm mx-auto bg-neon-green text-navy-900 font-black text-lg py-4 rounded-2xl shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] transition-shadow uppercase tracking-widest flex items-center justify-center gap-2"
             >
                Confirm Entry
             </motion.button>
         </div>
      </motion.div>
    </>
  );
};

export default ReviewModal;

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ConfettiParticle = ({ delay }) => {
    return (
        <motion.div
           initial={{ 
               y: "110vh", 
               x: `${Math.random() * 100}vw`,
               scale: Math.random() * 0.6 + 0.4,
               rotate: 0 
           }}
           animate={{ 
               y: "-10vh",
               x: `${(Math.random() * 50) + 25}vw`, // drifting slightly center
               rotate: 360 * (Math.random() > 0.5 ? 1 : -1)
           }}
           transition={{ 
               duration: Math.random() * 2.5 + 2.5,
               delay: delay,
               repeat: Infinity,
               ease: "linear"
           }}
           className="absolute w-2 h-4 sm:w-3 sm:h-5 bg-gold-accent rounded-sm shadow-[0_0_8px_rgba(234,179,8,0.8)] pointer-events-none"
           style={{
               opacity: Math.random() * 0.6 + 0.4,
               backgroundColor: Math.random() > 0.5 ? '#EAB308' : '#FDE047'
           }}
        />
    );
};

const SuccessScreen = () => {
    const [particles, setParticles] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        // Prepare continuous confetti
        const p = Array.from({ length: 45 }).map((_, i) => ({ id: i, delay: Math.random() * 4 }));
        setParticles(p);
    }, []);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-navy-900 z-[200] flex flex-col items-center justify-center overflow-hidden"
        >
            {/* Massive Background Glow */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.5 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 1 }}
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] max-w-[600px] max-h-[600px] bg-neon-green/20 rounded-full blur-[100px] xl:blur-[140px] pointer-events-none" 
            />

            {/* Confetti Particles */}
            {particles.map(p => <ConfettiParticle key={p.id} delay={p.delay} />)}

            <div className="relative z-10 flex flex-col items-center px-6 text-center w-full">
                <motion.div 
                   initial={{ scale: 0, rotate: -45 }}
                   animate={{ scale: 1, rotate: 0 }}
                   transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                   className="w-24 h-24 md:w-32 md:h-32 bg-neon-green rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(34,197,94,0.6)] mb-8 border-[6px] border-neon-green/30"
                >
                    <Check className="w-12 h-12 md:w-16 md:h-16 text-navy-900" strokeWidth={4} />
                </motion.div>
                
                <motion.h1 
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="font-display font-black text-3xl md:text-5xl text-white mb-4 tracking-tight leading-tight"
                >
                    Jackpot Submitted<br/><span className="text-neon-green filter drop-shadow-[0_0_10px_rgba(34,197,94,0.4)]">Successfully!</span>
                </motion.h1>

                <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-slate-300 font-medium text-base md:text-lg mb-12 max-w-xs md:max-w-sm leading-relaxed"
                >
                    Your drafted team is locked in. Watch live to see them score points.
                </motion.p>
                
                <motion.button 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/')}
                    className="bg-transparent border-2 border-gold-accent/80 text-gold-accent hover:bg-gold-accent hover:text-navy-900 hover:border-gold-accent font-black text-base md:text-lg px-8 py-4 rounded-xl transition-all duration-300 uppercase tracking-widest w-full max-w-sm shadow-[0_0_15px_rgba(234,179,8,0.2)] hover:shadow-[0_0_30px_rgba(234,179,8,0.6)]"
                >
                    View My Contests
                </motion.button>
            </div>
        </motion.div>
    );
};

export default SuccessScreen;

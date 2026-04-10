import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, ArrowLeft, AlertCircle } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSelection } from '../context/SelectionContext';
import ReviewModal from './ReviewModal';

const ROLES = ['WK', 'BAT', 'AR', 'BOWL'];
const MAX_PLAYERS = 11;
const MAX_CREDITS = 120;

const PlayerSelection = () => {
    const navigate = useNavigate();
    const { jackpotId } = useParams(); 
    const { getDraft, setDraft } = useSelection();

    const [players, setPlayers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [activeFilter, setActiveFilter] = useState('WK');
    const [selectedPlayers, setSelectedPlayers] = useState(getDraft(jackpotId) || []);
    const [toastMessage, setToastMessage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const fetchJackpotDetails = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`https://pickcric.onrender.com/api/getJackpotById/${jackpotId}`);
                const result = await response.json();

                if (result.success && result.data) {
                    const fetchedPlayers = (result.data.availablePlayers || []).map((p, index) => ({
                        id: p.id,
                        name: p.name,
                        team: p.team || 'TBA',
                        role: p.role || 'BAT',
                        sel: `${Math.floor(Math.random() * 40 + 40)}%`, 
                        points: Math.floor(Math.random() * 300 + 100), 
                        credits: parseFloat(p.credits) || 9.0, 
                        image: `https://i.pravatar.cc/150?u=${p.id || index}`
                    }));
                    setPlayers(fetchedPlayers);
                } else {
                    setError('Jackpot not found.');
                }
            } catch (err) {
                console.error("Error fetching jackpot details:", err);
                setError('Failed to connect to the server.');
            } finally {
                setIsLoading(false);
            }
        };

        if (jackpotId) {
            fetchJackpotDetails();
        }
    }, [jackpotId]);

    const creditsLeft = MAX_CREDITS - selectedPlayers.reduce((acc, p) => acc + p.credits, 0);

    const handleSelect = (player) => {
        const isSelected = selectedPlayers.find(p => p.id === player.id);
        let newSelection = [];
        if (isSelected) {
            newSelection = selectedPlayers.filter(p => p.id !== player.id);
        } else {
            if (selectedPlayers.length >= MAX_PLAYERS) {
                showToast("Maximum 11 players allowed");
                return;
            }
            if (creditsLeft - player.credits < 0) {
                showToast("Not enough credits");
                return;
            }
            newSelection = [...selectedPlayers, player];
        }
        
        setSelectedPlayers(newSelection);
        setDraft(jackpotId, newSelection);
    };

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    // ✅ UPDATED: Gets real User ID and Token from LocalStorage
    const handleConfirmEntry = async () => {
        setShowModal(false);
        setIsProcessing(true);
        
        try {
            // 1. Retrieve the saved user and token
            const userStr = localStorage.getItem('pickcric_user');
            const token = localStorage.getItem('pickcric_token');

            if (!userStr || !token) {
                showToast("User session expired. Please log in again.");
                setIsProcessing(false);
                setTimeout(() => navigate('/auth'), 1500);
                return;
            }

            // 2. Parse the user object to get the ID
            const loggedInUser = JSON.parse(userStr);

            // 3. Build payload with the exact ID
            const payload = {
                jackpotId: parseInt(jackpotId),
                userId: loggedInUser.id, 
                selectedPlayers: selectedPlayers
            };

            const response = await fetch('http://localhost:8003/api/contests/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Pass the token for security
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setDraft(jackpotId, []); 
                navigate('/success');
            } else {
                throw new Error(result.message || 'Failed to submit entry');
            }
        } catch (error) {
            console.error("Submission error:", error);
            showToast(error.message || 'Network error while submitting.');
            setIsProcessing(false); 
        }
    };

    const filteredPlayers = players.filter(p => p.role === activeFilter);
    const progressPercent = (selectedPlayers.length / MAX_PLAYERS) * 100;

    return (
        <div className="w-full min-h-screen pb-24 relative bg-navy-900">

            {/* Processing Overlay */}
            <AnimatePresence>
                {isProcessing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-navy-900/80 backdrop-blur-md z-[200] flex flex-col items-center justify-center p-6"
                    >
                        <div className="w-16 h-16 border-4 border-slate-700 border-t-neon-green rounded-full animate-spin mb-4" />
                        <h2 className="font-display font-bold text-xl text-white animate-pulse">Processing Entry...</h2>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sticky Header */}
            <div className="sticky top-0 z-50 bg-navy-900/90 backdrop-blur-2xl border-b border-white/10 px-4 md:px-8 py-5 shadow-2xl">
                <div className="flex justify-between items-center mb-5 max-w-4xl mx-auto w-full">
                    <button onClick={() => navigate(-1)} className="p-2 border border-white/10 bg-white/5 rounded-full hover:bg-white/10 transition-colors shadow-lg">
                        <ArrowLeft className="w-5 h-5 text-slate-300" />
                    </button>
                    <h2 className="font-display font-black text-xl md:text-2xl tracking-tight text-white">Draft Players</h2>
                    <div className="w-9 h-9 border border-white/5 rounded-full bg-white/5"></div>
                </div>

                <div className="max-w-4xl mx-auto w-full">
                    <div className="flex justify-between items-end mb-3">
                        <div className="flex flex-col">
                            <span className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest font-bold">Selected</span>
                            <span className="font-display font-black text-3xl text-white"><span className="text-neon-green">{selectedPlayers.length}</span><span className="text-slate-500">/{MAX_PLAYERS}</span></span>
                        </div>
                        <div className="flex flex-col text-right">
                            <span className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest font-bold">Credits Left</span>
                            <span className="font-display font-black text-3xl text-yellow-500 tracking-tighter filter drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]">{creditsLeft.toFixed(1)}</span>
                        </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                        <motion.div
                            className="h-full bg-neon-green shadow-[0_0_15px_rgba(34,197,94,0.8)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 0.5, ease: "anticipate" }}
                        />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="max-w-4xl mx-auto w-full px-4 md:px-8 mt-6">
                <div className="flex bg-white/5 rounded-2xl p-1.5 border border-white/5 shadow-xl backdrop-blur-md">
                    {ROLES.map(role => (
                        <button
                            key={role}
                            onClick={() => setActiveFilter(role)}
                            className={`flex-1 py-3 text-xs md:text-sm font-black tracking-widest rounded-xl transition-all duration-300 ${activeFilter === role ? 'bg-neon-green text-navy-900 shadow-[0_0_20px_rgba(34,197,94,0.5)]' : 'text-slate-400 hover:text-slate-200 hover:bg-white/10'}`}
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area: Handling Loading, Errors, and Player List */}
            <div className="max-w-4xl mx-auto w-full px-4 md:px-8 mt-6 flex flex-col gap-4">
                {isLoading ? (
                    <div className="text-center text-slate-400 py-10 animate-pulse font-display font-bold">
                        Loading players...
                    </div>
                ) : error ? (
                    <div className="text-center text-red-400 bg-red-500/10 py-6 rounded-xl border border-red-500/20 font-medium">
                        {error}
                    </div>
                ) : players.length === 0 ? (
                    <div className="text-center text-slate-400 py-10 bg-slate-800/30 rounded-xl border border-slate-700/50">
                        No players have been assigned to this jackpot yet.
                    </div>
                ) : (
                    filteredPlayers.map((player) => {
                        const isSelected = selectedPlayers.find(p => p.id === player.id);
                        return (
                            <motion.div
                                key={player.id}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => handleSelect(player)}
                                className={`relative w-full rounded-2xl p-4 flex items-center justify-between cursor-pointer border backdrop-blur-xl transition-all duration-300 group ${isSelected ? 'bg-neon-green/10 border-neon-green/30 shadow-[0_0_30px_rgba(34,197,94,0.15)]' : 'bg-slate-800/40 border-white/5 hover:bg-white/10 hover:border-white/10'}`}
                            >
                                <div className="flex items-center gap-4 md:gap-6">
                                    <div className="relative">
                                        <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full p-[2px] bg-gradient-to-br transition-all duration-300 ${isSelected ? 'from-neon-green to-blue-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'from-slate-700 to-navy-900 shadow-md'}`}>
                                            <img src={player.image} alt={player.name} className="w-full h-full rounded-full object-cover border-2 border-navy-900" />
                                        </div>
                                        <div className="absolute -bottom-2 inset-x-0 flex justify-center">
                                            <span className="text-[9px] md:text-[10px] font-black tracking-widest uppercase bg-navy-900 text-slate-100 px-2.5 py-0.5 rounded-full border border-white/10 shadow-lg">{player.team}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col ml-1">
                                        <h3 className="font-display font-bold text-lg md:text-xl tracking-tight text-white">{player.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[9px] md:text-[10px] text-slate-300 font-bold bg-white/10 px-2 py-0.5 rounded border border-white/5">SEL {player.sel}</span>
                                            <span className="text-[9px] md:text-[10px] text-slate-400 font-black">{player.points} PTS</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col items-end">
                                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Credits</span>
                                        <span className={`font-display font-black text-xl md:text-2xl transition-colors ${isSelected ? 'text-neon-green' : 'text-slate-200'}`}>{player.credits.toFixed(1)}</span>
                                    </div>

                                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${isSelected ? 'bg-neon-green text-navy-900 scale-110 rotate-12' : 'bg-white/5 border border-white/10 text-white group-hover:bg-white/10'}`}>
                                        {isSelected ? <Check className="w-5 h-5 md:w-6 md:h-6" /> : <Plus className="w-5 h-5 md:w-6 md:h-6" />}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* Selected Status / CTA */}
            {selectedPlayers.length === MAX_PLAYERS && (
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-navy-900 via-navy-900/90 to-transparent pointer-events-none z-40 flex justify-center"
                >
                    <button onClick={() => setShowModal(true)} className="pointer-events-auto bg-neon-green text-navy-900 font-black text-sm md:text-base tracking-widest uppercase px-12 py-4 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] hover:scale-105 active:scale-95 transition-all duration-300">
                        Review Team
                    </button>
                </motion.div>
            )}

            {/* Toast */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.8 }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 bg-red-500/90 backdrop-blur-md text-white px-6 py-3.5 rounded-2xl font-bold shadow-[0_0_30px_rgba(239,68,68,0.6)] border border-red-400/50 flex items-center gap-3 z-[100]"
                    >
                        <AlertCircle className="w-5 h-5" />
                        {toastMessage}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal Overlay */}
            <AnimatePresence>
                {showModal && (
                    <ReviewModal
                        players={selectedPlayers}
                        onClose={() => setShowModal(false)}
                        onConfirm={handleConfirmEntry}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default PlayerSelection;
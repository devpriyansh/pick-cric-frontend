import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from "../../public/logo2.png";

const BG_IMAGE = "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2000&auto=format&fit=crop";

const AuthScreen = () => {
  const navigate = useNavigate();

  // --- UI State ---
  const [view, setView] = useState('LOGIN'); 
  const [regStep, setRegStep] = useState(1); 
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null); 

  // --- Form State ---
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? 100 : -100, opacity: 0, position: 'absolute' }),
    center: { x: 0, opacity: 1, position: 'relative' },
    exit: (direction) => ({ x: direction < 0 ? 100 : -100, opacity: 0, position: 'absolute' })
  };

  const direction = view === 'LOGIN' ? -1 : 1;

  const showMessage = (text, type = 'error') => {
      setMessage({ text, type });
      setTimeout(() => setMessage(null), 5000);
  };

  const handleLogin = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      try {
          const response = await fetch('https://pickcric.onrender.com/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ emailOrUsername: loginId, password: loginPassword })
          });
          const data = await response.json();

          if (response.ok && data.success) {
              localStorage.setItem('pickcric_token', data.token);
              localStorage.setItem('pickcric_user', JSON.stringify(data.user));
              navigate('/');
          } else {
              showMessage(data.message || 'Login failed');
          }
      } catch (error) {
          showMessage('Network error. Please try again.');
      } finally {
          setIsLoading(false);
      }
  };

  const handleSendOtp = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      try {
          const response = await fetch('https://pickcric.onrender.com/api/auth/send-otp', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email })
          });
          const data = await response.json();

          if (response.ok && data.success) {
              showMessage('OTP sent to your email!', 'success');
              setRegStep(2); 
          } else {
              showMessage(data.message || 'Failed to send OTP');
          }
      } catch (error) {
          showMessage('Network error. Please try again.');
      } finally {
          setIsLoading(false);
      }
  };

  const handleRegister = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      try {
          const response = await fetch('https://pickcric.onrender.com/api/auth/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, username, password, otp })
          });
          const data = await response.json();

          if (response.ok && data.success) {
              localStorage.setItem('pickcric_token', data.token);
              localStorage.setItem('pickcric_user', JSON.stringify(data.user));
              navigate('/');
          } else {
              showMessage(data.message || 'Registration failed');
          }
      } catch (error) {
          showMessage('Network error. Please try again.');
      } finally {
          setIsLoading(false);
      }
  };

  return (
    // ✅ FIX: Changed to `fixed inset-0 w-screen h-screen` to break out of any mobile wrappers in your App.jsx
    <div className="fixed inset-0 z-[100] w-screen h-screen flex items-center justify-center overflow-y-auto overflow-x-hidden bg-navy-900 px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Global Background Image & Overlay */}
      <div 
         className="fixed inset-0 bg-cover bg-center bg-no-repeat w-full h-full transform scale-105 filter blur-sm opacity-60"
         style={{ backgroundImage: `url(${BG_IMAGE})` }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-navy-900/90 via-navy-900/70 to-slate-900/90 z-0" />

      {/* Main Responsive Card Container */}
      <div className="relative z-10 w-full max-w-md lg:max-w-5xl flex flex-col lg:flex-row bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden min-h-[600px]">
         
         {/* LEFT COLUMN: Branding (Hidden on Mobile, Shows on Desktop) */}
         <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-navy-900/80 to-transparent">
             <div className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-neon-green/20 rounded-full blur-[100px] pointer-events-none" />
             <div className="absolute bottom-[-20%] right-[-20%] w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />

             <div className="relative z-10">
                 <img src={Logo} alt="PickCric Logo" className="w-48 h-auto mb-8 drop-shadow-2xl" />
                 <h1 className="font-display font-black text-5xl leading-tight text-white mb-4">
                     Draft your team.<br/>
                     <span className="text-neon-green">Dominate the game.</span>
                 </h1>
                 <p className="text-slate-300 text-lg max-w-sm">
                     Join the most premium Daily Fantasy Sports platform. Prove your cricket knowledge and win real rewards.
                 </p>
             </div>

             <div className="relative z-10 flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl w-fit backdrop-blur-md">
                 <Sparkles className="w-6 h-6 text-yellow-400" />
                 <span className="text-sm font-bold text-white tracking-widest uppercase">Over 1M+ Active Players</span>
             </div>
         </div>

         {/* RIGHT COLUMN / MOBILE MAIN: The Form Area */}
         <div className="w-full lg:w-1/2 flex flex-col p-6 sm:p-8 lg:p-12 relative bg-slate-800/30 lg:border-l lg:border-white/10">
            
            {/* Mobile Branding (Only shows on small screens) */}
            <div className="flex flex-col items-center mb-8 lg:hidden">
                <div className="w-40 flex items-center justify-center">
                   <img src={Logo} alt="PickCric Logo" className='w-full h-auto drop-shadow-xl'/>
                </div>
            </div>

            {/* Alert Message Box */}
            <AnimatePresence>
                {message && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: -10 }}
                        className={`mb-6 p-4 rounded-xl flex items-start gap-3 border backdrop-blur-md ${message.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-300' : 'bg-green-500/10 border-green-500/30 text-green-300'}`}
                    >
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <p className="text-sm font-medium leading-relaxed">{message.text}</p>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Toggle Segmented Control */}
            <div className="flex bg-navy-900/60 p-1.5 rounded-2xl mb-8 relative border border-white/5 shadow-inner">
               <div 
                  className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-slate-700/50 rounded-xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-sm backdrop-blur-md border border-white/10"
                  style={{ transform: view === 'LOGIN' ? 'translateX(0%)' : 'translateX(calc(100% + 4px))' }}
               />
               <button 
                  onClick={() => { setView('LOGIN'); setMessage(null); }}
                  className={`flex-1 py-3.5 text-sm font-bold tracking-widest uppercase relative z-10 transition-colors ${view === 'LOGIN' ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
               >
                  Sign In
               </button>
               <button 
                  onClick={() => { setView('REGISTER'); setRegStep(1); setMessage(null); }}
                  className={`flex-1 py-3.5 text-sm font-bold tracking-widest uppercase relative z-10 transition-colors ${view === 'REGISTER' ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
               >
                  Create
               </button>
            </div>

            {/* Form Area */}
            <div className="relative flex-1">
                <AnimatePresence custom={direction} mode="wait">
                   {view === 'LOGIN' ? (
                       <motion.form 
                          key="login-form"
                          custom={direction}
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          className="flex flex-col gap-5 w-full h-full"
                          onSubmit={handleLogin}
                       >
                           <div className="flex flex-col gap-2">
                               <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-1">Email or Username</label>
                               <div className="relative flex items-center group">
                                   <User className="absolute left-4 w-5 h-5 text-slate-500 group-focus-within:text-neon-green transition-colors" />
                                   <input 
                                      type="text" 
                                      value={loginId}
                                      onChange={(e) => setLoginId(e.target.value)}
                                      placeholder="johndoe@example.com"
                                      className="w-full bg-navy-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-600 font-medium focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green transition-all shadow-inner"
                                      required
                                   />
                               </div>
                           </div>
                           <div className="flex flex-col gap-2">
                               <div className="flex justify-between items-center pl-1">
                                   <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Password</label>
                                   <a href="#" className="text-[10px] text-neon-green font-bold tracking-wider hover:text-white transition-colors">Forgot?</a>
                               </div>
                               <div className="relative flex items-center group">
                                   <Lock className="absolute left-4 w-5 h-5 text-slate-500 group-focus-within:text-neon-green transition-colors" />
                                   <input 
                                      type="password" 
                                      value={loginPassword}
                                      onChange={(e) => setLoginPassword(e.target.value)}
                                      placeholder="••••••••"
                                      className="w-full bg-navy-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-600 font-medium focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green transition-all shadow-inner"
                                      required
                                   />
                               </div>
                           </div>

                           <button type="submit" disabled={isLoading} className="mt-6 bg-neon-green text-navy-900 font-black text-lg py-4 rounded-2xl shadow-[0_4px_20px_rgba(34,197,94,0.3)] hover:shadow-[0_4px_30px_rgba(34,197,94,0.5)] transition-all uppercase tracking-widest flex justify-center hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:-translate-y-0">
                               {isLoading ? 'Authenticating...' : 'Sign In'}
                           </button>
                       </motion.form>

                   ) : (

                       <motion.form 
                          key="register-form"
                          custom={direction}
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          className="flex flex-col gap-5 w-full h-full"
                          onSubmit={regStep === 1 ? handleSendOtp : handleRegister}
                       >
                           {regStep === 1 && (
                               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5 w-full">
                                   <div className="flex flex-col gap-2">
                                       <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-1">Email Address</label>
                                       <div className="relative flex items-center group">
                                           <Mail className="absolute left-4 w-5 h-5 text-slate-500 group-focus-within:text-neon-green transition-colors" />
                                           <input 
                                              type="email" 
                                              value={email}
                                              onChange={(e) => setEmail(e.target.value)}
                                              placeholder="your@email.com"
                                              className="w-full bg-navy-900/50 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 font-medium focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green transition-all shadow-inner"
                                              required
                                           />
                                       </div>
                                   </div>
                                   <div className="flex flex-col gap-2">
                                       <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-1">Unique Username</label>
                                       <div className="relative flex items-center group">
                                           <User className="absolute left-4 w-5 h-5 text-slate-500 group-focus-within:text-neon-green transition-colors" />
                                           <input 
                                              type="text" 
                                              value={username}
                                              onChange={(e) => setUsername(e.target.value)}
                                              placeholder="coolcricketer99"
                                              className="w-full bg-navy-900/50 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 font-medium focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green transition-all shadow-inner"
                                              required
                                           />
                                       </div>
                                   </div>
                                   <div className="flex flex-col gap-2">
                                       <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-1">Set Password</label>
                                       <div className="relative flex items-center group">
                                           <Lock className="absolute left-4 w-5 h-5 text-slate-500 group-focus-within:text-neon-green transition-colors" />
                                           <input 
                                              type="password" 
                                              value={password}
                                              onChange={(e) => setPassword(e.target.value)}
                                              placeholder="••••••••"
                                              className="w-full bg-navy-900/50 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 font-medium focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green transition-all shadow-inner"
                                              required
                                              minLength="6"
                                           />
                                       </div>
                                   </div>

                                   <button type="submit" disabled={isLoading} className="mt-2 bg-neon-green text-navy-900 font-black text-lg py-4 rounded-2xl shadow-[0_4px_20px_rgba(34,197,94,0.3)] hover:shadow-[0_4px_30px_rgba(34,197,94,0.5)] transition-all uppercase tracking-widest flex justify-center hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:-translate-y-0">
                                       {isLoading ? 'Sending OTP...' : 'Continue'}
                                   </button>
                               </motion.div>
                           )}

                           {regStep === 2 && (
                               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-5 w-full h-full justify-center">
                                   <div className="text-center mb-2 bg-navy-900/30 p-6 rounded-2xl border border-white/5">
                                       <div className="w-16 h-16 bg-neon-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Mail className="w-8 h-8 text-neon-green" />
                                       </div>
                                       <p className="text-sm text-slate-300 mb-1">We sent a 6-digit code to</p>
                                       <p className="text-white font-bold text-lg">{email}</p>
                                   </div>
                                   <div className="flex flex-col gap-2">
                                       <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-1 text-center">Enter Verification Code</label>
                                       <div className="relative flex items-center group">
                                           <ShieldCheck className="absolute left-6 w-6 h-6 text-slate-500 group-focus-within:text-neon-green transition-colors" />
                                           <input 
                                              type="text" 
                                              value={otp}
                                              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                                              placeholder="000000"
                                              maxLength="6"
                                              className="w-full text-center tracking-[0.75em] text-3xl font-black bg-navy-900/50 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green transition-all shadow-inner"
                                              required
                                           />
                                       </div>
                                   </div>

                                   <button type="submit" disabled={isLoading || otp.length !== 6} className="mt-4 bg-neon-green text-navy-900 font-black text-lg py-4 rounded-2xl shadow-[0_4px_20px_rgba(34,197,94,0.3)] hover:shadow-[0_4px_30px_rgba(34,197,94,0.5)] transition-all uppercase tracking-widest flex justify-center hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:-translate-y-0">
                                       {isLoading ? 'Verifying...' : 'Verify & Register'}
                                   </button>
                                   
                                   <button type="button" onClick={() => setRegStep(1)} className="mt-4 text-sm font-medium text-slate-400 hover:text-white transition-colors text-center w-full">
                                       Entered wrong email? Go back
                                   </button>
                               </motion.div>
                           )}
                       </motion.form>
                   )}
                </AnimatePresence>
            </div>

            {/* Social Oauth */}
            {!(view === 'REGISTER' && regStep === 2) && (
                <div className="mt-8 pt-8 border-t border-white/10">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center mb-5">Or continue with</p>
                    <div className="flex justify-center gap-4">
                        <button className="flex-1 bg-white hover:bg-slate-100 text-navy-900 font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-sm">
                            <div className="w-5 h-5 bg-conic-gradient rounded-full bg-[linear-gradient(45deg,#EA4335_25%,#4285F4_25%,#4285F4_50%,#34A853_50%,#34A853_75%,#FBBC05_75%)] p-[2px]">
                               <div className="bg-white w-full h-full rounded-full flex items-center justify-center font-black text-[12px] pb-0.5">G</div>
                            </div>
                            <span className="text-sm">Google</span>
                        </button>
                        <button className="flex-1 bg-navy-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 border border-white/10 transition-colors shadow-sm">
                            <svg viewBox="0 0 384 512" className="w-5 h-5 fill-current">
                               <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                            </svg>
                            <span className="text-sm">Apple</span>
                        </button>
                    </div>
                </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default AuthScreen;
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, LogIn, ShieldCheck, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from "../../public/logo2.png"

const BG_IMAGE = "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2000&auto=format&fit=crop";

const AuthScreen = () => {
  const navigate = useNavigate();

  // --- UI State ---
  const [view, setView] = useState('LOGIN'); // 'LOGIN' or 'REGISTER'
  const [regStep, setRegStep] = useState(1); // 1 = Details, 2 = OTP Verification
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null); // { text: '', type: 'error' | 'success' }

  // --- Form State ---
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  // Variants for Framer Motion sliding
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

  // --- API Handlers ---

  const handleLogin = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      try {
          // Replace URL with your actual backend URL/Port
          const response = await fetch('http://localhost:8003/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ emailOrUsername: loginId, password: loginPassword })
          });
          const data = await response.json();

          if (response.ok && data.success) {
              // Save token to localStorage for authenticated requests later
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
          const response = await fetch('http://localhost:8003/api/auth/send-otp', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email })
          });
          const data = await response.json();

          if (response.ok && data.success) {
              showMessage('OTP sent to your email!', 'success');
              setRegStep(2); // Move to OTP step
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
          const response = await fetch('http://localhost:8003/api/auth/register', {
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
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-navy-900">
      {/* Background Image & Overlay */}
      <div 
         className="absolute inset-0 bg-cover bg-center bg-no-repeat w-full h-full transform scale-105 filter blur-sm"
         style={{ backgroundImage: `url(${BG_IMAGE})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/80 to-navy-900/40 z-0" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md px-2 py-2 md:p-4 flex flex-col h-full md:h-auto min-h-screen md:min-h-[auto]">
         
         {/* Branding */}
         <div className="flex flex-col items-center md:mt-0">
             <div className="w-300 h-30 flex items-center justify-center ">
                <img src={Logo} className='w-full h-full'/>
                {/* <LogIn className="w-8 h-8 text-navy-900" /> */}
             </div>
             {/* <h1 className="font-display font-black text-3xl tracking-tight text-white shadow-sm">Pick<span className="text-neon-green">Cric</span></h1> */}
             {/* <p className="text-slate-300 font-medium tracking-wide text-sm mt-1">Daily Fantasy Sports</p> */}
         </div>

         {/* Alert Message Box */}
         <AnimatePresence>
             {message && (
                 <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }}
                    className={`mb-4 p-3 rounded-xl flex items-center gap-3 border backdrop-blur-md ${message.type === 'error' ? 'bg-red-500/20 border-red-500/50 text-red-200' : 'bg-green-500/20 border-green-500/50 text-green-200'}`}
                 >
                     <AlertCircle className="w-5 h-5 flex-shrink-0" />
                     <p className="text-sm font-medium">{message.text}</p>
                 </motion.div>
             )}
         </AnimatePresence>

         {/* Glass Card */}
         <div className="flex-1 md:flex-none flex flex-col bg-slate-800/20 backdrop-blur-3xl rounded-t-[2.5rem] rounded-b-[2.5rem] md:rounded-3xl border border-white/10 shadow-2xl p-6 md:p-8 overflow-hidden relative">
            
            {/* Toggle Segmented Control */}
            <div className="flex bg-navy-900/50 p-1.5 rounded-2xl mb-8 relative border border-white/5 shadow-inner">
               <div 
                  className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white/10 rounded-xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-sm`}
                  style={{ transform: view === 'LOGIN' ? 'translateX(0%)' : 'translateX(calc(100% + 4px))' }}
               />
               <button 
                  onClick={() => { setView('LOGIN'); setMessage(null); }}
                  className={`flex-1 py-3 text-sm font-bold tracking-widest uppercase relative z-10 transition-colors ${view === 'LOGIN' ? 'text-white' : 'text-slate-400'}`}
               >
                  Sign In
               </button>
               <button 
                  onClick={() => { setView('REGISTER'); setRegStep(1); setMessage(null); }}
                  className={`flex-1 py-3 text-sm font-bold tracking-widest uppercase relative z-10 transition-colors ${view === 'REGISTER' ? 'text-white' : 'text-slate-400'}`}
               >
                  Create
               </button>
            </div>

            {/* Form Area */}
            <div className="relative min-h-[320px] md:min-h-[350px]">
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
                          className="flex flex-col gap-4 w-full"
                          onSubmit={handleLogin}
                       >
                           {/* Login Inputs */}
                           <div className="flex flex-col gap-1.5">
                               <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-2">Email or Username</label>
                               <div className="relative flex items-center">
                                   <User className="absolute left-4 w-5 h-5 text-slate-400" />
                                   <input 
                                      type="text" 
                                      value={loginId}
                                      onChange={(e) => setLoginId(e.target.value)}
                                      placeholder="johndoe@example.com"
                                      className="w-full bg-navy-900/60 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-slate-100 placeholder-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green transition-all"
                                      required
                                   />
                               </div>
                           </div>
                           <div className="flex flex-col gap-1.5">
                               <div className="flex justify-between items-center pl-2">
                                   <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Password</label>
                                   <a href="#" className="text-[10px] text-neon-green font-bold tracking-wider hover:underline">Forgot?</a>
                               </div>
                               <div className="relative flex items-center">
                                   <Lock className="absolute left-4 w-5 h-5 text-slate-400" />
                                   <input 
                                      type="password" 
                                      value={loginPassword}
                                      onChange={(e) => setLoginPassword(e.target.value)}
                                      placeholder="••••••••"
                                      className="w-full bg-navy-900/60 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-slate-100 placeholder-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green transition-all"
                                      required
                                   />
                               </div>
                           </div>

                           <button type="submit" disabled={isLoading} className="mt-8 bg-neon-green text-navy-900 font-black text-lg py-4 rounded-2xl shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] transition-all uppercase tracking-widest flex justify-center disabled:opacity-70 disabled:cursor-not-allowed">
                               {isLoading ? 'Processing...' : 'Sign In'}
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
                          className="flex flex-col gap-4 w-full"
                          onSubmit={regStep === 1 ? handleSendOtp : handleRegister}
                       >
                           {/* Register Step 1: Details */}
                           {regStep === 1 && (
                               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4 w-full">
                                   <div className="flex flex-col gap-1.5">
                                       <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-2">Email Address</label>
                                       <div className="relative flex items-center">
                                           <Mail className="absolute left-4 w-5 h-5 text-slate-400" />
                                           <input 
                                              type="email" 
                                              value={email}
                                              onChange={(e) => setEmail(e.target.value)}
                                              placeholder="your@email.com"
                                              className="w-full bg-navy-900/60 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-slate-100 placeholder-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green transition-all"
                                              required
                                           />
                                       </div>
                                   </div>
                                   <div className="flex flex-col gap-1.5">
                                       <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-2">Unique Username</label>
                                       <div className="relative flex items-center">
                                           <User className="absolute left-4 w-5 h-5 text-slate-400" />
                                           <input 
                                              type="text" 
                                              value={username}
                                              onChange={(e) => setUsername(e.target.value)}
                                              placeholder="coolcricketer99"
                                              className="w-full bg-navy-900/60 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-slate-100 placeholder-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green transition-all"
                                              required
                                           />
                                       </div>
                                   </div>
                                   <div className="flex flex-col gap-1.5">
                                       <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-2">Set Password</label>
                                       <div className="relative flex items-center">
                                           <Lock className="absolute left-4 w-5 h-5 text-slate-400" />
                                           <input 
                                              type="password" 
                                              value={password}
                                              onChange={(e) => setPassword(e.target.value)}
                                              placeholder="••••••••"
                                              className="w-full bg-navy-900/60 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-slate-100 placeholder-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green transition-all"
                                              required
                                              minLength="6"
                                           />
                                       </div>
                                   </div>

                                   <button type="submit" disabled={isLoading} className="mt-4 bg-neon-green text-navy-900 font-black text-lg py-4 rounded-2xl shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] transition-all uppercase tracking-widest flex justify-center disabled:opacity-70 disabled:cursor-not-allowed">
                                       {isLoading ? 'Sending...' : 'Send OTP'}
                                   </button>
                               </motion.div>
                           )}

                           {/* Register Step 2: OTP Verification */}
                           {regStep === 2 && (
                               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4 w-full">
                                   <div className="text-center mb-4">
                                       <p className="text-sm text-slate-300">We sent a 6-digit code to</p>
                                       <p className="text-neon-green font-bold">{email}</p>
                                   </div>
                                   <div className="flex flex-col gap-1.5">
                                       <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-2 text-center">Enter OTP</label>
                                       <div className="relative flex items-center">
                                           <ShieldCheck className="absolute left-4 w-5 h-5 text-slate-400" />
                                           <input 
                                              type="text" 
                                              value={otp}
                                              onChange={(e) => setOtp(e.target.value)}
                                              placeholder="123456"
                                              maxLength="6"
                                              className="w-full text-center tracking-[0.5em] text-2xl bg-navy-900/60 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-slate-100 placeholder-slate-600 font-medium focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green transition-all"
                                              required
                                           />
                                       </div>
                                   </div>

                                   <button type="submit" disabled={isLoading} className="mt-4 bg-neon-green text-navy-900 font-black text-lg py-4 rounded-2xl shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] transition-all uppercase tracking-widest flex justify-center disabled:opacity-70 disabled:cursor-not-allowed">
                                       {isLoading ? 'Verifying...' : 'Verify & Register'}
                                   </button>
                                   
                                   <button type="button" onClick={() => setRegStep(1)} className="mt-2 text-xs text-slate-400 hover:text-white transition-colors">
                                       Need to change email? Go back.
                                   </button>
                               </motion.div>
                           )}
                       </motion.form>
                   )}
                </AnimatePresence>
            </div>

            {/* Social Oauth (Hidden during OTP step to keep UI clean) */}
            {!(view === 'REGISTER' && regStep === 2) && (
                <div className="mt-auto md:mt-8 pt-8 border-t border-white/5 pb-2 md:pb-0">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center mb-6">Or continue with</p>
                    <div className="flex justify-center gap-4">
                        <button className="flex-1 bg-white hover:bg-slate-100 text-navy-900 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-3 transition-colors shadow-lg">
                            <div className="w-5 h-5 bg-conic-gradient rounded-full bg-[linear-gradient(45deg,#EA4335_25%,#4285F4_25%,#4285F4_50%,#34A853_50%,#34A853_75%,#FBBC05_75%)] p-[2px]">
                               <div className="bg-white w-full h-full rounded-full flex items-center justify-center font-black text-[12px] pb-0.5">G</div>
                            </div>
                            <span className="text-sm">Google</span>
                        </button>
                        <button className="flex-1 bg-navy-900 hover:bg-navy-800 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-3 border border-white/10 transition-colors shadow-lg">
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
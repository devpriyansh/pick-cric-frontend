import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Layout from './components/Layout';
import AuthScreen from './components/AuthScreen';
import HomePage from './components/HomePage';
import PlayerSelection from './components/PlayerSelection';
import SuccessScreen from './components/SuccessScreen';

// Import your new Route Guard
import ProtectedRoute from './components/ProtectedRoute';
import BottomNav from './components/BottomNav';
import UserProfile from './components/UserProfile';

const pageVariants = {
  initial: { opacity: 0, x: 50 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -50 }
};

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3
};

function App() {
  const location = useLocation();

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          
          {/* UNPROTECTED ROUTE: Anyone can access the Auth screen */}
          <Route path="/auth" element={
            <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="w-full">
               <AuthScreen />
            </motion.div>
          } />

          {/* PROTECTED ROUTES: Wrapped in <ProtectedRoute> */}
          <Route path="/" element={
            <ProtectedRoute>
              <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="w-full">
                 <HomePage />
              </motion.div>
            </ProtectedRoute>
          } />

          <Route path="/select-players/:jackpotId" element={
            <ProtectedRoute>
              <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="w-full">
                 <PlayerSelection />
              </motion.div>
            </ProtectedRoute>
          } />

          <Route path="/success" element={
            <ProtectedRoute>
              <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="w-full min-h-screen">
                 <SuccessScreen />
              </motion.div>
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="w-full">
                 <UserProfile />
              </motion.div>
            </ProtectedRoute>
          } />

          {/* Catch-all route: If they type a weird URL, send them home (which will send them to /auth if they aren't logged in) */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AnimatePresence>
      <BottomNav />
    </Layout>
  );
}

export default App;
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  // Check if the user has a token saved from logging in
  const isAuthenticated = localStorage.getItem('pickcric_token');

  if (!isAuthenticated) {
    // If not logged in, redirect to the Auth screen.
    // 'replace' prevents them from hitting the back button to return to the protected page.
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If they are logged in, render the requested page
  return children;
};

export default ProtectedRoute;
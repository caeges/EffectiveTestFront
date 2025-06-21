import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = (() => {
    try {
      const token = localStorage.getItem('jwtToken');
      return !!token;
    } catch (err) {
      console.error('Error al acceder al token:', err);
      return false;
    }
  })();

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;

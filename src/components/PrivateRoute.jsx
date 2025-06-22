import React from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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

  if (!isAuthenticated) {
    toast.warning('⚠️ Necesitas iniciar sesión para continuar', {
      position: 'top-right',
      autoClose: 3000,
    });
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
const ProtectedRoute = () => { 

  const userId = Cookies.get('userid'); 
  useEffect(() => {
    if (!userId) {
      toast.error('Authentication error');
    }
  }, [userId]);
  return userId ? (<Outlet />) : 
        (
            <Navigate to="/" replace />
        );
};

export default ProtectedRoute;

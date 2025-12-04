
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900">
        <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (roles && roles.length > 0 && !roles.includes(user.user_metadata?.role)) {
    // Redirect logic based on role
    const role = user.user_metadata?.role;
    let redirectTo = '/auth/login'; // Default fallback
    if (role === 'secretary') redirectTo = '/admin/secretaria/dashboard';
    if (role === 'doctor') redirectTo = '/admin/medico/dashboard';
    if (role === 'patient') redirectTo = '/admin/paciente/dashboard';
    
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;

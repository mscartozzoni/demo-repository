
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const Callback = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // The AuthProvider's onAuthStateChange handles the session.
    // We just wait for the profile to be loaded and then redirect.
    if (profile) {
      switch (profile.role) {
        case 'medico':
          navigate('/medico', { replace: true });
          break;
        case 'secretaria':
          navigate('/secretaria', { replace: true });
          break;
        case 'paciente':
          navigate('/paciente', { replace: true });
          break;
        default:
          navigate('/medico', { replace: true }); // Fallback
          break;
      }
    }
  }, [profile, navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-slate-900 text-white">
      <Loader2 className="animate-spin text-blue-500 h-16 w-16" />
      <p className="mt-4 text-slate-300">Autenticando e redirecionando...</p>
    </div>
  );
};

export default Callback;

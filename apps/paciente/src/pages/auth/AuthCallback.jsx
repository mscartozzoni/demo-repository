import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const AuthCallback = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate successful authentication and fetching user data
    // In a real scenario, you'd handle a token from the URL query params
    const mockUserData = {
      id: 'mock-user-id-external',
      email: 'usuario@externo.com',
      user_metadata: { full_name: 'Usuário Externo', role: 'secretary' },
    };
    
    setTimeout(() => {
      signIn(mockUserData);
      navigate('/', { replace: true });
    }, 1500); // Simulate processing time
  }, [signIn, navigate]);

  return (
    <>
      <Helmet>
        <title>Autenticando...</title>
        <meta name="description" content="Processando seu login..." />
      </Helmet>
      <div className="flex flex-col items-center justify-center min-h-screen bg-transparent p-4 text-white">
        <Loader2 className="w-16 h-16 animate-spin text-blue-500 mb-4" />
        <h1 className="text-2xl font-bold gradient-text">Autenticando...</h1>
        <p className="text-gray-400">Aguarde um momento, estamos preparando tudo para você!</p>
      </div>
    </>
  );
};

export default AuthCallback;
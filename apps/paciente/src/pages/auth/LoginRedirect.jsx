import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const LoginRedirect = () => {
  const { redirectToLogin } = useAuth();

  useEffect(() => {
    redirectToLogin();
  }, [redirectToLogin]);

  return (
    <>
      <Helmet>
        <title>Redirecionando...</title>
        <meta name="description" content="Redirecionando para a página de login." />
      </Helmet>
      <div className="flex flex-col items-center justify-center min-h-screen bg-transparent p-4 text-white">
        <Loader2 className="w-16 h-16 animate-spin text-blue-500 mb-4" />
        <h1 className="text-2xl font-bold gradient-text">Redirecionando para o login...</h1>
        <p className="text-gray-400">Você será levado para a página de autenticação.</p>
      </div>
    </>
  );
};

export default LoginRedirect;
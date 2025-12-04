import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { Bot, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginSuccess = () => {
  const { legacyLogin } = useAuth();

  useEffect(() => {
    // This simulates a successful login from the old system
    legacyLogin();
    
    // Redirect after a short delay
    const timer = setTimeout(() => {
      window.location.href = 'https://blue-giraffe-898975.hostingersite.com/medico/dashboard';
    }, 2500);

    return () => clearTimeout(timer);
  }, [legacyLogin]);

  return (
    <>
      <Helmet>
        <title>Login bem-sucedido - Redirecionando...</title>
        <meta name="description" content="Login do sistema antigo bem-sucedido. Redirecionando para o novo dashboard." />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 p-4 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="text-center"
        >
          <div className="relative inline-block">
             <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
             >
                <CheckCircle className="h-24 w-24 text-green-400" />
            </motion.div>
          </div>
          <h1 className="text-3xl font-bold mt-6">Bem-vindo(a) de volta!</h1>
          <p className="text-slate-300 mt-2">Login do sistema legado autenticado com sucesso.</p>
          <p className="text-slate-400 mt-1">Você será redirecionado para o novo dashboard em instantes...</p>
          <div className="mt-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400"></div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginSuccess;
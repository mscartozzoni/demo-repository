import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import SignUpForm from '@/components/SignUpForm';

const SignUpScreen = () => {
  const navigate = useNavigate();

  const handleSignUpSuccess = (newUser) => {
    // Redirecionar para login após sucesso
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  const handleSwitchToLogin = () => {
    navigate('/login');
  };

  return (
    <>
      <Helmet>
        <title>Criar Conta - Portal Clinic Bot</title>
        <meta name="description" content="Crie sua conta para acessar o sistema de gestão clínica" />
      </Helmet>
      
      <div className="flex items-center justify-center min-h-screen bg-background relative overflow-hidden">
        <div className="aurora-effect"></div>
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="z-10 w-full max-w-md px-6"
        >
          <SignUpForm 
            onSuccess={handleSignUpSuccess}
            onSwitchToLogin={handleSwitchToLogin}
          />
        </motion.div>
      </div>
    </>
  );
};

export default SignUpScreen;


import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const NotRegistered = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-blue-900/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-full max-w-lg p-10 text-center bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700 backdrop-blur-sm"
      >
        <div className="flex justify-center mb-6">
          <AlertTriangle className="w-16 h-16 text-yellow-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">E-mail não cadastrado</h1>
        <p className="text-slate-300 mb-8 max-w-sm mx-auto">
          O endereço de e-mail que você inseriu não foi encontrado em nosso sistema. Verifique se digitou corretamente ou entre em contato com a clínica para obter acesso.
        </p>
        <Button asChild className="btn-primary">
          <Link to="/auth/login">Tentar Novamente</Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default NotRegistered;

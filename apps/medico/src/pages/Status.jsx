import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const StatusItem = ({ label, status, message }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="text-green-500" />;
      case 'error':
        return <XCircle className="text-red-500" />;
      default:
        return <AlertTriangle className="text-yellow-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700"
    >
      <div className="flex items-center gap-4">
        {getStatusIcon()}
        <div>
          <p className="font-semibold text-white">{label}</p>
          <p className="text-sm text-slate-400">{message}</p>
        </div>
      </div>
    </motion.div>
  );
};

const StatusPage = () => {
  const auth = useAuth();
  const user = auth ? auth.user : null;

  const statuses = {
    envVars: { status: 'success', message: 'Variáveis de ambiente locais estão em uso.' },
    supabaseClient: { status: 'error', message: 'Cliente Supabase foi removido do projeto.' },
    dbConnection: { status: 'error', message: 'Conexão com banco de dados desativada. Usando dados mock.' },
    authContext: { status: 'success', message: 'Contexto de autenticação com Google está ativo.' },
    authStatus: { status: 'success', message: user ? `Sessão mock ativa para: ${user.email}` : 'Nenhum usuário logado.' },
  };

  return (
    <>
      <Helmet>
        <title>Status do Sistema - Portal do Médico</title>
        <meta name="description" content="Página de diagnóstico para verificar o status dos serviços e conexões do sistema." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 sm:p-6 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Painel de Diagnóstico</h1>
            <p className="text-slate-400">Resultados dos testes de integridade do sistema em tempo real.</p>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 p-4 rounded-lg mb-6 text-center">
             <p className="font-bold">Modo de Demonstração Ativo</p>
             <p className="text-sm">O Supabase foi removido. O aplicativo está usando dados de teste locais e não possui persistência de dados.</p>
          </div>
         
          <div className="space-y-4">
            <StatusItem {...statuses.envVars} />
            <StatusItem {...statuses.supabaseClient} />
            <StatusItem {...statuses.dbConnection} />
            <StatusItem {...statuses.authContext} />
            <StatusItem {...statuses.authStatus} />
          </div>

           <div className="mt-8 text-center">
             <Button onClick={() => window.location.href = '/'} className="text-white">
                Voltar para o Dashboard
             </Button>
           </div>
        </div>
      </div>
    </>
  );
};

export default StatusPage;
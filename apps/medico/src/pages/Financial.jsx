import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const Financial = () => {
  const externalUrl = 'https://lightgrey-falcon-767774.hostingersite.com/dashboard';
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Financeiro - Portal do Médico</title>
        <meta name="description" content="Acompanhe o financeiro de forma integrada." />
      </Helmet>
      
      <Button
        variant="secondary"
        size="icon"
        className="fixed top-4 right-4 z-50 rounded-full h-12 w-12 bg-slate-800/50 hover:bg-slate-700/80 text-white backdrop-blur-sm"
        onClick={() => navigate('/medico/dashboard')}
      >
        <X className="h-6 w-6" />
        <span className="sr-only">Voltar ao Dashboard</span>
      </Button>

      <div className="w-screen h-screen bg-slate-900">
        <iframe
          src={externalUrl}
          title="Painel Financeiro Integrado"
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
        />
      </div>
    </>
  );
};

export default Financial;
import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X, ArrowLeft } from 'lucide-react';

const AssistenteIA = () => {
  const externalUrl = 'https://linen-quetzal-950127.hostingersite.com/dashboard';
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Assistente IA - Portal do Médico</title>
        <meta name="description" content="Integração com o Assistente IA para otimização de tarefas médicas e administrativas." />
      </Helmet>
      
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-300 hover:text-white hover:bg-slate-800"
            onClick={() => navigate('/medico/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Button>
          <div className="h-6 w-px bg-slate-700" />
          <h1 className="text-lg font-semibold text-white">Assistente IA</h1>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-400 hover:text-white hover:bg-slate-800"
          onClick={() => navigate('/medico/dashboard')}
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Fechar</span>
        </Button>
      </div>

      <div className="w-screen h-screen bg-slate-900 pt-[57px]">
        <iframe
          src={externalUrl}
          title="Painel Assistente IA Integrado"
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation allow-popups-to-escape-sandbox"
          allow="clipboard-read; clipboard-write"
        />
      </div>
    </>
  );
};

export default AssistenteIA;
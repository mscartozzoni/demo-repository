import React from 'react';
import { Helmet } from 'react-helmet';

const EmbeddedFinancialPage = () => {
  const externalUrl = 'https://lightgrey-falcon-767774.hostingersite.com/dashboard';

  return (
    <>
      <Helmet>
        <title>Financeiro Externo - Portal do Médico</title>
        <meta name="description" content="Visualização do painel financeiro externo." />
      </Helmet>
      <div className="w-full h-screen bg-slate-900 flex flex-col">
        <div className="p-4 bg-slate-800 border-b border-slate-700 text-center">
            <h1 className="text-xl font-bold text-white">Painel Financeiro Externo</h1>
            <p className="text-sm text-slate-400">Visualizando dados de <a href={externalUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{externalUrl}</a></p>
        </div>
        <iframe
          src={externalUrl}
          title="Painel Financeiro Externo"
          className="w-full h-full border-none"
        />
      </div>
    </>
  );
};

export default EmbeddedFinancialPage;
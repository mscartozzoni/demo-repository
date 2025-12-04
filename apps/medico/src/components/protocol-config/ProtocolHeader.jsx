import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon, IdCardIcon } from '@radix-ui/react-icons';
import StageModal from './StageModal';

const ProtocolHeader = ({ onAddStage }) => {
  const handleOrcamentoClick = () => {
    window.open('https://orcamento.marcioplasticsurgery.com', '_blank');
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-white">Configuração de Protocolo</h1>
        <p className="text-slate-400 mt-2">Configure as etapas e prazos da jornada do paciente</p>
      </div>
      <div className="flex gap-3">
        <Button onClick={handleOrcamentoClick} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
          <IdCardIcon className="w-4 h-4 mr-2" />
          Orçamento
        </Button>
        <StageModal onSave={onAddStage}>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <PlusIcon className="w-4 h-4 mr-2" />
            Nova Etapa
          </Button>
        </StageModal>
      </div>
    </div>
  );
};

export default ProtocolHeader;
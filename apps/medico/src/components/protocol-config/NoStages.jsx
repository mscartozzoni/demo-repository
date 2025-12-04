import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GearIcon, PlusIcon } from '@radix-ui/react-icons';
import StageModal from './StageModal';

const NoStages = ({ onAddStage }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-12"
    >
      <div className="glass-effect rounded-xl p-8 max-w-md mx-auto">
        <GearIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Nenhuma etapa configurada</h3>
        <p className="text-slate-400 mb-4">Comece criando a primeira etapa do protocolo.</p>
        <StageModal onSave={onAddStage}>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <PlusIcon className="w-4 h-4 mr-2" />
            Criar Primeira Etapa
          </Button>
        </StageModal>
      </div>
    </motion.div>
  );
};

export default NoStages;
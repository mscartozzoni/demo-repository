import React from 'react';
import { motion } from 'framer-motion';
import { GearIcon, ClockIcon, BellIcon } from '@radix-ui/react-icons';

const ProtocolOverview = ({ stages }) => {
  const totalSlaDays = stages.reduce((total, stage) => {
      const days = stage.deadline?.type !== 'post_op' ? (stage.deadline?.days || 0) : 7;
      return total + days;
  }, 0);
  const stagesWithNotification = stages.filter(stage => stage.notifyRules?.onDue).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-effect rounded-xl p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <GearIcon className="w-6 h-6 text-blue-400" />
        <h2 className="text-xl font-semibold text-white">Protocolo Atual</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-slate-700/30 rounded-lg">
          <p className="text-2xl font-bold text-blue-400">{stages.length}</p>
          <p className="text-sm text-slate-400">Total de Etapas</p>
        </div>
        <div className="text-center p-4 bg-slate-700/30 rounded-lg">
          <p className="text-2xl font-bold text-green-400">{`~${totalSlaDays}`}</p>
          <p className="text-sm text-slate-400">Dias Totais (SLA)</p>
        </div>
        <div className="text-center p-4 bg-slate-700/30 rounded-lg">
          <p className="text-2xl font-bold text-purple-400">{stagesWithNotification}</p>
          <p className="text-sm text-slate-400">Etapas com Notificação</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProtocolOverview;
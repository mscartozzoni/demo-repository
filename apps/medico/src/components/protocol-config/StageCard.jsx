import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
    Pencil2Icon, 
    TrashIcon, 
    ArrowUpIcon, 
    ArrowDownIcon, 
    ClockIcon, 
    BellIcon,
    ChatBubbleIcon,
    SewingPinIcon,
    CalendarIcon,
    ResetIcon
} from '@radix-ui/react-icons';
import StageModal from './StageModal';

const StageCard = ({ stage, index, onMove, onUpdate, onDelete, isFirst, isLast }) => {
  const isSurgery = stage.event === 'Cirurgia';

  const renderDeadlineInfo = () => {
    if (!stage.deadline) return null;

    const returnLabels = {
        1: "1º Retorno", 2: "2º Retorno", 3: "3º Retorno",
        4: "4º Retorno", 5: "5º Retorno", 6: "6 Meses"
    };

    switch (stage.deadline.type) {
      case 'after_previous':
        return (
          <div className="flex items-center gap-1 px-2 py-1 bg-slate-700 rounded-full">
            <ResetIcon className="w-3 h-3 text-slate-400" />
            <span className="text-xs text-slate-300">{stage.deadline.days} dias após etapa anterior</span>
          </div>
        );
      case 'before_event':
        return (
          <div className="flex items-center gap-1 px-2 py-1 bg-slate-700 rounded-full">
            <CalendarIcon className="w-3 h-3 text-slate-400" />
            <span className="text-xs text-slate-300">{stage.deadline.days} dias antes da cirurgia</span>
          </div>
        );
      case 'post_op':
        return (
           <div className="flex items-center gap-1 px-2 py-1 bg-slate-700 rounded-full">
            <ClockIcon className="w-3 h-3 text-slate-400" />
            <span className="text-xs text-slate-300">{returnLabels[stage.deadline.return_number] || 'Pós-Op'}</span>
          </div>
        );
      default:
        return null;
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-effect rounded-xl p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center flex-wrap gap-3 mb-2">
            <div className={`flex items-center justify-center w-8 h-8 ${isSurgery ? 'bg-purple-600' : 'bg-blue-600'} rounded-full text-white font-bold text-sm`}>
              {stage.order}
            </div>
            <h3 className="text-lg font-semibold text-white">{stage.name}</h3>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 ${isSurgery ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'} rounded-full`}>
              {isSurgery ? <SewingPinIcon className="w-3 h-3" /> : <ChatBubbleIcon className="w-3 h-3" />}
              <span className="text-xs font-medium">{stage.event}</span>
            </div>
            {renderDeadlineInfo()}
          </div>
          <p className="text-sm text-slate-400 mb-3">{stage.description}</p>
          
          <div className="flex items-center gap-4 text-xs text-slate-400">
             {stage.notifyRules ? (
                <>
                    <div className="flex items-center gap-1">
                        <BellIcon className="w-3 h-3" />
                        <span>Notificar: {stage.notifyRules.beforeDue}d antes</span>
                    </div>
                    {stage.notifyRules.onDue && (
                    <div className="flex items-center gap-1">
                        <BellIcon className="w-3 h-3" />
                        <span>No prazo</span>
                    </div>
                    )}
                    {stage.notifyRules.afterDue > 0 && (
                    <div className="flex items-center gap-1">
                        <BellIcon className="w-3 h-3" />
                        <span>{stage.notifyRules.afterDue}d após</span>
                    </div>
                    )}
                </>
            ) : (
                <div className="flex items-center gap-1">
                    <BellIcon className="w-3 h-3 text-slate-500" />
                    <span>Notificações não configuradas</span>
                </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm" variant="outline" onClick={() => onMove('up')}
            disabled={isFirst} className="border-slate-600 hover:border-blue-500"
          >
            <ArrowUpIcon className="w-3 h-3" />
          </Button>
          <Button
            size="sm" variant="outline" onClick={() => onMove('down')}
            disabled={isLast} className="border-slate-600 hover:border-blue-500"
          >
            <ArrowDownIcon className="w-3 h-3" />
          </Button>
          <StageModal stage={stage} onSave={onUpdate}>
            <Button size="sm" variant="outline" className="border-slate-600 hover:border-blue-500">
                <Pencil2Icon className="w-3 h-3" />
            </Button>
          </StageModal>
          <Button
            size="sm" variant="outline" onClick={onDelete}
            className="border-slate-600 hover:border-red-500 hover:text-red-400"
          >
            <TrashIcon className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default StageCard;
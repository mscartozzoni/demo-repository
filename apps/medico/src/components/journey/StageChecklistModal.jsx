import React from 'react';
import { motion } from 'framer-motion';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
    CheckCircledIcon, 
    CrossCircledIcon, 
    Link2Icon,
    ClockIcon
} from '@radix-ui/react-icons';
import { addDays, format, subDays, getDay, nextMonday } from 'date-fns';

const StageChecklistModal = ({ isOpen, onClose, journey, stage }) => {

  const handleActionClick = (action) => {
    alert(`Redirecionando para: ${action.link}`);
  };

  const calculateDueDate = () => {
    if (!stage.deadline || !journey) return 'N/A';
    
    try {
      const lastCompletedDate = new Date(journey.last_completed_timestamp || journey.patient_first_contact_date || Date.now());
      const surgeryDate = new Date(journey.patient_surgery_date || Date.now());

      let dueDate;
      switch(stage.deadline.type) {
        case 'after_previous':
          dueDate = addDays(lastCompletedDate, stage.deadline.days);
          break;
        case 'before_event':
          dueDate = subDays(surgeryDate, stage.deadline.days);
          break;
        case 'post_op':
          let postOpDate = surgeryDate;
          const returnNumber = stage.deadline.return_number || 1;
          
          if(returnNumber === 1) { // 1st return
            const dayOfWeek = getDay(postOpDate); // Sunday is 0, Monday is 1...
            if (dayOfWeek >= 1 && dayOfWeek <= 3) { // Mon, Tue, Wed
                dueDate = addDays(postOpDate, 5 - dayOfWeek); // Go to Friday
            } else { // Thu, Fri, Sat, Sun
                dueDate = nextMonday(postOpDate);
            }
          } else if (returnNumber === 2 || returnNumber === 3) { // 2nd, 3rd returns (weekly)
             // This assumes previous returns were calculated correctly
             // A more robust solution would fetch the date of the PREVIOUS return from history
             dueDate = addDays(lastCompletedDate, 7); 
          } else if (returnNumber === 4) { // 4th return (after 14 days)
             dueDate = addDays(lastCompletedDate, 14);
          } else if (returnNumber === 5) { // 5th return (30 days total)
             dueDate = addDays(lastCompletedDate, 30);
          } else { // 6th return
             dueDate = addDays(surgeryDate, 180); // 6 months
          }
          break;
        default:
          return 'Lógica não definida';
      }
      return format(dueDate, 'dd/MM/yyyy');
    } catch(e) {
      return 'Data Inválida';
    }
  };

  if (!journey || !stage) {
      return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl text-blue-400">{stage.name}</DialogTitle>
          <DialogDescription className="text-slate-400 pt-1">
            Checklist de tarefas para {journey.patient_name}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
            <div className="glass-effect rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">Status Atual</h4>
                <p className="text-sm text-slate-300 mb-3">
                    Aguardando a conclusão das tarefas abaixo para avançar para a próxima etapa.
                </p>
                <div className="flex items-center gap-2 text-sm text-amber-400">
                    <ClockIcon />
                    <span>Prazo: {calculateDueDate()}</span>
                </div>
            </div>
          
            <div className="space-y-3">
            <h4 className="font-semibold text-white">Tarefas Pendentes</h4>
            {stage.checklist?.length > 0 ? (
              stage.checklist.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {item.completed ? (
                      <CheckCircledIcon className="w-5 h-5 text-green-500" />
                    ) : (
                      <CrossCircledIcon className="w-5 h-5 text-yellow-500" />
                    )}
                    <span className={`text-sm ${item.completed ? 'text-slate-400 line-through' : 'text-white'}`}>
                      {item.task}
                    </span>
                  </div>
                  {!item.completed && item.action_link && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 hover:border-blue-500"
                      onClick={() => handleActionClick({ link: item.action_link })}
                    >
                      <Link2Icon className="w-3 h-3 mr-1.5" />
                      Executar
                    </Button>
                  )}
                </motion.div>
              ))
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">Nenhuma tarefa específica para esta etapa.</p>
            )}
            </div>
            <div className="flex justify-end pt-2">
                <DialogClose asChild>
                    <Button variant="ghost" className="text-slate-400 hover:bg-slate-700">Fechar</Button>
                </DialogClose>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StageChecklistModal;
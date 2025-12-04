import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChartIcon,
  ClockIcon,
  CheckCircledIcon,
  PersonIcon,
  CalendarIcon,
  HeartIcon,
  ReaderIcon,
  ChatBubbleIcon,
  MixerHorizontalIcon,
  PlusCircledIcon,
  MinusCircledIcon
} from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import EvolutionModal from './EvolutionModal';
import EvolutionHistoryModal from './EvolutionHistoryModal';
import { differenceInDays, format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { getPatientEvolutionHistory } from '@/services/api/evolution';
import { useAuth } from '@/contexts/AuthContext';

const getStatusConfig = (status) => {
  switch (status) {
    case 'monitoring':
      return { label: 'Acompanhamento', color: 'status-monitoring', icon: HeartIcon };
    case 'stable':
      return { label: 'Estável', color: 'status-stable', icon: CheckCircledIcon };
    case 'pending':
      return { label: 'Pendente', color: 'status-pending', icon: PersonIcon };
    default:
      return { label: 'Desconhecido', color: 'bg-gray-500', icon: PersonIcon };
  }
};

const InfoPill = ({ icon: Icon, label, value }) => (
    <div className="text-center p-3 bg-slate-800/60 rounded-lg">
        <Icon className="w-5 h-5 text-blue-400 mx-auto mb-2" />
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm font-medium text-white">{value || 'N/A'}</p>
    </div>
);

const EvolutionPatientCard = ({ patient, index, onSaveEvolution }) => {
  const { toast } = useToast();
  const { user, session } = useAuth();
  const statusConfig = getStatusConfig(patient.status);
  const StatusIcon = statusConfig.icon;
  const daysPostOp = differenceInDays(new Date(), new Date(patient.surgeryDate));
  
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const handleHistoryClick = async () => {
    if (!session) {
        toast({ variant: 'destructive', title: 'Erro de Autenticação' });
        return;
    }
    setIsLoadingHistory(true);
    try {
      const response = await getPatientEvolutionHistory(patient.id, session.access_token);
      setHistory(response.data || []);
      setIsHistoryModalOpen(true);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao buscar histórico',
        description: error.message || 'Não foi possível carregar o histórico do paciente.',
      });
    } finally {
      setIsLoadingHistory(false);
    }
  };

  return (
    <>
      <motion.div
        key={patient.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="glass-effect rounded-xl p-6 flex flex-col justify-between hover:bg-slate-700/30 transition-all duration-300"
      >
        <div>
          <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{patient.name}</h3>
                  <p className="text-sm text-slate-400">{patient.procedure} - {daysPostOp} DPO</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color} text-white flex items-center gap-2`}>
                  <StatusIcon className="w-3 h-3" />
                  <span>{statusConfig.label}</span>
              </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <InfoPill icon={MixerHorizontalIcon} label="Peso" value={patient.vitals.weight ? `${patient.vitals.weight} kg` : null} />
              <InfoPill icon={PlusCircledIcon} label="Edema" value={patient.vitals.edema} />
              <InfoPill icon={MinusCircledIcon} label="Dreno" value={patient.vitals.drainVolume ? `${patient.vitals.drainVolume} ml` : null} />
              <InfoPill icon={HeartIcon} label="Dor" value={patient.vitals.painScale ? `${patient.vitals.painScale[0]}/10` : null} />
          </div>

          <div className="mb-4 space-y-3">
            <div>
                  <p className="text-xs text-slate-400 mb-1 flex items-center gap-2"><ReaderIcon/> Ferida Operatória</p>
                  <p className="text-sm text-white bg-slate-800/50 p-2 rounded-md">{patient.woundState || 'Não registrado.'}</p>
            </div>
            <div>
                  <p className="text-xs text-slate-400 mb-1 flex items-center gap-2"><ChatBubbleIcon/> Queixa da Paciente</p>
                  <p className="text-sm text-white bg-slate-800/50 p-2 rounded-md">{patient.complaint || 'Sem queixas.'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                  <div className="flex items-center gap-2 mb-1">
                      <CalendarIcon className="w-4 h-4 text-slate-400" />
                      <span className="text-xs text-slate-400">Última Evolução</span>
                  </div>
                  <p className="text-sm text-white">{format(new Date(patient.lastEvolution), 'dd/MM/yyyy')}</p>
              </div>
              <div>
                  <div className="flex items-center gap-2 mb-1">
                      <ClockIcon className="w-4 h-4 text-slate-400" />
                      <span className="text-xs text-slate-400">Próximo Retorno</span>
                  </div>
                  <p className="text-sm text-white">{format(new Date(patient.nextAppointment), 'dd/MM/yyyy')}</p>
              </div>
          </div>
        </div>

        <div className="flex gap-2 mt-auto">
          <EvolutionModal patient={patient} onSave={onSaveEvolution} />
          <Button 
            size="sm" 
            variant="outline" 
            className="border-slate-600 hover:border-purple-500 flex-1" 
            onClick={handleHistoryClick}
            disabled={isLoadingHistory}
          >
            <BarChartIcon className="w-3 h-3 mr-1" />
            {isLoadingHistory ? 'Carregando...' : 'Histórico'}
          </Button>
        </div>
      </motion.div>
      <EvolutionHistoryModal 
        isOpen={isHistoryModalOpen} 
        onClose={() => setIsHistoryModalOpen(false)}
        patient={patient}
        history={history}
      />
    </>
  );
};

export default EvolutionPatientCard;
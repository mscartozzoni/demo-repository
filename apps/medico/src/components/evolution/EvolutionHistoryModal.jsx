import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ReaderIcon, ChatBubbleIcon, OpacityIcon, MixerHorizontalIcon, HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const getStatusConfig = (status) => {
    switch (status) {
      case 'monitoring':
        return { label: 'Acompanhamento', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
      case 'stable':
        return { label: 'Estável', color: 'bg-green-500/20 text-green-400 border-green-500/30' };
      case 'pending':
        return { label: 'Pendente', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
      default:
        return { label: 'Desconhecido', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
    }
  };

const EvolutionHistoryModal = ({ isOpen, onClose, patient, history }) => {
    if (!patient) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-slate-900 border-slate-700 max-w-4xl text-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Histórico de Evolução: {patient.name}</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Visualizando {history.length} registro(s) para {patient.procedure}.
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4 max-h-[60vh] overflow-y-auto pr-4 space-y-8">
                    {history && history.length > 0 ? history.map((entry) => {
                       const statusConfig = getStatusConfig(entry.status);
                       return (
                        <div key={entry.id} className="relative pl-8">
                            <div className="absolute left-0 top-1.5 flex items-center justify-center w-8">
                                <span className="absolute h-full w-0.5 bg-slate-700 top-2"></span>
                                <div className="z-10 bg-blue-500 rounded-full h-4 w-4 border-2 border-slate-900"></div>
                            </div>
                            
                            <div className="ml-4">
                                <div className="flex items-center gap-4 mb-2">
                                    <h3 className="font-semibold text-lg text-white">
                                        {format(parseISO(entry.evolution_date), "d 'de' MMMM, yyyy", { locale: ptBR })}
                                    </h3>
                                    <span className="text-sm text-slate-400">({entry.days_post_op} DPO)</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                                        {statusConfig.label}
                                    </span>
                                </div>
                                <div className="glass-effect p-4 rounded-lg">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        <InfoCard icon={MixerHorizontalIcon} label="Peso" value={entry.vitals.weight ? `${entry.vitals.weight} kg` : 'N/A'} />
                                        <InfoCard icon={HeartFilledIcon} label="Edema" value={entry.vitals.edema || 'N/A'} />
                                        <InfoCard icon={OpacityIcon} label="Dreno" value={entry.vitals.drainVolume ? `${entry.vitals.drainVolume} ml` : 'N/A'} />
                                        <InfoCard icon={HeartIcon} label="Dor" value={entry.vitals.painScale ? `${entry.vitals.painScale[0]}/10` : 'N/A'} />
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm font-medium text-slate-300 mb-1 flex items-center gap-2"><ReaderIcon /> Estado da Ferida</p>
                                            <p className="text-sm text-slate-400">{entry.wound_state || 'Não registrado.'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-300 mb-1 flex items-center gap-2"><ChatBubbleIcon /> Queixa do Paciente</p>
                                            <p className="text-sm text-slate-400">{entry.complaint || 'Sem queixas.'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                       )
                    }) : (
                        <div className="text-center py-10">
                            <p className="text-slate-400">Nenhum histórico de evolução encontrado para este paciente.</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

const InfoCard = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-2 bg-slate-800/50 p-2 rounded-md">
        <Icon className="w-4 h-4 text-blue-400" />
        <div>
            <p className="text-xs text-slate-400">{label}</p>
            <p className="text-sm font-semibold text-white">{value}</p>
        </div>
    </div>
);

export default EvolutionHistoryModal;
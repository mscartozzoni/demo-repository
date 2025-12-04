import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { User, CheckCircle, Clock, AlertTriangle, ChevronDown, PlusCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import EditStageDialog from '@/components/journey/EditStageDialog';
import { useApi } from '@/contexts/ApiContext';
import { useToast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

const ProgressNotesPopover = ({ notes }) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-white">
        <MessageSquare className="w-4 h-4" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-64 glass-effect p-2">
      <h4 className="text-sm font-semibold mb-2 px-2">Notas de Progresso</h4>
      <ScrollArea className="h-40">
        <div className="space-y-2 p-1">
          {notes && notes.length > 0 ? (
            notes.map(note => (
              <div key={note.id} className="text-xs p-2 bg-slate-800/50 rounded-md">
                <p className="font-semibold text-slate-300">{note.description}</p>
                <p className="text-slate-400 mt-1">
                  - {note.responsible_professional.split('@')[0]} em {new Date(note.evolution_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            ))
          ) : (
            <p className="text-xs text-center text-slate-400 py-4">Nenhuma nota.</p>
          )}
        </div>
      </ScrollArea>
    </PopoverContent>
  </Popover>
);

const StageItem = ({ stage, onEditClick, onAddNoteClick }) => {
  const getStatusInfo = (status) => {
    const now = new Date();
    const isDelayed = status !== 'completed' && stage.due_date && new Date(stage.due_date) < now;

    if (isDelayed) return { icon: <AlertTriangle className="w-4 h-4 text-red-400" />, color: 'text-red-300' };

    switch (status) {
      case 'completed': return { icon: <CheckCircle className="w-4 h-4 text-green-400" />, color: 'text-green-300 line-through' };
      case 'in_progress': return { icon: <Clock className="w-4 h-4 text-blue-400" />, color: 'text-blue-300' };
      case 'pending': return { icon: <Clock className="w-4 h-4 text-yellow-400" />, color: 'text-yellow-300' };
      default: return { icon: <Clock className="w-4 h-4 text-gray-400" />, color: 'text-gray-400' };
    }
  };
  const statusInfo = getStatusInfo(stage.status);
  const noteCount = stage.progress_notes?.length || 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="group p-2 rounded-lg hover:bg-white/5 flex items-center justify-between transition-all"
    >
      <div className="flex items-center gap-3 cursor-pointer flex-1 min-w-0" onClick={() => onEditClick(stage)}>
        {statusInfo.icon}
        <span className={`font-medium ${statusInfo.color} truncate`}>{stage.stage_name}</span>
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {noteCount > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-400">{noteCount}</span>
            <ProgressNotesPopover notes={stage.progress_notes} />
          </div>
        )}
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onAddNoteClick(stage)}>
          <PlusCircle className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

const PatientJourneyCard = ({ journey, onUpdateStage, onAddStage, onRefreshJourneys }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);
  const { toast } = useToast();

  const nextAction = useMemo(() => {
    if (!journey || !journey.stages) return null;
    const sortedStages = [...journey.stages].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    const pending = sortedStages.find(s => s.status === 'pending');
    if (pending) return pending;
    const inProgress = sortedStages.find(s => s.status === 'in_progress');
    if (inProgress) return inProgress;
    return null;
  }, [journey]);

  const cardStatus = useMemo(() => {
    if (!journey) return { text: 'Carregando...', color: 'border-gray-500/50' };
    if (journey.status === 'completed') return { text: 'Concluída', color: 'border-green-500/50' };

    const now = new Date();
    const isDelayed = journey.stages.some(s => s.status !== 'completed' && s.due_date && new Date(s.due_date) < now);

    if (isDelayed) return { text: 'Atrasada', color: 'border-red-500/50' };
    if (journey.stages.some(s => s.status === 'pending')) return { text: 'Pendente', color: 'border-yellow-500/50' };
    return { text: 'Em Progresso', color: 'border-blue-500/50' };
  }, [journey]);

  const handleEditClick = (stage) => {
    setSelectedStage(stage);
    setIsEditDialogOpen(true);
  };

  const handleAddNewClick = () => {
    setSelectedStage(null);
    setIsEditDialogOpen(true);
  };

  const handleAddNoteClick = (stage) => {
    setSelectedStage(stage);
    setIsEditDialogOpen(true);
  };

  const handleSaveStage = async (updatedData) => {
    if (selectedStage && selectedStage.id) {
      await onUpdateStage(selectedStage.id, updatedData);
    } else {
      await onAddStage(journey.id, updatedData);
    }
    setIsEditDialogOpen(false);
    setSelectedStage(null);
  };

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -5 }}
      >
        <Card className={`card-hover border-l-4 ${cardStatus.color} overflow-hidden`}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="w-5 h-5 text-cyan-400" />
                  {journey.patient?.full_name || 'Paciente não encontrado'}
                </CardTitle>
                <CardDescription>{cardStatus.text}</CardDescription>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shrink-0">
                <span className="text-lg font-bold">{journey.patient?.full_name?.charAt(0) || '?'}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {nextAction ? (
              <div className="bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/30 mb-4">
                <p className="text-sm font-bold text-yellow-300">Próxima Ação Sugerida:</p>
                <p className="text-sm text-white">{nextAction.stage_name}</p>
                {nextAction.due_date && <p className="text-xs text-yellow-400">Prazo: {new Date(nextAction.due_date).toLocaleDateString('pt-BR')}</p>}
              </div>
            ) : (
              <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/30 mb-4">
                <p className="text-sm font-bold text-green-300">Jornada em dia!</p>
                <p className="text-sm text-white">Nenhuma ação pendente ou em andamento.</p>
              </div>
            )}

            <AnimatePresence>
              <motion.div layout className="space-y-1">
                {journey.stages && journey.stages
                  .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                  .slice(0, isExpanded ? journey.stages.length : 3)
                  .map(stage => (
                    <StageItem key={stage.id} stage={stage} onEditClick={handleEditClick} onAddNoteClick={handleAddNoteClick} />
                  ))}
              </motion.div>
            </AnimatePresence>

            <div className="mt-4 flex justify-between items-center">
              <DialogTrigger asChild>
                <Button size="sm" variant="ghost" onClick={handleAddNewClick}>
                  <PlusCircle className="w-4 h-4 mr-2" /> Adicionar Etapa
                </Button>
              </DialogTrigger>
              {journey.stages && journey.stages.length > 3 && (
                <Button size="sm" variant="ghost" onClick={() => setIsExpanded(!isExpanded)}>
                  {isExpanded ? 'Ver menos' : `Ver mais ${journey.stages.length - 3}`}
                  <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <EditStageDialog
        stage={selectedStage}
        patientId={journey.patient.id}
        onSave={handleSaveStage}
        onClose={() => setIsEditDialogOpen(false)}
        onRefreshJourneys={onRefreshJourneys}
      />
    </Dialog>
  );
};

export default PatientJourneyCard;
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { getJourneys, updateStageStatus, getJourneyByPatientId } from '@/services/api/journeys';
import { sendEmail } from '@/services/api/communication.js';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Clock, Play, Circle, Plus, MessageCircle, FileText, Users, ArrowLeft } from 'lucide-react';
import StageChecklistModal from '@/components/journey/StageChecklistModal';
import CommunicationModal from '@/components/journey/CommunicationModal';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';

const stageIcons = {
    completed: <Check className="w-4 h-4 text-green-400" />,
    active: <Play className="w-4 h-4 text-blue-400 animate-pulse" />,
    upcoming: <Clock className="w-4 h-4 text-slate-400" />,
    skipped: <Circle className="w-4 h-4 text-slate-500" />,
};

const stageColors = {
    completed: 'border-green-500/50 bg-green-500/10',
    active: 'border-blue-500/50 bg-blue-500/10',
    upcoming: 'border-slate-700/50 bg-slate-800/20',
    skipped: 'border-slate-800/50 bg-slate-900/50',
};

const Journey = () => {
    const { id: patientId } = useParams();
    const { toast } = useToast();
    const { profile } = useAuth();
    const [allJourneys, setAllJourneys] = useState([]);
    const [selectedJourney, setSelectedJourney] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isChecklistModalOpen, setChecklistModalOpen] = useState(false);
    const [isCommunicationModalOpen, setCommunicationModalOpen] = useState(false);
    const [currentStage, setCurrentStage] = useState(null);
    const [communicationMode, setCommunicationMode] = useState('email');

    const fetchJourneys = useCallback(async () => {
        setLoading(true);
        try {
            if (patientId) {
                const response = await getJourneyByPatientId(patientId);
                if (response.success && response.data) {
                    setSelectedJourney(response.data);
                    // To keep the dropdown populated, we still fetch all journeys in background
                    getJourneys().then(res => res.success && setAllJourneys(res.data));
                } else {
                    throw new Error(response.error?.message || "Jornada do paciente não encontrada.");
                }
            } else {
                const response = await getJourneys();
                if (response.success) {
                    setAllJourneys(response.data);
                    if(response.data.length > 0 && !selectedJourney) {
                        setSelectedJourney(response.data[0]);
                    }
                } else {
                    throw new Error(response.error.message);
                }
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Erro ao buscar jornadas', description: error.message });
        } finally {
            setLoading(false);
        }
    }, [patientId, toast, selectedJourney]);


    useEffect(() => {
        fetchJourneys();
    }, [fetchJourneys]);

    const handleStageStatusChange = async (journeyId, stageId, newStatus) => {
        const originalJourney = JSON.parse(JSON.stringify(selectedJourney));
        const originalStage = originalJourney.stages.find(s => s.id === stageId);

        if (originalStage.status === newStatus) return;

        // Optimistic UI update
        const updatedJourney = {
            ...selectedJourney,
            stages: selectedJourney.stages.map(s => s.id === stageId ? { ...s, status: newStatus } : s)
        };
        setSelectedJourney(updatedJourney);

        try {
            await updateStageStatus(journeyId, stageId, newStatus);
            toast({ title: 'Status da etapa atualizado!', className: 'bg-green-600 text-white' });
            
            if (newStatus === 'completed' && selectedJourney?.patient_email) {
                const emailBody = `
                    <p>Olá ${selectedJourney.patient_name},</p>
                    <p>Parabéns por concluir a etapa "<strong>${originalStage.name}</strong>" da sua jornada!</p>
                    <p>Estamos muito felizes com o seu progresso.</p>
                    <p>Atenciosamente,<br/>Equipe ${profile.full_name || 'do Portal Médico'}</p>
                `;
                await sendEmail({
                    patientEmail: selectedJourney.patient_email,
                    subject: `Você concluiu uma nova etapa da sua jornada!`,
                    body: emailBody,
                    fromName: profile.full_name,
                });
                toast({ title: 'Paciente notificado!', description: 'Um e-mail de parabéns foi enviado.' });
            }
            // No need to full-refresh, optimistic update is fine for this action.
        } catch (error) {
            toast({ variant: 'destructive', title: 'Erro ao atualizar status', description: error.message });
            setSelectedJourney(originalJourney); // Revert on error
        }
    };
    
    const handleSelectJourney = (journeyId) => {
        const journey = allJourneys.find(j => j.id === journeyId);
        setSelectedJourney(journey);
    };

    const openChecklistModal = (stage) => {
        setCurrentStage(stage);
        setChecklistModalOpen(true);
    };
    
    const openCommunicationModal = (stage, mode) => {
        setCurrentStage(stage);
        setCommunicationMode(mode);
        setCommunicationModalOpen(true);
    };

    return (
        <>
            <Helmet>
                <title>Jornada do Paciente - Portal do Médico</title>
                <meta name="description" content="Acompanhe a jornada de cada paciente, etapa por etapa." />
            </Helmet>

            {currentStage && selectedJourney && (
              <>
                <StageChecklistModal 
                    isOpen={isChecklistModalOpen} 
                    onClose={() => setChecklistModalOpen(false)} 
                    journey={selectedJourney}
                    stage={currentStage}
                />
                <CommunicationModal
                    isOpen={isCommunicationModalOpen}
                    onClose={() => setCommunicationModalOpen(false)}
                    patient={selectedJourney}
                    mode={communicationMode}
                    onSent={() => console.log('Communication sent!')}
                />
              </>
            )}

            <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                     <div>
                        {patientId && (
                             <Link to={`/medico/patients/${patientId}/caderno`}>
                                <Button variant="outline" className="mb-2 border-slate-600">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Voltar para o Prontuário
                                </Button>
                            </Link>
                        )}
                        <h1 className="text-3xl font-bold text-white">Jornada do Paciente</h1>
                        <p className="text-slate-400 mt-2">Acompanhe o progresso e interaja com seus pacientes.</p>
                    </div>
                    {!patientId && (
                        <div className="w-full md:w-auto flex items-center gap-2">
                            {allJourneys.length > 0 && (
                                <Select onValueChange={handleSelectJourney} value={selectedJourney?.id}>
                                    <SelectTrigger className="w-full md:w-[250px] bg-slate-800 border-slate-700">
                                        <SelectValue placeholder="Selecione um paciente..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {allJourneys.map(journey => (
                                            <SelectItem key={journey.id} value={journey.id}>{journey.patient_name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                            <Button variant="outline" onClick={() => toast({ title: 'Funcionalidade não implementada.' })}>
                                <Plus className="w-4 h-4 mr-2" /> Novo Protocolo
                            </Button>
                        </div>
                    )}
                </div>

                {loading ? (
                    <p className="text-slate-400 text-center py-10">Carregando jornada do paciente...</p>
                ) : selectedJourney ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-effect p-6 rounded-xl">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src={`https://i.pravatar.cc/150?u=${selectedJourney.patient_id}`} alt={selectedJourney.patient_name} />
                                  <AvatarFallback>{selectedJourney.patient_name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="text-xl font-semibold text-white">{selectedJourney.patient_name}</h2>
                                    <p className="text-sm text-slate-300">{selectedJourney.protocol_name}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-slate-300 text-sm">Progresso</p>
                                <p className="text-white font-bold">{selectedJourney.current_stage} de {selectedJourney.total_stages} etapas</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {selectedJourney.stages.map((stage, index) => (
                                <motion.div
                                    key={stage.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className={`p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${stageColors[stage.status]}`}
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        {stage.image_url && (
                                            <img src={stage.image_url} alt={stage.name} className="w-24 h-16 object-cover rounded-md hidden sm:block" />
                                        )}
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                {stageIcons[stage.status]}
                                                <span className="font-semibold text-white">{stage.name}</span>
                                            </div>
                                            <p className="text-xs text-slate-400">Vencimento: {new Date(stage.due_date).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
                                        <Button variant="ghost" size="sm" onClick={() => openChecklistModal(stage)}>
                                            <FileText className="w-4 h-4 mr-2" /> Checklist
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => openCommunicationModal(stage, 'email')}>
                                            <MessageCircle className="w-4 h-4 mr-2" /> Comunicar
                                        </Button>
                                        <Select
                                            value={stage.status}
                                            onValueChange={(newStatus) => handleStageStatusChange(selectedJourney.id, stage.id, newStatus)}
                                        >
                                            <SelectTrigger className="w-[130px] text-xs h-8 bg-slate-800 border-slate-700">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="completed">Concluído</SelectItem>
                                                <SelectItem value="active">Ativo</SelectItem>
                                                <SelectItem value="upcoming">Pendente</SelectItem>
                                                <SelectItem value="skipped">Pular</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <div className="text-center py-12">
                        <div className="glass-effect rounded-xl p-8 max-w-md mx-auto">
                            <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-white mb-2">Nenhuma jornada encontrada</h3>
                            <p className="text-slate-400">
                                {patientId ? "Este paciente ainda não iniciou uma jornada." : "Não há jornadas de paciente para exibir."}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Journey;
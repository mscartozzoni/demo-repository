import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useApi } from '@/contexts/ApiContext';
import { Loader2, User, Mail, Phone, Calendar, ArrowLeft, Briefcase, FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const StatCard = ({ icon, label, value }) => (
    <div className="glass-effect p-4 rounded-lg flex items-center gap-4">
        {icon}
        <div>
            <p className="text-sm text-gray-400">{label}</p>
            <p className="font-bold text-lg">{value}</p>
        </div>
    </div>
);

const TimelineItem = ({ icon, title, date, children, isLast }) => (
    <div className="relative pl-8">
        <div className="absolute left-0 top-1 flex items-center justify-center w-8 h-8 bg-slate-800 rounded-full">
            {icon}
        </div>
        {!isLast && <div className="absolute left-4 top-10 bottom-0 w-px bg-slate-700"></div>}
        <div className="mb-8">
            <p className="font-semibold text-white">{title}</p>
            <p className="text-sm text-gray-400">{new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            <div className="mt-2 text-sm text-gray-300 space-y-1">
                {children}
            </div>
        </div>
    </div>
);

const PatientDetails = () => {
    const { patientId } = useParams();
    const { getPatientDetails, loading } = useApi();
    const [patient, setPatient] = useState(null);

    const fetchPatientDetails = useCallback(async () => {
        const data = await getPatientDetails(patientId);
        setPatient(data);
    }, [getPatientDetails, patientId]);

    useEffect(() => {
        fetchPatientDetails();
    }, [fetchPatientDetails]);

    const getJourneyStatusProps = (journey) => {
        if (!journey) return { variant: 'outline', text: 'Sem Jornada' };
        if (journey.status === 'completed') return { variant: 'success', text: 'Concluída' };
        
        const now = new Date();
        const hasDelayedStage = journey.stages.some(s => s.status !== 'completed' && s.due_date && new Date(s.due_date) < now);
        if (hasDelayedStage) return { variant: 'destructive', text: 'Atrasada' };

        return { variant: 'warning', text: 'Em Progresso' };
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="text-center">
                <h1 className="text-2xl font-bold">Paciente não encontrado</h1>
                <Link to="/admin/secretaria/pacientes" className="text-blue-400 hover:underline mt-4 inline-block">
                    Voltar para a lista de pacientes
                </Link>
            </div>
        );
    }
    
    const journeyStatus = getJourneyStatusProps(patient.journey);

    return (
        <>
            <Helmet>
                <title>{`Detalhes de ${patient.full_name} - Portal Clínico`}</title>
            </Helmet>

            <div className="space-y-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <Link to="/admin/secretaria/pacientes" className="flex items-center gap-2 text-sm text-blue-400 hover:underline mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para Pacientes
                    </Link>
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div>
                            <h1 className="text-3xl font-bold gradient-text">{patient.full_name}</h1>
                            <p className="text-gray-400 mt-1">Histórico completo e jornada do paciente.</p>
                        </div>
                        <Badge variant={journeyStatus.variant}>{journeyStatus.text}</Badge>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Coluna Esquerda - Informações e Métricas */}
                    <motion.div className="lg:col-span-1 space-y-6" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                        <Card className="card-hover">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><User className="text-cyan-400" /> Informações Pessoais</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /> {patient.email}</p>
                                <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> {patient.phone}</p>
                                {patient.cpf && <p className="flex items-center gap-2"><FileText className="w-4 h-4 text-gray-400" /> CPF: {patient.cpf}</p>}
                                <p className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-gray-400" /> Status: <span className={`font-semibold ${patient.status === 'active' ? 'text-green-400' : 'text-gray-400'}`}>{patient.status === 'active' ? 'Ativo' : 'Inativo'}</span></p>
                            </CardContent>
                        </Card>
                        <StatCard icon={<Calendar className="text-green-400 w-8 h-8" />} label="Primeiro Contato" value={patient.firstContactDate ? new Date(patient.firstContactDate).toLocaleDateString('pt-BR') : 'N/A'} />
                        <StatCard icon={<Calendar className="text-purple-400 w-8 h-8" />} label="Última Interação" value={patient.lastInteractionDate ? new Date(patient.lastInteractionDate).toLocaleDateString('pt-BR') : 'N/A'} />
                    </motion.div>

                    {/* Coluna Direita - Jornada */}
                    <motion.div className="lg:col-span-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                         <Card className="card-hover">
                            <CardHeader>
                                <CardTitle>Jornada do Paciente</CardTitle>
                                {patient.journey ? <CardDescription>{patient.journey.title}</CardDescription> : <CardDescription>Nenhuma jornada iniciada para este paciente.</CardDescription>}
                            </CardHeader>
                            <CardContent>
                                {patient.journey?.stages.length > 0 ? (
                                    patient.journey.stages.map((stage, index) => {
                                        const statusIcon = stage.status === 'completed' ? <CheckCircle className="text-green-400 w-5 h-5"/> : <Clock className="text-yellow-400 w-5 h-5"/>;
                                        return (
                                            <TimelineItem key={stage.id} icon={statusIcon} title={stage.name || stage.stage_name} date={stage.created_at} isLast={index === patient.journey.stages.length - 1}>
                                                <p><span className="font-semibold">Status:</span> {stage.status}</p>
                                                {stage.notes && <p><span className="font-semibold">Notas:</span> {stage.notes}</p>}
                                                {stage.completed_at && <p><span className="font-semibold">Concluído em:</span> {new Date(stage.completed_at).toLocaleDateString('pt-BR')}</p>}
                                            </TimelineItem>
                                        )
                                    })
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-400">Nenhuma etapa na jornada ainda.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default PatientDetails;
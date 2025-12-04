
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useApi } from '@/contexts/ApiContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2, User, Calendar, FileText, Clock, FileBadge } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AppointmentCard = ({ appointment, isUpcoming = false }) => (
    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-start gap-4">
        <div className={`p-3 rounded-full ${isUpcoming ? 'bg-blue-500/20' : 'bg-slate-600/20'}`}>
            <Calendar className={`w-5 h-5 ${isUpcoming ? 'text-blue-300' : 'text-slate-400'}`} />
        </div>
        <div>
            <p className="font-semibold text-white capitalize">{appointment.visit_type}</p>
            <p className="text-sm text-slate-300 capitalize">{format(new Date(appointment.start_at), "eeee, dd 'de' MMMM, 'às' HH:mm", { locale: ptBR })}</p>
            {isUpcoming && <p className="text-xs text-slate-400 mt-1">{appointment.location}</p>}
        </div>
    </div>
);

const DocumentItem = ({ doc }) => (
    <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
            <FileBadge className="w-5 h-5 text-green-400 flex-shrink-0" />
            <div className="overflow-hidden">
                <p className="font-medium text-white text-sm truncate">{doc.title}</p>
                <p className="text-xs text-slate-400 capitalize">{doc.type}</p>
            </div>
        </div>
        <p className="text-xs text-slate-400 flex-shrink-0">{format(new Date(doc.date), 'dd/MM/yyyy')}</p>
    </div>
);


const PatientDashboard = () => {
    const { getPatientDataForPortal, loading } = useApi();
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const data = await getPatientDataForPortal();
            setDashboardData(data);
        };
        fetchData();
    }, [getPatientDataForPortal]);

    if (loading || !dashboardData) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
            </div>
        );
    }
    
    const { upcomingAppointments, pastAppointments, documents, profile } = dashboardData;
    
    return (
        <>
            <Helmet>
                <title>Portal do Paciente - Início</title>
                <meta name="description" content="Seu portal pessoal para agendamentos e informações." />
            </Helmet>
            <div className="space-y-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <h1 className="text-3xl font-bold">Olá, <span className="gradient-text">{profile.full_name.split(' ')[0]}</span>!</h1>
                    <p className="text-slate-400 mt-1">Bem-vindo(a) de volta ao seu portal do paciente.</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Coluna Principal */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                            <Card className="floating-card">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="flex items-center gap-2"><Calendar className="text-blue-400" />Próximos Agendamentos</CardTitle>
                                    <Button variant="link" onClick={() => navigate('/dashboard/paciente/agendamentos')}>Ver todos</Button>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {upcomingAppointments.length > 0 ? (
                                        upcomingAppointments.map(apt => <AppointmentCard key={apt.id} appointment={apt} isUpcoming />)
                                    ) : (
                                        <p className="text-slate-400 text-center py-4">Nenhum agendamento futuro encontrado.</p>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                            <Card className="floating-card">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="flex items-center gap-2"><FileText className="text-green-400" />Documentos Recentes</CardTitle>
                                    <Button variant="link" onClick={() => navigate('/dashboard/paciente/documentos')}>Ver todos</Button>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {documents.length > 0 ? (
                                        documents.map(doc => <DocumentItem key={doc.id} doc={doc} />)
                                    ) : (
                                        <p className="text-slate-400 text-center py-4">Nenhum documento encontrado.</p>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Coluna Lateral */}
                    <div className="space-y-6">
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                             <Card className="floating-card">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="flex items-center gap-2"><User className="text-purple-400" />Resumo do Perfil</CardTitle>
                                    <Button variant="link" onClick={() => navigate('/dashboard/paciente/perfil')}>Editar</Button>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <div>
                                        <p className="font-semibold text-white">{profile.full_name}</p>
                                        <p className="text-slate-400">{profile.email}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">Contato de Emergência</p>
                                        <p className="text-slate-400">{profile.emergency_contact_name || 'Não informado'}</p>
                                        <p className="text-slate-400">{profile.emergency_contact_phone || ''}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                        
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                             <Card className="floating-card">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="flex items-center gap-2"><Clock className="text-slate-400" />Consultas Recentes</CardTitle>
                                    <Button variant="link" onClick={() => navigate('/dashboard/paciente/historico')}>Ver histórico</Button>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     {pastAppointments.length > 0 ? (
                                        pastAppointments.map(apt => <AppointmentCard key={apt.id} appointment={apt} />)
                                    ) : (
                                        <p className="text-slate-400 text-center py-4">Nenhuma consulta recente.</p>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default PatientDashboard;


import React, { useMemo, useState, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MessageCircle, FileText, ArrowRight, User } from 'lucide-react';

const PatientPortalScreen = () => {
    const { patientPortalData, patients, loading } = useData();
    const { toast } = useToast();
    const [selectedPatientId, setSelectedPatientId] = useState(null);

    useEffect(() => {
        if (!selectedPatientId && patients && patients.length > 0) {
            setSelectedPatientId(patients[0].id);
        }
    }, [patients, selectedPatientId]);

    const patientData = useMemo(() => {
        if (!patientPortalData || !selectedPatientId) return null;
        return patientPortalData.find(p => p.id === selectedPatientId);
    }, [patientPortalData, selectedPatientId]);

    const handleActionClick = (title) => {
        toast({
            title: "Ação em Breve",
            description: `A funcionalidade para "${title}" será implementada. 🚀`
        });
    };
    
    if (loading) {
        return <div className="text-center p-10">Carregando portal...</div>;
    }
    
    return (
        <>
            <Helmet>
                <title>Portal do Paciente {patientData ? `- ${patientData.full_name}`: ''}</title>
                <meta name="description" content="Seu portal de saúde pessoal. Veja seus agendamentos, mensagens e mais." />
            </Helmet>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold">Portal do Paciente</h1>
                        <p className="text-muted-foreground">Visualize as informações como se fosse o paciente.</p>
                    </div>
                    <div className="w-full md:w-auto">
                        <Select onValueChange={setSelectedPatientId} value={selectedPatientId || ''}>
                            <SelectTrigger className="w-full md:w-[280px]">
                                <User className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Selecione um paciente" />
                            </SelectTrigger>
                            <SelectContent>
                                {patients && patients.map(p => (
                                    <SelectItem key={p.id} value={p.id}>{p.full_name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                
                {!patientData ? (
                    <div className="text-center p-10">Selecione um paciente para ver seu portal.</div>
                ) : (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold">Bem-vindo(a), {patientData.full_name}!</h2>
                            <p className="text-muted-foreground">Acesse rapidamente suas informações de saúde e comunique-se com nossa equipe.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <InfoCard
                                icon={Calendar}
                                iconColor="text-green-500"
                                title="Próximo Agendamento"
                                value={patientData.appointments?.sort((a,b) => new Date(a.date) - new Date(b.date))[0] ? new Date(patientData.appointments[0].date).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' }) : 'Nenhum agendado'}
                                description={patientData.appointments?.[0] ? `Com ${patientData.appointments[0].staff_id}` : 'Agende uma nova consulta.'}
                                actionText="Ver todos agendamentos"
                                onAction={() => handleActionClick("Ver Agendamentos")}
                            />
                            <InfoCard
                                icon={MessageCircle}
                                iconColor="text-blue-500"
                                title="Mensagens Não Lidas"
                                value={`${patientData.messages?.filter(m => !m.from_contact).length || 0} novas mensagens`}
                                description={patientData.messages?.sort((a,b) => new Date(b.created_at) - new Date(a.created_at))[0] ? `Última: ${patientData.messages[0].content.substring(0, 30)}...` : 'Nenhuma mensagem recente'}
                                actionText="Ir para caixa de entrada"
                                onAction={() => handleActionClick("Ver Mensagens")}
                            />
                            <InfoCard
                                icon={FileText}
                                iconColor="text-purple-500"
                                title="Seus Documentos"
                                value={`${patientData.documents?.length || 0} arquivos disponíveis`}
                                description="Resultados de exames e outros documentos."
                                actionText="Ver todos documentos"
                                onAction={() => handleActionClick("Ver Documentos")}
                            />
                        </div>
                        <Card className="glass-effect-soft">
                            <CardHeader>
                                <CardTitle>Ações Rápidas</CardTitle>
                                <CardDescription>O que você gostaria de fazer hoje?</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <ActionButton title="Agendar Consulta" onClick={() => handleActionClick("Agendar Consulta")} />
                                <ActionButton title="Ver Orçamentos" onClick={() => handleActionClick("Ver Orçamentos")} />
                                <ActionButton title="Enviar Mensagem" onClick={() => handleActionClick("Enviar Mensagem")} />
                                <ActionButton title="Atualizar meus Dados" onClick={() => handleActionClick("Atualizar Dados")} />
                            </CardContent>
                        </Card>
                    </div>
                )}
            </motion.div>
        </>
    );
};

const InfoCard = ({ icon: Icon, iconColor, title, value, description, actionText, onAction }) => (
    <Card className="glass-effect-soft flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <Icon className={`h-5 w-5 ${iconColor}`} />
        </CardHeader>
        <CardContent className="flex flex-col flex-grow">
            <div className="text-2xl font-bold text-foreground">{value}</div>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
            <Button variant="link" className="p-0 h-auto mt-auto self-start" onClick={onAction}>
                {actionText} <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
        </CardContent>
    </Card>
);

const ActionButton = ({ title, onClick }) => (
    <Button variant="outline" className="h-20 flex-col gap-2" onClick={onClick}>
        <span>{title}</span>
    </Button>
);

export default PatientPortalScreen;

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useApi } from '@/contexts/ApiContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Calendar, Clock, MapPin, User, Info, XCircle, RotateCw } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AppointmentCard = ({ appointment, onCancel, onReschedule, isPast = false }) => {
    const { toast } = useToast();
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

    const handleReschedule = () => {
        toast({ title: "🚧 Funcionalidade em construção!", description: "Por favor, entre em contato com a clínica para reagendar." });
    };

    return (
        <motion.div
            className="floating-card p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <p className="text-lg font-bold text-white">{appointment.visit_type}</p>
                    <div className="flex items-center gap-2 mt-2 text-slate-300 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(appointment.start_at), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-slate-300 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{format(new Date(appointment.start_at), "HH:mm")} - {format(new Date(appointment.end_at), "HH:mm")}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-slate-300 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{appointment.location || 'Consultório Principal'}</span>
                    </div>
                     <div className="flex items-center gap-2 mt-1 text-slate-300 text-sm">
                        <User className="w-4 h-4" />
                        <span>{appointment.doctor || 'Dr. Carlos Andrade'}</span>
                    </div>
                </div>
                {!isPast && (
                    <div className="flex flex-row sm:flex-col justify-start sm:justify-center gap-2">
                        <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="destructive" size="sm" className="flex items-center gap-2">
                                    <XCircle className="w-4 h-4" /> Cancelar
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Confirmar Cancelamento</DialogTitle>
                                    <DialogDescription>
                                        Tem certeza que deseja cancelar a consulta de {appointment.visit_type} no dia {format(new Date(appointment.start_at), "dd/MM/yyyy")}?
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>Voltar</Button>
                                    <Button variant="destructive" onClick={() => { onCancel(appointment.id); setCancelDialogOpen(false); }}>Sim, cancelar</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Button variant="secondary" size="sm" onClick={handleReschedule} className="flex items-center gap-2">
                           <RotateCw className="w-4 h-4" /> Reagendar
                        </Button>
                    </div>
                )}
            </div>
             {appointment.status === 'cancelado' && (
                <div className="mt-4 p-2 bg-red-900/50 border border-red-500/50 rounded-md text-red-300 text-sm flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    <span>Este agendamento foi cancelado.</span>
                </div>
            )}
        </motion.div>
    );
};

const PatientAppointments = () => {
    const { getPatientAppointmentsForPortal, updateAppointmentStatus, loading } = useApi();
    const { toast } = useToast();
    const [appointments, setAppointments] = useState({ upcoming: [], past: [] });
    
    const fetchAppointments = async () => {
        const data = await getPatientAppointmentsForPortal();
        if (data) setAppointments(data);
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleCancel = async (appointmentId) => {
        try {
            await updateAppointmentStatus(appointmentId, 'cancelado');
            toast({ title: "Agendamento cancelado com sucesso!" });
            fetchAppointments(); // Refresh the list
        } catch (error) {
            toast({ variant: 'destructive', title: "Erro ao cancelar agendamento." });
        }
    };
    
    if (loading && !appointments.upcoming.length && !appointments.past.length) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="w-16 h-16 animate-spin text-blue-500" /></div>;
    }

    return (
        <>
            <Helmet><title>Meus Agendamentos</title></Helmet>
            <div className="space-y-6">
                <motion.h1 className="text-3xl font-bold gradient-text" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    Meus Agendamentos
                </motion.h1>

                <Tabs defaultValue="upcoming">
                    <TabsList className="grid w-full grid-cols-2 max-w-md">
                        <TabsTrigger value="upcoming">Próximos</TabsTrigger>
                        <TabsTrigger value="past">Histórico</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upcoming" className="space-y-4 mt-6">
                        {appointments.upcoming.length > 0 ? (
                            appointments.upcoming.map(apt => (
                                <AppointmentCard key={apt.id} appointment={apt} onCancel={handleCancel} onReschedule={()=>{}} />
                            ))
                        ) : <p className="text-center py-10 text-slate-400">Nenhum agendamento futuro.</p>}
                    </TabsContent>
                    <TabsContent value="past" className="space-y-4 mt-6">
                         {appointments.past.length > 0 ? (
                            appointments.past.map(apt => (
                                <AppointmentCard key={apt.id} appointment={apt} isPast />
                            ))
                        ) : <p className="text-center py-10 text-slate-400">Nenhum agendamento passado.</p>}
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
};

export default PatientAppointments;
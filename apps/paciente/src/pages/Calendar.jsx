
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, PlusCircle, BrainCircuit, ChevronLeft, ChevronRight, User, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import AppointmentForm from '@/components/calendar/AppointmentForm';
import { useApi } from '@/contexts/ApiContext';
import { useToast } from '@/components/ui/use-toast';
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import TodaysAgenda from '@/components/dashboard/TodaysAgenda';
import AppointmentDetails from '@/components/calendar/AppointmentDetails';
import SurgeryModal from '@/components/calendar/SurgeryModal';

const Calendar = () => {
    const { getAppointmentsForDay, getAppointmentsForWeek, loading: apiLoading, updateAppointmentStatus, getSuggestedTime } = useApi();
    const { toast } = useToast();
    const [view, setView] = useState('day');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [isAppointmentFormOpen, setIsAppointmentFormOpen] = useState(false);
    const [isSurgeryModalOpen, setIsSurgeryModalOpen] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    
    const fetchAppointments = useCallback(async () => {
        let data;
        if (view === 'day') {
            const dateStr = format(selectedDate, 'yyyy-MM-dd');
            data = await getAppointmentsForDay(dateStr);
        } else {
            const weekStart = startOfWeek(selectedDate, { locale: ptBR });
            data = await getAppointmentsForWeek(format(weekStart, 'yyyy-MM-dd'));
        }
        
        const now = new Date();
        if (data) {
            const updatedAppointments = (data || []).map(apt => {
                const aptDate = apt.start_at ? new Date(apt.start_at) : null;
                if (aptDate && !isNaN(aptDate) && aptDate < now && apt.status === 'agendado') {
                    // This is a silent background update, should not block UI
                    updateAppointmentStatus(apt.id, 'não compareceu', true).catch(err => console.error("Failed to auto-update status:", err));
                    return { ...apt, status: 'não compareceu' };
                }
                return apt;
            });
            setAppointments(updatedAppointments);
        } else {
            setAppointments([]);
        }

    }, [selectedDate, view, getAppointmentsForDay, getAppointmentsForWeek, updateAppointmentStatus]);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
        setCurrentDate(newDate);
    };

    const handleNext = () => {
        const newDate = addDays(selectedDate, view === 'day' ? 1 : 7);
        handleDateChange(newDate);
    };

    const handlePrev = () => {
        const newDate = subDays(selectedDate, view === 'day' ? 1 : 7);
        handleDateChange(newDate);
    };

    const weekDays = useMemo(() => {
        const weekStart = startOfWeek(currentDate, { locale: ptBR });
        const weekEnd = endOfWeek(currentDate, { locale: ptBR });
        return eachDayOfInterval({ start: weekStart, end: weekEnd });
    }, [currentDate]);

    const openAppointmentForm = (appointment = null) => {
        setEditingAppointment(appointment);
        setIsAppointmentFormOpen(true);
        setIsDetailsOpen(false);
    };
    
    const openSurgeryModal = (appointment = null) => {
        setEditingAppointment(appointment);
        setIsSurgeryModalOpen(true);
    };

    const onAppointmentSave = () => {
        setIsAppointmentFormOpen(false);
        setIsSurgeryModalOpen(false);
        setEditingAppointment(null);
        fetchAppointments();
    };
    
    const handleSuggestTime = async () => {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        try {
            const suggested = await getSuggestedTime(dateStr);
            if (suggested) {
                 toast({
                    title: "💡 Horário Sugerido",
                    description: `O próximo horário livre é às ${suggested}.`,
                });
            } else {
                 toast({
                    title: "Agenda Cheia",
                    description: "Não há horários disponíveis para esta data.",
                });
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: "Erro ao Sugerir Horário",
                description: "Não foi possível verificar a disponibilidade.",
            });
        }
    };


    const handleSelectAppointment = (appointment) => {
        setSelectedAppointment(appointment);
        setIsDetailsOpen(true);
    };

    const handleCancelAppointment = async (appointment) => {
        try {
            await updateAppointmentStatus(appointment.id, 'cancelado');
            toast({
                title: 'Agendamento Cancelado',
                description: `A consulta de ${appointment.patient.full_name} foi cancelada.`,
                variant: 'destructive'
            });
            fetchAppointments();
            setIsDetailsOpen(false);
        } catch (error) {
            toast({
                title: 'Erro ao Cancelar',
                description: 'Não foi possível cancelar o agendamento.',
                variant: 'destructive'
            });
        }
    }

    return (
        <>
            <Helmet>
                <title>Agenda - Portal Clínico</title>
                <meta name="description" content="Visualize e gerencie seus agendamentos diários e semanais." />
            </Helmet>
            
            <div className="space-y-6">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold gradient-text">Agenda</h1>
                        <p className="text-gray-400 mt-1">Gerenciamento de consultas e cirurgias.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" onClick={handleSuggestTime}><BrainCircuit className="w-4 h-4 mr-2" /> Sugerir Horário</Button>
                        
                        <Dialog open={isSurgeryModalOpen} onOpenChange={setIsSurgeryModalOpen}>
                            <DialogTrigger asChild>
                                <Button className="btn-secondary" onClick={() => openSurgeryModal(null)}>
                                    <CalendarIcon className="w-4 h-4 mr-2" /> Agendar Cirurgia
                                </Button>
                            </DialogTrigger>
                             <DialogContent className="max-w-4xl">
                                <SurgeryModal
                                    appointment={editingAppointment}
                                    onSave={onAppointmentSave}
                                    onClose={() => setIsSurgeryModalOpen(false)}
                                    selectedDate={selectedDate}
                                />
                            </DialogContent>
                        </Dialog>

                        <Dialog open={isAppointmentFormOpen} onOpenChange={setIsAppointmentFormOpen}>
                            <DialogTrigger asChild>
                                <Button className="btn-primary" onClick={() => openAppointmentForm(null)}>
                                    <PlusCircle className="w-4 h-4 mr-2" /> Novo Agendamento
                                </Button>
                            </DialogTrigger>
                             <DialogContent className="max-w-2xl p-0 border-0">
                                <AppointmentForm
                                    appointment={editingAppointment}
                                    onSave={onAppointmentSave}
                                    onClose={() => setIsAppointmentFormOpen(false)}
                                    selectedDate={selectedDate}
                                />
                            </DialogContent>
                        </Dialog>

                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-between items-center bg-slate-800/50 p-2 rounded-lg">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={handlePrev}><ChevronLeft className="w-5 h-5" /></Button>
                        <h2 className="text-xl font-semibold text-center min-w-[250px]">
                            {view === 'day'
                                ? format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })
                                : `Semana de ${format(startOfWeek(currentDate, { locale: ptBR }), 'dd/MM')} à ${format(endOfWeek(currentDate, { locale: ptBR }), 'dd/MM/yyyy')}`
                            }
                        </h2>
                        <Button variant="ghost" size="icon" onClick={handleNext}><ChevronRight className="w-5 h-5" /></Button>
                         <Button variant="outline" size="sm" onClick={() => handleDateChange(new Date())} className="hidden md:flex">
                             Hoje
                        </Button>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-900/70 p-1 rounded-md">
                        <Button size="sm" variant={view === 'day' ? 'secondary' : 'ghost'} onClick={() => setView('day')}>Dia</Button>
                        <Button size="sm" variant={view === 'week' ? 'secondary' : 'ghost'} onClick={() => setView('week')}>Semana</Button>
                    </div>
                </motion.div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={view}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {view === 'day' ? (
                            <TodaysAgenda
                                appointments={appointments}
                                loading={apiLoading}
                                selectedDate={selectedDate}
                                onRefetch={fetchAppointments}
                            />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-7 gap-px bg-slate-700/50 border border-slate-700/50 rounded-lg overflow-hidden">
                            {weekDays.map(day => {
                                const dayAppointments = appointments.filter(apt => apt.start_at && isSameDay(new Date(apt.start_at), day));
                                return (
                                    <div key={day.toString()} className={`p-2 ${isToday(day) ? 'bg-blue-900/30' : 'bg-slate-900/50'} `}>
                                        <div className={`text-center mb-2 pb-1 border-b ${isToday(day) ? 'border-blue-500' : 'border-slate-700'}`}>
                                            <p className="text-xs font-bold uppercase">{format(day, 'EEE', { locale: ptBR })}</p>
                                            <p className={`text-lg font-bold ${isToday(day) ? 'text-blue-300' : ''}`}>{format(day, 'd')}</p>
                                        </div>
                                        <div className="space-y-2 min-h-[100px]">
                                            {dayAppointments.length > 0 ? (
                                                dayAppointments.map(apt => (
                                                    <motion.div
                                                        key={apt.id}
                                                        layoutId={apt.id}
                                                        whileHover={{ scale: 1.05 }}
                                                        className={`p-2 rounded-lg text-xs cursor-pointer ${apt.type === 'surgery' ? 'bg-purple-500/20 border-l-4 border-purple-500' : 'bg-blue-500/10 border-l-4 border-blue-500'}`}
                                                        onClick={() => handleSelectAppointment(apt)}
                                                    >
                                                        <p className="font-bold truncate">{apt.patient?.full_name || "Paciente Removido"}</p>
                                                        <p>{apt.start_at ? format(new Date(apt.start_at), 'HH:mm') : 'Inválido'}</p>
                                                    </motion.div>
                                                ))
                                            ) : (
                                                <div className="text-center text-xs text-slate-500 pt-4 h-16">Vazio</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            <AppointmentDetails
                appointment={selectedAppointment}
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                onEdit={openAppointmentForm}
                onCancel={handleCancelAppointment}
                onReschedule={openAppointmentForm}
            />
        </>
    );
};

export default Calendar;

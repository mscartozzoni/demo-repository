
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router-dom';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus as PlusIcon, Video as VideoIcon, UserCog as UserIcon, Scissors, Stethoscope, Lock, CheckCircle, Loader2, UserPlus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import AddEventModal from '@/components/agenda/AddEventModal';
import AppointmentDetailsModal from '@/components/agenda/AppointmentDetailsModal';
import { getAppointmentsForDay, addAppointment } from '@/services/api/appointments';
import { getPatients } from '@/services/api/patients';
import { useSchema } from '@/contexts/SchemaContext';
import { cn } from '@/lib/utils';
import AddPatientModal from '@/components/patients/AddPatientModal';


// Filter time slots for working hours (8 AM to 6 PM)
const TIME_SLOTS = Array.from({ length: (18 - 8) * 2 }, (_, i) => {
  const totalMinutes = (i * 30) + (8 * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
});

const Agenda = () => {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const { getAlias } = useSchema();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isAddEventModalOpen, setAddEventModalOpen] = useState(false);
  const [isAddPatientModalOpen, setAddPatientModalOpen] = useState(false);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [preselectedPatientId, setPreselectedPatientId] = useState(null);
  const [googleCalendarUrl, setGoogleCalendarUrl] = useState('');

  useEffect(() => {
    const storedUrl = localStorage.getItem('Google calendar Url');
    if (storedUrl) {
      setGoogleCalendarUrl(storedUrl);
    }
  }, []);

  useEffect(() => {
    if (location.state?.patientId) {
      setPreselectedPatientId(location.state.patientId);
      toast({
        title: "Paciente Selecionado",
        description: "Escolha um ou mais horários livres para criar um agendamento.",
      });
    }
  }, [location.state, toast]);

  const fetchAppointments = useCallback(async (day) => {
    setLoading(true);
    try {
      const response = await getAppointmentsForDay(day);
      if (response.success) {
        setAppointments(Array.isArray(response.data) ? response.data : []);
      } else {
        throw new Error(response.message || 'Unknown error');
      }
    } catch (error) {
      toast({ variant: 'destructive', title: getAlias('toast_title', 'error_fetching_appointments', 'Erro ao buscar agendamentos'), description: error.message });
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [toast, getAlias]);

  const fetchPatientsData = useCallback(async () => {
      try {
          const response = await getPatients();
          if (response.success) {
              const patientsMap = response.data.reduce((acc, patient) => {
                  acc[patient.id] = patient;
                  return acc;
              }, {});
              setPatients(patientsMap);
          }
      } catch (error) {
          toast({ variant: 'destructive', title: getAlias('toast_title', 'error_fetching_patients', 'Erro ao buscar pacientes'), description: error.message });
      }
  }, [toast, getAlias]);

  useEffect(() => {
      fetchAppointments(selectedDate);
      fetchPatientsData();
  }, [selectedDate, fetchAppointments, fetchPatientsData]);

  const handleDateChange = (date) => {
    setSelectedDate(date || new Date());
    setSelectedTimeSlots([]);
  };

  const handleTimeSlotClick = (time) => {
    setSelectedTimeSlots(prev => {
        if (prev.includes(time)) {
            return prev.filter(t => t !== time);
        } else {
            return [...prev, time].sort();
        }
    });
  };
  
  const onEventAdded = () => {
    fetchAppointments(selectedDate);
    setSelectedTimeSlots([]);
  };

  const handleBlockSlots = async () => {
    if (selectedTimeSlots.length === 0 || !user) return;

    const sortedSlots = selectedTimeSlots.sort();
    const [startHours, startMinutes] = sortedSlots[0].split(':').map(Number);
    const starts_at = new Date(selectedDate);
    starts_at.setHours(startHours, startMinutes, 0, 0);

    const [endHours, endMinutes] = sortedSlots[sortedSlots.length - 1].split(':').map(Number);
    const ends_at_temp = new Date(selectedDate);
    ends_at_temp.setHours(endHours, endMinutes, 0, 0);
    const ends_at = new Date(ends_at_temp.getTime() + 30 * 60 * 1000); // Add 30 minutes to the last slot

    const appointmentData = {
        title: getAlias('event_title', 'blocked_slot', 'Horário Bloqueado'),
        description: getAlias('event_desc', 'blocked_by_user', 'Bloqueado pelo usuário.'),
        starts_at: starts_at.toISOString(),
        ends_at: ends_at.toISOString(),
        type: 'pessoal',
        status: 'confirmado',
        doctor_id: user.id,
        organization_id: profile?.organization_id || 'mock-org-id',
    };
    
    try {
      const result = await addAppointment(appointmentData);
      if(result.success) {
        toast({ title: getAlias('toast_title', 'success', "Sucesso!"), description: getAlias('toast_desc', 'slots_blocked', "Horários bloqueados."), className: 'bg-yellow-500 text-white' });
        onEventAdded();
      } else {
        throw new Error(result.message || 'Failed to block slots');
      }
    } catch(error) {
      toast({ variant: 'destructive', title: getAlias('toast_title', 'error_blocking_slots', 'Erro ao bloquear'), description: error.message });
    }
  }

  const getAppointmentForSlot = (time) => {
    const slotTime = new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${time}`).getTime();
    return appointments.find(app => {
        const appStart = new Date(app.starts_at).getTime();
        const appEnd = new Date(app.ends_at).getTime();
        return slotTime >= appStart && slotTime < appEnd;
    });
  };
  
  const getPillData = (appointment) => {
    if (!appointment) return null;
    
    const patientName = patients[appointment.patient_id]?.full_name || getAlias('text', 'patient_not_found', 'Paciente não encontrado');
    let icon, text, color, eventTitle;
    
    switch(appointment.type) {
      case 'pessoal':
        icon = UserIcon;
        text = appointment.title;
        color = 'bg-gray-500/80 hover:bg-gray-500';
        eventTitle = appointment.title;
        break;
      case 'consulta':
        icon = appointment.whereby_link ? VideoIcon : Stethoscope;
        text = patientName;
        eventTitle = appointment.title || `${getAlias('event_type', 'consulta', 'Consulta')} de ${patientName}`;
        color = appointment.is_teleconsultation ? 'bg-blue-600/80 hover:bg-blue-600' : 'bg-purple-600/80 hover:bg-purple-600';
        break;
      case 'cirurgia':
        icon = Scissors;
        text = patientName;
        eventTitle = appointment.title || `${getAlias('event_type', 'cirurgia', 'Cirurgia')} de ${patientName}`;
        color = 'bg-green-600/80 hover:bg-green-600';
        break;
      default:
        icon = Lock;
        text = appointment.title || getAlias('event_title', 'blocked', 'Bloqueado');
        color = 'bg-slate-700/80 hover:bg-slate-700';
        eventTitle = text;
    }
    
    return { icon, text, color, title: eventTitle, fullAppointment: { ...appointment, title: eventTitle } };
  };

  const isSlotStart = (time, appointment) => {
    if (!appointment) return false;
    const slotDate = new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${time}`);
    const appStartDate = new Date(appointment.starts_at);
    return slotDate.getHours() === appStartDate.getHours() && slotDate.getMinutes() === appStartDate.getMinutes();
  };
  
  const getAppointmentDurationInSlots = (appointment) => {
      if(!appointment) return 0;
      const start = new Date(appointment.starts_at);
      const end = new Date(appointment.ends_at);
      const durationMinutes = (end - start) / (1000 * 60);
      return Math.ceil(durationMinutes / 30);
  }

  const memoizedPillData = useMemo(() => {
    const pills = new Map();
    appointments.forEach(app => {
      pills.set(app.id, getPillData(app));
    });
    return pills;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointments, patients, getAlias]);

  const onPatientAdded = (newPatient) => {
    fetchPatientsData();
    setPreselectedPatientId(newPatient.id);
    setAddEventModalOpen(true);
    toast({
        title: "Paciente Criado!",
        description: "Agora selecione os horários para agendar a consulta.",
    });
  }

  return (
    <>
      <Helmet>
        <title>{getAlias('page_title', 'agenda_do_dia', 'Agenda do Dia')} - Portal do Médico</title>
        <meta name="description" content={getAlias('page_desc', 'agenda_do_dia_desc', 'Gerencie seus agendamentos e horários do dia.')} />
      </Helmet>
      
      <AddEventModal
        isOpen={isAddEventModalOpen}
        onClose={() => setAddEventModalOpen(false)}
        onEventAdded={onEventAdded}
        selectedDate={selectedDate}
        selectedTimeSlots={selectedTimeSlots}
        preselectedPatientId={preselectedPatientId}
      />
      
      <AddPatientModal
        isOpen={isAddPatientModalOpen}
        onClose={() => setAddPatientModalOpen(false)}
        onPatientAdded={onPatientAdded}
      />
      
      {selectedAppointment && (
        <AppointmentDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => { setDetailsModalOpen(false); setSelectedAppointment(null); }}
          event={selectedAppointment}
        />
      )}

      <div className="flex flex-col lg:flex-row gap-8 h-full">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:w-[340px] lg:flex-shrink-0">
          <div className="bg-card/50 backdrop-blur-sm p-4 rounded-2xl border border-border/50 sticky top-24">
            <h2 className="text-xl font-bold text-white mb-4 text-center">{getAlias('header', 'select_date', 'Selecione uma data')}</h2>
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleDateChange}
              locale={ptBR}
              className="text-white"
               classNames={{
                root: 'text-white flex justify-center',
                caption: 'text-white flex justify-center items-center relative mb-4',
                caption_label: 'text-lg font-bold',
                nav_button: 'h-8 w-8 hover:bg-primary/20 rounded-full absolute top-1/2 -translate-y-1/2',
                nav_button_previous: 'left-1',
                nav_button_next: 'right-1',
                head_row: 'flex justify-around',
                head_cell: 'text-slate-400 font-normal w-10 text-sm',
                row: 'flex w-full mt-2 justify-around',
                cell: 'text-center',
                day: 'h-10 w-10 text-white rounded-full transition-colors hover:bg-primary/20 aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:font-bold',
                day_today: 'font-bold text-primary ring-1 ring-blue-500 rounded-full',
                day_outside: 'text-slate-500 opacity-50',
                day_disabled: 'text-slate-600 opacity-50',
              }}
            />
            {googleCalendarUrl && (
              <Button 
                variant="gradient" 
                className="w-full mt-4" 
                onClick={() => navigate('/medico/google-calendar')}
              >
                  <Calendar className="w-4 h-4 mr-2" />
                  Abrir Google Agenda
              </Button>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">{getAlias('page_title', 'agenda_do_dia', 'Agenda do Dia')}</h1>
              <p className="text-slate-400 mt-1 capitalize">{format(selectedDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button onClick={() => setAddPatientModalOpen(true)} variant="outline" className="flex-1 sm:flex-none border-slate-600 hover:border-blue-500">
                  <UserPlus className="w-4 h-4 mr-2" /> Novo Paciente
              </Button>
              <AnimatePresence>
              {selectedTimeSlots.length > 0 && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex gap-2 flex-1 sm:flex-none">
                      <Button onClick={() => setAddEventModalOpen(true)} className="flex-1 bg-primary/80 hover:bg-primary">
                          <PlusIcon className="w-4 h-4 mr-2" /> {getAlias('button', 'new_appointment', 'Agendar')}
                      </Button>
                      <Button onClick={handleBlockSlots} variant="secondary" className="flex-1">
                          <Lock className="w-4 h-4 mr-2" /> {getAlias('button', 'block_slot', 'Bloquear')}
                      </Button>
                  </motion.div>
              )}
              </AnimatePresence>
            </div>
          </div>
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="divide-y divide-border/50">
              {loading ? (
                <div className="text-center py-10 text-slate-400 flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {getAlias('text', 'loading', 'Carregando...')}
                </div>
              ) : (
                TIME_SLOTS.map((time) => {
                  const appointment = getAppointmentForSlot(time);
                  const isStart = isSlotStart(time, appointment);
                  const isSelected = selectedTimeSlots.includes(time);

                  if (appointment && !isStart) return null;
                  
                  const pillData = appointment ? memoizedPillData.get(appointment.id) : null;
                  const durationSlots = appointment ? getAppointmentDurationInSlots(appointment) : 1;
                  const slotHeight = durationSlots * 60; // 60px per 30min slot

                  return (
                    <div
                      key={time}
                      onClick={() => !appointment && handleTimeSlotClick(time)}
                      className={cn(
                        'flex items-stretch transition-all duration-200 group',
                        !appointment && 'cursor-pointer hover:bg-primary/5',
                        isSelected && !appointment && 'bg-primary/10'
                      )}
                      style={{ minHeight: isStart ? `${slotHeight}px` : '60px' }}
                    >
                      <div className={cn("w-20 text-center text-slate-400 text-sm font-medium pt-4 flex-shrink-0 border-r border-border/50", isSelected && !appointment && "text-primary font-bold")}>{time}</div>
                      <div className="flex-1 pl-4 relative pt-4 pb-4">
                        {appointment && isStart ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={() => { 
                              setSelectedAppointment(pillData.fullAppointment); 
                              setDetailsModalOpen(true); 
                            }}
                            className={cn("absolute top-2 right-2 left-2 bottom-2 cursor-pointer transition-all duration-200 rounded-lg flex items-center gap-3 p-3 text-white", pillData?.color)}
                          >
                            <pillData.icon className="w-5 h-5 flex-shrink-0" />
                            <div className='flex-1 overflow-hidden'>
                                <p className="font-semibold text-sm truncate">{pillData.text}</p>
                                {appointment.type !== 'pessoal' && <p className="text-xs opacity-80 truncate">{pillData.title}</p>}
                            </div>
                          </motion.div>
                        ) : !appointment && (
                            <div className="flex items-center h-full text-slate-500">
                                <div className="flex items-center gap-2">
                                    {isSelected ? <CheckCircle className="w-4 h-4 text-primary" /> : <div className="w-4 h-4" />}
                                    <span className={cn("text-sm font-medium", isSelected && 'text-primary')}>{isSelected ? getAlias('text', 'selected', 'Selecionado') : getAlias('text', 'available', 'Livre')}</span>
                                </div>
                            </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Agenda;

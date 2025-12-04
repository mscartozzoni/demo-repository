
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, User, Phone, Mail, StickyNote, AlertTriangle, Edit, CheckCircle, UserX, XCircle, Copy, Video, Calendar, Clock } from 'lucide-react';
import { useApi } from '@/contexts/ApiContext';

const AppointmentInfoModal = ({ isOpen, onClose, appointment, onEdit, onQuickUpdate }) => {
  const { toast } = useToast();
  const { getPatientById } = useApi();
  const [patientDetails, setPatientDetails] = useState(null);
  const [loadingPatient, setLoadingPatient] = useState(false);
  const [availableActions, setAvailableActions] = useState({
    canCancel: false,
    canConclude: false,
    canNoShow: false,
    canEdit: false,
  });

  useEffect(() => {
    const fetchPatientDetails = async () => {
      if (isOpen && appointment?.patient_id) {
        setLoadingPatient(true);
        try {
          const patientData = await getPatientById(appointment.patient_id);
          setPatientDetails(patientData);
        } catch (error) {
          toast({ variant: 'destructive', title: 'Erro ao buscar detalhes do paciente.' });
        } finally {
          setLoadingPatient(false);
        }
      }
    };
    fetchPatientDetails();
  }, [isOpen, appointment, getPatientById, toast]);
  
  useEffect(() => {
    if (!appointment || !appointment.start_at) return;

    const now = new Date();
    const apptTime = new Date(appointment.appointment_time || appointment.start_at);
    
    if (isNaN(apptTime)) return; // Don't calculate if date is invalid

    const timeDiffMinutes = (apptTime.getTime() - now.getTime()) / 60000;
    const isPast = apptTime < now;
    const isToday = apptTime.toDateString() === now.toDateString();

    const actions = {
        canCancel: appointment.status === 'agendado' && timeDiffMinutes > 60,
        canConclude: appointment.status === 'agendado' && (isPast || isToday),
        canNoShow: appointment.status === 'agendado' && (isPast || isToday),
        canEdit: appointment.status === 'agendado' && !isPast,
    };
    
    setAvailableActions(actions);

  }, [appointment, isOpen]);


  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    toast({ title: `✅ ${field} copiado!` });
  };

  if (!isOpen || !appointment) return null;

  const isCadastroIncompleto = !patientDetails?.cpf || !patientDetails?.birthdate;
  const isOnline = appointment.is_online || appointment.visit_type === 'Consulta Online';
  
  const appointmentDateStr = appointment.appointment_time || appointment.start_at;
  const appointmentDate = appointmentDateStr ? new Date(appointmentDateStr) : null;
  const isDateValid = appointmentDate && !isNaN(appointmentDate);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle asChild>
            <h2 className="text-2xl font-bold gradient-text">Detalhes do Agendamento</h2>
          </DialogTitle>
          <DialogDescription asChild>
            <p>Informações completas do paciente e do agendamento.</p>
          </DialogDescription>
        </DialogHeader>

        {loadingPatient ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <section className="space-y-4 p-4 rounded-lg bg-black/20" aria-labelledby="patient-details-heading">
              <h3 id="patient-details-heading" className="font-semibold text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-blue-400" /> Paciente
              </h3>
              {isCadastroIncompleto && (
                <div className="flex items-center gap-2 p-2 rounded-md bg-yellow-500/10 text-yellow-300 text-sm">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Cadastro do paciente está incompleto.</span>
                </div>
              )}
              <p className="font-bold text-xl">{patientDetails?.full_name || 'Carregando...'}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-300">
                  <Mail className="mr-3 h-4 w-4 flex-shrink-0" />
                  <span className="truncate flex-1">{patientDetails?.email || 'Não informado'}</span>
                  {patientDetails?.email && <Copy className="ml-2 h-4 w-4 cursor-pointer hover:text-white" onClick={() => handleCopy(patientDetails.email, 'E-mail')} />}
                </div>
                <div className="flex items-center text-gray-300">
                  <Phone className="mr-3 h-4 w-4 flex-shrink-0" />
                  <span className="truncate flex-1">{patientDetails?.phone || 'Não informado'}</span>
                  {patientDetails?.phone && <Copy className="ml-2 h-4 w-4 cursor-pointer hover:text-white" onClick={() => handleCopy(patientDetails.phone, 'Telefone')} />}
                </div>
              </div>
            </section>

            <section className="space-y-4 p-4 rounded-lg bg-black/20" aria-labelledby="appointment-details-heading">
              <h3 id="appointment-details-heading" className="font-semibold text-lg flex items-center gap-2">
                <StickyNote className="h-5 w-5 text-purple-400" /> Consulta
              </h3>
              <p className="font-bold text-xl capitalize flex items-center gap-2">
                {isOnline && <Video className="w-5 h-5 text-cyan-400" />}
                {appointment.visit_type}
              </p>
              <div className="space-y-2 text-sm">
                 <div className="flex items-center text-gray-300">
                  <Calendar className="mr-3 h-4 w-4 flex-shrink-0 text-cyan-400" />
                  <span className="font-semibold text-white">{isDateValid ? appointmentDate.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Data inválida'}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Clock className="mr-3 h-4 w-4 flex-shrink-0 text-cyan-400" />
                  <span className="font-semibold text-white">{isDateValid ? appointmentDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'Hora inválida'}</span>
                </div>
                {appointment.reason && <p className="text-gray-300"><span className="font-semibold text-white">Motivo:</span> {appointment.reason}</p>}
                {appointment.notes && <p className="text-gray-300"><span className="font-semibold text-white">Notas da Secretaria:</span> {appointment.notes}</p>}
              </div>
            </section>
          </div>
        )}

        <DialogFooter className="mt-6 sm:justify-between gap-2">
            <div className="flex gap-2">
                 {availableActions.canEdit && (
                    <Button variant="outline" onClick={() => onEdit && onEdit(appointment)}>
                        <Edit className="mr-2 h-4 w-4" /> Editar
                    </Button>
                 )}
            </div>
            <div className="flex gap-2 flex-wrap justify-end">
                {availableActions.canConclude && (
                    <Button variant="secondary" className="bg-green-500/20 hover:bg-green-500/30 text-green-300" onClick={() => onQuickUpdate && onQuickUpdate(appointment.id, 'realizada')}>
                        <CheckCircle className="mr-2 h-4 w-4" /> Concluído
                    </Button>
                )}
                {availableActions.canNoShow && (
                    <Button variant="secondary" className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300" onClick={() => onQuickUpdate && onQuickUpdate(appointment.id, 'nao_compareceu')}>
                        <UserX className="mr-2 h-4 w-4" /> Não Compareceu
                    </Button>
                )}
                {availableActions.canCancel && (
                    <Button variant="destructive" onClick={() => onQuickUpdate && onQuickUpdate(appointment.id, 'cancelado')}>
                        <XCircle className="mr-2 h-4 w-4" /> Cancelar
                    </Button>
                )}
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentInfoModal;

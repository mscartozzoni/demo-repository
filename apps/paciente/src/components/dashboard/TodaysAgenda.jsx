
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, PlusCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import AppointmentInfoModal from '@/components/dashboard/AppointmentInfoModal';
import AppointmentForm from '@/components/calendar/AppointmentForm';
import { useApi } from '@/contexts/ApiContext';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const AppointmentItem = ({ appointment, onSelect, index }) => {
    const isOnline = appointment.is_online || appointment.visit_type === 'Consulta Online';
    
    const appointmentDateStr = appointment.start_at || appointment.appointment_time;
    const appointmentDate = appointmentDateStr ? new Date(appointmentDateStr) : null;
    const isDateValid = appointmentDate && !isNaN(appointmentDate);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(appointment)}
            className="p-4 rounded-lg cursor-pointer transition-all duration-300 ease-in-out bg-slate-800/50 hover:bg-slate-800/80 hover:shadow-lg hover:shadow-blue-500/10 border border-transparent hover:border-blue-500/30"
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-12 rounded-full ${appointment.type === 'surgery' ? 'bg-purple-500' : 'bg-green-500'}`}></div>
                    <div>
                        <p className="font-bold text-base text-white">{appointment.patient?.full_name || "Contato Removido"}</p>
                        <p className="text-sm text-gray-400">{appointment.visit_type}</p>
                    </div>
                </div>
                <div className="text-right">
                     <p className="font-semibold text-lg text-white">
                        {isDateValid ? format(appointmentDate, 'HH:mm') : 'Inválido'}
                    </p>
                    {isOnline && <span className="text-xs text-blue-400 font-medium">Online</span>}
                </div>
            </div>
        </motion.div>
    );
}

const TodaysAgenda = ({ appointments, loading, selectedDate, onRefetch }) => {
  const { toast } = useToast();
  const { updateAppointmentStatus } = useApi();
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const handleSelectAppointment = (appointment) => {
    if (appointment.patient) {
        setSelectedAppointment(appointment);
        setIsInfoModalOpen(true);
    } else {
        toast({
            variant: 'destructive',
            title: 'Paciente não encontrado',
            description: 'Este agendamento pertence a um contato ou paciente que foi removido.'
        });
    }
  };

  const handleEdit = (appointment) => {
      setSelectedAppointment(appointment);
      setIsInfoModalOpen(false);
      setIsEditModalOpen(true);
  };
  
  const handleQuickUpdate = async (id, status) => {
      try {
        await updateAppointmentStatus(id, status);
        toast({ title: "Sucesso", description: `Agendamento atualizado para: ${status}.`});
        setIsInfoModalOpen(false);
        onRefetch();
      } catch (error) {
        toast({ variant: 'destructive', title: "Erro", description: 'Não foi possível atualizar o agendamento.'});
      }
  };
  
  const handleCloseAllModals = () => {
      setIsInfoModalOpen(false);
      setIsEditModalOpen(false);
      setSelectedAppointment(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-10">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }
  
  const title = selectedDate ? `Agenda de ${format(selectedDate, "eeee, dd 'de' MMMM", { locale: ptBR })}` : 'Agenda';

  return (
    <>
      <h3 className="text-lg font-semibold mb-4 capitalize">{title}</h3>
      <ScrollArea className="h-[calc(100vh-22rem)] pr-4 -mr-4">
        <div className="space-y-4">
          <AnimatePresence>
            {appointments && appointments.length > 0 ? (
              appointments.map((apt, index) => (
                <AppointmentItem 
                    key={apt.id} 
                    appointment={apt} 
                    onSelect={handleSelectAppointment} 
                    index={index}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-10"
              >
                <Calendar className="mx-auto h-12 w-12 text-gray-500" />
                <h3 className="mt-4 text-lg font-semibold text-gray-300">Agenda Limpa!</h3>
                <p className="mt-1 text-sm text-gray-400">Nenhum agendamento para este dia.</p>
                <Button
                  onClick={() => setIsEditModalOpen(true)}
                  className="mt-6 btn-primary"
                >
                  <PlusCircle className="-ml-1 mr-2 h-5 w-5" />
                  Novo Agendamento
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
      
      <AppointmentInfoModal
        isOpen={isInfoModalOpen}
        onClose={handleCloseAllModals}
        appointment={selectedAppointment}
        onEdit={handleEdit}
        onQuickUpdate={handleQuickUpdate}
      />

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl p-0 border-0 bg-slate-900">
          <AppointmentForm
            appointment={selectedAppointment}
            selectedDate={selectedDate}
            onSave={() => {
              handleCloseAllModals();
              onRefetch();
            }}
            onClose={handleCloseAllModals}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TodaysAgenda;

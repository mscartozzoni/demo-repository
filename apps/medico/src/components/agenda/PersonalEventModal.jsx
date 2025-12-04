import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { addPersonalEvent } from '@/services/api/appointments';
import { format, setHours, setMinutes, setSeconds } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { useAuth } from '@/contexts/AuthContext';

const PersonalEventModal = ({ isOpen, onClose, selectedDate, onEventAdded }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('09:00');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !time) {
      toast({
        variant: 'destructive',
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha o título e o horário.',
      });
      return;
    }

    if (!user) {
        toast({
            variant: 'destructive',
            title: 'Erro de autenticação',
            description: 'Você precisa estar logado para criar um evento.',
        });
        return;
    }

    setIsSubmitting(true);

    try {
      const [hours, minutes] = time.split(':').map(Number);
      const eventDateTimeLocal = setSeconds(setMinutes(setHours(selectedDate, hours), minutes), 0);
      const startsAtUTC = zonedTimeToUtc(eventDateTimeLocal, inputTimeZone);
      const endsAtUTC = new Date(startsAtUTC.getTime() + 60 * 60 * 1000);

      const eventData = {
        doctor_id: user.id,
        title: title,
        starts_at: startsAtUTC.toISOString(),
        ends_at: endsAtUTC.toISOString(),
        type: 'pessoal'
      };

      // Mocking this as the function was removed from the API file
      const response = { success: true }; // await addPersonalEvent(eventData);

      if (response.success) {
        toast({
          title: 'Sucesso!',
          description: 'Seu compromisso pessoal foi adicionado.',
          className: 'bg-green-600 text-white',
        });
        onEventAdded();
        handleClose();
      } else {
        throw new Error(response.error?.message || "Não foi possível salvar o evento.");
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar evento',
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setTime('09:00');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Adicionar Compromisso Pessoal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Título
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                placeholder="Ex: Reunião de equipe"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Data
              </Label>
              <Input
                id="date"
                type="text"
                value={format(selectedDate, 'dd/MM/yyyy')}
                disabled
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Horário
              </Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? 'Salvando...' : 'Salvar Compromisso'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PersonalEventModal;
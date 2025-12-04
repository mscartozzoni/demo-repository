
import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { addAppointment } from '@/services/api/appointments';
import { getPatients } from '@/services/api/patients';
import { Loader2, Video, Stethoscope, Scissors, User as UserIcon, PlusCircle } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { getConsultationTypes } from '@/services/api/consultationTypes';
import ConsultationTypeModal from '@/components/agenda/ConsultationTypeModal';

const AddEventModal = ({ isOpen, onClose, onEventAdded, selectedDate, selectedTimeSlots, preselectedPatientId }) => {
    const { toast } = useToast();
    const { user, profile } = useAuth();
    const [consultationTypeId, setConsultationTypeId] = useState('');
    const [description, setDescription] = useState('');
    const [patientId, setPatientId] = useState('');
    const [eventType, setEventType] = useState('consulta');
    const [isTeleconsultation, setIsTeleconsultation] = useState(false);
    const [patients, setPatients] = useState([]);
    const [consultationTypes, setConsultationTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isConsultationTypeModalOpen, setConsultationTypeModalOpen] = useState(false);

    const fetchConsultationTypes = useCallback(async () => {
        const types = await getConsultationTypes();
        setConsultationTypes(types);
    }, []);

    useEffect(() => {
        const fetchPatients = async () => {
            const response = await getPatients();
            if (response.success) {
                setPatients(response.data);
            }
        };
        if (isOpen) {
            fetchPatients();
            fetchConsultationTypes();
        }
    }, [isOpen, fetchConsultationTypes]);

    useEffect(() => {
        if (preselectedPatientId) {
            setPatientId(preselectedPatientId);
        }
        if (!isOpen) {
          // Reset state when closed
          setConsultationTypeId('');
          setDescription('');
          setPatientId(preselectedPatientId || '');
          setEventType('consulta');
          setIsTeleconsultation(false);
        }
    }, [isOpen, preselectedPatientId]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedTimeSlots.length === 0 || !user) return;
        if (eventType !== 'pessoal' && !consultationTypeId) {
            toast({ variant: 'destructive', title: 'Campo obrigatório', description: 'Por favor, selecione um tipo de consulta.' });
            return;
        }
        setIsLoading(true);

        const selectedType = consultationTypes.find(t => t.id === consultationTypeId);
        const title = selectedType ? selectedType.name : 'Evento Pessoal';

        const sortedSlots = selectedTimeSlots.sort();
        const [startHours, startMinutes] = sortedSlots[0].split(':').map(Number);
        const starts_at = new Date(selectedDate);
        starts_at.setHours(startHours, startMinutes, 0, 0);

        const [endHours, endMinutes] = sortedSlots[sortedSlots.length - 1].split(':').map(Number);
        const ends_at_temp = new Date(selectedDate);
        ends_at_temp.setHours(endHours, endMinutes, 0, 0);
        const ends_at = new Date(ends_at_temp.getTime() + 30 * 60 * 1000);

        const appointmentData = {
            title,
            description,
            starts_at: starts_at.toISOString(),
            ends_at: ends_at.toISOString(),
            type: eventType,
            status: 'confirmado',
            patient_id: eventType !== 'pessoal' ? patientId : null,
            doctor_id: user.id,
            organization_id: profile?.organization_id || 'mock-org-id',
            is_teleconsultation: isTeleconsultation,
            consultation_type_id: consultationTypeId,
        };
        
        try {
            const result = await addAppointment(appointmentData);
            if(result.success) {
                toast({ title: "Agendamento Criado!", description: "O evento foi adicionado à sua agenda.", className: 'bg-green-600 text-white'});
                onEventAdded();
                onClose();
            } else {
                throw new Error(result.message || 'Failed to add appointment');
            }
        } catch(error) {
            toast({ variant: 'destructive', title: 'Erro ao agendar', description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleTypeAdded = (newType) => {
        fetchConsultationTypes().then(() => {
            setConsultationTypeId(newType.id);
        });
    };
    
    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="bg-slate-800 border-slate-700 text-white">
                    <DialogHeader>
                        <DialogTitle>Novo Agendamento</DialogTitle>
                        <DialogDescription>
                            Preencha os detalhes para o novo evento na agenda.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="eventType">Tipo de Evento</Label>
                            <Select value={eventType} onValueChange={setEventType}>
                                <SelectTrigger className="w-full bg-slate-700 border-slate-600">
                                    <SelectValue placeholder="Selecione o tipo de evento" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                    <SelectItem value="consulta"><Stethoscope className="inline w-4 h-4 mr-2" /> Consulta</SelectItem>
                                    <SelectItem value="cirurgia"><Scissors className="inline w-4 h-4 mr-2" /> Cirurgia</SelectItem>
                                    <SelectItem value="pessoal"><UserIcon className="inline w-4 h-4 mr-2" /> Evento Pessoal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {eventType === 'consulta' && (
                            <div className="flex items-center space-x-2 bg-slate-700/50 p-3 rounded-md">
                               <Video className="w-5 h-5 text-blue-400"/>
                               <Label htmlFor="teleconsultation-switch" className="flex-grow">É uma teleconsulta?</Label>
                               <Switch
                                 id="teleconsultation-switch"
                                 checked={isTeleconsultation}
                                 onCheckedChange={setIsTeleconsultation}
                               />
                             </div>
                        )}
                         {eventType !== 'pessoal' && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="consultationType">Tipo de Consulta</Label>
                                    <div className="flex gap-2">
                                        <Select value={consultationTypeId} onValueChange={setConsultationTypeId}>
                                            <SelectTrigger className="w-full bg-slate-700 border-slate-600">
                                                <SelectValue placeholder="Selecione o tipo de consulta" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                                {consultationTypes.map(type => (
                                                    <SelectItem key={type.id} value={type.id}>
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }}></span>
                                                            {type.name}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button type="button" variant="outline" size="icon" onClick={() => setConsultationTypeModalOpen(true)}>
                                            <PlusCircle className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="patient">Paciente</Label>
                                    <Select value={patientId} onValueChange={setPatientId} required>
                                        <SelectTrigger className="w-full bg-slate-700 border-slate-600">
                                            <SelectValue placeholder="Selecione um paciente" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                            {patients.map(p => <SelectItem key={p.id} value={p.id}>{p.full_name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
                        )}
                        {eventType === 'pessoal' && (
                             <div className="space-y-2">
                                <Label htmlFor="title">Título do Evento</Label>
                                <Input id="title" placeholder="Ex: Almoço, Reunião" value={consultationTypeId} onChange={e => setConsultationTypeId(e.target.value)} required className="bg-slate-700 border-slate-600" />
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="description">Descrição (Opcional)</Label>
                            <Textarea id="description" placeholder="Adicione notas ou detalhes..." value={description} onChange={e => setDescription(e.target.value)} className="bg-slate-700 border-slate-600" />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>Cancelar</Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isLoading ? 'Agendando...' : 'Confirmar Agendamento'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            <ConsultationTypeModal
                isOpen={isConsultationTypeModalOpen}
                onClose={() => setConsultationTypeModalOpen(false)}
                onTypeAdded={handleTypeAdded}
            />
        </>
    );
};

export default AddEventModal;

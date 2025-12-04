import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarPlus, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const mockHospitals = [
    { id: '1', name: 'Hospital Sírio-Libanês' },
    { id: '2', name: 'Hospital Albert Einstein' },
    { id: '3', name: 'Hospital Vila Nova Star' },
];

const SurgeryScheduleModal = ({ patientId, surgicalIndication, onSave }) => {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        surgeryName: '',
        surgeryType: '',
        materials: '',
        hospitalId: '',
        probableDate: '',
        observations: ''
    });

    useEffect(() => {
        if (surgicalIndication) {
            setFormData(prev => ({
                ...prev,
                surgeryName: surgicalIndication.nome_cirurgia || '',
                surgeryType: surgicalIndication.tipo_cirurgia || '',
            }));
        }
    }, [surgicalIndication]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        const surgeryRequest = {
            patient_id: patientId,
            type: 'agendamento_cirurgico',
            content: {
                title: `Solicitação de Cirurgia: ${formData.surgeryName}`,
                ...formData
            },
            status: 'solicitado'
        };

        try {
            await onSave(surgeryRequest);
            setIsOpen(false);
            toast({
                title: "Solicitação de Cirurgia Enviada!",
                description: "A equipe administrativa foi notificada para dar andamento.",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro ao solicitar cirurgia",
                description: error.message,
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" className="bg-teal-600 hover:bg-teal-700 text-white">
                    <CalendarPlus className="w-4 h-4 mr-2" />
                    Agendar Cirurgia
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-white flex items-center gap-2">
                        <CalendarPlus className="w-5 h-5 text-teal-400" />
                        Solicitar Agendamento de Cirurgia
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
                    <InputGroup label="Paciente" value={`ID: ${patientId}`} readOnly />
                    
                    <InputGroup 
                        label="Nome da Cirurgia" 
                        value={formData.surgeryName}
                        onChange={(e) => handleChange('surgeryName', e.target.value)}
                        placeholder="Confirmar o nome do procedimento"
                    />

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Hospital</label>
                        <Select onValueChange={(value) => handleChange('hospitalId', value)} value={formData.hospitalId}>
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                <SelectValue placeholder="Selecione o hospital" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                {mockHospitals.map(h => <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Materiais Necessários</label>
                        <Textarea
                            value={formData.materials}
                            onChange={(e) => handleChange('materials', e.target.value)}
                            placeholder="Liste materiais especiais, próteses, etc."
                            className="bg-slate-700 border-slate-600 text-white"
                        />
                    </div>

                    <InputGroup 
                        label="Provável Data da Cirurgia"
                        type="date"
                        value={formData.probableDate}
                        onChange={(e) => handleChange('probableDate', e.target.value)}
                    />

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Observações para a Secretaria</label>
                        <Textarea
                            value={formData.observations}
                            onChange={(e) => handleChange('observations', e.target.value)}
                            placeholder="Informações adicionais, urgência, convênio, etc."
                            className="bg-slate-700 border-slate-600 text-white"
                        />
                    </div>
                </div>
                 <div className="flex justify-end pt-4 border-t border-slate-700">
                    <Button onClick={handleSubmit} className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
                        <Send className="w-4 h-4 mr-2" />
                        Enviar Solicitação
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const InputGroup = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
        <Input {...props} className={`bg-slate-700 border-slate-600 text-white ${props.readOnly ? 'opacity-70' : ''}`} />
    </div>
);

export default SurgeryScheduleModal;
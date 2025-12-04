import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, User, Mail, Phone, FileText, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const NewPatientDialog = ({ isOpen, onClose, onPatientCreated }) => {
    const [formData, setFormData] = useState({ 
        full_name: '', 
        email: '', 
        phone: '', 
        document_id: '',
        appointment_date: ''
    });
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.full_name) {
            toast({ variant: "destructive", title: "Erro", description: "O nome completo é obrigatório." });
            return;
        }
        setLoading(true);
        
        setTimeout(() => {
            onPatientCreated(formData);
            handleClose();
        }, 500);
    };

    const handleClose = () => {
        setFormData({ full_name: '', email: '', phone: '', document_id: '', appointment_date: '' });
        setLoading(false);
        onClose();
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-gray-900/50 backdrop-blur-xl border-white/20 text-white">
                <DialogHeader>
                    <DialogTitle>Novo Paciente</DialogTitle>
                    <DialogDescription className="text-purple-300">
                        Preencha os dados e, se desejar, agende a primeira avaliação.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label className="text-purple-200 flex items-center"><User className="h-4 w-4 mr-2" />Nome Completo</Label>
                        <Input name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Nome do Paciente" className="bg-white/10 border-white/20" required />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-purple-200 flex items-center"><Mail className="h-4 w-4 mr-2" />E-mail</Label>
                            <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="email@exemplo.com" className="bg-white/10 border-white/20" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-purple-200 flex items-center"><Phone className="h-4 w-4 mr-2" />Telefone</Label>
                            <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="(00) 90000-0000" className="bg-white/10 border-white/20" />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label className="text-purple-200 flex items-center"><FileText className="h-4 w-4 mr-2" />CPF/Documento</Label>
                        <Input name="document_id" value={formData.document_id} onChange={handleChange} placeholder="CPF ou outro documento" className="bg-white/10 border-white/20" />
                    </div>
                     <div className="space-y-2">
                        <Label className="text-purple-200 flex items-center"><Calendar className="h-4 w-4 mr-2" />Agendar 1ª Avaliação (Opcional)</Label>
                        <Input name="appointment_date" type="datetime-local" value={formData.appointment_date} onChange={handleChange} className="bg-white/10 border-white/20" />
                    </div>
                    <DialogFooter className="pt-4">
                        <Button type="button" onClick={handleClose} variant="outline" className="text-purple-200 border-purple-400 hover:bg-purple-400/10 hover:text-white">
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                            {loading ? <Loader2 className="animate-spin" /> : 'Salvar Paciente'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default NewPatientDialog;
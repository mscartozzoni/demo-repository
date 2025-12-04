import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, User, Mail, Phone } from 'lucide-react';

const NewContactDialog = ({ isOpen, onClose, onContactCreated }) => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) {
            toast({ variant: "destructive", title: "Erro", description: "O nome é obrigatório." });
            return;
        }
        setLoading(true);

        // Mock contact creation
        setTimeout(() => {
            setLoading(false);
            toast({ title: "Sucesso!", description: `Contato ${formData.name} criado (simulação).` });
            if (onContactCreated) onContactCreated();
            handleClose();
        }, 500);
    };

    const handleClose = () => {
        setFormData({ name: '', email: '', phone: '' });
        setLoading(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-gray-900/50 backdrop-blur-xl border-white/20 text-white">
                <DialogHeader>
                    <DialogTitle>Novo Contato (Lead)</DialogTitle>
                    <DialogDescription className="text-purple-300">
                        Preencha os dados para criar um novo lead no sistema.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label className="text-purple-200 flex items-center"><User className="h-4 w-4 mr-2" />Nome</Label>
                        <Input name="name" value={formData.name} onChange={handleChange} placeholder="Nome do Contato" className="bg-white/10 border-white/20" required />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-purple-200 flex items-center"><Mail className="h-4 w-4 mr-2" />E-mail</Label>
                        <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="email@exemplo.com" className="bg-white/10 border-white/20" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-purple-200 flex items-center"><Phone className="h-4 w-4 mr-2" />Telefone</Label>
                        <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="(00) 90000-0000" className="bg-white/10 border-white/20" />
                    </div>
                    <DialogFooter className="pt-4">
                        <Button type="button" onClick={handleClose} variant="outline" className="text-purple-200 border-purple-400 hover:bg-purple-400/10 hover:text-white">
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                            {loading ? <Loader2 className="animate-spin" /> : 'Salvar Contato'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default NewContactDialog;
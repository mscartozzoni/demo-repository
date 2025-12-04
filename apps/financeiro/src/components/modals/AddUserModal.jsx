import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Mail, User, Shield } from 'lucide-react';

const AddUserModal = ({ isOpen, onClose, onUserAdded }) => {
    const [formData, setFormData] = useState({ email: '', full_name: '', role: 'viewer' });
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRoleChange = (value) => {
        setFormData(prev => ({ ...prev, role: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.full_name) {
            toast({ variant: "destructive", title: "Erro", description: "E-mail e nome são obrigatórios." });
            return;
        }
        setLoading(true);

        // Mock user invitation
        setTimeout(() => {
            toast({ title: "Sucesso!", description: `Convite enviado para ${formData.email} (simulação).` });
            if (onUserAdded) onUserAdded();
            handleClose();
            setLoading(false);
        }, 1000);
    };

    const handleClose = () => {
        setFormData({ email: '', full_name: '', role: 'viewer' });
        setLoading(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-gray-900/50 backdrop-blur-xl border-white/20 text-white">
                <DialogHeader>
                    <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                    <DialogDescription className="text-purple-300">
                        Convide um novo usuário para o portal e defina sua função.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label className="text-purple-200 flex items-center"><Mail className="h-4 w-4 mr-2" />E-mail</Label>
                        <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="email@exemplo.com" className="bg-white/10 border-white/20" required />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-purple-200 flex items-center"><User className="h-4 w-4 mr-2" />Nome Completo</Label>
                        <Input name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Nome do Usuário" className="bg-white/10 border-white/20" required />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-purple-200 flex items-center"><Shield className="h-4 w-4 mr-2" />Função (Role)</Label>
                        <Select onValueChange={handleRoleChange} value={formData.role}>
                            <SelectTrigger className="w-full bg-white/10 border-white/20">
                                <SelectValue placeholder="Selecione a função" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Administrador</SelectItem>
                                <SelectItem value="editor">Editor</SelectItem>
                                <SelectItem value="viewer">Visualizador</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter className="pt-4">
                        <Button type="button" onClick={handleClose} variant="outline" className="text-purple-200 border-purple-400 hover:bg-purple-400/10 hover:text-white">
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                            {loading ? <Loader2 className="animate-spin" /> : 'Enviar Convite'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddUserModal;
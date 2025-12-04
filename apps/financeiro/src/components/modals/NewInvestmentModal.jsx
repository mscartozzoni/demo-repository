import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, DollarSign, Calendar, Percent, Type } from 'lucide-react';
import { useSession } from '@/contexts/SessionContext';

const mockInvestmentTypes = [
    { id: 'it1', name: 'Renda Fixa' },
    { id: 'it2', name: 'Renda Variável' },
    { id: 'it3', name: 'Outros' },
];

const NewInvestmentModal = ({ isOpen, onClose, onInvestmentCreated }) => {
    const [formData, setFormData] = useState({
        name: '',
        type_id: '',
        initial_amount: '',
        start_date: new Date().toISOString().slice(0, 10),
        annual_rate: ''
    });
    const [investmentTypes, setInvestmentTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const { user } = useSession();

    useEffect(() => {
        if (isOpen) {
            setInvestmentTypes(mockInvestmentTypes);
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value) => {
        setFormData(prev => ({ ...prev, type_id: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { name, type_id, initial_amount, start_date, annual_rate } = formData;

        if (!name || !type_id || !initial_amount || !start_date || !annual_rate) {
            toast({ variant: "destructive", title: "Erro de Validação", description: "Todos os campos são obrigatórios." });
            setLoading(false);
            return;
        }

        // Mock investment creation
        setTimeout(() => {
            toast({ title: "Sucesso!", description: `Investimento "${name}" criado (simulação).` });
            onInvestmentCreated();
            handleClose();
        }, 800);
    };

    const handleClose = () => {
        setFormData({
            name: '',
            type_id: '',
            initial_amount: '',
            start_date: new Date().toISOString().slice(0, 10),
            annual_rate: ''
        });
        setLoading(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-gray-900/50 backdrop-blur-xl border-white/20 text-white">
                <DialogHeader>
                    <DialogTitle>Novo Investimento</DialogTitle>
                    <DialogDescription className="text-purple-300">
                        Registre um novo ativo em seu portfólio.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label className="text-purple-200">Nome do Investimento</Label>
                        <Input name="name" value={formData.name} onChange={handleChange} placeholder="Ex: CDB Banco X, Ações Y" className="bg-white/10 border-white/20" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-purple-200 flex items-center"><Type className="h-4 w-4 mr-2" />Tipo</Label>
                            <Select onValueChange={handleSelectChange} value={formData.type_id}>
                                <SelectTrigger className="w-full bg-white/10 border-white/20">
                                    <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {investmentTypes.map(type => <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-purple-200 flex items-center"><Calendar className="h-4 w-4 mr-2" />Data de Início</Label>
                            <Input type="date" name="start_date" value={formData.start_date} onChange={handleChange} className="bg-white/10 border-white/20" required />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-purple-200 flex items-center"><DollarSign className="h-4 w-4 mr-2" />Aporte Inicial (R$)</Label>
                            <Input type="number" name="initial_amount" value={formData.initial_amount} onChange={handleChange} placeholder="1000.00" className="bg-white/10 border-white/20" required />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-purple-200 flex items-center"><Percent className="h-4 w-4 mr-2" />Taxa Anual (%)</Label>
                            <Input type="number" name="annual_rate" value={formData.annual_rate} onChange={handleChange} placeholder="12.5" className="bg-white/10 border-white/20" required />
                        </div>
                    </div>
                    <DialogFooter className="pt-4">
                        <Button type="button" onClick={handleClose} variant="outline" className="text-purple-200 border-purple-400 hover:bg-purple-400/10 hover:text-white">
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                            {loading ? <Loader2 className="animate-spin" /> : 'Salvar Investimento'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default NewInvestmentModal;
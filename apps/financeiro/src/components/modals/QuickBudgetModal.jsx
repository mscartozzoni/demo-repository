import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import { useServices, useServiceClasses } from '@/hooks/useServices';
import { useBudgets } from '@/hooks/useBudgets';

const QuickBudgetModal = ({ isOpen, onClose, onSave, patient: preselectedPatient }) => {
    const [patientId, setPatientId] = useState('');
    const [serviceId, setServiceId] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [notes, setNotes] = useState('');
    
    const { patients, searchPatients } = usePatients();
    const { serviceClasses } = useServiceClasses();
    const [selectedClassId, setSelectedClassId] = useState('');
    const { services: allServices } = useServices(selectedClassId);
    
    const { createBudget } = useBudgets();
    
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (isOpen) {
            searchPatients('');
            if (preselectedPatient) {
                setPatientId(preselectedPatient.id);
            }
             if (serviceClasses.length > 0 && !selectedClassId) {
                setSelectedClassId(serviceClasses[0].id);
            }
        }
    }, [preselectedPatient, isOpen, serviceClasses, selectedClassId, searchPatients]);

    const handleServiceChange = (id) => {
        setServiceId(id);
        const selectedService = allServices.find(s => s.id === id);
        if (selectedService) {
            setTotalAmount(selectedService.basePrice);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const subtotal = parseFloat(totalAmount);
        const selectedPatient = patients.find(p => p.id === patientId);
        const selectedService = allServices.find(s => s.id === serviceId);

        if (!selectedPatient || !selectedService || isNaN(subtotal) || subtotal <= 0) {
            toast({ variant: 'destructive', title: 'Erro de Validação', description: 'Por favor, preencha todos os campos obrigatórios.' });
            setLoading(false);
            return;
        }
        
        const budgetData = {
            patients: { full_name: selectedPatient.full_name, email: selectedPatient.email },
            services: { name: selectedService.name, type: selectedService.service_class_id === 'sc1' ? 'surgical' : 'aesthetic' },
            total: subtotal,
            notes: notes || `Orçamento rápido para ${selectedService.name}.`,
            status: 'draft',
            payment_status: 'pending',
        };
        
        await createBudget(budgetData);
        
        toast({ title: 'Sucesso!', description: 'Orçamento rápido criado e salvo.', variant: 'success' });
        onSave();
        handleClose();
        setLoading(false);
    };
    
    const handleClose = () => {
        setPatientId('');
        setServiceId('');
        setTotalAmount('');
        setNotes('');
        setSelectedClassId('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
             <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[101]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-gray-900/50 backdrop-blur-xl border border-white/20 rounded-2xl p-8 w-full max-w-lg relative"
                >
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold text-white">Orçamento Rápido</h2>
                        <p className="text-purple-200 mt-2">Crie um orçamento para procedimentos de forma ágil.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label className="text-purple-200">Paciente</Label>
                            <Select onValueChange={setPatientId} value={patientId} disabled={!!preselectedPatient || loading}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione o paciente" />
                                </SelectTrigger>
                                <SelectContent>
                                    {patients.map(p => <SelectItem key={p.id} value={p.id}>{p.full_name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-purple-200">Classe do Procedimento</Label>
                            <Select onValueChange={setSelectedClassId} value={selectedClassId} disabled={loading}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione a classe" />
                                </SelectTrigger>
                                <SelectContent>
                                    {serviceClasses.map(sc => <SelectItem key={sc.id} value={sc.id}>{sc.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-purple-200">Procedimento</Label>
                            <Select onValueChange={handleServiceChange} value={serviceId} disabled={loading || !selectedClassId}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione o serviço" />
                                </SelectTrigger>
                                <SelectContent>
                                    {allServices.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                         <div>
                            <Label className="text-purple-200">Valor Total (R$)</Label>
                            <Input
                                type="number"
                                placeholder="0,00"
                                value={totalAmount}
                                onChange={(e) => setTotalAmount(e.target.value)}
                                className="bg-white/10 border-white/20 text-white"
                                required
                            />
                        </div>
                        <div>
                            <Label className="text-purple-200">Observações</Label>
                            <Input
                                placeholder="Notas adicionais (opcional)"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="bg-white/10 border-white/20 text-white"
                            />
                        </div>
                        <div className="flex justify-end space-x-4 pt-4">
                            <Button type="button" onClick={handleClose} variant="outline" className="text-purple-200 border-purple-400 hover:bg-purple-400/10 hover:text-white">
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                                {loading ? <Loader2 className="animate-spin" /> : 'Salvar Orçamento'}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </Dialog>
    );
};

export default QuickBudgetModal;
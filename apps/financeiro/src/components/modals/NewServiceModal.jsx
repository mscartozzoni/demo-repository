import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { X, Type, DollarSign, Percent, Gift, PiggyBank, Briefcase as BriefcaseMedical, ArrowRight, ArrowLeft } from 'lucide-react';

const ServiceDetailsStep = ({ formData, setFormData, onNext }) => (
    <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className="space-y-6">
        <div className="space-y-2">
            <Label className="text-purple-200 flex items-center"><Type className="h-4 w-4 mr-2" />Nome do Procedimento</Label>
            <Input name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Ex: Lipoaspiração de Abdômen" className="bg-white/10 border-white/20 text-white" required />
        </div>
        <div className="space-y-2">
            <Label className="text-purple-200">Descrição</Label>
            <Textarea name="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Descreva o procedimento..." className="bg-white/10 border-white/20 text-white" />
        </div>
        <div className="flex justify-end pt-4">
            <Button onClick={onNext} disabled={!formData.name} className="bg-gradient-to-r from-purple-500 to-pink-500">
                Configuração Financeira <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
        </div>
    </motion.div>
);

const FinancialSetupStep = ({ formData, setFormData, calculatedBasePrice, onBack, onSubmit, loading }) => {
    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value === '' ? '' : parseFloat(value) }));
    };

    return (
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div className="space-y-2 col-span-2">
                    <h3 className="text-xl font-semibold text-teal-300">Componentes do Preço</h3>
                </div>
                <div className="space-y-2">
                    <Label className="text-purple-200 flex items-center"><BriefcaseMedical className="h-4 w-4 mr-2" />Repasse Médico (Base)</Label>
                    <Input type="number" name="medical_fee" value={formData.medical_fee} onChange={handleNumberChange} className="bg-white/10 border-white/20 text-white" />
                </div>
                <div className="space-y-2">
                    <Label className="text-purple-200 flex items-center"><Percent className="h-4 w-4 mr-2" />% da Clínica</Label>
                    <Input type="number" name="clinic_percentage" value={formData.clinic_percentage} onChange={handleNumberChange} className="bg-white/10 border-white/20 text-white" />
                </div>
                <div className="space-y-2">
                    <Label className="text-purple-200 flex items-center"><Percent className="h-4 w-4 mr-2" />% de Lucro</Label>
                    <Input type="number" name="profit_percentage" value={formData.profit_percentage} onChange={handleNumberChange} className="bg-white/10 border-white/20 text-white" />
                </div>
                <div className="space-y-2">
                    <Label className="text-purple-200 flex items-center"><Gift className="h-4 w-4 mr-2" />Bônus Fixo Equipe</Label>
                    <Input type="number" name="employee_bonus_fixed" value={formData.employee_bonus_fixed} onChange={handleNumberChange} className="bg-white/10 border-white/20 text-white" />
                </div>
                <div className="space-y-2">
                    <Label className="text-purple-200 flex items-center"><DollarSign className="h-4 w-4 mr-2" />Custos Fixos</Label>
                    <Input type="number" name="fixed_costs" value={formData.fixed_costs} onChange={handleNumberChange} className="bg-white/10 border-white/20 text-white" />
                </div>
                <div className="space-y-2">
                    <Label className="text-purple-200 flex items-center"><Percent className="h-4 w-4 mr-2" />% Custos Variáveis</Label>
                    <Input type="number" name="variable_costs_percentage" value={formData.variable_costs_percentage} onChange={handleNumberChange} className="bg-white/10 border-white/20 text-white" />
                </div>
                <div className="space-y-2">
                    <Label className="text-purple-200 flex items-center"><PiggyBank className="h-4 w-4 mr-2" />Valor do Sinal (Entrada)</Label>
                    <Input type="number" name="depositFixed" value={formData.depositFixed} onChange={handleNumberChange} className="bg-white/10 border-white/20 text-white" />
                </div>
                <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-black/30 col-span-2 md:col-span-1">
                    <Label className="text-purple-200 mb-2">Preço Final Calculado</Label>
                    <p className="text-4xl font-bold text-green-400">
                        R$ {calculatedBasePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
            </div>
            <div className="flex justify-between items-center pt-4">
                <Button type="button" onClick={onBack} variant="outline" className="text-purple-200 border-purple-400 hover:bg-purple-400/10 hover:text-white">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
                </Button>
                <Button type="button" onClick={onSubmit} disabled={loading} className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                    {loading ? 'Salvando...' : 'Salvar Serviço'}
                </Button>
            </div>
        </motion.div>
    );
};


const NewServiceModal = ({ isOpen, onClose, onServiceCreated, serviceClass }) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        medical_fee: 0,
        clinic_percentage: 10,
        profit_percentage: 20,
        employee_bonus_fixed: 0,
        fixed_costs: 0,
        variable_costs_percentage: 0,
        depositFixed: 0,
        active: true,
    });

    const calculatedBasePrice = useMemo(() => {
        const medicalFee = parseFloat(formData.medical_fee) || 0;
        const clinicPercentage = parseFloat(formData.clinic_percentage) || 0;
        const profitPercentage = parseFloat(formData.profit_percentage) || 0;
        const employeeBonus = parseFloat(formData.employee_bonus_fixed) || 0;
        const fixedCosts = parseFloat(formData.fixed_costs) || 0;
        const variableCostsPercentage = parseFloat(formData.variable_costs_percentage) || 0;
        const clinicValue = medicalFee * (clinicPercentage / 100);
        const profitValue = medicalFee * (profitPercentage / 100);
        const variableCostsValue = medicalFee * (variableCostsPercentage / 100);
        return medicalFee + clinicValue + profitValue + employeeBonus + fixedCosts + variableCostsValue;
    }, [formData]);

    const handleClose = () => {
        setFormData({
            name: '', description: '', medical_fee: 0, clinic_percentage: 10, profit_percentage: 20, employee_bonus_fixed: 0, fixed_costs: 0, variable_costs_percentage: 0, depositFixed: 0, active: true,
        });
        setStep(1);
        onClose();
    };

    const handleSubmit = async () => {
        setLoading(true);
        const submissionData = { ...formData, basePrice: calculatedBasePrice, service_class_id: serviceClass.id };
        const { error } = await onServiceCreated(submissionData);
        if (error) {
            toast({ variant: 'destructive', title: 'Erro ao criar serviço', description: error.message });
        } else {
            handleClose();
        }
        setLoading(false);
    };

    if (!isOpen || !serviceClass) return null;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-gray-900/50 backdrop-blur-xl border border-white/20 rounded-2xl p-8 w-full max-w-2xl relative"
                >
                    <Button variant="ghost" size="icon" onClick={handleClose} className="absolute top-4 right-4 text-purple-300 hover:text-white">
                        <X className="h-6 w-6" />
                    </Button>
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold text-white">Novo Serviço em "{serviceClass.name}"</h2>
                        <p className="text-purple-200 mt-2">{step === 1 ? 'Primeiro, os detalhes básicos do procedimento.' : 'Agora, defina a composição de preço.'}</p>
                    </div>

                    {step === 1 ? (
                        <ServiceDetailsStep formData={formData} setFormData={setFormData} onNext={() => setStep(2)} />
                    ) : (
                        <FinancialSetupStep 
                            formData={formData} 
                            setFormData={setFormData}
                            calculatedBasePrice={calculatedBasePrice}
                            onBack={() => setStep(1)} 
                            onSubmit={handleSubmit}
                            loading={loading}
                        />
                    )}
                </motion.div>
            </div>
        </Dialog>
    );
};

export default NewServiceModal;
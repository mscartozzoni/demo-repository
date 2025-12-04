import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useServiceClasses, useServices } from '@/hooks/useServices';
import { useHospitalData, useBudgets } from '@/hooks/useBudgets';
import { useToast } from '@/components/ui/use-toast';
import { X, ArrowRight, ArrowLeft, Loader2, User, Stethoscope, Hotel as Hospital, Beaker, PlusCircle, Trash2, DollarSign } from 'lucide-react';

const NewBudgetModal = ({ isOpen, onClose, onBudgetCreated, patient }) => {
    const [step, setStep] = useState(1);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedService, setSelectedService] = useState(null);
    const [selectedHospitalId, setSelectedHospitalId] = useState('');
    const [showSpecialMaterials, setShowSpecialMaterials] = useState(false);
    const [specialMaterials, setSpecialMaterials] = useState([]);
    const [newMaterialName, setNewMaterialName] = useState('');
    const [newMaterialValue, setNewMaterialValue] = useState('');

    const { serviceClasses } = useServiceClasses();
    const { services, loading: servicesLoading } = useServices(selectedClassId);
    const { hospitals, getHospitalCost } = useHospitalData();
    const { createBudget } = useBudgets();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (serviceClasses.length > 0 && !selectedClassId) {
            setSelectedClassId(serviceClasses[0].id);
        }
    }, [serviceClasses, selectedClassId]);

    const hospitalCost = useMemo(() => {
        if (!selectedService || !selectedHospitalId) return 0;
        return getHospitalCost(selectedService.id, selectedHospitalId);
    }, [selectedService, selectedHospitalId, getHospitalCost]);

    const materialsCost = useMemo(() => {
        return specialMaterials.reduce((total, item) => total + (parseFloat(item.value) || 0), 0);
    }, [specialMaterials]);

    const totalCost = useMemo(() => {
        const servicePrice = selectedService?.basePrice || 0;
        const scienceFee = selectedService?.science_fee || 0;
        return servicePrice + hospitalCost + materialsCost + scienceFee;
    }, [selectedService, hospitalCost, materialsCost]);

    const handleNextStep = () => setStep(2);
    const handlePrevStep = () => setStep(1);

    const resetState = () => {
        setStep(1);
        setSelectedClassId(serviceClasses.length > 0 ? serviceClasses[0].id : '');
        setSelectedService(null);
        setSelectedHospitalId('');
        setShowSpecialMaterials(false);
        setSpecialMaterials([]);
        setNewMaterialName('');
        setNewMaterialValue('');
        setIsSaving(false);
    };

    const handleClose = () => {
        resetState();
        onClose();
    };

    const handleAddMaterial = () => {
        if (newMaterialName && newMaterialValue) {
            setSpecialMaterials([...specialMaterials, { name: newMaterialName, value: parseFloat(newMaterialValue) }]);
            setNewMaterialName('');
            setNewMaterialValue('');
        }
    };

    const handleRemoveMaterial = (index) => {
        setSpecialMaterials(specialMaterials.filter((_, i) => i !== index));
    };

    const handleSaveBudget = async () => {
        setIsSaving(true);
        const budgetData = {
            patients: { full_name: patient.full_name },
            services: { name: selectedService.name, type: selectedService.service_class_id === 'sc1' ? 'surgical' : 'aesthetic' },
            total: totalCost,
            notes: `Hospital: ${hospitals.find(h => h.id === selectedHospitalId)?.name || 'N/A'}. Materiais: ${specialMaterials.map(m => `${m.name} (R$${m.value})`).join(', ')}`,
        };
        
        await new Promise(res => setTimeout(res, 500)); // Simulate API call
        createBudget(budgetData);

        toast({
            title: "Orçamento Criado!",
            description: `Um novo orçamento para ${patient.full_name} foi salvo.`,
            className: "bg-green-600 text-white"
        });
        setIsSaving(false);
        onBudgetCreated();
        handleClose();
    };

    if (!isOpen) return null;

    const renderStepOne = () => (
        <motion.div key="step1" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className="space-y-6">
            <div className="text-center">
                <h3 className="text-2xl font-bold text-white">Novo Orçamento Rápido</h3>
                <p className="text-purple-200">Etapa 1 de 2: Selecione o Serviço</p>
            </div>
             <div className="p-4 rounded-lg bg-black/20 text-center">
                 <p className="text-sm text-purple-300">Paciente</p>
                <h4 className="font-semibold text-lg text-white">{patient.full_name}</h4>
            </div>
            <div>
                <Label className="text-pink-200 font-semibold mb-2 block">Classe de Serviço</Label>
                <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                    <SelectTrigger><SelectValue placeholder="Selecione a classe" /></SelectTrigger>
                    <SelectContent>{serviceClasses.map(sc => <SelectItem key={sc.id} value={sc.id}>{sc.name}</SelectItem>)}</SelectContent>
                </Select>
            </div>
            <div>
                <Label className="text-pink-200 font-semibold mb-2 block">Serviço Indicado</Label>
                <Select
                    value={selectedService?.id || ''}
                    onValueChange={(id) => setSelectedService(services.find(s => s.id === id))}
                    disabled={servicesLoading || !selectedClassId}
                >
                    <SelectTrigger><SelectValue placeholder={servicesLoading ? "Carregando..." : "Selecione o serviço"} /></SelectTrigger>
                    <SelectContent>
                        {servicesLoading ? <div className="flex items-center justify-center p-4"><Loader2 className="h-5 w-5 animate-spin" /></div>
                            : services.filter(s => s.active).map(service => <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex justify-end pt-4">
                <Button onClick={handleNextStep} disabled={!selectedService} className="bg-gradient-to-r from-purple-500 to-pink-500">
                    Avançar <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
            </div>
        </motion.div>
    );

    const renderStepTwo = () => (
         <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
            <div className="text-center">
                <h3 className="text-2xl font-bold text-white">Novo Orçamento Rápido</h3>
                <p className="text-purple-200">Etapa 2 de 2: Custos Adicionais</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                     <div>
                        <Label className="text-cyan-200 font-semibold mb-2 block">Hospital</Label>
                        <Select value={selectedHospitalId} onValueChange={setSelectedHospitalId} disabled={!selectedService}>
                            <SelectTrigger><SelectValue placeholder="Selecione o hospital" /></SelectTrigger>
                            <SelectContent>{hospitals.map(h => <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                     <div className="flex items-center justify-between mt-4">
                        <Label htmlFor="special-materials-switch" className="text-yellow-200 font-semibold">Adicionar Materiais Especiais?</Label>
                        <Switch id="special-materials-switch" checked={showSpecialMaterials} onCheckedChange={setShowSpecialMaterials} />
                    </div>

                    {showSpecialMaterials && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2 bg-black/20 p-4 rounded-lg">
                           {specialMaterials.map((item, index) => (
                                <div key={index} className="flex items-center justify-between text-sm">
                                    <span className="text-white">{item.name}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-yellow-300">R$ {item.value.toFixed(2)}</span>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400" onClick={() => handleRemoveMaterial(index)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                             <div className="flex gap-2 items-center pt-2 border-t border-white/10">
                                <Input value={newMaterialName} onChange={(e) => setNewMaterialName(e.target.value)} placeholder="Nome do material" className="bg-white/10 text-xs h-8" />
                                <Input type="number" value={newMaterialValue} onChange={(e) => setNewMaterialValue(e.target.value)} placeholder="Valor" className="bg-white/10 text-xs h-8 w-24" />
                                <Button size="icon" className="h-8 w-8 bg-yellow-500 hover:bg-yellow-600 flex-shrink-0" onClick={handleAddMaterial}>
                                    <PlusCircle className="h-4 w-4" />
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </div>

                <div className="bg-black/30 p-4 rounded-lg flex flex-col justify-between">
                    <h4 className="font-bold text-white mb-4">Resumo do Custo</h4>
                    <div className="space-y-2 text-sm flex-grow">
                        <div className="flex justify-between items-center"><span className="flex items-center gap-2 text-purple-200"><Stethoscope/>Serviço</span> <span className="text-white">R$ {selectedService?.basePrice.toFixed(2) || '0.00'}</span></div>
                        <div className="flex justify-between items-center"><span className="flex items-center gap-2 text-cyan-200"><Hospital/>Hospital</span> <span className="text-white">R$ {hospitalCost.toFixed(2)}</span></div>
                        <div className="flex justify-between items-center"><span className="flex items-center gap-2 text-yellow-200"><PlusCircle/>Materiais</span> <span className="text-white">R$ {materialsCost.toFixed(2)}</span></div>
                        <div className="flex justify-between items-center"><span className="flex items-center gap-2 text-green-300"><Beaker/>Taxa Científica</span> <span className="text-white">R$ {(selectedService?.science_fee || 0).toFixed(2)}</span></div>
                    </div>
                     <div className="border-t border-white/20 pt-3 mt-3">
                        <div className="flex justify-between items-center text-xl font-bold">
                            <span className="text-white">TOTAL</span>
                            <span className="text-green-400">R$ {totalCost.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
             <div className="flex justify-between items-center pt-4">
                <Button onClick={handlePrevStep} variant="outline" className="text-purple-200 border-purple-400 hover:bg-purple-400/10"><ArrowLeft className="h-4 w-4 mr-2" />Voltar</Button>
                <Button onClick={handleSaveBudget} disabled={isSaving || !selectedService} className="bg-gradient-to-r from-green-500 to-emerald-500">
                    {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <DollarSign className="h-4 w-4 mr-2" />}
                    {isSaving ? 'Salvando...' : 'Salvar Orçamento'}
                </Button>
            </div>
        </motion.div>
    );

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
             <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-gray-900/50 backdrop-blur-xl border border-white/20 rounded-2xl p-8 w-full max-w-3xl relative"
                >
                    <Button variant="ghost" size="icon" onClick={handleClose} className="absolute top-4 right-4 text-purple-300 hover:text-white"><X className="h-6 w-6" /></Button>
                    <AnimatePresence mode="wait">
                        {step === 1 ? renderStepOne() : renderStepTwo()}
                    </AnimatePresence>
                </motion.div>
            </div>
        </Dialog>
    );
};

export default NewBudgetModal;
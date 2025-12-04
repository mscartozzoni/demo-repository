import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, DollarSign, Percent, Gift, Briefcase as BriefcaseMedical, ChevronRight, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useServiceClasses, useServices } from '@/hooks/useServices';
import { useToast } from '@/components/ui/use-toast';
import * as Icons from 'lucide-react';
import NewServiceClassModal from '@/components/modals/NewServiceClassModal';
import NewServiceModal from '@/components/modals/NewServiceModal';

const getIcon = (name) => {
    const Icon = Icons[name];
    return Icon ? <Icon className="h-8 w-8 text-white" /> : <Layers className="h-8 w-8 text-white" />;
};

const ServiceClassCard = ({ serviceClass, onClick, onAddService }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.03, y: -5 }}
        className="bg-white/10 backdrop-blur-lg border-white/20 rounded-2xl p-6 cursor-pointer group"
        onClick={onClick}
    >
        <div className="flex justify-between items-start">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-xl mb-4 shadow-lg">
                {getIcon(serviceClass.icon)}
            </div>
             <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-purple-400 text-purple-300 hover:bg-purple-400/20 hover:text-white transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                onClick={(e) => { e.stopPropagation(); onAddService(); }}
            >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
            </Button>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{serviceClass.name}</h3>
        <p className="text-purple-200 text-sm mb-4 h-10">{serviceClass.description || 'Gerencie os serviços desta categoria.'}</p>
        <div className="flex items-center text-cyan-300 group-hover:text-cyan-200 transition-colors">
            <span>Ver Detalhes</span>
            <ChevronRight className="h-5 w-5 ml-1 transform group-hover:translate-x-1 transition-transform" />
        </div>
    </motion.div>
);

const ServiceDetailCard = ({ service, onUpdateStatus, onDelete }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="h-full"
    >
        <Card className="bg-white/5 backdrop-blur-lg border-white/10 p-6 h-full flex flex-col justify-between hover:border-white/20 transition-all duration-300">
            <div>
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-white mb-2">{service.name}</h3>
                    <Badge className={service.active ? 'bg-green-500/80 text-white' : 'bg-red-500/80 text-white'}>
                        {service.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                </div>
                <p className="text-purple-300 text-sm mb-4 min-h-[40px]">{service.description || 'Sem descrição.'}</p>
                
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-white">
                        <span className="text-purple-200 text-sm">Preço Final</span>
                        <span className="font-semibold text-lg text-green-300">R$ {Number(service.basePrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                     <div className="flex items-center justify-between text-white text-sm">
                        <span className="text-purple-300">Sinal</span>
                        <span className="text-purple-100">R$ {Number(service.depositFixed).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-xs">
                    <p className="text-md font-bold text-teal-200 mb-2">Composição do Valor</p>
                     <div className="flex items-center justify-between text-purple-200">
                        <div className="flex items-center space-x-2"><BriefcaseMedical className="h-4 w-4" /><span>Repasse Médico</span></div>
                        <span>R$ {Number(service.medical_fee).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex items-center justify-between text-purple-200">
                        <div className="flex items-center space-x-2"><Percent className="h-4 w-4" /><span>% Clínica</span></div>
                        <span>{service.clinic_percentage}%</span>
                    </div>
                    <div className="flex items-center justify-between text-purple-200">
                        <div className="flex items-center space-x-2"><Percent className="h-4 w-4" /><span>% Lucro</span></div>
                        <span>{service.profit_percentage}%</span>
                    </div>
                     <div className="flex items-center justify-between text-purple-200">
                        <div className="flex items-center space-x-2"><DollarSign className="h-4 w-4" /><span>Custos Fixos</span></div>
                        <span>R$ {Number(service.fixed_costs).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex items-center justify-between text-purple-200">
                        <div className="flex items-center space-x-2"><Percent className="h-4 w-4" /><span>% Custos Variáveis</span></div>
                        <span>{service.variable_costs_percentage}%</span>
                    </div>
                    <div className="flex items-center justify-between text-purple-200">
                        <div className="flex items-center space-x-2"><Gift className="h-4 w-4" /><span>Bônus Fixo</span></div>
                        <span>R$ {Number(service.employee_bonus_fixed).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>
            </div>
            <div className="flex justify-end items-center space-x-2 mt-6">
                <Button size="icon" variant="ghost" className="text-purple-300 hover:text-white h-8 w-8" onClick={() => onUpdateStatus(service.id, !service.active)}>
                    {service.active ? <ToggleLeft className="h-5 w-5" /> : <ToggleRight className="h-5 w-5" />}
                </Button>
                <Button size="icon" variant="ghost" className="text-red-400 hover:text-red-300 h-8 w-8" onClick={() => onDelete(service.id)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </Card>
    </motion.div>
);

const Services = () => {
    const { toast } = useToast();
    const { serviceClasses, loading: loadingClasses, addServiceClass, refetch: refetchClasses } = useServiceClasses();
    const [selectedClass, setSelectedClass] = useState(null);
    const { services, loading: loadingServices, addService, updateService, deleteService, refetch: refetchServices } = useServices(selectedClass?.id);

    const [isNewClassModalOpen, setNewClassModalOpen] = useState(false);
    const [isNewServiceModalOpen, setNewServiceModalOpen] = useState(false);
    
    const handleClassCreated = async (classData) => {
        const result = await addServiceClass(classData);
        if (result) {
            toast({ title: "Sucesso!", description: `Classe "${classData.name}" criada (simulação).` });
            refetchClasses();
        } else {
            toast({ variant: "destructive", title: "Erro", description: "Não foi possível criar a classe de serviço." });
        }
    };

    const handleServiceCreated = async (serviceData) => {
      await addService(serviceData);
      toast({ title: 'Sucesso!', description: 'Novo serviço criado (simulação).' });
      refetchServices();
      return { error: null };
    };

    const handleUpdateServiceStatus = async (id, newStatus) => {
        await updateService(id, { active: newStatus });
        toast({ title: `Status do serviço alterado (simulação).` });
    };

    const handleDeleteService = async (id) => {
        await deleteService(id);
        toast({ title: "Serviço removido com sucesso (simulação)." });
    };

    if (selectedClass) {
        return (
            <motion.div
                key={`detail-${selectedClass.id}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <Button variant="ghost" onClick={() => setSelectedClass(null)} className="text-purple-300 hover:text-white mb-2 -ml-4">
                            <ChevronRight className="h-5 w-5 mr-1 transform rotate-180" /> Voltar
                        </Button>
                        <h2 className="text-3xl font-bold text-white">{selectedClass.name}</h2>
                        <p className="text-purple-200 mt-2">{selectedClass.description}</p>
                    </div>
                     <Button 
                        onClick={() => setNewServiceModalOpen(true)}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Serviço
                    </Button>
                </div>
                {loadingServices && <p className="text-purple-200 text-center">Carregando serviços...</p>}
                {!loadingServices && services.length === 0 && (
                    <div className="text-center py-16 bg-white/5 rounded-lg">
                        <h3 className="text-xl text-white">Nenhum serviço cadastrado</h3>
                        <p className="text-purple-300">Adicione o primeiro serviço para esta classe.</p>
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map(service => (
                        <ServiceDetailCard 
                            key={service.id} 
                            service={service} 
                            onUpdateStatus={handleUpdateServiceStatus}
                            onDelete={handleDeleteService}
                        />
                    ))}
                </div>
                 <NewServiceModal
                    isOpen={isNewServiceModalOpen}
                    onClose={() => setNewServiceModalOpen(false)}
                    onServiceCreated={handleServiceCreated}
                    serviceClass={selectedClass}
                />
            </motion.div>
        )
    }

    return (
        <motion.div
            key="services-overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white">Catálogo de Serviços</h2>
                    <p className="text-purple-200 mt-2">Gerencie os serviços oferecidos pela clínica.</p>
                </div>
                <Button 
                    onClick={() => setNewClassModalOpen(true)}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Classe de Serviço
                </Button>
            </div>
            
            {loadingClasses && <p className="text-purple-200 text-center">Carregando classes de serviço...</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {serviceClasses.map(sc => (
                    <ServiceClassCard 
                        key={sc.id} 
                        serviceClass={sc} 
                        onClick={() => setSelectedClass(sc)}
                        onAddService={() => { setSelectedClass(sc); setNewServiceModalOpen(true); }}
                    />
                ))}
            </div>

            <NewServiceClassModal 
                isOpen={isNewClassModalOpen}
                onClose={() => setNewClassModalOpen(false)}
                onClassCreated={handleClassCreated}
            />
            <NewServiceModal
                isOpen={isNewServiceModalOpen}
                onClose={() => setNewServiceModalOpen(false)}
                onServiceCreated={handleServiceCreated}
                serviceClass={selectedClass}
            />
        </motion.div>
    );
};

export default Services;
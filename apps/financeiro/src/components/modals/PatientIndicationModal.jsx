import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useServiceClasses, useServices } from '@/hooks/useServices';
import { Stethoscope, User, FileText, Loader2 } from 'lucide-react';

const PatientIndicationModal = ({ isOpen, onClose, patient, onSubmit }) => {
  const { serviceClasses } = useServiceClasses();
  const [selectedClassId, setSelectedClassId] = useState('');
  const { services, loading: servicesLoading } = useServices(selectedClassId);
  const [selectedServiceId, setSelectedServiceId] = useState('');

  useEffect(() => {
    if (serviceClasses.length > 0) {
      setSelectedClassId(serviceClasses[0].id);
    }
  }, [serviceClasses]);


  useEffect(() => {
    setSelectedServiceId('');
  }, [selectedClassId]);

  if (!isOpen || !patient) return null;

  const handleSubmit = () => {
    const selectedService = services.find(s => s.id === selectedServiceId);
    if (selectedService) {
      onSubmit(selectedService);
    }
  };
  
  const activeServices = services.filter(s => s.active);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-8 w-full max-w-lg shadow-2xl"
        >
            <div className="flex items-center space-x-4 mb-6">
                <div className="bg-gradient-to-r from-pink-500 to-orange-500 p-3 rounded-xl">
                    <Stethoscope className="h-8 w-8 text-white" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white">Indicação Médica</h3>
                    <p className="text-pink-200">Defina o procedimento para o paciente.</p>
                </div>
            </div>

            <div className="space-y-6 mb-8">
                <div className="p-4 rounded-lg bg-black/20">
                    <div className="flex items-center space-x-3 mb-2">
                        <User className="h-5 w-5 text-pink-300" />
                        <h4 className="font-semibold text-white">{patient.full_name}</h4>
                    </div>
                    <div className="flex items-start space-x-3">
                         <FileText className="h-5 w-5 text-pink-300 mt-1 flex-shrink-0" />
                         <p className="text-sm text-pink-100 bg-transparent border-0 max-h-24 overflow-y-auto">
                            {patient.notes || "Nenhuma nota registrada para este paciente."}
                         </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label className="text-pink-200 font-semibold mb-2 block">Classe de Serviço</Label>
                    <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a classe" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceClasses.map(sc => (
                          <SelectItem key={sc.id} value={sc.id}>{sc.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-pink-200 font-semibold mb-2 block">Serviço Indicado</Label>
                    <Select
                      value={selectedServiceId}
                      onValueChange={setSelectedServiceId}
                      disabled={servicesLoading || !selectedClassId}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={servicesLoading ? "Carregando..." : "Selecione o serviço"} />
                      </SelectTrigger>
                      <SelectContent>
                        {servicesLoading ? (
                          <div className="flex items-center justify-center p-4">
                            <Loader2 className="h-5 w-5 animate-spin" />
                          </div>
                        ) : (
                          activeServices.map(service => (
                            <SelectItem key={service.id} value={service.id}>
                              {service.name} - R$ {Number(service.basePrice).toLocaleString('pt-BR')}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
            </div>

            <div className="flex justify-end space-x-4">
                <Button variant="ghost" onClick={onClose} className="text-pink-200 hover:bg-white/10">
                Cancelar
                </Button>
                <Button 
                    onClick={handleSubmit} 
                    disabled={!selectedServiceId}
                    className="bg-gradient-to-r from-pink-500 to-orange-500 disabled:opacity-50"
                >
                Criar orçamento baseado na indicação
                </Button>
            </div>
        </motion.div>
      </div>
    </Dialog>
  );
};

export default PatientIndicationModal;
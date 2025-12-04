import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useServiceClasses, useServices } from '@/hooks/useServices';
import { User, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const ServiceIndicationStep = ({ patient, onSubmit, onBack, preselectedAppointment }) => {
  const { serviceClasses } = useServiceClasses();
  const [selectedClassId, setSelectedClassId] = useState('');
  const { services, loading: servicesLoading } = useServices(selectedClassId);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState('');

  const availableAppointments = patient.appointments?.filter(a => a.type === 'Primeira Avaliação' && a.status === 'scheduled') || [];

  useEffect(() => {
    if(preselectedAppointment) {
        setSelectedAppointmentId(preselectedAppointment.id);
    } else if (availableAppointments.length > 0) {
        setSelectedAppointmentId(availableAppointments[0].id);
    } else {
        setSelectedAppointmentId('none');
    }
  }, [patient, preselectedAppointment, availableAppointments.length]);

  useEffect(() => {
    if (serviceClasses.length > 0 && !selectedClassId) {
      setSelectedClassId(serviceClasses[0].id);
    }
  }, [serviceClasses, selectedClassId]);

  useEffect(() => {
    setSelectedServiceId('');
  }, [selectedClassId]);

  if (!patient) return null;

  const handleSubmit = () => {
    const selectedService = services.find(s => s.id === selectedServiceId);
    const selectedAppointment = availableAppointments.find(a => a.id === selectedAppointmentId);
    if (selectedService) {
      onSubmit(selectedService, selectedAppointment);
    }
  };
  
  const activeServices = services.filter(s => s.active);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="space-y-6 mb-8">
            <div className="p-4 rounded-lg bg-black/20">
                <div className="flex items-center space-x-3 mb-2">
                    <User className="h-5 w-5 text-pink-300" />
                    <h4 className="font-semibold text-white">{patient.full_name}</h4>
                </div>
            </div>

            {availableAppointments.length > 0 && (
                <div className="p-4 rounded-lg bg-black/20 border border-purple-500/30">
                    <Label className="text-pink-200 font-semibold mb-3 block">Este orçamento é originado de uma consulta?</Label>
                    <RadioGroup value={selectedAppointmentId} onValueChange={setSelectedAppointmentId}>
                        {availableAppointments.map(apt => (
                             <div key={apt.id} className="flex items-center space-x-2">
                                <RadioGroupItem value={apt.id} id={apt.id} />
                                <Label htmlFor={apt.id} className="text-white font-normal">
                                    Sim, da consulta de {apt.type} em {new Date(apt.date).toLocaleString('pt-BR')}
                                </Label>
                            </div>
                        ))}
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="none" id="none" />
                            <Label htmlFor="none" className="text-white font-normal">Não, é um orçamento rápido (sem consulta prévia).</Label>
                        </div>
                    </RadioGroup>
                </div>
            )}

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

        <div className="flex justify-between items-center mt-8">
            <Button variant="outline" onClick={onBack} className="text-purple-200 border-purple-300 hover:bg-purple-400/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
            </Button>
            <Button 
                onClick={handleSubmit} 
                disabled={!selectedServiceId}
                className="bg-gradient-to-r from-pink-500 to-orange-500 disabled:opacity-50"
            >
                Avançar
                <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
        </div>
    </motion.div>
  );
};

export default ServiceIndicationStep;
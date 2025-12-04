import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckIcon, PersonIcon, MinusIcon, PlusIcon, HeartFilledIcon, ReaderIcon } from '@radix-ui/react-icons';
import { Slider } from '@/components/ui/slider';
import { addDays, format, differenceInDays } from 'date-fns';

const EvolutionModal = ({ patient, onSave }) => {
  const [formData, setFormData] = useState({
    status: patient.status || 'monitoring',
    nextDate: '',
    vitals: {
      weight: patient.vitals?.weight || '',
      edema: patient.vitals?.edema || '',
      drainVolume: patient.vitals?.drainVolume || '',
      painScale: patient.vitals?.painScale || [0],
    },
    woundState: patient.woundState || '',
    complaint: patient.complaint || '',
  });

  const daysPostOp = differenceInDays(new Date(), new Date(patient.surgeryDate));

  useEffect(() => {
    const protocolNextDate = format(addDays(new Date(), 7), 'yyyy-MM-dd');
    setFormData(prev => ({ ...prev, nextDate: protocolNextDate }));
  }, [patient]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(patient.id, formData);
  };

  const handleSliderChange = (value) => {
    setFormData(prev => ({ ...prev, vitals: { ...prev.vitals, painScale: value } }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 flex-1">
          <PlusIcon className="w-3 h-3 mr-1" />
          Evoluir
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-700 max-w-3xl text-white">
        <DialogHeader>
          <DialogTitle>Evolução de {patient.name} - {daysPostOp} DPO</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
              >
                <option value="monitoring">Acompanhamento</option>
                <option value="stable">Estável</option>
                <option value="pending">Pendente</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Próxima Consulta</label>
              <Input
                type="date"
                value={formData.nextDate}
                onChange={(e) => setFormData({ ...formData, nextDate: e.target.value })}
                className="bg-slate-800 border-slate-600"
              />
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-3 border-b border-slate-700 pb-2">Avaliação Pós-Operatória</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <InputWithIcon icon={ReaderIcon} placeholder="Peso (kg)" value={formData.vitals.weight} onChange={(e) => setFormData(prev => ({...prev, vitals: {...prev.vitals, weight: e.target.value}}))} />
                <InputWithIcon icon={HeartFilledIcon} placeholder="Edema (1-4+)" value={formData.vitals.edema} onChange={(e) => setFormData(prev => ({...prev, vitals: {...prev.vitals, edema: e.target.value}}))} />
                <InputWithIcon icon={MinusIcon} placeholder="Volume Dreno (ml)" value={formData.vitals.drainVolume} onChange={(e) => setFormData(prev => ({...prev, vitals: {...prev.vitals, drainVolume: e.target.value}}))} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Escala de Dor (0-10)</label>
            <div className="flex items-center gap-4">
              <Slider
                min={0}
                max={10}
                step={1}
                value={formData.vitals.painScale}
                onValueChange={handleSliderChange}
                className="w-full"
              />
              <span className="font-bold text-lg text-blue-400 w-8 text-center">{formData.vitals.painScale[0]}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Estado da Ferida Operatória</label>
              <Textarea
                value={formData.woundState}
                onChange={(e) => setFormData({ ...formData, woundState: e.target.value })}
                placeholder="Aspecto da cicatriz, presença de secreções, etc."
                className="bg-slate-800 border-slate-600 min-h-[100px]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Queixa da Paciente</label>
              <Textarea
                value={formData.complaint}
                onChange={(e) => setFormData({ ...formData, complaint: e.target.value })}
                placeholder="Relato subjetivo da paciente sobre seu estado."
                className="bg-slate-800 border-slate-600 min-h-[100px]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <CheckIcon className="w-4 h-4 mr-2" />
              Salvar Evolução
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const InputWithIcon = ({ icon: Icon, ...props }) => (
    <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input {...props} className="bg-slate-800 border-slate-600 pl-10" />
    </div>
);

export default EvolutionModal;
import React, { useState, useEffect, useCallback } from 'react';
import { DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApi } from '@/contexts/ApiContext';
import { Loader2, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

const SurgeryModal = ({ appointment, selectedDate, onSave, onClose }) => {
  const { searchPatients, getHospitals, getSurgeryTypes, getEmployees, getJourneyProtocols, addSurgery } = useApi();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '54110e37-aa52-4159-a646-17ceadb617f4',
    hospital_id: '',
    surgery_type: '',
    surgery_date: selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    surgery_time: '09:00',
    duration_minutes: 120,
    status: 'agendado',
    notes: '',
    protocol_id: '',
  });

  const [patientSearch, setPatientSearch] = useState('');
  const [patientResults, setPatientResults] = useState([]);
  const [selectedPatientName, setSelectedPatientName] = useState('');
  const [loadingPatient, setLoadingPatient] = useState(false);

  const [hospitals, setHospitals] = useState([]);
  const [surgeryTypes, setSurgeryTypes] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [protocols, setProtocols] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoadingData(true);
      try {
        const [hospitalsData, surgeryTypesData, employeesData, protocolsData] = await Promise.all([
          getHospitals(),
          getSurgeryTypes(),
          getEmployees(),
          getJourneyProtocols(),
        ]);
        setHospitals(hospitalsData || []);
        setSurgeryTypes(surgeryTypesData || []);
        setEmployees(employeesData || []);
        setProtocols(protocolsData || []);
      } catch (error) {
        toast({ variant: 'destructive', title: 'Erro ao carregar dados para cirurgia.' });
      } finally {
        setLoadingData(false);
      }
    };
    loadInitialData();
  }, [getHospitals, getSurgeryTypes, getEmployees, getJourneyProtocols, toast]);

  const handlePatientSearch = useCallback(async (query) => {
    if (query.length < 2) {
      setPatientResults([]);
      return;
    }
    setLoadingPatient(true);
    try {
      const results = await searchPatients(query);
      setPatientResults(results || []);
    } finally {
      setLoadingPatient(false);
    }
  }, [searchPatients]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (patientSearch && patientSearch !== selectedPatientName) {
        handlePatientSearch(patientSearch);
      }
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [patientSearch, selectedPatientName, handlePatientSearch]);

  const handleSelectPatient = (patient) => {
    setFormData(prev => ({ ...prev, patient_id: patient.id }));
    setSelectedPatientName(patient.full_name);
    setPatientSearch(patient.full_name);
    setPatientResults([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patient_id) return toast({ variant: 'destructive', title: 'Paciente não selecionado.' });
    if (!formData.hospital_id) return toast({ variant: 'destructive', title: 'Hospital não selecionado.' });
    if (!formData.surgery_type) return toast({ variant: 'destructive', title: 'Tipo de cirurgia não definido.' });

    const surgery_start_at = new Date(`${formData.surgery_date}T${formData.surgery_time}`);
    const surgery_end_at = new Date(surgery_start_at.getTime() + formData.duration_minutes * 60000);

    const payload = {
      ...formData,
      start_at: surgery_start_at.toISOString(),
      end_at: surgery_end_at.toISOString(),
      visit_type: `Cirurgia: ${formData.surgery_type}`,
      patient: { id: formData.patient_id, full_name: selectedPatientName },
      type: 'surgery',
    };
    
    try {
        await addSurgery(payload);
        onSave(payload);
    } catch(e) {
        // Error is handled by useApi
    }
  };

  if (loadingData) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Agendamento de Cirurgia</DialogTitle>
        <DialogDescription>Preencha todos os campos para agendar uma nova cirurgia.</DialogDescription>
      </DialogHeader>
      <ScrollArea className="max-h-[70vh] p-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 py-4 px-4">
          <div className="md:col-span-2">
            <Label htmlFor="patient-search">Paciente</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="patient-search"
                placeholder="Buscar paciente..."
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                className="pl-10"
              />
              {loadingPatient && <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 animate-spin" />}
            </div>
            {patientResults.length > 0 && (
              <ul className="absolute z-10 w-full bg-slate-800 border border-white/20 rounded-lg mt-1 max-h-40 overflow-y-auto">
                {patientResults.map(p => (
                  <li key={p.id} onClick={() => handleSelectPatient(p)} className="px-4 py-2 hover:bg-white/10 cursor-pointer">
                    {p.full_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <Label htmlFor="surgery_type">Tipo de Cirurgia</Label>
            <Input
              id="surgery_type"
              name="surgery_type"
              placeholder="Ex: Rinoplastia"
              list="surgery-types"
              value={formData.surgery_type}
              onChange={handleChange}
            />
            <datalist id="surgery-types">
              {surgeryTypes.map(type => (
                <option key={type.value} value={type.value} />
              ))}
            </datalist>
          </div>
          <div>
            <Label htmlFor="hospital_id">Hospital</Label>
            <select id="hospital_id" name="hospital_id" className="input-field w-full" value={formData.hospital_id} onChange={handleChange}>
              <option value="">Selecione...</option>
              {hospitals.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="surgery_date">Data da Cirurgia</Label>
            <Input id="surgery_date" name="surgery_date" type="date" value={formData.surgery_date} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="surgery_time">Hora de Início</Label>
            <Input id="surgery_time" name="surgery_time" type="time" value={formData.surgery_time} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="duration_minutes">Duração (minutos)</Label>
            <Input id="duration_minutes" name="duration_minutes" type="number" step="15" value={formData.duration_minutes} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="protocol_id">Protocolo Pós-operatório</Label>
            <select id="protocol_id" name="protocol_id" className="input-field w-full" value={formData.protocol_id} onChange={handleChange}>
              <option value="">Nenhum / Manual</option>
              {protocols.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="notes">Notas Adicionais</Label>
            <textarea
              id="notes"
              name="notes"
              className="input-field w-full h-24"
              placeholder="Materiais necessários, informações para o paciente, etc."
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
      </ScrollArea>
      <DialogFooter className="pt-4 pr-4 border-t border-white/10 mt-4">
        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
        <Button type="submit" className="btn-primary" disabled={!formData.patient_id || !formData.hospital_id || !formData.surgery_type}>Agendar Cirurgia</Button>
      </DialogFooter>
    </form>
  );
};

export default SurgeryModal;
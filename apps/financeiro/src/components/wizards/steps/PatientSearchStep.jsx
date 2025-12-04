import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePatients } from '@/hooks/usePatients';
import { Search, UserPlus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PatientSearchStep = ({ onSelectPatient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { patients, loading, error, searchPatients } = usePatients();
  const { toast } = useToast();

  useEffect(() => {
    // Initial load
    searchPatients('');
  }, [searchPatients]);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    searchPatients(term);
  };
  
  const handleAddNewPatient = () => {
    toast({
      title: "🚧 Funcionalidade não implementada",
      description: "A criação de novos pacientes pode ser feita na tela de Pacientes.",
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-purple-200">Buscar por Nome ou CPF</Label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-purple-300" />
          <Input
            className="pl-10 bg-white/10 border-white/20 text-white text-lg"
            placeholder="Digite para buscar..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <div className="relative h-64 overflow-y-auto pr-2 rounded-lg bg-black/20 p-2">
        {loading && <p className="text-purple-200 text-center py-4">Buscando...</p>}
        {error && <p className="text-red-400 text-center py-4">Erro ao buscar pacientes.</p>}
        {!loading && searchTerm && patients.length === 0 && (
          <div className="text-center py-10">
              <p className="text-purple-200">Nenhum paciente encontrado.</p>
              <button 
                onClick={handleAddNewPatient}
                className="mt-4 inline-flex items-center text-sm font-semibold text-pink-400 hover:text-pink-300 transition-colors"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Cadastrar Novo Paciente
              </button>
          </div>
        )}
        <motion.div layout>
          {patients.map(patient => (
            <motion.div
              key={patient.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => onSelectPatient(patient)}
              className="p-3 mb-2 rounded-lg cursor-pointer hover:bg-white/20 transition-all duration-200"
            >
              <p className="font-semibold text-white">{patient.full_name}</p>
              <p className="text-sm text-purple-300">CPF: {patient.document_id || 'Não informado'}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default PatientSearchStep;
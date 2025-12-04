import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { X, UserPlus } from 'lucide-react';
import EstimateModalContent from '@/components/modals/estimate/EstimateModalContent';
import { usePatients } from '@/hooks/usePatients';

const EstimateModal = ({ isOpen, onClose }) => {
  const [view, setView] = useState('selection'); // 'selection', 'surgical', 'ambulatorial', 'newUser'
  const { patients, searchPatients } = usePatients();
  const [patientList, setPatientList] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');

  useEffect(() => {
    if (isOpen) {
      searchPatients(''); // fetch all mock patients
    }
  }, [isOpen, searchPatients]);

  useEffect(() => {
    setPatientList(patients);
  }, [patients]);

  const handleClose = () => {
    setView('selection');
    setSelectedPatientId('');
    onClose();
  };

  const getTitle = () => {
    switch (view) {
      case 'newUser':
        return 'Cadastrar Novo Paciente';
      case 'surgical':
      case 'ambulatorial':
      case 'selection':
      default:
        return 'Estimativa de Valores';
    }
  };

  const getDescription = () => {
    switch (view) {
      case 'newUser':
        return 'Preencha os dados para criar um novo registro de paciente.';
      case 'surgical':
      case 'ambulatorial':
      case 'selection':
      default:
        return 'Selecione o tipo de procedimento para ver uma estimativa de custos.';
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-white/20 rounded-2xl p-8 w-full max-w-2xl relative"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="absolute top-4 right-4 text-purple-300 hover:text-white"
          >
            <X className="h-6 w-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setView('newUser')}
            className="absolute top-4 left-4 text-purple-300 hover:text-white"
            disabled={view !== 'selection'}
          >
            <UserPlus className="h-6 w-6" />
          </Button>

          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white">{getTitle()}</h2>
            <p className="text-purple-200 mt-2">{getDescription()}</p>
          </div>

          <EstimateModalContent
            view={view}
            setView={setView}
            selectedPatientId={selectedPatientId}
            setSelectedPatientId={setSelectedPatientId}
            patients={patientList}
            setPatients={setPatientList}
          />
        </motion.div>
      </div>
    </Dialog>
  );
};

export default EstimateModal;
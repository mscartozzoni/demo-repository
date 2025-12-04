import React from 'react';
import { motion } from 'framer-motion';
import { Scissors, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import SurgicalEstimate from '@/components/modals/estimate/SurgicalEstimate';
import AmbulatorialEstimate from '@/components/modals/estimate/AmbulatorialEstimate';
import NewUserForm from '@/components/modals/estimate/NewUserForm';

const procedureEstimates = {
  surgical: {
    icon: <Scissors className="h-6 w-6 text-white" />,
  },
  ambulatorial: {
    icon: <Sparkles className="h-6 w-6 text-white" />,
  },
};

const EstimateModalContent = ({
  view,
  setView,
  selectedPatientId,
  setSelectedPatientId,
  patients,
  setPatients,
}) => {
  const handleBack = () => {
    setView('selection');
    setSelectedPatientId('');
  };

  if (view === 'newUser') {
    return (
      <NewUserForm
        onUserCreated={(patient) => {
          setPatients((prev) => [...prev, patient]);
          setSelectedPatientId(patient.id);
          setView('surgical');
        }}
        onCancel={() => setView('selection')}
      />
    );
  }

  if (view === 'surgical') {
    return (
      <SurgicalEstimate
        patients={patients}
        selectedPatientId={selectedPatientId}
        setSelectedPatientId={setSelectedPatientId}
        onBack={handleBack}
      />
    );
  }

  if (view === 'ambulatorial') {
    return <AmbulatorialEstimate onBack={handleBack} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div whileHover={{ scale: 1.05 }}>
        <Card
          onClick={() => setView('surgical')}
          className="bg-white/10 p-6 rounded-xl border-white/20 hover:bg-white/20 cursor-pointer transition-all"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-pink-500 to-red-500 p-3 rounded-lg">
              {procedureEstimates.surgical.icon}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Cirúrgicos</h3>
              <p className="text-purple-300">Ex: Prótese, Lipo, etc.</p>
            </div>
          </div>
        </Card>
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }}>
        <Card
          onClick={() => setView('ambulatorial')}
          className="bg-white/10 p-6 rounded-xl border-white/20 hover:bg-white/20 cursor-pointer transition-all"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-green-400 to-cyan-400 p-3 rounded-lg">
              {procedureEstimates.ambulatorial.icon}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Estéticos</h3>
              <p className="text-purple-300">Ex: Botox, Preenchimento</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default EstimateModalContent;
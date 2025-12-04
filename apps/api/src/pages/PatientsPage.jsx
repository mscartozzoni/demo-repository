import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import PatientCard from '@/components/patients/PatientCard';
import PatientDetailModal from '@/components/patients/PatientDetailModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, UserPlus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedPatients = localStorage.getItem('clinic_patients');
    if (storedPatients) {
      setPatients(JSON.parse(storedPatients));
    } else {
      const mockPatients = [
        {
          id: '1',
          name: 'Maria Silva',
          age: 42,
          email: 'maria@email.com',
          phone: '(11) 98765-4321',
          lastVisit: '2025-10-25',
          nextAppointment: '2025-11-05',
          surgicalHistory: 'Rinoplastia (2020), Lipoaspiração (2022)',
          procedures: ['Botox', 'Preenchimento'],
          status: 'active'
        },
        {
          id: '2',
          name: 'João Santos',
          age: 35,
          email: 'joao@email.com',
          phone: '(11) 91234-5678',
          lastVisit: '2025-10-20',
          nextAppointment: '2025-11-10',
          surgicalHistory: 'Nenhum',
          procedures: ['Rinoplastia'],
          status: 'active'
        },
        {
          id: '3',
          name: 'Ana Costa',
          age: 55,
          email: 'ana@email.com',
          phone: '(11) 99876-5432',
          lastVisit: '2025-10-15',
          nextAppointment: null,
          surgicalHistory: 'Blefaroplastia (2018)',
          procedures: ['Lifting Facial'],
          status: 'follow-up'
        }
      ];
      setPatients(mockPatients);
      localStorage.setItem('clinic_patients', JSON.stringify(mockPatients));
    }
  }, []);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPatient = () => {
    toast({
      title: "🚧 Funcionalidade em desenvolvimento",
      description: "A adição de novos pacientes estará disponível em breve! Solicite na próxima conversa! 🚀"
    });
  };

  return (
    <>
      <Helmet>
        <title>Pacientes - Meu Assistente Clínico</title>
        <meta name="description" content="Gerencie seus pacientes de forma inteligente e segura" />
      </Helmet>
      
      <Layout>
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Pacientes</h1>
              <p className="text-slate-600 mt-1">Gerencie e acompanhe seus pacientes</p>
            </div>
            <Button onClick={handleAddPatient} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Novo Paciente
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-effect rounded-2xl p-4"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar paciente por nome ou email..."
                className="pl-10 border-0 focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map((patient, index) => (
              <PatientCard key={patient.id} patient={patient} delay={index * 0.1} onSelect={() => setSelectedPatient(patient)} />
            ))}
          </div>

          {filteredPatients.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 glass-effect rounded-2xl">
              <p className="text-slate-600">Nenhum paciente encontrado</p>
            </motion.div>
          )}
        </div>
        
        <AnimatePresence>
            {selectedPatient && (
                <PatientDetailModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} />
            )}
        </AnimatePresence>

      </Layout>
    </>
  );
};

export default PatientsPage;
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import EvolutionHeader from '@/components/evolution/EvolutionHeader';
import EvolutionStats from '@/components/evolution/EvolutionStats';
import EvolutionPatientCard from '@/components/evolution/EvolutionPatientCard';
import { getPatientEvolutionHistory } from '@/services/api/evolution';
import { getPatientById } from '@/services/api/patients';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Evolution = () => {
  const { id: patientId } = useParams(); // Get patientId from URL if present
  const { toast } = useToast();
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [singlePatient, setSinglePatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    monitoring: 0,
    stable: 0,
    pending: 0
  });

  const fetchEvolutions = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // If a patientId is provided, fetch only that patient's data
      if (patientId) {
        const [patientResponse, evolutionResponse] = await Promise.all([
            getPatientById(patientId),
            getPatientEvolutionHistory(patientId)
        ]);

        if (patientResponse.success && evolutionResponse.success) {
            const patientData = patientResponse.data;
            const evolutionData = evolutionResponse.data;
            
            // Combine data. This assumes getPatientEvolutionHistory for a single patient returns details.
            // Adjusting based on mock structure.
            const fullPatientData = {
                id: patientData.id,
                name: patientData.full_name,
                // These are mock details from evolution API, in real case they'd come from patient record or evolutions table
                procedure: evolutionData[0]?.procedure || 'Procedimento', 
                surgeryDate: evolutionData[0]?.surgeryDate || new Date().toISOString(),
                lastEvolution: evolutionData[0]?.date || new Date().toISOString(),
                nextAppointment: evolutionData[0]?.nextAppointment || new Date().toISOString(),
                status: evolutionData[0]?.status || 'monitoring',
                vitals: evolutionData[0]?.vitals || {},
                woundState: evolutionData[0]?.woundState || '',
                complaint: evolutionData[0]?.complaint || '',
            };

            setSinglePatient(fullPatientData);
        } else {
             throw new Error("Failed to fetch patient or evolution data.");
        }
      } else {
        // Fetch all patients for the general evolution dashboard
        const response = await getPatientEvolutionHistory(null);
        const evolutionData = response?.data || [];
        
        if (Array.isArray(evolutionData)) {
          setPatients(evolutionData);
          const newStats = evolutionData.reduce((acc, patient) => {
            if (acc[patient.status] !== undefined) {
              acc[patient.status]++;
            }
            return acc;
          }, { monitoring: 0, stable: 0, pending: 0 });
          setStats(newStats);
        } else {
          setPatients([]);
        }
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao buscar evoluções',
        description: error.message || 'Não foi possível carregar os dados.',
      });
    } finally {
      setLoading(false);
    }
  }, [user, patientId, toast]);

  useEffect(() => {
    fetchEvolutions();
  }, [fetchEvolutions]);

  const handleSaveEvolution = (pId, data) => {
    toast({ title: "Evolução salva com sucesso!", description: "Os dados do paciente foram atualizados." });
    
    const updatePatient = (p) => {
        if (p.id === pId) {
             return {
                ...p,
                status: data.status,
                nextAppointment: data.nextDate,
                vitals: data.vitals,
                woundState: data.woundState,
                complaint: data.complaint,
                lastEvolution: new Date().toISOString().split('T')[0]
              };
        }
        return p;
    };
    
    if (singlePatient) {
        setSinglePatient(updatePatient(singlePatient));
    } else {
         setPatients(prevPatients => prevPatients.map(updatePatient));
    }
  };

  if (loading) {
     return <div className="text-center py-20 text-slate-400">Carregando evoluções...</div>
  }

  if (patientId) {
      return (
          <div className="space-y-6">
             <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <Link to={`/medico/patients/${patientId}/caderno`}>
                    <Button variant="outline" className="mb-4 border-slate-600">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar para o Prontuário
                    </Button>
                </Link>
                <EvolutionHeader patientName={singlePatient?.name} />
              </motion.div>
              {singlePatient ? (
                <div className="max-w-2xl mx-auto">
                    <EvolutionPatientCard
                      patient={singlePatient}
                      index={0}
                      onSaveEvolution={handleSaveEvolution}
                    />
                </div>
              ) : (
                <p className="text-center text-slate-400">Paciente não encontrado.</p>
              )}
          </div>
      );
  }

  return (
    <div className="space-y-6">
      <EvolutionHeader />
      <EvolutionStats stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {patients.map((patient, index) => (
          <EvolutionPatientCard
            key={patient.id}
            patient={patient}
            index={index}
            onSaveEvolution={handleSaveEvolution}
          />
        ))}
      </div>
    </div>
  );
};

export default Evolution;
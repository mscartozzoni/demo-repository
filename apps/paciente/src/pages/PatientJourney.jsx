// pages/PatientJourney.jsx

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Route, PlusCircle, Filter } from 'lucide-react';

import { useApi } from '@/contexts/ApiContext';
import { useToast } from '@/components/ui/use-toast';

import PatientJourneyCard from '@/components/journey/PatientJourneyCard';
import NewJourneyDialog from '@/components/journey/NewJourneyDialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

const PatientJourney = () => {
  const { getPatientJourneys, updateJourneyStage, addJourneyStage, createPatientJourney } = useApi();
  const { toast } = useToast();

  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewJourneyDialogOpen, setIsNewJourneyDialogOpen] = useState(false);

  // === Fetch & Atualização ===
  const fetchJourneys = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPatientJourneys();
      setJourneys(data || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao buscar jornadas",
        description: "Não foi possível carregar as jornadas dos pacientes.",
      });
    } finally {
      setLoading(false);
    }
  }, [getPatientJourneys, toast]);

  useEffect(() => {
    fetchJourneys();
  }, [fetchJourneys]);

  // === Ações ===
  const handleUpdateStage = async (stageId, updatedData) => {
    try {
      await updateJourneyStage(stageId, updatedData);
      toast({ title: "✅ Etapa atualizada com sucesso!" });
      fetchJourneys();
    } catch {
      toast({ variant: "destructive", title: "Erro ao atualizar etapa" });
    }
  };

  const handleAddStage = async (journeyId, newStageData) => {
    try {
      await addJourneyStage(journeyId, newStageData);
      toast({ title: "✅ Nova etapa adicionada!" });
      fetchJourneys();
    } catch {
      toast({ variant: "destructive", title: "Erro ao adicionar nova etapa" });
    }
  };

  const handleCreateJourney = async (patientId, protocolId) => {
    try {
      await createPatientJourney(patientId, protocolId);
      toast({ title: "✅ Nova jornada criada com sucesso!" });
      setIsNewJourneyDialogOpen(false);
      fetchJourneys();
    } catch {
      toast({ variant: "destructive", title: "Erro ao criar jornada" });
    }
  };

  // === Lógica de Priorização ===
  const getPriorityScore = (journey) => {
    if (!journey || !journey.stages) return 0;
    if (journey.status === 'completed') return 0;

    let score = 1000;
    const now = new Date();

    const delayedStages = journey.stages.filter(
      s => s.status !== 'completed' && s.due_date && new Date(s.due_date) < now
    );
    const pendingStages = journey.stages.filter(s => s.status === 'pending');

    if (delayedStages.length > 0) score += 500 * delayedStages.length;
    if (pendingStages.length > 0) score += 100;

    const nextDueDate = journey.stages
      .filter(s => s.status !== 'completed' && s.due_date)
      .map(s => new Date(s.due_date))
      .sort((a, b) => a - b)[0];

    if (nextDueDate) {
      const daysUntilDue = (nextDueDate - now) / (1000 * 60 * 60 * 24);
      score -= daysUntilDue;
    }

    return score;
  };

  // === Busca e ordenação ===
  const filteredAndSortedJourneys = useMemo(() => {
    return journeys
      .filter(journey =>
        journey.patient?.full_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => getPriorityScore(b) - getPriorityScore(a));
  }, [journeys, searchTerm]);

  // === Render ===
  return (
    <>
      <Helmet>
        <title>Jornada do Paciente - Portal Secretaria</title>
        <meta
          name="description"
          content="Acompanhe a jornada completa dos pacientes, desde a consulta até o pós-cirúrgico."
        />
      </Helmet>

      <Dialog open={isNewJourneyDialogOpen} onOpenChange={setIsNewJourneyDialogOpen}>
        <div className="space-y-8">
          {/* Cabeçalho */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold gradient-text mb-2 flex items-center gap-3">
                  <Route className="w-8 h-8" />
                  Jornada do Paciente
                </h1>
                <p className="text-gray-400">Acompanhamento completo e priorizado de cada paciente.</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  className="btn-secondary"
                  onClick={() =>
                    toast({
                      title: "🚧 Em breve!",
                      description: "Filtros avançados estarão disponíveis em breve.",
                    })
                  }
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrar
                </Button>
                <DialogTrigger asChild>
                  <Button className="btn-primary">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Nova Jornada
                  </Button>
                </DialogTrigger>
              </div>
            </div>
            <div className="mt-6">
              <Input
                placeholder="Buscar por nome do paciente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
          </motion.div>

          {/* Carregando */}
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="floating-card p-6 space-y-4 animate-pulse">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="h-6 w-40 bg-slate-700 rounded"></div>
                      <div className="h-4 w-24 bg-slate-700 rounded"></div>
                    </div>
                    <div className="h-8 w-8 bg-slate-700 rounded-full"></div>
                  </div>
                  <div className="h-4 w-full bg-slate-700 rounded"></div>
                  <div className="space-y-2 pt-4">
                    <div className="h-5 w-3/4 bg-slate-700 rounded"></div>
                    <div className="h-5 w-1/2 bg-slate-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {filteredAndSortedJourneys.map((journey) => (
                <PatientJourneyCard
                  key={journey.id}
                  journey={journey}
                  onUpdateStage={handleUpdateStage}
                  onAddStage={handleAddStage}
                  onRefreshJourneys={fetchJourneys}
                />
              ))}
            </motion.div>
          )}

          {/* Nenhum resultado */}
          {!loading && filteredAndSortedJourneys.length === 0 && (
            <div className="text-center py-16 floating-card">
              <h3 className="text-xl font-semibold">Nenhuma jornada encontrada</h3>
              <p className="text-gray-400 mt-2">
                Nenhum paciente corresponde à sua busca ou não há jornadas ativas.
              </p>
            </div>
          )}
        </div>

        {/* Modal de nova jornada */}
        <NewJourneyDialog
          onSave={handleCreateJourney}
          onClose={() => setIsNewJourneyDialogOpen(false)}
        />
      </Dialog>
    </>
  );
};

export default PatientJourney;
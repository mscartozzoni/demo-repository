
import React, { useState, useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Helmet } from 'react-helmet-async';
import { Users, Search, UserPlus, ArrowRight, Link as LinkIcon } from 'lucide-react';
import NewPatientForm from '@/components/NewPatientForm';
import StatsOverview from '@/components/StatsOverview';
import { useToast } from '@/components/ui/use-toast';

const PatientHubScreen = () => {
  const { patientPortalData, loading, appointments } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);

  const patients = useMemo(() => {
    if (!patientPortalData || !appointments) return [];
    const appointmentPatientIds = new Set(appointments.map(a => a.patient_id));
    return patientPortalData.filter(p => appointmentPatientIds.has(p.id));
  }, [patientPortalData, appointments]);

  const filteredPatients = useMemo(() => {
    return patients.filter(patient =>
      patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [patients, searchTerm]);

  const getPortalUrl = (patientId) => {
    return `${window.location.origin}/portal/${patientId}`;
  };

  const copyPortalUrl = (patientId) => {
    const url = getPortalUrl(patientId);
    navigator.clipboard.writeText(url);
    toast({
      title: "✅ Link Copiado!",
      description: "O link do portal do paciente foi copiado.",
    });
  };

  return (
    <>
      <Helmet>
        <title>Hub de Pacientes - Gestão IA</title>
        <meta name="description" content="Gerencie todos os pacientes da clínica." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Hub de Pacientes</h1>
            <p className="text-muted-foreground">Visualize e gerencie todos os pacientes.</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar paciente..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => setIsNewPatientModalOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Novo
            </Button>
          </div>
        </div>

        <StatsOverview />

        <Card className="glass-effect-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users />
              Lista de Pacientes ({filteredPatients.length})
            </CardTitle>
            <CardDescription>
              Aqui estão listados todos os contatos que já possuem um agendamento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground">Carregando pacientes...</p>
            ) : filteredPatients.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPatients.map(patient => (
                  <motion.div
                    key={patient.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full flex flex-col bg-background/50 hover:bg-secondary/60 transition-colors duration-200">
                      <CardHeader className="flex-row items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="text-xl font-semibold bg-primary/20 text-primary">
                            {patient.full_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{patient.full_name}</CardTitle>
                          <CardDescription className="truncate max-w-[180px]">{patient.email}</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow flex flex-col justify-between">
                        <div className="flex flex-wrap gap-1 mb-4">
                          {patient.tags?.map(tagId => {
                            const tag = patient.tags.find(t => t.id === tagId);
                            return tag ? <Badge key={tag.id} className={tag.color}>{tag.name}</Badge> : null;
                          })}
                        </div>
                        <div className="flex gap-2">
                          <Button className="flex-1" onClick={() => navigate(`/patient-clinic/${patient.id}`)}>
                            Ver Prontuário <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={(e) => {
                              e.stopPropagation();
                              copyPortalUrl(patient.id);
                            }}
                            title="Copiar link do portal"
                          >
                            <LinkIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">Nenhum paciente encontrado.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
      <NewPatientForm isOpen={isNewPatientModalOpen} onOpenChange={setIsNewPatientModalOpen} />
    </>
  );
};

export default PatientHubScreen;

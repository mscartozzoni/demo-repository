
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData, DataProvider } from '@/contexts/DataContext';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
import { Calendar, FileText, DollarSign, Stethoscope, MessageSquare, LogIn, AlertTriangle, Loader2 } from 'lucide-react';

const PublicPatientPortal = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { patientPortalData, loading } = useData();
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading) {
      const foundPatient = patientPortalData.find(p => p.id === patientId);
      if (foundPatient) {
        setPatient(foundPatient);
      } else {
        setError("Paciente não encontrado ou link inválido.");
      }
    }
  }, [patientId, patientPortalData, loading]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatCurrency = (value) => {
    if (typeof value !== 'number') return 'N/A';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-secondary p-4">
        <Card className="w-full max-w-md text-center glass-effect-soft">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-destructive">
              <AlertTriangle className="h-6 w-6" />
              Acesso Inválido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => navigate('/')}>
              <LogIn className="mr-2 h-4 w-4" />
              Voltar para o Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!patient) {
    return null; // or some other placeholder
  }

  return (
    <>
      <Helmet>
        <title>Portal do Paciente - {patient.full_name}</title>
        <meta name="description" content={`Acesse suas informações, agendamentos e documentos, ${patient.full_name}.`} />
      </Helmet>
      <div className="min-h-screen bg-secondary p-4 sm:p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <header className="mb-8">
            <Card className="glass-effect-soft">
              <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-primary">
                    <AvatarFallback className="text-2xl bg-primary/20 text-primary font-semibold">
                      {patient.full_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Portal do Paciente</h1>
                    <p className="text-lg text-muted-foreground">{patient.full_name}</p>
                  </div>
                </div>
                <Button onClick={() => navigate('/')}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Falar com a Clínica
                </Button>
              </CardContent>
            </Card>
          </header>

          <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-effect-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Calendar className="text-primary" /> Próximos Agendamentos</CardTitle>
              </CardHeader>
              <CardContent>
                {patient.appointments && patient.appointments.length > 0 ? (
                  <ul className="space-y-3">
                    {patient.appointments.map(appt => (
                      <li key={appt.id} className="p-3 bg-background/50 rounded-lg">
                        <p className="font-semibold">{formatDate(appt.date)}</p>
                        <p className="text-sm text-muted-foreground">{appt.notes}</p>
                        <Badge variant="outline" className="mt-1 capitalize">{appt.status}</Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-sm">Nenhum agendamento futuro.</p>
                )}
              </CardContent>
            </Card>

            <Card className="glass-effect-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><DollarSign className="text-primary" /> Orçamentos</CardTitle>
              </CardHeader>
              <CardContent>
                {patient.budgets && patient.budgets.length > 0 ? (
                  <ul className="space-y-3">
                    {patient.budgets.map(budget => (
                      <li key={budget.id} className="p-3 bg-background/50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{budget.service}</p>
                            <p className="text-sm text-muted-foreground">Criado em: {formatDate(budget.created_at)}</p>
                          </div>
                          <p className="font-bold text-lg">{formatCurrency(budget.amount)}</p>
                        </div>
                        <Badge variant="secondary" className="mt-1 capitalize">{budget.status}</Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-sm">Nenhum orçamento encontrado.</p>
                )}
              </CardContent>
            </Card>

            <Card className="glass-effect-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Stethoscope className="text-primary" /> Cirurgias</CardTitle>
              </CardHeader>
              <CardContent>
                {patient.surgeries && patient.surgeries.length > 0 ? (
                  <ul className="space-y-3">
                    {patient.surgeries.map(surgery => (
                       <li key={surgery.id} className="p-3 bg-background/50 rounded-lg">
                        <p className="font-semibold">{surgery.procedure_name}</p>
                        <p className="text-sm text-muted-foreground">Data: {formatDate(surgery.date)}</p>
                        <Badge variant="outline" className="mt-1 capitalize">{surgery.status}</Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-sm">Nenhuma cirurgia agendada.</p>
                )}
              </CardContent>
            </Card>

            <Card className="glass-effect-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText className="text-primary" /> Documentos</CardTitle>
              </CardHeader>
              <CardContent>
                {patient.documents && patient.documents.length > 0 ? (
                  <ul className="space-y-3">
                    {patient.documents.map(doc => (
                      <li key={doc.id} className="p-3 bg-background/50 rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{doc.title}</p>
                          <p className="text-sm text-muted-foreground">Enviado em: {formatDate(doc.created_at)}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => window.open(doc.url, '_blank')}>Ver</Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-sm">Nenhum documento disponível.</p>
                )}
              </CardContent>
            </Card>
          </main>
        </motion.div>
      </div>
    </>
  );
};

// Wrapper to provide context for the public page
const PublicPatientPortalWrapper = () => (
  <ThemeProvider>
    <DataProvider>
      <PublicPatientPortal />
      <Toaster />
    </DataProvider>
  </ThemeProvider>
);

export default PublicPatientPortalWrapper;



import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Edit, Save, User, Phone, Mail, MessageSquare, Link as LinkIcon, Copy } from 'lucide-react';
import PatientJourneyTracker from '@/components/PatientJourneyTracker';

const PatientClinicScreen = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { patientPortalData, loading, updateUser } = useData();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  
  const patient = useMemo(() => 
    patientPortalData.find(p => p.id === patientId)
  , [patientPortalData, patientId]);

  const [formData, setFormData] = useState(patient);

  React.useEffect(() => {
    setFormData(patient);
  }, [patient]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    updateUser(patientId, {
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      notes: formData.notes,
    });
    setIsEditing(false);
  };

  const getPortalUrl = () => {
    if (!patient) return '';
    return `${window.location.origin}/portal/${patient.id}`;
  };

  const copyPortalUrl = () => {
    const url = getPortalUrl();
    navigator.clipboard.writeText(url);
    toast({
      title: "✅ Link Copiado!",
      description: "O link do portal do paciente foi copiado para a área de transferência.",
    });
  };

  if (loading) {
    return <div className="text-center p-10">Carregando dados do paciente...</div>;
  }

  if (!patient) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-bold text-destructive">Paciente não encontrado</h2>
        <Button onClick={() => navigate('/patients')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Pacientes
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Prontuário de {patient.full_name} - Gestão IA</title>
        <meta name="description" content={`Detalhes clínicos e jornada do paciente ${patient.full_name}.`} />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate('/patients')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div className="flex items-center gap-2">
            <Button onClick={() => navigate(`/conversation/${patient.id}`)}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Ver Conversa
            </Button>
            {isEditing ? (
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </Button>
            ) : (
              <Button variant="secondary" onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
            )}
          </div>
        </div>

        <Card className="glass-effect-soft">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-primary">
                <AvatarFallback className="text-3xl bg-primary/20 text-primary font-semibold">
                  {patient.full_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                {isEditing ? (
                  <Input id="full_name" value={formData.full_name} onChange={handleInputChange} className="text-3xl font-bold" />
                ) : (
                  <CardTitle className="text-3xl font-bold">{patient.full_name}</CardTitle>
                )}
                <CardDescription>ID do Paciente: {patient.id}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                {isEditing ? (
                  <Input id="email" type="email" value={formData.email} onChange={handleInputChange} />
                ) : (
                  <span className="text-foreground">{patient.email}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                {isEditing ? (
                  <Input id="phone" value={formData.phone} onChange={handleInputChange} />
                ) : (
                  <span className="text-foreground">{patient.phone}</span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Anotações Internas</Label>
              {isEditing ? (
                <Textarea id="notes" value={formData.notes || ''} onChange={handleInputChange} placeholder="Anotações sobre o paciente..." />
              ) : (
                <p className="text-sm text-muted-foreground p-3 bg-background/50 rounded-md min-h-[80px]">
                  {patient.notes || 'Nenhuma anotação.'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-primary" />
              Acesso ao Portal do Paciente
            </CardTitle>
            <CardDescription>
              Compartilhe este link exclusivo para que o paciente acesse seu portal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 p-2 border rounded-md bg-background/50">
              <Input readOnly value={getPortalUrl()} className="border-0 bg-transparent focus-visible:ring-0" />
              <Button variant="outline" size="icon" onClick={copyPortalUrl}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <PatientJourneyTracker patientId={patientId} />

      </motion.div>
    </>
  );
};

export default PatientClinicScreen;

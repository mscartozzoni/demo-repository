import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useServices } from '@/hooks/useServices';
import { Mail, MessageCircle } from 'lucide-react';

const estimateContent = (service) => `
  <div class="prose prose-invert text-purple-200">
    <h3 class="text-white text-xl mb-2">Estimativa para ${service.name}</h3>
    <p>Uma estimativa inicial para os custos da equipe médica (cirurgião, anestesista, etc.) para o procedimento <strong>${service.name}</strong> fica em torno de <strong>R$ ${service.basePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>.</p>
    <p>Custos hospitalares (internação, materiais) são separados e pagos diretamente ao hospital, variando conforme a instituição e o procedimento.</p>
    <hr class="border-white/20 my-4" />
    <p class="text-sm text-yellow-300"><strong>Atenção:</strong> Este valor é uma estimativa e não constitui um orçamento formal. O valor final será definido após a consulta médica e avaliação do caso.</p>
  </div>
`;

const SurgicalEstimate = ({ patients, selectedPatientId, setSelectedPatientId, onBack }) => {
  const { toast } = useToast();
  // Assuming 'sc1' is the ID for surgical procedures in mock data
  const { services: surgicalServices, loading: loadingServices } = useServices('sc1');
  const [selectedServiceId, setSelectedServiceId] = useState('');

  const selectedService = useMemo(() => 
    surgicalServices.find(s => s.id === selectedServiceId),
    [surgicalServices, selectedServiceId]
  );

  useEffect(() => {
      if (surgicalServices && surgicalServices.length > 0) {
          setSelectedServiceId(surgicalServices[0].id);
      }
  }, [surgicalServices]);

  const handleShare = async (platform) => {
    if (!selectedServiceId || !selectedPatientId) {
      toast({ variant: "destructive", title: "Atenção", description: "Por favor, selecione um paciente e um procedimento." });
      return;
    }

    const estimateText = `*Estimativa de Valores - ${selectedService.name}*\n\nOlá!\n\nConforme solicitado, segue uma estimativa de valores para o procedimento de *${selectedService.name}*:\n\n*Valor da Equipe Médica:* A partir de R$ ${selectedService.basePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.\n\n_Custos hospitalares (internação, materiais) são separados e pagos diretamente ao hospital, variando conforme a instituição e o procedimento._\n\n*Atenção:* Este valor é uma estimativa e não constitui um orçamento formal. O valor final será definido após a consulta médica e avaliação do caso.\n\nAtenciosamente,`;
    
    // Mock sharing
    if (platform === 'whatsapp') {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(estimateText)}`;
      window.open(whatsappUrl, '_blank');
    } else if (platform === 'email') {
      const subject = `Estimativa de Valores - ${selectedService.name}`;
      const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(estimateText.replace(/\*/g, ''))}`;
      window.location.href = mailtoUrl;
    }

    toast({ title: "Sucesso!", description: `Estimativa enviada (simulação) e registrada na conversa.` });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-purple-200">Paciente</Label>
          <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
            <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Selecione um paciente..." />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-white/20 text-white">
              {patients.map(p => <SelectItem key={p.id} value={p.id}>{p.full_name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-purple-200">Cirurgia</Label>
          <Select value={selectedServiceId} onValueChange={setSelectedServiceId} disabled={loadingServices || surgicalServices.length === 0}>
            <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
              <SelectValue placeholder={loadingServices ? "Carregando..." : "Nenhuma cirurgia encontrada"} />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-white/20 text-white">
              {surgicalServices.map(service => (
                <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {selectedService && (
        <motion.div
          initial={{ opacity: 0, height: 0, marginTop: 0 }}
          animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
          className="mt-4"
        >
          <Card className="bg-white/5 border-white/10 p-6">
            <CardContent className="p-0">
              <div
                className="text-white"
                dangerouslySetInnerHTML={{ __html: estimateContent(selectedService) }}
              />
            </CardContent>
          </Card>
          <div className="flex justify-center space-x-4 mt-6">
            <Button onClick={() => handleShare('email')} variant="outline" className="text-purple-200 border-purple-400 hover:bg-purple-400/10 hover:text-white" disabled={!selectedPatientId}>
              <Mail className="h-4 w-4 mr-2" /> Enviar por E-mail
            </Button>
            <Button onClick={() => handleShare('whatsapp')} className="bg-green-500 hover:bg-green-600 text-white" disabled={!selectedPatientId}>
              <MessageCircle className="h-4 w-4 mr-2" /> Enviar por WhatsApp
            </Button>
          </div>
        </motion.div>
      )}

      <div className="text-center mt-6">
        <Button onClick={onBack} variant="outline" className="text-purple-200 border-purple-400 hover:bg-purple-400/10 hover:text-white">
          Voltar
        </Button>
      </div>
    </motion.div>
  );
};

export default SurgicalEstimate;
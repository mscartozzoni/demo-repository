import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, MessageSquare, Send, FileText, Star } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { sendEmail, sendMessage } from '@/services/api/communication.js';
import FileUpload from '@/components/journey/FileUpload';
import { useAuth } from '@/contexts/AuthContext';

const emailTemplates = [
  { name: 'Lembrete de Consulta', subject: 'Lembrete de Consulta', body: 'Olá {patient_name},\n\nLembramos que sua consulta está agendada para {appointment_date}.\n\nAtenciosamente,\nEquipe Dr. Márcio.' },
  { name: 'Orientações Pré-operatórias', subject: 'Orientações para sua Cirurgia', body: 'Olá {patient_name},\n\nSeguem as orientações pré-operatórias para sua cirurgia:\n\n- Jejum de 8 horas.\n- ...\n\nAtenciosamente,\nEquipe Dr. Márcio.' },
  { name: 'Pedido de Feedback (Consulta)', subject: 'Como foi sua consulta?', body: 'Olá {patient_name},\n\nGostaríamos de saber como foi sua experiência em sua última consulta. Seu feedback é muito importante para nós!\n\nVocê poderia nos contar um pouco mais?\n\nAtenciosamente,\nEquipe Dr. Márcio.' },
  { name: 'Pedido de Feedback (Pós-operatório)', subject: 'Sua opinião sobre nosso cuidado', body: 'Olá {patient_name},\n\nEsperamos que sua recuperação esteja indo bem. Gostaríamos de convidar você a compartilhar sua experiência com nossos cuidados pós-operatórios. Sua opinião nos ajuda a melhorar sempre.\n\nAtenciosamente,\nEquipe Dr. Márcio.' },
];

const smsTemplates = [
  { name: 'Lembrete de Consulta', body: 'Olá {patient_name}, lembramos da sua consulta em {appointment_date}. Equipe Dr. Márcio.' },
  { name: 'Confirmação de Agendamento', body: 'Olá {patient_name}, sua consulta foi agendada para {appointment_date}. Equipe Dr. Márcio.' },
];

const CommunicationModal = ({ isOpen, onClose, patient, mode, onSent }) => {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState(mode);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [smsBody, setSmsBody] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    setActiveTab(mode);
    setEmailSubject('');
    setEmailBody('');
    setSmsBody('');
    setAttachments([]);
  }, [isOpen, mode]);

  const replacePlaceholders = (text) => {
    return text.replace(/{patient_name}/g, patient?.patient_name || '');
  };

  const handleTemplateSelect = (type, template) => {
    if (type === 'email') {
      setEmailSubject(replacePlaceholders(template.subject));
      setEmailBody(replacePlaceholders(template.body));
    } else {
      setSmsBody(replacePlaceholders(template.body));
    }
  };

  const handleSubmit = async () => {
    if (!patient || !user || !profile) {
        toast({ variant: 'destructive', title: 'Erro', description: 'Paciente ou usuário não identificado.' });
        return;
    }
    
    setIsSending(true);
    try {
        if (activeTab === 'email') {
            if (!emailSubject || !emailBody) {
              toast({ variant: 'destructive', title: 'Campos obrigatórios', description: 'Assunto e corpo do e-mail não podem estar vazios.' });
              setIsSending(false);
              return;
            }
            await sendEmail({
                patientEmail: patient.patient_email,
                subject: emailSubject,
                body: emailBody,
                attachments: attachments,
                fromName: profile.full_name,
            });
            toast({ title: 'Email enviado com sucesso!', description: `E-mail enviado para ${patient.patient_name}`, className: 'bg-green-600 text-white' });
        } else {
            if (!smsBody) {
              toast({ variant: 'destructive', title: 'Campo obrigatório', description: 'A mensagem de SMS não pode estar vazia.' });
              setIsSending(false);
              return;
            }
            await sendMessage({
                patientId: patient.patient_id,
                body: smsBody
            });
            toast({ title: 'SMS enviado com sucesso!', className: 'bg-green-600 text-white' });
        }
        if(onSent) onSent();
        onClose();
    } catch (error) {
        toast({ variant: 'destructive', title: 'Falha no envio', description: error.message });
    } finally {
        setIsSending(false);
    }
  };

  if (!patient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl text-white">
        <DialogHeader>
          <DialogTitle>Enviar Comunicação para {patient.patient_name}</DialogTitle>
          <DialogDescription>
            Envie um e-mail ou SMS diretamente para o paciente.
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email"><Mail className="w-4 h-4 mr-2" /> E-mail</TabsTrigger>
            <TabsTrigger value="sms"><MessageSquare className="w-4 h-4 mr-2" /> SMS</TabsTrigger>
          </TabsList>
          
          <TabsContent value="email" className="space-y-4 pt-4">
            <TemplateSelector templates={emailTemplates} onSelect={(template) => handleTemplateSelect('email', template)} />
            <div className="space-y-2">
              <Label htmlFor="subject">Assunto</Label>
              <Input id="subject" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} placeholder="Assunto do E-mail" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-body">Mensagem</Label>
              <Textarea id="email-body" value={emailBody} onChange={(e) => setEmailBody(e.target.value)} placeholder="Escreva sua mensagem aqui..." className="min-h-[150px]" />
            </div>
            <div className="space-y-2">
              <Label>Anexos</Label>
              <FileUpload onFilesChange={setAttachments} />
            </div>
          </TabsContent>
          
          <TabsContent value="sms" className="space-y-4 pt-4">
            <TemplateSelector templates={smsTemplates} onSelect={(template) => handleTemplateSelect('sms', template)} />
            <div className="space-y-2">
              <Label htmlFor="sms-body">Mensagem</Label>
              <Textarea id="sms-body" value={smsBody} onChange={(e) => setSmsBody(e.target.value)} placeholder="Escreva sua mensagem de SMS aqui..." className="min-h-[150px]" maxLength={160} />
              <p className="text-xs text-slate-400 text-right">{smsBody.length} / 160 caracteres</p>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isSending} className="bg-blue-600 hover:bg-blue-700">
            <Send className="w-4 h-4 mr-2" />
            {isSending ? 'Enviando...' : 'Enviar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const TemplateSelector = ({ templates, onSelect }) => {
    const feedbackTemplates = templates.filter(t => t.name.includes('Feedback'));
    const otherTemplates = templates.filter(t => !t.name.includes('Feedback'));

    return (
    <div>
        <p className="text-sm font-medium text-slate-300 mb-2">Modelos Rápidos</p>
        <div className="flex flex-wrap gap-2">
            {otherTemplates.map(template => (
                <Button key={template.name} size="sm" variant="outline" onClick={() => onSelect(template)}>
                    <FileText className="w-3 h-3 mr-2" />
                    {template.name}
                </Button>
            ))}
        </div>
        {feedbackTemplates.length > 0 && (
            <div className="mt-4">
                <p className="text-sm font-medium text-slate-300 mb-2">Pedidos de Feedback</p>
                 <div className="flex flex-wrap gap-2">
                    {feedbackTemplates.map(template => (
                        <Button key={template.name} size="sm" variant="outline" className="text-amber-300 border-amber-300/50 hover:bg-amber-300/10 hover:text-amber-200" onClick={() => onSelect(template)}>
                            <Star className="w-3 h-3 mr-2" />
                            {template.name.replace('Pedido de Feedback ', '')}
                        </Button>
                    ))}
                </div>
            </div>
        )}
    </div>
)};


export default CommunicationModal;
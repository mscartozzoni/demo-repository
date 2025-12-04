import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mailbox, Folder, FolderOpen, User, DollarSign, Calendar, FileText, Briefcase, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';

const SectorMailbox = ({ icon, title, description, emails, folderStructure }) => {
  const latestEmail = emails.length > 0 ? emails[0] : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="glass-effect-strong text-foreground h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 text-lg text-foreground">
            {icon}
            <span>{title}</span>
            <span className="ml-auto text-xs font-bold bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center">
              {emails.length}
            </span>
          </CardTitle>
          <CardDescription className="text-muted-foreground">{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-semibold text-foreground flex items-center mb-2">
              <FolderOpen className="h-4 w-4 mr-2 text-blue-300" />
              Estrutura de Pastas (Exemplo)
            </h4>
            <div className="pl-4 border-l-2 border-primary/20 space-y-2 text-sm text-muted-foreground">
              {folderStructure.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Folder className="h-4 w-4 text-yellow-400" />
                  <span className="font-mono text-xs">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
             <h4 className="text-sm font-semibold text-foreground mb-2">Última Mensagem Recebida</h4>
             {latestEmail ? (
                <div className="text-xs text-muted-foreground space-y-1">
                    <p className="truncate"><strong>De:</strong> {latestEmail.patient_id}</p>
                    <p className="truncate"><strong>Assunto:</strong> {latestEmail.content.split('\n')[0]}</p>
                    <p>{new Date(latestEmail.created_at).toLocaleString('pt-BR')}</p>
                </div>
             ) : (
                <p className="text-xs text-muted-foreground text-center py-2">Nenhuma mensagem nesta caixa.</p>
             )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};


const MailboxTab = () => {
  const { messages, loading } = useData();

  const getSectorFromMessage = (content) => {
    if (!content) return 'Atendimento';
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('orçamento') || lowerContent.includes('valor')) return 'Orçamento';
    if (lowerContent.includes('agendar') || lowerContent.includes('consulta')) return 'Agendamento';
    if (lowerContent.includes('pagamento') || lowerContent.includes('fatura')) return 'Financeiro';
    return 'Atendimento';
  };

  const sectorEmails = useMemo(() => {
    const sectors = {
      Agendamento: [],
      Orçamento: [],
      Financeiro: [],
      Atendimento: [],
      Pacientes: [],
    };
    
    if (messages) {
      const receivedMessages = messages.filter(m => m.from_contact);
      receivedMessages.forEach(msg => {
        const sector = getSectorFromMessage(msg.content);
        sectors[sector].push(msg);
        sectors.Pacientes.push(msg);
      });
    }

    return sectors;
  }, [messages]);

  const mailboxes = [
    {
      title: 'Geral: Pacientes',
      icon: <User className="h-6 w-6 text-green-400" />,
      description: 'Todas as comunicações iniciadas pelos pacientes.',
      emails: sectorEmails.Pacientes,
      folderStructure: [
        'patientId_123/appointments/',
        'patientId_123/budgets/',
      ],
    },
    {
      title: 'Setor: Financeiro',
      icon: <DollarSign className="h-6 w-6 text-yellow-400" />,
      description: 'E-mails sobre pagamentos, faturas e orçamentos.',
      emails: sectorEmails.Financeiro,
      folderStructure: [
        'financeId_fin001/.../budgetId_b456/',
      ],
    },
    {
      title: 'Setor: Agendamento',
      icon: <Calendar className="h-6 w-6 text-blue-400" />,
      description: 'E-mails para agendamento, confirmação e remarcação.',
      emails: sectorEmails.Agendamento,
      folderStructure: [
            'appointmentId_app01/.../confirmation/',
      ],
    },
    {
      title: 'Setor: Orçamento',
      icon: <FileText className="h-6 w-6 text-purple-400" />,
      description: 'E-mails para envio e aprovação de orçamentos.',
      emails: sectorEmails.Orçamento,
      folderStructure: [
            'budgetId_b456/.../proposal/',
      ],
    },
    {
      title: 'Setor: Atendimento',
      icon: <Briefcase className="h-6 w-6 text-indigo-400" />,
      description: 'Comunicações gerais de atendimento ao cliente.',
      emails: sectorEmails.Atendimento,
      folderStructure: ['atendimentoId_atd01/.../general_query/'],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center">
          <Mailbox className="h-7 w-7 mr-3 text-primary"/>
          Gerenciamento de Caixas de Entrada
        </h2>
        <p className="text-muted-foreground">Visualize e gerencie as caixas de entrada por setor, alimentadas em tempo real.</p>
      </div>

       <div className="p-4 bg-yellow-500/20 border-l-4 border-yellow-400 text-yellow-200 rounded-r-lg flex items-start space-x-3">
        <AlertTriangle className="h-5 w-5 mt-1 flex-shrink-0" />
        <div>
          <h4 className="font-semibold">Simulação de Roteamento</h4>
          <p className="text-sm">
            As mensagens são roteadas para as caixas de entrada com base em palavras-chave no conteúdo do email. Esta é uma simulação para fins de demonstração.
          </p>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center text-muted-foreground">Carregando caixas de entrada...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mailboxes.map((mailbox, index) => (
            <SectorMailbox key={index} {...mailbox} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MailboxTab;
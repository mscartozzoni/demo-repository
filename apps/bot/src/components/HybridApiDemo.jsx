import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Send, 
  User, 
  Phone, 
  Mail,
  FileSpreadsheet,
  Database,
  Activity
} from 'lucide-react';
import { useHybridData } from '@/hooks/useHybridData';

const HybridApiDemo = () => {
  const { 
    addChatMessage, 
    addPatient, 
    addActivityLog, 
    loading, 
    connectionStatus 
  } = useHybridData();
  
  const { toast } = useToast();

  // Estados para formulários
  const [chatForm, setChatForm] = useState({
    patient_id: '',
    patient_name: '',
    message: '',
    priority: 'media',
    source: 'web'
  });

  const [patientForm, setPatientForm] = useState({
    patient_id: '',
    full_name: '',
    email: '',
    phone: '',
    status: 'novo'
  });

  /**
   * Demonstra adicionar mensagem de chat (vai para Google Sheets)
   */
  const handleAddChatMessage = async () => {
    if (!chatForm.patient_name || !chatForm.message) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Nome do paciente e mensagem são obrigatórios."
      });
      return;
    }

    try {
      const messageId = await addChatMessage({
        patient_id: chatForm.patient_id || `pat_${Date.now()}`,
        patient_name: chatForm.patient_name,
        message: chatForm.message,
        from_contact: true,
        priority: chatForm.priority,
        status: 'pendente',
        source: chatForm.source
      });

      toast({
        title: "✅ Mensagem Enviada",
        description: `Mensagem salva no Google Sheets. ID: ${messageId}`
      });

      // Log da atividade
      await addActivityLog({
        user_id: 'demo_user',
        user_name: 'Demo User',
        action: 'Mensagem de Chat Adicionada',
        details: `Nova mensagem de ${chatForm.patient_name}: ${chatForm.message.substring(0, 50)}...`
      });

      // Limpa formulário
      setChatForm({
        patient_id: '',
        patient_name: '',
        message: '',
        priority: 'media',
        source: 'web'
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao salvar mensagem."
      });
    }
  };

  /**
   * Demonstra adicionar paciente (vai para Supabase)
   */
  const handleAddPatient = async () => {
    if (!patientForm.full_name || !patientForm.email) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Nome e email são obrigatórios."
      });
      return;
    }

    try {
      const patientId = await addPatient({
        patient_id: patientForm.patient_id || `pac_${Date.now()}`,
        full_name: patientForm.full_name,
        email: patientForm.email,
        phone: patientForm.phone,
        status: patientForm.status
      });

      toast({
        title: "✅ Paciente Cadastrado",
        description: `Paciente salvo no Supabase. ID: ${patientId}`
      });

      // Log da atividade
      await addActivityLog({
        user_id: 'demo_user',
        user_name: 'Demo User',
        action: 'Paciente Cadastrado',
        details: `Novo paciente cadastrado: ${patientForm.full_name}`
      });

      // Limpa formulário
      setPatientForm({
        patient_id: '',
        full_name: '',
        email: '',
        phone: '',
        status: 'novo'
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao cadastrar paciente."
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Status das Conexões */}
      <div className="flex items-center gap-2 mb-4">
        <Badge variant={connectionStatus.supabase ? "default" : "destructive"}>
          <Database className="h-3 w-3 mr-1" />
          Supabase: {connectionStatus.supabase ? 'OK' : 'Erro'}
        </Badge>
        <Badge variant={connectionStatus.sheets ? "default" : "destructive"}>
          <FileSpreadsheet className="h-3 w-3 mr-1" />
          Sheets: {connectionStatus.sheets ? 'OK' : 'Erro'}
        </Badge>
      </div>

      {/* Demo: Adicionar Mensagem de Chat */}
      <Card className="glass-effect-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-green-500" />
            Demo: Mensagem de Chat → Google Sheets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="chat-patient-name">Nome do Paciente</Label>
              <Input
                id="chat-patient-name"
                value={chatForm.patient_name}
                onChange={(e) => setChatForm(prev => ({ ...prev, patient_name: e.target.value }))}
                placeholder="Ex: Maria Silva"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chat-priority">Prioridade</Label>
              <Select value={chatForm.priority} onValueChange={(value) => setChatForm(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger id="chat-priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="chat-message">Mensagem</Label>
            <Textarea
              id="chat-message"
              value={chatForm.message}
              onChange={(e) => setChatForm(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Digite a mensagem do paciente..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="chat-source">Origem</Label>
              <Select value={chatForm.source} onValueChange={(value) => setChatForm(prev => ({ ...prev, source: value }))}>
                <SelectTrigger id="chat-source">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="email">E-mail</SelectItem>
                  <SelectItem value="phone">Telefone</SelectItem>
                  <SelectItem value="web">Site</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleAddChatMessage} 
            disabled={loading || !connectionStatus.sheets}
            className="w-full"
          >
            <Send className="h-4 w-4 mr-2" />
            Enviar para Google Sheets
          </Button>

          <div className="text-xs text-muted-foreground p-2 bg-green-50 border border-green-200 rounded">
            📊 Esta mensagem será armazenada no Google Sheets para análise manual e relatórios.
          </div>
        </CardContent>
      </Card>

      {/* Demo: Adicionar Paciente */}
      <Card className="glass-effect-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-500" />
            Demo: Cadastro de Paciente → Supabase
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient-name">Nome Completo</Label>
              <Input
                id="patient-name"
                value={patientForm.full_name}
                onChange={(e) => setPatientForm(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Ex: João Santos"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patient-email">E-mail</Label>
              <Input
                id="patient-email"
                type="email"
                value={patientForm.email}
                onChange={(e) => setPatientForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="joao@exemplo.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient-phone">Telefone</Label>
              <Input
                id="patient-phone"
                value={patientForm.phone}
                onChange={(e) => setPatientForm(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(11) 99999-9999"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patient-status">Status</Label>
              <Select value={patientForm.status} onValueChange={(value) => setPatientForm(prev => ({ ...prev, status: value }))}>
                <SelectTrigger id="patient-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="novo">Novo</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleAddPatient} 
            disabled={loading || !connectionStatus.supabase}
            className="w-full"
          >
            <User className="h-4 w-4 mr-2" />
            Salvar no Supabase
          </Button>

          <div className="text-xs text-muted-foreground p-2 bg-blue-50 border border-blue-200 rounded">
            🗄️ Este paciente será armazenado no Supabase para consultas rápidas e relacionamentos.
          </div>
        </CardContent>
      </Card>

      {/* Informações da Arquitetura */}
      <Card className="glass-effect-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Como Funciona a Arquitetura Híbrida
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-green-500" />
                Google Sheets
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✅ Mensagens de chat e conversas</li>
                <li>✅ Logs de atividade do sistema</li>
                <li>✅ Métricas e relatórios</li>
                <li>✅ Dados para análise manual</li>
                <li>✅ Fácil exportação para Excel</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-500" />
                Supabase
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✅ Dados de pacientes estruturados</li>
                <li>✅ Agendamentos e consultas</li>
                <li>✅ Orçamentos e financeiro</li>
                <li>✅ Relacionamentos entre tabelas</li>
                <li>✅ Consultas SQL complexas</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-semibold text-amber-800 mb-2">🚀 Próximos Passos</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>1. Configurar credenciais do Google Sheets na aba "Conexões"</li>
              <li>2. Verificar configuração do Supabase</li>
              <li>3. Testar os endpoints da API híbrida</li>
              <li>4. Implementar webhooks para integração automática</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HybridApiDemo;

/**
 * Hybrid Data Service - TypeScript Implementation
 * 
 * Gerencia dados híbridos entre Google Sheets e Supabase:
 * - Chat/Mensagens → Google Sheets (análise manual facilitada)
 * - Dados estruturados → Supabase (performance e relacionamentos)
 */

// Função auxiliar para gerar IDs únicos
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

import { supabase } from '../supabaseClient';

// Interfaces para dados híbridos
export interface HybridChatMessage {
  id: string;
  patient_id: string;
  patient_name: string;
  message: string;
  from_contact: boolean;
  timestamp: string;
  priority: 'baixa' | 'media' | 'alta';
  status: 'pendente' | 'em_andamento' | 'resolvido';
  assigned_to?: string;
  tags?: string[];
  source: 'whatsapp' | 'email' | 'phone' | 'web';
}

export interface HybridPatientData {
  id: string;
  patient_id: string;
  full_name: string;
  email: string;
  phone: string;
  status: 'novo' | 'ativo' | 'inativo';
  created_at: string;
  updated_at: string;
}

export interface HybridAppointment {
  id: string;
  patient_id: string;
  appointment_date: string;
  appointment_type: 'consulta' | 'cirurgia' | 'retorno' | 'pos_op';
  status: 'agendado' | 'confirmado' | 'realizado' | 'cancelado';
  notes?: string;
  created_at: string;
}

export interface HybridActivityLog {
  id: string;
  user_id: string;
  user_name: string;
  action: string;
  details: string;
  timestamp: string;
  metadata?: any;
}

// Configuração para cada tipo de dado
const DATA_ROUTING = {
  // Dados para Google Sheets (análise manual)
  sheets: [
    'chat_messages',
    'activity_logs', 
    'interaction_logs',
    'system_metrics'
  ],
  // Dados para Supabase (estruturados)
  supabase: [
    'patients',
    'appointments', 
    'budgets',
    'users',
    'settings'
  ]
} as const;

class HybridDataService {
  private sheetsClient: any = null;
  private supabaseClient = supabase;

  constructor() {
    this.initializeGoogleSheets();
  }

  /**
   * Inicializa o cliente Google Sheets (mock para desenvolvimento)
   */
  private async initializeGoogleSheets(): Promise<void> {
    // Mock do Google Sheets para desenvolvimento
    this.sheetsClient = {
      addRow: async (sheetName: string, data: any) => {
        console.log(`📊 [MOCK] Adicionando no Sheets ${sheetName}:`, data);
        return Promise.resolve(data);
      },
      getRows: async (sheetName: string, filters?: any) => {
        console.log(`📊 [MOCK] Buscando do Sheets ${sheetName}:`, filters);
        return Promise.resolve([]);
      },
      updateMetrics: async (metrics: any) => {
        console.log(`📊 [MOCK] Atualizando métricas:`, metrics);
        return Promise.resolve(true);
      }
    };
  }

  /**
   * Adiciona mensagem de chat (Google Sheets)
   */
  async addChatMessage(message: Omit<HybridChatMessage, 'id' | 'timestamp'>): Promise<string> {
    const chatMessage: HybridChatMessage = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      ...message
    };

    try {
      // Adiciona no Google Sheets para análise manual
      await this.sheetsClient?.addRow('chat_messages', {
        id: chatMessage.id,
        patient_id: chatMessage.patient_id,
        patient_name: chatMessage.patient_name,
        message: chatMessage.message,
        from_contact: chatMessage.from_contact,
        timestamp: chatMessage.timestamp,
        priority: chatMessage.priority,
        status: chatMessage.status,
        assigned_to: chatMessage.assigned_to || '',
        tags: chatMessage.tags?.join(', ') || '',
        source: chatMessage.source
      });

      // Também armazena referência no Supabase para relacionamentos
      await this.supabaseClient.from('inbox_messages').insert({
        id: chatMessage.id,
        patient_id: chatMessage.patient_id,
        patient_name: chatMessage.patient_name,
        message: chatMessage.message,
        type: 'communication',
        status: chatMessage.status || 'pendente',
        priority: chatMessage.priority || 'media',
        is_new_patient: false,
        from: chatMessage.from_contact ? 'patient' : 'agent',
        assigned_to_id: chatMessage.assigned_to || null
      });

      console.log(`💬 Mensagem híbrida salva: ${chatMessage.id}`);
      return chatMessage.id;
    } catch (error) {
      console.error('❌ Erro ao salvar mensagem híbrida:', error);
      throw error;
    }
  }

  /**
   * Busca mensagens por paciente (Google Sheets + Supabase)
   */
  async getMessagesByPatient(patientId: string): Promise<HybridChatMessage[]> {
    try {
      // Busca no Supabase (schema real: inbox_messages)
      const { data: supabaseMessages, error } = await this.supabaseClient
        .from('inbox_messages')
        .select(`
          id,
          patient_id,
          patient_name,
          message,
          type,
          status,
          priority,
          from,
          assigned_to_id,
          created_at
        `)
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Converte para formato híbrido
      const messages: HybridChatMessage[] = (supabaseMessages || []).map((msg: any) => ({
        id: msg.id,
        patient_id: msg.patient_id,
        patient_name: msg.patient_name || '',
        message: msg.message,
        from_contact: (msg.from === 'patient'),
        timestamp: msg.created_at,
        priority: (msg.priority || 'media'),
        status: (msg.status || 'pendente'),
        assigned_to: msg.assigned_to_id || undefined,
        tags: [],
        source: 'web'
      }));

      return messages;
    } catch (error) {
      console.error('❌ Erro ao buscar mensagens por paciente:', error);
      return [];
    }
  }

  /**
   * Adiciona paciente (Supabase)
   */
  async addPatient(patient: Omit<HybridPatientData, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
      const patientData: HybridPatientData = {
        id: generateId(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...patient
      };

      const { data, error } = await this.supabaseClient
        .from('patients')
        .insert({
          id: patientData.id,
          patient_id: patientData.patient_id,
          full_name: patientData.full_name,
          email: patientData.email,
          phone: patientData.phone,
          status: patientData.status,
          created_at: patientData.created_at
        })
        .select()
        .single();

      if (error) {
        // Erro 409 - Conflict: patient_id ou email já existe
        if (error.code === '23505' || error.message.includes('duplicate') || error.message.includes('unique')) {
          console.warn(`⚠️ Paciente duplicado: ${patientData.patient_id} ou ${patientData.email}`);
          
          // Busca o paciente existente
          const { data: existingPatient } = await this.supabaseClient
            .from('patients')
            .select('*')
            .or(`patient_id.eq.${patientData.patient_id},email.eq.${patientData.email}`)
            .single();
          
          if (existingPatient) {
            console.log(`📋 Paciente já existe: ${existingPatient.full_name}`);
            return existingPatient.id;
          }
        }
        
        throw error;
      }

      console.log(`👤 Paciente adicionado: ${patientData.full_name}`);
      return patientData.id;
    } catch (error) {
      console.error('❌ Erro ao adicionar paciente:', error);
      throw error;
    }
  }

  /**
   * Busca todos os pacientes (Supabase)
   */
  async getAllPatients(): Promise<HybridPatientData[]> {
    try {
      const { data, error } = await this.supabaseClient
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(patient => ({
        id: patient.id,
        patient_id: patient.patient_id,
        full_name: patient.full_name,
        email: patient.email,
        phone: patient.phone,
        status: patient.status,
        created_at: patient.created_at,
        updated_at: patient.updated_at || patient.created_at
      }));
    } catch (error) {
      console.error('❌ Erro ao buscar pacientes:', error);
      return [];
    }
  }

  /**
   * Adiciona agendamento (Supabase)
   */
  async addAppointment(appointment: Omit<HybridAppointment, 'id' | 'created_at'>): Promise<string> {
    try {
      const appointmentData: HybridAppointment = {
        id: generateId(),
        created_at: new Date().toISOString(),
        ...appointment
      };

      const { data, error } = await this.supabaseClient
        .from('appointments')
        .insert({
          id: appointmentData.id,
          patient_id: appointmentData.patient_id,
          appointment_date: appointmentData.appointment_date,
          appointment_type: appointmentData.appointment_type,
          status: appointmentData.status,
          notes: appointmentData.notes,
          created_at: appointmentData.created_at
        })
        .select()
        .single();

      if (error) throw error;

      console.log(`📅 Agendamento criado: ${appointmentData.id}`);
      return appointmentData.id;
    } catch (error) {
      console.error('❌ Erro ao criar agendamento:', error);
      throw error;
    }
  }

  /**
   * Adiciona log de atividade (Google Sheets)
   */
  async addActivityLog(log: Omit<HybridActivityLog, 'id' | 'timestamp'>): Promise<void> {
    const activityLog: HybridActivityLog = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      ...log
    };

    try {
      await this.sheetsClient?.addRow('activity_logs', {
        id: activityLog.id,
        user_id: activityLog.user_id,
        user_name: activityLog.user_name,
        action: activityLog.action,
        details: activityLog.details,
        timestamp: activityLog.timestamp,
        metadata: JSON.stringify(activityLog.metadata || {})
      });

      console.log(`📋 Log registrado: ${activityLog.action}`);
    } catch (error) {
      console.error('❌ Erro ao registrar log:', error);
      throw error;
    }
  }

  /**
   * Busca dados consolidados para dashboard
   */
  async getDashboardData(): Promise<{
    totalPatients: number;
    pendingMessages: number;
    todayAppointments: number;
    systemHealth: 'healthy' | 'warning' | 'error';
  }> {
    try {
      const [patientsResult, messagesResult, appointmentsResult] = await Promise.all([
        this.supabaseClient.from('patients').select('id', { count: 'exact' }),
        this.supabaseClient.from('inbox_messages').select('id', { count: 'exact' }).eq('status', 'pendente'),
        this.supabaseClient.from('appointments').select('id', { count: 'exact' }).gte('appointment_date', new Date().toISOString().split('T')[0])
      ]);

      return {
        totalPatients: patientsResult.count || 0,
        pendingMessages: messagesResult.count || 0,
        todayAppointments: appointmentsResult.count || 0,
        systemHealth: 'healthy'
      };
    } catch (error) {
      console.error('❌ Erro ao buscar dados do dashboard:', error);
      return {
        totalPatients: 0,
        pendingMessages: 0,
        todayAppointments: 0,
        systemHealth: 'error'
      };
    }
  }

  /**
   * Atualiza métricas do sistema (Google Sheets)
   */
  async updateSystemMetrics(): Promise<void> {
    try {
      const dashboardData = await this.getDashboardData();
      
      await this.sheetsClient?.updateMetrics({
        date: new Date().toISOString().split('T')[0],
        total_patients: dashboardData.totalPatients,
        pending_messages: dashboardData.pendingMessages,
        today_appointments: dashboardData.todayAppointments,
        system_health: dashboardData.systemHealth,
        timestamp: new Date().toISOString()
      });

      console.log('📊 Métricas do sistema atualizadas');
    } catch (error) {
      console.error('❌ Erro ao atualizar métricas:', error);
    }
  }

  /**
   * Testa conexões híbridas
   */
  async testConnections(): Promise<{
    supabase: boolean;
    sheets: boolean;
    overall: boolean;
  }> {
    const results = {
      supabase: false,
      sheets: false,
      overall: false
    };

    try {
      // Testa Supabase
      const { data, error } = await this.supabaseClient.from('patients').select('id').limit(1);
      results.supabase = !error;
      
      // Testa Google Sheets (mock)
      results.sheets = !!this.sheetsClient;
      
      results.overall = results.supabase && results.sheets;
      
      console.log('🔍 Status das conexões híbridas:', results);
      return results;
    } catch (error) {
      console.error('❌ Erro no teste de conexões:', error);
      return results;
    }
  }
}

export default HybridDataService;

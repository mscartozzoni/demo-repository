/**
 * Google Sheets Service - TypeScript Implementation
 * 
 * Gerencia a integração com Google Sheets para armazenamento de:
 * - Mensagens de chat/conversas
 * - Logs de atividades
 * - Dados temporários e análises
 */

import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet';

// Types para Google Sheets Integration
export interface ChatMessage {
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

export interface ActivityLog {
  id: string;
  user_id: string;
  user_name: string;
  action: string;
  details: string;
  timestamp: string;
  ip_address?: string;
  user_agent?: string;
}

export interface PatientInteraction {
  patient_id: string;
  interaction_type: 'consulta' | 'orcamento' | 'cirurgia' | 'pos_op' | 'follow_up';
  interaction_data: any;
  timestamp: string;
  status: string;
}

class GoogleSheetsService {
  private spreadsheetId: string;
  private serviceAccountAuth: JWT;
  private doc: GoogleSpreadsheet | null = null;

  constructor() {
    this.spreadsheetId = import.meta.env.VITE_GOOGLE_SHEET_ID;
    
    const privateKey = import.meta.env.VITE_GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const clientEmail = import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL;

    this.serviceAccountAuth = new JWT({
      email: clientEmail,
      key: privateKey,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file',
      ],
    });
  }

  /**
   * Inicializa a conexão com o Google Sheets
   */
  async initialize(): Promise<void> {
    try {
      this.doc = new GoogleSpreadsheet(this.spreadsheetId, this.serviceAccountAuth);
      await this.doc.loadInfo();
      console.log(`📊 Conectado ao Google Sheets: ${this.doc.title}`);
      
      await this.ensureWorksheets();
    } catch (error) {
      console.error('❌ Erro ao conectar Google Sheets:', error);
      throw error;
    }
  }

  /**
   * Garante que todas as abas necessárias existem
   */
  private async ensureWorksheets(): Promise<void> {
    if (!this.doc) throw new Error('Documento não inicializado');

    const requiredSheets = [
      'chat_messages',
      'activity_logs', 
      'patient_interactions',
      'system_metrics'
    ];

    for (const sheetName of requiredSheets) {
      let sheet = this.doc.sheetsByTitle[sheetName];
      
      if (!sheet) {
        console.log(`📝 Criando aba: ${sheetName}`);
        sheet = await this.doc.addSheet({ 
          title: sheetName,
          headerValues: this.getHeadersForSheet(sheetName)
        });
      }
    }
  }

  /**
   * Define os cabeçalhos para cada tipo de aba
   */
  private getHeadersForSheet(sheetName: string): string[] {
    const headers = {
      chat_messages: [
        'id', 'patient_id', 'patient_name', 'message', 'from_contact',
        'timestamp', 'priority', 'status', 'assigned_to', 'tags', 'source'
      ],
      activity_logs: [
        'id', 'user_id', 'user_name', 'action', 'details', 
        'timestamp', 'ip_address', 'user_agent'
      ],
      patient_interactions: [
        'patient_id', 'interaction_type', 'interaction_data', 
        'timestamp', 'status'
      ],
      system_metrics: [
        'date', 'total_messages', 'resolved_messages', 'pending_messages',
        'avg_response_time', 'active_users', 'system_load'
      ]
    };

    return headers[sheetName as keyof typeof headers] || ['id', 'data', 'timestamp'];
  }

  /**
   * Adiciona uma nova mensagem de chat
   */
  async addChatMessage(message: ChatMessage): Promise<void> {
    try {
      if (!this.doc) await this.initialize();
      
      const sheet = this.doc!.sheetsByTitle['chat_messages'];
      await sheet.addRow({
        id: message.id,
        patient_id: message.patient_id,
        patient_name: message.patient_name,
        message: message.message,
        from_contact: message.from_contact ? 'TRUE' : 'FALSE',
        timestamp: message.timestamp,
        priority: message.priority,
        status: message.status,
        assigned_to: message.assigned_to || '',
        tags: Array.isArray(message.tags) ? message.tags.join(', ') : '',
        source: message.source
      });
      
      console.log(`💬 Mensagem adicionada ao Sheets: ${message.id}`);
    } catch (error) {
      console.error('❌ Erro ao adicionar mensagem:', error);
      throw error;
    }
  }

  /**
   * Busca mensagens por paciente
   */
  async getMessagesByPatient(patientId: string): Promise<ChatMessage[]> {
    try {
      if (!this.doc) await this.initialize();
      
      const sheet = this.doc!.sheetsByTitle['chat_messages'];
      const rows = await sheet.getRows();
      
      return rows
        .filter(row => row.get('patient_id') === patientId)
        .map(row => ({
          id: row.get('id'),
          patient_id: row.get('patient_id'),
          patient_name: row.get('patient_name'),
          message: row.get('message'),
          from_contact: row.get('from_contact') === 'TRUE',
          timestamp: row.get('timestamp'),
          priority: row.get('priority') as 'baixa' | 'media' | 'alta',
          status: row.get('status') as 'pendente' | 'em_andamento' | 'resolvido',
          assigned_to: row.get('assigned_to'),
          tags: row.get('tags') ? row.get('tags').split(', ') : [],
          source: row.get('source') as 'whatsapp' | 'email' | 'phone' | 'web'
        }));
    } catch (error) {
      console.error('❌ Erro ao buscar mensagens:', error);
      return [];
    }
  }

  /**
   * Adiciona log de atividade
   */
  async addActivityLog(log: ActivityLog): Promise<void> {
    try {
      if (!this.doc) await this.initialize();
      
      const sheet = this.doc!.sheetsByTitle['activity_logs'];
      await sheet.addRow({
        id: log.id,
        user_id: log.user_id,
        user_name: log.user_name,
        action: log.action,
        details: log.details,
        timestamp: log.timestamp,
        ip_address: log.ip_address || '',
        user_agent: log.user_agent || ''
      });
      
      console.log(`📋 Log adicionado ao Sheets: ${log.action}`);
    } catch (error) {
      console.error('❌ Erro ao adicionar log:', error);
      throw error;
    }
  }

  /**
   * Registra interação do paciente
   */
  async addPatientInteraction(interaction: PatientInteraction): Promise<void> {
    try {
      if (!this.doc) await this.initialize();
      
      const sheet = this.doc!.sheetsByTitle['patient_interactions'];
      await sheet.addRow({
        patient_id: interaction.patient_id,
        interaction_type: interaction.interaction_type,
        interaction_data: JSON.stringify(interaction.interaction_data),
        timestamp: interaction.timestamp,
        status: interaction.status
      });
      
      console.log(`🩺 Interação registrada: ${interaction.interaction_type}`);
    } catch (error) {
      console.error('❌ Erro ao registrar interação:', error);
      throw error;
    }
  }

  /**
   * Atualiza métricas do sistema
   */
  async updateSystemMetrics(metrics: {
    total_messages: number;
    resolved_messages: number;
    pending_messages: number;
    avg_response_time: number;
    active_users: number;
    system_load: number;
  }): Promise<void> {
    try {
      if (!this.doc) await this.initialize();
      
      const sheet = this.doc!.sheetsByTitle['system_metrics'];
      const today = new Date().toISOString().split('T')[0];
      
      // Verifica se já existe entrada para hoje
      const rows = await sheet.getRows();
      const todayRow = rows.find(row => row.get('date') === today);
      
      if (todayRow) {
        // Atualiza linha existente
        todayRow.assign({
          total_messages: metrics.total_messages,
          resolved_messages: metrics.resolved_messages,
          pending_messages: metrics.pending_messages,
          avg_response_time: metrics.avg_response_time,
          active_users: metrics.active_users,
          system_load: metrics.system_load
        });
        await todayRow.save();
      } else {
        // Cria nova linha
        await sheet.addRow({
          date: today,
          ...metrics
        });
      }
      
      console.log(`📊 Métricas atualizadas para ${today}`);
    } catch (error) {
      console.error('❌ Erro ao atualizar métricas:', error);
      throw error;
    }
  }

  /**
   * Busca dados para relatórios
   */
  async getReportData(sheetName: string, filters?: any): Promise<any[]> {
    try {
      if (!this.doc) await this.initialize();
      
      const sheet = this.doc!.sheetsByTitle[sheetName];
      const rows = await sheet.getRows();
      
      // Aplicar filtros se fornecidos
      return rows.map(row => {
        const data: any = {};
        sheet.headerValues.forEach(header => {
          data[header] = row.get(header);
        });
        return data;
      });
    } catch (error) {
      console.error('❌ Erro ao buscar dados do relatório:', error);
      return [];
    }
  }

  /**
   * Testa a conexão
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.initialize();
      console.log('✅ Conexão com Google Sheets estabelecida');
      return true;
    } catch (error) {
      console.error('❌ Falha na conexão com Google Sheets:', error);
      return false;
    }
  }
}

export default GoogleSheetsService;

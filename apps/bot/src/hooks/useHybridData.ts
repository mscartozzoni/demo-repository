/**
 * Hook para gerenciar dados híbridos entre Google Sheets e Supabase
 * 
 * Facilita o uso do HybridDataService nos componentes React
 */

import { useState, useEffect, useCallback } from 'react';
import HybridDataService, { 
  HybridChatMessage, 
  HybridPatientData, 
  HybridAppointment, 
  HybridActivityLog 
} from '../services/HybridDataService';

interface UseHybridDataReturn {
  // Estados
  loading: boolean;
  error: string | null;
  connectionStatus: {
    supabase: boolean;
    sheets: boolean;
    overall: boolean;
  };

  // Métodos para chat/mensagens
  addChatMessage: (message: Omit<HybridChatMessage, 'id' | 'timestamp'>) => Promise<string>;
  getMessagesByPatient: (patientId: string) => Promise<HybridChatMessage[]>;

  // Métodos para pacientes
  addPatient: (patient: Omit<HybridPatientData, 'id' | 'created_at' | 'updated_at'>) => Promise<string>;
  getAllPatients: () => Promise<HybridPatientData[]>;

  // Métodos para agendamentos
  addAppointment: (appointment: Omit<HybridAppointment, 'id' | 'created_at'>) => Promise<string>;

  // Métodos para logs
  addActivityLog: (log: Omit<HybridActivityLog, 'id' | 'timestamp'>) => Promise<void>;

  // Métricas e dashboard
  getDashboardData: () => Promise<any>;
  updateSystemMetrics: () => Promise<void>;

  // Utilitários
  testConnections: () => Promise<void>;
  refreshData: () => Promise<void>;
}

export const useHybridData = (): UseHybridDataReturn => {
  const [dataService] = useState(() => new HybridDataService());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState({
    supabase: false,
    sheets: false,
    overall: false
  });

  // Testa conexões ao inicializar
  useEffect(() => {
    testConnections();
  }, []);

  /**
   * Wrapper para execução de operações com loading e error handling
   */
  const withLoadingAndError = useCallback(async <T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await operation();
      console.log(`✅ ${operationName} executada com sucesso`);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error(`❌ Erro em ${operationName}:`, errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Adiciona mensagem de chat
   */
  const addChatMessage = useCallback(async (
    message: Omit<HybridChatMessage, 'id' | 'timestamp'>
  ): Promise<string> => {
    const result = await withLoadingAndError(
      () => dataService.addChatMessage(message),
      'Adicionar mensagem de chat'
    );
    return result || '';
  }, [dataService, withLoadingAndError]);

  /**
   * Busca mensagens por paciente
   */
  const getMessagesByPatient = useCallback(async (
    patientId: string
  ): Promise<HybridChatMessage[]> => {
    const result = await withLoadingAndError(
      () => dataService.getMessagesByPatient(patientId),
      'Buscar mensagens do paciente'
    );
    return result || [];
  }, [dataService, withLoadingAndError]);

  /**
   * Adiciona paciente
   */
  const addPatient = useCallback(async (
    patient: Omit<HybridPatientData, 'id' | 'created_at' | 'updated_at'>
  ): Promise<string> => {
    const result = await withLoadingAndError(
      () => dataService.addPatient(patient),
      'Adicionar paciente'
    );
    return result || '';
  }, [dataService, withLoadingAndError]);

  /**
   * Busca todos os pacientes
   */
  const getAllPatients = useCallback(async (): Promise<HybridPatientData[]> => {
    const result = await withLoadingAndError(
      () => dataService.getAllPatients(),
      'Buscar todos os pacientes'
    );
    return result || [];
  }, [dataService, withLoadingAndError]);

  /**
   * Adiciona agendamento
   */
  const addAppointment = useCallback(async (
    appointment: Omit<HybridAppointment, 'id' | 'created_at'>
  ): Promise<string> => {
    const result = await withLoadingAndError(
      () => dataService.addAppointment(appointment),
      'Adicionar agendamento'
    );
    return result || '';
  }, [dataService, withLoadingAndError]);

  /**
   * Adiciona log de atividade
   */
  const addActivityLog = useCallback(async (
    log: Omit<HybridActivityLog, 'id' | 'timestamp'>
  ): Promise<void> => {
    await withLoadingAndError(
      () => dataService.addActivityLog(log),
      'Adicionar log de atividade'
    );
  }, [dataService, withLoadingAndError]);

  /**
   * Busca dados do dashboard
   */
  const getDashboardData = useCallback(async (): Promise<any> => {
    const result = await withLoadingAndError(
      () => dataService.getDashboardData(),
      'Buscar dados do dashboard'
    );
    return result || {
      totalPatients: 0,
      pendingMessages: 0,
      todayAppointments: 0,
      systemHealth: 'error'
    };
  }, [dataService, withLoadingAndError]);

  /**
   * Atualiza métricas do sistema
   */
  const updateSystemMetrics = useCallback(async (): Promise<void> => {
    await withLoadingAndError(
      () => dataService.updateSystemMetrics(),
      'Atualizar métricas do sistema'
    );
  }, [dataService, withLoadingAndError]);

  /**
   * Testa conexões
   */
  const testConnections = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const status = await dataService.testConnections();
      setConnectionStatus(status);
      
      if (status.overall) {
        setError(null);
        console.log('✅ Todas as conexões híbridas estão funcionando');
      } else {
        setError('Algumas conexões não estão funcionando corretamente');
        console.warn('⚠️ Status das conexões:', status);
      }
    } catch (err) {
      setError('Erro ao testar conexões');
      console.error('❌ Erro no teste de conexões:', err);
    } finally {
      setLoading(false);
    }
  }, [dataService]);

  /**
   * Atualiza dados gerais
   */
  const refreshData = useCallback(async (): Promise<void> => {
    await Promise.all([
      testConnections(),
      updateSystemMetrics()
    ]);
  }, [testConnections, updateSystemMetrics]);

  return {
    // Estados
    loading,
    error,
    connectionStatus,

    // Métodos para chat/mensagens
    addChatMessage,
    getMessagesByPatient,

    // Métodos para pacientes
    addPatient,
    getAllPatients,

    // Métodos para agendamentos
    addAppointment,

    // Métodos para logs
    addActivityLog,

    // Métricas e dashboard
    getDashboardData,
    updateSystemMetrics,

    // Utilitários
    testConnections,
    refreshData
  };
};

export default useHybridData;

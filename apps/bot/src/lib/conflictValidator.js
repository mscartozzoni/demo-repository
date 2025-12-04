// Utilitários para validação e prevenção de conflitos (erro 409)
import { supabase } from '@/supabaseClient';

/**
 * Validação prévia de duplicatas para evitar erro 409
 */
export class ConflictValidator {
  
  /**
   * Verifica se um contato já existe antes de inserir
   */
  static async validateContact(contactData) {
    try {
      const conditions = [`patient_id.eq.${contactData.patient_id}`];
      
      if (contactData.email) {
        conditions.push(`email.eq.${contactData.email}`);
      }
      
      const { data: existing, error } = await supabase
        .from('inbox_contacts')
        .select('id, patient_id, name, email')
        .or(conditions.join(','))
        .limit(1);

      if (error) {
        console.error('❌ Erro na validação de contato:', error);
        return { isValid: true, existing: null }; // Assume válido se não conseguir verificar
      }

      if (existing && existing.length > 0) {
        return {
          isValid: false,
          existing: existing[0],
          message: `Contato já existe: ${existing[0].name} (ID: ${existing[0].patient_id})`
        };
      }

      return { isValid: true, existing: null };
    } catch (err) {
      console.error('❌ Erro inesperado na validação:', err);
      return { isValid: true, existing: null }; // Falha silenciosa
    }
  }

  /**
   * Verifica se um usuário já existe antes de inserir
   */
  static async validateUser(userData) {
    try {
      const { data: existing, error } = await supabase
        .from('inbox_users')
        .select('id, name, auth_email')
        .eq('auth_email', userData.auth_email)
        .limit(1);

      if (error) {
        console.error('❌ Erro na validação de usuário:', error);
        return { isValid: true, existing: null };
      }

      if (existing && existing.length > 0) {
        return {
          isValid: false,
          existing: existing[0],
          message: `Usuário já existe: ${existing[0].name} (${existing[0].auth_email})`
        };
      }

      return { isValid: true, existing: null };
    } catch (err) {
      console.error('❌ Erro inesperado na validação de usuário:', err);
      return { isValid: true, existing: null };
    }
  }

  /**
   * Verifica se um paciente já existe na tabela patients (Supabase)
   */
  static async validatePatient(patientData) {
    try {
      const conditions = [`patient_id.eq.${patientData.patient_id}`];
      
      if (patientData.email) {
        conditions.push(`email.eq.${patientData.email}`);
      }

      const { data: existing, error } = await supabase
        .from('patients')
        .select('id, patient_id, full_name, email')
        .or(conditions.join(','))
        .limit(1);

      if (error) {
        console.error('❌ Erro na validação de paciente:', error);
        return { isValid: true, existing: null };
      }

      if (existing && existing.length > 0) {
        return {
          isValid: false,
          existing: existing[0],
          message: `Paciente já existe: ${existing[0].full_name} (ID: ${existing[0].patient_id})`
        };
      }

      return { isValid: true, existing: null };
    } catch (err) {
      console.error('❌ Erro inesperado na validação de paciente:', err);
      return { isValid: true, existing: null };
    }
  }

  /**
   * Verifica se uma etiqueta já existe
   */
  static async validateTag(tagData) {
    try {
      const { data: existing, error } = await supabase
        .from('inbox_tags')
        .select('id, name')
        .eq('name', tagData.name)
        .limit(1);

      if (error) {
        console.error('❌ Erro na validação de etiqueta:', error);
        return { isValid: true, existing: null };
      }

      if (existing && existing.length > 0) {
        return {
          isValid: false,
          existing: existing[0],
          message: `Etiqueta já existe: ${existing[0].name}`
        };
      }

      return { isValid: true, existing: null };
    } catch (err) {
      console.error('❌ Erro inesperado na validação de etiqueta:', err);
      return { isValid: true, existing: null };
    }
  }
}

/**
 * Códigos de erro PostgreSQL comuns
 */
export const PostgreSQLErrorCodes = {
  UNIQUE_VIOLATION: '23505',
  FOREIGN_KEY_VIOLATION: '23503',
  NOT_NULL_VIOLATION: '23502',
  CHECK_VIOLATION: '23514'
};

/**
 * Helper para identificar tipos de erro de conflito
 */
export function analyzeConflictError(error) {
  if (!error) return null;
  
  const isDuplicateKey = error.code === PostgreSQLErrorCodes.UNIQUE_VIOLATION || 
                        error.message?.includes('duplicate') || 
                        error.message?.includes('unique');
  
  const isForeignKeyError = error.code === PostgreSQLErrorCodes.FOREIGN_KEY_VIOLATION;
  
  const isNotNullError = error.code === PostgreSQLErrorCodes.NOT_NULL_VIOLATION;
  
  return {
    isDuplicateKey,
    isForeignKeyError,
    isNotNullError,
    details: error.message,
    code: error.code,
    hint: error.hint
  };
}

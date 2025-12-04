import { supabase } from '@/supabaseClient';

/**
 * Utilitários para autenticação e validação de login
 */
export class AuthUtils {
  
  /**
   * Verifica se um email está cadastrado no sistema
   */
  static async checkUserExists(email) {
    try {
      const { data, error } = await supabase
        .from('inbox_users')
        .select('id, name, sector, auth_email')
        .eq('auth_email', email)
        .limit(1);

      if (error) {
        console.error('❌ Erro ao verificar usuário:', error);
        return { exists: false, user: null, error: error.message };
      }

      if (data && data.length > 0) {
        return { exists: true, user: data[0], error: null };
      }

      return { exists: false, user: null, error: null };
    } catch (err) {
      console.error('❌ Erro inesperado ao verificar usuário:', err);
      return { exists: false, user: null, error: 'Erro inesperado' };
    }
  }

  /**
   * Simula autenticação (para ambiente sem backend completo)
   */
  static async simulateLogin(email, password) {
    try {
      // Verificar se o usuário existe
      const userCheck = await this.checkUserExists(email);
      
      if (!userCheck.exists) {
        return {
          success: false,
          error: 'Usuário não encontrado. Verifique seu email ou crie uma conta.',
          user: null
        };
      }

      // Simular verificação de senha
      if (!password || password.length < 6) {
        return {
          success: false,
          error: 'Senha deve ter pelo menos 6 caracteres.',
          user: null
        };
      }

      // Login bem-sucedido
      const user = {
        id: userCheck.user.id,
        name: userCheck.user.name,
        email: userCheck.user.auth_email,
        sector: userCheck.user.sector,
        role: 'agent', // Por padrão
        loginTime: new Date().toISOString()
      };

      // Salvar no localStorage para persistir sessão
      localStorage.setItem('portal_clinic_user', JSON.stringify(user));
      
      return {
        success: true,
        error: null,
        user
      };

    } catch (err) {
      console.error('❌ Erro no login simulado:', err);
      return {
        success: false,
        error: 'Erro interno. Tente novamente.',
        user: null
      };
    }
  }

  /**
   * Busca o usuário logado do localStorage
   */
  static getCurrentUser() {
    try {
      const userData = localStorage.getItem('portal_clinic_user');
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch (err) {
      console.error('❌ Erro ao buscar usuário atual:', err);
      return null;
    }
  }

  /**
   * Remove a sessão do usuário
   */
  static logout() {
    try {
      localStorage.removeItem('portal_clinic_user');
      return { success: true };
    } catch (err) {
      console.error('❌ Erro ao fazer logout:', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Valida formato de email
   */
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valida força da senha
   */
  static validatePassword(password) {
    const validations = {
      minLength: password.length >= 6,
      hasLetter: /[a-zA-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const strength = Object.values(validations).filter(Boolean).length;
    
    return {
      isValid: validations.minLength,
      strength: strength,
      suggestions: [
        !validations.minLength && 'Mínimo 6 caracteres',
        !validations.hasLetter && 'Inclua pelo menos uma letra',
        !validations.hasNumber && 'Inclua pelo menos um número',
        !validations.hasSpecial && 'Inclua um caractere especial'
      ].filter(Boolean)
    };
  }

  /**
   * Gera mensagens de erro amigáveis
   */
  static getErrorMessage(errorCode) {
    const errorMessages = {
      'invalid_credentials': 'Email ou senha incorretos',
      'user_not_found': 'Usuário não encontrado',
      'too_many_requests': 'Muitas tentativas. Tente novamente em alguns minutos',
      'network_error': 'Erro de conexão. Verifique sua internet',
      'email_not_confirmed': 'Confirme seu email antes de fazer login'
    };

    return errorMessages[errorCode] || 'Erro inesperado. Tente novamente';
  }
}

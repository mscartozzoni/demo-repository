/**
 * Configuração Centralizada de Domínios
 * Portal Clinic - Sistema de Aliases
 * 
 * IMPORTANTE: Altere apenas este arquivo para mudar todos os domínios do sistema
 */

// Ambiente atual (dev, staging, production)
const ENV = import.meta.env.MODE || 'development';

// Configuração de domínios por ambiente
const DOMAIN_CONFIG = {
  development: {
    // URLs de desenvolvimento - USANDO NOVOS DOMÍNIOS
    // Os sistemas JÁ ESTÃO NOS NOVOS DOMÍNIOS portal-clinic.*
    base: 'http://localhost:3000',
    api: 'http://localhost:3000/api',
    
    // Sistemas integrados (NOVOS DOMÍNIOS)
    agenda: 'https://agenda.portal-clinic.com.br',
    crm: 'https://crm.portal-clinic.com.br',
    dashboard: 'https://dashboard.portal-clinic.app',
    medical: 'https://prontuarios.portal-clinic.site',
    budget: 'https://orcamento.portal-clinic.com.br',
    financial: 'https://financial.portal-clinic.com.br',
    ai: 'https://ai.marcioplasticsurgery.com',
    database: 'https://db.portal-clinic.com.br',
    shop: 'https://portal-clinic.shop',
  },
  
  staging: {
    // URLs de staging (para testes)
    base: 'https://staging.portal-clinic.app',
    api: 'https://api-staging.portal-clinic.app',
    
    agenda: 'https://agenda-staging.portal-clinic.com.br',
    crm: 'https://crm-staging.portal-clinic.com.br',
    dashboard: 'https://dashboard-staging.portal-clinic.app',
    medical: 'https://prontuarios-staging.portal-clinic.site',
    budget: 'https://orcamento-staging.portal-clinic.com.br',
    financial: 'https://financial-staging.portal-clinic.com.br',
    ai: 'https://ai-staging.marcioplasticsurgery.com',
    database: 'https://db-staging.portal-clinic.com.br',
  },
  
  production: {
    // URLs de produção (NOVOS DOMÍNIOS)
    base: 'https://portal-clinic.app',
    api: 'https://api.portal-clinic.app',
    
    // Sistemas integrados (PRODUÇÃO)
    agenda: 'https://agenda.portal-clinic.com.br',
    crm: 'https://crm.portal-clinic.com.br',
    dashboard: 'https://dashboard.portal-clinic.app',
    medical: 'https://prontuarios.portal-clinic.site',  // Gestão Médica
    budget: 'https://orcamento.portal-clinic.com.br',
    financial: 'https://financial.portal-clinic.com.br',
    ai: 'https://ai.marcioplasticsurgery.com',  // Mantém domínio atual
    database: 'https://db.portal-clinic.com.br',
    shop: 'https://portal-clinic.shop',
  }
};

// Aliases antigos (para retrocompatibilidade)
const LEGACY_DOMAINS = {
  'agenda.marcioplasticsurgery.com': 'agenda.portal-clinic.com.br',
  'crm.marcioplasticsurgery.com': 'crm.portal-clinic.com.br',
  'dashboard.marcioplasticsurgery.com': 'dashboard.portal-clinic.app',
  'portal-medico.marcioplasticsurgery.com': 'prontuarios.portal-clinic.site',
  'orcamento.marcioplasticsurgery.com': 'orcamento.portal-clinic.com.br',
  'financeiro.marcioplasticsurgery.com': 'financial.portal-clinic.com.br',
};

// Mapeamento de sistemas para domínios
const SYSTEM_DOMAINS = {
  agenda: 'agenda',
  crm: 'crm',
  dashboard: 'dashboard',
  'portal-medico': 'medical',
  medical: 'medical',
  'portal-orcamento': 'budget',
  budget: 'budget',
  'sistema-financeiro': 'financial',
  financial: 'financial',
  ai: 'ai',
  database: 'database',
  db: 'database',
  shop: 'shop',
  loja: 'shop',
};

/**
 * Obter URL do domínio baseado no ambiente e sistema
 * @param {string} system - Nome do sistema (agenda, crm, etc)
 * @param {string} environment - Ambiente (development, staging, production)
 * @returns {string} URL completa do sistema
 */
export function getSystemUrl(system, environment = ENV) {
  const config = DOMAIN_CONFIG[environment] || DOMAIN_CONFIG.production;
  const systemKey = SYSTEM_DOMAINS[system] || system;
  
  return config[systemKey] || config.base;
}

/**
 * Obter todas as URLs do ambiente atual
 * @param {string} environment - Ambiente
 * @returns {object} Objeto com todas as URLs
 */
export function getAllUrls(environment = ENV) {
  return DOMAIN_CONFIG[environment] || DOMAIN_CONFIG.production;
}

/**
 * Verificar se domínio é legado e retornar novo
 * @param {string} oldDomain - Domínio antigo
 * @returns {string} Novo domínio ou o mesmo se não for legado
 */
export function resolveLegacyDomain(oldDomain) {
  return LEGACY_DOMAINS[oldDomain] || oldDomain;
}

/**
 * Obter URL base do ambiente
 * @param {string} environment - Ambiente
 * @returns {string} URL base
 */
export function getBaseUrl(environment = ENV) {
  const config = DOMAIN_CONFIG[environment] || DOMAIN_CONFIG.production;
  return config.base;
}

/**
 * Obter URL da API
 * @param {string} environment - Ambiente
 * @returns {string} URL da API
 */
export function getApiUrl(environment = ENV) {
  const config = DOMAIN_CONFIG[environment] || DOMAIN_CONFIG.production;
  return config.api;
}

/**
 * Lista de todos os sistemas disponíveis
 */
export const AVAILABLE_SYSTEMS = [
  { key: 'agenda', name: 'Agenda', description: 'Sistema de agendamento' },
  { key: 'crm', name: 'CRM', description: 'Gestão de relacionamento' },
  { key: 'dashboard', name: 'Dashboard', description: 'Dashboard principal' },
  { key: 'medical', name: 'Portal Médico', description: 'Gestão médica e prontuários' },
  { key: 'budget', name: 'Orçamentos', description: 'Sistema de orçamentos' },
  { key: 'financial', name: 'Financeiro', description: 'Controle financeiro' },
  { key: 'ai', name: 'IA do Dr. Marcio', description: 'Assistente inteligente' },
  { key: 'database', name: 'Database', description: 'Gestão de banco de dados' },
  { key: 'shop', name: 'Loja', description: 'E-commerce' },
];

/**
 * Ambiente atual
 */
export const CURRENT_ENV = ENV;

/**
 * Configuração completa do ambiente atual
 */
export const CURRENT_CONFIG = DOMAIN_CONFIG[ENV] || DOMAIN_CONFIG.production;

export default {
  getSystemUrl,
  getAllUrls,
  resolveLegacyDomain,
  getBaseUrl,
  getApiUrl,
  AVAILABLE_SYSTEMS,
  CURRENT_ENV,
  CURRENT_CONFIG,
  DOMAIN_CONFIG,
  LEGACY_DOMAINS,
};

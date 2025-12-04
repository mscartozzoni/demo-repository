/**
 * Sistema de Permissões por Setor
 * Controla acesso às rotas e funcionalidades baseado no setor do usuário
 */

export const SECTORS = {
  AGENDAMENTO: 'Agendamento',
  FINANCEIRO: 'Financeiro', 
  ORCAMENTO: 'Orçamento',
  ATENDIMENTO: 'Atendimento',
  ADMINISTRATIVO: 'Administrativo',
  MEDICO: 'Médico',
  SECRETARIA: 'Secretária'
};

export const PERMISSIONS = {
  // Mensagens e Comunicação
  'messages:read': 'Visualizar mensagens',
  'messages:write': 'Responder mensagens', 
  'messages:delete': 'Excluir mensagens',
  'messages:assign': 'Atribuir mensagens',
  
  // Tags e Classificação
  'tags:read': 'Visualizar tags',
  'tags:create': 'Criar tags',
  'tags:delete': 'Excluir tags',
  
  // Contatos e Pacientes
  'contacts:read': 'Visualizar contatos',
  'contacts:create': 'Criar contatos',
  'contacts:edit': 'Editar contatos',
  'contacts:delete': 'Excluir contatos',
  
  // Relatórios
  'reports:sector': 'Relatórios do setor',
  'reports:general': 'Relatórios gerais',
  
  // Configurações
  'settings:personal': 'Configurações pessoais',
  'settings:sector': 'Configurações do setor',
  'settings:system': 'Configurações do sistema',
  
  // Administração
  'admin:users': 'Gerenciar usuários',
  'admin:permissions': 'Gerenciar permissões',
  'admin:system': 'Administração do sistema'
};

/**
 * Mapeamento de Setor → Permissões
 */
export const SECTOR_PERMISSIONS = {
  [SECTORS.AGENDAMENTO]: [
    'messages:read',
    'messages:write', 
    'messages:assign',
    'tags:read',
    'tags:create',
    'contacts:read',
    'contacts:create',
    'contacts:edit',
    'reports:sector',
    'settings:personal'
  ],
  
  [SECTORS.FINANCEIRO]: [
    'messages:read',
    'messages:write',
    'tags:read', 
    'tags:create',
    'contacts:read',
    'contacts:edit',
    'reports:sector',
    'reports:general',
    'settings:personal'
  ],
  
  [SECTORS.ORCAMENTO]: [
    'messages:read',
    'messages:write',
    'tags:read',
    'tags:create', 
    'contacts:read',
    'contacts:create',
    'contacts:edit',
    'reports:sector',
    'settings:personal'
  ],
  
  [SECTORS.ATENDIMENTO]: [
    'messages:read',
    'messages:write',
    'messages:assign',
    'tags:read',
    'tags:create',
    'contacts:read',
    'contacts:create', 
    'contacts:edit',
    'reports:sector',
    'settings:personal',
    'settings:sector'
  ],
  
  [SECTORS.ADMINISTRATIVO]: [
    'messages:read',
    'messages:write',
    'messages:delete',
    'messages:assign',
    'tags:read',
    'tags:create',
    'tags:delete',
    'contacts:read',
    'contacts:create',
    'contacts:edit',
    'contacts:delete',
    'reports:sector',
    'reports:general',
    'settings:personal',
    'settings:sector',
    'settings:system',
    'admin:users'
  ],
  
  [SECTORS.MEDICO]: [
    'messages:read',
    'messages:write',
    'tags:read',
    'contacts:read',
    'contacts:edit',
    'reports:sector',
    'reports:general',
    'settings:personal'
  ],
  
  [SECTORS.SECRETARIA]: [
    'messages:read',
    'messages:write',
    'messages:assign',
    'tags:read',
    'tags:create',
    'contacts:read',
    'contacts:create',
    'contacts:edit',
    'reports:sector',
    'settings:personal'
  ]
};

/**
 * Tipos de mensagens que cada setor pode acessar
 */
export const SECTOR_MESSAGE_ACCESS = {
  [SECTORS.AGENDAMENTO]: {
    types: ['agendamento', 'consulta', 'reagendamento'],
    priority: ['baixa', 'media', 'alta'],
    description: 'Mensagens relacionadas a agendamentos e consultas'
  },
  
  [SECTORS.FINANCEIRO]: {
    types: ['pagamento', 'orcamento', 'cobranca', 'financeiro'],
    priority: ['media', 'alta'],
    description: 'Questões financeiras, orçamentos e pagamentos'
  },
  
  [SECTORS.ORCAMENTO]: {
    types: ['orcamento', 'procedimento', 'consulta'],
    priority: ['baixa', 'media', 'alta'],
    description: 'Solicitações de orçamento e informações sobre procedimentos'
  },
  
  [SECTORS.ATENDIMENTO]: {
    types: ['duvida', 'suporte', 'reclamacao', 'elogio'],
    priority: ['baixa', 'media', 'alta'],
    description: 'Atendimento geral, dúvidas e suporte'
  },
  
  [SECTORS.ADMINISTRATIVO]: {
    types: '*', // Acesso a todos os tipos
    priority: ['baixa', 'media', 'alta', 'urgente'],
    description: 'Acesso completo a todas as mensagens'
  },
  
  [SECTORS.MEDICO]: {
    types: ['consulta', 'exame', 'receita', 'procedimento'],
    priority: ['media', 'alta', 'urgente'],
    description: 'Questões médicas e clínicas'
  },
  
  [SECTORS.SECRETARIA]: {
    types: ['agendamento', 'consulta', 'duvida', 'informacao'],
    priority: ['baixa', 'media', 'alta'],
    description: 'Suporte geral e informações'
  }
};

/**
 * Rotas acessíveis por setor
 */
export const SECTOR_ROUTES = {
  [SECTORS.AGENDAMENTO]: [
    '/',
    '/messages',
    '/contacts', 
    '/calendar',
    '/reports/sector',
    '/settings/personal'
  ],
  
  [SECTORS.FINANCEIRO]: [
    '/',
    '/messages',
    '/contacts',
    '/financial',
    '/reports/financial',
    '/reports/sector',
    '/settings/personal'
  ],
  
  [SECTORS.ORCAMENTO]: [
    '/',
    '/messages',
    '/contacts',
    '/budgets',
    '/reports/budgets', 
    '/reports/sector',
    '/settings/personal'
  ],
  
  [SECTORS.ATENDIMENTO]: [
    '/',
    '/messages',
    '/contacts',
    '/support',
    '/reports/support',
    '/reports/sector', 
    '/settings/personal',
    '/settings/sector'
  ],
  
  [SECTORS.ADMINISTRATIVO]: [
    '*' // Acesso a todas as rotas
  ],
  
  [SECTORS.MEDICO]: [
    '/',
    '/medico',
    '/messages',
    '/contacts',
    '/patients',
    '/reports/medical',
    '/reports/sector',
    '/settings/personal'
  ],
  
  [SECTORS.SECRETARIA]: [
    '/',
    '/secretaria', 
    '/messages',
    '/contacts',
    '/calendar',
    '/reports/sector',
    '/settings/personal'
  ]
};

/**
 * Classe para verificar permissões
 */
export class PermissionChecker {
  
  /**
   * Verifica se o usuário tem uma permissão específica
   */
  static hasPermission(userSector, permission) {
    const sectorPermissions = SECTOR_PERMISSIONS[userSector] || [];
    return sectorPermissions.includes(permission);
  }
  
  /**
   * Verifica se o usuário pode acessar uma rota
   */
  static canAccessRoute(userSector, route) {
    const sectorRoutes = SECTOR_ROUTES[userSector] || [];
    
    // Administrativo tem acesso a tudo
    if (sectorRoutes.includes('*')) {
      return true;
    }
    
    return sectorRoutes.some(allowedRoute => 
      route === allowedRoute || route.startsWith(allowedRoute + '/')
    );
  }
  
  /**
   * Verifica se o usuário pode ver um tipo de mensagem
   */
  static canAccessMessageType(userSector, messageType, messagePriority = 'media') {
    const access = SECTOR_MESSAGE_ACCESS[userSector];
    if (!access) return false;
    
    // Administrativo tem acesso a tudo
    if (access.types === '*') {
      return true;
    }
    
    const hasTypeAccess = access.types.includes(messageType);
    const hasPriorityAccess = access.priority.includes(messagePriority);
    
    return hasTypeAccess && hasPriorityAccess;
  }
  
  /**
   * Busca mensagens filtradas por setor
   */
  static filterMessagesBySector(messages, userSector) {
    if (!messages || !userSector) return [];
    
    const access = SECTOR_MESSAGE_ACCESS[userSector];
    if (!access) return [];
    
    // Administrativo vê tudo
    if (access.types === '*') {
      return messages;
    }
    
    return messages.filter(message => {
      const typeMatch = access.types.includes(message.type);
      const priorityMatch = access.priority.includes(message.priority || 'media');
      return typeMatch && priorityMatch;
    });
  }
  
  /**
   * Obtém lista de permissões para um setor
   */
  static getSectorPermissions(sector) {
    return SECTOR_PERMISSIONS[sector] || [];
  }
  
  /**
   * Obtém descrição do acesso por setor
   */
  static getSectorDescription(sector) {
    return SECTOR_MESSAGE_ACCESS[sector]?.description || 'Sem descrição disponível';
  }
}

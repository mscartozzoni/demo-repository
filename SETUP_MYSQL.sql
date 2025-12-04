-- ============================================
-- PORTAL CLINIC - OMNICHANNEL DATABASE SETUP
-- ============================================

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS portal_clinic;
USE portal_clinic;

-- ============================================
-- TABELA: CONTACTS (Pacientes)
-- ============================================
DROP TABLE IF EXISTS contacts;
CREATE TABLE contacts (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  cpf VARCHAR(14),
  source VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_phone (phone),
  INDEX idx_cpf (cpf),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA: CONVERSATIONS (Conversas)
-- ============================================
DROP TABLE IF EXISTS conversations;
CREATE TABLE conversations (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  contact_id VARCHAR(36) NOT NULL,
  channel VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  assigned_to VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
  INDEX idx_contact_id (contact_id),
  INDEX idx_channel (channel),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA: MESSAGES (Mensagens)
-- ============================================
DROP TABLE IF EXISTS messages;
CREATE TABLE messages (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  conversation_id VARCHAR(36) NOT NULL,
  contact_id VARCHAR(36) NOT NULL,
  channel VARCHAR(50) NOT NULL,
  direction VARCHAR(20) NOT NULL,
  text LONGTEXT NOT NULL,
  metadata JSON,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
  INDEX idx_conversation_id (conversation_id),
  INDEX idx_contact_id (contact_id),
  INDEX idx_channel (channel),
  INDEX idx_direction (direction),
  INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA: WEBHOOKS_CONFIG (Configuração Webhooks)
-- ============================================
DROP TABLE IF EXISTS webhooks_config;
CREATE TABLE webhooks_config (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  secret VARCHAR(255) NOT NULL UNIQUE,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_name (name),
  INDEX idx_enabled (enabled)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA: CHANNEL_SETTINGS (Configurações de Canais)
-- ============================================
DROP TABLE IF EXISTS channel_settings;
CREATE TABLE channel_settings (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  channel_name VARCHAR(50) NOT NULL UNIQUE,
  config JSON,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_channel_name (channel_name),
  INDEX idx_enabled (enabled)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA: MESSAGE_LOGS (Logs de Envio)
-- ============================================
DROP TABLE IF EXISTS message_logs;
CREATE TABLE message_logs (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  message_id VARCHAR(36),
  channel VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  response JSON,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE SET NULL,
  INDEX idx_message_id (message_id),
  INDEX idx_channel (channel),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERIR DADOS INICIAIS
-- ============================================

-- Inserir configurações de canais
INSERT INTO channel_settings (channel_name, config, enabled) VALUES
('web', JSON_OBJECT('name', 'Web Chat', 'icon', 'MessageCircle', 'color', 'blue'), TRUE),
('email', JSON_OBJECT('name', 'Email', 'icon', 'Mail', 'color', 'indigo'), TRUE),
('sms', JSON_OBJECT('name', 'SMS', 'icon', 'Phone', 'color', 'purple'), TRUE),
('whatsapp', JSON_OBJECT('name', 'WhatsApp', 'icon', 'MessageSquare', 'color', 'green'), TRUE);

-- Inserir webhook padrão
INSERT INTO webhooks_config (name, secret, enabled) VALUES
('Portal Clinic Default', 'portal_clinic_webhook_2025_secure_token', TRUE);

-- ============================================
-- DADOS DE TESTE (Opcional)
-- ============================================

-- Inserir contato de teste
INSERT INTO contacts (name, phone, email, cpf, source) VALUES
('João Silva', '+5511999999999', 'joao@email.com', '123.456.789-00', 'web');

-- Inserir conversa de teste
INSERT INTO conversations (contact_id, channel, status) 
SELECT id, 'web', 'active' FROM contacts WHERE email = 'joao@email.com' LIMIT 1;

-- Inserir mensagem de teste
INSERT INTO messages (conversation_id, contact_id, channel, direction, text, metadata)
SELECT c.id, c.contact_id, 'web', 'inbound', 'Gostaria de agendar uma consulta', 
JSON_OBJECT('source', 'website_form', 'page', '/agendamento')
FROM conversations c WHERE c.channel = 'web' LIMIT 1;

-- ============================================
-- VERIFICAR CRIAÇÃO
-- ============================================
SHOW TABLES;
SELECT * FROM contacts;
SELECT * FROM conversations;
SELECT * FROM messages;

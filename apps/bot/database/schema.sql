-- ============================================
-- Portal Clinic Bot - Database Schema
-- PostgreSQL / Supabase
-- ============================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Para busca de texto

-- ============================================
-- 1. TABELA DE USUÁRIOS (Atendentes/Admin)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'agent', -- 'admin' ou 'agent'
    sector VARCHAR(100),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- ============================================
-- 2. TABELA DE PACIENTES/CONTATOS
-- ============================================
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id VARCHAR(255) UNIQUE NOT NULL, -- Telefone, CPF ou ID único
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    cpf VARCHAR(14),
    birth_date DATE,
    gender VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(2),
    zip_code VARCHAR(10),
    contact_status VARCHAR(50) DEFAULT 'patient', -- 'patient', 'lead', 'inactive'
    pasta_link TEXT, -- Link da pasta no Google Drive
    notes TEXT,
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para contacts
CREATE INDEX IF NOT EXISTS idx_contacts_patient_id ON contacts(patient_id);
CREATE INDEX IF NOT EXISTS idx_contacts_phone ON contacts(phone);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_cpf ON contacts(cpf);
CREATE INDEX IF NOT EXISTS idx_contacts_full_name ON contacts USING gin(full_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_contacts_last_activity ON contacts(last_activity DESC);

-- ============================================
-- 3. TABELA DE MENSAGENS/CONVERSAS
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id VARCHAR(255) NOT NULL REFERENCES contacts(patient_id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    status VARCHAR(100) DEFAULT 'pendente', -- 'pendente', 'em_andamento', 'resolvido', 'arquivado'
    priority VARCHAR(50) DEFAULT 'media', -- 'baixa', 'media', 'alta', 'urgente'
    assigned_to_id UUID REFERENCES users(id) ON DELETE SET NULL,
    current_journey_step VARCHAR(255), -- Ex: "Agendamento Solicitado", "Aguardando Retorno"
    source VARCHAR(50) DEFAULT 'whatsapp', -- 'whatsapp', 'email', 'phone', 'web'
    is_read BOOLEAN DEFAULT false,
    replied_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para messages
CREATE INDEX IF NOT EXISTS idx_messages_patient_id ON messages(patient_id);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_priority ON messages(priority);
CREATE INDEX IF NOT EXISTS idx_messages_assigned_to ON messages(assigned_to_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);

-- ============================================
-- 4. TABELA DE TAGS/ETIQUETAS
-- ============================================
CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    color VARCHAR(50) DEFAULT '#3b82f6', -- Cor hexadecimal
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. TABELA DE RELACIONAMENTO: MENSAGENS <-> TAGS
-- ============================================
CREATE TABLE IF NOT EXISTS message_tags (
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (message_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_message_tags_message ON message_tags(message_id);
CREATE INDEX IF NOT EXISTS idx_message_tags_tag ON message_tags(tag_id);

-- ============================================
-- 6. TABELA DE CONSULTAS/AGENDAMENTOS
-- ============================================
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id VARCHAR(255) NOT NULL REFERENCES contacts(patient_id) ON DELETE CASCADE,
    appointment_date TIMESTAMPTZ NOT NULL,
    appointment_type VARCHAR(100), -- 'Primeira Consulta', 'Retorno', 'Cirurgia', 'Exame'
    appointment_status VARCHAR(50) DEFAULT 'agendado', -- 'agendado', 'confirmado', 'realizado', 'cancelado', 'reagendar'
    appointment_link TEXT, -- Link do Google Meet, Zoom, etc.
    doctor_name VARCHAR(255),
    location VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para appointments
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(appointment_status);

-- ============================================
-- 7. TABELA DE ORÇAMENTOS
-- ============================================
CREATE TABLE IF NOT EXISTS budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    budget_id VARCHAR(100) UNIQUE NOT NULL, -- ID de referência do orçamento
    patient_id VARCHAR(255) NOT NULL REFERENCES contacts(patient_id) ON DELETE CASCADE,
    budget_value DECIMAL(10, 2) NOT NULL,
    budget_status VARCHAR(50) DEFAULT 'pendente', -- 'pendente', 'aprovado', 'rejeitado', 'em_negociacao'
    budget_date DATE DEFAULT CURRENT_DATE,
    services TEXT, -- Lista de procedimentos/serviços
    notes TEXT,
    valid_until DATE,
    payment_method VARCHAR(100),
    installments INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para budgets
CREATE INDEX IF NOT EXISTS idx_budgets_patient_id ON budgets(patient_id);
CREATE INDEX IF NOT EXISTS idx_budgets_status ON budgets(budget_status);
CREATE INDEX IF NOT EXISTS idx_budgets_budget_id ON budgets(budget_id);
CREATE INDEX IF NOT EXISTS idx_budgets_date ON budgets(budget_date DESC);

-- ============================================
-- 8. TABELA DE CIRURGIAS
-- ============================================
CREATE TABLE IF NOT EXISTS surgeries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id VARCHAR(255) NOT NULL REFERENCES contacts(patient_id) ON DELETE CASCADE,
    surgery_date TIMESTAMPTZ NOT NULL,
    surgery_type VARCHAR(255) NOT NULL,
    surgery_hospital VARCHAR(255),
    surgery_status VARCHAR(50) DEFAULT 'agendada', -- 'agendada', 'realizada', 'cancelada'
    surgery_team TEXT, -- Equipe médica
    anesthesia_type VARCHAR(100),
    estimated_duration INTEGER, -- Em minutos
    pre_op_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para surgeries
CREATE INDEX IF NOT EXISTS idx_surgeries_patient_id ON surgeries(patient_id);
CREATE INDEX IF NOT EXISTS idx_surgeries_date ON surgeries(surgery_date);
CREATE INDEX IF NOT EXISTS idx_surgeries_status ON surgeries(surgery_status);

-- ============================================
-- 9. TABELA DE PÓS-OPERATÓRIO
-- ============================================
CREATE TABLE IF NOT EXISTS post_ops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    surgery_id UUID REFERENCES surgeries(id) ON DELETE CASCADE,
    patient_id VARCHAR(255) NOT NULL REFERENCES contacts(patient_id) ON DELETE CASCADE,
    postop_date TIMESTAMPTZ NOT NULL,
    postop_day INTEGER, -- Dia do pós-operatório (ex: 7º dia, 15º dia)
    postop_status VARCHAR(50) DEFAULT 'agendado', -- 'agendado', 'realizado', 'cancelado'
    doctor_name VARCHAR(255),
    observations TEXT,
    has_complications BOOLEAN DEFAULT false,
    complications_description TEXT,
    next_visit_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para post_ops
CREATE INDEX IF NOT EXISTS idx_postops_patient_id ON post_ops(patient_id);
CREATE INDEX IF NOT EXISTS idx_postops_surgery_id ON post_ops(surgery_id);
CREATE INDEX IF NOT EXISTS idx_postops_date ON post_ops(postop_date);
CREATE INDEX IF NOT EXISTS idx_postops_status ON post_ops(postop_status);

-- ============================================
-- 10. TABELA DE FOLLOW-UP
-- ============================================
CREATE TABLE IF NOT EXISTS follow_ups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id VARCHAR(255) NOT NULL REFERENCES contacts(patient_id) ON DELETE CASCADE,
    appointment_date TIMESTAMPTZ NOT NULL,
    follow_up_type VARCHAR(100), -- 'Retorno', 'Acompanhamento', 'Controle'
    appointment_status VARCHAR(50) DEFAULT 'agendado',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para follow_ups
CREATE INDEX IF NOT EXISTS idx_followups_patient_id ON follow_ups(patient_id);
CREATE INDEX IF NOT EXISTS idx_followups_date ON follow_ups(appointment_date);
CREATE INDEX IF NOT EXISTS idx_followups_status ON follow_ups(appointment_status);

-- ============================================
-- 11. TABELA DE LOGS/AUDITORIA
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- 'create', 'update', 'delete', 'login', 'logout'
    entity_type VARCHAR(100), -- 'message', 'contact', 'appointment', etc.
    entity_id UUID,
    description TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para audit_logs
CREATE INDEX IF NOT EXISTS idx_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON audit_logs(created_at DESC);

-- ============================================
-- 12. TABELA DE DOCUMENTOS/ARQUIVOS
-- ============================================
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id VARCHAR(255) NOT NULL REFERENCES contacts(patient_id) ON DELETE CASCADE,
    document_name VARCHAR(255) NOT NULL,
    document_type VARCHAR(100), -- 'exame', 'receita', 'laudo', 'termo', 'foto'
    document_link TEXT NOT NULL, -- URL do documento no Drive ou storage
    file_size INTEGER, -- Em bytes
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para documents
CREATE INDEX IF NOT EXISTS idx_documents_patient_id ON documents(patient_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(document_type);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);

-- ============================================
-- TRIGGERS PARA UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_surgeries_updated_at BEFORE UPDATE ON surgeries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_postops_updated_at BEFORE UPDATE ON post_ops
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_followups_updated_at BEFORE UPDATE ON follow_ups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DADOS INICIAIS (SEEDS)
-- ============================================

-- Inserir tags padrão
INSERT INTO tags (name, color, description) VALUES
    ('Primeira Consulta', '#3b82f6', 'Paciente em primeira consulta'),
    ('Orçamento', '#10b981', 'Solicitação de orçamento'),
    ('Agendamento', '#f59e0b', 'Agendamento de consulta'),
    ('Urgente', '#ef4444', 'Requer atenção imediata'),
    ('Cirurgia', '#8b5cf6', 'Relacionado a cirurgia'),
    ('Pós-operatório', '#ec4899', 'Acompanhamento pós-cirúrgico'),
    ('Follow-up', '#06b6d4', 'Retorno ou acompanhamento'),
    ('Financeiro', '#14b8a6', 'Questões financeiras'),
    ('Dúvida', '#6366f1', 'Dúvidas gerais'),
    ('Reagendar', '#f97316', 'Necessita reagendar')
ON CONFLICT (name) DO NOTHING;

-- Inserir usuário admin padrão (senha: admin123)
-- ATENÇÃO: Altere a senha em produção!
INSERT INTO users (name, email, password_hash, role, sector) VALUES
    ('Administrador', 'admin@clinica.com', '$2b$10$YourHashedPasswordHere', 'admin', 'Administração'),
    ('Atendente 1', 'atendente1@clinica.com', '$2b$10$YourHashedPasswordHere', 'agent', 'Recepção'),
    ('Atendente 2', 'atendente2@clinica.com', '$2b$10$YourHashedPasswordHere', 'agent', 'Recepção')
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- VIEWS ÚTEIS
-- ============================================

-- View: Mensagens com informações completas
CREATE OR REPLACE VIEW vw_messages_full AS
SELECT 
    m.id,
    m.message,
    m.status,
    m.priority,
    m.current_journey_step,
    m.source,
    m.is_read,
    m.created_at,
    m.updated_at,
    c.patient_id,
    c.full_name as patient_name,
    c.phone as patient_phone,
    c.email as patient_email,
    u.id as assigned_user_id,
    u.name as assigned_user_name,
    u.email as assigned_user_email,
    ARRAY_AGG(t.name) FILTER (WHERE t.name IS NOT NULL) as tags
FROM messages m
LEFT JOIN contacts c ON m.patient_id = c.patient_id
LEFT JOIN users u ON m.assigned_to_id = u.id
LEFT JOIN message_tags mt ON m.id = mt.message_id
LEFT JOIN tags t ON mt.tag_id = t.id
GROUP BY m.id, c.patient_id, c.full_name, c.phone, c.email, u.id, u.name, u.email;

-- View: Dashboard de estatísticas
CREATE OR REPLACE VIEW vw_dashboard_stats AS
SELECT
    (SELECT COUNT(*) FROM messages WHERE status = 'pendente') as messages_pending,
    (SELECT COUNT(*) FROM messages WHERE status = 'em_andamento') as messages_in_progress,
    (SELECT COUNT(*) FROM messages WHERE status = 'resolvido') as messages_resolved,
    (SELECT COUNT(*) FROM contacts) as total_contacts,
    (SELECT COUNT(*) FROM appointments WHERE appointment_date >= CURRENT_DATE) as upcoming_appointments,
    (SELECT COUNT(*) FROM budgets WHERE budget_status = 'pendente') as pending_budgets,
    (SELECT COUNT(*) FROM surgeries WHERE surgery_date >= CURRENT_DATE AND surgery_status = 'agendada') as upcoming_surgeries;

-- ============================================
-- POLÍTICAS RLS (Row Level Security) - Opcional
-- ============================================
-- Descomente se quiser usar RLS no Supabase

-- ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Exemplo de política: usuários só veem mensagens atribuídas a eles ou não atribuídas
-- CREATE POLICY "Users can view their assigned messages" ON messages
--     FOR SELECT USING (
--         assigned_to_id = auth.uid() OR 
--         assigned_to_id IS NULL OR
--         (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
--     );

-- ============================================
-- FIM DO SCHEMA
-- ============================================

-- Comentários finais
COMMENT ON TABLE users IS 'Tabela de usuários do sistema (atendentes e administradores)';
COMMENT ON TABLE contacts IS 'Tabela de pacientes/contatos da clínica';
COMMENT ON TABLE messages IS 'Tabela de mensagens/conversas recebidas';
COMMENT ON TABLE appointments IS 'Tabela de consultas e agendamentos';
COMMENT ON TABLE budgets IS 'Tabela de orçamentos';
COMMENT ON TABLE surgeries IS 'Tabela de cirurgias programadas';
COMMENT ON TABLE post_ops IS 'Tabela de acompanhamento pós-operatório';
COMMENT ON TABLE follow_ups IS 'Tabela de follow-ups e retornos';
COMMENT ON TABLE audit_logs IS 'Tabela de logs de auditoria do sistema';
COMMENT ON TABLE documents IS 'Tabela de documentos e arquivos dos pacientes';

-- ============================================
-- Portal Clinic Bot - Dados de Exemplo (Seeds)
-- ============================================

-- ATENÇÃO: Este arquivo contém dados fictícios para teste
-- Execute após rodar o schema.sql

-- ============================================
-- PACIENTES DE EXEMPLO
-- ============================================
INSERT INTO contacts (patient_id, full_name, phone, email, cpf, birth_date, gender, city, state, contact_status, notes) VALUES
    ('5511987654321', 'Maria Silva Santos', '(11) 98765-4321', 'maria.silva@email.com', '123.456.789-00', '1985-03-15', 'Feminino', 'São Paulo', 'SP', 'patient', 'Paciente ativa desde 2023'),
    ('5511976543210', 'João Pedro Oliveira', '(11) 97654-3210', 'joao.pedro@email.com', '234.567.890-11', '1978-07-22', 'Masculino', 'São Paulo', 'SP', 'patient', 'Preferência por atendimento pela manhã'),
    ('5511965432109', 'Ana Carolina Costa', '(11) 96543-2109', 'ana.costa@email.com', '345.678.901-22', '1992-11-08', 'Feminino', 'Guarulhos', 'SP', 'patient', NULL),
    ('5511954321098', 'Carlos Eduardo Lima', '(11) 95432-1098', 'carlos.lima@email.com', '456.789.012-33', '1965-05-30', 'Masculino', 'São Bernardo', 'SP', 'patient', 'Paciente com histórico de alergias'),
    ('5511943210987', 'Juliana Martins Rocha', '(11) 94321-0987', 'juliana.rocha@email.com', '567.890.123-44', '1988-09-12', 'Feminino', 'São Paulo', 'SP', 'lead', 'Interessada em rinoplastia'),
    ('5511932109876', 'Roberto Alves Ferreira', '(11) 93210-9876', 'roberto.alves@email.com', '678.901.234-55', '1970-12-25', 'Masculino', 'Osasco', 'SP', 'patient', NULL),
    ('5511921098765', 'Patricia Souza Mendes', '(11) 92109-8765', 'patricia.souza@email.com', '789.012.345-66', '1995-04-18', 'Feminino', 'São Paulo', 'SP', 'patient', 'Paciente VIP'),
    ('5511910987654', 'Fernando Henrique Silva', '(11) 91098-7654', 'fernando.silva@email.com', '890.123.456-77', '1982-08-03', 'Masculino', 'Taboão da Serra', 'SP', 'patient', NULL)
ON CONFLICT (patient_id) DO NOTHING;

-- ============================================
-- MENSAGENS DE EXEMPLO
-- ============================================
INSERT INTO messages (patient_id, message, status, priority, current_journey_step, source, is_read) VALUES
    ('5511987654321', 'Olá! Gostaria de agendar uma consulta para avaliar possibilidade de rinoplastia. Tenho disponibilidade nas tardes de terça e quinta.', 'pendente', 'media', 'Solicitação de Agendamento', 'whatsapp', false),
    ('5511976543210', 'Bom dia! Preciso remarcar minha consulta do dia 25. Surgiu um compromisso inadiável.', 'em_andamento', 'alta', 'Reagendamento Solicitado', 'whatsapp', true),
    ('5511965432109', 'Recebi o orçamento mas gostaria de entender melhor as opções de parcelamento. Vocês aceitam cartão?', 'pendente', 'media', 'Negociação de Orçamento', 'whatsapp', false),
    ('5511954321098', 'Estou no 7º dia pós-operatório e ainda sinto um pouco de inchaço. Isso é normal?', 'resolvido', 'alta', 'Acompanhamento Pós-Op', 'whatsapp', true),
    ('5511943210987', 'Oi! Vi o Instagram de vocês e me interessei pelos procedimentos. Quanto custa uma primeira consulta?', 'pendente', 'baixa', 'Primeira Interação', 'instagram', false),
    ('5511932109876', 'Tive que cancelar a cirurgia por motivos pessoais. Gostaria de remarcar para daqui 2 meses.', 'em_andamento', 'media', 'Reagendamento de Cirurgia', 'whatsapp', true),
    ('5511921098765', 'Perfeito! Confirmada minha presença na consulta de amanhã às 14h. Obrigada!', 'resolvido', 'baixa', 'Confirmação de Consulta', 'whatsapp', true),
    ('5511910987654', 'Queria saber se vocês atendem por convênio Unimed.', 'pendente', 'media', 'Informações Gerais', 'whatsapp', false)
ON CONFLICT DO NOTHING;

-- ============================================
-- CONSULTAS/AGENDAMENTOS DE EXEMPLO
-- ============================================
INSERT INTO appointments (patient_id, appointment_date, appointment_type, appointment_status, doctor_name, location, notes) VALUES
    ('5511987654321', '2024-02-15 14:00:00-03', 'Primeira Consulta', 'agendado', 'Dr. Carlos Mendes', 'Consultório SP - Jardins', 'Paciente interessada em rinoplastia'),
    ('5511976543210', '2024-02-20 10:30:00-03', 'Retorno', 'confirmado', 'Dra. Ana Paula', 'Consultório SP - Jardins', 'Avaliação pós-procedimento'),
    ('5511965432109', '2024-02-18 16:00:00-03', 'Primeira Consulta', 'agendado', 'Dr. Carlos Mendes', 'Consultório SP - Jardins', NULL),
    ('5511954321098', '2024-02-25 09:00:00-03', 'Pós-Operatório', 'agendado', 'Dr. Roberto Silva', 'Consultório SP - Jardins', '15º dia pós-op'),
    ('5511921098765', '2024-02-14 14:00:00-03', 'Retorno', 'confirmado', 'Dra. Ana Paula', 'Consultório SP - Jardins', 'Paciente VIP')
ON CONFLICT DO NOTHING;

-- ============================================
-- ORÇAMENTOS DE EXEMPLO
-- ============================================
INSERT INTO budgets (budget_id, patient_id, budget_value, budget_status, services, payment_method, installments, valid_until) VALUES
    ('ORC-2024-001', '5511987654321', 8500.00, 'pendente', 'Rinoplastia estética', 'A definir', NULL, '2024-03-15'),
    ('ORC-2024-002', '5511965432109', 12000.00, 'em_negociacao', 'Blefaroplastia superior e inferior', 'Cartão de crédito', 12, '2024-03-20'),
    ('ORC-2024-003', '5511943210987', 15000.00, 'pendente', 'Mamoplastia de aumento', 'A definir', NULL, '2024-03-10'),
    ('ORC-2024-004', '5511921098765', 9500.00, 'aprovado', 'Lifting facial', 'PIX', 1, '2024-02-28')
ON CONFLICT DO NOTHING;

-- ============================================
-- CIRURGIAS DE EXEMPLO
-- ============================================
INSERT INTO surgeries (patient_id, surgery_date, surgery_type, surgery_hospital, surgery_status, surgery_team, anesthesia_type, estimated_duration) VALUES
    ('5511954321098', '2024-02-01 08:00:00-03', 'Rinoplastia', 'Hospital São Luiz - Unidade Morumbi', 'realizada', 'Dr. Carlos Mendes, Anestesista Dr. João Silva', 'Geral', 180),
    ('5511921098765', '2024-03-05 09:00:00-03', 'Lifting Facial', 'Hospital São Luiz - Unidade Morumbi', 'agendada', 'Dra. Ana Paula, Anestesista Dr. João Silva', 'Geral', 240),
    ('5511932109876', '2024-04-10 08:30:00-03', 'Blefaroplastia', 'Hospital São Luiz - Unidade Morumbi', 'agendada', 'Dr. Roberto Silva', 'Local com sedação', 120)
ON CONFLICT DO NOTHING;

-- ============================================
-- PÓS-OPERATÓRIO DE EXEMPLO
-- ============================================
-- Pegando o ID da primeira cirurgia para relacionar
DO $$
DECLARE
    surgery_id_var UUID;
BEGIN
    SELECT id INTO surgery_id_var FROM surgeries WHERE patient_id = '5511954321098' LIMIT 1;
    
    IF surgery_id_var IS NOT NULL THEN
        INSERT INTO post_ops (surgery_id, patient_id, postop_date, postop_day, postop_status, doctor_name, observations, has_complications)
        VALUES 
            (surgery_id_var, '5511954321098', '2024-02-08 10:00:00-03', 7, 'realizado', 'Dr. Carlos Mendes', 'Evolução dentro do esperado. Pequeno edema residual.', false),
            (surgery_id_var, '5511954321098', '2024-02-15 10:00:00-03', 14, 'agendado', 'Dr. Carlos Mendes', NULL, false)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- ============================================
-- FOLLOW-UPS DE EXEMPLO
-- ============================================
INSERT INTO follow_ups (patient_id, appointment_date, follow_up_type, appointment_status, notes) VALUES
    ('5511976543210', '2024-03-10 15:00:00-03', 'Retorno', 'agendado', 'Avaliação de 3 meses pós-procedimento'),
    ('5511921098765', '2024-03-20 14:00:00-03', 'Acompanhamento', 'agendado', 'Follow-up pós lifting facial')
ON CONFLICT DO NOTHING;

-- ============================================
-- DOCUMENTOS DE EXEMPLO
-- ============================================
INSERT INTO documents (patient_id, document_name, document_type, document_link, uploaded_by, notes) VALUES
    ('5511987654321', 'Exames Pré-Operatórios.pdf', 'exame', 'https://drive.google.com/file/d/exemplo1', (SELECT id FROM users WHERE email = 'admin@clinica.com' LIMIT 1), 'Hemograma completo, coagulograma'),
    ('5511954321098', 'Fotos Pré-Op Rinoplastia', 'foto', 'https://drive.google.com/file/id/exemplo2', (SELECT id FROM users WHERE email = 'admin@clinica.com' LIMIT 1), 'Fotos frontais, laterais e perfil'),
    ('5511965432109', 'Termo de Consentimento Assinado.pdf', 'termo', 'https://drive.google.com/file/d/exemplo3', (SELECT id FROM users WHERE email = 'atendente1@clinica.com' LIMIT 1), NULL)
ON CONFLICT DO NOTHING;

-- ============================================
-- RELACIONAR MENSAGENS COM TAGS
-- ============================================
DO $$
DECLARE
    msg_id UUID;
    tag_id UUID;
BEGIN
    -- Mensagem 1: Primeira Consulta + Agendamento
    SELECT id INTO msg_id FROM messages WHERE patient_id = '5511987654321' LIMIT 1;
    SELECT id INTO tag_id FROM tags WHERE name = 'Primeira Consulta' LIMIT 1;
    IF msg_id IS NOT NULL AND tag_id IS NOT NULL THEN
        INSERT INTO message_tags (message_id, tag_id) VALUES (msg_id, tag_id) ON CONFLICT DO NOTHING;
    END IF;
    
    SELECT id INTO tag_id FROM tags WHERE name = 'Agendamento' LIMIT 1;
    IF msg_id IS NOT NULL AND tag_id IS NOT NULL THEN
        INSERT INTO message_tags (message_id, tag_id) VALUES (msg_id, tag_id) ON CONFLICT DO NOTHING;
    END IF;
    
    -- Mensagem 2: Reagendar
    SELECT id INTO msg_id FROM messages WHERE patient_id = '5511976543210' LIMIT 1;
    SELECT id INTO tag_id FROM tags WHERE name = 'Reagendar' LIMIT 1;
    IF msg_id IS NOT NULL AND tag_id IS NOT NULL THEN
        INSERT INTO message_tags (message_id, tag_id) VALUES (msg_id, tag_id) ON CONFLICT DO NOTHING;
    END IF;
    
    -- Mensagem 3: Orçamento + Financeiro
    SELECT id INTO msg_id FROM messages WHERE patient_id = '5511965432109' LIMIT 1;
    SELECT id INTO tag_id FROM tags WHERE name = 'Orçamento' LIMIT 1;
    IF msg_id IS NOT NULL AND tag_id IS NOT NULL THEN
        INSERT INTO message_tags (message_id, tag_id) VALUES (msg_id, tag_id) ON CONFLICT DO NOTHING;
    END IF;
    
    SELECT id INTO tag_id FROM tags WHERE name = 'Financeiro' LIMIT 1;
    IF msg_id IS NOT NULL AND tag_id IS NOT NULL THEN
        INSERT INTO message_tags (message_id, tag_id) VALUES (msg_id, tag_id) ON CONFLICT DO NOTHING;
    END IF;
    
    -- Mensagem 4: Pós-operatório
    SELECT id INTO msg_id FROM messages WHERE patient_id = '5511954321098' LIMIT 1;
    SELECT id INTO tag_id FROM tags WHERE name = 'Pós-operatório' LIMIT 1;
    IF msg_id IS NOT NULL AND tag_id IS NOT NULL THEN
        INSERT INTO message_tags (message_id, tag_id) VALUES (msg_id, tag_id) ON CONFLICT DO NOTHING;
    END IF;
    
    -- Mensagem 5: Primeira Consulta + Dúvida
    SELECT id INTO msg_id FROM messages WHERE patient_id = '5511943210987' LIMIT 1;
    SELECT id INTO tag_id FROM tags WHERE name = 'Primeira Consulta' LIMIT 1;
    IF msg_id IS NOT NULL AND tag_id IS NOT NULL THEN
        INSERT INTO message_tags (message_id, tag_id) VALUES (msg_id, tag_id) ON CONFLICT DO NOTHING;
    END IF;
    
    SELECT id INTO tag_id FROM tags WHERE name = 'Dúvida' LIMIT 1;
    IF msg_id IS NOT NULL AND tag_id IS NOT NULL THEN
        INSERT INTO message_tags (message_id, tag_id) VALUES (msg_id, tag_id) ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- ============================================
-- LOGS DE AUDITORIA DE EXEMPLO
-- ============================================
INSERT INTO audit_logs (user_id, action, entity_type, description) VALUES
    ((SELECT id FROM users WHERE email = 'admin@clinica.com' LIMIT 1), 'login', NULL, 'Login realizado com sucesso'),
    ((SELECT id FROM users WHERE email = 'atendente1@clinica.com' LIMIT 1), 'create', 'message', 'Nova mensagem criada para paciente 5511987654321'),
    ((SELECT id FROM users WHERE email = 'admin@clinica.com' LIMIT 1), 'update', 'appointment', 'Consulta atualizada - status alterado para confirmado'),
    ((SELECT id FROM users WHERE email = 'atendente2@clinica.com' LIMIT 1), 'create', 'budget', 'Novo orçamento criado - ORC-2024-001')
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFICAÇÃO DOS DADOS INSERIDOS
-- ============================================
DO $$
BEGIN
    RAISE NOTICE 'Total de contatos inseridos: %', (SELECT COUNT(*) FROM contacts);
    RAISE NOTICE 'Total de mensagens inseridas: %', (SELECT COUNT(*) FROM messages);
    RAISE NOTICE 'Total de consultas inseridas: %', (SELECT COUNT(*) FROM appointments);
    RAISE NOTICE 'Total de orçamentos inseridos: %', (SELECT COUNT(*) FROM budgets);
    RAISE NOTICE 'Total de cirurgias inseridas: %', (SELECT COUNT(*) FROM surgeries);
    RAISE NOTICE 'Total de tags disponíveis: %', (SELECT COUNT(*) FROM tags);
END $$;

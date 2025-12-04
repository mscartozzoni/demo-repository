-- ============================================
-- QUERIES ÚTEIS - Portal Clinic Bot
-- ============================================
-- Coleção de queries prontas para uso no dia a dia

-- ============================================
-- DASHBOARD & ESTATÍSTICAS
-- ============================================

-- Estatísticas gerais do dashboard
SELECT * FROM vw_dashboard_stats;

-- Mensagens pendentes hoje
SELECT COUNT(*) as total_pendentes 
FROM messages 
WHERE status = 'pendente' 
  AND DATE(created_at) = CURRENT_DATE;

-- Consultas do dia
SELECT 
  a.appointment_date,
  c.full_name,
  c.phone,
  a.appointment_type,
  a.appointment_status,
  a.doctor_name
FROM appointments a
JOIN contacts c ON a.patient_id = c.patient_id
WHERE DATE(a.appointment_date) = CURRENT_DATE
ORDER BY a.appointment_date;

-- Top 10 pacientes mais ativos
SELECT 
  c.full_name,
  c.phone,
  COUNT(m.id) as total_mensagens,
  MAX(m.created_at) as ultima_mensagem
FROM contacts c
JOIN messages m ON c.patient_id = m.patient_id
GROUP BY c.id, c.full_name, c.phone
ORDER BY total_mensagens DESC
LIMIT 10;

-- ============================================
-- MENSAGENS
-- ============================================

-- Todas as mensagens pendentes com informações do paciente
SELECT 
  m.id,
  m.message,
  m.priority,
  m.created_at,
  c.full_name as paciente,
  c.phone,
  c.email,
  u.name as atendente,
  ARRAY_AGG(t.name) FILTER (WHERE t.name IS NOT NULL) as tags
FROM messages m
JOIN contacts c ON m.patient_id = c.patient_id
LEFT JOIN users u ON m.assigned_to_id = u.id
LEFT JOIN message_tags mt ON m.id = mt.message_id
LEFT JOIN tags t ON mt.tag_id = t.id
WHERE m.status = 'pendente'
GROUP BY m.id, c.full_name, c.phone, c.email, u.name
ORDER BY 
  CASE m.priority
    WHEN 'urgente' THEN 1
    WHEN 'alta' THEN 2
    WHEN 'media' THEN 3
    WHEN 'baixa' THEN 4
  END,
  m.created_at ASC;

-- Mensagens por status
SELECT 
  status,
  COUNT(*) as total,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentual
FROM messages
GROUP BY status
ORDER BY total DESC;

-- Mensagens por tag
SELECT 
  t.name,
  t.color,
  COUNT(mt.message_id) as total_mensagens
FROM tags t
LEFT JOIN message_tags mt ON t.id = mt.tag_id
GROUP BY t.id, t.name, t.color
ORDER BY total_mensagens DESC;

-- Tempo médio de resposta por atendente
SELECT 
  u.name as atendente,
  COUNT(m.id) as mensagens_atendidas,
  AVG(EXTRACT(EPOCH FROM (m.replied_at - m.created_at)) / 3600) as horas_media_resposta
FROM messages m
JOIN users u ON m.assigned_to_id = u.id
WHERE m.replied_at IS NOT NULL
GROUP BY u.id, u.name
ORDER BY horas_media_resposta ASC;

-- ============================================
-- PACIENTES
-- ============================================

-- Buscar paciente por nome (case-insensitive)
SELECT 
  patient_id,
  full_name,
  phone,
  email,
  contact_status,
  last_activity
FROM contacts
WHERE LOWER(full_name) LIKE LOWER('%maria%')
ORDER BY last_activity DESC;

-- Buscar por telefone
SELECT * FROM contacts 
WHERE phone LIKE '%98765%';

-- Pacientes sem atividade há mais de 30 dias
SELECT 
  full_name,
  phone,
  email,
  last_activity,
  CURRENT_DATE - DATE(last_activity) as dias_sem_atividade
FROM contacts
WHERE last_activity < NOW() - INTERVAL '30 days'
ORDER BY last_activity ASC;

-- Novos pacientes do mês
SELECT 
  full_name,
  phone,
  created_at
FROM contacts
WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
ORDER BY created_at DESC;

-- ============================================
-- CONSULTAS & AGENDAMENTOS
-- ============================================

-- Consultas da semana
SELECT 
  DATE(a.appointment_date) as dia,
  COUNT(*) as total_consultas,
  STRING_AGG(DISTINCT a.appointment_type, ', ') as tipos
FROM appointments a
WHERE a.appointment_date BETWEEN 
  DATE_TRUNC('week', CURRENT_DATE) AND 
  DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '7 days'
GROUP BY DATE(a.appointment_date)
ORDER BY dia;

-- Consultas por médico
SELECT 
  doctor_name,
  COUNT(*) as total_consultas,
  COUNT(*) FILTER (WHERE appointment_status = 'realizado') as realizadas,
  COUNT(*) FILTER (WHERE appointment_status = 'cancelado') as canceladas
FROM appointments
GROUP BY doctor_name
ORDER BY total_consultas DESC;

-- Taxa de cancelamento
SELECT 
  appointment_type,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE appointment_status = 'cancelado') as cancelados,
  ROUND(
    COUNT(*) FILTER (WHERE appointment_status = 'cancelado') * 100.0 / COUNT(*),
    2
  ) as taxa_cancelamento_pct
FROM appointments
GROUP BY appointment_type
ORDER BY taxa_cancelamento_pct DESC;

-- ============================================
-- ORÇAMENTOS
-- ============================================

-- Orçamentos pendentes com valor total
SELECT 
  b.budget_id,
  c.full_name,
  c.phone,
  b.budget_value,
  b.services,
  b.budget_date,
  b.valid_until,
  CURRENT_DATE - b.valid_until as dias_vencido
FROM budgets b
JOIN contacts c ON b.patient_id = c.patient_id
WHERE b.budget_status = 'pendente'
ORDER BY b.valid_until ASC;

-- Valor total de orçamentos por status
SELECT 
  budget_status,
  COUNT(*) as quantidade,
  SUM(budget_value) as valor_total,
  AVG(budget_value) as valor_medio
FROM budgets
GROUP BY budget_status
ORDER BY valor_total DESC;

-- Taxa de conversão de orçamentos
SELECT 
  COUNT(*) as total_orcamentos,
  COUNT(*) FILTER (WHERE budget_status = 'aprovado') as aprovados,
  COUNT(*) FILTER (WHERE budget_status = 'rejeitado') as rejeitados,
  ROUND(
    COUNT(*) FILTER (WHERE budget_status = 'aprovado') * 100.0 / COUNT(*),
    2
  ) as taxa_aprovacao_pct
FROM budgets;

-- ============================================
-- CIRURGIAS
-- ============================================

-- Cirurgias próximas (próximos 30 dias)
SELECT 
  s.surgery_date,
  c.full_name,
  c.phone,
  s.surgery_type,
  s.surgery_hospital,
  s.surgery_status
FROM surgeries s
JOIN contacts c ON s.patient_id = c.patient_id
WHERE s.surgery_date BETWEEN NOW() AND NOW() + INTERVAL '30 days'
  AND s.surgery_status = 'agendada'
ORDER BY s.surgery_date;

-- Cirurgias por tipo
SELECT 
  surgery_type,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE surgery_status = 'realizada') as realizadas,
  COUNT(*) FILTER (WHERE surgery_status = 'agendada') as agendadas
FROM surgeries
GROUP BY surgery_type
ORDER BY total DESC;

-- ============================================
-- PÓS-OPERATÓRIO
-- ============================================

-- Pós-operatórios pendentes
SELECT 
  p.postop_date,
  c.full_name,
  c.phone,
  p.postop_day,
  s.surgery_type,
  p.postop_status
FROM post_ops p
JOIN contacts c ON p.patient_id = c.patient_id
JOIN surgeries s ON p.surgery_id = s.id
WHERE p.postop_status IN ('agendado', 'pendente')
ORDER BY p.postop_date;

-- Taxa de complicações pós-operatórias
SELECT 
  COUNT(*) as total_pos_ops,
  COUNT(*) FILTER (WHERE has_complications = true) as com_complicacoes,
  ROUND(
    COUNT(*) FILTER (WHERE has_complications = true) * 100.0 / COUNT(*),
    2
  ) as taxa_complicacao_pct
FROM post_ops;

-- ============================================
-- RELATÓRIOS FINANCEIROS
-- ============================================

-- Faturamento por mês (orçamentos aprovados)
SELECT 
  TO_CHAR(budget_date, 'YYYY-MM') as mes,
  COUNT(*) as orcamentos_aprovados,
  SUM(budget_value) as valor_total
FROM budgets
WHERE budget_status = 'aprovado'
GROUP BY TO_CHAR(budget_date, 'YYYY-MM')
ORDER BY mes DESC;

-- Métodos de pagamento mais usados
SELECT 
  payment_method,
  COUNT(*) as quantidade,
  SUM(budget_value) as valor_total
FROM budgets
WHERE budget_status = 'aprovado'
  AND payment_method IS NOT NULL
GROUP BY payment_method
ORDER BY quantidade DESC;

-- ============================================
-- AUDITORIA & LOGS
-- ============================================

-- Últimas ações no sistema
SELECT 
  l.created_at,
  u.name as usuario,
  l.action,
  l.entity_type,
  l.description
FROM audit_logs l
LEFT JOIN users u ON l.user_id = u.id
ORDER BY l.created_at DESC
LIMIT 50;

-- Ações por usuário
SELECT 
  u.name,
  COUNT(*) as total_acoes,
  COUNT(*) FILTER (WHERE l.action = 'create') as criadas,
  COUNT(*) FILTER (WHERE l.action = 'update') as atualizadas,
  COUNT(*) FILTER (WHERE l.action = 'delete') as deletadas
FROM users u
LEFT JOIN audit_logs l ON u.id = l.user_id
GROUP BY u.id, u.name
ORDER BY total_acoes DESC;

-- ============================================
-- PERFORMANCE DO ATENDIMENTO
-- ============================================

-- Mensagens por atendente
SELECT 
  u.name,
  COUNT(m.id) as total_mensagens,
  COUNT(*) FILTER (WHERE m.status = 'resolvido') as resolvidas,
  COUNT(*) FILTER (WHERE m.status = 'pendente') as pendentes,
  ROUND(
    COUNT(*) FILTER (WHERE m.status = 'resolvido') * 100.0 / COUNT(m.id),
    2
  ) as taxa_resolucao_pct
FROM users u
LEFT JOIN messages m ON u.id = m.assigned_to_id
WHERE u.role = 'agent'
GROUP BY u.id, u.name
ORDER BY total_mensagens DESC;

-- Distribuição de mensagens por hora do dia
SELECT 
  EXTRACT(HOUR FROM created_at) as hora,
  COUNT(*) as total_mensagens
FROM messages
GROUP BY EXTRACT(HOUR FROM created_at)
ORDER BY hora;

-- ============================================
-- BUSCA AVANÇADA
-- ============================================

-- Buscar em múltiplas tabelas (paciente completo)
SELECT 
  c.full_name,
  c.phone,
  c.email,
  COUNT(DISTINCT m.id) as total_mensagens,
  COUNT(DISTINCT a.id) as total_consultas,
  COUNT(DISTINCT b.id) as total_orcamentos,
  COUNT(DISTINCT s.id) as total_cirurgias,
  MAX(c.last_activity) as ultima_atividade
FROM contacts c
LEFT JOIN messages m ON c.patient_id = m.patient_id
LEFT JOIN appointments a ON c.patient_id = a.patient_id
LEFT JOIN budgets b ON c.patient_id = b.patient_id
LEFT JOIN surgeries s ON c.patient_id = s.patient_id
WHERE c.full_name ILIKE '%silva%'
GROUP BY c.id, c.full_name, c.phone, c.email;

-- ============================================
-- MANUTENÇÃO
-- ============================================

-- Verificar integridade referencial
SELECT 
  'Mensagens sem paciente' as problema,
  COUNT(*) as quantidade
FROM messages m
WHERE NOT EXISTS (
  SELECT 1 FROM contacts c WHERE c.patient_id = m.patient_id
)
UNION ALL
SELECT 
  'Documentos sem paciente',
  COUNT(*)
FROM documents d
WHERE NOT EXISTS (
  SELECT 1 FROM contacts c WHERE c.patient_id = d.patient_id
);

-- Tamanho das tabelas
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Índices não utilizados
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND indexname NOT LIKE 'pg_toast%'
ORDER BY schemaname, tablename;

-- ============================================
-- BACKUP & RESTORE (Comandos de terminal)
-- ============================================

-- Backup completo
-- pg_dump -h seu-host -U seu-usuario -d portal_clinic_bot -F c -b -v -f backup.dump

-- Backup apenas dados
-- pg_dump -h seu-host -U seu-usuario -d portal_clinic_bot --data-only -f data_backup.sql

-- Backup apenas schema
-- pg_dump -h seu-host -U seu-usuario -d portal_clinic_bot --schema-only -f schema_backup.sql

-- Restore
-- pg_restore -h seu-host -U seu-usuario -d portal_clinic_bot -v backup.dump

-- ============================================
-- FIM
-- ============================================

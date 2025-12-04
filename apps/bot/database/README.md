# 🗄️ Banco de Dados - Portal Clinic Bot

Este diretório contém a estrutura completa do banco de dados PostgreSQL para o Portal Clinic Bot.

## 📋 Arquivos

- **`schema.sql`** - Schema completo com todas as tabelas, índices, triggers e views
- **`seeds.sql`** - Dados de exemplo para teste e desenvolvimento
- **`README.md`** - Este arquivo com instruções de uso

## 🚀 Como Usar

### Opção 1: Supabase (Recomendado)

1. **Acesse seu projeto no Supabase**
   - Vá para [supabase.com](https://supabase.com)
   - Abra seu projeto ou crie um novo

2. **Execute o Schema**
   - No menu lateral, clique em "SQL Editor"
   - Clique em "New query"
   - Copie todo o conteúdo do arquivo `schema.sql`
   - Cole no editor e clique em "Run"
   - Aguarde a confirmação de execução

3. **Execute os Seeds (Opcional)**
   - Crie uma nova query
   - Copie todo o conteúdo do arquivo `seeds.sql`
   - Cole no editor e clique em "Run"
   - Isso criará dados de exemplo para testar o sistema

4. **Configure as Variáveis de Ambiente**
   - No Supabase, vá em "Settings" > "API"
   - Copie a `URL` e a `anon public key`
   - Configure no arquivo `.env` do projeto:
   ```env
   VITE_SUPABASE_URL=sua_url_aqui
   VITE_SUPABASE_ANON_KEY=sua_chave_aqui
   ```

### Opção 2: PostgreSQL Local

1. **Instale o PostgreSQL**
   ```bash
   # macOS
   brew install postgresql@15
   
   # Ubuntu/Debian
   sudo apt-get install postgresql-15
   ```

2. **Crie o Banco de Dados**
   ```bash
   createdb portal_clinic_bot
   ```

3. **Execute os Scripts**
   ```bash
   # Execute o schema
   psql -d portal_clinic_bot -f database/schema.sql
   
   # Execute os seeds (opcional)
   psql -d portal_clinic_bot -f database/seeds.sql
   ```

4. **Configure a Conexão**
   - No arquivo `.env`:
   ```env
   DATABASE_URL=postgresql://usuario:senha@localhost:5432/portal_clinic_bot
   ```

## 📊 Estrutura do Banco de Dados

### Tabelas Principais

#### 1. **users** - Usuários do Sistema
Armazena atendentes e administradores que usam o painel.

**Campos principais:**
- `id` (UUID) - Identificador único
- `name` - Nome do usuário
- `email` - Email (único, usado para login)
- `password_hash` - Senha criptografada
- `role` - Papel ('admin' ou 'agent')
- `sector` - Setor de trabalho

#### 2. **contacts** - Pacientes/Contatos
Cadastro completo dos pacientes da clínica.

**Campos principais:**
- `patient_id` (VARCHAR) - ID único do paciente (telefone, CPF, etc.)
- `full_name` - Nome completo
- `phone` - Telefone
- `email` - Email
- `cpf` - CPF
- `birth_date` - Data de nascimento
- `contact_status` - Status ('patient', 'lead', 'inactive')
- `pasta_link` - Link da pasta no Google Drive

#### 3. **messages** - Mensagens/Conversas
Todas as mensagens recebidas dos pacientes.

**Campos principais:**
- `patient_id` - Referência ao paciente
- `message` - Conteúdo da mensagem
- `status` - Status ('pendente', 'em_andamento', 'resolvido', 'arquivado')
- `priority` - Prioridade ('baixa', 'media', 'alta', 'urgente')
- `assigned_to_id` - Atendente responsável
- `current_journey_step` - Etapa da jornada do paciente
- `source` - Origem ('whatsapp', 'email', 'phone', 'web')

#### 4. **appointments** - Consultas/Agendamentos
Agendamentos de consultas e exames.

**Campos principais:**
- `appointment_date` - Data e hora da consulta
- `appointment_type` - Tipo ('Primeira Consulta', 'Retorno', etc.)
- `appointment_status` - Status ('agendado', 'confirmado', 'realizado', 'cancelado')
- `doctor_name` - Nome do médico
- `appointment_link` - Link do Google Meet/Zoom

#### 5. **budgets** - Orçamentos
Orçamentos de procedimentos e serviços.

**Campos principais:**
- `budget_id` - ID de referência do orçamento
- `budget_value` - Valor total
- `budget_status` - Status ('pendente', 'aprovado', 'rejeitado')
- `services` - Lista de procedimentos
- `payment_method` - Método de pagamento
- `installments` - Número de parcelas

#### 6. **surgeries** - Cirurgias
Registro de cirurgias programadas e realizadas.

**Campos principais:**
- `surgery_date` - Data da cirurgia
- `surgery_type` - Tipo de cirurgia
- `surgery_hospital` - Hospital/local
- `surgery_status` - Status ('agendada', 'realizada', 'cancelada')
- `surgery_team` - Equipe médica

#### 7. **post_ops** - Pós-Operatório
Acompanhamento pós-operatório.

**Campos principais:**
- `surgery_id` - Referência à cirurgia
- `postop_date` - Data do retorno
- `postop_day` - Dia do pós-operatório (7º, 15º, etc.)
- `postop_status` - Status
- `has_complications` - Indicador de complicações

#### 8. **follow_ups** - Follow-ups
Retornos e acompanhamentos.

**Campos principais:**
- `appointment_date` - Data do follow-up
- `follow_up_type` - Tipo de acompanhamento
- `appointment_status` - Status

#### 9. **tags** - Etiquetas
Tags para classificação de mensagens.

**Campos principais:**
- `name` - Nome da tag
- `color` - Cor hexadecimal
- `description` - Descrição

#### 10. **message_tags** - Relacionamento
Tabela de relacionamento N:N entre mensagens e tags.

#### 11. **audit_logs** - Logs de Auditoria
Registro de todas as ações no sistema.

**Campos principais:**
- `user_id` - Usuário que executou a ação
- `action` - Tipo de ação ('create', 'update', 'delete', 'login')
- `entity_type` - Tipo de entidade afetada
- `description` - Descrição da ação

#### 12. **documents** - Documentos
Arquivos e documentos dos pacientes.

**Campos principais:**
- `document_name` - Nome do documento
- `document_type` - Tipo ('exame', 'receita', 'laudo', etc.)
- `document_link` - URL do arquivo
- `uploaded_by` - Usuário que fez upload

## 🔍 Views Úteis

### vw_messages_full
View com todas as informações de mensagens incluindo dados do paciente, atendente e tags.

```sql
SELECT * FROM vw_messages_full 
WHERE status = 'pendente'
ORDER BY created_at DESC;
```

### vw_dashboard_stats
Estatísticas agregadas para o dashboard.

```sql
SELECT * FROM vw_dashboard_stats;
```

## 🔐 Segurança

### Hashing de Senhas
As senhas dos usuários devem ser armazenadas usando bcrypt com salt rounds >= 10.

**Exemplo em Node.js:**
```javascript
const bcrypt = require('bcrypt');
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);
```

### Row Level Security (RLS)
O schema inclui comentários com exemplos de políticas RLS para o Supabase. Descomente e adapte conforme necessário.

## 📈 Índices

O schema inclui índices otimizados para:
- Buscas por paciente (`patient_id`)
- Buscas por email e telefone
- Filtros por status e prioridade
- Ordenação por data
- Busca textual em nomes (usando pg_trgm)

## 🔄 Triggers

Triggers automáticos para atualizar `updated_at` em todas as tabelas principais quando há modificações.

## 🧪 Dados de Teste

O arquivo `seeds.sql` insere:
- 8 pacientes de exemplo
- 8 mensagens variadas
- 5 consultas agendadas
- 4 orçamentos
- 3 cirurgias (1 realizada, 2 agendadas)
- 2 registros de pós-operatório
- 2 follow-ups
- 3 documentos
- 10 tags padrão
- 3 usuários (1 admin, 2 atendentes)
- Logs de auditoria de exemplo

## 🛠️ Manutenção

### Backup
```bash
# PostgreSQL local
pg_dump portal_clinic_bot > backup_$(date +%Y%m%d).sql

# Supabase - use o dashboard em "Settings" > "Backups"
```

### Restore
```bash
psql portal_clinic_bot < backup.sql
```

### Limpar dados de teste
```sql
-- ATENÇÃO: Isso apagará todos os dados!
TRUNCATE TABLE 
  message_tags, messages, documents, 
  follow_ups, post_ops, surgeries, 
  budgets, appointments, contacts, 
  audit_logs, tags, users
RESTART IDENTITY CASCADE;
```

## 📚 Consultas Úteis

### Listar mensagens pendentes com paciente
```sql
SELECT 
  m.message,
  c.full_name,
  c.phone,
  m.priority,
  m.created_at
FROM messages m
JOIN contacts c ON m.patient_id = c.patient_id
WHERE m.status = 'pendente'
ORDER BY m.priority DESC, m.created_at ASC;
```

### Consultas do dia
```sql
SELECT 
  a.appointment_date,
  c.full_name,
  c.phone,
  a.appointment_type,
  a.doctor_name
FROM appointments a
JOIN contacts c ON a.patient_id = c.patient_id
WHERE DATE(a.appointment_date) = CURRENT_DATE
ORDER BY a.appointment_date;
```

### Cirurgias próximas (próximos 7 dias)
```sql
SELECT 
  s.surgery_date,
  c.full_name,
  s.surgery_type,
  s.surgery_hospital
FROM surgeries s
JOIN contacts c ON s.patient_id = c.patient_id
WHERE s.surgery_date BETWEEN NOW() AND NOW() + INTERVAL '7 days'
  AND s.surgery_status = 'agendada'
ORDER BY s.surgery_date;
```

### Orçamentos pendentes
```sql
SELECT 
  b.budget_id,
  c.full_name,
  b.budget_value,
  b.services,
  b.budget_date
FROM budgets b
JOIN contacts c ON b.patient_id = c.patient_id
WHERE b.budget_status = 'pendente'
ORDER BY b.budget_date DESC;
```

## 🐛 Troubleshooting

### Erro: extensão uuid-ossp não encontrada
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Erro: extensão pg_trgm não encontrada
```sql
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
```

### Erro: função update_updated_at_column já existe
Ignore este erro, significa que o trigger já foi criado anteriormente.

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação do Supabase: https://supabase.com/docs
2. Consulte a documentação do PostgreSQL: https://www.postgresql.org/docs/
3. Entre em contato com o administrador do sistema

---

**Última atualização:** Janeiro 2024  
**Versão do Schema:** 1.0.0  
**Compatibilidade:** PostgreSQL 12+, Supabase

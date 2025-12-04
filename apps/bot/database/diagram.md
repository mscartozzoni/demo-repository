# 📊 Diagrama do Banco de Dados - Portal Clinic Bot

## Relacionamentos entre Tabelas

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PORTAL CLINIC BOT - DATABASE                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│     USERS        │◄─────────┐
│──────────────────│          │
│ id (PK)          │          │
│ name             │          │ assigned_to_id
│ email (UNIQUE)   │          │
│ password_hash    │          │
│ role             │          │
│ sector           │          │
└──────────────────┘          │
        │                     │
        │ uploaded_by         │
        │                     │
        ▼                     │
┌──────────────────┐          │         ┌──────────────────┐
│   DOCUMENTS      │          │         │    MESSAGES      │
│──────────────────│          │         │──────────────────│
│ id (PK)          │          └─────────┤ id (PK)          │
│ patient_id (FK)  │◄──┐               │ patient_id (FK)  │◄──┐
│ document_name    │   │               │ message          │   │
│ document_type    │   │               │ status           │   │
│ document_link    │   │               │ priority         │   │
│ uploaded_by (FK) │   │               │ assigned_to_id   │   │
└──────────────────┘   │               │ source           │   │
                       │               │ is_read          │   │
                       │               └──────────────────┘   │
                       │                       │              │
┌──────────────────┐   │                       │              │
│    CONTACTS      │   │                       │              │
│──────────────────│   │                       ▼              │
│ id (PK)          │   │               ┌──────────────────┐   │
│ patient_id(UNIQ) │───┼───────────────┤  MESSAGE_TAGS    │   │
│ full_name        │   │               │──────────────────│   │
│ phone            │   │               │ message_id (FK)  │   │
│ email            │   │               │ tag_id (FK)      │   │
│ cpf              │   │               └──────────────────┘   │
│ contact_status   │   │                       │              │
│ pasta_link       │   │                       ▼              │
└──────────────────┘   │               ┌──────────────────┐   │
        │              │               │      TAGS        │   │
        │              │               │──────────────────│   │
        │              │               │ id (PK)          │   │
        ├──────────────┘               │ name (UNIQUE)    │   │
        │                              │ color            │   │
        │                              │ description      │   │
        │                              └──────────────────┘   │
        │                                                     │
        ├─────────────────────────────────────────────────────┘
        │
        ├──────────────┐
        │              │
        ▼              ▼
┌──────────────────┐  ┌──────────────────┐
│  APPOINTMENTS    │  │     BUDGETS      │
│──────────────────│  │──────────────────│
│ id (PK)          │  │ id (PK)          │
│ patient_id (FK)  │  │ budget_id (UNIQ) │
│ appointment_date │  │ patient_id (FK)  │
│ appointment_type │  │ budget_value     │
│ appointment_stat │  │ budget_status    │
│ doctor_name      │  │ services         │
│ location         │  │ payment_method   │
└──────────────────┘  └──────────────────┘
        │
        │
        ▼
┌──────────────────┐
│    SURGERIES     │
│──────────────────│
│ id (PK)          │
│ patient_id (FK)  │
│ surgery_date     │
│ surgery_type     │
│ surgery_hospital │
│ surgery_status   │
│ surgery_team     │
└──────────────────┘
        │
        │ surgery_id
        │
        ▼
┌──────────────────┐
│    POST_OPS      │
│──────────────────│
│ id (PK)          │
│ surgery_id (FK)  │
│ patient_id (FK)  │
│ postop_date      │
│ postop_day       │
│ postop_status    │
│ has_complication │
└──────────────────┘

┌──────────────────┐
│   FOLLOW_UPS     │
│──────────────────│
│ id (PK)          │
│ patient_id (FK)  │
│ appointment_date │
│ follow_up_type   │
│ status           │
└──────────────────┘
        ▲
        │
        │
┌──────────────────┐
│   AUDIT_LOGS     │
│──────────────────│
│ id (PK)          │
│ user_id (FK)     │
│ action           │
│ entity_type      │
│ entity_id        │
│ description      │
│ ip_address       │
└──────────────────┘
```

## Legenda

- **PK**: Primary Key (Chave Primária)
- **FK**: Foreign Key (Chave Estrangeira)
- **UNIQUE**: Campo com valor único
- **◄──**: Relacionamento (muitos para um)
- **▼**: Relacionamento (um para muitos)

## Cardinalidade dos Relacionamentos

### 1. CONTACTS ↔ MESSAGES
- **1:N** - Um contato pode ter várias mensagens
- **Chave**: `contacts.patient_id` → `messages.patient_id`

### 2. USERS ↔ MESSAGES
- **1:N** - Um usuário pode ser atribuído a várias mensagens
- **Chave**: `users.id` → `messages.assigned_to_id`
- **Opcional**: Mensagem pode não ter atendente atribuído

### 3. MESSAGES ↔ TAGS
- **N:M** - Uma mensagem pode ter várias tags e uma tag pode estar em várias mensagens
- **Tabela intermediária**: `message_tags`

### 4. CONTACTS ↔ APPOINTMENTS
- **1:N** - Um contato pode ter vários agendamentos
- **Chave**: `contacts.patient_id` → `appointments.patient_id`

### 5. CONTACTS ↔ BUDGETS
- **1:N** - Um contato pode ter vários orçamentos
- **Chave**: `contacts.patient_id` → `budgets.patient_id`

### 6. CONTACTS ↔ SURGERIES
- **1:N** - Um contato pode ter várias cirurgias
- **Chave**: `contacts.patient_id` → `surgeries.patient_id`

### 7. SURGERIES ↔ POST_OPS
- **1:N** - Uma cirurgia pode ter vários registros de pós-operatório
- **Chave**: `surgeries.id` → `post_ops.surgery_id`

### 8. CONTACTS ↔ FOLLOW_UPS
- **1:N** - Um contato pode ter vários follow-ups
- **Chave**: `contacts.patient_id` → `follow_ups.patient_id`

### 9. CONTACTS ↔ DOCUMENTS
- **1:N** - Um contato pode ter vários documentos
- **Chave**: `contacts.patient_id` → `documents.patient_id`

### 10. USERS ↔ DOCUMENTS
- **1:N** - Um usuário pode fazer upload de vários documentos
- **Chave**: `users.id` → `documents.uploaded_by`
- **Opcional**: Documento pode não ter usuário registrado

### 11. USERS ↔ AUDIT_LOGS
- **1:N** - Um usuário pode gerar vários logs
- **Chave**: `users.id` → `audit_logs.user_id`
- **Opcional**: Log pode não ter usuário (ações do sistema)

## Fluxo de Dados Principal

### 1. Entrada de Nova Mensagem
```
Webhook/API → CONTACTS (cria/atualiza paciente)
           → MESSAGES (cria mensagem)
           → MESSAGE_TAGS (adiciona tags)
```

### 2. Atribuição de Atendente
```
USERS (seleciona atendente)
   → MESSAGES.assigned_to_id (atribui)
   → AUDIT_LOGS (registra ação)
```

### 3. Agendamento de Consulta
```
MESSAGES (solicitação)
   → APPOINTMENTS (cria agendamento)
   → MESSAGES.status = 'resolvido'
   → AUDIT_LOGS (registra)
```

### 4. Criação de Orçamento
```
APPOINTMENTS/MESSAGES
   → BUDGETS (cria orçamento)
   → MESSAGES (atualiza status)
```

### 5. Agendamento de Cirurgia
```
BUDGETS.status = 'aprovado'
   → SURGERIES (agenda cirurgia)
   → APPOINTMENTS (consulta pré-op)
```

### 6. Pós-Operatório
```
SURGERIES (cirurgia realizada)
   → POST_OPS (cria registros de retorno)
   → FOLLOW_UPS (agenda acompanhamentos)
```

## Índices e Performance

### Índices Críticos

**CONTACTS:**
- `patient_id` (UNIQUE) - Busca rápida por ID
- `phone` - Busca por telefone
- `full_name` (GIN + pg_trgm) - Busca textual

**MESSAGES:**
- `patient_id` - Listar mensagens do paciente
- `status` - Filtrar por status
- `priority` - Ordenar por prioridade
- `created_at DESC` - Ordenar por data

**APPOINTMENTS:**
- `patient_id` - Consultas do paciente
- `appointment_date` - Agenda do dia

**BUDGETS:**
- `patient_id` - Orçamentos do paciente
- `budget_status` - Filtrar por status

## Views Materializadas (Recomendadas)

Para relatórios e dashboards com alto volume, considere criar:

### vw_patient_summary
```sql
-- Resumo completo de cada paciente:
-- Última mensagem, próxima consulta, orçamentos pendentes, etc.
```

### vw_daily_appointments
```sql
-- Todas as consultas do dia com dados completos
```

### vw_pending_actions
```sql
-- Todas as ações pendentes (mensagens, orçamentos, pós-ops)
```

## Constraints e Validações

### CONTACTS
- `patient_id`: UNIQUE, NOT NULL
- `email`: Validação de formato (app layer)
- `cpf`: Validação de formato (app layer)

### MESSAGES
- `status`: CHECK IN ('pendente', 'em_andamento', 'resolvido', 'arquivado')
- `priority`: CHECK IN ('baixa', 'media', 'alta', 'urgente')

### APPOINTMENTS
- `appointment_status`: CHECK IN ('agendado', 'confirmado', 'realizado', 'cancelado')
- `appointment_date`: > NOW() para novos agendamentos

### BUDGETS
- `budget_value`: > 0
- `budget_status`: CHECK IN ('pendente', 'aprovado', 'rejeitado', 'em_negociacao')

## Estratégia de Backup

### Dados Críticos (Backup Diário)
- `contacts`
- `messages`
- `appointments`
- `surgeries`

### Dados Históricos (Backup Semanal)
- `audit_logs`
- `documents`
- `budgets`

### Dados de Configuração (Backup Mensal)
- `users`
- `tags`

## Considerações de Escala

### Para > 10.000 pacientes:
1. Particionar `messages` por data
2. Arquivar `audit_logs` antigos
3. Implementar cache em Redis para `vw_dashboard_stats`

### Para > 100.000 mensagens:
1. Índices parciais para mensagens ativas
2. Materialized views para relatórios
3. Separar histórico de mensagens antigas

---

**Versão:** 1.0.0  
**Data:** Janeiro 2024  
**Gerado automaticamente pelo Portal Clinic Bot**

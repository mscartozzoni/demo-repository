# 🔗 Sistema Híbrido: Google Sheets + Supabase

## 📋 Visão Geral

O Portal Clinic Bot agora utiliza uma **arquitetura híbrida** que combina o melhor dos dois mundos:

- **🗄️ Supabase**: Para dados estruturados (pacientes, agendamentos, orçamentos)
- **📊 Google Sheets**: Para chat, logs e análises manuais

## 🎯 Objetivos da Arquitetura Híbrida

### ✅ Por que Google Sheets para Chat?
- **Análise Manual**: Facilita análise de conversas pelos gestores
- **Relatórios**: Exportação simples para Excel e dashboards
- **Flexibilidade**: Permite análises ad-hoc sem consultas SQL complexas
- **Backup Visual**: Interface familiar para todos os usuários

### ✅ Por que Supabase para Dados Estruturados?
- **Performance**: Consultas rápidas para dados relacionais
- **Escalabilidade**: Suporte a milhares de registros
- **Integridade**: Relacionamentos e constraints de dados
- **Real-time**: Atualizações em tempo real

## 🏗️ Arquitetura de Dados

```
┌─────────────────────────────────────────────────────────────┐
│                    PORTAL CLINIC BOT                        │
├─────────────────────────────────────────────────────────────┤
│                   Frontend React                            │
├─────────────────────────┬───────────────────────────────────┤
│     Google Sheets       │          Supabase                 │
├─────────────────────────┼───────────────────────────────────┤
│ • Chat Messages         │ • Patients                        │
│ • Activity Logs         │ • Appointments                    │
│ • System Metrics        │ • Budgets                         │
│ • Interaction Logs      │ • Users                           │
│ • Manual Analysis       │ • Settings                        │
└─────────────────────────┴───────────────────────────────────┘
```

## 📁 Estrutura de Arquivos

```
src/
├── services/
│   ├── HybridDataService.ts    # Serviço principal híbrido
│   └── GoogleSheetsService.ts  # Serviço específico do Sheets
├── hooks/
│   └── useHybridData.ts        # Hook React para dados híbridos
└── components/
    ├── HybridConnectionStatus.jsx  # Status das conexões
    └── HybridApiDemo.jsx           # Demonstração da API
```

## ⚙️ Configuração

### 1. Google Sheets

1. **Criar Service Account:**
   ```bash
   # No Google Cloud Console
   1. Acesse https://console.cloud.google.com/
   2. Crie um novo projeto ou use existente
   3. Ative a Google Sheets API
   4. Crie Service Account
   5. Baixe o arquivo JSON com as credenciais
   ```

2. **Configurar .env:**
   ```env
   VITE_GOOGLE_SHEET_ID=sua_planilha_id
   VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL=email@projeto.iam.gserviceaccount.com
   VITE_GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
   ```

3. **Compartilhar Planilha:**
   ```bash
   # Compartilhe a planilha com o email da Service Account
   # Permissão: Editor
   ```

### 2. Supabase

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

## 📊 Estrutura das Planilhas Google Sheets

### Aba: `chat_messages`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | string | ID único da mensagem |
| patient_id | string | ID do paciente |
| patient_name | string | Nome do paciente |
| message | text | Conteúdo da mensagem |
| from_contact | boolean | Se é do contato (TRUE/FALSE) |
| timestamp | datetime | Data/hora da mensagem |
| priority | string | baixa, media, alta |
| status | string | pendente, em_andamento, resolvido |
| assigned_to | string | ID do atendente |
| tags | string | Tags separadas por vírgula |
| source | string | whatsapp, email, phone, web |

### Aba: `activity_logs`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | string | ID único do log |
| user_id | string | ID do usuário |
| user_name | string | Nome do usuário |
| action | string | Ação executada |
| details | text | Detalhes da ação |
| timestamp | datetime | Data/hora da ação |
| metadata | json | Dados adicionais |

### Aba: `system_metrics`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| date | date | Data das métricas |
| total_patients | number | Total de pacientes |
| pending_messages | number | Mensagens pendentes |
| today_appointments | number | Consultas do dia |
| system_health | string | healthy, warning, error |
| timestamp | datetime | Última atualização |

## 🗄️ Tabelas Supabase

### `patients`
```sql
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id VARCHAR(255) UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  status VARCHAR(50) DEFAULT 'novo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### `appointments`
```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  appointment_date TIMESTAMP WITH TIME ZONE,
  appointment_type VARCHAR(100),
  status VARCHAR(50) DEFAULT 'agendado',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔧 Uso da API Híbrida

### Exemplo: Adicionar Mensagem de Chat
```javascript
import { useHybridData } from '@/hooks/useHybridData';

const { addChatMessage } = useHybridData();

await addChatMessage({
  patient_id: 'pac_123',
  patient_name: 'João Silva',
  message: 'Gostaria de agendar uma consulta',
  from_contact: true,
  priority: 'alta',
  status: 'pendente',
  source: 'whatsapp'
});
```

### Exemplo: Adicionar Paciente
```javascript
const { addPatient } = useHybridData();

await addPatient({
  patient_id: 'pac_123',
  full_name: 'João Silva',
  email: 'joao@exemplo.com',
  phone: '(11) 99999-9999',
  status: 'novo'
});
```

## 🚀 Como Testar

1. **Acessar Sistema Híbrido:**
   ```
   Configurações > Sistema Híbrido
   ```

2. **Verificar Status:**
   - Status das conexões Supabase e Google Sheets
   - Métricas do sistema
   - Saúde das integrações

3. **Testar API:**
   - Use a aba "Demo da API"
   - Teste adição de mensagens (→ Sheets)
   - Teste cadastro de pacientes (→ Supabase)

## 🔍 Monitoramento

### Logs de Atividade
- Todas as operações são registradas no Google Sheets
- Logs incluem: usuário, ação, detalhes, timestamp
- Facilita auditoria e troubleshooting

### Métricas do Sistema
- Atualizadas automaticamente
- Visão geral da saúde do sistema
- Alertas para problemas de conexão

## 🛠️ Desenvolvimento

### Instalação de Dependências
```bash
chmod +x scripts/install-hybrid-deps.sh
./scripts/install-hybrid-deps.sh
```

### Estrutura de Services
```typescript
// HybridDataService.ts
export interface HybridChatMessage {
  id: string;
  patient_id: string;
  patient_name: string;
  message: string;
  // ... outros campos
}

class HybridDataService {
  async addChatMessage(message: HybridChatMessage): Promise<string> {
    // Salva no Sheets para análise manual
    // Referência no Supabase para relacionamentos
  }
}
```

## 🎯 Benefícios da Arquitetura

### ✅ Para Gestores
- **Análise Visual**: Dados de chat em planilhas familiares
- **Relatórios Fáceis**: Export direto para Excel
- **Flexibilidade**: Análises ad-hoc sem programação

### ✅ Para Desenvolvedores
- **Performance**: Consultas estruturadas no Supabase
- **Escalabilidade**: Cada dados na plataforma ideal
- **Manutenibilidade**: Separação clara de responsabilidades

### ✅ Para o Sistema
- **Backup Distribuído**: Dados em duas plataformas
- **Fallback**: Se uma falha, a outra continua
- **Sincronização**: Dados críticos sincronizados

## 📈 Roadmap

### Fase 1 (Atual)
- [x] Implementação básica da arquitetura híbrida
- [x] Interface de status e demonstração
- [x] Testes de conexão

### Fase 2 (Próxima)
- [ ] Sincronização automática entre plataformas
- [ ] Webhooks para atualizações em tempo real
- [ ] Dashboard analítico avançado

### Fase 3 (Futuro)
- [ ] Machine Learning para análise de conversas
- [ ] Integração com WhatsApp Business API
- [ ] Relatórios automatizados por email

## 🆘 Troubleshooting

### Erro: "Cannot find module 'google-spreadsheet'"
```bash
npm install google-auth-library google-spreadsheet
```

### Erro: "Supabase connection failed"
```bash
# Verificar configurações no .env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

### Erro: "Google Sheets permission denied"
```bash
# 1. Verificar se a planilha foi compartilhada com a Service Account
# 2. Verificar se a Google Sheets API está ativada no projeto
# 3. Verificar se as credenciais no .env estão corretas
```

---

## 🤝 Contribuição

Para contribuir com melhorias na arquitetura híbrida:

1. Fork do repositório
2. Criar branch para feature: `git checkout -b feature/hybrid-improvement`
3. Commit das mudanças: `git commit -m 'Add hybrid improvement'`
4. Push para branch: `git push origin feature/hybrid-improvement`
5. Abrir Pull Request

---

**💡 A arquitetura híbrida representa um avanço significativo na gestão de dados clínicos, combinando a familiaridade das planilhas com a robustez de bancos relacionais modernos.**

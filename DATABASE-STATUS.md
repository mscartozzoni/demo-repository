# 📊 Status do Banco de Dados - Portal Clinic

**Data:** 2025-11-20  
**Última atualização:** 02:50 UTC

---

## ✅ Configuração Atual

### Supabase (PostgreSQL Cloud)

**Status:** ✅ CONFIGURADO E ATIVO

**Detalhes:**
- **Provider:** Supabase
- **URL:** `https://gnawourfpbsqernpucso.supabase.co`
- **Região:** us-east-1 (provável)
- **Status da Conexão:** ✅ Online e acessível
- **Service Key:** ✅ Configurada no `.env`
- **Anon Key:** ✅ Configurada no `.env`

### Credenciais Configuradas

```bash
# Backend
SUPABASE_URL=https://gnawourfpbsqernpucso.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc... (configurado)

# Frontend
VITE_SUPABASE_URL=https://gnawourfpbsqernpucso.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc... (configurado)
```

**Localização das Credenciais:**
- ✅ `/var/www/portal-clinic-bot/backend/.env` (VPS)
- ✅ Local: `Portal-Clinic-Unified/apps/bot/backend/.env`
- ✅ Frontend: Variáveis no build

---

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais (Esperadas)

Com base na estrutura do Portal Clinic, as seguintes tabelas devem existir:

#### 1. Usuários
```sql
usuarios (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  nome VARCHAR,
  role VARCHAR, -- 'admin', 'medico', 'paciente', 'secretaria'
  telefone VARCHAR,
  cpf VARCHAR UNIQUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

#### 2. Pacientes
```sql
pacientes (
  id UUID PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(id),
  data_nascimento DATE,
  endereco JSONB,
  historico_medico TEXT,
  alergias TEXT[],
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

#### 3. Médicos
```sql
medicos (
  id UUID PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(id),
  crm VARCHAR UNIQUE,
  especialidade VARCHAR,
  telefone_consultorio VARCHAR,
  created_at TIMESTAMP
)
```

#### 4. Consultas
```sql
consultas (
  id UUID PRIMARY KEY,
  paciente_id UUID REFERENCES pacientes(id),
  medico_id UUID REFERENCES medicos(id),
  data_hora TIMESTAMP,
  status VARCHAR, -- 'agendada', 'confirmada', 'concluida', 'cancelada'
  tipo VARCHAR, -- 'primeira_consulta', 'retorno', 'emergencia'
  observacoes TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

#### 5. Prontuários
```sql
prontuarios (
  id UUID PRIMARY KEY,
  consulta_id UUID REFERENCES consultas(id),
  paciente_id UUID REFERENCES pacientes(id),
  medico_id UUID REFERENCES medicos(id),
  anamnese TEXT,
  diagnostico TEXT,
  prescricao TEXT,
  exames_solicitados TEXT[],
  created_at TIMESTAMP
)
```

#### 6. Orçamentos
```sql
orcamentos (
  id UUID PRIMARY KEY,
  paciente_id UUID REFERENCES pacientes(id),
  procedimentos JSONB[],
  valor_total DECIMAL(10,2),
  status VARCHAR, -- 'pendente', 'aprovado', 'rejeitado'
  validade DATE,
  created_at TIMESTAMP
)
```

#### 7. Financeiro
```sql
transacoes_financeiras (
  id UUID PRIMARY KEY,
  paciente_id UUID REFERENCES pacientes(id),
  tipo VARCHAR, -- 'pagamento', 'estorno'
  valor DECIMAL(10,2),
  metodo_pagamento VARCHAR,
  status VARCHAR, -- 'pendente', 'confirmado', 'cancelado'
  referencia VARCHAR, -- ID da consulta ou orçamento
  created_at TIMESTAMP
)
```

#### 8. Conversas (AI Assistant)
```sql
conversas (
  id UUID PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(id),
  titulo VARCHAR,
  status VARCHAR, -- 'ativa', 'arquivada'
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

mensagens (
  id UUID PRIMARY KEY,
  conversa_id UUID REFERENCES conversas(id),
  role VARCHAR, -- 'user', 'assistant', 'system'
  content TEXT,
  tokens_used INTEGER,
  created_at TIMESTAMP
)
```

---

## 🔧 Configuração No Supabase

### Acesso ao Painel

1. **URL:** https://supabase.com/dashboard
2. **Projeto:** `gnawourfpbsqernpucso`
3. **Email:** (usar credencial do projeto)

### Configurações Necessárias

#### RLS (Row Level Security)

**Status:** ⚠️ Verificar se está habilitado

Políticas RLS devem estar configuradas para:
- Usuários só podem ver seus próprios dados
- Médicos podem ver dados de seus pacientes
- Admin pode ver tudo

#### Autenticação

- **Método:** JWT via Supabase Auth
- **Providers:** Email/Password (mínimo)
- **Opcionais:** Google OAuth, outros

#### Storage (para arquivos)

```
Buckets sugeridos:
- documentos-pacientes
- exames
- imagens-consultas
- avatares
```

---

## ❌ Problemas Identificados

### 1. Backend Error - Path Not Defined

**Erro:**
```
ReferenceError: path is not defined
```

**Localização:** `/var/www/portal-clinic-bot/backend/index.js`

**Causa:** Linha 1 do `index.js`:
```javascript
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
```

**Solução:**
```javascript
const path = require('path'); // ⬅️ Adicionar esta linha
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
```

**Ou simplificado:**
```javascript
require('dotenv').config(); // Remove o path, funciona igual
```

### 2. Tabelas Não Verificadas

**Status:** ⚠️ Não sabemos se as tabelas existem

**Ação Necessária:**
1. Acessar painel Supabase
2. Verificar se tabelas existem
3. Se não, executar migrations

---

## 🚀 Scripts de Migração

### Criar Estrutura Básica

```sql
-- Criar tabela de usuários
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR UNIQUE NOT NULL,
  nome VARCHAR NOT NULL,
  role VARCHAR NOT NULL CHECK (role IN ('admin', 'medico', 'paciente', 'secretaria')),
  telefone VARCHAR,
  cpf VARCHAR UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Política: usuários podem ver apenas seus próprios dados
CREATE POLICY "Usuários podem ver seus próprios dados"
  ON usuarios FOR SELECT
  USING (auth.uid() = id);

-- Criar índices
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_cpf ON usuarios(cpf);
```

---

## ✅ Próximos Passos

### Imediato (Hoje)

1. **Corrigir backend** - Adicionar `const path = require('path');`
2. **Reiniciar PM2** - `pm2 restart portal-bot`
3. **Testar conexão** - Verificar logs sem erros

### Curto Prazo (1-2 dias)

4. **Verificar tabelas no Supabase**
5. **Executar migrations se necessário**
6. **Configurar RLS (Row Level Security)**
7. **Testar CRUD básico**

### Médio Prazo (1 semana)

8. **Configurar backups automáticos**
9. **Configurar monitoramento de queries**
10. **Otimizar índices**
11. **Implementar cache (Redis opcional)**

---

## 🔍 Comandos de Verificação

### Testar Conexão

```bash
# Via curl (REST API)
curl https://gnawourfpbsqernpucso.supabase.co/rest/v1/ \
  -H "apikey: YOUR_ANON_KEY"

# Via Node.js (no VPS)
ssh root@82.29.56.143 "cd /var/www/portal-clinic-bot/backend && node -e \"
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
supabase.from('usuarios').select('count').limit(1).then(console.log);
\""
```

### Verificar Logs

```bash
# Logs do backend
ssh root@82.29.56.143 "pm2 logs portal-bot --lines 50"

# Logs do Nginx
ssh root@82.29.56.143 "tail -50 /var/log/nginx/error.log"
```

---

## 📝 Notas Importantes

1. **Service Key é sensível**
   - Nunca expor no frontend
   - Usar apenas no backend
   - Rotar periodicamente

2. **Anon Key é pública**
   - Pode ser exposta no frontend
   - Protegida por RLS
   - Sem acesso direto aos dados sensíveis

3. **Conexão é criptografada**
   - HTTPS obrigatório
   - SSL/TLS configurado automaticamente pelo Supabase

4. **Limites do Plano Free**
   - 500MB database
   - 1GB file storage
   - 2GB bandwidth/mês
   - Considerar upgrade se necessário

---

## 🆘 Troubleshooting

### "Connection refused"
- Verificar firewall VPS
- Verificar se Supabase está online

### "Invalid JWT"
- Verificar se keys estão corretas
- Verificar expiração do token

### "Row Level Security"
- Desabilitar temporariamente para testes
- Configurar políticas adequadas

---

**Responsável:** DevOps Team  
**Contato:** support@portal-clinic.com.br

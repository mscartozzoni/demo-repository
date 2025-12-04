# 🚀 Quick Start - Configuração do Banco de Dados

Guia rápido para colocar o banco de dados do Portal Clinic Bot funcionando em minutos.

## ⚡ Opção Rápida: Supabase (Recomendado)

### Passo 1: Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Crie uma conta ou faça login
4. Clique em "New Project"
5. Preencha:
   - **Name**: `portal-clinic-bot`
   - **Database Password**: Crie uma senha forte
   - **Region**: Escolha a mais próxima (ex: `South America (São Paulo)`)
6. Clique em "Create new project"
7. Aguarde 2-3 minutos enquanto o projeto é criado

### Passo 2: Executar o Schema

1. No dashboard do Supabase, clique em **"SQL Editor"** no menu lateral
2. Clique em **"New query"**
3. Abra o arquivo `database/schema.sql` deste projeto
4. **Copie todo o conteúdo** do arquivo
5. **Cole** no editor SQL do Supabase
6. Clique em **"Run"** (ou pressione Ctrl/Cmd + Enter)
7. Aguarde a execução (pode levar 10-20 segundos)
8. Você verá "Success. No rows returned" - está correto! ✅

### Passo 3: Inserir Dados de Exemplo (Opcional)

1. Clique em **"New query"** novamente
2. Abra o arquivo `database/seeds.sql`
3. **Copie todo o conteúdo**
4. **Cole** no editor
5. Clique em **"Run"**
6. Você verá mensagens sobre os dados inseridos ✅

### Passo 4: Obter Credenciais

1. No Supabase, clique em **"Settings"** (ícone de engrenagem)
2. Clique em **"API"**
3. Copie os seguintes valores:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** (em "Project API keys") → `VITE_SUPABASE_ANON_KEY`

### Passo 5: Configurar o Projeto

1. Na raiz do projeto, copie `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Abra o arquivo `.env` e preencha:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
   ```

### Passo 6: Testar

1. Inicie o projeto:
   ```bash
   npm run dev
   ```

2. Abra o navegador em `http://localhost:5173`

3. Faça login com os usuários de exemplo:
   ```
   Email: admin@clinica.com
   Senha: admin123
   ```
   
   **⚠️ IMPORTANTE:** Altere essa senha em produção!

## ✅ Pronto!

Seu banco de dados está configurado com:
- ✅ 12 tabelas criadas
- ✅ Índices otimizados
- ✅ 8 pacientes de exemplo
- ✅ 8 mensagens de exemplo
- ✅ 5 consultas agendadas
- ✅ 4 orçamentos
- ✅ 3 usuários (1 admin + 2 atendentes)
- ✅ 10 tags padrão

---

## 🔍 Verificar se Deu Certo

### No Supabase:

1. Vá em **"Table Editor"**
2. Você deve ver todas as tabelas listadas:
   - users
   - contacts
   - messages
   - appointments
   - budgets
   - surgeries
   - tags
   - etc.

3. Clique em qualquer tabela para ver os dados

### Via SQL:

Execute no SQL Editor do Supabase:

```sql
-- Ver total de registros
SELECT 
  'Usuários' as tabela, COUNT(*) as total FROM users
UNION ALL
SELECT 'Pacientes', COUNT(*) FROM contacts
UNION ALL
SELECT 'Mensagens', COUNT(*) FROM messages
UNION ALL
SELECT 'Consultas', COUNT(*) FROM appointments
UNION ALL
SELECT 'Orçamentos', COUNT(*) FROM budgets
UNION ALL
SELECT 'Tags', COUNT(*) FROM tags;
```

Resultado esperado:
```
Usuários    | 3
Pacientes   | 8
Mensagens   | 8
Consultas   | 5
Orçamentos  | 4
Tags        | 10
```

---

## 🛠️ Comandos Úteis

### Limpar todos os dados:
```sql
TRUNCATE TABLE 
  message_tags, messages, documents, 
  follow_ups, post_ops, surgeries, 
  budgets, appointments, contacts, 
  audit_logs, tags, users
RESTART IDENTITY CASCADE;
```

### Recriar apenas as tags:
```sql
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
```

### Criar novo usuário admin:
```sql
INSERT INTO users (name, email, password_hash, role, sector)
VALUES (
  'Seu Nome',
  'seu@email.com',
  -- Use bcrypt para gerar o hash da senha
  '$2b$10$YourHashedPasswordHere',
  'admin',
  'Administração'
);
```

**Para gerar o hash da senha em Node.js:**
```javascript
const bcrypt = require('bcrypt');
const hash = await bcrypt.hash('sua_senha', 10);
console.log(hash);
```

---

## ❓ Problemas Comuns

### "relation does not exist"
**Solução:** Execute o schema.sql primeiro, depois o seeds.sql

### "duplicate key value violates unique constraint"
**Solução:** Você já executou o seeds.sql. Execute o TRUNCATE acima para limpar.

### "extension uuid-ossp does not exist"
**Solução:** O Supabase já inclui essa extensão. Ignore o erro.

### Não consegue fazer login
**Soluções:**
1. Certifique-se de que executou o seeds.sql
2. Use a senha padrão: `admin123`
3. Gere um novo hash de senha e atualize no banco

### Conexão recusada
**Soluções:**
1. Verifique se o projeto Supabase está ativo
2. Confirme que as variáveis de ambiente estão corretas
3. Verifique se não há firewall bloqueando

---

## 📚 Próximos Passos

1. **Alterar senhas padrão** em produção
2. **Configurar backup automático** no Supabase (Settings > Backups)
3. **Revisar políticas de segurança** (RLS - Row Level Security)
4. **Configurar Google Sheets** para sistema híbrido (veja HYBRID-INTEGRATION.md)
5. **Personalizar tags** conforme necessidade da clínica
6. **Adicionar seus usuários reais**
7. **Configurar webhook** para receber mensagens automáticas

---

## 🎯 Arquitetura Recomendada

```
┌─────────────────┐
│   Frontend      │  ← React + Vite (localhost:5173)
│   (Este Repo)   │
└────────┬────────┘
         │
         │ API calls
         ▼
┌─────────────────┐
│   Supabase      │  ← PostgreSQL + Auth + Storage
│   (Cloud)       │
└─────────────────┘
         ▲
         │
         │ Webhooks
         │
┌─────────────────┐
│   Integrações   │  ← WhatsApp, Email, etc.
│   (Zapier/n8n)  │
└─────────────────┘
```

---

## 💡 Dicas Pro

1. **Use Views** para queries complexas recorrentes
2. **Ative RLS** no Supabase para segurança extra
3. **Configure índices** em campos que você filtra/ordena muito
4. **Monitore performance** no Supabase Dashboard
5. **Faça backups regulares** antes de mudanças grandes
6. **Use migrations** para mudanças no schema em produção
7. **Documente customizações** no seu projeto

---

## 📞 Suporte

- 📖 [Documentação Supabase](https://supabase.com/docs)
- 💬 [Discord Supabase](https://discord.supabase.com)
- 🐛 [Issues deste projeto](../issues)
- 📧 Contato: suporte@suaclinica.com

---

**Tempo estimado:** 10-15 minutos  
**Dificuldade:** ⭐ Fácil  
**Última atualização:** Janeiro 2024

# ✅ Checklist de Configuração - Portal Clinic Bot

Use este checklist para garantir que o banco de dados está corretamente configurado.

## 📋 Pré-Requisitos

- [ ] Node.js instalado (versão 18+)
- [ ] Conta no Supabase criada
- [ ] Editor de código (VS Code recomendado)
- [ ] Acesso ao terminal/linha de comando

---

## 🚀 Configuração Inicial

### 1. Criar Projeto no Supabase
- [ ] Acessei supabase.com
- [ ] Criei um novo projeto
- [ ] Anotei o nome do projeto: `________________`
- [ ] Anotei a senha do banco: `________________`
- [ ] Aguardei o projeto ser provisionado (2-3 min)

### 2. Executar Schema
- [ ] Abri SQL Editor no Supabase
- [ ] Copiei o conteúdo de `database/schema.sql`
- [ ] Executei o SQL (Run)
- [ ] Não recebi erros críticos
- [ ] Verifiquei que as tabelas foram criadas (Table Editor)

### 3. Executar Seeds (Opcional)
- [ ] Abri uma nova query no SQL Editor
- [ ] Copiei o conteúdo de `database/seeds.sql`
- [ ] Executei o SQL
- [ ] Verifiquei que os dados foram inseridos

### 4. Obter Credenciais
- [ ] Fui em Settings > API no Supabase
- [ ] Copiei a Project URL
- [ ] Copiei a anon public key
- [ ] Copiei a service_role key (para backend)

### 5. Configurar Variáveis de Ambiente
- [ ] Copiei `.env.example` para `.env`
- [ ] Preenchi `VITE_SUPABASE_URL`
- [ ] Preenchi `VITE_SUPABASE_ANON_KEY`
- [ ] Preenchi `SUPABASE_SERVICE_KEY` (se aplicável)
- [ ] Salvei o arquivo `.env`

---

## 🔍 Verificação das Tabelas

Execute no SQL Editor do Supabase para verificar:

```sql
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns 
   WHERE table_name = t.table_name) as num_columns
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

### Tabelas Esperadas:
- [ ] `users` (10 colunas)
- [ ] `contacts` (18 colunas)
- [ ] `messages` (12 colunas)
- [ ] `tags` (4 colunas)
- [ ] `message_tags` (3 colunas)
- [ ] `appointments` (10 colunas)
- [ ] `budgets` (13 colunas)
- [ ] `surgeries` (12 colunas)
- [ ] `post_ops` (12 colunas)
- [ ] `follow_ups` (7 colunas)
- [ ] `audit_logs` (9 colunas)
- [ ] `documents` (9 colunas)

**Total esperado: 12 tabelas**

---

## 📊 Verificação dos Dados de Exemplo

Se você executou o `seeds.sql`, verifique:

```sql
SELECT 
  'Users' as tabela, COUNT(*) as registros FROM users
UNION ALL SELECT 'Contacts', COUNT(*) FROM contacts
UNION ALL SELECT 'Messages', COUNT(*) FROM messages
UNION ALL SELECT 'Appointments', COUNT(*) FROM appointments
UNION ALL SELECT 'Budgets', COUNT(*) FROM budgets
UNION ALL SELECT 'Tags', COUNT(*) FROM tags;
```

### Dados Esperados:
- [ ] `users`: 3 registros
- [ ] `contacts`: 8 registros
- [ ] `messages`: 8 registros
- [ ] `appointments`: 5 registros
- [ ] `budgets`: 4 registros
- [ ] `tags`: 10 registros

---

## 🔐 Verificação de Segurança

### Senhas e Autenticação
- [ ] Alterei as senhas padrão dos usuários de exemplo
- [ ] Criei hash bcrypt para senhas (não uso texto puro)
- [ ] Não commitei o arquivo `.env` no git
- [ ] Não expus `SUPABASE_SERVICE_KEY` no frontend

### Supabase
- [ ] Revisei as políticas de RLS (Row Level Security)
- [ ] Configurei autenticação no Supabase (se aplicável)
- [ ] Limitei acesso por IP (se necessário)

---

## 🔄 Verificação de Integridade

Execute para verificar relacionamentos:

```sql
-- Deve retornar 0 em todas as linhas
SELECT 
  'Messages sem contact' as problema,
  COUNT(*) as registros_invalidos
FROM messages m
WHERE NOT EXISTS (
  SELECT 1 FROM contacts c WHERE c.patient_id = m.patient_id
)
UNION ALL
SELECT 
  'Appointments sem contact',
  COUNT(*)
FROM appointments a
WHERE NOT EXISTS (
  SELECT 1 FROM contacts c WHERE c.patient_id = a.patient_id
)
UNION ALL
SELECT 
  'Budgets sem contact',
  COUNT(*)
FROM budgets b
WHERE NOT EXISTS (
  SELECT 1 FROM contacts c WHERE c.patient_id = b.patient_id
);
```

- [ ] Todas as queries acima retornaram 0
- [ ] Não há dados órfãos no banco

---

## 🎯 Testes Funcionais

### 1. Teste de Leitura
```sql
SELECT * FROM vw_messages_full LIMIT 5;
```
- [ ] Query executou sem erros
- [ ] Retornou dados (se seeds foi executado)

### 2. Teste de Escrita
```sql
INSERT INTO contacts (patient_id, full_name, phone)
VALUES ('TEST-001', 'Paciente Teste', '11999999999');

SELECT * FROM contacts WHERE patient_id = 'TEST-001';

DELETE FROM contacts WHERE patient_id = 'TEST-001';
```
- [ ] INSERT executou com sucesso
- [ ] SELECT retornou o registro
- [ ] DELETE removeu o registro

### 3. Teste de View
```sql
SELECT * FROM vw_dashboard_stats;
```
- [ ] View retornou estatísticas
- [ ] Todos os campos têm valores numéricos

---

## 🚀 Teste da Aplicação

### 1. Iniciar o Projeto
```bash
npm install
npm run dev
```
- [ ] Dependências instaladas sem erros
- [ ] Servidor iniciou em localhost:5173
- [ ] Não há erros de conexão com Supabase

### 2. Teste de Login
- [ ] Página de login carregou
- [ ] Consegui fazer login com `admin@clinica.com` / `admin123`
- [ ] Dashboard carregou após login

### 3. Teste de CRUD
- [ ] Consigo visualizar lista de mensagens
- [ ] Consigo visualizar lista de pacientes
- [ ] Consigo visualizar agendamentos
- [ ] Posso criar/editar/deletar registros

---

## 📈 Performance e Índices

```sql
-- Verificar índices criados
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

### Índices Críticos:
- [ ] `idx_contacts_patient_id`
- [ ] `idx_messages_patient_id`
- [ ] `idx_messages_status`
- [ ] `idx_appointments_patient_id`
- [ ] `idx_budgets_patient_id`

**Mínimo esperado: 30+ índices**

---

## 🔄 Backup e Manutenção

### Configurar Backups Automáticos
- [ ] Fui em Settings > Backups no Supabase
- [ ] Verifiquei que backups diários estão habilitados
- [ ] Testei fazer um backup manual

### Documentação
- [ ] Li o arquivo `README.md` do banco
- [ ] Li o arquivo `QUICKSTART.md`
- [ ] Salvei queries úteis de `queries.sql`

---

## 🌐 Integração Híbrida (Opcional)

Se você vai usar Google Sheets:

- [ ] Criei Service Account no Google Cloud
- [ ] Copiei credenciais da Service Account
- [ ] Configurei no `.env`:
  - `VITE_GOOGLE_SHEET_ID`
  - `VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL`
  - `VITE_GOOGLE_PRIVATE_KEY`
- [ ] Testei conexão com Google Sheets
- [ ] Li `HYBRID-INTEGRATION.md`

---

## 🐛 Troubleshooting

Marque os problemas que você encontrou e resolveu:

- [ ] ❌ Erro: "relation does not exist"
  - ✅ **Solução:** Executei schema.sql primeiro

- [ ] ❌ Erro: "duplicate key value"
  - ✅ **Solução:** Limpei dados com TRUNCATE

- [ ] ❌ Erro: "password authentication failed"
  - ✅ **Solução:** Verifiquei credenciais no .env

- [ ] ❌ Erro: "network request failed"
  - ✅ **Solução:** Verifiquei URL do Supabase

- [ ] ❌ Não consigo fazer login
  - ✅ **Solução:** Gerei novo hash de senha

---

## 📝 Próximos Passos

Depois de completar este checklist:

1. **Segurança**
   - [ ] Alterar todas as senhas padrão
   - [ ] Revisar políticas de acesso
   - [ ] Configurar 2FA no Supabase

2. **Customização**
   - [ ] Adicionar usuários reais
   - [ ] Personalizar tags
   - [ ] Ajustar campos conforme necessidade

3. **Integrações**
   - [ ] Configurar webhook para WhatsApp
   - [ ] Integrar com Google Calendar
   - [ ] Configurar envio de emails

4. **Monitoramento**
   - [ ] Configurar alertas no Supabase
   - [ ] Implementar logging de erros
   - [ ] Criar dashboard de métricas

5. **Deploy**
   - [ ] Fazer deploy do frontend (Vercel/Netlify)
   - [ ] Fazer deploy do backend (se aplicável)
   - [ ] Configurar domínio customizado
   - [ ] Testar em produção

---

## ✨ Checklist Completo!

Se você marcou todos os itens acima:

🎉 **Parabéns!** Seu banco de dados está configurado e pronto para uso!

### Status Final:
- Data de conclusão: `____/____/____`
- Configurado por: `________________`
- Ambiente: [ ] Desenvolvimento [ ] Produção
- Observações: `___________________________`

---

## 📞 Suporte

Problemas? Entre em contato:

- 📖 Documentação: `/database/README.md`
- 🚀 Quick Start: `/database/QUICKSTART.md`
- 💬 Issues: GitHub Issues
- 📧 Email: suporte@suaclinica.com

---

**Versão:** 1.0.0  
**Última atualização:** Janeiro 2024  
**Mantido por:** Portal Clinic Bot Team

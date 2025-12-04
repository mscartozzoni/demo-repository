# 🗄️ Guia de Configuração do Banco de Dados

## 📋 Informações do Banco

**Banco de Dados:** `u980794834_O43Ao`
**phpMyAdmin:** https://auth-db1438.hstgr.io/
**Usuário:** u980794834
**Senha:** Portal-clinic-25

## 🚀 Como Executar o Script SQL

### Método 1: Via phpMyAdmin (Recomendado)

1. **Acesse o phpMyAdmin:**
   - URL: https://auth-db1438.hstgr.io/
   - Login: u980794834
   - Senha: Portal-clinic-25

2. **Selecione o banco:**
   - No menu lateral esquerdo, clique em `u980794834_O43Ao`

3. **Execute o script:**
   - Clique na aba **"SQL"** no topo
   - Abra o arquivo `database-setup.sql` no seu computador
   - Copie **TODO** o conteúdo do arquivo
   - Cole na área de texto do phpMyAdmin
   - Clique em **"Executar"** ou **"Go"**

4. **Verificar resultado:**
   - Deve aparecer mensagens de sucesso
   - Vá na aba **"Estrutura"** e veja as 12 tabelas criadas

### Método 2: Importar Arquivo

1. **Acesse o phpMyAdmin**
2. **Selecione o banco:** `u980794834_O43Ao`
3. **Clique na aba "Importar"**
4. **Clique em "Escolher arquivo"**
5. **Selecione:** `database-setup.sql`
6. **Clique em "Executar"**

## 📊 Tabelas Criadas

### 1. **users** - Usuários do sistema
- Médicos, pacientes, admin, financeiro

### 2. **patients** - Dados detalhados de pacientes
- Endereço, contatos, histórico médico

### 3. **doctors** - Dados de médicos
- CRM, especialidade, preço consulta

### 4. **appointments** - Agendamentos
- Consultas marcadas e seu status

### 5. **medical_records** - Prontuários
- Evoluções médicas, diagnósticos

### 6. **conversations** - Conversas do chatbot
- Sessões de chat com pacientes

### 7. **messages** - Mensagens do chatbot
- Histórico de mensagens

### 8. **budgets** - Orçamentos
- Propostas de procedimentos

### 9. **payments** - Pagamentos
- Controle financeiro

### 10. **procedures** - Procedimentos
- Catálogo de serviços

### 11. **documents** - Documentos/Anexos
- PDFs, imagens, etc

### 12. **Dados Iniciais**
- ✅ Usuário Admin criado
- ✅ 5 procedimentos padrão inseridos

## 🔐 Usuários Iniciais

### Admin
```
Email: admin@portal-clinic.com.br
Nome: Administrador
Role: admin
```

### Suporte
```
Email: suporte@portal-clinic.com.br
Nome: Suporte Portal Clinic
Role: secretary
```

## 🧪 Testar Banco de Dados

Após executar o script, teste com estas queries:

```sql
-- Ver todas as tabelas
SHOW TABLES;

-- Contar registros
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM procedures;

-- Ver usuários criados
SELECT * FROM users;

-- Ver procedimentos
SELECT * FROM procedures;
```

## 🔄 Conectar Backend ao MySQL

**Arquivo `.env` da API:**

```env
# MySQL Hostinger
DB_HOST=localhost
DB_USER=u980794834
DB_PASSWORD=Portal-clinic-25
DB_NAME=u980794834_O43Ao
DB_PORT=3306

# Manter também Supabase como backup
SUPABASE_URL=https://gnawourfpbsqernpucso.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📝 Próximos Passos

1. ✅ Executar `database-setup.sql` no phpMyAdmin
2. ✅ Verificar se as 12 tabelas foram criadas
3. ✅ Testar queries de listagem
4. ✅ Atualizar `.env` da API com credenciais MySQL
5. ✅ Fazer deploy da API no Hostinger
6. ✅ Testar endpoints da API

## 🐛 Troubleshooting

### Erro: "Table already exists"
- Normal se executar o script 2x
- As tabelas não serão duplicadas (CREATE IF NOT EXISTS)

### Erro: "Access denied"
- Verifique usuário e senha
- Confirme que está no banco correto

### Tabelas não aparecem
- Clique em "Estrutura" no phpMyAdmin
- Atualize a página (F5)
- Verifique se há erros no log

---

**Dica:** Mantenha o Supabase como backup. O MySQL será usado para dados locais/cache!

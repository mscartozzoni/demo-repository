# 🏥 Portal Clinic - Guia de Configuração Completo

## 📋 Checklist de Implementação

### ✅ Etapa 1: Configurar Ambiente Backend
- [x] Node.js + Express configurado
- [x] MySQL connection pool criado
- [x] Bibliotecas de segurança instaladas (bcrypt, JWT)
- [x] Variáveis de ambiente configuradas

### ✅ Etapa 2: Modelos de Dados
- [x] Schema MySQL criado com tabela `users`
- [x] Roles definidos: patient, secretary, doctor, admin
- [x] Relações de foreign keys estabelecidas

### ✅ Etapa 3: Endpoints de Autenticação
- [x] POST /api/register - Cadastro com hashing bcrypt
- [x] POST /api/login - Login com geração JWT
- [x] GET /api/profile - Perfil do usuário autenticado
- [x] GET /api/dashboard - Dashboard protegido

### ✅ Etapa 4: Middleware de Segurança
- [x] Middleware `auth` para validação de token
- [x] Middleware `checkRole` para autorização por papel
- [x] Proteção CORS configurada

### ✅ Etapa 5: Frontend React
- [x] AuthContext para gerenciamento de estado
- [x] Login e Register components
- [x] Protected Route component

### ✅ Etapa 6: Formulários
- [x] Formulário de registro com validação
- [x] Formulário de login com feedback de erro
- [x] Comunicação com API via axios/fetch

### ✅ Etapa 7: Roteamento Protegido
- [x] React Router configurado
- [x] Redirecionamento baseado em role
- [x] Proteção de rotas por papel

### ✅ Etapa 8: Dashboards
- [x] Dashboard Patient
- [x] Dashboard Doctor
- [x] Dashboard Secretary
- [x] Dashboard Admin
- [x] Botão de logout em todos

### 🔄 Etapa 9: Testes (Em Andamento)
- [ ] Testes de registro e login
- [ ] Testes de proteção de rotas
- [ ] Testes de autorização por role

### 🚀 Etapa 10: Integrações Externas (Planejado)
- [ ] Stripe para pagamentos
- [ ] ChatGPT para assistente virtual
- [ ] SMTP para envio de emails
- [ ] Notificações em tempo real

---

## 🚀 Início Rápido

### 1. Configurar Banco de Dados MySQL

#### Via phpMyAdmin (Recomendado)
1. Acesse: https://auth-db1438.hstgr.io/
2. Login: u980794834
3. Selecione banco: `u980794834_C7ojC`
4. Vá na aba "SQL"
5. Execute o arquivo `database-schema.sql`

```sql
-- Verificar se criou corretamente
SHOW TABLES;
SELECT * FROM users;
```

### 2. Configurar Backend

```bash
cd backend
npm install
```

Copie `.env.example` para `.env` e configure:
```env
DB_PASSWORD=sua_senha_mysql
JWT_SECRET=sua_chave_secreta_aqui
```

Inicie o servidor:
```bash
npm run dev
```

Servidor rodando em: `http://localhost:3001`

### 3. Configurar Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend rodando em: `http://localhost:5173`

---

## 📊 Estrutura do Banco de Dados

### Tabela: users
```sql
- id (PK)
- username (UNIQUE)
- email (UNIQUE)
- password_hash
- role (patient, secretary, doctor, admin)
- status (active, inactive, suspended)
- created_at
- updated_at
- last_login
```

### Tabela: patients (1:1 com users)
```sql
- id (PK)
- user_id (FK -> users.id)
- patient_number
- first_name, last_name
- date_of_birth
- gender, blood_type
- phone, emergency_contact
- address, city, state
- allergies, chronic_conditions
```

### Tabela: doctors (1:1 com users)
```sql
- id (PK)
- user_id (FK -> users.id)
- license_number (CRM)
- specialization
- qualification
- consultation_fee
- bio
```

### Tabela: appointments
```sql
- id (PK)
- patient_id (FK)
- doctor_id (FK)
- appointment_date, appointment_time
- status (scheduled, confirmed, completed, cancelled)
- reason_for_visit
- notes
```

---

## 🔐 Segurança Implementada

### Autenticação JWT
- Token expira em 24h (configurável)
- Armazenado em localStorage
- Enviado em header: `Authorization: Bearer <token>`

### Hashing de Senhas
- bcrypt com 10 rounds
- Nunca armazenamos senha em texto plano
- Hash verificado no login

### Proteção de Rotas
- Middleware `auth` valida token em rotas protegidas
- Middleware `checkRole` verifica permissões
- CORS restrito a origem configurada

### Audit Logs
- Tabela `audit_logs` registra todas ações
- Rastreamento de IP e user agent
- Histórico de mudanças (old_values, new_values)

---

## 📡 Endpoints da API

### Autenticação

#### POST /api/register
```json
{
  "username": "joao",
  "email": "joao@example.com",
  "password": "senha123",
  "role": "patient"
}
```

#### POST /api/login
```json
{
  "username": "joao",
  "password": "senha123"
}
```

Resposta:
```json
{
  "token": "eyJhbG...",
  "role": "patient",
  "user": { "id": 1, "username": "joao", "email": "joao@example.com" }
}
```

#### GET /api/profile
Header: `Authorization: Bearer <token>`

#### GET /api/dashboard
Header: `Authorization: Bearer <token>`

### Admin

#### GET /api/users
Admin only - Lista todos usuários

#### PUT /api/users/:id/role
Admin only - Atualiza role de usuário

#### GET /api/admin-only
Admin only - Rota de exemplo

---

## 🎨 Componentes Frontend

### AuthContext
Gerencia estado global de autenticação:
- `token` - JWT token
- `role` - Papel do usuário
- `user` - Dados do usuário
- `login()` - Função de login
- `logout()` - Função de logout
- `isAuthenticated()` - Verifica se está logado
- `hasRole()` - Verifica papel específico

### ProtectedRoute
Componente HOC para proteger rotas:
```jsx
<ProtectedRoute allowedRoles={['admin']}>
  <AdminDashboard />
</ProtectedRoute>
```

### Login Component
- Formulário de login
- Validação de campos
- Feedback de erros
- Redirecionamento por role

### Register Component
- Formulário de cadastro
- Seleção de role
- Validação de senha
- Confirmação de sucesso

---

## 🔄 Fluxo de Autenticação

1. **Usuário acessa /login**
2. **Preenche username e password**
3. **Frontend envia POST /api/login**
4. **Backend:**
   - Busca usuário no banco
   - Verifica password com bcrypt
   - Gera JWT token
   - Retorna token + role
5. **Frontend:**
   - Armazena token em localStorage
   - Atualiza AuthContext
   - Redireciona para dashboard específico
6. **Requisições subsequentes:**
   - Token enviado em header
   - Backend valida com middleware `auth`
   - Retorna dados protegidos

---

## 🧪 Como Testar

### 1. Testar Registro
```bash
curl -X POST http://localhost:3001/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_patient",
    "email": "patient@test.com",
    "password": "Test123!",
    "role": "patient"
  }'
```

### 2. Testar Login
```bash
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_patient",
    "password": "Test123!"
  }'
```

### 3. Testar Rota Protegida
```bash
TOKEN="seu_token_aqui"
curl http://localhost:3001/api/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Testar Admin Route
```bash
# Login como admin primeiro
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin@123"
  }'

# Usar token admin
curl http://localhost:3001/api/users \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

---

## 🚀 Integrações Futuras

### 1. Stripe (Pagamentos)
```javascript
// Backend endpoint
app.post('/api/create-payment-intent', auth, async (req, res) => {
  const { amount } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // em centavos
    currency: 'brl',
  });
  res.json({ clientSecret: paymentIntent.client_secret });
});
```

### 2. ChatGPT (Assistente Virtual)
```javascript
// Backend endpoint
app.post('/api/chat', auth, async (req, res) => {
  const { message } = req.body;
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: message }],
  });
  res.json({ response: completion.data.choices[0].message.content });
});
```

### 3. SMTP (Envio de Emails)
```javascript
// Backend email service
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Enviar email de confirmação
await transporter.sendMail({
  from: process.env.SMTP_FROM,
  to: user.email,
  subject: 'Bem-vindo ao Portal Clinic',
  html: '<h1>Sua conta foi criada com sucesso!</h1>'
});
```

---

## 📝 Próximos Passos

1. **Implementar testes automatizados**
   - Jest para backend
   - React Testing Library para frontend

2. **Adicionar módulo de agendamentos**
   - CRUD de appointments
   - Calendário interativo
   - Notificações de lembretes

3. **Implementar módulo de prontuários**
   - Medical records CRUD
   - Upload de documentos
   - Histórico médico

4. **Adicionar módulo financeiro**
   - Invoices e payments
   - Integração Stripe
   - Relatórios financeiros

5. **Implementar chat em tempo real**
   - Socket.io para mensagens
   - ChatGPT para bot assistente
   - Histórico de conversas

---

## 🐛 Troubleshooting

### Erro: Cannot connect to MySQL
- Verifique credenciais no `.env`
- Confirme que MySQL está rodando
- Teste conexão: `mysql -u u980794834 -p`

### Erro: JWT Invalid
- Token pode ter expirado (24h)
- Faça login novamente
- Verifique JWT_SECRET no backend

### Erro: CORS
- Verifique CORS_ORIGIN no `.env`
- Deve corresponder ao URL do frontend
- Em produção, use domínio real

### Erro: 403 Forbidden
- Usuário não tem permissão para rota
- Verifique role do usuário
- Admin routes exigem role 'admin'

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte este guia
2. Veja logs do servidor
3. Verifique console do navegador
4. Entre em contato com a equipe

**Versão:** 1.0.0  
**Última Atualização:** 21/11/2024

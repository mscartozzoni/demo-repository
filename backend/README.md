# Portal Clinic Backend - MySQL Version

Backend API para o Portal Clinic usando Node.js, Express e MySQL.

## 📋 Requisitos

- Node.js 16+
- MySQL 5.7+ ou 8.0+
- npm ou yarn

## 🚀 Instalação

### 1. Instalar Dependências

```bash
cd backend
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# MySQL Database Configuration (Hostinger)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=u980794834_C7ojC
DB_USER=u980794834
DB_PASSWORD=sua_senha_aqui

# JWT Configuration
JWT_SECRET=sua_chave_secreta_jwt_aqui
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### 3. Configurar Banco de Dados MySQL

#### Via phpMyAdmin (Recomendado)

1. Acesse seu phpMyAdmin: https://auth-db1438.hstgr.io/
2. Faça login com suas credenciais
3. Selecione o banco `u980794834_C7ojC`
4. Clique na aba "SQL"
5. Abra o arquivo `database-schema.sql`
6. Copie todo o conteúdo
7. Cole no phpMyAdmin e clique em "Executar"

#### Via MySQL CLI

```bash
mysql -u u980794834 -p u980794834_C7ojC < database-schema.sql
```

### 4. Iniciar o Servidor

```bash
# Modo desenvolvimento (com auto-reload)
npm run dev

# Modo produção
npm start
```

## 📚 Estrutura do Projeto

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Configuração do MySQL
│   ├── models/
│   │   └── User.js              # Model de usuário
│   ├── routes/
│   │   └── auth.js              # Rotas de autenticação
│   ├── middleware/
│   │   └── auth.js              # Middleware de autenticação
│   └── server.js                # Servidor Express
├── tests/                       # Testes
├── database-schema.sql          # Schema do banco de dados
├── .env.example                 # Exemplo de variáveis de ambiente
├── package.json
└── README.md
```

## 🔌 Endpoints da API

### Autenticação

#### POST /api/register
Registrar novo usuário

**Body:**
```json
{
  "username": "joao",
  "email": "joao@example.com",
  "password": "senha123",
  "role": "patient"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "joao",
    "email": "joao@example.com",
    "role": "patient"
  }
}
```

#### POST /api/login
Fazer login

**Body:**
```json
{
  "username": "joao",
  "password": "senha123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "patient",
  "user": {
    "id": 1,
    "username": "joao",
    "email": "joao@example.com",
    "role": "patient"
  }
}
```

#### GET /api/profile
Obter perfil do usuário (requer autenticação)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "username": "joao",
    "email": "joao@example.com",
    "role": "patient",
    "status": "active",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /api/dashboard
Acessar dashboard (requer autenticação)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Welcome to patient dashboard",
  "user": {
    "id": 1,
    "username": "joao",
    "role": "patient"
  }
}
```

### Rotas Admin

#### GET /api/users
Listar todos os usuários (somente admin)

**Headers:**
```
Authorization: Bearer <token>
```

#### PUT /api/users/:id/role
Atualizar role de usuário (somente admin)

**Body:**
```json
{
  "role": "doctor"
}
```

#### GET /api/admin-only
Rota de exemplo somente para admin

## 👥 Roles (Papéis)

- **patient**: Paciente
- **secretary**: Secretária/Recepcionista
- **doctor**: Médico
- **admin**: Administrador do sistema

## 🔐 Usuário Padrão

Um usuário admin é criado automaticamente:

```
Username: admin
Email: admin@portal-clinic.com
Password: Admin@123
Role: admin
```

**⚠️ IMPORTANTE**: Altere esta senha imediatamente em produção!

## 🧪 Testes

```bash
# Rodar todos os testes
npm test

# Rodar testes em modo watch
npm run test:watch
```

## 📊 Schema do Banco de Dados

### Tabelas Principais

1. **users** - Usuários do sistema (autenticação)
2. **patients** - Informações detalhadas de pacientes
3. **doctors** - Informações de médicos
4. **staff** - Funcionários (secretária, etc)
5. **appointments** - Agendamentos de consultas
6. **medical_records** - Prontuários médicos
7. **audit_logs** - Log de auditoria

### Relacionamentos

- `users` 1:1 `patients` (um usuário paciente tem detalhes estendidos)
- `users` 1:1 `doctors` (um usuário médico tem detalhes profissionais)
- `patients` 1:N `appointments` (paciente pode ter vários agendamentos)
- `doctors` 1:N `appointments` (médico pode ter vários agendamentos)
- `appointments` 1:1 `medical_records` (cada consulta pode gerar um prontuário)

## 🔒 Segurança

- Senhas são hasheadas com bcrypt (10 rounds)
- JWT para autenticação stateless
- CORS configurável por ambiente
- Proteção de rotas com middleware de autenticação
- Role-based access control (RBAC)
- Audit logs para rastreabilidade

## 🐛 Troubleshooting

### Erro: "Cannot connect to MySQL"
- Verifique as credenciais no `.env`
- Confirme que o MySQL está rodando
- Verifique se o banco de dados existe

### Erro: "Table doesn't exist"
- Execute o arquivo `database-schema.sql` no phpMyAdmin
- Verifique se está usando o banco correto

### Erro: "Invalid token"
- O token JWT pode ter expirado
- Faça login novamente para obter novo token
- Verifique se o JWT_SECRET está correto

## 📝 Logs

O servidor loga todas as requisições:
```
2024-01-01T12:00:00.000Z - POST /api/login
2024-01-01T12:00:01.000Z - GET /api/dashboard
```

## 🚢 Deploy

Ver arquivo `DEPLOY-FTP-GUIDE.md` no diretório raiz para instruções de deploy no Hostinger.

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.

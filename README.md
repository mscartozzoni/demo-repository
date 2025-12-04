# Portal Clinic - Unified Ecosystem

Ecossistema unificado de aplicações do Portal Clinic consolidado em monorepo.

## 🏗️ Estrutura

```
Portal-Clinic-Unified/
├── apps/
│   ├── bot/           # Portal-Clinic-Bot (Backend + Frontend)
│   ├── api/           # Portal-Api (API Central)
│   ├── medico/        # Portal-Medico (Área Médica)
│   ├── paciente/      # Portal-Paciente (Área do Paciente)
│   ├── financeiro/    # Portal-Financeiro
│   └── orcamento/     # Portal-Orcamento
├── shared/            # Código compartilhado (utils, types, etc.)
├── deploy/            # Scripts de deployment
└── docs/              # Documentação

```

## 📦 Aplicações

### 1. Bot (Backend + Frontend)
- **Domínio**: `app.portal-clinic.com.br`
- **Backend Port**: 8000
- **Frontend Port**: 5173

### 2. API Central
- **Domínio**: `api.portal-clinic.com.br`
- **Port**: 3001

### 3. Portal Médico
- **Domínio**: `medico.portal-clinic.com.br`
- **Port**: 3002

### 4. Portal Paciente
- **Domínio**: `paciente.portal-clinic.com.br`
- **Port**: 3003

### 5. Portal Financeiro
- **Domínio**: `financeiro.marcioplasticsurgery.com`
- **Port**: 3004

### 6. Portal Orçamento
- **Domínio**: `orcamento.portal-clinic.com.br`
- **Port**: 3005

## 🚀 Quick Start

### Instalação
```bash
npm run install:all
```

### Build de todas as aplicações
```bash
npm run build:all
```

### Build individual
```bash
npm run build:bot
npm run build:api
npm run build:medico
npm run build:paciente
npm run build:financeiro
npm run build:orcamento
```

### Deploy para VPS
```bash
npm run deploy:vps
```

## 🌐 VPS Info

- **IP**: 82.29.56.143
- **User**: root
- **SSH**: Configurado via ~/.ssh/id_ed25519

## 📋 Variáveis de Ambiente

Cada aplicação possui seu próprio `.env` file em `apps/[app-name]/.env`

Principais variáveis:
- Supabase (URL, Keys)
- OpenAI API Key
- Google APIs
- FTP Credentials
- Domain configurations

## 🔧 Tecnologias

- **Frontend**: React 18 + Vite
- **Backend**: Node.js 20 + Express
- **Database**: Supabase (PostgreSQL)
- **Deployment**: PM2 + Nginx
- **Monorepo**: npm workspaces

## 📝 Deployment Flow

1. Build todas as aplicações: `npm run build:all`
2. Deploy automático via script: `npm run deploy:vps`
3. Nginx reverse proxy configurado no VPS
4. PM2 gerencia processos Node.js
5. SSL/TLS via Let's Encrypt

## 🔒 Segurança

- SSH key authentication
- Firewall (UFW) configurado
- SSL/TLS em todos os domínios
- Rate limiting configurado
- CORS policies aplicadas

## 📚 Documentação

Ver pasta `/docs` para documentação detalhada de cada aplicação.

---

**Última atualização**: 2025-11-20
**Versão**: 1.0.0

# Portal Clinic - Plano de Deployment Unificado

## 🎯 Objetivo
Consolidar todas as aplicações Portal em um ecossistema unificado no VPS.

## 📦 Aplicações Identificadas

### 1. Portal-Api (API Central)
- **Localização**: `/Users/marcioscartozzoni/Downloads/Portal-Api-38325f55-8074-4477-941b-770c4b661777`
- **Tipo**: Frontend React (Vite)
- **Porta sugerida**: 3001
- **Domínio sugerido**: `api.portal-clinic.com.br`

### 2. Portal-Medico (Área Médica)
- **Localização**: `/Users/marcioscartozzoni/Downloads/Portal-Medico39a7f0d8-ec20-48ff-a6d8-8134b005225f`
- **Tipo**: Frontend React (Vite) + Supabase
- **Porta sugerida**: 3002
- **Domínio sugerido**: `medico.portal-clinic.com.br`

### 3. Portal-Paciente (Área do Paciente)
- **Localização**: `/Users/marcioscartozzoni/Downloads/Portal-Paciente-a08ef2bf-27f1-42ac-af5a-ab368c23e153`
- **Tipo**: Frontend React (Vite)
- **Porta sugerida**: 3003
- **Domínio atual**: `paciente.portal-clinic.com.br`

### 4. Portal-Financeiro
- **Localização**: `/Users/marcioscartozzoni/Downloads/Portal-Financeiro-547f3fdb-e880-4a16-9016-49dd1ae25608`
- **Tipo**: Frontend React (Vite)
- **Porta sugerida**: 3004
- **Domínio atual**: `financeiro.marcioplasticsurgery.com`

### 5. Portal-Orcamento
- **Localização**: `/Users/marcioscartozzoni/Downloads/Portal-Orcamento-cc24dc13-621f-458b-ac99-3e880bab10b0`
- **Tipo**: Frontend React (Vite) + Stripe
- **Porta sugerida**: 3005
- **Domínio sugerido**: `orcamento.portal-clinic.com.br`

### 6. Portal-Clinic-Bot (Bot + Backend)
- **Localização**: `/Users/marcioscartozzoni/Downloads/Portal-Clinic-Bot`
- **Tipo**: Frontend React + Backend Node.js
- **Porta Backend**: 8000
- **Porta Frontend**: 5173
- **Domínio sugerido**: `portal-clinic.com.br` ou `app.portal-clinic.com.br`

## 🌐 Domínios em Uso

1. `portal-clinic.site`
2. `portal-clinic.shop`
3. `portal-clinic.com.br`
4. `financeiro.marcioplasticsurgery.com`
5. `paciente.portal-clinic.com.br`
6. `ai.marcioplasticsurgery.com`
7. `marcioplasticsurgery.com`

## 🖥️ Infraestrutura

### VPS Principal
- **IP**: 82.29.56.143
- **OS**: Ubuntu 24.04 LTS
- **RAM**: 8GB
- **Disk**: 96GB (10% usado)
- **Software Instalado**: Node.js 20.19.5, PM2 6.0.13, Nginx 1.24.0

### FTP Atual (Migração)
- **IP**: 82.25.67.187
- **Hosts**: 
  - `u980794834.marcioplasticsurgery.com`
  - `u980794834.app.portal-clinic.com.br`

## 📋 Credenciais Necessárias

Para completar o deployment, precisamos:

### FTP (Para migração de dados existentes)
- [ ] Usuário FTP
- [ ] Senha FTP
- [ ] Porta FTP (padrão: 21)

### DNS/Domínios
- [ ] Painel de controle DNS (Cloudflare, GoDaddy, etc.)
- [ ] Credenciais de acesso ao painel
- [ ] Ou: Instruções para apontar os domínios para o VPS 82.29.56.143

### Banco de Dados
- [x] Supabase URL: `https://gnawourfpbsqernpucso.supabase.co`
- [x] Supabase Service Key: Configurado no .env
- [ ] Outros bancos de dados? (MySQL, PostgreSQL local?)

### APIs Externas
- [x] OpenAI API Key
- [x] Google Sheets API
- [x] Stripe Keys
- [ ] WhatsApp API?
- [ ] Outras integrações?

## 🚀 Estratégia de Deployment

### Fase 1: Preparação do VPS ✅
- [x] Instalar Node.js
- [x] Instalar PM2
- [x] Instalar Nginx
- [x] Criar estrutura de diretórios

### Fase 2: Consolidação de Código
- [ ] Criar monorepo unificado
- [ ] Consolidar dependências compartilhadas
- [ ] Unificar configurações de build
- [ ] Criar scripts de deployment

### Fase 3: Configuração Nginx
- [ ] Configurar reverse proxy para cada aplicação
- [ ] Configurar SSL/TLS (Let's Encrypt)
- [ ] Configurar redirects e rewrites
- [ ] Otimizar cache e compressão

### Fase 4: Deploy das Aplicações
- [ ] Build de produção de cada app
- [ ] Upload via rsync/scp
- [ ] Configurar PM2 para backend
- [ ] Servir frontends com Nginx

### Fase 5: Configuração DNS
- [ ] Apontar domínios para VPS (82.29.56.143)
- [ ] Configurar registros A/CNAME
- [ ] Configurar SSL para todos os domínios

### Fase 6: Testes e Validação
- [ ] Testar cada aplicação
- [ ] Verificar comunicação entre módulos
- [ ] Testar integrações (Supabase, APIs)
- [ ] Monitorar logs e performance

## 📁 Estrutura Proposta no VPS

```
/var/www/
├── portal-clinic-bot/
│   ├── frontend/          # Build do Portal-Clinic-Bot
│   └── backend/           # Node.js API + Bot
├── portal-api/            # Build do Portal-Api
├── portal-medico/         # Build do Portal-Medico
├── portal-paciente/       # Build do Portal-Paciente
├── portal-financeiro/     # Build do Portal-Financeiro
└── portal-orcamento/      # Build do Portal-Orcamento
```

## 🔒 Segurança

- [ ] Configurar firewall (UFW)
- [ ] Configurar fail2ban
- [ ] Configurar backups automáticos
- [ ] Implementar rate limiting
- [ ] Configurar CORS adequadamente
- [ ] Implementar CSP headers
- [ ] Configurar HSTS

## 📊 Monitoramento

- [ ] Configurar PM2 monitoring
- [ ] Configurar logs centralizados
- [ ] Configurar alertas de downtime
- [ ] Configurar métricas de performance

## 🔄 CI/CD (Futuro)

- [ ] Configurar GitHub Actions
- [ ] Automatizar builds
- [ ] Automatizar deployments
- [ ] Configurar rollback automático

## 📝 Próximos Passos Imediatos

1. **Obter credenciais faltantes** (FTP, DNS)
2. **Criar monorepo unificado**
3. **Configurar Nginx com todos os domínios**
4. **Fazer build de produção de todas as apps**
5. **Deploy e testes**

---

**Data de criação**: 2025-11-20
**Responsável**: Márcio Scartozzoni
**Status**: 🟡 Em Planejamento

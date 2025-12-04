# ✅ Checklist de Deploy - Portal Clinic

## 📋 Antes de Começar

- [ ] FileZilla instalado
- [ ] Credenciais FTP prontas (u980794834 / Portal-clinic-25)
- [ ] Builds criados (✅ FEITO)

## 🚀 Deploy via FTP

### 1. Bot (Chatbot) - app.portal-clinic.com.br
- [ ] Conectar no FTP (sftp://82.25.67.187:22)
- [ ] Navegar até `/domains/app.portal-clinic.com.br/public_html/`
- [ ] Deletar tudo em public_html
- [ ] Arrastar conteúdo de `apps/bot/dist/` para public_html
- [ ] Testar: https://app.portal-clinic.com.br

### 2. API (Backend) - api.portal-clinic.com.br
- [ ] Navegar até `/domains/api.portal-clinic.com.br/public_html/`
- [ ] Deletar tudo em public_html
- [ ] Arrastar conteúdo de `apps/api/dist/` para public_html
- [ ] Criar arquivo `.env` via FTP
- [ ] Configurar Node.js no painel Hostinger
- [ ] Executar `npm install` via painel
- [ ] Restart da aplicação
- [ ] Testar: https://api.portal-clinic.com.br

### 3. Portal Paciente - paciente.portal-clinic.com.br
- [ ] Navegar até `/domains/paciente.portal-clinic.com.br/public_html/`
- [ ] Deletar tudo em public_html
- [ ] Arrastar conteúdo de `apps/paciente/dist/` para public_html
- [ ] Testar: https://paciente.portal-clinic.com.br

### 4. Portal Médico - medico.portal-clinic.com.br
- [ ] Navegar até `/domains/medico.portal-clinic.com.br/public_html/`
- [ ] Deletar tudo em public_html
- [ ] Arrastar conteúdo de `apps/medico/dist/` para public_html
- [ ] Testar: https://medico.portal-clinic.com.br

### 5. Portal Financeiro - financeiro.marcioplasticsurgery.com
- [ ] Navegar até `/domains/financeiro.marcioplasticsurgery.com/public_html/`
- [ ] Deletar tudo em public_html
- [ ] Arrastar conteúdo de `apps/financeiro/dist/` para public_html
- [ ] Testar: https://financeiro.marcioplasticsurgery.com

### 6. Portal Orçamento - orcamento.portal-clinic.com.br
- [ ] Navegar até `/domains/orcamento.portal-clinic.com.br/public_html/`
- [ ] Deletar tudo em public_html
- [ ] Arrastar conteúdo de `apps/orcamento/dist/` para public_html
- [ ] Testar: https://orcamento.portal-clinic.com.br

## 🗄️ Banco de Dados

- [ ] Acessar phpMyAdmin: https://auth-db1438.hstgr.io/
- [ ] Login: u980794834 / Portal-clinic-25
- [ ] Criar/verificar tabelas necessárias

## 🔐 Segurança

- [ ] SSL ativo em todos os domínios
- [ ] Variáveis de ambiente (.env) configuradas
- [ ] Backups dos arquivos locais

## 📊 Status Geral

**Tempo estimado:** 30 minutos
**Aplicações:** 6 totais
**Prioridade:** Bot → API → Paciente → Médico → Financeiro → Orçamento

---

**Próximo passo:** Abra o FileZilla e comece pelo Bot!

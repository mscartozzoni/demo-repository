# 🔐 Credenciais Necessárias para Deployment

## Status Atual: Aguardando Informações

Para completar o deployment unificado das aplicações Portal Clinic no VPS, precisamos das seguintes credenciais:

---

## 1. 🌐 FTP (Servidor Atual - Migração)

**Servidor**: `ftp://82.25.67.187`

### Informações Necessárias:
```
Usuário FTP: _______________________________
Senha FTP: _________________________________
Porta: _____________________ (padrão: 21)
```

### Hosts configurados neste FTP:
- `u980794834.marcioplasticsurgery.com`
- `u980794834.app.portal-clinic.com.br`

**Objetivo**: Fazer backup e migrar arquivos/dados existentes para o novo VPS.

---

## 2. 🌍 DNS / Gerenciamento de Domínios

### Provedor DNS Atual:
```
Provedor: _________________________________ (Ex: Cloudflare, GoDaddy, Hostinger, etc.)
URL do Painel: ____________________________
Usuário/Email: ____________________________
Senha: ____________________________________
```

### Domínios a Configurar:

#### Domínio Principal:
```
□ portal-clinic.site
□ portal-clinic.shop
□ portal-clinic.com.br
```

#### Subdomínios Específicos:
```
□ financeiro.marcioplasticsurgery.com
□ paciente.portal-clinic.com.br
□ ai.marcioplasticsurgery.com
□ medico.portal-clinic.com.br (novo)
□ api.portal-clinic.com.br (novo)
□ orcamento.portal-clinic.com.br (novo)
□ app.portal-clinic.com.br (novo)
```

**Ação Necessária**: Apontar todos os domínios para o VPS IP: `82.29.56.143`

---

## 3. 🗄️ Banco de Dados

### Supabase (✅ Configurado)
```
✅ URL: https://gnawourfpbsqernpucso.supabase.co
✅ Anon Key: Configurado no .env
✅ Service Key: Configurado no .env
```

### Banco de Dados Local/Adicional (se existir)
```
Tipo: __________________ (MySQL, PostgreSQL, MongoDB, etc.)
Host: __________________
Porta: _________________
Nome do Banco: _________
Usuário: _______________
Senha: _________________
```

---

## 4. 🔑 APIs e Integrações

### OpenAI (✅ Configurado)
```
✅ API Key: sk-proj-JIgvJ... (configurado no .env)
✅ Model: gpt-4o-mini
```

### Google APIs (✅ Configurado)
```
✅ Service Account Email: app-login@carbon-gecko-470807-b0.iam.gserviceaccount.com
✅ Private Key: Configurado no .env
✅ Sheet ID: Configurado
```

### Stripe (❓ Verificar)
```
Publishable Key: ____________________________
Secret Key: _________________________________
Webhook Secret: _____________________________
```

### WhatsApp API (❓ Necessário?)
```
Provider: _________________ (Twilio, Meta, etc.)
API Token: _________________________________
Phone Number ID: ___________________________
```

### SMTP/Email (✅ Configurado)
```
✅ Host: smtp.hostinger.com
✅ Port: 587
✅ User: contato@marcioplasticsurgery.com
❓ Password: Verificar se está atualizado
```

### Outras Integrações:
```
Nome da API: _______________________________
Credencial 1: ______________________________
Credencial 2: ______________________________
```

---

## 5. 🔐 VPS Access (✅ Configurado)

### SSH
```
✅ Host: 82.29.56.143
✅ User: root
✅ Password: Portal-Clinic-25
✅ SSH Key: Configurado (~/.ssh/id_ed25519)
```

---

## 6. 📱 Serviços de Terceiros

### Whereby (Videochamadas) (❓ Verificar)
```
API Key: ___________________________________
Room Prefix: consulta-
```

### Certificado SSL
```
Método preferido:
□ Let's Encrypt (Gratuito, recomendado)
□ Cloudflare SSL
□ Certificado Próprio
```

---

## 7. 🔒 Segurança Adicional

### Firewall/Proteção
```
□ Cloudflare ativo? (Sim/Não)
   - Email: _________________________________
   - API Key: _______________________________

□ Outros serviços de proteção?
   - Nome: __________________________________
   - Credenciais: ___________________________
```

---

## 📋 Checklist de Verificação

Antes do deployment, confirme:

- [ ] Todas as credenciais FTP foram fornecidas
- [ ] Acesso ao painel DNS confirmado
- [ ] Todas as API keys estão válidas e ativas
- [ ] Credenciais de banco de dados testadas
- [ ] Backup dos dados atuais realizado
- [ ] Domínios prontos para apontamento
- [ ] SSL/TLS planejado (Let's Encrypt)

---

## 📝 Notas Importantes

1. **Backup**: Antes de qualquer migração, faremos backup completo dos dados do FTP atual
2. **DNS Propagation**: Após apontar domínios, pode levar 24-48h para propagação global
3. **Downtime**: Planejar janela de manutenção para migração
4. **Testes**: Usar subdomínio de teste antes de produção final

---

## 🚨 SEGURANÇA

⚠️ **NUNCA compartilhe este arquivo em repositórios públicos**
⚠️ **Use gerenciador de senhas** (1Password, Bitwarden, LastPass)
⚠️ **Ative 2FA** em todos os serviços quando possível

---

**Última atualização**: 2025-11-20
**Status**: 🟡 Aguardando preenchimento

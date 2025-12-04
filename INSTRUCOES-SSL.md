# 🔐 Instruções para Instalação de SSL/TLS

## ⚠️ PRÉ-REQUISITOS IMPORTANTES

Antes de executar o script de instalação SSL, **CERTIFIQUE-SE** de que:

### 1. DNS Configurado e Propagado ✅

Todos os domínios devem estar apontando para o VPS `82.29.56.143`:

```
api.portal-clinic.com.br           → 82.29.56.143
medico.portal-clinic.com.br        → 82.29.56.143
paciente.portal-clinic.com.br      → 82.29.56.143
financeiro.marcioplasticsurgery.com → 82.29.56.143
orcamento.portal-clinic.com.br     → 82.29.56.143
app.portal-clinic.com.br           → 82.29.56.143
portal-clinic.com.br               → 82.29.56.143
www.portal-clinic.com.br           → 82.29.56.143
```

### 2. Como Configurar DNS no Hostinger

1. Acesse: https://hpanel.hostinger.com
2. Vá em **Domínios** → Selecione o domínio
3. Vá em **DNS / Name Servers**
4. Adicione/Edite os registros:

```
Tipo: A
Nome: @
Valor: 82.29.56.143
TTL: 3600

Tipo: A
Nome: www
Valor: 82.29.56.143
TTL: 3600

Tipo: A
Nome: api
Valor: 82.29.56.143
TTL: 3600

Tipo: A
Nome: medico
Valor: 82.29.56.143
TTL: 3600

Tipo: A
Nome: paciente
Valor: 82.29.56.143
TTL: 3600

Tipo: A
Nome: orcamento
Valor: 82.29.56.143
TTL: 3600

Tipo: A
Nome: app
Valor: 82.29.56.143
TTL: 3600

# Para financeiro.marcioplasticsurgery.com
Tipo: A
Nome: financeiro
Valor: 82.29.56.143
TTL: 3600
```

### 3. Verificar Propagação DNS

Antes de instalar SSL, verifique se os domínios estão resolvendo corretamente:

```bash
# Testar resolução DNS
nslookup api.portal-clinic.com.br
nslookup medico.portal-clinic.com.br
nslookup paciente.portal-clinic.com.br
nslookup financeiro.marcioplasticsurgery.com
nslookup orcamento.portal-clinic.com.br
nslookup app.portal-clinic.com.br
nslookup portal-clinic.com.br

# Ou usar dig
dig +short api.portal-clinic.com.br
dig +short medico.portal-clinic.com.br
```

**Todos devem retornar: `82.29.56.143`**

### 4. Testar Acesso HTTP

Verifique se os sites estão acessíveis via HTTP antes de instalar SSL:

```bash
curl -I http://api.portal-clinic.com.br
curl -I http://medico.portal-clinic.com.br
curl -I http://paciente.portal-clinic.com.br
# etc...
```

**Todos devem retornar status 200 ou 301/302**

---

## 🚀 Instalação do SSL

### Passo 1: Aguardar Propagação DNS

⏰ **Tempo de propagação:** 1-48 horas (geralmente 1-6 horas)

Você pode verificar em: https://dnschecker.org

### Passo 2: Executar Script de Instalação

Quando todos os domínios estiverem resolvendo corretamente:

```bash
cd /Users/marcioscartozzoni/Downloads/Portal-Clinic-Unified/deploy
./install-ssl.sh
```

### Passo 3: Aguardar Conclusão

O script irá:
- ✅ Instalar Certbot
- ✅ Obter certificados para todos os domínios
- ✅ Configurar HTTPS no Nginx
- ✅ Configurar redirecionamento HTTP → HTTPS
- ✅ Habilitar HSTS (HTTP Strict Transport Security)
- ✅ Configurar renovação automática

**Tempo estimado:** 5-10 minutos

---

## 🔍 Verificação

### Verificar Certificados

```bash
./check-ssl.sh
```

### Testar HTTPS

```bash
# Testar redirecionamento HTTP → HTTPS
curl -I http://portal-clinic.com.br

# Testar HTTPS
curl -I https://portal-clinic.com.br
```

### Verificar Segurança

Teste a qualidade do SSL em:
- https://www.ssllabs.com/ssltest/

**Objetivo:** Obter nota **A** ou **A+**

---

## 🔄 Manutenção

### Renovação Automática

✅ **Já configurado automaticamente!**

O Certbot renova certificados automaticamente a cada 60 dias.

### Renovação Manual (se necessário)

```bash
./renew-ssl.sh
```

### Verificar Status da Renovação

```bash
./check-ssl.sh
```

---

## ❓ Troubleshooting

### Erro: "Domain not resolving"

**Causa:** DNS não propagado ou mal configurado

**Solução:**
1. Verificar configuração DNS no painel Hostinger
2. Aguardar propagação (até 48h)
3. Testar com `nslookup` ou `dig`

### Erro: "Connection refused"

**Causa:** Firewall bloqueando porta 80/443

**Solução:**
```bash
ssh root@82.29.56.143 "ufw allow 'Nginx Full' && ufw status"
```

### Erro: "Rate limit exceeded"

**Causa:** Muitas tentativas de emissão de certificado

**Solução:**
- Aguardar 1 hora
- Let's Encrypt tem limite de 5 certificados por domínio por semana
- Usar `--dry-run` para testar sem consumir limites

### Certificado não renovando automaticamente

**Verificar:**
```bash
ssh root@82.29.56.143 "systemctl status certbot.timer"
```

**Reativar se necessário:**
```bash
ssh root@82.29.56.143 "systemctl enable certbot.timer && systemctl start certbot.timer"
```

---

## 📝 Notas Importantes

1. **Certificados válidos por 90 dias**
   - Renovação automática ocorre a cada 60 dias
   - 30 dias de margem de segurança

2. **HSTS habilitado**
   - Força navegadores a sempre usar HTTPS
   - Melhora segurança significativamente

3. **OCSP Stapling**
   - Melhora performance
   - Reduz latência de verificação de certificado

4. **Redirecionamento automático**
   - HTTP → HTTPS
   - www → não-www (ou vice-versa, conforme configurado)

5. **Email de notificação**
   - Certbot envia emails para: `contato@marcioplasticsurgery.com`
   - Avisos sobre expiração de certificados
   - Problemas com renovação automática

---

## ✅ Checklist Final

Após instalação do SSL, verificar:

- [ ] Todos os domínios acessíveis via HTTPS
- [ ] Redirecionamento HTTP → HTTPS funcionando
- [ ] Certificados válidos (verde no navegador)
- [ ] Sem avisos de segurança
- [ ] Teste SSLLabs com nota A ou A+
- [ ] Renovação automática configurada
- [ ] Timer do Certbot ativo

---

## 🆘 Suporte

Se encontrar problemas:

1. Verificar logs do Certbot:
```bash
ssh root@82.29.56.143 "cat /var/log/letsencrypt/letsencrypt.log"
```

2. Verificar logs do Nginx:
```bash
ssh root@82.29.56.143 "tail -50 /var/log/nginx/error.log"
```

3. Testar configuração Nginx:
```bash
ssh root@82.29.56.143 "nginx -t"
```

---

**Data:** 2025-11-20  
**Versão:** 1.0  
**Responsável:** Deployment Team

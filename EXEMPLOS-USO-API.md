# 
## 
### Endpoint
```
POST https://portal-clinic.com.br/api/webhook
```

### Exemplo: Formulrio de Contato
```bash
curl -X POST https://portal-clinic.com.br/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "message",
    "channel": "web",
    "contact": {
#      "name": "Jo
o Silva",
      "phone": "+5511999999999",
      "email": "joao@email.com"
    },
    "message": {
      "text": "Gostaria de agendar uma consulta de rinoplastia",
      "timestamp": "2025-11-20T10:30:00Z",
      "metadata": {
        "source": "website_form",
        "page": "/agendamento",
        "utm_source": "google"
      }
    },
    "webhook_secret": "portal_clinic_webhook_2025_secure_token"
  }'
```

### Resposta
```json
{
  "success": true,
  "message_id": "msg_123abc",
  "conversation_id": "conv_456def",
  "contact_id": "contact_789ghi",
  "ai_analysis": {
    "summary": "Paciente interessado em rinoplastia",
    "sentiment": "positivo",
    "priority": "normal",
    "action": "schedule_appointment"
  },
  "timestamp": "2025-11-20T10:30:01Z"
}
```

---

## 
### Endpoint
```
POST https://portal-clinic.com.br/api/send-email
```

#### Exemplo: Confirma
o de Agendamento
```bash
curl -X POST https://portal-clinic.com.br/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "paciente@email.com",
    "template": "confirmacao_agendamento",
    "data": {
      "paciente_nome": "Maria Silva",
      "data": "25/11/2025",
      "horario": "14:30",
      "medico_nome": "Carlos Eduardo",
      "endereco": "Av. Paulista, 1000",
      "confirmacao_link": "https://portal-clinic.com.br/confirmar/abc123"
    }
  }'
```

### Resposta
```json
{
  "success": true,
  "messageId": "<abc123@smtp.hostinger.com>",
  "timestamp": "2025-11-20T10:31:00Z"
}
```

---

## 
### Endpoint
```
POST https://portal-clinic.com.br/api/send-sms
```

### Exemplo: Lembrete 24h antes
```bash
curl -X POST https://portal-clinic.com.br/api/send-sms \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+5511999999999",
    "template": "lembrete_24h",
    "data": {
      "horario": "14:30",
      "endereco": "Av. Paulista, 1000"
    }
  }'
```

### Resposta
```json
{
  "success": true,
  "sid": "SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "status": "queued",
  "timestamp": "2025-11-20T10:32:00Z"
}
```

---

## 
### Endpoint
```
POST https://portal-clinic.com.br/api/send-whatsapp
```

#### Exemplo: Confirma
o de Agendamento
```bash
curl -X POST https://portal-clinic.com.br/api/send-whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+5511999999999",
    "template": "confirmacao_agendamento",
    "data": {
      "paciente_nome": "Maria Silva",
      "data": "25/11/2025",
      "horario": "14:30",
      "medico": "Carlos Eduardo",
      "endereco": "Av. Paulista, 1000",
      "link": "https://portal-clinic.com.br/confirmar/abc123"
    }
  }'
```

### Resposta
```json
{
  "success": true,
  "sid": "SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "status": "queued",
  "timestamp": "2025-11-20T10:33:00Z"
}
```

---

## 
### Endpoint
```
POST https://portal-clinic.com.br/api/send-multi
```

### Exemplo: Lembrete por Email, SMS e WhatsApp
```bash
curl -X POST https://portal-clinic.com.br/api/send-multi \
  -H "Content-Type: application/json" \
  -d '{
    "channels": ["email", "sms", "whatsapp"],
    "to": {
      "email": "paciente@email.com",
      "phone": "+5511999999999"
    },
    "template": "lembrete_consulta",
    "data": {
      "paciente_nome": "Maria Silva",
#      "data": "Amanh
",
      "horario": "14:30",
      "endereco": "Av. Paulista, 1000"
    }
  }'
```

### Resposta
```json
{
  "success": true,
  "results": {
    "email": {
      "success": true,
      "messageId": "<abc123@smtp.hostinger.com>"
    },
    "sms": {
      "success": true,
      "sid": "SMxxxxxxxx"
    },
    "whatsapp": {
      "success": true,
      "sid": "SMxxxxxxxx"
    }
  },
  "timestamp": "2025-11-20T10:34:00Z"
}
```

---

## 
### 1. Testar Webhook
```bash
ssh root@82.29.56.143
curl -X POST http://localhost:8000/api/webhook \
  -H "Content-Type: application/json" \
  -d @- << EOF
{
  "type": "message",
  "channel": "web",
  "contact": {
    "name": "Teste Usuario",
    "phone": "+5511999999999",
    "email": "teste@email.com"
  },
  "message": {
    "text": "Teste de mensagem via webhook"
  },
  "webhook_secret": "portal_clinic_webhook_2025_secure_token"
}
EOF
```

### 2. Testar Email
```bash
curl -X POST http://localhost:8000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "seu-email@gmail.com",
    "subject": "Teste Portal Clinic",
    "html": "<h1>Email de Teste</h1><p>Funcionando!</p>"
  }'
```

### 3. Ver Logs
```bash
pm2 logs portal-bot --lines 50
```

---

## 
### Email:
- `confirmacao_agendamento`
- `lembrete_consulta`
- `confirmacao_recebimento`
- `pesquisa_satisfacao`

### SMS:
- `confirmacao_agendamento`
- `lembrete_24h`
- `lembrete_1h`
- `confirmacao_presenca`
- `cancelamento`
- `reagendamento`
- `codigo_verificacao`
- `urgente`

### WhatsApp:
- `confirmacao_agendamento`
- `lembrete`
- `pesquisa`

---

## 
### Validar Webhook Secret
Sempre inclua o `webhook_secret` nas requisieeeees para o webhook.

```javascript
// No seu sistema externo (formulrio, chatbot, etc)
const webhookSecret = "portal_clinic_webhook_2025_secure_token";

fetch("https://portal-clinic.com.br/api/webhook", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    ...dadosMensagem,
    webhook_secret: webhookSecret
  })
});
```

---

**Criado:** 2025-11-20  
#**Vers
o:** 1.0

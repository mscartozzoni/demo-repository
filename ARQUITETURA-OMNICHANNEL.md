# 🌐 Arquitetura Omnichannel - Portal Clinic

**Objetivo:** Sistema integrado de comunicação com pacientes via múltiplos canais

---

## 📋 Visão Geral

### Canais de Comunicação:
1. **Webhook** → Recebe mensagens de sistemas externos
2. **Chat Web** → Interface no site/portal
3. **Email** → Hostinger SMTP + Recebimento
4. **SMS** → Envio de notificações
5. **WhatsApp** → Chatbot integrado

---

## 🏗️ Arquitetura Proposta

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  Chat    │  │  Email   │  │ Notifs   │              │
│  │  Widget  │  │  Form    │  │  Panel   │              │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘              │
└───────┼─────────────┼─────────────┼────────────────────┘
        │             │             │
        ▼             ▼             ▼
┌─────────────────────────────────────────────────────────┐
│              BACKEND API (Node.js/Express)               │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Webhook Receiver  │  Message Router              │  │
│  │  /api/webhook      │  /api/send-message          │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Channel Handlers                                 │  │
│  │  • ChatHandler      • EmailHandler               │  │
│  │  • SMSHandler       • WhatsAppHandler            │  │
│  └──────────────────────────────────────────────────┘  │
└───────────┬─────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────┐
│                  SUPABASE (Database)                     │
│  • messages          • conversations                     │
│  • contacts          • message_logs                      │
│  • webhooks_config   • channel_settings                  │
└─────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────┐
│               EXTERNAL SERVICES                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Hostinger│  │ Twilio   │  │ WhatsApp │             │
│  │   SMTP   │  │   SMS    │  │ Business │             │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────┘
```

---

## 1️⃣ WEBHOOK - Receber Mensagens

### Endpoint: `POST /api/webhook`

**Função:** Receber dados de sistemas externos (formulários, chatbots, APIs)

**Payload JSON esperado:**
```json
{
  "type": "message",
  "channel": "whatsapp|email|sms|web",
  "contact": {
    "name": "João Silva",
    "phone": "+5511999999999",
    "email": "joao@email.com",
    "cpf": "123.456.789-00"
  },
  "message": {
    "text": "Gostaria de agendar uma consulta",
    "timestamp": "2025-11-20T03:00:00Z",
    "metadata": {
      "source": "website_form",
      "page": "/agendamento",
      "utm_source": "google"
    }
  },
  "webhook_secret": "SEU_TOKEN_SECRETO"
}
```

**Implementação:**
```javascript
// backend/routes.js
router.post("/webhook", async (req, res) => {
  try {
    const { type, channel, contact, message, webhook_secret } = req.body;
    
    // 1. Validar secret
    if (webhook_secret !== process.env.WEBHOOK_SECRET) {
      return res.status(401).json({ error: "Invalid webhook secret" });
    }
    
    // 2. Validar dados obrigatórios
    if (!contact || !message || !message.text) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    // 3. Buscar ou criar contato
    let { data: existingContact } = await supabase
      .from('contacts')
      .select('*')
      .or(`phone.eq.${contact.phone},email.eq.${contact.email}`)
      .single();
    
    if (!existingContact) {
      const { data: newContact } = await supabase
        .from('contacts')
        .insert({
          name: contact.name,
          phone: contact.phone,
          email: contact.email,
          cpf: contact.cpf,
          source: channel
        })
        .select()
        .single();
      
      existingContact = newContact;
    }
    
    // 4. Criar conversa se não existir
    let { data: conversation } = await supabase
      .from('conversations')
      .select('*')
      .eq('contact_id', existingContact.id)
      .eq('status', 'active')
      .single();
    
    if (!conversation) {
      const { data: newConversation } = await supabase
        .from('conversations')
        .insert({
          contact_id: existingContact.id,
          channel: channel,
          status: 'active'
        })
        .select()
        .single();
      
      conversation = newConversation;
    }
    
    // 5. Salvar mensagem
    const { data: savedMessage } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        contact_id: existingContact.id,
        channel: channel,
        direction: 'inbound',
        text: message.text,
        metadata: message.metadata
      })
      .select()
      .single();
    
    // 6. Processar com IA (opcional)
    let aiAnalysis = null;
    if (process.env.ENABLE_AI_ANALYSIS === 'true') {
      aiAnalysis = await analyzeMessageWithAI(message.text, contact.name);
    }
    
    // 7. Disparar ações automáticas
    await triggerAutomations(savedMessage, aiAnalysis);
    
    // 8. Notificar atendentes (WebSocket, email, etc)
    await notifyAgents(savedMessage);
    
    res.status(200).json({
      success: true,
      message_id: savedMessage.id,
      conversation_id: conversation.id,
      ai_analysis: aiAnalysis
    });
    
  } catch (error) {
    console.error("Erro no webhook:", error);
    res.status(500).json({ error: error.message });
  }
});
```

---

## 2️⃣ EMAIL - Integração Hostinger

### Configuração SMTP

**Credenciais Hostinger:**
```env
# backend/.env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=contato@marcioplasticsurgery.com
SMTP_PASSWORD=sua_senha_aqui
SMTP_FROM=Portal Clinic <contato@marcioplasticsurgery.com>

# Emails da clínica
EMAIL_MEDICO=medico@marcioplasticsurgery.com
EMAIL_FINANCEIRO=financeiro@marcioplasticsurgery.com
EMAIL_SUPORTE=suporte@portal-clinic.com.br
```

**Implementação com Nodemailer:**
```javascript
// backend/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

// Enviar email
async function sendEmail({ to, subject, html, text }) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
      text
    });
    
    console.log('Email enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return { success: false, error: error.message };
  }
}

// Templates
const templates = {
  confirmacao_agendamento: (data) => `
    <h2>Consulta Agendada!</h2>
    <p>Olá ${data.paciente_nome},</p>
    <p>Sua consulta foi agendada com sucesso!</p>
    <p><strong>Data:</strong> ${data.data}</p>
    <p><strong>Horário:</strong> ${data.horario}</p>
    <p><strong>Médico:</strong> Dr. ${data.medico_nome}</p>
    <br>
    <p>Atenciosamente,<br>Equipe Portal Clinic</p>
  `,
  
  lembrete_consulta: (data) => `
    <h2>Lembrete de Consulta</h2>
    <p>Olá ${data.paciente_nome},</p>
    <p>Lembramos que sua consulta está agendada para:</p>
    <p><strong>${data.data} às ${data.horario}</strong></p>
    <p>Local: ${data.endereco}</p>
    <p>Por favor, chegue com 15 minutos de antecedência.</p>
  `
};

module.exports = { sendEmail, templates };
```

**Endpoint para enviar email:**
```javascript
router.post("/send-email", async (req, res) => {
  const { to, template, data } = req.body;
  
  const html = templates[template](data);
  const subject = getSubjectForTemplate(template);
  
  const result = await sendEmail({ to, subject, html });
  res.json(result);
});
```

---

## 3️⃣ SMS - Integração Twilio

**Provedor recomendado:** Twilio (mais confiável no Brasil)

**Configuração:**
```env
TWILIO_ACCOUNT_SID=ACxxxx...
TWILIO_AUTH_TOKEN=xxxxx...
TWILIO_PHONE_NUMBER=+551133334444
```

**Instalação:**
```bash
npm install twilio
```

**Implementação:**
```javascript
// backend/smsService.js
const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendSMS(to, message) {
  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to // Formato: +5511999999999
    });
    
    console.log('SMS enviado:', result.sid);
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('Erro ao enviar SMS:', error);
    return { success: false, error: error.message };
  }
}

// Templates SMS
const smsTemplates = {
  confirmacao: (data) => 
    `Portal Clinic: Sua consulta com Dr. ${data.medico} foi agendada para ${data.data} às ${data.horario}. Confirme em: ${data.link}`,
  
  lembrete: (data) =>
    `Lembrete: Consulta hoje às ${data.horario} no Portal Clinic. Local: ${data.endereco}`,
  
  confirmacao_presenca: (data) =>
    `Sua presença foi confirmada! Consulta ${data.data} às ${data.horario}. Até lá!`
};

module.exports = { sendSMS, smsTemplates };
```

**Custos Twilio Brasil:**
- SMS enviado: ~R$0.15-0.25 cada
- Número virtual: ~R$5/mês
- WhatsApp: Variável por conversa

---

## 4️⃣ WHATSAPP - Integração Business API

### Opções de Integração:

#### Opção A: Twilio WhatsApp (Mais fácil)
```javascript
// Mesmo client Twilio
await client.messages.create({
  body: 'Sua consulta foi agendada!',
  from: 'whatsapp:+14155238886', // Número Twilio WhatsApp
  to: 'whatsapp:+5511999999999'
});
```

**Prós:**
- ✅ Fácil de configurar
- ✅ Mesma conta Twilio
- ✅ API simples

**Contras:**
- ❌ Número Twilio (não é seu)
- ❌ Limitações de uso

#### Opção B: WhatsApp Business API (Oficial)
```javascript
// Requer aprovação Facebook/Meta
const axios = require('axios');

async function sendWhatsApp(to, message) {
  const response = await axios.post(
    `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: 'whatsapp',
      to: to,
      type: 'text',
      text: { body: message }
    },
    {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  return response.data;
}
```

**Prós:**
- ✅ Seu próprio número
- ✅ Marca verificada
- ✅ Recursos avançados (botões, listas, etc)

**Contras:**
- ❌ Processo de aprovação Meta
- ❌ Requer Facebook Business Manager
- ❌ Mais complexo de configurar

#### Opção C: Baileys (Não oficial - NÃO RECOMENDADO PRODUÇÃO)
```javascript
// Usa WhatsApp Web - VIOLA TOS
// Pode resultar em banimento
// Apenas para testes/desenvolvimento
```

**Recomendação:** Começar com Twilio WhatsApp, migrar para oficial quando escalar.

---

## 5️⃣ INTERFACE DE CHAT - Ferramenta no VPS

### Opções de Ferramentas:

#### 1. **Chatwoot** (RECOMENDADO)
**Grátis, Open Source, Moderno**

**Instalação:**
```bash
# No VPS
cd /opt
wget https://get.chatwoot.app/linux/install.sh
chmod +x install.sh
sudo ./install.sh --install
```

**Configuração:**
- URL: https://chat.portal-clinic.com.br
- Integra com: Email, WhatsApp, SMS, Web Widget
- Suporta: Múltiplos agentes, departamentos, relatórios

**Recursos:**
- ✅ Interface moderna
- ✅ Mobile app
- ✅ Bot builder
- ✅ Integrações nativas
- ✅ Relatórios avançados

#### 2. **Rocket.Chat**
**Alternativa robusta**

```bash
docker run -d --name rocketchat \
  -p 3000:3000 \
  -e ROOT_URL=https://chat.portal-clinic.com.br \
  rocket.chat:latest
```

#### 3. **Mattermost**
**Similar ao Slack**

```bash
docker run -d --name mattermost \
  -p 8065:8065 \
  mattermost/mattermost-team-edition
```

**Comparação:**

| Feature | Chatwoot | Rocket.Chat | Mattermost |
|---------|----------|-------------|------------|
| Omnichannel | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| Facilidade | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| WhatsApp | ✅ Nativo | 🔌 Plugin | ❌ Não |
| Email | ✅ | ✅ | ✅ |
| Bot Builder | ✅ | ✅ | ❌ |

**Recomendação:** **Chatwoot** - Melhor para atendimento ao cliente/paciente

---

## 6️⃣ FLUXO COMPLETO DE COMUNICAÇÃO

### Cenário: Paciente solicita agendamento

```
1. ENTRADA (Webhook)
   • Paciente preenche formulário no site
   • POST /api/webhook com dados do paciente
   
2. PROCESSAMENTO
   • Salvar no Supabase (contacts + messages)
   • Análise com IA (intenção, urgência)
   • Criar conversa no Chatwoot
   
3. NOTIFICAÇÃO ATENDENTE
   • Push notification no Chatwoot
   • Email para equipe médica
   • SMS para médico de plantão (se urgente)
   
4. RESPOSTA AUTOMÁTICA
   • Email confirmação recebimento
   • SMS com link para acompanhar
   • WhatsApp com menu de opções
   
5. AGENDAMENTO
   • Atendente agenda consulta
   • Sistema envia:
     - Email confirmação com anexo
     - SMS lembrete 24h antes
     - WhatsApp lembrete 1h antes
     
6. PÓS-CONSULTA
   • Email com resumo
   • Link pesquisa satisfação
   • Sugestão próxima consulta
```

---

## 🔧 IMPLEMENTAÇÃO PASSO A PASSO

### Fase 1: Fundação (1-2 dias)
1. ✅ Criar endpoints webhook
2. ✅ Configurar email (Nodemailer + Hostinger)
3. ✅ Estrutura banco de dados (Supabase)
4. ✅ Logs e monitoramento

### Fase 2: Canais Básicos (2-3 dias)
5. ⏳ Instalar Chatwoot
6. ⏳ Integrar email com Chatwoot
7. ⏳ Widget de chat no site
8. ⏳ Testar fluxo completo

### Fase 3: SMS (1 dia)
9. ⏳ Configurar Twilio
10. ⏳ Implementar envio SMS
11. ⏳ Templates e automações

### Fase 4: WhatsApp (2-3 dias)
12. ⏳ Configurar Twilio WhatsApp (rápido)
13. ⏳ Ou WhatsApp Business API (demorado)
14. ⏳ Bot flow básico
15. ⏳ Integrações

### Fase 5: Automações (ongoing)
16. ⏳ Regras de roteamento
17. ⏳ Respostas automáticas
18. ⏳ Lembretes agendados
19. ⏳ Relatórios

---

## 📊 CUSTOS ESTIMADOS

### Mensal:
- **Email (Hostinger):** Incluído no plano de domínio
- **Chatwoot:** Grátis (self-hosted)
- **Twilio SMS:** R$0.20/SMS × volume
- **Twilio WhatsApp:** R$0.03-0.10/mensagem
- **VPS:** Já existente (sem custo adicional)

**Estimativa para 1000 pacientes/mês:**
- 500 SMS: ~R$100
- 2000 WhatsApp: ~R$60-200
- Emails: Ilimitado (já pago)
- **Total:** R$160-300/mês

---

## 🚀 PRÓXIMOS PASSOS RECOMENDADOS

### Imediato:
1. **Instalar Chatwoot no VPS**
2. **Configurar email (Nodemailer)**
3. **Criar endpoint webhook funcional**
4. **Testar fluxo básico**

### Quer que eu:**
- 🔨 Crie os scripts de instalação do Chatwoot?
- 📧 Configure o serviço de email completo?
- 🔌 Implemente os endpoints webhook?
- 📱 Integre SMS/WhatsApp?

**Próxima ação:** Escolha o que quer implementar primeiro!

---

**Criado:** 2025-11-20  
**Versão:** 1.0  
**Status:** Arquitetura completa documentada

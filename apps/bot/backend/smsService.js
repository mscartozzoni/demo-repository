// SMS Service - Portal Clinic
// Integração com Twilio

// Instalação: npm install twilio

let twilioClient = null;

// Inicializar Twilio
function initTwilio() {
  if (twilioClient) return twilioClient;
  
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.warn('⚠️ Credenciais Twilio não configuradas');
    return null;
  }
  
  try {
    const twilio = require('twilio');
    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    console.log('✅ Twilio inicializado');
    return twilioClient;
  } catch (error) {
    console.error('❌ Erro ao inicializar Twilio:', error);
    return null;
  }
}

// Enviar SMS
async function sendSMS(to, message) {
  const client = initTwilio();
  
  if (!client) {
    return {
      success: false,
      error: 'Twilio não configurado',
      timestamp: new Date().toISOString()
    };
  }
  
  try {
    // Validar formato do número
    if (!to.startsWith('+')) {
      to = '+55' + to.replace(/\D/g, ''); // Adicionar +55 se não tiver
    }
    
    console.log('📱 Enviando SMS para:', to);
    
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });
    
    console.log('✅ SMS enviado:', result.sid);
    
    return { 
      success: true, 
      sid: result.sid,
      status: result.status,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Erro ao enviar SMS:', error);
    return { 
      success: false, 
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString()
    };
  }
}

// Templates SMS (máximo 160 caracteres recomendado)
const smsTemplates = {
  confirmacao_agendamento: (data) => 
    `Portal Clinic: Consulta agendada! ${data.data} às ${data.horario} com Dr. ${data.medico}. Confirme: ${data.link}`,
  
  lembrete_24h: (data) =>
    `Lembrete: Consulta amanhã às ${data.horario} no Portal Clinic. Local: ${data.endereco}`,
  
  lembrete_1h: (data) =>
    `Sua consulta é daqui 1h (${data.horario}) no Portal Clinic. Até já!`,
  
  confirmacao_presenca: (data) =>
    `Presença confirmada! Consulta ${data.data} às ${data.horario}. Obrigado!`,
  
  cancelamento: (data) =>
    `Consulta cancelada com sucesso. Para reagendar: ${data.link} ou ligue ${data.telefone}`,
  
  reagendamento: (data) =>
    `Consulta reagendada! Nova data: ${data.data} às ${data.horario}. Confirme: ${data.link}`,
  
  codigo_verificacao: (data) =>
    `Portal Clinic - Seu código de verificação: ${data.codigo}. Válido por ${data.validade || '10'} minutos.`,
  
  urgente: (data) =>
    `URGENTE: ${data.mensagem}. Ligue ${data.telefone || '(11) 9999-9999'}`
};

// Enviar SMS usando template
async function sendTemplateSMS(to, templateName, data) {
  if (!smsTemplates[templateName]) {
    throw new Error(`Template SMS '${templateName}' não encontrado`);
  }
  
  const message = smsTemplates[templateName](data);
  return await sendSMS(to, message);
}

// Enviar SMS em lote
async function sendBulkSMS(recipients) {
  const results = [];
  
  for (const recipient of recipients) {
    const result = await sendSMS(recipient.to, recipient.message);
    results.push({
      to: recipient.to,
      ...result
    });
    
    // Delay entre envios para não sobrecarregar
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return results;
}

// WhatsApp (via Twilio)
async function sendWhatsApp(to, message) {
  const client = initTwilio();
  
  if (!client) {
    return {
      success: false,
      error: 'Twilio não configurado',
      timestamp: new Date().toISOString()
    };
  }
  
  try {
    // Formato WhatsApp: whatsapp:+5511999999999
    if (!to.startsWith('whatsapp:')) {
      if (!to.startsWith('+')) {
        to = '+55' + to.replace(/\D/g, '');
      }
      to = 'whatsapp:' + to;
    }
    
    console.log('💬 Enviando WhatsApp para:', to);
    
    const result = await client.messages.create({
      body: message,
      from: 'whatsapp:' + process.env.TWILIO_WHATSAPP_NUMBER,
      to: to
    });
    
    console.log('✅ WhatsApp enviado:', result.sid);
    
    return { 
      success: true, 
      sid: result.sid,
      status: result.status,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Erro ao enviar WhatsApp:', error);
    return { 
      success: false, 
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString()
    };
  }
}

// Templates WhatsApp (podem ser mais longos)
const whatsappTemplates = {
  confirmacao_agendamento: (data) => `
🏥 *Portal Clinic*

✅ *Consulta Agendada!*

Olá ${data.paciente_nome}!

📅 *Data:* ${data.data}
🕐 *Horário:* ${data.horario}
👨‍⚕️ *Médico:* Dr. ${data.medico}
📍 *Local:* ${data.endereco || 'Portal Clinic'}

⚠️ Chegue 15min antes
📋 Traga documentos e exames

Confirme sua presença: ${data.link}
`,
  
  lembrete: (data) => `
⏰ *Lembrete - Portal Clinic*

Olá ${data.paciente_nome}!

Sua consulta é *amanhã* às *${data.horario}*

📍 ${data.endereco || 'Portal Clinic'}

Nos vemos em breve! 👋
`,
  
  pesquisa: (data) => `
💭 *Como foi sua consulta?*

Olá ${data.paciente_nome}!

Avalie sua experiência: ${data.link}

Sua opinião é importante! ⭐
`
};

// Enviar WhatsApp usando template
async function sendTemplateWhatsApp(to, templateName, data) {
  if (!whatsappTemplates[templateName]) {
    throw new Error(`Template WhatsApp '${templateName}' não encontrado`);
  }
  
  const message = whatsappTemplates[templateName](data);
  return await sendWhatsApp(to, message);
}

module.exports = { 
  sendSMS, 
  sendTemplateSMS,
  sendBulkSMS,
  sendWhatsApp,
  sendTemplateWhatsApp,
  smsTemplates,
  whatsappTemplates
};

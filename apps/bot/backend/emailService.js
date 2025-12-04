// Email Service - Portal Clinic
// Integração com Hostinger SMTP

const nodemailer = require('nodemailer');

// Configurar transporter
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.SMTP_PORT) || 465,
  secure: true, // SSL
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verificar conexão
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Erro na configuração SMTP:', error);
  } else {
    console.log('✅ Servidor SMTP pronto para enviar emails');
  }
});

// Função principal para enviar email
async function sendEmail({ to, subject, html, text, attachments = [] }) {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'Portal Clinic <contato@marcioplasticsurgery.com>',
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Fallback text
      attachments
    };
    
    console.log('📧 Enviando email para:', to);
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email enviado:', info.messageId);
    return { 
      success: true, 
      messageId: info.messageId,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return { 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

// Templates de email
const templates = {
  // Confirmação de agendamento
  confirmacao_agendamento: (data) => ({
    subject: 'Consulta Agendada - Portal Clinic',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #667eea; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Consulta Agendada!</h1>
          </div>
          <div class="content">
            <p>Olá <strong>${data.paciente_nome}</strong>,</p>
            <p>Sua consulta foi agendada com sucesso!</p>
            
            <div class="info-box">
              <p><strong>📅 Data:</strong> ${data.data}</p>
              <p><strong>🕐 Horário:</strong> ${data.horario}</p>
              <p><strong>👨‍⚕️ Médico:</strong> Dr. ${data.medico_nome}</p>
              <p><strong>📍 Local:</strong> ${data.endereco || 'Portal Clinic'}</p>
            </div>
            
            <p><strong>⚠️ Importante:</strong></p>
            <ul>
              <li>Chegue com 15 minutos de antecedência</li>
              <li>Traga documentos e exames anteriores</li>
              <li>Em caso de imprevisto, reagende com antecedência</li>
            </ul>
            
            <center>
              <a href="${data.confirmacao_link || '#'}" class="button">Confirmar Presença</a>
            </center>
            
            <div class="footer">
              <p>Atenciosamente,<br><strong>Equipe Portal Clinic</strong></p>
              <p>📞 ${data.telefone || '(11) 9999-9999'} | 📧 contato@marcioplasticsurgery.com</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }),
  
  // Lembrete de consulta
  lembrete_consulta: (data) => ({
    subject: '⏰ Lembrete: Consulta Amanhã - Portal Clinic',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .alert-box { background: #fff3cd; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #ffc107; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Lembrete de Consulta</h1>
          </div>
          <div class="content">
            <p>Olá <strong>${data.paciente_nome}</strong>,</p>
            
            <div class="alert-box">
              <h2 style="margin-top:0;">Sua consulta é amanhã!</h2>
              <p><strong>📅 ${data.data} às ${data.horario}</strong></p>
              <p><strong>👨‍⚕️ Dr. ${data.medico_nome}</strong></p>
              <p><strong>📍 ${data.endereco || 'Portal Clinic'}</strong></p>
            </div>
            
            <p><strong>📋 Checklist:</strong></p>
            <ul>
              <li>✅ Documentos (RG, CPF, Carteirinha)</li>
              <li>✅ Exames anteriores</li>
              <li>✅ Lista de medicamentos em uso</li>
            </ul>
            
            <p>Nos vemos em breve!</p>
            
            <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
              <p>Atenciosamente,<br><strong>Equipe Portal Clinic</strong></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }),
  
  // Confirmação de recebimento
  confirmacao_recebimento: (data) => ({
    subject: 'Mensagem Recebida - Portal Clinic',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; border-radius: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>✅ Mensagem Recebida</h2>
          <p>Olá <strong>${data.nome}</strong>,</p>
          <p>Recebemos sua mensagem e nossa equipe irá respondê-la em breve!</p>
          <p><strong>Sua mensagem:</strong><br>"${data.mensagem}"</p>
          <p>Tempo médio de resposta: <strong>até 2 horas úteis</strong></p>
          <hr>
          <p style="color: #666; font-size: 14px;">Equipe Portal Clinic</p>
        </div>
      </body>
      </html>
    `
  }),
  
  // Pesquisa de satisfação
  pesquisa_satisfacao: (data) => ({
    subject: 'Como foi sua experiência? - Portal Clinic',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .rating { text-align: center; margin: 30px 0; }
          .star { font-size: 40px; margin: 0 5px; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>💭 Como foi sua consulta?</h2>
          <p>Olá <strong>${data.paciente_nome}</strong>,</p>
          <p>Esperamos que sua consulta tenha sido excelente!</p>
          <p>Por favor, avalie sua experiência:</p>
          
          <div class="rating">
            <a href="${data.rating_link}/5" class="star">⭐</a>
            <a href="${data.rating_link}/4" class="star">⭐</a>
            <a href="${data.rating_link}/3" class="star">⭐</a>
            <a href="${data.rating_link}/2" class="star">⭐</a>
            <a href="${data.rating_link}/1" class="star">⭐</a>
          </div>
          
          <p style="text-align: center; color: #666;">
            Sua opinião nos ajuda a melhorar!
          </p>
        </div>
      </body>
      </html>
    `
  })
};

// Função auxiliar para obter template
function getTemplate(templateName, data) {
  if (!templates[templateName]) {
    throw new Error(`Template '${templateName}' não encontrado`);
  }
  
  return templates[templateName](data);
}

// Enviar email usando template
async function sendTemplateEmail(to, templateName, data) {
  const template = getTemplate(templateName, data);
  return await sendEmail({
    to,
    subject: template.subject,
    html: template.html
  });
}

module.exports = { 
  sendEmail, 
  sendTemplateEmail,
  templates 
};

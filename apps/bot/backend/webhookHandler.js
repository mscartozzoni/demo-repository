// Webhook Handler - Portal Clinic
// Recebe mensagens de sistemas externos e processa

const supabase = require('./supabaseClient');

// Análise com IA (importar quando implementado)
async function analyzeMessageWithAI(text, contactName) {
  // TODO: Implementar chamada para OpenAI
  return {
    summary: text.substring(0, 100),
    sentiment: 'neutral',
    priority: 'normal',
    action: 'general_info'
  };
}

// Disparar automações
async function triggerAutomations(message, aiAnalysis) {
  // TODO: Implementar regras de automação
  console.log('Automação disparada:', message.id);
  
  // Exemplo: Se urgente, notificar imediatamente
  if (aiAnalysis && aiAnalysis.priority === 'urgent') {
    // Enviar SMS para médico de plantão
    // Enviar email urgente
  }
  
  return true;
}

// Notificar atendentes
async function notifyAgents(message) {
  // TODO: Implementar notificação (WebSocket, email, etc)
  console.log('Atendentes notificados:', message.id);
  return true;
}

// Handler principal do webhook
async function handleWebhook(req, res) {
  try {
    const { type, channel, contact, message, webhook_secret } = req.body;
    
    console.log('🔔 Webhook recebido:', { type, channel, contact: contact?.name });
    
    // 1. Validar secret
    if (webhook_secret !== process.env.WEBHOOK_SECRET) {
      console.error('❌ Webhook secret inválido');
      return res.status(401).json({ error: 'Invalid webhook secret' });
    }
    
    // 2. Validar dados obrigatórios
    if (!contact || !message || !message.text) {
      console.error('❌ Dados obrigatórios faltando');
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['contact.name', 'contact.phone or contact.email', 'message.text']
      });
    }
    
    // 3. Buscar ou criar contato
    let existingContact = null;
    
    if (contact.phone || contact.email) {
      const query = supabase
        .from('contacts')
        .select('*');
      
      if (contact.phone && contact.email) {
        query.or(`phone.eq.${contact.phone},email.eq.${contact.email}`);
      } else if (contact.phone) {
        query.eq('phone', contact.phone);
      } else {
        query.eq('email', contact.email);
      }
      
      const { data } = await query.maybeSingle();
      existingContact = data;
    }
    
    if (!existingContact) {
      console.log('📝 Criando novo contato:', contact.name);
      const { data: newContact, error } = await supabase
        .from('contacts')
        .insert({
          name: contact.name,
          phone: contact.phone || null,
          email: contact.email || null,
          cpf: contact.cpf || null,
          source: channel,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        console.error('❌ Erro ao criar contato:', error);
        throw error;
      }
      
      existingContact = newContact;
    } else {
      console.log('✅ Contato existente encontrado:', existingContact.name);
    }
    
    // 4. Criar ou buscar conversa ativa
    let { data: conversation } = await supabase
      .from('conversations')
      .select('*')
      .eq('contact_id', existingContact.id)
      .eq('status', 'active')
      .maybeSingle();
    
    if (!conversation) {
      console.log('💬 Criando nova conversa');
      const { data: newConversation, error } = await supabase
        .from('conversations')
        .insert({
          contact_id: existingContact.id,
          channel: channel,
          status: 'active',
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        console.error('❌ Erro ao criar conversa:', error);
        throw error;
      }
      
      conversation = newConversation;
    }
    
    // 5. Salvar mensagem
    console.log('💾 Salvando mensagem...');
    const { data: savedMessage, error: messageError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        contact_id: existingContact.id,
        channel: channel,
        direction: 'inbound',
        text: message.text,
        metadata: message.metadata || {},
        timestamp: message.timestamp || new Date().toISOString(),
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (messageError) {
      console.error('❌ Erro ao salvar mensagem:', messageError);
      throw messageError;
    }
    
    console.log('✅ Mensagem salva:', savedMessage.id);
    
    // 6. Processar com IA (se habilitado)
    let aiAnalysis = null;
    if (process.env.ENABLE_AI_ANALYSIS === 'true') {
      console.log('🤖 Analisando com IA...');
      try {
        aiAnalysis = await analyzeMessageWithAI(message.text, contact.name);
        console.log('✅ Análise IA completa:', aiAnalysis);
      } catch (aiError) {
        console.error('⚠️ Erro na análise IA (continuando):', aiError.message);
      }
    }
    
    // 7. Disparar automações
    try {
      await triggerAutomations(savedMessage, aiAnalysis);
    } catch (autoError) {
      console.error('⚠️ Erro nas automações (continuando):', autoError.message);
    }
    
    // 8. Notificar atendentes
    try {
      await notifyAgents(savedMessage);
    } catch (notifyError) {
      console.error('⚠️ Erro ao notificar (continuando):', notifyError.message);
    }
    
    // 9. Resposta de sucesso
    const response = {
      success: true,
      message_id: savedMessage.id,
      conversation_id: conversation.id,
      contact_id: existingContact.id,
      timestamp: new Date().toISOString()
    };
    
    if (aiAnalysis) {
      response.ai_analysis = aiAnalysis;
    }
    
    console.log('✅ Webhook processado com sucesso');
    res.status(200).json(response);
    
  } catch (error) {
    console.error('❌ Erro no webhook:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = { handleWebhook };

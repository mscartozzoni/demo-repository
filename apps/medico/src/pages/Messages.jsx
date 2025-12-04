import React, { useState, useEffect, useMemo } from 'react';
    import { motion } from 'framer-motion';
    import { useToast } from '@/components/ui/use-toast';
    import { useAuth } from '@/contexts/AuthContext';
    import { getConversations } from '@/services/api/messages';
    import ConversationList from '@/components/messages/ConversationList';
    import ChatPanel from '@/components/messages/ChatPanel';
    import { ChatBubbleIcon } from '@radix-ui/react-icons';
    import InvoiceModal from '@/components/messages/InvoiceModal';

    const AI_CONVERSATION_ID = 'ai-assistant-horizons';

    const Messages = () => {
      const { toast } = useToast();
      const { user, loading: authLoading } = useAuth();
      const [conversations, setConversations] = useState([]);
      const [selectedConversation, setSelectedConversation] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [isInvoiceModalOpen, setInvoiceModalOpen] = useState(false);

      const aiConversation = useMemo(() => ({
        id: AI_CONVERSATION_ID,
        participant: {
          id: 'ai-assistant',
          name: 'Hostinger Horizons IA',
          avatar: 'https://www.hostinger.com/horizons/horizons-logo.png',
        },
        messages: [
          {
            id: 1,
            content: 'Olá! Sou sua assistente de IA. Como posso ajudar a expandir seu universo hoje? Experimente perguntar sobre como otimizar sua agenda ou gerenciar pacientes.',
            timestamp: new Date().toISOString(),
            sender_id: 'ai-assistant',
            sender_name: 'Hostinger Horizons IA'
          },
        ],
        unread: 1,
        isAi: true,
      }), []);

      useEffect(() => {
        const fetchConversations = async () => {
          setLoading(true);
          try {
            setError(null);
            const response = await getConversations(user?.id);
            const convData = response?.data || [];
            
            setConversations([aiConversation, ...convData]);
            if (!selectedConversation) {
                setSelectedConversation(aiConversation);
            }
          } catch (err) {
            setError(err.message);
            setConversations([aiConversation]);
            if (!selectedConversation) {
                setSelectedConversation(aiConversation);
            }
            toast({
              variant: "destructive",
              title: "Erro ao carregar conversas",
              description: "Exibindo apenas chat com a IA. " + (err.message || "Não foi possível buscar as mensagens."),
            });
          } finally {
            setLoading(false);
          }
        };

        if (!authLoading && user) {
          fetchConversations();
        } else if (!authLoading && !user) {
          setLoading(false);
          setError("Usuário não autenticado.");
          setConversations([aiConversation]);
          setSelectedConversation(aiConversation);
        }
      }, [user, authLoading, toast, aiConversation]);

      const handleSelectConversation = (conversation) => {
        setSelectedConversation(conversation);
        if (conversation.id !== AI_CONVERSATION_ID) {
            const updatedConversations = conversations.map(c => 
                c.id === conversation.id ? { ...c, unread: 0 } : c
            );
            setConversations(updatedConversations);
        }
      };
      
      const generateAiResponse = (userMessage) => {
        const lowerCaseMessage = userMessage.toLowerCase();
        let response = "Obrigado pela sua mensagem! Estou processando sua solicitação e em breve trarei novidades. Continue construindo seu universo! 🚀";

        if (lowerCaseMessage.includes("ajuda") || lowerCaseMessage.includes("suporte")) {
            response = "Claro! Posso ajudar com a gestão de pacientes, organização da agenda, automação de mensagens, e muito mais. O que você gostaria de explorar?";
        } else if (lowerCaseMessage.includes("agenda")) {
            response = "A sua agenda está organizada para otimizar seus compromissos. Precisa de ajuda para bloquear um horário ou adicionar um novo evento?";
        } else if (lowerCaseMessage.includes("pacientes")) {
            response = "Com o Portal Médico, a gestão de pacientes é super eficiente. Que tal adicionarmos um novo paciente ou revisarmos um prontuário existente?";
        } else if (lowerCaseMessage.includes("novo recurso") || lowerCaseMessage.includes("funcionalidade")) {
            response = "Ótima ideia! Adoraria saber qual novo recurso você tem em mente para melhorar ainda mais o seu portal. Compartilhe sua sugestão! 💡";
        } else if (lowerCaseMessage.includes("olá") || lowerCaseMessage.includes("oi")) {
            response = "Olá! É um prazer ajudar. No que posso ser útil hoje?";
        } else if (lowerCaseMessage.includes("obrigado") || lowerCaseMessage.includes("valeu")) {
            response = "De nada! Fico feliz em ajudar. Se precisar de mais alguma coisa, é só chamar! 😊";
        } else if (lowerCaseMessage.includes("análise") || lowerCaseMessage.includes("dados")) {
            response = "Nossa seção de Análises oferece insights valiosos sobre sua prática. Gostaria de ver relatórios de produtividade ou tendências de atendimento?";
        } else if (lowerCaseMessage.includes("personalizar") || lowerCaseMessage.includes("tema")) {
            response = "Você pode personalizar o tema e o estilo do cabeçalho nas configurações da sua conta, no menu superior à direita. Experimente as diferentes opções! ✨";
        }


        return response;
      };

      const handleSendMessage = (messageContent) => {
        if (!selectedConversation || !user) return;

        const newMessage = {
          id: Date.now(),
          sender_id: user.id,
          sender_name: user.full_name || 'Eu',
          content: messageContent.text,
          timestamp: new Date().toISOString(),
        };
        
        const updatedConversations = conversations.map(convo => {
            if (convo.id === selectedConversation.id) {
                const newMessages = [...(convo.messages || []), newMessage];
                const updatedConvo = { ...convo, messages: newMessages };
                setSelectedConversation(updatedConvo);
                return updatedConvo;
            }
            return convo;
        });
        setConversations(updatedConversations);

        if (selectedConversation.id === AI_CONVERSATION_ID) {
            setTimeout(() => {
                const aiResponseContent = generateAiResponse(messageContent.text);
                const aiResponse = {
                    id: Date.now() + 1,
                    content: aiResponseContent,
                    timestamp: new Date().toISOString(),
                    sender_id: 'ai-assistant',
                    sender_name: 'Hostinger Horizons IA',
                };
                
                setConversations(currentConvos => currentConvos.map(c => {
                    if(c.id === AI_CONVERSATION_ID) {
                        const newMessages = [...(c.messages || []), aiResponse];
                        const updatedConvo = {...c, messages: newMessages};
                        setSelectedConversation(updatedConvo);
                        return updatedConvo;
                    }
                    return c;
                }));
            }, 1500);
        } else {
            toast({ title: 'Mensagem enviada!', description: "A funcionalidade de envio para outros usuários ainda será implementada.", className: 'bg-green-600 text-white' });
        }
      };

      const handleGenerateInvoice = (invoiceData) => {
        console.log("Generating Invoice (mock):", invoiceData);
        toast({
            title: "Fatura Gerada com Sucesso!",
            description: "A fatura foi enviada para o paciente (simulação) e salva no sistema.",
            className: 'bg-green-600 text-white'
        });
        setInvoiceModalOpen(false);
      };

      return (
        <div className="h-[calc(100vh-4rem-1.25rem)] flex flex-col">
           {selectedConversation && selectedConversation.participant && 
            <InvoiceModal
                isOpen={isInvoiceModalOpen}
                onClose={() => setInvoiceModalOpen(false)}
                patientName={selectedConversation.participant.name}
                onGenerate={handleGenerateInvoice}
            />
           }
           <div className="flex-shrink-0 mb-6">
            <h1 className="text-3xl font-bold text-white">Caixa de Entrada Unificada</h1>
            <p className="text-slate-400 mt-2">Comunicação com pacientes e equipe, com suporte de IA para triagem.</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-effect rounded-2xl flex-grow flex overflow-hidden"
          >
            <ConversationList
              conversations={conversations}
              selectedConversation={selectedConversation}
              onSelectConversation={handleSelectConversation}
              loading={loading || authLoading}
              error={error}
            />
            {selectedConversation ? (
              <ChatPanel
                key={selectedConversation.id}
                conversation={selectedConversation}
                onSendMessage={handleSendMessage}
                onOpenInvoice={() => setInvoiceModalOpen(true)}
                currentUserId={user?.id}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <ChatBubbleIcon className="w-16 h-16 text-slate-500 mb-4" />
                <h2 className="text-xl font-semibold text-white">Selecione uma conversa</h2>
                <p className="text-slate-400">Escolha uma conversa da lista para ver as mensagens.</p>
              </div>
            )}
          </motion.div>
        </div>
      );
    };

    export default Messages;
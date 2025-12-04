import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import { useData } from '@/contexts/DataContext';
    import { useAuth } from '@/contexts/auth/AuthContext';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Avatar, AvatarFallback } from '@/components/ui/avatar';
    import { Button } from '@/components/ui/button';
    import { Textarea } from '@/components/ui/textarea';
    import { ArrowLeft, Send, Paperclip } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';

    const MessageBubble = ({ message, isFromContact }) => {
      const alignClass = isFromContact ? 'items-start' : 'items-end';
      const bubbleClass = isFromContact 
        ? 'bg-secondary rounded-br-none' 
        : 'bg-primary text-primary-foreground rounded-bl-none';

      return (
        <motion.div
          className={`flex flex-col ${alignClass} mb-4`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`flex items-end gap-2 max-w-lg ${isFromContact ? '' : 'flex-row-reverse'}`}>
            <div className={`p-3 rounded-xl ${bubbleClass}`}>
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
          <p className={`text-xs text-muted-foreground mt-1 px-2`}>
            {new Date(message.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </motion.div>
      );
    };

    const ConversationHistory = () => {
      const { contactId } = useParams();
      const navigate = useNavigate();
      const { messages, contacts, addMessage, markMessagesAsRead, loading } = useData();
      const { profile } = useAuth();
      const { toast } = useToast();
      const [newMessage, setNewMessage] = useState('');
      const messagesEndRef = useRef(null);

      const contact = useMemo(() => contacts.find(c => c.id === contactId), [contacts, contactId]);

      useEffect(() => {
        if (contactId) {
          markMessagesAsRead(contactId);
        }
      }, [contactId, markMessagesAsRead]);

      const conversationMessages = useMemo(() => {
        if (!messages) return [];
        return messages
          .filter(m => m.patient_id === contactId)
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      }, [messages, contactId]);

      const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      };

      useEffect(scrollToBottom, [conversationMessages]);

      const handleSendMessage = useCallback(() => {
        if (!newMessage.trim()) return;

        addMessage({
          patient_id: contactId,
          content: newMessage,
          type: 'communication',
          from_contact: false,
          user_id: profile.id,
        });

        setNewMessage('');
        toast({
          title: '✉️ Mensagem Enviada!',
          description: 'Sua resposta foi enviada para o paciente.',
        });
      }, [newMessage, contactId, addMessage, profile, toast]);

      const handleAttachFile = () => {
        toast({
          title: "🚧 Funcionalidade em breve",
          description: "O envio de anexos será implementado em breve. 🚀"
        });
      }

      if (loading) {
        return <div className="text-center p-10">Carregando conversa...</div>;
      }

      if (!contact) {
        return (
          <div className="text-center p-10">
            <p>Contato não encontrado.</p>
            <Button onClick={() => navigate('/')}>Voltar</Button>
          </div>
        );
      }

      return (
        <motion.div 
          className="flex flex-col h-[calc(100vh-18rem)] bg-card glass-effect-strong rounded-xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <header className="flex items-center p-4 border-b border-border">
            <Button variant="ghost" size="icon" className="mr-2" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                {contact.full_name?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <h2 className="font-semibold text-lg">{contact.full_name}</h2>
              <p className="text-sm text-muted-foreground">ID: {contact.id}</p>
            </div>
          </header>
          
          <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <AnimatePresence>
              {conversationMessages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} isFromContact={msg.from_contact} />
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </main>

          <footer className="p-4 border-t border-border bg-background/50">
            <div className="flex items-center gap-2">
              <Textarea
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="flex-1 bg-input text-foreground border-border placeholder:text-muted-foreground resize-none"
                rows={1}
              />
              <Button variant="ghost" size="icon" onClick={handleAttachFile}>
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Enviar
              </Button>
            </div>
          </footer>
        </motion.div>
      );
    };

    export default ConversationHistory;
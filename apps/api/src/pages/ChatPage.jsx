import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import ChatMessage from '@/components/chat/ChatMessage';
import VoiceControl from '@/components/chat/VoiceControl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const storedMessages = localStorage.getItem('clinic_chat_messages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    } else {
      const welcomeMessage = {
        id: '1',
        type: 'assistant',
        content: `Olá, ${user?.name}! Sou seu Assistente Clínico. Como posso ajudá-lo hoje? Posso fornecer informações sobre pacientes, agendamentos, ou sugerir campanhas de marketing.`,
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
      localStorage.setItem('clinic_chat_messages', JSON.stringify([welcomeMessage]));
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (content) => {
    if (!content.trim()) return;

    const userMessage = { id: Date.now().toString(), type: 'user', content: content, timestamp: new Date().toISOString() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const assistantResponse = generateAssistantResponse(content, updatedMessages);
      const assistantMessage = { id: (Date.now() + 1).toString(), type: 'assistant', content: assistantResponse, timestamp: new Date().toISOString() };
      
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      localStorage.setItem('clinic_chat_messages', JSON.stringify(finalMessages));
      setIsTyping(false);

      speakResponse(assistantResponse);
    }, 1500);
  };

  const generateAssistantResponse = (userInput, history) => {
    const input = userInput.toLowerCase();

    // Contextual learning simulation
    const hasTalkedAboutMarketing = history.some(m => m.content.toLowerCase().includes('marketing') || m.content.toLowerCase().includes('campanha'));
    
    if (input.includes('campanha') && hasTalkedAboutMarketing) {
        return 'Ótimo! Dando continuidade à nossa conversa sobre marketing, sugiro uma campanha de desconto em lipoaspiração para clientes fiéis que já realizaram mais de 2 procedimentos. O que acha?';
    }
    if (input.includes('paciente ana costa')) {
        return 'Ana Costa, 55 anos. Última visita em 15/10/2025. Status: follow-up para Lifting Facial. Histórico cirúrgico: Blefaroplastia (2018). Deseja ver mais detalhes?';
    }
    if (input.includes('paciente') || input.includes('consulta')) {
      return 'Encontrei 8 consultas agendadas para hoje. Gostaria de ver os detalhes de algum paciente específico, como a "Ana Costa"?';
    } else if (input.includes('marketing') || input.includes('campanha')) {
      return 'Baseado nos dados, sugiro uma campanha de check-ups pós-procedimento para pacientes que realizaram tratamentos há 3 meses. Taxa de conversão estimada: 35%.';
    } else if (input.includes('relatório') || input.includes('dados')) {
      return 'Posso gerar relatórios de: pacientes ativos, receita mensal, ou procedimentos mais realizados. Qual você prefere? Também posso exportá-lo para PDF.';
    } else if (input.includes('olá') || input.includes('oi')) {
        return `Olá, ${user?.name}! Como posso ser útil hoje?`;
    } else {
      return 'Entendi! Estou aqui para ajudar com gestão de pacientes, agendamentos, relatórios e sugestões de marketing. O que você gostaria de saber?';
    }
  };

  const speakResponse = (text) => {
    const settings = JSON.parse(localStorage.getItem('clinic_assistant_settings') || '{}');
    
    if (settings.voiceEnabled !== false && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = settings.voiceSpeed || 0.9;
      utterance.pitch = settings.voicePitch || 0.9;
      
      // Empathetic pauses
      const modifiedText = text.replace(/,/g, ',<break time="250ms"/>').replace(/\./g, '.<break time="500ms"/>');
      utterance.text = modifiedText;
      
      const voices = window.speechSynthesis.getVoices();
      const ptBrVoice = voices.find(voice => voice.lang === 'pt-BR' && voice.name.includes('Male'));
      if (ptBrVoice) {
        utterance.voice = ptBrVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceInput = (transcript) => {
    handleSendMessage(transcript);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  return (
    <>
      <Helmet>
        <title>Chat IA - Meu Assistente Clínico</title>
        <meta name="description" content="Converse com seu assistente IA por texto ou voz" />
      </Helmet>
      
      <Layout>
        <div className="h-[calc(100vh-12rem)] flex flex-col">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Assistente IA</h1>
                <p className="text-sm text-slate-600">Sempre pronto para ajudar, {user?.name}</p>
              </div>
            </div>
            <VoiceControl onVoiceInput={handleVoiceInput} />
          </motion.div>

          <div className="flex-1 glass-effect rounded-2xl p-6 overflow-y-auto space-y-4 mb-4">
            <AnimatePresence>
              {messages.map((message) => ( <ChatMessage key={message.id} message={message} /> ))}
            </AnimatePresence>
            
            {isTyping && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-slate-500">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
                <span className="text-sm">Assistente está digitando...</span>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Digite sua mensagem ou use o microfone..." className="flex-1 glass-effect border-0 focus:ring-2 focus:ring-purple-500"/>
            <Button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Layout>
    </>
  );
};

export default ChatPage;

import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, BrainCircuit, Sparkles, Send, Lightbulb, MessageSquare, PieChart, ThumbsUp, ThumbsDown, Meh, CalendarDays, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { useOpenAI } from '@/hooks/useOpenAI';
import { useData } from '@/contexts/DataContext';

const AIMessage = ({ content, isUser }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={cn("flex items-start gap-3 my-4", isUser ? "justify-end" : "justify-start")}
  >
    {!isUser && (
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
        <Bot className="w-5 h-5 text-primary" />
      </div>
    )}
    <div className={cn("max-w-md p-3 rounded-lg shadow-md", isUser ? "bg-primary text-primary-foreground" : "bg-muted")}>
      <p className="text-sm whitespace-pre-wrap">{content}</p>
    </div>
  </motion.div>
);

const AISuggestion = ({ suggestion, onApply }) => {
  const { toast } = useToast();
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="flex items-center justify-between p-3 bg-background/50 rounded-lg hover:bg-secondary transition-colors"
    >
      <div className="flex items-center gap-3">
        <Lightbulb className="h-5 w-5 text-yellow-400" />
        <p className="text-sm text-muted-foreground">{suggestion}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={() => onApply(suggestion)}>
        Aplicar
      </Button>
    </motion.div>
  );
};

const SentimentDisplay = ({ sentiment }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><PieChart className="h-5 w-5" />Análise de Sentimento</CardTitle>
            <CardDescription>Sentimento geral da conversa.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-around items-center pt-4">
             <motion.div whileHover={{scale: 1.1}} className={cn("text-center", sentiment === 'positivo' ? 'text-green-500' : 'text-muted-foreground/50')}>
                <ThumbsUp className="h-8 w-8 mx-auto" />
                <p className="text-xs mt-1">Positivo</p>
            </motion.div>
            <motion.div whileHover={{scale: 1.1}} className={cn("text-center", sentiment === 'neutro' ? 'text-gray-500' : 'text-muted-foreground/50')}>
                <Meh className="h-8 w-8 mx-auto" />
                <p className="text-xs mt-1">Neutro</p>
            </motion.div>
            <motion.div whileHover={{scale: 1.1}} className={cn("text-center", sentiment === 'negativo' ? 'text-red-500' : 'text-muted-foreground/50')}>
                <ThumbsDown className="h-8 w-8 mx-auto" />
                <p className="text-xs mt-1">Negativo</p>
            </motion.div>
        </CardContent>
    </Card>
);

const AIScreen = () => {
  const [messages, setMessages] = useState([
    { author: 'AI', content: 'Olá! Selecione uma conversa para analisar ou envie-me uma instrução.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [currentConversationId, setCurrentConversationId] = useState(null);

  const { toast } = useToast();
  const { getOpenAIResponse } = useOpenAI();
  const { conversations, contacts, messages: allMessages } = useData();

  const handleSendMessage = async () => {
    if (input.trim() === '') return;
    const userMessage = { author: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiResponseContent = await getOpenAIResponse(input);
    
    if (aiResponseContent) {
        const aiMessage = { author: 'AI', content: aiResponseContent };
        setMessages(prev => [...prev, aiMessage]);
    }
    setIsLoading(false);
  };

  const handleConversationSelect = useCallback(async (patientId) => {
    if (!patientId) {
        setCurrentAnalysis(null);
        setCurrentConversationId(null);
        return;
    }
    
    setIsLoading(true);
    setCurrentConversationId(patientId);
    setMessages([{ author: 'AI', content: `Analisando conversa...` }]);

    const patient = contacts.find(c => c.id === patientId);
    const patientMessages = allMessages.filter(m => m.patient_id === patientId).map(m => `${m.from_contact ? 'Paciente' : 'Clínica'}: ${m.content}`).join('\n');
    const prompt = `Analise a seguinte conversa com o paciente "${patient.full_name}" e forneça um resumo, análise de sentimento (positivo, negativo, neutro), uma resposta sugerida e uma próxima ação recomendada (ex: 'schedule_appointment', 'send_info', 'follow_up'). A conversa é:\n\n${patientMessages}\n\nResponda em formato JSON com as chaves: "summary", "sentiment", "suggested_reply", "action".`;
    
    const analysis = await getOpenAIResponse(prompt, true);

    if (analysis) {
        setCurrentAnalysis(analysis);
        const aiMessage = { author: 'AI', content: `Análise da conversa com ${patient.full_name}:\n\nResumo: ${analysis.summary}` };
        setMessages(prev => [...prev, aiMessage]);
    } else {
        setMessages(prev => [...prev, { author: 'AI', content: 'Não foi possível analisar a conversa.' }]);
    }
    setIsLoading(false);
  }, [contacts, allMessages, getOpenAIResponse]);

  const handleApplySuggestion = (suggestion) => {
    setInput(suggestion);
    toast({ title: "Sugestão aplicada!", description: "A sugestão foi copiada para a caixa de texto." });
  };
  
  const handleScheduleSuggestion = async () => {
    setIsLoading(true);
    const prompt = `Verifique a disponibilidade de agenda para a próxima semana (a partir de 13/11/2025), considerando horários comerciais (9h-18h) e evitando o horário de almoço (12h-13h). Retorne em formato JSON uma lista de 3 horários disponíveis na chave "available_slots" e uma sugestão de agendamento na chave "suggestion".`;
    const schedule = await getOpenAIResponse(prompt, true);

    if(schedule && schedule.available_slots) {
       const scheduleMessage = `Encontrei algumas vagas!\n\nDisponível:\n${schedule.available_slots.map(s => `- ${new Date(s).toLocaleString('pt-BR', {weekday: 'long', day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit'})}`).join('\n')}\n\nSugestão: ${schedule.suggestion}`;
       const aiMessage = { author: 'AI', content: scheduleMessage };
       setMessages(prev => [...prev, aiMessage]);
       setCurrentAnalysis(prev => ({...(prev || {}), suggested_reply: schedule.suggestion}));
    }
    setIsLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Área da IA - Gestão IA</title>
        <meta name="description" content="Centro de comando para automação e inteligência do seu sistema." />
      </Helmet>
      <div className="container mx-auto p-4 space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
            <div className="inline-block relative mb-4">
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-teal-500 rounded-full blur-xl opacity-60 animate-pulse"></div>
                <div className="relative p-4 bg-background/80 rounded-full shadow-2xl border border-border">
                    <BrainCircuit className="h-12 w-12 text-primary" />
                </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">Assistente Inteligente</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">Use o poder da OpenAI para analisar conversas, obter insights e automatizar respostas.</p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card className="glass-effect-soft">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3"><MessageSquare className="h-6 w-6 text-primary"/> Chat com IA</CardTitle>
                        <CardDescription>Faça perguntas, peça análises e simule conversas para obter insights.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-96 overflow-y-auto p-4 border rounded-md mb-4 bg-background/50">
                            <AnimatePresence>
                                {messages.map((msg, index) => (
                                    <AIMessage key={index} content={msg.content} isUser={msg.author === 'user'} />
                                ))}
                                {isLoading && <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary"/></div>}
                            </AnimatePresence>
                        </div>
                        <div className="flex items-center gap-2">
                            <Textarea 
                                placeholder="Digite sua mensagem ou instrução para a IA..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                                className="min-h-[40px] resize-none"
                            />
                            <Button onClick={handleSendMessage} disabled={isLoading}><Send className="h-4 w-4" /></Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Analisar Conversa</CardTitle>
                        <CardDescription>Selecione uma conversa para a IA analisar.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Select onValueChange={handleConversationSelect} disabled={isLoading}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione uma conversa..." />
                            </SelectTrigger>
                            <SelectContent>
                                {conversations.map(convo => {
                                    const contact = contacts.find(c => c.id === convo.patient_id);
                                    return <SelectItem key={convo.patient_id} value={convo.patient_id}>{contact?.full_name || 'Desconhecido'}</SelectItem>
                                })}
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>

                {currentAnalysis && (
                    <>
                        <SentimentDisplay sentiment={currentAnalysis.sentiment} />
                         <Card className="glass-effect-soft">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5 text-yellow-400"/> Sugestões da IA</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {currentAnalysis.suggested_reply && (
                                     <AISuggestion suggestion={currentAnalysis.suggested_reply} onApply={handleApplySuggestion} />
                                )}
                                {currentAnalysis.action === 'schedule_appointment' && (
                                     <Button variant="outline" className="w-full" onClick={handleScheduleSuggestion} disabled={isLoading}>
                                         <CalendarDays className="mr-2 h-4 w-4" /> Sugerir Horários de Agendamento
                                     </Button>
                                )}
                            </CardContent>
                        </Card>
                    </>
                )}

                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-purple-400"/> AI Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex justify-between"><span>Tempo Médio de Resposta:</span> <Badge variant="secondary">32s (-5s)</Badge></div>
                        <div className="flex justify-between"><span>Sentimento Geral (7d):</span> <Badge className="bg-green-100 text-green-800">Positivo</Badge></div>
                        <div className="flex justify-between"><span>Tópico Principal:</span> <Badge variant="outline">Agendamento</Badge></div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </>
  );
};

export default AIScreen;

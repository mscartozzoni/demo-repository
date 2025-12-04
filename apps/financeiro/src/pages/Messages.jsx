import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Bot, User, Activity, Sparkles, Loader2, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const mockThreads = [
    { ai_session_id: 'session1', patient_id: '1', patient_name: 'Ana Silva', lead_status: 'hot', last_message: 'Ok, vamos agendar a consulta então!' },
    { ai_session_id: 'session2', patient_id: '2', patient_name: 'Bruno Costa', lead_status: 'warm', last_message: 'Vou pensar sobre o orçamento e retorno.' },
    { ai_session_id: 'session3', patient_id: '3', patient_name: 'Carla Dias', lead_status: 'new', last_message: 'Olá, gostaria de mais informações.' },
];

const mockMessages = {
    'session1': [
        { id: 'm1', ai_session_id: 'session1', direction: 'incoming', content: 'Olá, recebi a estimativa. Gostaria de agendar uma consulta.' },
        { id: 'm2', ai_session_id: 'session1', direction: 'outgoing', content: 'Olá Ana! Claro, qual o melhor dia e horário para você?' },
        { id: 'm3', ai_session_id: 'session1', direction: 'incoming', content: 'Pode ser na próxima terça-feira à tarde?' },
        { id: 'm4', ai_session_id: 'session1', direction: 'outgoing', content: 'Ok, vamos agendar a consulta então!' },
    ],
    'session2': [
        { id: 'm5', ai_session_id: 'session2', direction: 'incoming', content: 'Obrigado pelo orçamento.' },
        { id: 'm6', ai_session_id: 'session2', direction: 'outgoing', content: 'Por nada, Bruno! Se tiver qualquer dúvida, estou à disposição.' },
        { id: 'm7', ai_session_id: 'session2', direction: 'incoming', content: 'Vou pensar sobre o orçamento e retorno.' },
    ],
    'session3': [
        { id: 'm8', ai_session_id: 'session3', direction: 'incoming', content: 'Olá, gostaria de mais informações.' },
    ]
};

const leadStatusConfig = {
  'new': { label: 'Novo', color: 'bg-blue-500' },
  'warm': { label: 'Morno', color: 'bg-orange-500' },
  'hot': { label: 'Quente', color: 'bg-red-500' },
  'cold': { label: 'Frio', color: 'bg-gray-500' },
  'converted': { label: 'Convertido', color: 'bg-green-500' },
  'lost': { label: 'Perdido', color: 'bg-red-500' },
  default: { label: 'Indefinido', color: 'bg-gray-400' },
};

const getInitials = (name) => {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
};

const ThreadList = ({ threads, activeThread, onSelectThread, loading }) => (
    <div className="bg-white/5 border-r border-white/10 flex flex-col h-full">
        <div className="p-4 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">Conversas</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
            {loading && <div className="p-4 text-center text-purple-300">Carregando...</div>}
            {!loading && threads.map(thread => (
                <div
                    key={thread.ai_session_id}
                    onClick={() => onSelectThread(thread)}
                    className={cn(
                        "flex items-center p-4 cursor-pointer border-l-4",
                        activeThread?.ai_session_id === thread.ai_session_id
                            ? 'bg-purple-500/20 border-purple-400'
                            : 'border-transparent hover:bg-white/10'
                    )}
                >
                    <Avatar className="h-12 w-12 mr-4">
                        <AvatarImage />
                        <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white font-bold">
                            {getInitials(thread.patient_name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-white truncate">{thread.patient_name}</h3>
                             <Badge className={cn('text-white text-xs', leadStatusConfig[thread.lead_status]?.color || leadStatusConfig.default.color)}>
                                {leadStatusConfig[thread.lead_status]?.label || leadStatusConfig.default.label}
                            </Badge>
                        </div>
                        <p className="text-sm text-purple-300 truncate">{thread.last_message}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const ChatView = ({ thread, onBack, onMessageSent }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const messagesEndRef = useRef(null);
    const { toast } = useToast();

    useEffect(() => {
        const fetchMessages = () => {
            if (!thread) return;
            setLoading(true);
            setSuggestions([]);
            setTimeout(() => {
                setMessages(mockMessages[thread.ai_session_id] || []);
                setLoading(false);
            }, 300);
        };
        fetchMessages();
    }, [thread]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
        setSending(true);
        setTimeout(() => {
            const newMsg = {
                id: `msg_${Date.now()}`,
                ai_session_id: thread.ai_session_id,
                direction: 'outgoing',
                content: newMessage,
            };
            setMessages(prev => [...prev, newMsg]);
            setNewMessage('');
            onMessageSent();
            setSending(false);
            toast({ title: 'Mensagem enviada (simulação).' });
        }, 500);
    };

    const handleGetSuggestions = async () => {
        setLoadingSuggestions(true);
        setSuggestions([]);
        setTimeout(() => {
            const mockSuggestions = [
                { label: "🗓️ Agendar Consulta", message: "Claro! Vamos agendar uma consulta para avaliarmos seu caso. Qual o melhor dia e horário?" },
                { label: "💳 Formas de Pagamento", message: "Oferecemos diversas formas de pagamento. Qual seria mais conveniente?" },
                { label: "🤔 Tirar Dúvida", message: "É uma ótima pergunta. O tempo de recuperação geralmente varia..." },
                { label: "✅ Encerrar", message: "Perfeito! Se precisar de mais alguma coisa, é só chamar." },
            ];
            setSuggestions(mockSuggestions);
            setLoadingSuggestions(false);
        }, 800);
    };
    
    if (!thread) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-gray-900/50 backdrop-blur-xl">
                <Bot size={64} className="text-purple-400 mb-4" />
                <h2 className="text-2xl font-bold text-white">Selecione uma Conversa</h2>
                <p className="text-purple-200">Escolha uma conversa da lista para ver os detalhes.</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full bg-gray-900/50 backdrop-blur-xl">
            <header className="flex items-center p-4 border-b border-white/10 bg-white/5">
                 <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={onBack}>
                    <ArrowLeft className="h-6 w-6 text-white" />
                </Button>
                <Avatar className="h-10 w-10 mr-4">
                    <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white font-bold">{getInitials(thread.patient_name)}</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="font-bold text-lg text-white">{thread.patient_name}</h3>
                </div>
            </header>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {loading ? <div className="text-center text-purple-300">Carregando mensagens...</div> :
                messages.map(msg => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn("flex items-end gap-3", msg.direction === 'outgoing' ? 'justify-end' : 'justify-start')}
                    >
                        {msg.direction !== 'outgoing' && <Avatar className="h-8 w-8"><AvatarFallback className="bg-pink-500 text-white">{getInitials(thread.patient_name)[0]}</AvatarFallback></Avatar>}
                        <div className={cn("max-w-md lg:max-w-xl p-3 rounded-2xl", msg.direction === 'outgoing' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-white/10 text-white rounded-bl-none')}>
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                         {msg.direction === 'outgoing' && <Avatar className="h-8 w-8"><AvatarFallback className="bg-purple-800 text-white"><Bot size={16}/></AvatarFallback></Avatar>}
                    </motion.div>
                ))}
                 <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-white/10 space-y-4">
                <Card className="bg-white/5 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white flex items-center"><Sparkles className="h-5 w-5 mr-2 text-cyan-300" /> Ações da IA</h4>
                        <Button variant="outline" size="sm" onClick={handleGetSuggestions} disabled={loadingSuggestions} className="text-cyan-300 border-cyan-400 hover:bg-cyan-400/10 hover:text-white">
                            {loadingSuggestions ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Activity className="h-4 w-4 mr-2" />}
                            Analisar Conversa
                        </Button>
                    </div>
                    {loadingSuggestions && <p className="text-sm text-purple-300 text-center">IA analisando... aguarde.</p>}
                    <AnimatePresence>
                        {suggestions.length > 0 && (
                             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-2 mt-2">
                                {suggestions.map(s => (
                                    <Button key={s.label} size="sm" variant="secondary" onClick={() => setNewMessage(s.message)} className="bg-white/10 hover:bg-white/20 text-white">
                                        {s.label}
                                    </Button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>
                <div className="flex items-center gap-2">
                    <Textarea 
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder="Digite sua mensagem ou use uma sugestão da IA..."
                        className="bg-white/10 border-white/20 text-white resize-none"
                        rows={1}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                    />
                    <Button onClick={handleSendMessage} disabled={sending} size="icon" className="bg-purple-600 hover:bg-purple-700 h-10 w-10 shrink-0">
                        {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </Button>
                </div>
            </div>
        </div>
    );
}

const Messages = () => {
    const [threads, setThreads] = useState([]);
    const [activeThread, setActiveThread] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchThreads = () => {
        setLoading(true);
        setTimeout(() => {
            setThreads(mockThreads);
            setLoading(false);
        }, 500);
    };

    useEffect(() => {
        fetchThreads();
    }, []);

    const handleSelectThread = (thread) => {
        setActiveThread(thread);
    };

    return (
        <div className="h-[calc(100vh-80px)] w-full flex bg-black/20 rounded-lg overflow-hidden border border-white/10">
            <div className={cn("w-full md:w-1/3 xl:w-1/4 transition-all duration-300", activeThread ? 'hidden md:block' : 'block')}>
                <ThreadList 
                    threads={threads} 
                    activeThread={activeThread} 
                    onSelectThread={handleSelectThread} 
                    loading={loading}
                />
            </div>
            <div className={cn("w-full md:w-2/3 xl:w-3/4 transition-all duration-300", activeThread ? 'block' : 'hidden md:block')}>
                 <ChatView thread={activeThread} onBack={() => setActiveThread(null)} onMessageSent={fetchThreads} />
            </div>
        </div>
    );
};

export default Messages;

import React, { useState, useMemo, useCallback } from 'react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useOpenAI } from '@/hooks/useOpenAI';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Inbox, Bell, Send, Sparkles, Loader2, Bot } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const NotificationItem = ({ message, contact }) => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { addMessage, markMessagesAsRead } = useData();
    const { getOpenAIResponse } = useOpenAI();
    const { profile } = useAuth();
    const [reply, setReply] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);

    const handleReply = async () => {
        if (!reply.trim()) return;
        setIsLoading(true);
        
        const newMessage = {
            patient_id: message.patient_id,
            patient_name: contact.name,
            message: reply,
            type: 'communication',
            status: 'replied',
            priority: message.priority,
            from: profile.role,
            assigned_to_id: profile.id,
        };

        const result = await addMessage(newMessage);
        if (result) {
            await markMessagesAsRead(message.patient_id);
            setReply('');
            toast({ title: "Resposta enviada com sucesso!" });
        }
        setIsLoading(false);
    };
    
    const handleAiSuggest = async () => {
        setIsAiLoading(true);
        const prompt = `Como um assistente de clínica, sugira uma resposta curta e profissional para a seguinte mensagem de um paciente:\n\nMensagem: "${message.message}"\n\nSeja cordial e eficiente.`;
        const suggestion = await getOpenAIResponse(prompt);
        if (suggestion) {
            setReply(suggestion);
        }
        setIsAiLoading(false);
    };

    return (
        <div className="p-4 bg-background/30 rounded-lg border border-border/50">
            <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10 border-2 border-primary/50">
                    <AvatarFallback className="font-semibold bg-primary/10 text-primary">{contact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <p className="font-semibold text-foreground">{contact.name}</p>
                        <Badge variant="destructive">Nova</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{message.message}</p>
                </div>
            </div>
            <div className="mt-4 space-y-2">
                <div className="relative">
                    <Textarea 
                        placeholder="Digite sua resposta rápida..."
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        className="pr-12"
                    />
                    <div className="absolute right-2 top-2">
                        {isAiLoading ? (
                            <Button variant="ghost" size="icon" disabled><Loader2 className="h-4 w-4 animate-spin" /></Button>
                        ) : (
                            <Button variant="ghost" size="icon" onClick={handleAiSuggest} title="Sugerir Resposta (IA)">
                                <Sparkles className="h-4 w-4 text-purple-400" />
                            </Button>
                        )}
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/conversation/${message.patient_id}`)}>Ver Detalhes</Button>
                    <Button size="sm" onClick={handleReply} disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                        Responder
                    </Button>
                </div>
            </div>
        </div>
    );
};

const NotificationCenter = ({ profile }) => {
    const { messages, contacts, loading } = useData();

    const notifications = useMemo(() => {
        if (loading || !messages || !contacts) return [];
        
        const contactMap = new Map(contacts.map(c => [c.patient_id, c]));

        return messages
            .filter(msg => {
                if (msg.status === 'new' || !msg.status) {
                    if (profile.role === 'admin') return true;
                    if (profile.role === 'medico' && (msg.priority === 'alta' || msg.priority === 'urgente')) return true;
                    if ((profile.role === 'secretaria' || profile.role === 'receptionist') && (msg.priority !== 'urgente')) return true;
                }
                return false;
            })
            .map(msg => ({
                message: msg,
                contact: contactMap.get(msg.patient_id)
            }))
            .filter(item => item.contact)
            .sort((a, b) => new Date(b.message.created_at) - new Date(a.message.created_at));

    }, [messages, contacts, loading, profile.role]);

    return (
        <Card className="glass-effect-strong">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bell className="text-primary"/> Central de Notificações</CardTitle>
                <CardDescription>Responda rapidamente às mensagens mais recentes e importantes.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="text-center py-8"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>
                ) : notifications.length > 0 ? (
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        {notifications.map(item => (
                            <NotificationItem key={item.message.id} message={item.message} contact={item.contact} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-muted-foreground border-2 border-dashed border-border rounded-lg">
                        <Inbox className="h-10 w-10 mx-auto mb-4 text-green-500" />
                        <p className="font-semibold text-foreground">Caixa de entrada limpa!</p>
                        <p className="text-sm">Nenhuma notificação nova no momento.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default NotificationCenter;

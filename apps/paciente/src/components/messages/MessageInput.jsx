
import React, { useState } from 'react';
import { Send, Sparkles, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useApi } from '@/contexts/ApiContext';
import { useToast } from '@/components/ui/use-toast';

const MessageInput = ({ conversationId, onMessageSent, apiSendMessage }) => {
    const [message, setMessage] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const { getAiSuggestion } = useApi();
    const { toast } = useToast();

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        try {
            const sentMessage = await apiSendMessage(conversationId, message);
            if (sentMessage) {
                onMessageSent(sentMessage);
                setMessage('');
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Erro ao enviar mensagem',
                description: error.message,
            });
        }
    };

    const handleAiSuggest = async () => {
        setIsAiLoading(true);
        try {
            const suggestion = await getAiSuggestion(conversationId);
            if (suggestion) {
                setMessage(prev => prev ? `${prev} ${suggestion}` : suggestion);
            }
        } catch (error) {
            // Error is handled in useApi
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleAttachFile = () => {
        toast({
            title: "🚧 Funcionalidade em breve!",
            description: "O envio de anexos estará disponível em breve.",
        });
    };

    return (
        <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 flex items-start gap-4">
            <Button variant="ghost" size="icon" type="button" onClick={handleAttachFile} className="mt-1">
                <Paperclip className="w-5 h-5" />
            </Button>
            <div className="flex-1 relative">
                <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 bg-slate-800 border-slate-700 resize-none pr-10"
                    rows={1}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                        }
                    }}
                />
                 <Button variant="ghost" size="icon" type="button" onClick={handleAiSuggest} disabled={isAiLoading} className="absolute right-1 bottom-1 text-purple-400 hover:text-purple-300">
                    <Sparkles className={`w-5 h-5 ${isAiLoading ? 'animate-pulse text-yellow-400' : ''}`} />
                </Button>
            </div>
            <Button type="submit" size="icon" disabled={!message.trim()} className="mt-1">
                <Send className="w-5 h-5" />
            </Button>
        </form>
    );
};

export default MessageInput;

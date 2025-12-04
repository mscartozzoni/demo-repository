import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { Bot, Paperclip, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const MessageInput = ({ onSendMessage }) => {
    const { toast } = useToast();
    const [text, setText] = useState('');

    const aiSuggestions = [
        { label: "Jejum", text: "Lembre-se do jejum de 8 horas antes do procedimento." },
        { label: "Medicação", text: "Não se esqueça de tomar sua medicação conforme prescrito." },
        { label: "Retorno", text: "Sua consulta de retorno está agendada. Por favor, confirme sua presença." },
        { label: "Cuidados", text: "Evite exposição ao sol e esforços físicos nos próximos dias." },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
            onSendMessage({ text });
            setText('');
        }
    };
    
    const handleAttachment = () => {
        toast({
            title: "🚧 Funcionalidade em desenvolvimento",
            description: "O envio de anexos será implementado em breve!",
        });
    };

    const handleSuggestionClick = (suggestionText) => {
        setText(prev => prev ? `${prev}\n${suggestionText}` : suggestionText);
    };

    return (
        <div className="p-4 border-t border-slate-700/60 flex-shrink-0 bg-slate-800/50">
            <form onSubmit={handleSubmit} className="flex items-start gap-3">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="flex-shrink-0 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10">
                            <Bot className="w-5 h-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700 text-white">
                        <DropdownMenuLabel>Sugestões da IA</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-700" />
                        {aiSuggestions.map(sugg => (
                            <DropdownMenuItem key={sugg.label} onSelect={() => handleSuggestionClick(sugg.text)} className="cursor-pointer hover:!bg-slate-700">
                                {sugg.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <Textarea
                    placeholder="Digite sua mensagem..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            handleSubmit(e);
                        }
                    }}
                    className="flex-grow bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 resize-none min-h-[40px]"
                    rows={1}
                />
                <Button type="button" variant="ghost" size="icon" className="flex-shrink-0" onClick={handleAttachment}>
                    <Paperclip className="w-5 h-5 text-slate-400" />
                </Button>
                <Button type="submit" size="icon" className="flex-shrink-0 bg-blue-600 hover:bg-blue-700">
                    <Send className="w-5 h-5" />
                </Button>
            </form>
        </div>
    );
};

export default MessageInput;
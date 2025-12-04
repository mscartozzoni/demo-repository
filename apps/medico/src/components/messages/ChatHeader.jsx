import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Phone, Video, MoreVertical, FileText as InvoiceIcon, MessageCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ChatHeader = ({ participant, onOpenInvoice, isAi }) => {
    const { toast } = useToast();

    const handleActionClick = (actionName) => {
        toast({
            title: "🚧 Funcionalidade em desenvolvimento",
            description: `A ação de ${actionName} ainda não foi implementada.`,
        });
    };

    const handleWhatsAppClick = () => {
        if (participant?.phone) {
            const whatsappUrl = `https://wa.me/${participant.phone.replace(/\D/g, '')}`;
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        } else {
            toast({
                variant: 'destructive',
                title: "Número de telefone não encontrado",
                description: "Este contato não possui um número de telefone para o WhatsApp.",
            });
        }
    };

    const getInitials = (name) => {
        if (!name) return '??';
        return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    };

    return (
        <div className="flex items-center justify-between p-4 border-b border-slate-700/60 flex-shrink-0">
            <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10 border-2 border-slate-600">
                    <AvatarImage src={participant?.avatar} alt={participant?.name} />
                    <AvatarFallback className="bg-slate-700 text-white">{getInitials(participant?.name)}</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="text-lg font-bold text-white">{participant?.name || 'Selecione uma conversa'}</h2>
                    {!isAi && <p className="text-sm text-green-400">Online</p>}
                </div>
            </div>
            {!isAi && (
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="text-green-400 hover:text-green-300" onClick={handleWhatsAppClick} title="Abrir no WhatsApp">
                        <MessageCircle className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" onClick={onOpenInvoice} title="Gerar Fatura">
                        <InvoiceIcon className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" onClick={() => handleActionClick('chamada de áudio')} title="Ligar">
                        <Phone className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" onClick={() => handleActionClick('chamada de vídeo')} title="Vídeo Chamada">
                        <Video className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" onClick={() => handleActionClick('mais opções')} title="Mais opções">
                        <MoreVertical className="w-5 h-5" />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ChatHeader;
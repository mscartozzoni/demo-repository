
import React from 'react';
import { Phone, Video, MoreVertical } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ConversationHeader = ({ conversation }) => {
    const { toast } = useToast();

    const handleFeatureClick = () => {
        toast({
            title: "🚧 Funcionalidade em breve!",
            description: "Esta ação estará disponível em futuras atualizações.",
        });
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    const participant = conversation?.participant;
    const participantName = participant?.name || participant?.full_name;

    if (!conversation) {
        return (
            <div className="p-4 border-b border-white/10 flex items-center justify-between h-[77px]">
                <p className="text-gray-400">Selecione uma conversa para começar</p>
            </div>
        );
    }

    return (
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={participant?.avatarUrl} alt={participantName} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {getInitials(participantName)}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="font-bold text-lg">{participantName}</h2>
                    <p className={`text-sm ${participant?.online ? 'text-green-400' : 'text-gray-400'}`}>
                        {participant?.online ? 'Online' : 'Offline'}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={handleFeatureClick}><Phone className="w-5 h-5" /></Button>
                <Button variant="ghost" size="icon" onClick={handleFeatureClick}><Video className="w-5 h-5" /></Button>
                <Button variant="ghost" size="icon" onClick={handleFeatureClick}><MoreVertical className="w-5 h-5" /></Button>
            </div>
        </div>
    );
};

export default ConversationHeader;

import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot } from 'lucide-react';

const ConversationItem = ({ conversation, isSelected, onSelect }) => {
    const { participant, messages } = conversation;
    const lastMessage = messages[messages.length - 1];

    const getInitials = (name) => {
        if (!name) return '??';
        return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    };

    return (
        <motion.div
            whileHover={{ backgroundColor: 'rgba(100, 116, 139, 0.2)' }}
            onClick={() => onSelect(conversation)}
            className={cn(
                "flex items-center gap-3 p-3 mx-2 rounded-lg cursor-pointer transition-colors duration-200",
                isSelected ? "bg-blue-600/30" : "hover:bg-slate-700/40"
            )}
        >
            <Avatar className="h-12 w-12 border-2 border-slate-600 relative">
                <AvatarImage src={participant.avatar} alt={participant.name} className="object-cover" />
                <AvatarFallback className="bg-slate-700 text-white">{getInitials(participant.name)}</AvatarFallback>
                {conversation.isAi && <div className="absolute -bottom-1 -right-1 bg-purple-500 rounded-full p-0.5"><Bot className="w-3 h-3 text-white" /></div>}
            </Avatar>
            <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                    <h3 className="text-base font-semibold text-white truncate">{participant.name}</h3>
                    {lastMessage && (
                        <p className="text-xs text-slate-400 flex-shrink-0 ml-2">
                            {formatDistanceToNow(new Date(lastMessage.timestamp), { addSuffix: true, locale: ptBR })}
                        </p>
                    )}
                </div>
                <p className="text-sm text-slate-400 truncate">
                    {lastMessage ? lastMessage.content : 'Nenhuma mensagem ainda.'}
                </p>
            </div>
            {conversation.unread > 0 && (
                 <div className="bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {conversation.unread}
                 </div>
            )}
        </motion.div>
    );
};

export default ConversationItem;
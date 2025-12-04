import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot } from 'lucide-react';


const ChatMessage = ({ message, isSentByCurrentUser }) => {
    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    };

    const alignment = isSentByCurrentUser ? 'justify-end' : 'justify-start';
    const bgColor = isSentByCurrentUser ? 'bg-blue-600' : 'bg-slate-700';
    const isAiMessage = message.sender_id === 'ai-assistant';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn("flex items-end gap-3 w-full", alignment)}
        >
            {!isSentByCurrentUser && (
                <Avatar className="h-8 w-8 self-start flex-shrink-0">
                    <AvatarImage src={message.sender_avatar} />
                    <AvatarFallback className={cn("bg-slate-600", isAiMessage && "bg-purple-500")}>
                        {isAiMessage ? <Bot className="w-4 h-4 text-white" /> : getInitials(message.sender_name)}
                    </AvatarFallback>
                </Avatar>
            )}
            <div className={cn("max-w-xs md:max-w-md lg:max-w-xl p-3 rounded-2xl", bgColor, isSentByCurrentUser ? "rounded-br-none" : "rounded-bl-none")}>
                <p className="text-white text-sm leading-relaxed">{message.content}</p>
                 <p className={cn("text-xs mt-2", isSentByCurrentUser ? "text-blue-200" : "text-slate-400")}>
                    {format(new Date(message.timestamp), "HH:mm")}
                </p>
            </div>
        </motion.div>
    );
};

export default ChatMessage;
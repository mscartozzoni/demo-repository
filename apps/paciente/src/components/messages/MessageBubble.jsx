import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const MessageBubble = ({ message }) => {
    const isSender = message.sender_role === 'secretary';

    const getSenderName = () => {
        if (isSender) return 'Você';
        if (message.sender_role === 'bot') return 'Assistente IA';
        return message.sender_name || 'Paciente'; // Fallback
    };

    const getAvatar = () => {
        if (message.sender_role === 'bot') {
            return <Bot className="w-5 h-5 text-white" />;
        }
        return <User className="w-5 h-5 text-white" />;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex items-end gap-3 ${isSender ? 'justify-end' : 'justify-start'}`}
        >
            {!isSender && (
                <Avatar className={`h-8 w-8 flex-shrink-0 ${message.sender_role === 'bot' ? 'bg-cyan-500' : 'bg-gray-500'}`}>
                    <AvatarFallback className="bg-transparent">
                        {getAvatar()}
                    </AvatarFallback>
                </Avatar>
            )}
            <div className={`flex flex-col ${isSender ? 'items-end' : 'items-start'}`}>
                <div
                    className={`p-3 rounded-2xl max-w-md md:max-w-lg lg:max-w-xl break-words ${
                        isSender
                            ? 'bg-blue-600 rounded-br-none'
                            : 'bg-slate-700 rounded-bl-none'
                    }`}
                >
                    <p className="text-white">{message.content}</p>
                </div>
                <div className="text-xs text-gray-400 mt-1 px-1">
                    <span>{getSenderName()}</span> &middot; <span>{new Date(message.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default MessageBubble;
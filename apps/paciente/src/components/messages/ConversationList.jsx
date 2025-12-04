
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Bot } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const ConversationList = ({ conversations, selectedConversation, onSelectConversation, searchTerm, setSearchTerm }) => {
    
    const filteredConversations = conversations.filter(c => {
        const participantName = c.participant?.name || c.participant?.full_name || '';
        const nameMatch = participantName.toLowerCase().includes(searchTerm.toLowerCase());
        const summaryMatch = c.summary && c.summary.toLowerCase().includes(searchTerm.toLowerCase());
        return nameMatch || summaryMatch;
    });

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    const timeSince = (date) => {
        if (!date) return '';
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "a";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "m";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "min";
        return Math.floor(seconds) + "s";
    };

    return (
        <div className="glass-effect rounded-lg h-full flex flex-col min-h-0">
            <div className="p-4 border-b border-white/10">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                        placeholder="Buscar conversas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>
            <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                    {filteredConversations.map((convo, index) => (
                        <motion.div
                            key={convo.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            onClick={() => onSelectConversation(convo)}
                            className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${selectedConversation?.id === convo.id ? 'bg-blue-600/30' : 'hover:bg-white/10'}`}
                        >
                            <div className="relative mr-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={convo.participant?.avatarUrl} alt={convo.participant?.name || convo.participant?.full_name} />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                        {getInitials(convo.participant?.name || convo.participant?.full_name)}
                                    </AvatarFallback>
                                </Avatar>
                                {convo.participant?.online && <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-slate-800" />}
                            </div>

                            <div className="flex-1 overflow-hidden">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold truncate">{convo.participant?.name || convo.participant?.full_name}</p>
                                    <p className="text-xs text-gray-400 flex-shrink-0 ml-2">{timeSince(convo.last_message_at)}</p>
                                </div>
                                <div className="flex justify-between items-start">
                                    <p className="text-sm text-gray-400 truncate pr-2">{convo.summary || 'Nenhuma mensagem ainda'}</p>
                                    {convo.unread_count > 0 && (
                                        <Badge variant="destructive" className="flex-shrink-0">{convo.unread_count}</Badge>
                                    )}
                                </div>
                            </div>
                            {convo.status === 'bot' && <Bot className="w-4 h-4 text-cyan-400 ml-2 flex-shrink-0" />}
                        </motion.div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};

export default ConversationList;

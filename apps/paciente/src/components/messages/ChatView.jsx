
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Loader2 } from 'lucide-react';
import { useApi } from '@/contexts/ApiContext';
import ConversationList from '@/components/messages/ConversationList';
import ConversationHeader from '@/components/messages/ConversationHeader';
import MessageBubble from '@/components/messages/MessageBubble';
import MessageInput from '@/components/messages/MessageInput';
import { ScrollArea } from '@/components/ui/scroll-area';

const ChatView = () => {
    const { getConversations, getMessagesForConversation, loading, sendMessage } = useApi();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchConversations = useCallback(async () => {
        const data = await getConversations();
        setConversations(data || []);
        if (data && data.length > 0 && !selectedConversation) {
            handleSelectConversation(data[0]);
        }
    }, [getConversations]);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    const handleSelectConversation = useCallback(async (conversation) => {
        if (!conversation) return;
        setSelectedConversation(conversation);
        setMessagesLoading(true);
        const fetchedMessages = await getMessagesForConversation(conversation.id);
        setMessages(fetchedMessages || []);
        setMessagesLoading(false);
        // Mark conversation as read
        setConversations(prev => prev.map(c => c.id === conversation.id ? {...c, unread_count: 0} : c));
    }, [getMessagesForConversation]);

    const handleMessageSent = (newMessage) => {
        setMessages(prev => [...prev, newMessage]);
        setConversations(prev => prev.map(c => c.id === newMessage.conversation_id ? {
            ...c,
            summary: `Você: ${newMessage.content}`,
            last_message_at: newMessage.created_at,
        } : c).sort((a,b) => new Date(b.last_message_at) - new Date(a.last_message_at)));
    };

    return (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 min-h-0 h-full">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="md:col-span-1 lg:col-span-1 h-full flex flex-col min-h-0"
            >
                 {loading && conversations.length === 0 ? (
                    <div className="flex items-center justify-center h-full glass-effect rounded-lg"><Loader2 className="w-8 h-8 animate-spin" /></div>
                ) : (
                    <ConversationList
                        conversations={conversations}
                        selectedConversation={selectedConversation}
                        onSelectConversation={handleSelectConversation}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />
                )}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="md:col-span-2 lg:col-span-3 h-full flex flex-col rounded-lg glass-effect"
            >
               <ConversationHeader conversation={selectedConversation} />
               
               <ScrollArea className="flex-1 p-4">
                   <div className="space-y-4">
                        {messagesLoading ? (
                            <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin" /></div>
                        ) : selectedConversation ? (
                            messages.length > 0 ? messages.map(msg => <MessageBubble key={msg.id} message={msg} />) : (
                                <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 p-4">
                                    <MessageSquare className="w-16 h-16 mb-4" />
                                    <p className="font-semibold text-xl">Inicie a conversa!</p>
                                    <p className="text-sm">Envie a primeira mensagem para {selectedConversation.participant?.name}.</p>
                                </div>
                            )
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                                <MessageSquare className="w-16 h-16 mb-4" />
                                <p className="font-semibold text-xl">Selecione uma conversa</p>
                                <p className="text-sm">Escolha uma conversa da lista para ver as mensagens.</p>
                            </div>
                        )}
                   </div>
               </ScrollArea>
               
               {selectedConversation && (
                   <MessageInput 
                        conversationId={selectedConversation.id}
                        onMessageSent={handleMessageSent}
                        apiSendMessage={sendMessage}
                    />
               )}
            </motion.div>
        </div>
    );
};

export default ChatView;

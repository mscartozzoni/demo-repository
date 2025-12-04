import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import ConversationItem from '@/components/messages/ConversationItem';
import { ScrollArea } from '@/components/ui/scroll-area';

const ConversationList = ({ conversations, selectedConversation, onSelectConversation, loading, error }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredConversations = conversations.filter(c =>
        c.participant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full md:w-1/3 xl:w-1/4 border-r border-slate-700/60 flex flex-col">
            <div className="p-4 border-b border-slate-700/60 flex-shrink-0">
                <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Buscar conversas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                    />
                </div>
            </div>
            <ScrollArea className="flex-grow">
                <div className="py-2">
                    {loading && <p className="text-slate-400 text-center p-4">Carregando...</p>}
                    {error && <p className="text-red-400 text-center p-4">Erro ao carregar.</p>}
                    {!loading && !error && filteredConversations.map(conv => (
                        <ConversationItem
                            key={conv.id}
                            conversation={conv}
                            isSelected={selectedConversation?.id === conv.id}
                            onSelect={onSelectConversation}
                        />
                    ))}
                    {!loading && filteredConversations.length === 0 && (
                        <p className="text-slate-400 text-center p-4">Nenhuma conversa encontrada.</p>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
};

export default ConversationList;
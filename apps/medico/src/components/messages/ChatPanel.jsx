import React, { useRef, useEffect } from 'react';
import ChatHeader from '@/components/messages/ChatHeader';
import MessageInput from '@/components/messages/MessageInput';
import ChatMessage from '@/components/messages/ChatMessage';
import { ScrollArea } from '@/components/ui/scroll-area';

const ChatPanel = ({ conversation, onSendMessage, onOpenInvoice, currentUserId }) => {
    const scrollViewportRef = useRef(null);

    useEffect(() => {
        if (scrollViewportRef.current) {
            setTimeout(() => {
                scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
            }, 100);
        }
    }, [conversation.messages]);


    return (
        <div className="flex-1 flex flex-col bg-slate-800/50">
            <ChatHeader 
                participant={conversation.participant} 
                onOpenInvoice={onOpenInvoice}
                isAi={conversation.isAi}
            />
            <ScrollArea className="flex-grow">
                <div className="p-4 md:p-6" ref={scrollViewportRef}>
                    <div className="space-y-4">
                        {conversation.messages.map(message => (
                            <ChatMessage
                                key={message.id}
                                message={message}
                                isSentByCurrentUser={message.sender_id === currentUserId}
                            />
                        ))}
                    </div>
                </div>
            </ScrollArea>
            <MessageInput onSendMessage={onSendMessage} />
        </div>
    );
};

export default ChatPanel;
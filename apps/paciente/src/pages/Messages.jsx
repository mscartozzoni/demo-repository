
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MessageSquare, Mail } from 'lucide-react';
import EmailInbox from '@/components/messages/EmailInbox';
import ChatView from '@/components/messages/ChatView';

const Messages = () => {
    return (
        <>
            <Helmet>
                <title>Central de Comunicação - Portal Unificado</title>
                <meta name="description" content="Gerencie suas conversas de chat e e-mails em um só lugar." />
            </Helmet>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col"
            >
                <div className="mb-6">
                    <h1 className="text-3xl font-bold gradient-text">Central de Comunicação</h1>
                    <p className="text-gray-400 mt-1">Conecte-se com pacientes e contatos por chat e e-mail.</p>
                </div>
                
                <Tabs defaultValue="chat" className="flex-grow flex flex-col">
                    <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                        <TabsTrigger value="chat">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Chat
                        </TabsTrigger>
                        <TabsTrigger value="email">
                            <Mail className="w-4 h-4 mr-2" />
                            E-mail
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="chat" className="flex-grow mt-6 min-h-0">
                       <ChatView />
                    </TabsContent>
                    <TabsContent value="email" className="flex-grow mt-6">
                       <EmailInbox />
                    </TabsContent>
                </Tabs>
            </motion.div>
        </>
    );
};

export default Messages;

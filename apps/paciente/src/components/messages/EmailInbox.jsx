import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApi } from '@/contexts/ApiContext';
import { Loader2, Inbox, Send, Edit } from 'lucide-react';
import EmailList from './EmailList';
import EmailViewer from './EmailViewer';
import ComposeEmail from './ComposeEmail';
import { Button } from '@/components/ui/button';

const EmailInbox = () => {
    const { getEmails, loading, receiveNewEmail } = useApi();
    const [emails, setEmails] = useState([]);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [currentView, setCurrentView] = useState('inbox'); // inbox, sent
    const [isComposing, setIsComposing] = useState(false);
    const [replyTo, setReplyTo] = useState(null);

    const fetchEmails = useCallback(async () => {
        const data = await getEmails(currentView);
        setEmails(data || []);
        if (!selectedEmail && data && data.length > 0) {
            setSelectedEmail(data[0]);
        }
    }, [getEmails, currentView, selectedEmail]);

    useEffect(() => {
        fetchEmails();
    }, [fetchEmails]);

    const handleSelectEmail = (email) => {
        setSelectedEmail(email);
    };

    const handleCompositionChange = (composing) => {
        setIsComposing(composing);
        if(!composing) {
            setReplyTo(null); // Limpa o estado de resposta ao fechar
        }
    }

    const handleReply = (email) => {
        setReplyTo(email);
        setIsComposing(true);
    };

    return (
        <div className="glass-effect h-full flex rounded-lg overflow-hidden">
            <aside className="w-1/4 min-w-[250px] border-r border-slate-700/50 flex flex-col">
                <div className="p-4 border-b border-slate-700/50">
                     <Button className="w-full btn-primary" onClick={() => { setReplyTo(null); setIsComposing(true); }}>
                        <Edit className="w-4 h-4 mr-2" />
                        Escrever
                    </Button>
                </div>
                <nav className="p-2 space-y-1">
                    <Button variant={currentView === 'inbox' ? 'secondary' : 'ghost'} className="w-full justify-start" onClick={() => setCurrentView('inbox')}>
                        <Inbox className="w-4 h-4 mr-2" /> Caixa de Entrada
                    </Button>
                     <Button variant={currentView === 'sent' ? 'secondary' : 'ghost'} className="w-full justify-start" onClick={() => setCurrentView('sent')}>
                        <Send className="w-4 h-4 mr-2" /> Enviados
                    </Button>
                </nav>
                 <div className="p-4 mt-auto border-t border-slate-700/50">
                     <Button className="w-full btn-secondary" onClick={receiveNewEmail}>
                        Simular Receber E-mail
                    </Button>
                </div>
            </aside>
            <div className="flex-1 flex overflow-hidden">
                <div className="w-1/3 min-w-[300px] border-r border-slate-700/50">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                        </div>
                    ) : (
                        <EmailList emails={emails} onSelectEmail={handleSelectEmail} selectedEmailId={selectedEmail?.id} />
                    )}
                </div>
                <main className="flex-1">
                     <AnimatePresence mode="wait">
                        {isComposing ? (
                            <motion.div
                                key="compose"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="h-full"
                            >
                                <ComposeEmail onEmailSent={() => { handleCompositionChange(false); fetchEmails(); }} onCancel={() => handleCompositionChange(false)} replyTo={replyTo} />
                            </motion.div>
                        ) : selectedEmail ? (
                             <motion.div
                                key={selectedEmail.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="h-full"
                            >
                                <EmailViewer email={selectedEmail} onReply={handleReply} />
                            </motion.div>
                        ) : (
                             <motion.div 
                                key="no-email"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center h-full text-center text-gray-400"
                              >
                                <Inbox className="w-16 h-16 mb-4"/>
                                <h2 className="text-xl font-semibold">Selecione um e-mail para ler</h2>
                                <p>Ou escreva uma nova mensagem.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default EmailInbox;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Send, Loader2 } from 'lucide-react';

const SendEmailModal = ({ isOpen, onClose, quote }) => {
    const [recipient, setRecipient] = useState(quote.patients?.email || '');
    const [subject, setSubject] = useState(`Seu orçamento para ${quote.services?.name}`);
    const [message, setMessage] = useState(`Olá, ${quote.patients?.full_name}!\n\nSegue em anexo o seu orçamento detalhado para o procedimento de ${quote.services?.name}.\n\nQualquer dúvida, estamos à disposição.\n\nAtenciosamente,\nEquipe da Clínica`);
    const [isSending, setIsSending] = useState(false);
    const { toast } = useToast();

    const handleSend = () => {
        if (!recipient) {
            toast({
                variant: 'destructive',
                title: 'Erro',
                description: 'O e-mail do destinatário é obrigatório.',
            });
            return;
        }
        setIsSending(true);
        setTimeout(() => {
            toast({
                variant: 'success',
                title: 'E-mail Enviado (Simulação)!',
                description: `O orçamento foi enviado para ${recipient}.`,
            });
            setIsSending(false);
            onClose();
        }, 1000);
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[101]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-gray-900/50 backdrop-blur-xl border border-white/20 rounded-2xl p-8 w-full max-w-lg relative"
                >
                    <div className="text-center mb-6">
                        <Send className="mx-auto h-12 w-12 text-purple-300 mb-4" />
                        <h2 className="text-2xl font-bold text-white">Enviar Orçamento por E-mail</h2>
                        <p className="text-purple-200 mt-2">Envie o orçamento diretamente para o paciente.</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <Label className="text-purple-200">Para</Label>
                            <Input type="email" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="email@paciente.com" className="bg-white/10 border-white/20 text-white" />
                        </div>
                        <div>
                            <Label className="text-purple-200">Assunto</Label>
                            <Input value={subject} onChange={(e) => setSubject(e.target.value)} className="bg-white/10 border-white/20 text-white" />
                        </div>
                        <div>
                            <Label className="text-purple-200">Mensagem</Label>
                            <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} className="bg-white/10 border-white/20 text-white" />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6 mt-4 border-t border-white/10">
                        <Button type="button" onClick={onClose} variant="outline" className="text-purple-200 border-purple-400 hover:bg-purple-400/10 hover:text-white">
                            Cancelar
                        </Button>
                        <Button onClick={handleSend} disabled={isSending} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                            {isSending ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2 h-4 w-4" />}
                            {isSending ? 'Enviando...' : 'Enviar E-mail'}
                        </Button>
                    </div>
                </motion.div>
            </div>
        </Dialog>
    );
};

export default SendEmailModal;
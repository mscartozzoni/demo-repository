import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip, X } from 'lucide-react';
import { useApi } from '@/contexts/ApiContext';

const ComposeEmail = ({ onEmailSent, onCancel, replyTo }) => {
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const { sendEmail, loading } = useApi();

    useEffect(() => {
        if (replyTo) {
            setTo(replyTo.from);
            setSubject(`Re: ${replyTo.subject}`);
            const replyBody = `
<br><br>
<blockquote style="border-left: 2px solid #ccc; margin: 1.5em 10px; padding: 0.5em 10px;">
  Em ${new Date(replyTo.timestamp).toLocaleString('pt-BR')}, ${replyTo.fromName} &lt;${replyTo.from}&gt; escreveu:<br>
  ${replyTo.body}
</blockquote>`;
            setBody(replyBody);
        } else {
            setTo('');
            setSubject('');
            setBody('');
        }
    }, [replyTo]);

    const handleSend = async () => {
        if (!to || !subject || !body) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        await sendEmail({ to, subject, body });
        onEmailSent();
    };

    return (
        <div className="h-full flex flex-col p-4 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">{replyTo ? 'Responder E-mail' : 'Nova Mensagem'}</h2>
                <Button variant="ghost" size="icon" onClick={onCancel} className="text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                </Button>
            </div>
            <Input 
                placeholder="Para" 
                value={to}
                onChange={(e) => setTo(e.target.value)}
            />
            <Input 
                placeholder="Assunto" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
            />
            <Textarea 
                placeholder="Escreva sua mensagem aqui..." 
                className="flex-grow resize-none"
                value={body}
                onChange={(e) => setBody(e.target.value)}
            />
            <div className="flex justify-between items-center">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                    <Paperclip className="w-5 h-5" />
                </Button>
                <Button onClick={handleSend} disabled={loading}>
                    <Send className="w-4 h-4 mr-2" />
                    {loading ? 'Enviando...' : 'Enviar'}
                </Button>
            </div>
        </div>
    );
};

export default ComposeEmail;
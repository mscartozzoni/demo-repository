import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Save, Mail } from 'lucide-react';

const EmailConnection = () => {
    const [emailDomain, setEmailDomain] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        const storedDomain = localStorage.getItem('clinicEmailDomain');
        if (storedDomain) {
            setEmailDomain(storedDomain);
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('clinicEmailDomain', emailDomain);
        toast({
            title: '✅ Domínio Salvo!',
            description: 'Seu domínio de e-mail foi salvo com sucesso.',
        });
    };

    return (
        <Card className="glass-effect">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-400"/>
                    Conexão de E-mail
                </CardTitle>
                <CardDescription>
                    Configure o domínio do seu e-mail para envio de mensagens. Futuramente, você poderá configurar SMTP/IMAP aqui.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email-domain">Domínio do E-mail da Clínica</Label>
                    <Input
                        id="email-domain"
                        placeholder="ex: minha-clinica.com"
                        value={emailDomain}
                        onChange={(e) => setEmailDomain(e.target.value)}
                    />
                     <p className="text-xs text-gray-400 pt-1">
                        Este domínio será usado como remetente ao enviar e-mails pelo sistema (ex: `contato@seu-dominio.com`).
                    </p>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Domínio
                </Button>
            </CardFooter>
        </Card>
    );
};

export default EmailConnection;
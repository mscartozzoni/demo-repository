import React from 'react';
import { Mail, Construction } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const EmailView = () => {
    const { toast } = useToast();

    const handleComingSoon = () => {
        toast({
            title: "🚧 Em construção!",
            description: "A caixa de entrada de e-mail está sendo preparada e estará disponível em breve. A interface já está sendo montada!",
            duration: 5000,
        });
    };

    return (
        <div className="h-full flex flex-col items-center justify-center text-center glass-effect rounded-lg p-8">
            <div className="relative mb-6">
                <Mail className="w-24 h-24 text-blue-500/50" />
                <Construction className="w-12 h-12 text-yellow-400 absolute -bottom-2 -right-2 animate-bounce" />
            </div>
            <h2 className="text-2xl font-bold mb-2 gradient-text">Caixa de Entrada de E-mail em Breve!</h2>
            <p className="text-slate-400 max-w-md mb-6">
                Estamos trabalhando para integrar sua caixa de e-mail diretamente aqui. Você poderá gerenciar, ler e responder e-mails sem sair do portal.
            </p>
            <Button onClick={handleComingSoon}>
                Receber Notificação
            </Button>
            <p className="text-xs text-slate-500 mt-4">
                Enquanto isso, a aba de "Logs de E-mail" em Configurações já está ativa para monitorar os envios do sistema.
            </p>
        </div>
    );
};

export default EmailView;
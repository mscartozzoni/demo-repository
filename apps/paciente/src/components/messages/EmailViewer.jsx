import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Reply, MoreVertical } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const EmailViewer = ({ email, onReply }) => {
    if (!email) {
        return <div className="flex items-center justify-center h-full">Selecione um e-mail para visualizar.</div>;
    }
    
    const getInitials = (name) => {
        if (!name) return '?';
        const names = name.split(' ');
        if (names.length > 1) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div className="h-full flex flex-col">
            <header className="p-4 border-b border-slate-700/50">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                         <Avatar>
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                {getInitials(email.fromName)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                             <h2 className="font-semibold text-lg text-white">{email.fromName}</h2>
                             <p className="text-sm text-gray-400">De: {email.from}</p>
                        </div>
                    </div>
                     <span className="text-xs text-gray-400">{format(new Date(email.timestamp), "d MMM yyyy, HH:mm", { locale: ptBR })}</span>
                </div>
                <h1 className="text-xl font-bold mt-4">{email.subject}</h1>
            </header>
            <ScrollArea className="flex-grow">
                <div className="p-6 prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: email.body }}></div>
            </ScrollArea>
            <footer className="p-4 border-t border-slate-700/50">
                <div className="flex items-center gap-2">
                    <Button onClick={() => onReply(email)}>
                        <Reply className="w-4 h-4 mr-2" />
                        Responder
                    </Button>
                     <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                    </Button>
                </div>
            </footer>
        </div>
    );
};

export default EmailViewer;
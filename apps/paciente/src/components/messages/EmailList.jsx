import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const EmailListItem = ({ email, onSelectEmail, isSelected }) => {
    return (
        <div
            onClick={() => onSelectEmail(email)}
            className={`p-4 cursor-pointer border-b border-slate-700/50 transition-colors duration-200 ${
                isSelected ? 'bg-blue-500/10' : 'hover:bg-slate-800/60'
            }`}
        >
            <div className="flex justify-between items-start">
                <h3 className={`text-sm font-semibold truncate ${email.isRead ? 'text-gray-300' : 'text-white'}`}>
                    {email.fromName}
                </h3>
                <span className={`text-xs flex-shrink-0 ml-2 ${email.isRead ? 'text-gray-500' : 'text-blue-400'}`}>
                    {formatDistanceToNow(new Date(email.timestamp), { addSuffix: true, locale: ptBR })}
                </span>
            </div>
            <p className={`text-sm truncate mt-1 ${email.isRead ? 'text-gray-400' : 'text-gray-200 font-medium'}`}>
                {email.subject}
            </p>
            <p className="text-xs text-gray-500 truncate mt-1">
                {email.snippet}
            </p>
        </div>
    );
};

const EmailList = ({ emails, onSelectEmail, selectedEmailId }) => {
    return (
        <ScrollArea className="h-full">
            {emails.map((email) => (
                <EmailListItem
                    key={email.id}
                    email={email}
                    onSelectEmail={onSelectEmail}
                    isSelected={selectedEmailId === email.id}
                />
            ))}
        </ScrollArea>
    );
};

export default EmailList;
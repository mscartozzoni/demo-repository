import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Home, Calendar, Users, MessageSquare, FileText, Settings, DollarSign, BarChart, PenSquare, Video, QrCode } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const mainActions = [
  { name: 'Dashboard', href: '/medico/dashboard', icon: Home },
  { name: 'Agenda', href: '/medico/agenda', icon: Calendar },
  { name: 'Teleconsultas', href: '/medico/teleconsultas', icon: Video },
  { name: 'Mensagens', href: '/medico/messages', icon: MessageSquare },
];

const patientActions = [
  { name: 'Pacientes', href: '/medico/prontuarios', icon: Users },
  { name: 'Documentos', href: '/medico/documents', icon: FileText },
];

const businessActions = [
  { name: 'Financeiro', href: '/medico/financial', icon: DollarSign },
  { name: 'Analytics', href: '/medico/analytics', icon: BarChart },
  { name: 'Blog', href: '/medico/blog', icon: PenSquare },
];

const otherActions = [
    { name: 'Gerador QR Code', href: '/medico/qr-code-generator', icon: QrCode },
    { name: 'Configurações', href: '/medico/config', icon: Settings },
]


export default function ActionSearchModal({ open, setOpen, onAddPatient }) {
    const navigate = useNavigate();
    const { toast } = useToast();

    const runCommand = React.useCallback((command) => {
        setOpen(false);
        if (typeof command === 'function') {
            command();
        }
    }, [setOpen]);

    const handleSelect = (item) => {
        if (item.href) {
            runCommand(() => navigate(item.href));
        } else if (item.action) {
            // Handle actions that don't navigate
            // e.g., opening a modal
            toast({
                title: "🚧 Ação não implementada",
                description: "Esta ação ainda não foi conectada.",
            });
        }
    };

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Digite um comando ou pesquise..." />
        <CommandList>
            <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
            
            <CommandGroup heading="Geral">
            {mainActions.map((item) => (
                <CommandItem key={item.href} value={item.name} onSelect={() => handleSelect(item)}>
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.name}</span>
                </CommandItem>
            ))}
            </CommandGroup>
            
            <CommandSeparator />
            
            <CommandGroup heading="Pacientes">
            {patientActions.map((item) => (
                <CommandItem key={item.href} value={item.name} onSelect={() => handleSelect(item)}>
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.name}</span>
                </CommandItem>
            ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Negócios">
            {businessActions.map((item) => (
                <CommandItem key={item.href} value={item.name} onSelect={() => handleSelect(item)}>
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.name}</span>
                </CommandItem>
            ))}
            </CommandGroup>
            
            <CommandSeparator />

            <CommandGroup heading="Outros">
            {otherActions.map((item) => (
                <CommandItem key={item.href} value={item.name} onSelect={() => handleSelect(item)}>
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.name}</span>
                </CommandItem>
            ))}
            </CommandGroup>
        </CommandList>
        </CommandDialog>
    );
}
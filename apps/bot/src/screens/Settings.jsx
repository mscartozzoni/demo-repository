
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Settings as SettingsIcon, Users, Tags as TagsIcon, Database, Mail, Cloud, BrainCircuit, FileClock, Layers } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ManagementTab from '@/components/settings/ManagementTab';
import TagsTab from '@/components/settings/TagsTab';
import BackupTab from '@/components/settings/BackupTab';
import MailboxTab from '@/components/settings/MailboxTab';
import ConnectionsTab from '@/components/settings/ConnectionsTab';
import AITab from '@/components/settings/AITab';
import EmailLogsTab from '@/components/settings/EmailLogsTab';
import HybridConnectionStatus from '@/components/HybridConnectionStatus';

const Settings = () => {
    const tabs = [
        { value: 'management', icon: <Users className="mr-2 h-4 w-4" />, label: 'Gestão de Atendentes' },
        { value: 'tags', icon: <TagsIcon className="mr-2 h-4 w-4" />, label: 'Etiquetas' },
        { value: 'mailbox', icon: <Mail className="mr-2 h-4 w-4" />, label: 'Caixas de Entrada' },
        { value: 'ai', icon: <BrainCircuit className="mr-2 h-4 w-4" />, label: 'Inteligência Artificial' },
        { value: 'hybrid', icon: <Layers className="mr-2 h-4 w-4" />, label: 'Sistema Híbrido' },
        { value: 'connections', icon: <Cloud className="mr-2 h-4 w-4" />, label: 'Conexões' },
        { value: 'backup', icon: <Database className="mr-2 h-4 w-4" />, label: 'Backup' },
        { value: 'email_logs', icon: <FileClock className="mr-2 h-4 w-4" />, label: 'Logs de Email' },
    ];

    return (
        <>
            <Helmet>
                <title>Configurações - Gestão IA</title>
                <meta name="description" content="Gerencie as configurações do sistema." />
            </Helmet>
            <div className="container mx-auto p-4 md:p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold flex items-center">
                        <SettingsIcon className="mr-3 h-8 w-8" />
                        Configurações do Sistema
                    </h1>
                    <p className="text-muted-foreground">
                        Ajuste e personalize as funcionalidades da plataforma.
                    </p>
                </div>
                
                <Tabs defaultValue="management" className="flex flex-col md:flex-row gap-8">
                    <TabsList className="flex md:flex-col md:h-auto md:w-1/4 items-start bg-transparent p-0">
                        {tabs.map(tab => (
                            <TabsTrigger 
                                key={tab.value} 
                                value={tab.value}
                                className="w-full justify-start text-left data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-semibold"
                            >
                                {tab.icon} {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    
                    <div className="flex-1">
                        <TabsContent value="management"><ManagementTab /></TabsContent>
                        <TabsContent value="tags"><TagsTab /></TabsContent>
                        <TabsContent value="mailbox"><MailboxTab /></TabsContent>
                        <TabsContent value="ai"><AITab /></TabsContent>
                        <TabsContent value="hybrid"><HybridConnectionStatus /></TabsContent>
                        <TabsContent value="connections"><ConnectionsTab /></TabsContent>
                        <TabsContent value="backup"><BackupTab /></TabsContent>
                        <TabsContent value="email_logs"><EmailLogsTab /></TabsContent>
                    </div>
                </Tabs>
            </div>
        </>
    );
};

export default Settings;

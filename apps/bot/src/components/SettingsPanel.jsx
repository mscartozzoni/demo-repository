import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Zap, Database, Tags, HardDrive, Mail, Mailbox } from 'lucide-react';
import ManagementTab from '@/components/settings/ManagementTab';
import ConnectionsTab from '@/components/settings/ConnectionsTab';
import BackupTab from '@/components/settings/BackupTab';
import TagsTab from '@/components/settings/TagsTab';
import DatabaseTab from '@/components/settings/DatabaseTab';
import EmailLogsTab from '@/components/settings/EmailLogsTab';
import MailboxTab from '@/components/settings/MailboxTab';

const SettingsPanel = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Tabs defaultValue="management" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 md:grid-cols-7 glass-effect-strong p-1 h-auto">
          <TabsTrigger value="management" className="flex items-center justify-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">
            <User className="h-4 w-4" />
            <span>Gerenciamento</span>
          </TabsTrigger>
          <TabsTrigger value="tags" className="flex items-center justify-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">
            <Tags className="h-4 w-4" />
            <span>Etiquetas</span>
          </TabsTrigger>
           <TabsTrigger value="mailboxes" className="flex items-center justify-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">
            <Mailbox className="h-4 w-4" />
            <span>Caixas de Entrada</span>
          </TabsTrigger>
          <TabsTrigger value="connections" className="flex items-center justify-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">
            <Zap className="h-4 w-4" />
            <span>Conexões</span>
          </TabsTrigger>
           <TabsTrigger value="database" className="flex items-center justify-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">
            <HardDrive className="h-4 w-4" />
            <span>Banco de Dados</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center justify-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">
            <Mail className="h-4 w-4" />
            <span>Logs de E-mail</span>
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center justify-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">
            <Database className="h-4 w-4" />
            <span>Backup</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="management">
          <ManagementTab />
        </TabsContent>
        
        <TabsContent value="tags">
          <TagsTab />
        </TabsContent>
        
        <TabsContent value="mailboxes">
          <MailboxTab />
        </TabsContent>

        <TabsContent value="connections">
          <ConnectionsTab />
        </TabsContent>
        
        <TabsContent value="database">
          <DatabaseTab />
        </TabsContent>

        <TabsContent value="email">
          <EmailLogsTab />
        </TabsContent>

        <TabsContent value="backup">
          <BackupTab />
        </TabsContent>
        
      </Tabs>
    </motion.div>
  );
};

export default SettingsPanel;
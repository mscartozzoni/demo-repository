
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { useSupabase } from '@/contexts/SupabaseContext';
import { Download, Upload, Database, Users, MessageSquare, Tag, Mailbox, History, Settings, FileClock, Route as RouteIcon, Server } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import IntegrationCard from './IntegrationCard';

const TableCard = ({ icon, title, count }) => (
    <Card className="glass-effect-soft">
        <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                {icon}
                <span className="font-semibold text-foreground">{title}</span>
            </div>
            <Badge variant="secondary">{count}</Badge>
        </CardContent>
    </Card>
);

const BackupTab = () => {
    const { isIntegrated, backupSupabase, restoreSupabase, isLoading } = useSupabase();
    const { 
        exportData, 
        importData, 
        staffs,
        patients,
        messages,
        tags,
        mailboxes,
        systemLogs,
        emailLogs,
        patientJourneys,
    } = useData();

    const handleLocalImport = (event) => {
        const file = event.target.files[0];
        if (file) {
            importData(file);
        }
    };
    
    const handleSupabaseRestore = (event) => {
        const file = event.target.files[0];
        if (file) {
            restoreSupabase(file);
        }
    };

    const dbSchema = [
        { icon: <Users className="h-5 w-5 text-purple-400" />, title: 'Atendentes (Accounts)', count: staffs.length },
        { icon: <Users className="h-5 w-5 text-green-400" />, title: 'Leads/Pacientes', count: patients.length },
        { icon: <MessageSquare className="h-5 w-5 text-blue-400" />, title: 'Mensagens', count: messages.length },
        { icon: <Tag className="h-5 w-5 text-yellow-400" />, title: 'Etiquetas', count: tags.length },
        { icon: <Mailbox className="h-5 w-5 text-orange-400" />, title: 'Caixas de Entrada', count: mailboxes.length },
        { icon: <RouteIcon className="h-5 w-5 text-cyan-400" />, title: 'Jornadas', count: patientJourneys.length },
        { icon: <History className="h-5 w-5 text-indigo-400" />, title: 'Logs de Email', count: emailLogs.length },
        { icon: <FileClock className="h-5 w-5 text-red-400" />, title: 'Logs do Sistema', count: systemLogs.length },
        { icon: <Settings className="h-5 w-5 text-gray-400" />, title: 'Configurações', count: 1 },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Backup e Restauração</h2>
                <p className="text-muted-foreground">
                    {isIntegrated 
                        ? 'Gerencie backups do seu banco de dados Supabase.' 
                        : 'Exporte e importe o banco de dados local do sistema.'}
                </p>
            </div>
            
            <Card className="glass-effect-strong">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {isIntegrated ? <Server className="h-5 w-5 text-primary" /> : <Database className="h-5 w-5 text-primary" />}
                        Esquema de Dados {isIntegrated ? 'do Supabase' : 'Local'}
                    </CardTitle>
                    <CardDescription>Esta é a estrutura de dados que será incluída no seu backup.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dbSchema.map(table => (
                        <TableCard key={table.title} icon={table.icon} title={table.title} count={table.count} />
                    ))}
                </CardContent>
            </Card>

            {isIntegrated ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <IntegrationCard
                        icon={<Download className="h-6 w-6 text-primary-foreground" />}
                        title="Fazer Backup do Supabase"
                        description="Salvar todos os dados do Supabase em um arquivo."
                    >
                        <div className="flex-grow flex items-center justify-center">
                            <Button onClick={backupSupabase} className="w-full" disabled={isLoading}>
                                <Download className="mr-2 h-4 w-4" />
                                {isLoading ? "Fazendo Backup..." : "Fazer Backup do Supabase"}
                            </Button>
                        </div>
                    </IntegrationCard>

                    <IntegrationCard
                        icon={<Upload className="h-6 w-6 text-primary-foreground" />}
                        title="Restaurar para Supabase"
                        description="Restaurar dados para o Supabase a partir de um arquivo de backup."
                    >
                         <div className="flex-grow flex items-center justify-center">
                            <Button asChild className="w-full" variant="secondary" disabled={isLoading}>
                                <Label htmlFor="supabase-restore-file" className="cursor-pointer w-full h-full flex items-center justify-center">
                                    <Upload className="mr-2 h-4 w-4" />
                                    {isLoading ? "Restaurando..." : "Importar para Supabase"}
                                </Label>
                            </Button>
                            <Input id="supabase-restore-file" type="file" accept=".sql" className="hidden" onChange={handleSupabaseRestore} />
                        </div>
                    </IntegrationCard>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <IntegrationCard
                        icon={<Download className="h-6 w-6 text-primary-foreground" />}
                        title="Exportar Dados Locais"
                        description="Salvar os dados do navegador em um arquivo JSON."
                    >
                        <div className="flex-grow flex items-center justify-center">
                            <Button onClick={exportData} className="w-full">
                                <Download className="mr-2 h-4 w-4" />
                                Exportar Backup Local
                            </Button>
                        </div>
                    </IntegrationCard>

                    <IntegrationCard
                        icon={<Upload className="h-6 w-6 text-primary-foreground" />}
                        title="Importar Dados Locais"
                        description="Restaurar o sistema a partir de um backup JSON."
                    >
                        <div className="flex-grow flex items-center justify-center">
                            <Button asChild className="w-full" variant="secondary">
                                <Label htmlFor="local-import-file" className="cursor-pointer w-full h-full flex items-center justify-center">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Importar Backup Local
                                </Label>
                            </Button>
                            <Input id="local-import-file" type="file" accept=".json" className="hidden" onChange={handleLocalImport} />
                        </div>
                    </IntegrationCard>
                </div>
            )}
        </div>
    );
};

export default BackupTab;

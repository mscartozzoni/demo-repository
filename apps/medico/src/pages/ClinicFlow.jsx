import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Database, Download, Upload, Server, Play, Activity, AlertTriangle, CheckCircle, List, FileClock, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { runDatabaseAnalysis, runDatabaseOptimization } from '@/services/api/database';
import { mockPatientsData, mockAppointmentsData, mockSurgeriesData, mockPersonalEventsData } from '@/lib/mockData';

const StatCard = ({ icon, title, value, description, color }) => (
    <Card className="bg-slate-800/50 border-slate-700/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">{title}</CardTitle>
            {React.cloneElement(icon, { className: `h-5 w-5 ${color}` })}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold text-white">{value}</div>
            <p className="text-xs text-slate-400">{description}</p>
        </CardContent>
    </Card>
);

const BackupManager = () => {
    const { toast } = useToast();
    const [backups, setBackups] = useState([]);
    const [restoring, setRestoring] = useState(false);

    useEffect(() => {
        const storedBackups = JSON.parse(localStorage.getItem('db_backups') || '[]');
        setBackups(storedBackups);
    }, []);

    const createBackup = () => {
        const timestamp = new Date().toISOString();
        const backupData = {
            patients: mockPatientsData,
            appointments: mockAppointmentsData,
            surgeries: mockSurgeriesData,
            personalEvents: mockPersonalEventsData,
        };

        const backupEntry = {
            id: timestamp,
            timestamp,
            size: (JSON.stringify(backupData).length / 1024).toFixed(2), // KB
        };

        try {
            localStorage.setItem(`backup_${timestamp}`, JSON.stringify(backupData));
            const updatedBackups = [backupEntry, ...backups].slice(0, 10); // Keep last 10
            localStorage.setItem('db_backups', JSON.stringify(updatedBackups));
            setBackups(updatedBackups);

            toast({
                title: 'Backup Criado com Sucesso!',
                description: `Backup de ${backupEntry.size} KB salvo localmente.`,
                className: 'bg-green-600 text-white'
            });
        } catch (error) {
            console.error("Backup error:", error);
            toast({
                variant: 'destructive',
                title: 'Erro no Backup',
                description: 'Não foi possível salvar o backup. O armazenamento local pode estar cheio.',
            });
        }
    };

    const restoreBackup = (timestamp) => {
        setRestoring(true);
        toast({
            title: 'Restaurando Backup...',
            description: 'Por favor, aguarde. Isto é uma simulação e não afetará os dados reais.',
        });

        setTimeout(() => {
            const backupData = localStorage.getItem(`backup_${timestamp}`);
            if (backupData) {
                // In a real app, you would update your state here
                // e.g., setPatients(JSON.parse(backupData).patients);
                toast({
                    title: 'Restauração Concluída (Simulação)',
                    description: `Os dados do backup de ${new Date(timestamp).toLocaleString('pt-BR')} foram carregados.`,
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Falha na Restauração',
                    description: 'Não foi possível encontrar os dados do backup.',
                });
            }
            setRestoring(false);
        }, 2000);
    };

    return (
        <Card className="bg-slate-800/30 border-slate-700/60 mt-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-white"><FileClock className="w-5 h-5 text-blue-400" /> Histórico de Backups</CardTitle>
                <CardDescription>Crie e restaure backups dos dados da aplicação. Os backups são salvos no armazenamento local do seu navegador.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={createBackup} className="w-full sm:w-auto">
                    <Download className="w-4 h-4 mr-2" />
                    Criar Novo Backup
                </Button>
                <div className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-2">
                    {backups.length > 0 ? backups.map(b => (
                        <div key={b.id} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                            <div>
                                <p className="font-mono text-sm text-slate-300">ID: {b.id.slice(0, 19).replace('T', ' ')}</p>
                                <p className="text-xs text-slate-400">Tamanho: {b.size} KB</p>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => restoreBackup(b.timestamp)} disabled={restoring}>
                                <Upload className="w-4 h-4 mr-2" />
                                {restoring ? 'Restaurando...' : 'Restaurar'}
                            </Button>
                        </div>
                    )) : (
                        <p className="text-center text-slate-400 py-4">Nenhum backup encontrado.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};


const DatabaseOptimizer = () => {
    const [analysis, setAnalysis] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [optimizationLogs, setOptimizationLogs] = useState([]);
    const { toast } = useToast();

    const handleAnalysis = async () => {
        setIsLoading(true);
        setAnalysis(null);
        const { success, data } = await runDatabaseAnalysis();
        if (success) {
            setAnalysis(data);
            toast({ title: "Análise Concluída", description: "O estado do banco de dados foi verificado." });
        } else {
            toast({ variant: 'destructive', title: "Erro na Análise" });
        }
        setIsLoading(false);
    };
    
    const handleOptimization = async () => {
        setIsOptimizing(true);
        setOptimizationLogs([]);
        const { success, data } = await runDatabaseOptimization((log) => {
            setOptimizationLogs(prev => [...prev, log]);
        });
        if (success) {
            setAnalysis(data);
            toast({ title: "Otimização Concluída!", className: "bg-green-600 text-white" });
        } else {
            toast({ variant: 'destructive', title: "Erro na Otimização" });
        }
        setIsOptimizing(false);
    };

    return (
        <Card className="bg-slate-800/30 border-slate-700/60 mt-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-white"><Activity className="w-5 h-5 text-green-400" /> Otimizador de Banco de Dados</CardTitle>
                <CardDescription>Analise a saúde do banco de dados e execute otimizações para manter a performance.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="flex flex-col sm:flex-row gap-4">
                    <Button onClick={handleAnalysis} disabled={isLoading || isOptimizing} className="flex-1">
                        <Server className="w-4 h-4 mr-2" />
                        {isLoading ? 'Analisando...' : 'Analisar Performance'}
                    </Button>
                    <Button onClick={handleOptimization} disabled={isLoading || isOptimizing || !analysis} variant="gooeyRight" className="flex-1">
                        <Play className="w-4 h-4 mr-2" />
                        {isOptimizing ? 'Otimizando...' : 'Iniciar Otimização'}
                    </Button>
                </div>
                
                <AnimatePresence>
                {analysis && !isOptimizing && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6">
                        <h3 className="font-semibold text-slate-300 mb-2">Resultado da Análise:</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                            <StatCard icon={<CheckCircle/>} title="Saúde dos Índices" value={`${analysis.indexHealth}%`} description="Eficiência das buscas" color="text-green-400" />
                            <StatCard icon={<AlertTriangle/>} title="Bloat da Tabela" value={`${analysis.tableBloat}%`} description="Espaço desperdiçado" color="text-yellow-400"/>
                            <StatCard icon={<Activity/>} title="Performance de Queries" value={`${analysis.queryPerformance}%`} description="Velocidade das consultas" color="text-blue-400"/>
                        </div>
                        <div>
                             <h4 className="font-semibold text-slate-300 flex items-center gap-2 mb-2"><List /> Recomendações:</h4>
                             <ul className="space-y-2 text-sm">
                                {analysis.recommendations.map((rec, i) => (
                                    <li key={i} className="flex items-start gap-2 p-2 bg-slate-800/40 rounded-md">
                                        <AlertTriangle className="w-4 h-4 text-amber-400 mt-1 shrink-0"/> 
                                        <span className="text-slate-400">{rec}</span>
                                    </li>
                                ))}
                             </ul>
                        </div>
                    </motion.div>
                )}
                </AnimatePresence>
                 <AnimatePresence>
                 {isOptimizing && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-4 bg-black rounded-lg border border-slate-700 font-mono text-sm max-h-60 overflow-y-auto">
                        <div className="flex items-center gap-2 text-slate-400 mb-2">
                           <Terminal className="w-4 h-4"/> <span>Logs da Otimização em Tempo Real</span>
                        </div>
                        {optimizationLogs.map((log, i) => (
                            <p key={i} className="text-green-400">
                                <span className="text-slate-500 mr-2">{log.timestamp}</span>
                                {log.message}
                            </p>
                        ))}
                    </motion.div>
                )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
};


const ClinicFlow = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Gerenciador de Banco de Dados - Portal do Médico</title>
        <meta name="description" content="Gerencie backups e otimize a performance do banco de dados." />
      </Helmet>
      
      <div className="bg-slate-900 min-h-screen text-white">
        <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/80 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800" onClick={() => navigate('/medico/dashboard')} >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                </Button>
                <div className="h-6 w-px bg-slate-700" />
                <h1 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Database className="w-5 h-5"/>
                    Gerenciador de Banco de Dados
                </h1>
            </div>
        </div>

        <main className="pt-[75px] p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <BackupManager />
                <DatabaseOptimizer />
            </motion.div>
        </main>
      </div>
    </>
  );
};

export default ClinicFlow;
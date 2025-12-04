import React, { useState, useEffect } from 'react';
    import { Helmet } from 'react-helmet';
    import { motion } from 'framer-motion';
    import { DatabaseZap, Database, Search, Sparkles, History, Loader2, BarChart, FileText, Activity, AlertTriangle } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Progress } from '@/components/ui/progress';
    import { runDatabaseAnalysis, runDatabaseOptimization } from '@/services/api/database';

    const DatabaseOptimization = () => {
        const { toast } = useToast();
        const [analysis, setAnalysis] = useState(null);
        const [isAnalyzing, setIsAnalyzing] = useState(false);
        const [isOptimizing, setIsOptimizing] = useState(false);
        const [optimizationLog, setOptimizationLog] = useState([]);

        const handleAnalyze = async () => {
            setIsAnalyzing(true);
            setAnalysis(null);
            setOptimizationLog([]);
            toast({
                title: 'Analisando o Banco de Dados...',
                description: 'Isso pode levar alguns instantes. Estamos verificando a saúde das suas tabelas e índices.',
            });
            const result = await runDatabaseAnalysis();
            if (result.success) {
                setAnalysis(result.data);
                toast({
                    title: 'Análise Concluída!',
                    description: 'Verifique os resultados e prossiga com a otimização, se necessário.',
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Erro na Análise',
                    description: 'Não foi possível analisar o banco de dados.',
                });
            }
            setIsAnalyzing(false);
        };

        const handleOptimize = async () => {
            setIsOptimizing(true);
            setOptimizationLog([]);
            toast({
                title: 'Otimização em Andamento...',
                description: 'Executando tarefas de manutenção. Seu portal permanecerá online.',
            });
            
            const result = await runDatabaseOptimization((log) => {
                 setOptimizationLog(prev => [...prev, log]);
            });

            if (result.success) {
                setAnalysis(result.data);
                 toast({
                    title: 'Banco de Dados Otimizado!',
                    description: 'As tarefas de manutenção foram concluídas com sucesso.',
                });
            } else {
                 toast({
                    variant: 'destructive',
                    title: 'Erro na Otimização',
                    description: 'Não foi possível otimizar o banco de dados.',
                });
            }

            setIsOptimizing(false);
        };
        
        const MetricCard = ({ icon, title, value, description, colorClass = 'text-green-400' }) => (
            <Card className="bg-slate-800/60 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">{title}</CardTitle>
                    {icon}
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${colorClass}`}>{value}</div>
                    <p className="text-xs text-slate-400">{description}</p>
                </CardContent>
            </Card>
        );

        return (
            <>
                <Helmet>
                    <title>Otimização de Banco de Dados - Portal do Médico</title>
                    <meta name="description" content="Analise e otimize a performance do seu banco de dados." />
                </Helmet>
                <div className="space-y-8">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-4xl font-extrabold text-white flex items-center gap-3">
                                    <DatabaseZap className="w-10 h-10 text-cyan-400" />
                                    Otimização de Banco de Dados
                                </h1>
                                <p className="text-lg text-slate-300 mt-2">Mantenha a performance do seu banco de dados em dia.</p>
                            </div>
                            <div className="flex gap-2">
                                <Button size="lg" onClick={handleAnalyze} disabled={isAnalyzing || isOptimizing}>
                                    {isAnalyzing ? (
                                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analisando...</>
                                    ) : (
                                        <><Search className="mr-2 h-5 w-5" /> Analisar Agora</>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                    {isAnalyzing && (
                        <div className="text-center p-8 bg-slate-800/50 rounded-xl">
                            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white">Realizando análise completa...</h3>
                            <p className="text-slate-400">Estamos inspecionando tabelas, índices e performance de queries.</p>
                        </div>
                    )}

                    {analysis && !isAnalyzing && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <Card className="glass-effect">
                                <CardHeader>
                                    <CardTitle className="text-2xl text-white">Resultados da Análise</CardTitle>
                                    <CardDescription>Última verificação: {new Date(analysis.lastAnalyzed).toLocaleString()}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                       <MetricCard icon={<BarChart className="h-4 w-4 text-slate-400"/>} title="Saúde dos Índices" value={`${analysis.indexHealth}%`} description="Eficiência dos índices em queries." colorClass={analysis.indexHealth > 80 ? 'text-green-400' : 'text-yellow-400'}/>
                                       <MetricCard icon={<FileText className="h-4 w-4 text-slate-400"/>} title="Inchaço das Tabelas (Bloat)" value={`${analysis.tableBloat}%`} description="Espaço desperdiçado em tabelas." colorClass={analysis.tableBloat < 10 ? 'text-green-400' : 'text-red-400'}/>
                                       <MetricCard icon={<Activity className="h-4 w-4 text-slate-400"/>} title="Performance de Queries" value={`${analysis.queryPerformance}%`} description="Velocidade média das consultas." />
                                    </div>
                                    
                                    {analysis.recommendations.length > 0 && (
                                        <div className="p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
                                            <h4 className="font-semibold text-yellow-300 flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Recomendações</h4>
                                            <ul className="list-disc list-inside text-yellow-400/90 mt-2 space-y-1 text-sm">
                                                {analysis.recommendations.map((rec, index) => (
                                                    <li key={index}>{rec}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <Button size="lg" className="w-full" onClick={handleOptimize} disabled={isOptimizing}>
                                        {isOptimizing ? (
                                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Otimizando...</>
                                        ) : (
                                            <><Sparkles className="mr-2 h-5 w-5" /> Iniciar Otimização Automática</>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                    
                    {(isOptimizing || optimizationLog.length > 0) && (
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <Card className="glass-effect">
                                <CardHeader>
                                    <CardTitle className="text-2xl text-white flex items-center gap-2"><History /> Log de Otimização</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-slate-900/70 p-4 rounded-lg font-mono text-sm space-y-2 max-h-60 overflow-y-auto">
                                        {optimizationLog.map((log, index) => (
                                            <p key={index} className="text-slate-300 animate-in fade-in duration-500">
                                                <span className="text-cyan-400">[{log.timestamp}]</span> {log.message}
                                            </p>
                                        ))}
                                         {isOptimizing && <p className="text-slate-400 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin"/> Executando...</p>}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {!analysis && !isAnalyzing && (
                         <div className="text-center p-8 bg-slate-800/50 rounded-xl border border-dashed border-slate-700">
                            <Database className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white">Pronto para começar?</h3>
                            <p className="text-slate-400">Clique em "Analisar Agora" para obter um diagnóstico completo da saúde do seu banco de dados.</p>
                        </div>
                    )}
                </div>
            </>
        );
    };

    export default DatabaseOptimization;
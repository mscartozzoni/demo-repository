import React, { useState } from 'react';
    import { Helmet } from 'react-helmet';
    import { motion } from 'framer-motion';
    import { BrainCircuit, Play, CheckCircle, AlertTriangle, Loader2, Lightbulb, Settings, Shield, Zap } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Progress } from '@/components/ui/progress';
    import { runAIAudit, applyAIAuditFixes } from '@/services/api/aiAudit';

    const AIAudit = () => {
        const { toast } = useToast();
        const [auditResults, setAuditResults] = useState(null);
        const [isAuditing, setIsAuditing] = useState(false);
        const [isApplyingFixes, setIsApplyingFixes] = useState(false);
        const [auditLog, setAuditLog] = useState([]);

        const handleRunAudit = async () => {
            setIsAuditing(true);
            setAuditResults(null);
            setAuditLog([]);
            toast({
                title: 'Iniciando Auditoria de IA...',
                description: 'Nossa inteligência artificial está analisando seu sistema em busca de otimizações.',
            });

            const result = await runAIAudit((log) => {
                setAuditLog(prev => [...prev, log]);
            });

            if (result.success) {
                setAuditResults(result.data);
                toast({
                    title: 'Auditoria Concluída!',
                    description: 'A IA encontrou algumas oportunidades de melhoria.',
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Erro na Auditoria',
                    description: 'Não foi possível completar a auditoria de IA.',
                });
            }
            setIsAuditing(false);
        };

        const handleApplyFixes = async () => {
            setIsApplyingFixes(true);
            setAuditLog([]); // Clear log for new action
            toast({
                title: 'Aplicando Correções de IA...',
                description: 'Aguarde enquanto a IA otimiza seu sistema.',
            });

            const result = await applyAIAuditFixes((log) => {
                setAuditLog(prev => [...prev, log]);
            });

            if (result.success) {
                setAuditResults(result.data); // Update results after fixes
                toast({
                    title: 'Correções Aplicadas!',
                    description: 'Seu sistema foi otimizado pela IA.',
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Erro ao Aplicar Correções',
                    description: 'Não foi possível aplicar as correções de IA.',
                });
            }
            setIsApplyingFixes(false);
        };

        const AuditMetricCard = ({ icon, title, value, description, colorClass = 'text-green-400' }) => (
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
                    <title>Auditoria de IA - Portal do Médico</title>
                    <meta name="description" content="Analise e otimize seu sistema com inteligência artificial." />
                </Helmet>
                <div className="space-y-8">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-4xl font-extrabold text-white flex items-center gap-3">
                                    <BrainCircuit className="w-10 h-10 text-purple-400" />
                                    Auditoria de IA
                                </h1>
                                <p className="text-lg text-slate-300 mt-2">Deixe a inteligência artificial otimizar seu sistema.</p>
                            </div>
                            <div className="flex gap-2">
                                <Button size="lg" onClick={handleRunAudit} disabled={isAuditing || isApplyingFixes}>
                                    {isAuditing ? (
                                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Auditando...</>
                                    ) : (
                                        <><Play className="mr-2 h-5 w-5" /> Iniciar Auditoria</>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                    {isAuditing && (
                        <div className="text-center p-8 bg-slate-800/50 rounded-xl">
                            <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white">A IA está trabalhando...</h3>
                            <p className="text-slate-400">Analisando performance, segurança e usabilidade.</p>
                            <div className="mt-4">
                                <Progress value={auditLog.length * 100 / 7} className="w-full" />
                            </div>
                        </div>
                    )}

                    {auditResults && !isAuditing && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <Card className="glass-effect">
                                <CardHeader>
                                    <CardTitle className="text-2xl text-white">Resultados da Auditoria</CardTitle>
                                    <CardDescription>Última auditoria: {new Date(auditResults.lastAudited).toLocaleString()}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                       <AuditMetricCard icon={<Zap className="h-4 w-4 text-slate-400"/>} title="Performance" value={`${auditResults.performanceScore}%`} description="Velocidade e eficiência do sistema." colorClass={auditResults.performanceScore > 85 ? 'text-green-400' : 'text-yellow-400'}/>
                                       <AuditMetricCard icon={<Shield className="h-4 w-4 text-slate-400"/>} title="Segurança" value={`${auditResults.securityScore}%`} description="Resistência a vulnerabilidades." colorClass={auditResults.securityScore > 90 ? 'text-green-400' : 'text-red-400'}/>
                                       <AuditMetricCard icon={<Lightbulb className="h-4 w-4 text-slate-400"/>} title="Usabilidade" value={`${auditResults.usabilityScore}%`} description="Experiência do usuário e interface." colorClass={auditResults.usabilityScore > 80 ? 'text-green-400' : 'text-yellow-400'}/>
                                    </div>
                                    
                                    {auditResults.recommendations.length > 0 && (
                                        <div className="p-4 bg-purple-900/30 border border-purple-700 rounded-lg">
                                            <h4 className="font-semibold text-purple-300 flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Recomendações da IA</h4>
                                            <ul className="list-disc list-inside text-purple-400/90 mt-2 space-y-1 text-sm">
                                                {auditResults.recommendations.map((rec, index) => (
                                                    <li key={index}>{rec}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <Button size="lg" className="w-full" onClick={handleApplyFixes} disabled={isApplyingFixes}>
                                        {isApplyingFixes ? (
                                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Aplicando Correções...</>
                                        ) : (
                                            <><CheckCircle className="mr-2 h-5 w-5" /> Aplicar Correções de IA</>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                    
                    {(isApplyingFixes || auditLog.length > 0) && (
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <Card className="glass-effect">
                                <CardHeader>
                                    <CardTitle className="text-2xl text-white flex items-center gap-2"><Settings /> Log de Atividade da IA</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-slate-900/70 p-4 rounded-lg font-mono text-sm space-y-2 max-h-60 overflow-y-auto">
                                        {auditLog.map((log, index) => (
                                            <p key={index} className="text-slate-300 animate-in fade-in duration-500">
                                                <span className="text-purple-400">[{log.timestamp}]</span> {log.message}
                                            </p>
                                        ))}
                                         {isApplyingFixes && <p className="text-slate-400 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin"/> Executando...</p>}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {!auditResults && !isAuditing && (
                         <div className="text-center p-8 bg-slate-800/50 rounded-xl border border-dashed border-slate-700">
                            <BrainCircuit className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white">Pronto para otimizar seu sistema?</h3>
                            <p className="text-slate-400">Clique em "Iniciar Auditoria" para que nossa IA encontre as melhores otimizações para você.</p>
                        </div>
                    )}
                </div>
            </>
        );
    };

    export default AIAudit;
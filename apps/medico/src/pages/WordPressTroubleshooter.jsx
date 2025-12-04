import React, { useState } from 'react';
    import { Helmet } from 'react-helmet';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Wand2, Dna, ShieldCheck, GaugeCircle, Puzzle, Loader2, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { useToast } from '@/components/ui/use-toast';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { analyzeSite } from '@/services/api/wordpress';

    const issueIcons = {
        performance: <GaugeCircle className="w-6 h-6 text-blue-400" />,
        security: <ShieldCheck className="w-6 h-6 text-green-400" />,
        plugins: <Puzzle className="w-6 h-6 text-purple-400" />,
    };

    const WordPressTroubleshooter = () => {
        const { toast } = useToast();
        const [url, setUrl] = useState('');
        const [isLoading, setIsLoading] = useState(false);
        const [analysisResult, setAnalysisResult] = useState(null);
        const [fixingIssues, setFixingIssues] = useState({});

        const handleAnalyze = async () => {
            if (!url) {
                toast({
                    variant: 'destructive',
                    title: 'URL Inválida',
                    description: 'Por favor, insira a URL do seu site WordPress.',
                });
                return;
            }
            setIsLoading(true);
            setAnalysisResult(null);
            try {
                const result = await analyzeSite(url);
                if (result.success) {
                    setAnalysisResult(result.data);
                    toast({
                        title: 'Análise Concluída!',
                        description: `Encontramos ${result.data.issues.length} problemas no seu site.`,
                    });
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                toast({
                    variant: 'destructive',
                    title: 'Erro na Análise',
                    description: error.message || 'Não foi possível analisar o site.',
                });
            } finally {
                setIsLoading(false);
            }
        };
        
        const handleAutoFix = async (issueId) => {
            setFixingIssues(prev => ({ ...prev, [issueId]: true }));
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate fixing
            
            setAnalysisResult(prev => ({
                ...prev,
                issues: prev.issues.map(issue => 
                    issue.id === issueId ? { ...issue, status: 'fixed' } : issue
                )
            }));
            
            setFixingIssues(prev => ({ ...prev, [issueId]: false }));
            toast({
                title: 'Problema Corrigido!',
                description: `A correção automática para "${analysisResult.issues.find(i => i.id === issueId).title}" foi aplicada.`,
                className: 'bg-green-600 text-white'
            });
        };

        return (
            <>
                <Helmet>
                    <title>WordPress AI Troubleshooter - Portal do Médico</title>
                    <meta name="description" content="Use a IA para diagnosticar e corrigir problemas no seu site WordPress." />
                </Helmet>
                <div className="space-y-8">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-4xl font-extrabold text-white flex items-center gap-3">
                                    <Wand2 className="w-10 h-10 text-primary" />
                                    WordPress AI Troubleshooter
                                </h1>
                                <p className="text-lg text-slate-300 mt-2">Diagnostique e corrija problemas do seu site com o poder da IA.</p>
                            </div>
                        </div>
                    </motion.div>

                    <Card className="glass-effect p-6 rounded-xl">
                        <CardHeader className="p-0 mb-6">
                            <CardTitle className="text-2xl text-white">Analisar seu Site</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <Dna className="w-6 h-6 text-slate-400 hidden sm:block" />
                                <Input
                                    type="url"
                                    placeholder="https://exemplo.com"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="flex-grow bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 h-12 text-base"
                                    disabled={isLoading}
                                />
                                <Button size="lg" onClick={handleAnalyze} disabled={isLoading} className="w-full sm:w-auto">
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Analisando...
                                        </>
                                    ) : (
                                        <>
                                            Analisar com IA
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <AnimatePresence>
                        {analysisResult && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-3xl font-bold text-white">Resultados da Análise</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {analysisResult.issues.map((issue) => (
                                        <motion.div
                                            key={issue.id}
                                            layout
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                                        >
                                            <Card className={`glass-effect rounded-xl overflow-hidden ${issue.status === 'fixed' ? 'border-green-500/50' : 'border-slate-700'}`}>
                                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                    <CardTitle className="text-lg font-medium text-white">{issue.title}</CardTitle>
                                                    {issueIcons[issue.category] || <AlertTriangle className="w-6 h-6 text-yellow-400" />}
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-sm text-slate-400 mb-4">{issue.description}</p>
                                                    {issue.status === 'detected' ? (
                                                        <Button onClick={() => handleAutoFix(issue.id)} disabled={fixingIssues[issue.id]} className="w-full">
                                                            {fixingIssues[issue.id] ? (
                                                                <>
                                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                    Corrigindo...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Wand2 className="mr-2 h-4 w-4" />
                                                                    Correção Automática
                                                                </>
                                                            )}
                                                        </Button>
                                                    ) : (
                                                        <div className="flex items-center justify-center gap-2 text-green-400 font-semibold p-2 bg-green-500/10 rounded-md">
                                                            <CheckCircle className="w-5 h-5" />
                                                            <span>Problema Corrigido</span>
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </>
        );
    };

    export default WordPressTroubleshooter;
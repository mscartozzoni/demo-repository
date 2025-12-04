import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Bug, Search, Loader2, ServerCrash, User, Clock, AlertTriangle, Info, CheckCircle, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { getErrorLogs } from '@/services/api/errorLogs';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};


const ErrorLogs = () => {
    const { toast } = useToast();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [severityFilter, setSeverityFilter] = useState('all');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const fetchLogs = useCallback(async () => {
        try {
            setLoading(true);
            const filters = {
                severity: severityFilter,
                search: debouncedSearchTerm,
            };
            const result = await getErrorLogs(filters);
            if (result.success) {
                setLogs(result.data);
                setError(null);
            } else {
                setError('Falha ao carregar os logs de erro. Tente novamente mais tarde.');
                toast({ variant: 'destructive', title: 'Erro', description: result.message });
            }
        } catch (e) {
            setError('Ocorreu um erro inesperado.');
            toast({ variant: 'destructive', title: 'Erro de Conexão', description: e.message });
        } finally {
            setLoading(false);
        }
    }, [toast, severityFilter, debouncedSearchTerm]);


    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const getSeverityIcon = (severity) => {
        switch (severity) {
            case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
            case 'warn': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
            case 'info': return <Info className="w-4 h-4 text-blue-500" />;
            case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
            default: return <Bug className="w-4 h-4 text-gray-500" />;
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'error': return 'bg-red-500/20 text-red-300';
            case 'warn': return 'bg-yellow-500/20 text-yellow-300';
            case 'info': return 'bg-blue-500/20 text-blue-300';
            case 'success': return 'bg-green-500/20 text-green-300';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="h-48 flex flex-col items-center justify-center bg-slate-800/50 rounded-lg text-center p-4">
                    <Loader2 className="w-12 h-12 text-slate-500 animate-spin mb-4" />
                    <h4 className="font-semibold text-white">Carregando logs...</h4>
                    <p className="text-sm text-slate-400">Só um instante, por favor.</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="h-48 flex flex-col items-center justify-center bg-red-900/20 border border-red-700 rounded-lg text-center p-4">
                    <ServerCrash className="w-12 h-12 text-red-400 mb-4" />
                    <h4 className="font-semibold text-white">Erro ao Carregar</h4>
                    <p className="text-sm text-red-300">{error}</p>
                </div>
            );
        }

        if (logs.length === 0) {
            return (
                <div className="h-48 flex flex-col items-center justify-center bg-slate-800/50 rounded-lg text-center p-4">
                    <Bug className="w-16 h-16 text-slate-600 mb-4" />
                    <h4 className="font-semibold text-white">Nenhum log de erro encontrado</h4>
                    <p className="text-sm text-slate-400">Parece que tudo está funcionando perfeitamente!</p>
                </div>
            );
        }

        return (
            <div className="space-y-3">
                {logs.map(log => (
                    <motion.div
                        key={log.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="glass-effect p-4 rounded-xl"
                    >
                        <Collapsible>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" className="w-full justify-between items-center p-0 h-auto">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${getSeverityColor(log.severity)}`}>
                                            {getSeverityIcon(log.severity)}
                                        </div>
                                        <div className="text-left">
                                            <p className="font-semibold text-white line-clamp-1">{log.error_message}</p>
                                            <div className="flex items-center text-sm text-slate-400 gap-2 mt-1">
                                                <Clock className="w-4 h-4" />
                                                <span>{formatDistanceToNow(new Date(log.created_at), { addSuffix: true, locale: ptBR })}</span>
                                                {log.user && (
                                                    <>
                                                        <User className="w-4 h-4 ml-2" />
                                                        <span>{log.user.full_name || log.user.email}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-180" />
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="pt-4 text-sm text-slate-300 space-y-2 border-t border-border mt-4">
                                {log.context?.functionName && (
                                    <p><strong>Função:</strong> {log.context.functionName}</p>
                                )}
                                {log.context?.originalError?.message && (
                                    <p><strong>Erro Original:</strong> {log.context.originalError.message}</p>
                                )}
                                {log.error_stack && (
                                    <div>
                                        <strong>Stack Trace:</strong>
                                        <pre className="bg-slate-900 p-2 rounded-md text-xs overflow-x-auto mt-1">{log.error_stack}</pre>
                                    </div>
                                )}
                                {log.component_stack && (
                                    <div>
                                        <strong>Component Stack:</strong>
                                        <pre className="bg-slate-900 p-2 rounded-md text-xs overflow-x-auto mt-1">{log.component_stack}</pre>
                                    </div>
                                )}
                                {log.context && Object.keys(log.context).length > 0 && (
                                    <div>
                                        <strong>Contexto:</strong>
                                        <pre className="bg-slate-900 p-2 rounded-md text-xs overflow-x-auto mt-1">{JSON.stringify(log.context, null, 2)}</pre>
                                    </div>
                                )}
                            </CollapsibleContent>
                        </Collapsible>
                    </motion.div>
                ))}
            </div>
        );
    };

    return (
        <>
            <Helmet>
                <title>Logs de Erro - Portal do Médico</title>
                <meta name="description" content="Visualize e gerencie os logs de erro do sistema." />
            </Helmet>
            <div className="space-y-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-4xl font-extrabold text-white flex items-center gap-3">
                                <Bug className="w-10 h-10" />
                                Logs de Erro
                            </h1>
                            <p className="text-lg text-slate-300 mt-2">
                                Monitore e analise os erros que ocorrem no sistema.
                            </p>
                        </div>
                    </div>
                </motion.div>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <Input
                            placeholder="Buscar por mensagem de erro, usuário ou função..."
                            className="pl-12 pr-4 py-6 text-base bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select value={severityFilter} onValueChange={setSeverityFilter}>
                        <SelectTrigger className="w-full md:w-[180px] bg-slate-800/50 border-slate-700 text-white">
                            <SelectValue placeholder="Filtrar por Severidade" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas as Severidades</SelectItem>
                            <SelectItem value="error">Erro</SelectItem>
                            <SelectItem value="warn">Aviso</SelectItem>
                            <SelectItem value="info">Informação</SelectItem>
                            <SelectItem value="success">Sucesso</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="glass-effect p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-white mb-4">Registros Recentes</h3>
                    {renderContent()}
                </div>
            </div>
        </>
    );
};

export default ErrorLogs;
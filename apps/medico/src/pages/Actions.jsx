import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { getActions, updateAction } from '@/services/api/actions';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, ListTodo, ListChecks, ExternalLink, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import NewsCarousel from '@/components/actions/NewsCarousel';
import useApi from '@/hooks/useApi';

const ActionItem = ({ action, onUpdate }) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleCheck = async (checked) => {
        setIsUpdating(true);
        const updates = { 
            is_completed: checked,
            completed_at: checked ? new Date().toISOString() : null,
        };
        const result = await updateAction(action.id, updates);
        if (result.success) {
            onUpdate(result.data);
             toast({
                title: `Tarefa ${checked ? 'concluída' : 'reaberta'}!`,
                description: action.title,
            });
        } else {
            toast({
                variant: 'destructive',
                title: 'Erro ao atualizar tarefa',
                description: result.message,
            });
        }
        setIsUpdating(false);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-lg group"
        >
            <Checkbox
                id={`action-${action.id}`}
                checked={action.is_completed}
                onCheckedChange={handleCheck}
                disabled={isUpdating}
                className="mt-1"
            />
            <div className="flex-1">
                <label
                    htmlFor={`action-${action.id}`}
                    className={`font-medium text-white transition-colors cursor-pointer ${action.is_completed ? 'line-through text-slate-500' : ''}`}
                >
                    {action.title}
                </label>
                {action.description && <p className="text-sm text-slate-400 mt-1">{action.description}</p>}
                <div className="text-xs text-slate-500 mt-2 flex items-center gap-4">
                    <span>
                        Criada em: {format(new Date(action.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </span>
                    {action.due_date && <span>Vencimento: {format(new Date(action.due_date), "dd/MM/yyyy", { locale: ptBR })}</span>}
                </div>
            </div>
             <div className="flex items-center gap-2">
                {action.patient_id && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => navigate(`/medico/prontuarios/${action.patient_id}`)}
                    >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ver Prontuário
                    </Button>
                )}
                {isUpdating && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
            </div>
        </motion.div>
    );
};

const ActionsList = ({ actions, onUpdate, loading, error, onRetry }) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center bg-slate-800/30 rounded-lg text-red-400">
                <AlertTriangle className="w-12 h-12 mb-4" />
                <h3 className="text-xl font-semibold">Erro ao carregar tarefas</h3>
                <p className="text-sm mb-4">{error}</p>
                <Button onClick={onRetry} variant="destructive">Tentar Novamente</Button>
            </div>
        );
    }
    
    if (!actions || actions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center bg-slate-800/30 rounded-lg">
                <ListChecks className="w-16 h-16 text-slate-600 mb-4" />
                <h3 className="text-xl font-semibold text-white">Tudo em ordem!</h3>
                <p className="text-slate-400">Nenhuma tarefa encontrada nesta categoria.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {actions.map(action => (
                <ActionItem key={action.id} action={action} onUpdate={onUpdate} />
            ))}
        </div>
    );
};

const Actions = () => {
    const { data: actions, setData: setActions, loading, error, execute: fetchActions } = useApi(getActions, { initialData: [] });

    const handleActionUpdate = (updatedAction) => {
        setActions(prev => prev.map(a => a.id === updatedAction.id ? updatedAction : a));
    };

    const pendingActions = actions.filter(a => !a.is_completed);
    const completedActions = actions.filter(a => a.is_completed);

    return (
        <>
            <Helmet>
                <title>Painel de Ações - Portal do Médico</title>
                <meta name="description" content="Gerencie todas as suas tarefas e ações pendentes." />
            </Helmet>
            <div className="space-y-6">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <h1 className="text-4xl font-extrabold text-white flex items-center gap-3">
                        <ListTodo className="w-10 h-10 text-blue-400" />
                        Painel de Ações
                    </h1>
                    <p className="text-lg text-slate-300 mt-2">
                        Visualize e gerencie suas tarefas e notificações importantes em um só lugar.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Tabs defaultValue="pending" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 max-w-md">
                                <TabsTrigger value="pending">Pendentes ({loading || error ? '...' : pendingActions.length})</TabsTrigger>
                                <TabsTrigger value="completed">Concluídas ({loading || error ? '...' : completedActions.length})</TabsTrigger>
                            </TabsList>
                            <TabsContent value="pending">
                                <Card className="bg-card/50 backdrop-blur-lg border-slate-700">
                                    <CardHeader>
                                        <CardTitle>Tarefas Pendentes</CardTitle>
                                        <CardDescription>Ações que requerem sua atenção.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ActionsList actions={pendingActions} onUpdate={handleActionUpdate} loading={loading} error={error} onRetry={fetchActions} />
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="completed">
                                 <Card className="bg-card/50 backdrop-blur-lg border-slate-700">
                                    <CardHeader>
                                        <CardTitle>Tarefas Concluídas</CardTitle>
                                        <CardDescription>Histórico de ações finalizadas.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ActionsList actions={completedActions} onUpdate={handleActionUpdate} loading={loading} error={error} onRetry={fetchActions} />
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="lg:col-span-1">
                        <NewsCarousel />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Actions;
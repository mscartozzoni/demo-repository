import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useApi } from '@/contexts/ApiContext';
import { Loader2, CircleDollarSign, Filter } from 'lucide-react';
import BudgetCard from '@/components/budget/BudgetCard';
import { Button } from '@/components/ui/button';

const Budget = () => {
    const { getBudgets, updateBudgetStatus, loading } = useApi();
    const [budgets, setBudgets] = useState([]);
    const [filter, setFilter] = useState('todos');

    const fetchBudgets = useCallback(async () => {
        const data = await getBudgets();
        setBudgets(data || []);
    }, [getBudgets]);

    useEffect(() => {
        fetchBudgets();
    }, [fetchBudgets]);

    const handleUpdateStatus = async (budgetId, status) => {
        await updateBudgetStatus(budgetId, status);
        fetchBudgets(); // Refresh list
    };

    const filteredBudgets = budgets.filter(budget => {
        if (filter === 'todos') return true;
        return budget.status === filter;
    });
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <>
            <Helmet>
                <title>Gestão de Orçamentos - Portal Unificado</title>
                <meta name="description" content="Crie, envie e gerencie orçamentos de procedimentos para pacientes." />
            </Helmet>
            <div className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-center gap-4"
                >
                    <div >
                        <h1 className="text-3xl font-bold gradient-text">Gestão de Orçamentos</h1>
                        <p className="text-gray-400 mt-1">Acompanhe propostas e prazos importantes.</p>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-800/50 p-2 rounded-lg">
                        <Button variant={filter === 'todos' ? 'secondary' : 'ghost'} onClick={() => setFilter('todos')}>Todos</Button>
                        <Button variant={filter === 'pendente' ? 'secondary' : 'ghost'} onClick={() => setFilter('pendente')}>Pendentes</Button>
                        <Button variant={filter === 'aceito' ? 'secondary' : 'ghost'} onClick={() => setFilter('aceito')}>Aceitos</Button>
                        <Button variant={filter === 'recusado' ? 'secondary' : 'ghost'} onClick={() => setFilter('recusado')}>Recusados</Button>
                    </div>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                    </div>
                ) : filteredBudgets.length > 0 ? (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {filteredBudgets.map(budget => (
                            <motion.div key={budget.id} variants={itemVariants}>
                                <BudgetCard budget={budget} onUpdateStatus={handleUpdateStatus} />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-20 flex flex-col items-center justify-center h-full glass-effect rounded-lg">
                        <CircleDollarSign className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <p className="text-xl font-semibold text-gray-300 mb-2">Nenhum orçamento encontrado</p>
                        <p className="text-gray-400">Não há orçamentos com o filtro selecionado.</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default Budget;
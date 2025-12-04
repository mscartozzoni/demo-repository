import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Target,
  Scissors,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import GoalSettingsModal from '@/components/modals/GoalSettingsModal';
import { useSession } from '@/contexts/SessionContext';

const mockGoalData = {
    current_revenue_surgical: 75000,
    target_revenue_surgical: 150000,
    current_procedures_surgical: 5,
    target_procedures_surgical: 10,
    current_revenue_aesthetic: 30000,
    target_revenue_aesthetic: 80000,
    current_procedures_aesthetic: 20,
    target_procedures_aesthetic: 50,
};

const GoalProgressCard = ({ title, icon: Icon, color, current, target, isCurrency = false, index }) => {
    const progress = target > 0 ? (current / target) * 100 : 0;
    const formatValue = (value) => isCurrency 
        ? `R$ ${Number(value || 0).toLocaleString('pt-BR')}` 
        : Number(value || 0).toLocaleString('pt-BR');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6 hover:bg-white/15 transition-all duration-300 h-full">
                <div className="flex items-center justify-between">
                    <p className="text-purple-200 text-sm">{title}</p>
                    <div className={`bg-gradient-to-r ${color} p-3 rounded-xl`}>
                        <Icon className="h-6 w-6 text-white" />
                    </div>
                </div>
                <div className="mt-4">
                    <p className="text-3xl font-bold text-white mt-2">{formatValue(current)}</p>
                    <p className="text-purple-300 text-sm">Meta: {formatValue(target)}</p>
                </div>
                <div className="mt-4">
                    <div className="w-full bg-black/20 rounded-full h-2.5">
                        <motion.div
                            className={`bg-gradient-to-r ${color} h-2.5 rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(progress, 100)}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                    </div>
                    <p className="text-right text-white text-sm mt-1">{Math.round(progress)}%</p>
                </div>
            </Card>
        </motion.div>
    );
};

const Dashboard = () => {
    const { user } = useSession(); // Still useful to get user's name
    const [goalData, setGoalData] = useState(null);
    const [loadingGoals, setLoadingGoals] = useState(true);
    const [showGoalModal, setShowGoalModal] = useState(false);

    const fetchGoals = useCallback(() => {
        setLoadingGoals(true);
        setTimeout(() => {
            setGoalData(mockGoalData);
            setLoadingGoals(false);
        }, 500);
    }, []);

    useEffect(() => {
        fetchGoals();
    }, [fetchGoals]);

    const kpiCardsData = [
        { title: 'Receita Cirúrgica', key: 'revenue_surgical', icon: Scissors, color: 'from-blue-500 to-cyan-500', isCurrency: true },
        { title: 'Procedimentos Cirúrgicos', key: 'procedures_surgical', icon: Scissors, color: 'from-blue-500 to-cyan-500', isCurrency: false },
        { title: 'Receita Estética', key: 'revenue_aesthetic', icon: Sparkles, color: 'from-purple-500 to-pink-500', isCurrency: true },
        { title: 'Procedimentos Estéticos', key: 'procedures_aesthetic', icon: Sparkles, color: 'from-purple-500 to-pink-500', isCurrency: false }
    ];

    return (
        <>
            <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-white">Dashboard de Metas</h2>
                        <p className="text-purple-200 mt-2">Olá, {user.full_name}! Acompanhe o progresso da clínica.</p>
                    </div>
                    <Button onClick={() => setShowGoalModal(true)} variant="outline" className="text-purple-200 border-purple-400 hover:bg-purple-400/10 hover:text-white">
                        <Target className="h-4 w-4 mr-2" />
                        Definir Metas do Mês
                    </Button>
                </div>

                {loadingGoals ? (
                    <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 text-purple-300 animate-spin" /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {kpiCardsData.map((kpi, index) => (
                            <GoalProgressCard 
                                key={index}
                                title={kpi.title}
                                icon={kpi.icon}
                                color={kpi.color}
                                current={goalData ? goalData[`current_${kpi.key}`] : 0}
                                target={goalData ? goalData[`target_${kpi.key}`] : 0}
                                isCurrency={kpi.isCurrency}
                                index={index}
                            />
                        ))}
                    </div>
                )}
            </motion.div>
            <GoalSettingsModal
                isOpen={showGoalModal}
                onClose={() => setShowGoalModal(false)}
                onGoalsUpdated={fetchGoals}
            />
        </>
    );
};

export default Dashboard;
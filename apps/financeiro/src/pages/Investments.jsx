import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Target,
  PiggyBank,
  TrendingUp,
  Activity,
  Plus,
  Loader2,
  Landmark,
  LineChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import NewInvestmentModal from '@/components/modals/NewInvestmentModal';

const mockSummary = { total_invested: 125000, total_current_value: 138500, overall_roi: 10.8, projected_annual_growth: 12.5 };
const mockInvestments = [
    { id: 'inv1', name: 'CDB Liquidez Diária', current_value: 55000, annual_rate: 11.5, investment_types: { name: 'Renda Fixa' } },
    { id: 'inv2', name: 'Fundo de Ações Global', current_value: 83500, annual_rate: 13.2, investment_types: { name: 'Renda Variável' } },
];

const Investments = () => {
    const [summary, setSummary] = useState({ total_invested: 0, total_current_value: 0, overall_roi: 0, projected_annual_growth: 0 });
    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNewInvestmentModal, setShowNewInvestmentModal] = useState(false);
    const { toast } = useToast();

    const fetchData = useCallback(() => {
        setLoading(true);
        setTimeout(() => {
            try {
                setSummary(mockSummary);
                setInvestments(mockInvestments);
            } catch (error) {
                toast({ variant: 'destructive', title: 'Erro ao buscar dados', description: 'Ocorreu um erro ao carregar os dados de demonstração.' });
            } finally {
                setLoading(false);
            }
        }, 500);
    }, [toast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const getIconForType = (typeName) => {
        switch (typeName) {
            case 'Renda Fixa': return <Landmark className="h-6 w-6 text-white" />;
            case 'Renda Variável': return <LineChart className="h-6 w-6 text-white" />;
            default: return <Activity className="h-6 w-6 text-white" />;
        }
    };

    return (
        <>
            <motion.div
                key="investments"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-white">Quadro de Investimentos</h2>
                        <p className="text-purple-200 mt-2">Planejamento de crescimento e análise de ROI</p>
                    </div>
                    <Button onClick={() => setShowNewInvestmentModal(true)} className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Investimento
                    </Button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-32"><Loader2 className="h-8 w-8 text-purple-300 animate-spin" /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-200 text-sm">Total Acumulado</p>
                                    <p className="text-3xl font-bold text-white mt-2">R$ {Number(summary.total_current_value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                    <p className="text-purple-300 text-sm mt-1">Investido: R$ {Number(summary.total_invested).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                </div>
                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                                    <PiggyBank className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </Card>

                        <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-200 text-sm">ROI Geral</p>
                                    <p className={`text-3xl font-bold mt-2 ${summary.overall_roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {Number(summary.overall_roi).toFixed(2)}%
                                    </p>
                                    <p className="text-green-300 text-sm mt-1">Retorno sobre o capital</p>
                                </div>
                                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl">
                                    <TrendingUp className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </Card>

                        <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-200 text-sm">Taxa Anual Ponderada</p>
                                    <p className="text-3xl font-bold text-blue-400 mt-2">{Number(summary.projected_annual_growth).toFixed(2)}%</p>
                                    <p className="text-blue-300 text-sm mt-1">Projeção de crescimento</p>
                                </div>
                                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl">
                                    <Target className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                    <h3 className="text-xl font-semibold text-white mb-6">Portfólio de Investimentos</h3>
                    <div className="grid gap-6">
                        {loading ? (
                            <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 text-purple-300 animate-spin" /></div>
                        ) : investments.length > 0 ? (
                            investments.map((investment, index) => (
                                <motion.div
                                    key={investment.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                                            {getIconForType(investment.investment_types?.name)}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold">{investment.name}</h4>
                                            <p className="text-purple-200 text-sm">{investment.investment_types?.name || 'Tipo não definido'}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="text-right">
                                        <p className="text-white font-semibold">R$ {Number(investment.current_value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                        <div className="flex items-center justify-end space-x-1">
                                            <TrendingUp className="h-4 w-4 text-green-400" />
                                            <span className="text-green-400 text-sm">{investment.annual_rate}% a.a.</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-purple-300">Nenhum investimento encontrado. Adicione um novo para começar.</p>
                            </div>
                        )}
                    </div>
                </Card>
            </motion.div>
            <NewInvestmentModal
                isOpen={showNewInvestmentModal}
                onClose={() => setShowNewInvestmentModal(false)}
                onInvestmentCreated={fetchData}
            />
        </>
    );
};

export default Investments;
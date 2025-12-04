import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  BrainCircuit,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFinances } from '@/hooks/useFinances';
import FinancialStrategyModal from '@/components/modals/FinancialStrategyModal';
import FinanceModal from '@/components/modals/FinanceModal';
import { useToast } from '@/components/ui/use-toast';

const Finances = () => {
    const { receivable, payable, loading, error } = useFinances();
    const [showStrategyModal, setShowStrategyModal] = useState(false);
    const [showFinanceModal, setShowFinanceModal] = useState(false);
    const { toast } = useToast();

    const totalReceivable = receivable.reduce((sum, item) => sum + item.amount_total, 0);
    const totalPayable = payable.reduce((sum, item) => sum + item.amount_total, 0);
    const netBalance = totalReceivable - totalPayable;
    
    const receivablePending = receivable.filter(item => ['pending', 'overdue', 'partially_paid'].includes(item.status)).length;
    const payablePending = payable.filter(item => ['pending', 'overdue', 'partially_paid'].includes(item.status)).length;

    const handleFinanceAction = () => {
        toast({
          title: "🚧 Ação de demonstração",
          description: "A criação de transações está desativada neste modo."
        });
        setShowFinanceModal(false);
    };

    return (
        <>
            <motion.div
                key="finances"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
            >
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-white">Portal Financeiro</h2>
                        <p className="text-purple-200 mt-2">Gestão completa de contas a receber e a pagar</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button 
                            onClick={() => setShowStrategyModal(true)}
                            variant="outline"
                            className="text-purple-200 border-purple-400 hover:bg-purple-400/10 hover:text-white"
                        >
                            <BrainCircuit className="h-4 w-4 mr-2" />
                            Simulador Estratégico
                        </Button>
                        <Button 
                            onClick={() => setShowFinanceModal(true)}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Nova Transação
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-200 text-sm">Contas a Receber</p>
                                <p className="text-3xl font-bold text-green-400 mt-2">R$ {totalReceivable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                <p className="text-green-300 text-sm mt-1">{receivablePending} pendentes</p>
                            </div>
                            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl">
                                <ArrowUpRight className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-200 text-sm">Contas a Pagar</p>
                                <p className="text-3xl font-bold text-red-400 mt-2">R$ {totalPayable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                <p className="text-red-300 text-sm mt-1">{payablePending} pendentes</p>
                            </div>
                            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-3 rounded-xl">
                                <ArrowDownRight className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-200 text-sm">Saldo Líquido</p>
                                <p className="text-3xl font-bold text-blue-400 mt-2">R$ {netBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                <p className="text-blue-300 text-sm mt-1">Saldo em aberto</p>
                            </div>
                            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl">
                                <Wallet className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-white">Contas a Receber</h3>
                            <Badge className="bg-green-500 text-white">{receivablePending} pendentes</Badge>
                        </div>
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {loading && <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 text-purple-300 animate-spin" /></div>}
                            {error && <p className="text-red-400">Erro ao carregar.</p>}
                            {!loading && receivable.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                    <div>
                                        <p className="text-white font-medium">{item.description}</p>
                                        <p className="text-purple-200 text-sm">Vencimento: {new Date(item.due_date).toLocaleDateString('pt-BR')}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-green-400 font-semibold">R$ {item.amount_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                        <Badge variant={item.status === 'overdue' ? 'destructive' : 'outline'} className="text-xs">{item.status}</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-white">Contas a Pagar</h3>
                            <Badge className="bg-red-500 text-white">{payablePending} pendentes</Badge>
                        </div>
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {loading && <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 text-purple-300 animate-spin" /></div>}
                            {error && <p className="text-red-400">Erro ao carregar.</p>}
                            {!loading && payable.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                    <div>
                                        <p className="text-white font-medium">{item.description}</p>
                                        <p className="text-purple-200 text-sm">Vencimento: {new Date(item.due_date).toLocaleDateString('pt-BR')}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-red-400 font-semibold">R$ {item.amount_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                        <Badge variant={item.status === 'overdue' ? 'destructive' : 'secondary'} className="text-xs">{item.status}</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </motion.div>
            <FinancialStrategyModal 
                isOpen={showStrategyModal}
                onClose={() => setShowStrategyModal(false)}
            />
            <FinanceModal
                isOpen={showFinanceModal}
                onClose={() => setShowFinanceModal(false)}
                onSubmit={handleFinanceAction}
            />
        </>
    );
};

export default Finances;
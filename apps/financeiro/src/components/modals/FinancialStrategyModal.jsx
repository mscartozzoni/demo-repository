import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, BrainCircuit, BarChart, Lightbulb, Zap, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FinancialStrategyModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        avgRevenueSurgical: '15000',
        avgRevenueAesthetic: '1500',
        proceduresSurgical: '10',
        proceduresAesthetic: '40',
        fixedCosts: '25000',
        variableCostPercentage: '20',
        profitGoal: '50000',
    });
    const [step, setStep] = useState('form'); // 'form', 'loading', 'results'
    const [results, setResults] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSimulate = (e) => {
        e.preventDefault();
        setStep('loading');

        // Simulate API call and calculation
        setTimeout(() => {
            const { avgRevenueSurgical, avgRevenueAesthetic, proceduresSurgical, proceduresAesthetic, fixedCosts, variableCostPercentage, profitGoal } = formData;
            
            const totalSurgicalRevenue = parseFloat(avgRevenueSurgical) * parseInt(proceduresSurgical);
            const totalAestheticRevenue = parseFloat(avgRevenueAesthetic) * parseInt(proceduresAesthetic);
            const totalRevenue = totalSurgicalRevenue + totalAestheticRevenue;
            const totalVariableCosts = totalRevenue * (parseFloat(variableCostPercentage) / 100);
            const totalCosts = parseFloat(fixedCosts) + totalVariableCosts;
            const projectedProfit = totalRevenue - totalCosts;
            const profitDifference = projectedProfit - parseFloat(profitGoal);

            const recommendations = [];
            if (profitDifference < 0) {
                recommendations.push({
                    title: "Otimização de Custos",
                    description: `Seu lucro projetado está R$ ${Math.abs(profitDifference).toLocaleString('pt-BR')} abaixo da meta. Revise seus custos fixos e negocie com fornecedores para reduzir os custos variáveis.`,
                    icon: Zap,
                    color: "text-orange-400"
                });
                recommendations.push({
                    title: "Aumentar Volume de Procedimentos",
                    description: `Para atingir a meta, considere aumentar os procedimentos estéticos em ${Math.ceil(Math.abs(profitDifference) / (parseFloat(avgRevenueAesthetic) * (1 - parseFloat(variableCostPercentage)/100)))} ou os cirúrgicos em ${Math.ceil(Math.abs(profitDifference) / (parseFloat(avgRevenueSurgical) * (1 - parseFloat(variableCostPercentage)/100)))}.`,
                    icon: BarChart,
                    color: "text-blue-400"
                });
            } else {
                 recommendations.push({
                    title: "Cenário Otimista",
                    description: `Parabéns! Sua projeção de lucro de R$ ${projectedProfit.toLocaleString('pt-BR')} supera a meta em R$ ${profitDifference.toLocaleString('pt-BR')}.`,
                    icon: Zap,
                    color: "text-green-400"
                });
            }
            
            recommendations.push({
                title: "Estratégia de Precificação",
                description: "Analise a possibilidade de um pequeno ajuste de 5-10% nos procedimentos de maior volume (estéticos) para um impacto significativo na receita total.",
                icon: Lightbulb,
                color: "text-yellow-400"
            });
             recommendations.push({
                title: "Marketing Direcionado",
                description: "Crie campanhas de marketing focadas em procedimentos cirúrgicos, que possuem maior ticket médio, para acelerar o alcance da meta de lucro.",
                icon: BrainCircuit,
                color: "text-purple-400"
            });

            setResults({
                totalRevenue,
                totalCosts,
                projectedProfit,
                profitGoal: parseFloat(profitGoal),
                profitDifference,
                recommendations
            });
            setStep('results');
        }, 1500);
    };
    
    const handleReset = () => {
        setStep('form');
        setResults(null);
    }

    const renderContent = () => {
        switch (step) {
            case 'form':
                return (
                    <form onSubmit={handleSimulate} className="space-y-4 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-purple-200">Receita Média / Cirúrgico</Label>
                                <Input type="number" name="avgRevenueSurgical" value={formData.avgRevenueSurgical} onChange={handleChange} className="bg-white/10 border-white/20" required />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-purple-200">Receita Média / Estético</Label>
                                <Input type="number" name="avgRevenueAesthetic" value={formData.avgRevenueAesthetic} onChange={handleChange} className="bg-white/10 border-white/20" required />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-purple-200">Nº Proced. Cirúrgicos / Mês</Label>
                                <Input type="number" name="proceduresSurgical" value={formData.proceduresSurgical} onChange={handleChange} className="bg-white/10 border-white/20" required />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-purple-200">Nº Proced. Estéticos / Mês</Label>
                                <Input type="number" name="proceduresAesthetic" value={formData.proceduresAesthetic} onChange={handleChange} className="bg-white/10 border-white/20" required />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-purple-200">Custos Fixos Mensais</Label>
                                <Input type="number" name="fixedCosts" value={formData.fixedCosts} onChange={handleChange} className="bg-white/10 border-white/20" required />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-purple-200">Custos Variáveis (%)</Label>
                                <Input type="number" name="variableCostPercentage" value={formData.variableCostPercentage} onChange={handleChange} className="bg-white/10 border-white/20" required />
                            </div>
                             <div className="space-y-2 col-span-2">
                                <Label className="text-purple-200">Meta de Lucro Mensal</Label>
                                <Input type="number" name="profitGoal" value={formData.profitGoal} onChange={handleChange} className="bg-white/10 border-white/20" required />
                            </div>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" onClick={onClose} variant="outline" className="text-purple-200 border-purple-400 hover:bg-purple-400/10 hover:text-white">Cancelar</Button>
                            <Button type="submit" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">Simular Cenário <ArrowRight className="ml-2 h-4 w-4" /></Button>
                        </DialogFooter>
                    </form>
                );
            case 'loading':
                return (
                    <div className="flex flex-col items-center justify-center h-96 text-white">
                        <Loader2 className="h-12 w-12 animate-spin text-purple-400 mb-4" />
                        <p className="text-lg">Analisando dados e gerando estratégias...</p>
                    </div>
                );
            case 'results':
                return (
                    <div className="pt-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h3 className="text-xl font-bold text-white mb-4">Resultados da Simulação</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <Card className="bg-white/5"><CardContent className="p-4"><p className="text-sm text-purple-200">Receita Total</p><p className="text-2xl font-bold text-green-400">R$ {results.totalRevenue.toLocaleString('pt-BR')}</p></CardContent></Card>
                                <Card className="bg-white/5"><CardContent className="p-4"><p className="text-sm text-purple-200">Custos Totais</p><p className="text-2xl font-bold text-red-400">R$ {results.totalCosts.toLocaleString('pt-BR')}</p></CardContent></Card>
                                <Card className="bg-white/5"><CardContent className="p-4"><p className="text-sm text-purple-200">Lucro Projetado</p><p className="text-2xl font-bold text-blue-400">R$ {results.projectedProfit.toLocaleString('pt-BR')}</p></CardContent></Card>
                            </div>
                            
                            <h3 className="text-xl font-bold text-white mb-4">Planos de Ação e Estratégias</h3>
                            <div className="space-y-4">
                                {results.recommendations.map((rec, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.2 }}
                                        className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg"
                                    >
                                        <rec.icon className={`h-8 w-8 mt-1 flex-shrink-0 ${rec.color}`} />
                                        <div>
                                            <h4 className="font-semibold text-white">{rec.title}</h4>
                                            <p className="text-purple-300 text-sm">{rec.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                        <DialogFooter className="pt-6">
                            <Button onClick={handleReset} variant="outline" className="text-purple-200 border-purple-400 hover:bg-purple-400/10 hover:text-white">Nova Simulação</Button>
                            <Button onClick={onClose} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">Fechar</Button>
                        </DialogFooter>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-gray-900/50 backdrop-blur-xl border-white/20 text-white max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center text-2xl"><BrainCircuit className="mr-3 h-6 w-6 text-purple-400" />Simulador Estratégico Financeiro</DialogTitle>
                    <DialogDescription className="text-purple-300">
                        Insira os dados para simular cenários e receber planos de ação para o crescimento da sua clínica.
                    </DialogDescription>
                </DialogHeader>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
};

export default FinancialStrategyModal;
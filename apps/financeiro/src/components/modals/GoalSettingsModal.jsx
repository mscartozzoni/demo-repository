import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Target, DollarSign, Hash, Scissors, Sparkles } from 'lucide-react';
import { useSession } from '@/contexts/SessionContext';

const mockGoals = {
    '2025-10': {
        id: 'goal1',
        month: '2025-10-01',
        target_revenue_surgical: 150000,
        target_procedures_surgical: 10,
        target_revenue_aesthetic: 80000,
        target_procedures_aesthetic: 50,
    }
};

const GoalSettingsModal = ({ isOpen, onClose, onGoalsUpdated }) => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [goal, setGoal] = useState({
        id: null,
        month: new Date().toISOString().slice(0, 7),
        target_revenue_surgical: 0,
        target_procedures_surgical: 0,
        target_revenue_aesthetic: 0,
        target_procedures_aesthetic: 0,
    });
    const { toast } = useToast();
    const { user } = useSession();

    const fetchCurrentGoal = useCallback((month) => {
        setLoading(true);
        setTimeout(() => {
            const data = mockGoals[month];
            if (data) {
                setGoal({
                    id: data.id,
                    month: data.month.slice(0, 7),
                    target_revenue_surgical: data.target_revenue_surgical || 0,
                    target_procedures_surgical: data.target_procedures_surgical || 0,
                    target_revenue_aesthetic: data.target_revenue_aesthetic || 0,
                    target_procedures_aesthetic: data.target_procedures_aesthetic || 0,
                });
            } else {
                setGoal(prev => ({
                    ...prev,
                    id: null,
                    month: month,
                    target_revenue_surgical: 0,
                    target_procedures_surgical: 0,
                    target_revenue_aesthetic: 0,
                    target_procedures_aesthetic: 0,
                }));
            }
            setLoading(false);
        }, 300);
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchCurrentGoal(goal.month);
        }
    }, [isOpen, goal.month, fetchCurrentGoal]);

    const handleMonthChange = (e) => {
        const newMonth = e.target.value;
        setGoal(prev => ({ ...prev, month: newMonth }));
        fetchCurrentGoal(newMonth);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setGoal(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        setTimeout(() => {
            toast({ title: 'Sucesso!', description: 'Metas salvas com sucesso (simulação).' });
            onGoalsUpdated();
            onClose();
            setSaving(false);
        }, 800);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-gray-900/50 backdrop-blur-xl border-white/20 text-white max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center"><Target className="mr-2" />Definir Metas do Mês</DialogTitle>
                    <DialogDescription className="text-purple-300">
                        Ajuste as metas de faturamento e quantidade para procedimentos cirúrgicos e estéticos.
                    </DialogDescription>
                </DialogHeader>
                {loading ? (
                    <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-purple-300" /></div>
                ) : (
                    <div className="py-4 space-y-6">
                        <div>
                            <Label className="text-purple-200">Mês da Meta</Label>
                            <Input
                                type="month"
                                name="month"
                                value={goal.month}
                                onChange={handleMonthChange}
                                className="bg-white/10 border-white/20"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4 p-4 border border-blue-500/30 rounded-lg bg-blue-500/10">
                                <h3 className="font-semibold text-lg flex items-center text-blue-300"><Scissors className="mr-2 h-5 w-5" />Metas Cirúrgicas</h3>
                                <div className="space-y-2">
                                    <Label className="text-purple-200 flex items-center"><DollarSign className="h-4 w-4 mr-2" />Faturamento (R$)</Label>
                                    <Input type="number" name="target_revenue_surgical" value={goal.target_revenue_surgical} onChange={handleChange} className="bg-white/10 border-white/20" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-purple-200 flex items-center"><Hash className="h-4 w-4 mr-2" />Quantidade</Label>
                                    <Input type="number" name="target_procedures_surgical" value={goal.target_procedures_surgical} onChange={handleChange} className="bg-white/10 border-white/20" />
                                </div>
                            </div>

                            <div className="space-y-4 p-4 border border-pink-500/30 rounded-lg bg-pink-500/10">
                                <h3 className="font-semibold text-lg flex items-center text-pink-300"><Sparkles className="mr-2 h-5 w-5" />Metas Estéticas</h3>
                                <div className="space-y-2">
                                    <Label className="text-purple-200 flex items-center"><DollarSign className="h-4 w-4 mr-2" />Faturamento (R$)</Label>
                                    <Input type="number" name="target_revenue_aesthetic" value={goal.target_revenue_aesthetic} onChange={handleChange} className="bg-white/10 border-white/20" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-purple-200 flex items-center"><Hash className="h-4 w-4 mr-2" />Quantidade</Label>
                                    <Input type="number" name="target_procedures_aesthetic" value={goal.target_procedures_aesthetic} onChange={handleChange} className="bg-white/10 border-white/20" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <DialogFooter className="pt-4">
                    <Button type="button" onClick={onClose} variant="outline" className="text-purple-200 border-purple-400 hover:bg-purple-400/10 hover:text-white">
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} disabled={loading || saving} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                        {saving ? <Loader2 className="animate-spin" /> : 'Salvar Metas'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default GoalSettingsModal;
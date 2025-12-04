import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Edit, Calendar, FilePlus2, CalendarPlus, Zap, Plus, Loader2, ArrowLeft, Share2, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBudgets } from '@/hooks/useBudgets';
import { useToast } from '@/components/ui/use-toast';
import SetSurgeryDateModal from '@/components/modals/SetSurgeryDateModal';
import NewBudgetWizard from '@/components/wizards/NewBudgetWizard';
import QuickBudgetModal from '@/components/modals/QuickBudgetModal';
import BudgetPortalView from '@/components/views/BudgetPortalView';

const Budgets = () => {
    const [filters, setFilters] = useState({ search: '', status: '' });
    const { budgets, loading, error, refetch, updateBudgetStatus } = useBudgets(filters);
    const { toast } = useToast();
    const [showSurgeryModal, setShowSurgeryModal] = useState(false);
    const [selectedQuote, setSelectedQuote] = useState(null);
    const [showNewBudgetWizard, setShowNewBudgetWizard] = useState(false);
    const [showQuickBudgetModal, setShowQuickBudgetModal] = useState(false);
    const [viewingQuote, setViewingQuote] = useState(null);

    const getStatusClass = (status) => {
      switch (status) {
        case 'approved': return 'bg-green-500/20 text-green-300 border-green-500';
        case 'sent': return 'bg-blue-500/20 text-blue-300 border-blue-500';
        case 'draft': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500';
        case 'canceled': return 'bg-red-500/20 text-red-300 border-red-500';
        default: return 'bg-gray-500/20 text-gray-300 border-gray-500';
      }
    };
    
    const getStatusLabel = (status) => {
        const labels = { approved: 'Aprovado', sent: 'Enviado', draft: 'Rascunho', canceled: 'Cancelado' };
        return labels[status] || 'Pendente';
    }

    const handleActionClick = (quote) => {
        setSelectedQuote(quote);
        setShowSurgeryModal(true);
    };

    const handleSetSurgeryDate = async (quoteId, surgeryDate) => {
        // Mock logic
        setTimeout(() => {
            if (!surgeryDate) {
                toast({ title: "Sucesso!", description: "Fatura em rascunho gerada (simulação)." });
            } else {
                toast({ title: "Sucesso!", description: "Data da cirurgia definida e fatura atualizada (simulação)." });
            }
            refetch();
            setShowSurgeryModal(false);
            setSelectedQuote(null);
        }, 500);
    };
    
    const handleUpdateStatus = async (quoteId, status) => {
        await updateBudgetStatus(quoteId, status);
        toast({ title: "Status Atualizado!", description: `O orçamento foi marcado como "${getStatusLabel(status)}".`, className: "bg-green-600 text-white" });
    }
    
    const hasDraftInvoice = (quote) => quote.invoices && quote.invoices.some(inv => inv.status === 'draft');

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value === 'all' ? '' : value }));
    };

    const handleBudgetCreated = () => {
        setShowNewBudgetWizard(false);
        setShowQuickBudgetModal(false);
        refetch();
    };

    if (viewingQuote) {
        return (
            <motion.div key="budget-portal" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                <Button variant="ghost" onClick={() => setViewingQuote(null)} className="mb-4 text-purple-200"><ArrowLeft className="mr-2 h-4 w-4" />Voltar para Lista de Orçamentos</Button>
                <BudgetPortalView quote={viewingQuote} onStatusChange={refetch} />
            </motion.div>
        );
    }

    return (
        <>
            <motion.div key="budgets" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Gestão de Orçamentos</h1>
                        <p className="text-purple-200 mt-2">Crie, gerencie e acompanhe todas as propostas comerciais.</p>
                    </div>
                    <div className="flex space-x-2">
                        <Button onClick={() => setShowQuickBudgetModal(true)} variant="outline" className="border-purple-400 text-purple-300 hover:bg-purple-400/10 hover:text-white"><Zap className="h-4 w-4 mr-2" />Orçamento Rápido</Button>
                        <Button onClick={() => setShowNewBudgetWizard(true)} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"><Plus className="h-4 w-4 mr-2" />Novo Orçamento</Button>
                    </div>
                </div>

                <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-purple-200">Buscar por Paciente</Label>
                            <Input className="bg-white/10 border-white/20 text-white" placeholder="Nome do paciente..." value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)} />
                        </div>
                        <div>
                            <Label className="text-purple-200">Filtrar por Status</Label>
                            <Select value={filters.status || 'all'} onValueChange={(value) => handleFilterChange('status', value)}>
                                <SelectTrigger className="w-full"><SelectValue placeholder="Todos" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="draft">Rascunho</SelectItem>
                                    <SelectItem value="sent">Enviado</SelectItem>
                                    <SelectItem value="approved">Aprovado</SelectItem>
                                    <SelectItem value="canceled">Cancelado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </Card>

                <div className="space-y-4">
                    {loading && <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 text-purple-300 animate-spin" /></div>}
                    {error && <p className="text-red-400 text-center">Erro ao carregar orçamentos.</p>}
                    {!loading && budgets.map((budget) => (
                        <motion.div key={budget.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -2 }}>
                            <Card className="bg-white/5 backdrop-blur-lg border-white/10 p-4 hover:bg-white/10 transition-all duration-300">
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                    <div className="flex items-start space-x-4 flex-grow">
                                        <div className="mt-1 flex-shrink-0"><Badge variant="outline" className={`text-xs ${getStatusClass(budget.status)}`}>{getStatusLabel(budget.status)}</Badge></div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">{budget.patients?.full_name}</h3>
                                            <p className="text-purple-200 text-sm">{budget.services?.name}</p>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                                                <div className="flex items-center space-x-1"><Calendar className="h-3 w-3 text-purple-300" /><span className="text-purple-200 text-xs">{new Date(budget.created_at).toLocaleDateString()}</span></div>
                                                {budget.surgery_date && (<div className="flex items-center space-x-1 text-cyan-300"><CalendarPlus className="h-3 w-3" /><span className="text-xs font-semibold">Cirurgia: {new Date(budget.surgery_date).toLocaleDateString()}</span></div>)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right mt-4 md:mt-0 md:ml-4 flex-shrink-0 w-full md:w-auto">
                                        <p className="text-2xl font-bold text-white mb-2">R$ {Number(budget.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                        <div className="flex items-center space-x-2 mt-2 justify-end">
                                            <Button size="sm" variant="ghost" className="text-purple-300 hover:text-white" onClick={() => setViewingQuote(budget)}><Eye className="h-4 w-4" /></Button>
                                            {budget.status === 'sent' && (<Button size="sm" variant="outline" className="text-green-300 border-green-300 hover:bg-green-300/10" onClick={() => handleUpdateStatus(budget.id, 'approved')}><CheckSquare className="h-4 w-4 mr-2" /> Aprovar</Button>)}
                                            {budget.status === 'approved' && (<Button size="sm" variant="outline" className="text-cyan-300 border-cyan-300 hover:bg-cyan-300/10" onClick={() => handleActionClick(budget)}>{hasDraftInvoice(budget) ? <CalendarPlus className="h-4 w-4 mr-2" /> : <FilePlus2 className="h-4 w-4 mr-2" />} {hasDraftInvoice(budget) ? 'Agendar' : 'Faturar'}</Button>)}
                                            <Button size="sm" variant="ghost" className="text-purple-200 hover:text-white"><Share2 className="h-4 w-4" /></Button>
                                            <Button size="sm" variant="ghost" className="text-purple-200 hover:text-white"><Edit className="h-4 w-4" /></Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                     {!loading && budgets.length === 0 && (<div className="text-center py-10 col-span-full"><p className="text-purple-300">Nenhum orçamento encontrado.</p></div>)}
                </div>
            </motion.div>
            <SetSurgeryDateModal isOpen={showSurgeryModal} onClose={() => setShowSurgeryModal(false)} onSubmit={handleSetSurgeryDate} quote={selectedQuote}/>
            <NewBudgetWizard isOpen={showNewBudgetWizard} onClose={() => setShowNewBudgetWizard(false)} onBudgetCreated={handleBudgetCreated}/>
            <QuickBudgetModal isOpen={showQuickBudgetModal} onClose={() => setShowQuickBudgetModal(false)} onSave={handleBudgetCreated}/>
        </>
    );
};

export default Budgets;
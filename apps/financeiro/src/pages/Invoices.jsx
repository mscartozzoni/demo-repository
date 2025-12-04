import React from 'react';
import { motion } from 'framer-motion';
import { Search, FileStack, Calendar, User, Hash, DollarSign, AlertTriangle, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInvoices } from '@/hooks/useInvoices';

const Invoices = () => {
    const { invoices, loading, error } = useInvoices();

    const getStatusClass = (status) => {
        switch (status) {
            case 'paid': return 'bg-green-500/20 text-green-300 border-green-500';
            case 'open': return 'bg-blue-500/20 text-blue-300 border-blue-500';
            case 'draft': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500';
            case 'overdue': return 'bg-red-500/20 text-red-300 border-red-500';
            default: return 'bg-gray-500/20 text-gray-300 border-gray-500';
        }
    };

    return (
        <motion.div
            key="invoices"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white">Gestão de Faturas</h2>
                    <p className="text-purple-200 mt-2">Visualize e gerencie todas as faturas da clínica.</p>
                </div>
            </div>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label className="text-purple-200">Buscar Fatura</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-purple-300" />
                            <Input 
                                className="pl-10 bg-white/10 border-white/20 text-white" 
                                placeholder="ID da fatura ou nome do paciente..."
                            />
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid gap-6">
                {loading && <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 text-purple-300 animate-spin" /></div>}
                {error && <p className="text-red-400 text-center">Erro ao carregar faturas.</p>}
                {!loading && invoices.map((invoice) => (
                    <motion.div
                        key={invoice.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                                <div className="flex items-start space-x-4">
                                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl mt-1">
                                        <FileStack className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <h3 className="text-xl font-semibold text-white">Fatura #{invoice.id}</h3>
                                            <Badge variant="outline" className={`text-xs ${getStatusClass(invoice.status)}`}>
                                                {invoice.status}
                                            </Badge>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-purple-200 text-sm">
                                            <div className="flex items-center space-x-1">
                                                <User className="h-4 w-4" />
                                                <span>{invoice.patients?.full_name || 'Paciente não encontrado'}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Hash className="h-4 w-4" />
                                                <span>Orçamento: {invoice.quote_id}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="h-4 w-4" />
                                                <span>Emissão: {new Date(invoice.issue_date).toLocaleDateString()}</span>
                                            </div>
                                            {invoice.due_date && (
                                                <div className="flex items-center space-x-1">
                                                    <AlertTriangle className="h-4 w-4" />
                                                    <span>Vencimento: {new Date(invoice.due_date).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right mt-4 md:mt-0 md:ml-4 flex-shrink-0">
                                    <div className="flex items-center justify-end space-x-2">
                                        <DollarSign className="h-6 w-6 text-green-400" />
                                        <p className="text-3xl font-bold text-white">R$ {Number(invoice.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default Invoices;
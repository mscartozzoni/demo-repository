import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Plus, Search, Filter } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import NewDeadlineDialog from '@/components/deadlines/NewDeadlineDialog';
import DeadlineTimeline from '@/components/deadlines/DeadlineTimeline';

const deadlinesData = [
    { id: 1, title: 'Relatório Mensal de Atendimentos', description: 'Compilar dados de todos os atendimentos do mês.', dueDate: '2025-08-25', priority: 'high', status: 'pending', category: 'administrative', assignedTo: 'Secretária Principal', protocolId: 'PROT-2025-001' },
    { id: 2, title: 'Renovação de Licenças Médicas', description: 'Verificar e renovar licenças que vencem.', dueDate: '2025-08-30', priority: 'high', status: 'in_progress', category: 'legal', assignedTo: 'Assistente Adm.', protocolId: 'PROT-2025-002' },
    { id: 3, title: 'Auditoria de Prontuários', description: 'Revisar prontuários do último trimestre.', dueDate: '2025-08-28', priority: 'high', status: 'urgent', category: 'compliance', assignedTo: 'Auditora Interna', protocolId: 'PROT-2025-003' },
    { id: 4, title: 'Treinamento - Novos Protocolos', description: 'Organizar treinamento da equipe.', dueDate: '2025-09-10', priority: 'medium', status: 'completed', category: 'training', assignedTo: 'Coordenadora', protocolId: 'PROT-2025-004' },
    { id: 5, title: 'Atualização do Sistema', description: 'Implementar novas funcionalidades.', dueDate: '2025-09-05', priority: 'medium', status: 'pending', category: 'technical', assignedTo: 'Suporte TI', protocolId: 'PROT-2025-005' },
];

const Deadlines = () => {
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');

    const handleFeatureClick = (feature) => {
        toast({
            title: `⏰ ${feature}`,
            description: "🚧 Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀"
        });
    };

    const filteredDeadlines = deadlinesData.filter(deadline => {
        const matchesSearch = deadline.title.toLowerCase().includes(searchTerm.toLowerCase()) || deadline.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = selectedFilter === 'all' || deadline.status === selectedFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <>
            <Helmet>
                <title>Prazos - Portal Secretaria</title>
                <meta name="description" content="Gestão de prazos e tarefas com visualização em timeline e associação a protocolos." />
            </Helmet>
            <div className="space-y-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold gradient-text mb-2">Prazos e Tarefas</h1>
                        <p className="text-gray-400">Gerencie tarefas e deadlines importantes com a timeline de protocolos.</p>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="btn-primary mt-4 md:mt-0"><Plus className="w-4 h-4 mr-2" /> Novo Prazo</Button>
                        </DialogTrigger>
                        <NewDeadlineDialog onSave={() => handleFeatureClick('Salvar Prazo')} />
                    </Dialog>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                                <div className="flex-1 max-w-md">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <Input
                                            placeholder="Buscar por título ou descrição..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Filter className="w-4 h-4 text-gray-400" />
                                    <select value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)} className="input-field">
                                        <option value="all">Todos</option>
                                        <option value="pending">Pendentes</option>
                                        <option value="in_progress">Em Andamento</option>
                                        <option value="urgent">Urgentes</option>
                                        <option value="completed">Concluídos</option>
                                    </select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <DeadlineTimeline deadlines={filteredDeadlines} />
            </div>
        </>
    );
};

export default Deadlines;
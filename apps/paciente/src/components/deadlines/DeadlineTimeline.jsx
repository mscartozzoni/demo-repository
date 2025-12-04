import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Calendar, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const DeadlineTimeline = ({ deadlines }) => {
    const { toast } = useToast();

    const handleFeatureClick = (feature) => {
        toast({
            title: `⏰ ${feature}`,
            description: "🚧 Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀"
        });
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'completed': return { icon: <CheckCircle className="w-5 h-5 text-green-400" />, text: 'Concluído', color: 'border-green-500/50', badge: 'status-active' };
            case 'in_progress': return { icon: <Clock className="w-5 h-5 text-blue-400" />, text: 'Em Andamento', color: 'border-blue-500/50', badge: 'bg-blue-500/20 text-blue-300' };
            case 'urgent': return { icon: <AlertTriangle className="w-5 h-5 text-red-400" />, text: 'Urgente', color: 'border-red-500/50', badge: 'status-urgent' };
            default: return { icon: <Clock className="w-5 h-5 text-yellow-400" />, text: 'Pendente', color: 'border-yellow-500/50', badge: 'status-pending' };
        }
    };
    
    const getDaysUntilDue = (dueDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(dueDate);
        due.setHours(0, 0, 0, 0);
        const diffTime = due - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const sortedDeadlines = [...deadlines].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    if (sortedDeadlines.length === 0) {
        return (
            <div className="text-center py-12">
                <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nenhum prazo encontrado</h3>
                <p className="text-gray-400">Tente ajustar seus filtros ou crie um novo prazo.</p>
            </div>
        );
    }
    
    return (
        <div className="relative pl-8">
            <div className="absolute left-8 top-0 h-full w-0.5 bg-white/10" aria-hidden="true"></div>
            {sortedDeadlines.map((deadline, index) => {
                const statusInfo = getStatusInfo(deadline.status);
                const daysUntilDue = getDaysUntilDue(deadline.dueDate);

                return (
                    <motion.div
                        key={deadline.id}
                        className="relative mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <div className="absolute -left-11 top-1.5 w-6 h-6 rounded-full bg-slate-800 border-2 border-white/20 flex items-center justify-center">
                            {statusInfo.icon}
                        </div>
                        <Card className={`ml-4 glass-effect border-l-4 ${statusInfo.color} card-hover`}>
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold">{deadline.title}</h3>
                                            <span className={`status-badge ${statusInfo.badge}`}>{statusInfo.text}</span>
                                        </div>
                                        <p className="text-gray-300 mb-3">{deadline.description}</p>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400">
                                            <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /><span>Vence em: {new Date(deadline.dueDate).toLocaleDateString('pt-BR')}</span></div>
                                            <div className={`flex items-center gap-1 ${daysUntilDue < 0 ? 'text-red-400' : daysUntilDue <= 3 ? 'text-yellow-400' : ''}`}>
                                                <Clock className="w-4 h-4" />
                                                <span>{daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} dias atrasado` : daysUntilDue === 0 ? 'Vence hoje' : `${daysUntilDue} dias restantes`}</span>
                                            </div>
                                            <Link to={`/protocols/${deadline.protocolId}`} className="flex items-center gap-1 text-cyan-400 hover:underline">
                                                <FileText className="w-4 h-4" />
                                                <span>{deadline.protocolId}</span>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2 self-start">
                                        {deadline.status !== 'completed' && <Button size="sm" className="btn-secondary" onClick={() => handleFeatureClick('Concluir Prazo')}><CheckCircle className="w-4 h-4 mr-1" />Concluir</Button>}
                                        <Button size="sm" variant="outline" onClick={() => handleFeatureClick('Editar Prazo')}>Editar</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default DeadlineTimeline;
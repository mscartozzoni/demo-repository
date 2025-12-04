import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, AlertTriangle, FileText, Calendar, Edit } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const JourneyStageCard = ({ stage, index, onEdit }) => {
    
    const getStatusInfo = (status) => {
        switch (status) {
            case 'completed': return { icon: <CheckCircle className="w-5 h-5 text-green-400" />, text: 'Concluído', color: 'border-green-500/50', badge: 'status-active' };
            case 'in_progress': return { icon: <Clock className="w-5 h-5 text-blue-400" />, text: 'Em Andamento', color: 'border-blue-500/50', badge: 'bg-blue-500/20 text-blue-300' };
            case 'pending': return { icon: <Clock className="w-5 h-5 text-yellow-400" />, text: 'Pendente', color: 'border-yellow-500/50', badge: 'status-pending' };
            default: return { icon: <AlertTriangle className="w-5 h-5 text-gray-400" />, text: 'Atrasado', color: 'border-red-500/50', badge: 'status-urgent' };
        }
    };
    
    const statusInfo = getStatusInfo(stage.status);

    return (
        <motion.div
            className="relative mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <div className="absolute -left-11 top-1.5 w-6 h-6 rounded-full bg-slate-800 border-2 border-white/20 flex items-center justify-center">
                {stage.icon ? <stage.icon className={`w-3 h-3 ${statusInfo.color.replace('border-', 'text-').replace('/50','')}`} /> : statusInfo.icon}
            </div>
            <Card className={`ml-4 glass-effect border-l-4 ${statusInfo.color} card-hover`}>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold">{stage.title}</h3>
                                <span className={`status-badge ${statusInfo.badge}`}>{statusInfo.text}</span>
                            </div>
                            <p className="text-gray-300 mb-3">{stage.details}</p>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400">
                                <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /><span>Data: {new Date(stage.date).toLocaleDateString('pt-BR')}</span></div>
                                <Link to={`/protocols/${stage.protocolId}`} className="flex items-center gap-1 text-cyan-400 hover:underline">
                                    <FileText className="w-4 h-4" />
                                    <span>{stage.protocolId}</span>
                                </Link>
                            </div>
                        </div>
                        <div className="flex space-x-2 self-start">
                            <Button size="sm" variant="outline" onClick={onEdit}>
                                <Edit className="w-4 h-4 mr-1" /> Editar
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default JourneyStageCard;
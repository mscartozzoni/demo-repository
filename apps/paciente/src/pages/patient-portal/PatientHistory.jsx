import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useApi } from '@/contexts/ApiContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2, HeartPulse, User, Calendar, Stethoscope } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const HistoryItem = ({ item, index }) => (
    <motion.div
        className="relative pl-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 }}
    >
        <div className="absolute left-0 top-1.5 h-full border-l-2 border-slate-700"></div>
        <div className="absolute left-[-9px] top-1.5 w-5 h-5 bg-slate-800 border-2 border-blue-500 rounded-full"></div>
        <div className="floating-card p-5 ml-4">
            <p className="text-lg font-bold text-white">{item.title}</p>
            <div className="flex items-center gap-2 mt-2 text-slate-300 text-sm">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(item.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-slate-300 text-sm">
                <User className="w-4 h-4" />
                <span>{item.doctor}</span>
            </div>
            <CardContent className="p-0 mt-4">
                <p className="text-slate-300 whitespace-pre-wrap">{item.summary}</p>
            </CardContent>
        </div>
    </motion.div>
);

const PatientHistory = () => {
    const { getPatientHistoryForPortal, loading } = useApi();
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            const data = await getPatientHistoryForPortal();
            if (data) setHistory(data.sort((a,b) => new Date(b.date) - new Date(a.date)));
        };
        fetchHistory();
    }, []);

    if (loading && history.length === 0) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="w-16 h-16 animate-spin text-blue-500" /></div>;
    }

    return (
        <>
            <Helmet><title>Meu Histórico Clínico</title></Helmet>
            <div className="space-y-6">
                 <motion.h1 className="text-3xl font-bold gradient-text" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    Meu Histórico Clínico
                </motion.h1>

                <div className="space-y-8">
                    {history.length > 0 ? (
                        history.map((item, index) => <HistoryItem key={item.id} item={item} index={index} />)
                    ) : (
                         <Card className="floating-card text-center py-16">
                            <Stethoscope className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold">Histórico Vazio</h3>
                            <p className="text-slate-400">Os registros de suas consultas aparecerão aqui.</p>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
};

export default PatientHistory;
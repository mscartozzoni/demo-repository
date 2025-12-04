import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const GoogleCalendarView = () => {
    const navigate = useNavigate();
    const [calendarUrl, setCalendarUrl] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUrl = localStorage.getItem('googleCalendarUrl');
        if (storedUrl) {
            setCalendarUrl(storedUrl);
        }
        setLoading(false);
    }, []);

    return (
        <div className="h-screen w-screen bg-slate-900 flex flex-col">
            <Helmet>
                <title>Google Agenda - Portal do Médico</title>
                <meta name="description" content="Visualização integrada do Google Agenda." />
            </Helmet>
            
            <header className="flex-shrink-0 h-16 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/80 flex items-center justify-between px-4 z-10">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <Button variant="ghost" onClick={() => navigate('/medico/agenda')}>
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Voltar para a Agenda
                    </Button>
                </motion.div>
                <h1 className="text-lg font-bold text-white">Visualizador do Google Agenda</h1>
            </header>

            <main className="flex-grow relative">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                        Carregando...
                    </div>
                ) : calendarUrl ? (
                    <motion.iframe
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        src={calendarUrl}
                        className="w-full h-full border-0"
                        title="Google Calendar"
                        allow="fullscreen"
                    />
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-8"
                    >
                        <AlertTriangle className="w-12 h-12 text-yellow-400 mb-4" />
                        <h2 className="text-2xl font-bold mb-2">URL do Google Agenda não encontrada</h2>
                        <p className="text-slate-400 max-w-md">
                            Por favor, vá para <Button variant="link" className="p-0 h-auto text-blue-400" onClick={() => navigate('/medico/config')}>Configurações &gt; Integrações</Button> e adicione o link do seu Google Agenda para visualizá-lo aqui.
                        </p>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default GoogleCalendarView;
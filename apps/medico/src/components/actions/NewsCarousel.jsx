import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Newspaper, Bell, Stethoscope, User, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { getNewsCarouselData } from '@/services/api/notifications';
import useApi from '@/hooks/useApi';

const NewsItemIcon = ({ type }) => {
    switch (type) {
        case 'Pós-operatório': return <Stethoscope className="w-5 h-5 text-blue-400" />;
        case 'Notificação': return <Bell className="w-5 h-5 text-yellow-400" />;
        default: return <Newspaper className="w-5 h-5 text-gray-400" />;
    }
};

const NewsCarousel = () => {
    const { data: news, loading, error, execute: fetchNews } = useApi(getNewsCarouselData, { initialData: [] });
    const [index, setIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isHovering || !news || news.length <= 1) return;

        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % news.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isHovering, news]);
    
    useEffect(() => {
        if(news && news.length > 0 && index >= news.length) {
            setIndex(0);
        }
    }, [news, index]);

    const handleNavigate = (patientId) => {
        if (patientId) {
            navigate(`/medico/prontuarios/${patientId}`);
        }
    };

    const variants = {
        enter: { opacity: 0, y: 20 },
        center: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    };

    const renderContent = () => {
        if (loading) {
            return <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
        }
        if (error) {
            return <div className="flex flex-col items-center justify-center h-full text-center text-red-400">
                <AlertTriangle className="w-12 h-12 mb-4" />
                <h4 className="font-bold">Erro ao carregar notícias</h4>
                <p className="text-sm mb-4">{error}</p>
                <Button onClick={fetchNews} variant="destructive">Tentar Novamente</Button>
            </div>;
        }
        if (!news || news.length === 0) {
            return <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
                <Bell className="w-12 h-12 mb-4" />
                <h4 className="font-bold">Nenhuma notícia ou alerta</h4>
                <p className="text-sm">Tudo tranquilo por aqui.</p>
            </div>;
        }

        const currentItem = news[index];
        if (!currentItem) return null;

        return (
            <>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentItem.id}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-3">
                            <NewsItemIcon type={currentItem.type} />
                            <div>
                                <p className="text-sm font-semibold text-slate-400">{currentItem.type}</p>
                                <h4 className="text-lg font-bold text-white">{currentItem.title}</h4>
                            </div>
                        </div>
                        <p className="text-slate-300 min-h-[40px]">{currentItem.description}</p>
                        
                        {currentItem.details && Object.keys(currentItem.details).length > 0 && (
                            <div className="text-sm space-y-2 pt-2 border-t border-slate-700">
                                {Object.entries(currentItem.details).map(([key, value]) => (
                                    <div key={key} className="flex justify-between">
                                        <span className="text-slate-400">{key}:</span>
                                        <span className="font-medium text-white">{String(value)}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {currentItem.patient_id && (
                             <Button 
                                className="w-full mt-4" 
                                variant="outline"
                                onClick={() => handleNavigate(currentItem.patient_id)}
                             >
                                <User className="w-4 h-4 mr-2" />
                                Acessar Prontuário
                            </Button>
                        )}
                    </motion.div>
                </AnimatePresence>
                 <div className="flex justify-center gap-2 mt-6">
                    {news.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                                i === index ? 'bg-blue-500' : 'bg-slate-600 hover:bg-slate-500'
                            }`}
                            aria-label={`Ir para notícia ${i + 1}`}
                        />
                    ))}
                </div>
            </>
        );
    };

    return (
        <Card 
            className="bg-card/50 backdrop-blur-lg border-slate-700 h-full flex flex-col"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <Newspaper className="w-6 h-6 text-blue-400" />
                    Notícias e Alertas
                </CardTitle>
                <CardDescription>Atualizações importantes do sistema.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-center overflow-hidden">
                {renderContent()}
            </CardContent>
        </Card>
    );
};

export default NewsCarousel;
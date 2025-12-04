import React, { useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle, CircleDashed, Route } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const PatientJourneyTracker = ({ patientId }) => {
    const { mailboxes, tags, patientJourneys, updatePatientJourneyTag } = useData();

    const patientJourney = useMemo(() => {
        return patientJourneys.find(j => j.patient_id === patientId) || { patient_id: patientId, tags: [] };
    }, [patientJourneys, patientId]);

    const journeyConfig = useMemo(() => {
        return mailboxes.flatMap(mb => mb.functions.map(func => ({
            name: func.name,
            tags: func.tags.map(tagId => tags.find(t => t.id === tagId)).filter(Boolean)
        })));
    }, [mailboxes, tags]);
    
    const isTagCompleted = (tagId) => {
        return patientJourney.tags.some(t => t.tagId === tagId);
    }
    
    const getTagTimestamp = (tagId) => {
        const tag = patientJourney.tags.find(t => t.tagId === tagId);
        return tag ? new Date(tag.timestamp).toLocaleString('pt-BR') : null;
    }

    if (!journeyConfig || journeyConfig.length === 0) {
        return null;
    }

    return (
        <Card className="glass-effect-strong">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Route className="h-5 w-5 text-primary" />
                    Jornada do Paciente
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <TooltipProvider>
                    {journeyConfig.map((journeyStep, stepIndex) => (
                        <motion.div
                            key={stepIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: stepIndex * 0.1 }}
                        >
                            <h3 className="font-semibold text-lg mb-3">{journeyStep.name}</h3>
                            <div className="flex items-center space-x-2 overflow-x-auto pb-3">
                                {journeyStep.tags.map((tag, tagIndex) => {
                                    const completed = isTagCompleted(tag.id);
                                    return (
                                        <React.Fragment key={tag.id}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <motion.div
                                                        className={cn(
                                                            "flex flex-col items-center justify-center text-center cursor-pointer min-w-[100px]",
                                                        )}
                                                        onClick={() => updatePatientJourneyTag(patientId, tag.id)}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <div className={cn(
                                                            "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                                                            completed ? "bg-green-500 border-green-600" : "bg-secondary border-border"
                                                        )}>
                                                            {completed ? <CheckCircle className="text-white" /> : <CircleDashed className="text-muted-foreground" />}
                                                        </div>
                                                        <p className={cn(
                                                            "text-xs mt-2 font-medium",
                                                            completed ? "text-foreground" : "text-muted-foreground"
                                                        )}>{tag.name}</p>
                                                    </motion.div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{completed ? `Concluído em: ${getTagTimestamp(tag.id)}` : 'Marcar como concluído'}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            {tagIndex < journeyStep.tags.length - 1 && (
                                                <div className={cn(
                                                    "flex-1 h-0.5",
                                                     isTagCompleted(journeyStep.tags[tagIndex + 1].id) ? "bg-green-500" : "bg-border"
                                                    )} />
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ))}
                </TooltipProvider>
            </CardContent>
        </Card>
    );
};

export default PatientJourneyTracker;
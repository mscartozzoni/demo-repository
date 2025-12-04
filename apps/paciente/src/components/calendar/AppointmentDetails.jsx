
import React from 'react';
import { Clock, User, AlertTriangle, MoreVertical, Video, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';

const AppointmentDetails = ({ appointment, onCardClick, onCancel, onReschedule, onClose, isOpen, timeZone = 'America/Sao_Paulo', loading, error }) => {
    if (!isOpen) return null;

    // Loading state
    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed inset-x-0 bottom-0 z-50 bg-slate-900/80 backdrop-blur-sm p-4"
            >
                <div className="flex items-center justify-center h-full max-w-4xl mx-auto p-8 rounded-t-xl glass-effect">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                    <p className="ml-4">Carregando detalhes do agendamento...</p>
                </div>
            </motion.div>
        );
    }
    
    // Error state
    if (error) {
        return (
             <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed inset-x-0 bottom-0 z-50 bg-slate-900/80 backdrop-blur-sm p-4"
            >
                <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto p-8 rounded-t-xl glass-effect border-t-2 border-red-500/50">
                    <XCircle className="w-10 h-10 text-red-500 mb-4" />
                    <p className="font-semibold text-lg">Erro ao carregar agendamento</p>
                    <p className="text-gray-400 text-sm mb-6">{error.message || 'Não foi possível buscar os detalhes.'}</p>
                    <Button onClick={onClose} variant="destructive">Fechar</Button>
                </div>
            </motion.div>
        );
    }
    
    // Appointment is null but no error/loading, likely just closed.
    if (!appointment) return null;


    const getStatusInfo = (status) => {
        switch (status) {
            case 'agendado': return { text: 'Agendado', color: 'border-blue-500/50', textColor: 'text-blue-300' };
            case 'realizada': return { text: 'Realizada', color: 'border-green-500/50', textColor: 'text-green-300' };
            case 'cancelado': return { text: 'Cancelado', color: 'border-red-500/50', textColor: 'text-red-300' };
            case 'não compareceu': return { text: 'Não Compareceu', color: 'border-yellow-500/50', textColor: 'text-yellow-300' };
            default: return { text: 'Pendente', color: 'border-gray-500/50', textColor: 'text-gray-300' };
        }
    };

    const now = new Date();
    const startTimeStr = appointment?.start_at || appointment?.appointment_time;
    const endTimeStr = appointment?.end_at;
    
    const startTimeObj = startTimeStr ? new Date(startTimeStr) : null;
    const endTimeObj = endTimeStr ? new Date(endTimeStr) : null;
    
    const startValid = startTimeObj && !isNaN(startTimeObj);
    const endValid = endTimeObj && !isNaN(endTimeObj);

    const timeFmt = { hour: '2-digit', minute: '2-digit', timeZone };
    const startTime = startValid ? startTimeObj.toLocaleTimeString('pt-BR', timeFmt) : 'Inválido';
    const endTime = endValid ? endTimeObj.toLocaleTimeString('pt-BR', timeFmt) : 'Inválido';

    const isFuture = startValid ? (startTimeObj.getTime() > now.getTime()) : false;
    let baseStatus = (appointment?.status || 'agendado').toLowerCase();
    
    if (isFuture && (baseStatus === 'realizada' || baseStatus === 'não compareceu')) {
        baseStatus = 'agendado';
    }

    const statusInfo = getStatusInfo(baseStatus);

    const diffMs = startValid ? (startTimeObj.getTime() - now.getTime()) : null;
    const canCancel = diffMs !== null && diffMs > 60 * 60 * 1000;
    const cancelUntil = startValid ? new Date(startTimeObj.getTime() - 60 * 60 * 1000) : null;
    const cancelInfo = isFuture && cancelUntil && !isNaN(cancelUntil)
        ? (canCancel
            ? `Pode cancelar até ${cancelUntil.toLocaleTimeString('pt-BR', timeFmt)}`
            : 'Apenas remarcação (menos de 1h)')
        : null;

    const isCadastroIncompleto = !appointment.patient?.cpf || !appointment.patient?.birthdate;
    const isOnline = appointment.is_online || appointment.visit_type === 'Consulta Online';

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed inset-x-0 bottom-0 z-50 bg-slate-900/80 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <div 
                        className={`max-w-4xl mx-auto p-6 my-4 rounded-xl glass-effect border-t-2 ${statusInfo.color}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <h4 className="font-bold text-xl capitalize flex items-center gap-2">
                                    {isOnline && <Video className="w-5 h-5 text-cyan-400" />}
                                    {appointment?.visit_type}
                                </h4>
                                <div className="flex items-center space-x-2 text-md text-gray-300 mt-2">
                                    <User className="w-4 h-4" />
                                    <span>{appointment?.patient?.full_name || 'Paciente não encontrado'}</span>
                                     {isCadastroIncompleto && <AlertTriangle className="w-4 h-4 text-yellow-400" title="Cadastro Incompleto" />}
                                </div>
                                <div className="flex items-center space-x-2 text-md text-gray-300 mt-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{startTime} - {endTime}</span>
                                </div>
                                {cancelInfo && (
                                    <div className="text-xs text-gray-400 mt-2">
                                        {cancelInfo}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col items-end space-y-4">
                                <span className={`status-badge ${statusInfo.color.replace('border-', 'bg-').replace('/50', '/20')} ${statusInfo.textColor} border-none text-sm font-semibold`}>
                                    {statusInfo.text}
                                </span>
                                <div className="flex items-center gap-2">
                                    {isFuture && (
                                        <>
                                            {canCancel ? (
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={(e) => { e.stopPropagation(); onCancel?.(appointment); }}
                                                >
                                                    Cancelar
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={(e) => { e.stopPropagation(); onReschedule?.(appointment); }}
                                                >
                                                    Remarcar
                                                </Button>
                                            )}
                                        </>
                                    )}
                                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0" title="Mais opções" onClick={(e) => { e.stopPropagation(); onCardClick?.(appointment); }}>
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                     <Button variant="ghost" size="icon" className="h-8 w-8 p-0" title="Fechar" onClick={onClose}>
                                        <XCircle className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AppointmentDetails;

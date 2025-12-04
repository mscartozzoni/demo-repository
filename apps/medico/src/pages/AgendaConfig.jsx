
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { PlusCircle, Edit, Trash2, Laptop as Notebook, Loader2, Clock, Hourglass, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getConsultationTypes, deleteConsultationType } from '@/services/api/consultationTypes';
import ConsultationTypeModal from '@/components/agenda/ConsultationTypeModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AgendaConfig = () => {
    const { toast } = useToast();
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [typeToEdit, setTypeToEdit] = useState(null);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [typeToDelete, setTypeToDelete] = useState(null);

    const fetchTypes = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getConsultationTypes();
            setTypes(data);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Erro ao buscar tipos', description: error.message });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchTypes();
    }, [fetchTypes]);

    const handleAdd = () => {
        setTypeToEdit(null);
        setIsModalOpen(true);
    };

    const handleEdit = (type) => {
        setTypeToEdit(type);
        setIsModalOpen(true);
    };

    const openDeleteConfirm = (type) => {
        setTypeToDelete(type);
        setIsAlertOpen(true);
    };

    const handleDelete = async () => {
        if (!typeToDelete) return;
        try {
            await deleteConsultationType(typeToDelete.id);
            toast({ title: 'Tipo de consulta excluído!', className: 'bg-green-600 text-white' });
            fetchTypes();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Erro ao excluir', description: error.message });
        } finally {
            setIsAlertOpen(false);
            setTypeToDelete(null);
        }
    };

    const onTypeAdded = () => {
        fetchTypes();
    };

    return (
        <>
            <Helmet>
                <title>Configurações de Agenda - Portal do Médico</title>
                <meta name="description" content="Gerencie os tipos de consulta da sua agenda." />
            </Helmet>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
            >
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Notebook className="w-8 h-8 text-primary" />
                        <div>
                            <h1 className="text-3xl font-bold text-white">Configurações de Agenda</h1>
                            <p className="text-slate-400 mt-1">Gerencie os tipos de consulta para agendamentos.</p>
                        </div>
                    </div>
                    <Button onClick={handleAdd}>
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Novo Tipo
                    </Button>
                </div>

                <div className="glass-effect rounded-xl p-6 md:p-8">
                    {loading ? (
                        <div className="flex justify-center items-center py-10">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : types.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-slate-400">Nenhum tipo de consulta encontrado.</p>
                            <p className="text-slate-500 text-sm">Clique em "Novo Tipo" para começar.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {types.map((type) => (
                                <motion.div
                                    key={type.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-800/50 p-4 rounded-lg border border-slate-700 gap-4"
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: type.color }}></div>
                                        <span className="font-medium text-white flex-1">{type.name}</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm text-slate-400 w-full sm:w-auto">
                                        <div className="flex items-center gap-2" title="Duração">
                                            <Clock className="w-4 h-4 text-primary" />
                                            <span>{type.duration || 'N/A'} min</span>
                                        </div>
                                        <div className="flex items-center gap-2" title="Intervalo">
                                            <Hourglass className="w-4 h-4 text-primary" />
                                            <span>{type.interval || 0} min</span>
                                        </div>
                                        <div className="flex items-center gap-2" title={`Atualizado em ${type.lastUpdated ? format(new Date(type.lastUpdated), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : 'N/A'}`}>
                                            <Calendar className="w-4 h-4 text-primary" />
                                            <span>{type.lastUpdated ? formatDistanceToNow(new Date(type.lastUpdated), { addSuffix: true, locale: ptBR }) : 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 self-end sm:self-center">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(type)}>
                                            <Edit className="w-4 h-4 text-slate-400 hover:text-primary" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => openDeleteConfirm(type)}>
                                            <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>

            <ConsultationTypeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onTypeAdded={onTypeAdded}
                typeToEdit={typeToEdit}
            />

            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent className="bg-slate-800 border-slate-700 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isso excluirá permanentemente o tipo de consulta
                            <span className="font-bold text-yellow-400"> "{typeToDelete?.name}"</span>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default AgendaConfig;

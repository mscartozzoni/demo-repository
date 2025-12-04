
import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FolderKanban, FilePlus, Search, FileText, Download, Eye, Loader2, ServerCrash, FileArchive as ArchiveIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { getAllDocuments } from '@/services/api/documents';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  FileTextIcon as AtendimentoIcon,
  ReaderIcon as EvolucaoIcon,
  ActivityLogIcon as ExamesIcon,
  MixIcon as ReceitaIcon,
  SewingPinIcon as CirurgicoIcon
} from '@radix-ui/react-icons';
import { useLocation } from 'react-router-dom';

const getDocumentIcon = (type) => {
  if (type?.includes('cirurgico')) return <CirurgicoIcon className="w-5 h-5 text-purple-400" />;
  if (type === 'atendimento') return <AtendimentoIcon className="w-5 h-5 text-blue-400" />;
  if (type === 'evolucao') return <EvolucaoIcon className="w-5 h-5 text-orange-400" />;
  if (type === 'exames') return <ExamesIcon className="w-5 h-5 text-green-400" />;
  if (type === 'receita') return <ReceitaIcon className="w-5 h-5 text-yellow-400" />;
  return <FileText className="w-5 h-5 text-slate-400" />;
};

const Documents = () => {
    const { toast } = useToast();
    const location = useLocation();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isNewTemplateModalOpen, setNewTemplateModalOpen] = useState(false);

    useEffect(() => {
        if (location.state?.openNewTemplateModal) {
            setNewTemplateModalOpen(true);
        }
    }, [location.state]);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                setLoading(true);
                const result = await getAllDocuments();
                if (result.success) {
                    setDocuments(result.data);
                } else {
                    setError('Falha ao carregar os documentos. Tente novamente mais tarde.');
                    toast({ variant: 'destructive', title: 'Erro', description: result.message });
                }
            } catch (e) {
                setError('Ocorreu um erro inesperado.');
                toast({ variant: 'destructive', title: 'Erro de Conexão', description: e.message });
            } finally {
                setLoading(false);
            }
        };
        fetchDocuments();
    }, [toast]);

    const filteredDocuments = useMemo(() => {
        if (!searchTerm) return documents;
        return documents.filter(doc =>
            doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.patient?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.type?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [documents, searchTerm]);
    
    const handleDownload = (doc) => {
        if (doc.file_url) {
            window.open(doc.file_url, '_blank');
        } else {
            toast({
                variant: 'destructive',
                title: 'Link não disponível',
                description: 'Este documento não possui um arquivo para download.',
            });
        }
    };
    
    const handleNewTemplate = () => {
        toast({ title: "🚧 Funcionalidade em breve!", description: "A criação de modelos de documento estará disponível em breve." });
        setNewTemplateModalOpen(false);
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="h-48 flex flex-col items-center justify-center bg-slate-800/50 rounded-lg text-center p-4">
                    <Loader2 className="w-12 h-12 text-slate-500 animate-spin mb-4" />
                    <h4 className="font-semibold text-white">Carregando documentos...</h4>
                    <p className="text-sm text-slate-400">Só um instante, por favor.</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="h-48 flex flex-col items-center justify-center bg-red-900/20 border border-red-700 rounded-lg text-center p-4">
                    <ServerCrash className="w-12 h-12 text-red-400 mb-4" />
                    <h4 className="font-semibold text-white">Erro ao Carregar</h4>
                    <p className="text-sm text-red-300">{error}</p>
                </div>
            );
        }

        if (filteredDocuments.length === 0) {
            return (
                <div className="h-48 flex flex-col items-center justify-center bg-slate-800/50 rounded-lg text-center p-4">
                    <ArchiveIcon className="w-16 h-16 text-slate-600 mb-4" />
                    <h4 className="font-semibold text-white">Nenhum documento encontrado</h4>
                    <p className="text-sm text-slate-400">Use a busca para refinar ou crie novos documentos para seus pacientes.</p>
                </div>
            );
        }

        return (
            <div className="space-y-3">
                {filteredDocuments.map(doc => {
                    const isValidDate = doc.updated_at && !isNaN(new Date(doc.updated_at));
                    const formattedDate = isValidDate
                        ? formatDistanceToNow(new Date(doc.updated_at), { addSuffix: true, locale: ptBR })
                        : 'data indisponível';

                    return (
                        <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="glass-effect p-4 rounded-xl flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-800 rounded-lg">{getDocumentIcon(doc.type)}</div>
                                <div>
                                    <p className="font-semibold text-white">{doc.title}</p>
                                    <p className="text-sm text-slate-400">
                                        Paciente: {doc.patient?.full_name || 'N/A'} • Atualizado {formattedDate}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                                    doc.status === 'finalizado' ? 'bg-green-500/20 text-green-300' :
                                    doc.status === 'enviado' ? 'bg-blue-500/20 text-blue-300' :
                                    'bg-yellow-500/20 text-yellow-300'
                                }`}>
                                    {doc.status || 'rascunho'}
                                </span>
                                <Button size="icon" variant="ghost" onClick={() => handleDownload(doc)} disabled={!doc.file_url}>
                                    <Eye className="w-5 h-5" />
                                </Button>
                                <Button size="icon" variant="ghost" onClick={() => handleDownload(doc)} disabled={!doc.file_url}>
                                    <Download className="w-5 h-5" />
                                </Button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="space-y-8">
            <Helmet>
                <title>Gerenciador de Arquivos - Portal do Médico</title>
                <meta name="description" content="Gerencie, busque e organize seus documentos." />
            </Helmet>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-white leading-tight flex items-center gap-3">
                            <FolderKanban className="w-10 h-10" />
                            Gerenciador de Arquivos
                        </h1>
                        <p className="text-lg text-slate-300 mt-2">
                            Visualize e organize todos os documentos dos seus pacientes.
                        </p>
                    </div>
                    <Button
                        onClick={handleNewTemplate}
                        size="lg"
                    >
                        <FilePlus className="w-5 h-5 mr-2" />
                        Novo Modelo
                    </Button>
                </div>
            </motion.div>

            <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                    placeholder="Buscar por título, paciente ou tipo de documento..."
                    className="pl-12 pr-4 py-6 text-base bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="glass-effect p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-4">Todos os Documentos</h3>
                {renderContent()}
            </div>
        </div>
    );
};

export default Documents;

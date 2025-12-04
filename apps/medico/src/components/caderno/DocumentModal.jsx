import React, { useState, useEffect, useId } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CircleDot as DiscIcon, DownloadCloud as DownloadIcon, Eye as PreviewIcon, Pencil as EditIcon, Stethoscope } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import TemplateAtendimento from './templates/TemplateAtendimento';
import TemplateEvolucao from './templates/TemplateEvolucao';
import TemplateReceita from './templates/TemplateReceita';
import TemplateExames from './templates/TemplateExames';
import SurgeryScheduleModal from './SurgeryScheduleModal';

const DocumentModal = ({ type, title, icon: Icon, patient, onSave, onGeneratePDF, trigger, document: existingDocument, isOpen: controlledIsOpen, setIsOpen: setControlledIsOpen }) => {
    const { toast } = useToast();
    const [documentContent, setDocumentContent] = useState({});
    
    const [isLocalOpen, setLocalOpen] = useState(false);
    const isOpen = controlledIsOpen ?? isLocalOpen;
    const setIsOpen = setControlledIsOpen ?? setLocalOpen;

    const [doctor, setDoctor] = useState(null);
    const [documentId, setDocumentId] = useState(null);
    const [viewMode, setViewMode] = useState('edit'); 
    const uniqueId = useId();

    const isImmutable = (type === 'receita' || type === 'exames') && existingDocument?.status === 'finalizado';
    const isCancelled = existingDocument?.status === 'cancelado';

    useEffect(() => {
        setDoctor({
            name: "Dr. Marcio Castozzonni",
            specialty: "Cirurgião Plástico",
            crm: "CRM/SP 123456"
        });

        if (isOpen) {
            if (existingDocument) {
                setDocumentId(existingDocument.id);
                setDocumentContent(existingDocument.content || {});
            } else {
                setDocumentId(crypto.randomUUID());
                setDocumentContent({});
            }
             setViewMode((isImmutable || isCancelled) ? 'preview' : 'edit');
        }
    }, [isOpen, existingDocument]);

    const handleSave = async (status) => {
        if (isImmutable || isCancelled) {
            toast({ variant: 'destructive', title: 'Não permitido', description: 'Documentos finalizados ou cancelados não podem ser alterados.' });
            return { success: false };
        }

        const doc = {
            id: documentId,
            patient_id: patient?.id,
            type: type,
            title: title,
            content: documentContent,
            status: status
        };

        const isUpdating = !!(existingDocument && existingDocument.id);
        const result = await onSave(doc, isUpdating ? documentId : null);
        
        if (result.success) {
            if (status === 'rascunho') {
                toast({ title: 'Rascunho Salvo!', description: `Seu documento foi salvo com sucesso.`, className: "bg-blue-600 text-white" });
            }
            if (!['receita', 'exames'].includes(type)){
               setIsOpen(false);
            }
        }
        return result;
    };
    
    const handleGeneratePDFClick = async () => {
        const saveResult = await handleSave('finalizado');
        if (saveResult.success) {
             onGeneratePDF(saveResult.data);
             setIsOpen(false);
        }
    };
    
    const getTemplateComponent = (isForPreview = false) => {
        const props = { 
            content: documentContent, 
            setContent: setDocumentContent, 
            patient,
            doctor,
            printableId: `printable-content-${type}-${uniqueId}`,
            isPreview: isForPreview,
            isImmutable: isImmutable,
            isCancelled: isCancelled,
        };

        const templates = {
            atendimento: <TemplateAtendimento {...props} />,
            evolucao: <TemplateEvolucao {...props} />,
            receita: <TemplateReceita {...props} />,
            exames: <TemplateExames {...props} />,
        };

        return templates[type] || (
            <div className="p-4 text-white">
                <h3 className="font-bold mb-2">Editor de Documento</h3>
                <p className="text-sm text-slate-400 mb-4">Esta é uma área para documentos personalizados.</p>
                <textarea 
                    className="w-full h-64 bg-slate-700 border border-slate-600 rounded-md p-2 text-white"
                    placeholder="Digite o conteúdo do seu documento aqui..."
                    value={documentContent.text || ''}
                    onChange={(e) => setDocumentContent({ ...documentContent, text: e.target.value })}
                    disabled={isImmutable || isCancelled}
                />
            </div>
        );
    };
    
    const renderFooter = () => {
        if (isCancelled) {
             return (
                 <div className="flex justify-center items-center w-full">
                    <p className="text-red-400 font-bold">Este documento está cancelado e não pode ser alterado.</p>
                </div>
            )
        }
        
        // This is for receita and exames, which stay open
        if (type === 'receita' || type === 'exames') {
             return (
                <div className="flex justify-between items-center w-full">
                     <Button onClick={() => handleSave('rascunho')} variant="shine">
                        <DiscIcon className="w-4 h-4 mr-2" />
                        Salvar Rascunho
                    </Button>
                    <Button onClick={handleGeneratePDFClick} variant="gradient" disabled={isImmutable}>
                        <DownloadIcon className="w-4 h-4 mr-2" />
                        {isImmutable ? 'Documento Finalizado' : 'Finalizar e Gerar PDF'}
                    </Button>
                </div>
            )
        }


        if (viewMode === 'preview') {
            return (
                <div className="flex justify-between items-center w-full">
                    <div>
                        <Button onClick={() => setViewMode('edit')} variant="outline" className="border-green-500 text-green-400 hover:bg-green-900/50 hover:text-green-300">
                            <EditIcon className="w-4 h-4 mr-2" />
                            Editar Ficha
                        </Button>
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={() => handleSave('rascunho')} variant="shine">
                            <DiscIcon className="w-4 h-4 mr-2" />
                            Salvar Rascunho
                        </Button>
                        <Button onClick={handleGeneratePDFClick} variant="gradient">
                            <DownloadIcon className="w-4 h-4 mr-2" />
                            Finalizar e Gerar PDF
                        </Button>
                    </div>
                </div>
            )
        }
        
        // Edit mode footer (for atendimento, evolucao, etc)
        return (
             <div className="flex justify-between items-center w-full">
                <div>
                     {type === 'atendimento' && (
                        <SurgeryScheduleModal
                            patientId={patient?.id}
                            surgicalIndication={documentContent.indicacao_cirurgica}
                            onSave={onSave}
                        />
                    )}
                </div>
                <div className="flex gap-3">
                    <Button onClick={() => handleSave('rascunho')} variant="shine">
                        <DiscIcon className="w-4 h-4 mr-2" />
                        Salvar Rascunho
                    </Button>
                    <Button onClick={() => setViewMode('preview')} variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-900/50 hover:text-blue-300">
                        <PreviewIcon className="w-4 h-4 mr-2" />
                        Visualizar Documento
                    </Button>
                </div>
            </div>
        )
    }

    const TriggerComponent = trigger ? (
      <DialogTrigger asChild>{trigger}</DialogTrigger>
    ) : null;

    const useSideBySideLayout = ['receita', 'exames', 'evolucao'].includes(type);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {TriggerComponent}
            <DialogContent className="bg-slate-800 border-slate-700 max-w-6xl w-[95vw] h-[90vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-white flex items-center gap-2">
                        {Icon && <Icon className="w-5 h-5 text-blue-400" />}
                        {title}
                    </DialogTitle>
                </DialogHeader>
                <div className="flex-grow overflow-y-auto">
                   { useSideBySideLayout
                     ? getTemplateComponent(false)
                     : (
                        viewMode === 'edit' && !isImmutable
                        ? getTemplateComponent(false)
                        : (
                            <div className="bg-slate-200 p-4 rounded-md mx-6">
                                {getTemplateComponent(true)}
                            </div>
                        )
                     )
                   }
                </div>
                <div className="flex justify-between items-center p-6 border-t border-slate-700 no-print">
                    {renderFooter()}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DocumentModal;
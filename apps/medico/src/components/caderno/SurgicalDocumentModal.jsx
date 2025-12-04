import React, { useState, useEffect, useId } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CircleDot as DiscIcon, DownloadCloud as DownloadIcon, Printer as PrinterIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import TemplateSurgical from './templates/TemplateSurgical';

const SurgicalDocumentModal = ({ patient, onSave, onGeneratePDF, trigger }) => {
    const { toast } = useToast();
    const [documentContent, setDocumentContent] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const [documentId, setDocumentId] = useState(null);
    const uniqueId = useId();

    useEffect(() => {
        if (isOpen && !documentId) {
            setDocumentId(crypto.randomUUID());
        } else if (!isOpen) {
            setDocumentId(null);
            setDocumentContent({});
        }
    }, [isOpen]);

    const handleSave = async (status = 'rascunho') => {
        if (!patient) {
            toast({
                variant: 'destructive',
                title: 'Paciente não selecionado',
                description: 'Por favor, selecione um paciente para salvar o documento.',
            });
            return { success: false };
        }

        const doc = {
            id: documentId,
            patient_id: patient.id,
            title: documentContent.documentName || 'Documento Cirúrgico',
            type: `doc_cirurgico_${(documentContent.templateType || 'generico').toLowerCase()}`,
            content: {
                nome: documentContent.documentName,
                texto: documentContent.documentContent,
            },
            status: status,
        };
        
        const result = await onSave(doc, documentId);
        if (result.success) {
            toast({ title: "Documento cirúrgico salvo com sucesso!" });
            setIsOpen(false);
        }
        return result;
    };
    
    const handleGeneratePDFClick = async () => {
        const saveResult = await handleSave('finalizado');
        if (saveResult.success) {
            onGeneratePDF(`printable-content-surgical-${uniqueId}`, saveResult.data);
        }
    };

    const handlePrint = () => {
        const printableContent = document.getElementById(`printable-content-surgical-${uniqueId}`);
        if (printableContent) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write('<html><head><title>Imprimir Documento</title>');
            printWindow.document.write('<script src="https://cdn.tailwindcss.com"></script>');
            printWindow.document.write('<style>@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .no-print { display: none; } .document-page { margin: 0; padding: 20px; border: none; box-shadow: none; } }</style>');
            printWindow.document.write('</head><body class="bg-white">');
            printWindow.document.write(printableContent.innerHTML);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 500); 
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 max-w-5xl text-white">
                <DialogHeader>
                    <DialogTitle>Gerar Documento Cirúrgico</DialogTitle>
                </DialogHeader>
                <div id={`printable-content-surgical-${uniqueId}`} className="max-h-[70vh] overflow-y-auto pr-4 space-y-6 bg-slate-900/50 rounded-lg">
                    <TemplateSurgical
                        content={documentContent}
                        setContent={setDocumentContent}
                        patient={patient}
                    />
                </div>
                <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-slate-700 no-print">
                    <Button onClick={() => handleSave('rascunho')} variant="shine">
                        <DiscIcon className="w-4 h-4 mr-2" />
                        Salvar Documento
                    </Button>
                    <Button onClick={handlePrint} variant="outline" className="border-slate-600">
                        <PrinterIcon className="w-4 h-4 mr-2" />
                        Imprimir
                    </Button>
                    <Button onClick={handleGeneratePDFClick} variant="outline" className="border-slate-600">
                        <DownloadIcon className="w-4 h-4 mr-2" />
                        Gerar PDF
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SurgicalDocumentModal;
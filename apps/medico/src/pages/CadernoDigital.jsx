import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import PatientHeader from '@/components/caderno/PatientHeader';
import DocumentsPanel from '@/components/caderno/DocumentsPanel';
import CanvasEditor from '@/components/caderno/CanvasEditor';
import { useToast } from '@/components/ui/use-toast';
import { getPatientById } from '@/services/api/patients';
import { getDocumentsByPatient, addDocument, updateDocument, deleteDocument } from '@/services/api/documents';
import { Button } from '@/components/ui/button';
import { WalletCards as IdCard } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import DocumentModal from '@/components/caderno/DocumentModal';
import TemplateAtendimento from '@/components/caderno/templates/TemplateAtendimento';
import TemplateEvolucao from '@/components/caderno/templates/TemplateEvolucao';
import TemplateReceita from '@/components/caderno/templates/TemplateReceita';
import TemplateExames from '@/components/caderno/templates/TemplateExames';
import TemplateSurgical from '@/components/caderno/templates/TemplateSurgical';
import { cn } from '@/lib/utils';


const CadernoDigital = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [patient, setPatient] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [loadingPatient, setLoadingPatient] = useState(true);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [modalDocument, setModalDocument] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionDoc, setActionDoc] = useState(null);
  const [currentAction, setCurrentAction] = useState(null); // 'pdf' or 'print'

  const fetchPatientData = async () => {
    try {
      setLoadingPatient(true);
      const { data, error } = await getPatientById(id);
      if (error) throw new Error(error.message);
      setPatient(data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao buscar paciente',
        description: error.message,
      });
    } finally {
      setLoadingPatient(false);
    }
  };

  const fetchDocumentsData = async () => {
    if (!id) return;
    try {
      setLoadingDocuments(true);
      const { data, error } = await getDocumentsByPatient(id);
      if (error) throw new Error(error.message);
      setDocuments(data || []);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao buscar documentos',
        description: error.message,
      });
    } finally {
      setLoadingDocuments(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
    fetchDocumentsData();
  }, [id]);

  const handleSelectDocument = (doc) => {
    // Open editable documents in their modals
    const isEditableInModal = ['receita', 'exames', 'atendimento', 'evolucao'].includes(doc.type) && doc.status !== 'finalizado' && doc.status !== 'cancelado';
    
    if (isEditableInModal) {
      setModalDocument(doc);
      setIsModalOpen(true);
      return;
    }
    
    // Open other docs (notes, surgical, final/cancelled) in preview
    if(doc.type === 'nota' || doc.type.startsWith('doc_cirurgico') || doc.status === 'finalizado' || doc.status === 'cancelado') {
      setPreviewDoc(doc);
    } else {
      // Legacy or custom documents in canvas editor
      setSelectedDocument(doc);
      setPreviewDoc(null);
    }
  };
  
  const onSave = async (doc, docId = null) => {
    try {
        let savedData;
        if(docId) { // Update
            const { data, error } = await updateDocument(docId, doc);
            if (error) throw error;
            savedData = data;
            setDocuments(prev => prev.map(d => (d.id === docId ? data : d)));
        } else { // Create
            const { data, error } = await addDocument(doc);
            if (error) throw error;
            savedData = data;
            setDocuments(prev => [data, ...prev].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
        }

        // If the saved document was being edited in the canvas, update it
        if(selectedDocument && selectedDocument.id === savedData.id) {
             setSelectedDocument(savedData);
        }
       
        return { success: true, data: savedData };

    } catch (error) {
        toast({ variant: 'destructive', title: 'Erro ao salvar', description: error.message });
        return { success: false, error };
    }
  };

  const handleCloneAndEdit = (docToClone) => {
      const isImmutable = docToClone.status === 'finalizado';
      if (!isImmutable) return;

      const newDoc = {
          ...docToClone,
          id: undefined, // Let DB generate new ID
          created_at: undefined,
          updated_at: undefined,
          status: 'rascunho',
          title: `Cópia de ${docToClone.title}`
      };
      
      setModalDocument(newDoc);
      setIsModalOpen(true);
  };

  const handleCancelDocument = async (docId) => {
    try {
        const { data, error } = await updateDocument(docId, { status: 'cancelado' });
        if (error) throw error;
        setDocuments(prev => prev.map(d => (d.id === docId ? data : d)));
        toast({ title: 'Documento Anulado', description: 'O documento foi marcado como "sem efeito".' });
    } catch (error) {
        toast({ variant: 'destructive', title: 'Erro ao anular', description: error.message });
    }
  };

  const handleDeleteDocument = async (docId) => {
    try {
      const docToDelete = documents.find(d => d.id === docId);
      if (!docToDelete || docToDelete.status === 'finalizado') {
          toast({ variant: 'destructive', title: 'Ação não permitida', description: 'Documentos finalizados não podem ser excluídos.' });
          return;
      }

      const { error } = await deleteDocument(docId);
      if (error) throw new Error(error.message);
      
      let newSelectedDoc = null;
      const remainingDocs = documents.filter(d => d.id !== docId);
      
      if (selectedDocument && selectedDocument.id === docId) {
        if(remainingDocs.length > 0) {
            newSelectedDoc = remainingDocs[0];
        }
      } else {
        newSelectedDoc = selectedDocument;
      }
      
      setDocuments(remainingDocs);
      setSelectedDocument(newSelectedDoc);
      
      toast({ title: 'Rascunho excluído!', description: 'O rascunho foi removido com sucesso.', className: "bg-yellow-500 text-black" });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro ao excluir', description: error.message });
    }
  };

  const handleGenerateOrcamento = () => {
    navigate('/medico/orcamento-gestao', { state: { patient: patient } });
  };
  
  const handlePrint = (doc) => {
    setActionDoc(doc);
    setCurrentAction('print');
  };

  const handleGeneratePDF = (doc) => {
    setActionDoc(doc);
    setCurrentAction('pdf');
  };

  const executeAction = async () => {
    if (!actionDoc || !currentAction) return;
    
    const printableElementId = 'printable-content-for-action';
    const input = document.getElementById(printableElementId);
    
    if (!input) {
      toast({ variant: "destructive", title: "Erro na Ação", description: "Não foi possível encontrar o conteúdo para processar." });
      return;
    }

    if (currentAction === 'print') {
        document.body.classList.add('printing');
        window.print();
        document.body.classList.remove('printing');
    } else if (currentAction === 'pdf') {
       toast({ title: "Gerando PDF...", description: "Aguarde, estamos preparando seu documento." });
       try {
        const canvas = await html2canvas(input, { scale: 2, useCORS: true, logging: false, windowWidth: input.scrollWidth, windowHeight: input.scrollHeight });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;
        const pdfHeight = pdfWidth / ratio;
        const totalPages = Math.ceil(imgHeight / (imgWidth * (pdf.internal.pageSize.getHeight() / pdf.internal.pageSize.getWidth())));
        
        let position = 0;
        let heightLeft = imgHeight;
        
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= (imgWidth * (pdf.internal.pageSize.getHeight() / pdf.internal.pageSize.getWidth()));
        
        while (heightLeft > 0) {
            position = -heightLeft;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
            heightLeft -= (imgWidth * (pdf.internal.pageSize.getHeight() / pdf.internal.pageSize.getWidth()));
        }

        const safeTitle = actionDoc.title.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
        const patientFirstName = patient?.full_name.split(' ')[0] || 'Paciente';
        const dateStr = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
        const fileName = `${safeTitle}_${patientFirstName}_${dateStr}.pdf`;
        
        pdf.save(fileName);
        toast({ title: "PDF Gerado!", description: `O arquivo ${fileName} foi baixado.`, className: "bg-green-600 text-white" });
      } catch (error) {
          console.error("Erro ao gerar PDF: ", error);
          toast({ variant: "destructive", title: "Ops! Algo deu errado", description: "Não foi possível gerar o PDF. Tente novamente." });
      }
    }

    // Reset after action
    setActionDoc(null);
    setCurrentAction(null);
  };
  
  useEffect(() => {
    if (actionDoc && currentAction) {
        const timer = setTimeout(() => executeAction(), 100);
        return () => clearTimeout(timer);
    }
  }, [actionDoc, currentAction]);
  

  const getPreviewComponent = (doc, isForAction = false) => {
    if (!doc) return null;
    const props = {
      content: doc.content,
      setContent: () => {},
      patient,
      printableId: isForAction ? 'printable-content-for-action' : 'printable-content-preview',
      isPreview: true,
      isCancelled: doc.status === 'cancelado',
    };

    const templates = {
      atendimento: <TemplateAtendimento {...props} />,
      evolucao: <TemplateEvolucao {...props} />,
      receita: <TemplateReceita {...props} />,
      exames: <TemplateExames {...props} />,
      nota: (
          <div className="p-4 bg-yellow-100/80 rounded-md text-black relative">
              <h3 className="font-bold text-lg mb-2">{doc.title}</h3>
              {doc.content?.note && <p className="whitespace-pre-wrap">{doc.content.note}</p>}
              {doc.content?.checklist && doc.content.checklist.length > 0 && (
                  <div className="mt-4">
                      <h4 className="font-semibold mb-2">Checklist</h4>
                      <ul className="space-y-1">
                          {doc.content.checklist.map(item => (
                              <li key={item.id} className={`flex items-center gap-2 ${item.completed ? 'text-gray-500 line-through' : ''}`}>
                                  <input type="checkbox" checked={item.completed} readOnly className="h-4 w-4"/>
                                  <span>{item.text}</span>
                              </li>
                          ))}
                      </ul>
                  </div>
              )}
          </div>
      ),
    };
    
    if (doc.type.startsWith('doc_cirurgico')) {
        return <TemplateSurgical {...props} isForPreview={true} />;
    }

    return templates[doc.type] || <div className="p-4 bg-gray-100 rounded-md text-black">{JSON.stringify(doc.content)}</div>;
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <h1 className="text-2xl font-bold text-white">Prontuário do Paciente</h1>
          <Button 
            onClick={handleGenerateOrcamento} 
            variant="shine" 
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 w-full md:w-auto shrink-0"
            disabled={!patient}
          >
            <IdCard className="w-4 h-4 mr-2" />
            Gerar Orçamento
          </Button>
        </motion.div>
        
        <PatientHeader patient={patient} loading={loadingPatient} />
        
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="xl:col-span-4"
          >
            <DocumentsPanel 
              documents={documents}
              patient={patient}
              selectedDocument={selectedDocument}
              onSelectDocument={handleSelectDocument}
              onSave={onSave}
              onDeleteDocument={handleDeleteDocument}
              onGeneratePDF={handleGeneratePDF}
              onPrint={handlePrint}
              onCloneAndEdit={handleCloneAndEdit}
              onCancelDocument={handleCancelDocument}
              loading={loadingDocuments}
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="xl:col-span-8 flex flex-col bg-slate-800/50 rounded-xl border border-slate-700 min-h-[600px]"
          >
            <CanvasEditor
              document={selectedDocument}
              onSave={onSave}
              onGeneratePDF={handleGeneratePDF}
            />
          </motion.div>
        </div>
      </div>
      
      <Dialog open={!!previewDoc} onOpenChange={(isOpen) => setPreviewDoc(isOpen ? previewDoc : null)}>
          <DialogContent className="bg-slate-900/80 backdrop-blur-sm border-slate-700 max-w-4xl w-[90vw] h-[85vh] flex flex-col">
              <DialogHeader>
                  <DialogTitle className="text-white">{previewDoc?.title || 'Visualização'}</DialogTitle>
                  <DialogDescription>
                      {previewDoc?.status === 'cancelado' && <span className="text-red-400 font-bold">ESTE DOCUMENTO FOI ANULADO</span>}
                      {previewDoc?.status === 'finalizado' && <span className="text-green-400 font-bold">Documento finalizado em {new Date(previewDoc.updated_at).toLocaleString('pt-BR')}</span>}
                  </DialogDescription>
              </DialogHeader>
              <div className={cn("flex-grow overflow-y-auto bg-slate-200 p-4 rounded-md", {'printable-content-wrapper': currentAction})}>
                 <div id="printable-content-preview">
                    {getPreviewComponent(previewDoc)}
                  </div>
              </div>
          </DialogContent>
      </Dialog>
      
      {/* Hidden container for printing/PDF generation */}
      {actionDoc && (
          <div className="printable-container">
            <div id="printable-content-for-action">
                {getPreviewComponent(actionDoc, true)}
            </div>
          </div>
      )}

      {modalDocument && (
        <DocumentModal
            key={modalDocument.id || `new-${modalDocument.type}`}
            isOpen={isModalOpen}
            setIsOpen={(open) => {
                if(!open) setModalDocument(null);
                setIsModalOpen(open);
            }}
            type={modalDocument.type}
            title={modalDocument.title}
            patient={patient}
            onSave={onSave}
            onGeneratePDF={handleGeneratePDF}
            document={modalDocument}
        />
      )}
    </>
  );
};

export default CadernoDigital;
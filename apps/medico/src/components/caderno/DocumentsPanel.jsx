import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileTextIcon, 
  ReaderIcon, 
  ActivityLogIcon, 
  MixIcon, 
  SewingPinIcon,
  PlusIcon,
  TrashIcon,
  CopyIcon
} from '@radix-ui/react-icons';
import { StickyNote, MoreVertical, Printer, FileDown, Mail, Eye, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DocumentModal from '@/components/caderno/DocumentModal';
import NoteModal from '@/components/caderno/NoteModal';
import SurgicalDocumentModal from './SurgicalDocumentModal';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const documentTypes = [
  { type: "receita", title: "Receita Médica", icon: MixIcon, color: "text-blue-400" },
  { type: "exames", title: "Solicitação de Exames", icon: ActivityLogIcon, color: "text-green-400" },
  { type: "atendimento", title: "Ficha de Atendimento", icon: ReaderIcon, color: "text-purple-400" },
  { type: "evolucao", title: "Evolução Médica", icon: FileTextIcon, color: "text-orange-400" },
];

const DeleteConfirmDialog = ({ onConfirm, children, title, description }) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-slate-800 border-slate-700">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-white">{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Voltar</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">Confirmar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

const DocumentActionsMenu = ({ doc, onGeneratePDF, onPrint, onSelectDocument, onCloneAndEdit, onCancelDocument, onDeleteDocument }) => {
    const { toast } = useToast();
    const isImmutable = doc.status === 'finalizado';
    const isCancelled = doc.status === 'cancelado';

    const handleAction = (actionName) => {
        toast({
            title: `🚧 ${actionName}`,
            description: "Esta funcionalidade será implementada em breve. Você pode solicitá-la no próximo prompt! 🚀",
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:bg-slate-700" onClick={(e) => e.stopPropagation()}>
                    <MoreVertical className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700 text-white w-56">
                
                {(isImmutable || isCancelled) && (
                    <DropdownMenuItem onClick={() => onSelectDocument(doc)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>{isCancelled ? 'Ver Original Cancelado' : 'Apenas Visualizar'}</span>
                    </DropdownMenuItem>
                )}
                
                {!isImmutable && !isCancelled && (
                    <DropdownMenuItem onClick={() => onSelectDocument(doc)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Visualizar / Editar</span>
                    </DropdownMenuItem>
                )}


                <DropdownMenuItem onClick={() => onGeneratePDF(doc)}>
                    <FileDown className="mr-2 h-4 w-4" />
                    <span>Baixar PDF</span>
                </DropdownMenuItem>
                 <DropdownMenuItem onClick={() => onPrint(doc)}>
                    <Printer className="mr-2 h-4 w-4" />
                    <span>Imprimir</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-slate-700" />
                
                {isImmutable && !isCancelled && (
                    <DeleteConfirmDialog 
                        onConfirm={() => onCancelDocument(doc.id)}
                        title="Cancelar Documento?"
                        description="Este documento será marcado como 'SEM EFEITO'. Esta ação não pode ser desfeita, mas você pode criar um novo a seguir."
                    >
                         <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-yellow-900/50 text-yellow-400 focus:text-yellow-300 data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                            <XCircle className="mr-2 h-4 w-4" />
                            <span>Anular Documento</span>
                        </div>
                    </DeleteConfirmDialog>
                )}

                {isImmutable && !isCancelled && (
                    <DropdownMenuItem onClick={() => onCloneAndEdit(doc)}>
                        <CopyIcon className="mr-2 h-4 w-4" />
                        <span>Criar Nova Versão</span>
                    </DropdownMenuItem>
                )}

                <DropdownMenuItem onClick={() => handleAction('Enviar por E-mail')}>
                    <Mail className="mr-2 h-4 w-4" />
                    <span>Enviar por E-mail</span>
                </DropdownMenuItem>
                
                 {!isImmutable && !isCancelled && (
                    <>
                        <DropdownMenuSeparator className="bg-slate-700" />
                        <DeleteConfirmDialog 
                            onConfirm={() => onDeleteDocument(doc.id)}
                            title="Excluir Rascunho?"
                            description="Esta ação não pode ser desfeita. O rascunho será excluído permanentemente."
                        >
                            <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-red-900/50 text-red-400 focus:text-red-300 data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                <TrashIcon className="mr-2 h-4 w-4" />
                                <span>Excluir Rascunho</span>
                            </div>
                        </DeleteConfirmDialog>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};


const DocumentsPanel = ({ documents, patient, selectedDocument, onSelectDocument, onSave, onDeleteDocument, onGeneratePDF, onPrint, loading, onCloneAndEdit, onCancelDocument }) => {

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-effect rounded-xl p-4 h-full flex flex-col"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Documentos</h3>
        
        <div className="border-t border-b border-slate-700/80 my-2 py-4">
          <p className="text-sm font-semibold text-slate-300 mb-3">Ações</p>
          <div className="grid grid-cols-2 gap-3">
            <NoteModal 
                patient={patient}
                onSave={onSave}
                trigger={
                  <Button variant="outline" size="sm" className="w-full justify-center border-amber-500/50 hover:border-amber-500 bg-amber-950/30">
                      <StickyNote className="w-4 h-4 mr-2 text-amber-400" />
                      Nota Rápida
                  </Button>
                }
            />
             <SurgicalDocumentModal 
                patient={patient} 
                onSave={onSave}
                onGeneratePDF={onGeneratePDF}
                trigger={
                    <Button variant="outline" size="sm" className="w-full justify-center border-slate-600 hover:border-purple-500">
                        <SewingPinIcon className="w-4 h-4 mr-2 text-purple-400" />
                        Cirúrgico
                    </Button>
                }
            />
          </div>
        </div>

        <div className="space-y-3 mb-4 mt-2">
            <p className="text-sm font-semibold text-slate-300 mb-3">Modelos Rápidos</p>
            {documentTypes.map(doc => (
                <DocumentModal
                    key={doc.type}
                    type={doc.type}
                    title={doc.title}
                    icon={doc.icon}
                    patient={patient}
                    onSave={onSave}
                    onGeneratePDF={onGeneratePDF}
                    trigger={
                        <Button variant="ghost" className="w-full justify-start gap-3 text-slate-300 hover:bg-slate-700/50 hover:text-white">
                           <doc.icon className={cn("w-4 h-4", doc.color)} />
                           {doc.title}
                        </Button>
                    }
                />
            ))}
            <DocumentModal
                type="custom"
                title="Novo Documento"
                icon={PlusIcon}
                patient={patient}
                onSave={onSave}
                onGeneratePDF={onGeneratePDF}
                trigger={
                    <Button variant="ghost" className="w-full justify-start gap-3 text-slate-300 hover:bg-slate-700/50 hover:text-white">
                       <PlusIcon className="w-4 h-4" />
                       Documento em Branco
                    </Button>
                }
            />
        </div>
        
        <div className="border-t border-slate-700/80 my-2"></div>

        <div className="flex-grow overflow-y-auto pr-1 space-y-2 min-h-[200px]">
          <h4 className="text-sm font-semibold text-slate-400 px-2 pt-2">Histórico</h4>
          {loading && <p className="text-slate-400 text-sm px-2">Carregando histórico...</p>}
          {!loading && documents.map(doc => (
            <div 
              key={doc.id}
              onClick={() => onSelectDocument(doc)}
              className={cn("w-full text-left p-2 rounded-md transition-colors cursor-pointer group flex justify-between items-center",
                selectedDocument?.id === doc.id ? 'bg-blue-600/20' : 'hover:bg-slate-700/50',
                doc.status === 'cancelado' && 'opacity-60 hover:opacity-80'
              )}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                 {doc.type === 'nota' ? <StickyNote className="w-4 h-4 text-amber-400 flex-shrink-0" /> : <FileTextIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                <div className="overflow-hidden">
                    <p className={cn("text-sm font-medium truncate", 
                        selectedDocument?.id === doc.id ? 'text-blue-300' : 'text-white',
                        doc.status === 'cancelado' && 'line-through'
                    )}>{doc.title}</p>
                    <p className="text-xs text-slate-400">{new Date(doc.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
              <div className="flex-shrink-0">
                  <DocumentActionsMenu 
                    doc={doc} 
                    onGeneratePDF={onGeneratePDF}
                    onPrint={onPrint}
                    onDeleteDocument={onDeleteDocument} 
                    onSelectDocument={onSelectDocument}
                    onCloneAndEdit={onCloneAndEdit}
                    onCancelDocument={onCancelDocument}
                  />
              </div>
            </div>
          ))}
          {!loading && documents.length === 0 && <p className="text-slate-400 text-sm px-2 mt-2">Nenhum documento para este paciente ainda.</p>}
        </div>

      </motion.div>
    </>
  );
};

export default DocumentsPanel;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Check, Clock, Copy, Download, FileText, Send as SendIcon, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import GeneratePdfModal from '@/components/modals/GeneratePdfModal';
import SendEmailModal from '@/components/modals/SendEmailModal';
import BudgetStatusTracker from '@/components/views/BudgetStatusTracker';

const BudgetPortalView = ({ quote, onStatusChange }) => {
    const { toast } = useToast();
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);

    const handleCopyLink = () => {
        const link = `${window.location.origin}/portal/budget/${quote.id}`;
        navigator.clipboard.writeText(link);
        toast({ title: 'Link Copiado!', description: 'O link do portal foi copiado para a área de transferência.' });
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'approved': return { icon: Check, color: 'text-green-400', label: 'Aprovado' };
            case 'sent': return { icon: SendIcon, color: 'text-blue-400', label: 'Enviado' };
            case 'draft': return { icon: FileText, color: 'text-yellow-400', label: 'Rascunho' };
            case 'canceled': return { icon: X, color: 'text-red-400', label: 'Cancelado' };
            default: return { icon: Clock, color: 'text-gray-400', label: 'Pendente' };
        }
    };
    
    const StatusIcon = getStatusInfo(quote.status).icon;
    const statusColor = getStatusInfo(quote.status).color;
    const statusLabel = getStatusInfo(quote.status).label;

    return (
        <>
            <motion.div
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                className="max-w-4xl mx-auto p-4 md:p-8 rounded-2xl bg-black/20"
            >
                <Card className="w-full bg-gradient-to-b from-gray-900/50 to-black/30 border-white/10 shadow-2xl">
                    <CardHeader className="text-center p-8 border-b border-white/10">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
                            className={`mx-auto h-16 w-16 mb-4 rounded-full flex items-center justify-center bg-white/10 ${statusColor}`}
                        >
                            <StatusIcon className="h-8 w-8" />
                        </motion.div>
                        <CardTitle className="text-3xl font-bold text-white">Orçamento #{quote.id}</CardTitle>
                        <CardDescription className="text-purple-300">
                            Status atual: <span className={`font-semibold ${statusColor}`}>{statusLabel}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <BudgetStatusTracker status={quote.status} paymentStatus={quote.payment_status} />
                        <Separator className="bg-white/10" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div className="bg-white/5 p-4 rounded-lg">
                                <p className="text-purple-300 font-semibold mb-1">Paciente</p>
                                <p className="text-white text-lg font-bold">{quote.patients?.full_name}</p>
                            </div>
                             <div className="bg-white/5 p-4 rounded-lg">
                                <p className="text-purple-300 font-semibold mb-1">Procedimento</p>
                                <p className="text-white text-lg font-bold">{quote.services?.name}</p>
                            </div>
                        </div>

                        <Separator className="bg-white/10" />

                        <div className="space-y-3">
                             <div className="flex justify-between items-center">
                                <span className="text-purple-200">Valor Total do Procedimento</span>
                                <span className="text-white font-semibold">R$ {Number(quote.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                             <div className="flex justify-between items-center">
                                <span className="text-purple-200">Data de Emissão</span>
                                <span className="text-white font-semibold">{new Date(quote.created_at).toLocaleDateString()}</span>
                            </div>
                            {quote.surgery_date && (
                                 <div className="flex justify-between items-center">
                                    <span className="text-cyan-300 font-semibold">Data da Cirurgia</span>
                                    <span className="text-cyan-300 font-bold">{new Date(quote.surgery_date).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>
                         <Separator className="bg-white/10" />
                          <div className="bg-white/5 p-4 rounded-lg">
                            <h4 className="text-purple-200 font-semibold mb-2">Observações</h4>
                            <p className="text-white whitespace-pre-wrap">{quote.notes || 'Nenhuma observação adicional.'}</p>
                        </div>

                    </CardContent>
                    <CardFooter className="bg-black/20 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-xs text-purple-300 text-center sm:text-left">Este é um portal de visualização interna.</p>
                        <div className="flex items-center gap-2 flex-wrap justify-center">
                            <Button variant="outline" size="sm" className="text-purple-200 border-purple-400" onClick={handleCopyLink}>
                                <Copy className="mr-2 h-4 w-4" /> Copiar Link
                            </Button>
                            <Button variant="outline" size="sm" className="text-cyan-200 border-cyan-400" onClick={() => setShowPdfModal(true)}>
                                 <Download className="mr-2 h-4 w-4" /> Gerar PDF
                            </Button>
                             <Button variant="outline" size="sm" className="text-pink-200 border-pink-400" onClick={() => setShowEmailModal(true)}>
                                 <SendIcon className="mr-2 h-4 w-4" /> Enviar por E-mail
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>
            <GeneratePdfModal isOpen={showPdfModal} onClose={() => setShowPdfModal(false)} quote={quote} />
            <SendEmailModal isOpen={showEmailModal} onClose={() => setShowEmailModal(false)} quote={quote} />
        </>
    );
};

export default BudgetPortalView;
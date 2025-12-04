import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { FileText, Loader2 } from 'lucide-react';

const GeneratePdfModal = ({ isOpen, onClose, quote }) => {
    const [template, setTemplate] = useState('modern');
    const [isGenerating, setIsGenerating] = useState(false);
    const { toast } = useToast();

    const handleGenerate = () => {
        if (!template) {
            toast({
                variant: 'destructive',
                title: 'Erro',
                description: 'Por favor, selecione um template.',
            });
            return;
        }
        setIsGenerating(true);
        setTimeout(() => {
            toast({
                variant: 'success',
                title: 'PDF Gerado (Simulação)!',
                description: `O PDF do orçamento #${quote.id} com o template "${template === 'modern' ? 'Moderno' : 'Clássico'}" está pronto para download.`,
            });
            setIsGenerating(false);
            onClose();
        }, 1000);
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[101]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-gray-900/50 backdrop-blur-xl border border-white/20 rounded-2xl p-8 w-full max-w-md relative"
                >
                    <div className="text-center mb-6">
                        <FileText className="mx-auto h-12 w-12 text-cyan-300 mb-4" />
                        <h2 className="text-2xl font-bold text-white">Gerar PDF do Orçamento</h2>
                        <p className="text-purple-200 mt-2">Selecione um template para o documento.</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <Label className="text-purple-200">Template do PDF</Label>
                            <Select value={template} onValueChange={setTemplate}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Escolha um template" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="modern">Moderno</SelectItem>
                                    <SelectItem value="classic">Clássico</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6 mt-4 border-t border-white/10">
                        <Button type="button" onClick={onClose} variant="outline" className="text-purple-200 border-purple-400 hover:bg-purple-400/10 hover:text-white">
                            Cancelar
                        </Button>
                        <Button onClick={handleGenerate} disabled={isGenerating} className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                            {isGenerating ? <Loader2 className="animate-spin mr-2" /> : <FileText className="mr-2 h-4 w-4" />}
                            {isGenerating ? 'Gerando...' : 'Gerar PDF'}
                        </Button>
                    </div>
                </motion.div>
            </div>
        </Dialog>
    );
};

export default GeneratePdfModal;
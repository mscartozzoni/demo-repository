import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save, FileText, Percent, ListOrdered, Info } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ProtocolFormModal = ({ isOpen, onClose, protocol, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    default_discount_percent: 0,
    max_installments: 1,
    active: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (protocol) {
      setFormData({
        name: protocol.name || '',
        description: protocol.description || '',
        default_discount_percent: protocol.default_discount_percent || 0,
        max_installments: protocol.max_installments || 1,
        active: protocol.active,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        default_discount_percent: 0,
        max_installments: 1,
        active: true,
      });
    }
  }, [protocol, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  
  const handleSwitchChange = (checked) => {
    setFormData(prev => ({ ...prev, active: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Mocking save
    setTimeout(() => {
      toast({
        variant: 'success',
        title: 'Protocolo salvo com sucesso! (simulação)',
        className: 'bg-green-600 text-white'
      });
      onSave();
      onClose();
      setIsSaving(false);
    }, 500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DialogContent className="bg-gray-900 border-purple-800 text-white sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center">
                  <FileText className="mr-2 h-6 w-6 text-purple-400" />
                  {protocol ? 'Editar Protocolo' : 'Novo Protocolo de Pagamento'}
                </DialogTitle>
                <DialogDescription className="text-purple-300">
                  Defina as regras e condições para este protocolo.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="grid gap-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-purple-200">Nome do Protocolo</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="bg-white/10 border-white/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-purple-200">Descrição</Label>
                  <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className="bg-white/10 border-white/20" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="default_discount_percent" className="text-purple-200 flex items-center"><Percent className="h-4 w-4 mr-1"/>Desconto Padrão (%)</Label>
                    <Input id="default_discount_percent" name="default_discount_percent" type="number" step="0.01" value={formData.default_discount_percent} onChange={handleChange} className="bg-white/10 border-white/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max_installments" className="text-purple-200 flex items-center"><ListOrdered className="h-4 w-4 mr-1"/>Parcelas Máximas</Label>
                    <Input id="max_installments" name="max_installments" type="number" step="1" min="1" value={formData.max_installments} onChange={handleChange} className="bg-white/10 border-white/20" />
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-black/20 p-4">
                    <div className="flex flex-col">
                        <Label htmlFor="active-switch" className="font-medium text-purple-200">Protocolo Ativo</Label>
                        <span className="text-xs text-purple-400">Protocolos inativos não podem ser selecionados em novos orçamentos.</span>
                    </div>
                  <Switch
                    id="active-switch"
                    checked={formData.active}
                    onCheckedChange={handleSwitchChange}
                  />
                </div>
              </form>
              <DialogFooter>
                <Button variant="ghost" onClick={onClose} disabled={isSaving}>Cancelar</Button>
                <Button type="submit" onClick={handleSubmit} disabled={isSaving} className="bg-purple-600 hover:bg-purple-700">
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Salvar
                </Button>
              </DialogFooter>
            </DialogContent>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default ProtocolFormModal;
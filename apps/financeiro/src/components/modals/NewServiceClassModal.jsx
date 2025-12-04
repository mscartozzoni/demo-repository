import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { X, Layers, Type, FileText, Image as ImageIcon } from 'lucide-react';

const NewServiceClassModal = ({ isOpen, onClose, onClassCreated }) => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      toast({ variant: 'destructive', title: 'Erro', description: 'O nome da classe de serviço é obrigatório.' });
      return;
    }
    setLoading(true);
    await onClassCreated({ name, description, icon });
    setLoading(false);
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setIcon('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-white/20 rounded-2xl p-8 w-full max-w-lg relative"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="absolute top-4 right-4 text-purple-300 hover:text-white"
          >
            <X className="h-6 w-6" />
          </Button>

          <div className="text-center mb-6">
            <div className="mx-auto bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-lg w-fit mb-4">
              <Layers className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">Nova Classe de Serviço</h2>
            <p className="text-purple-200 mt-2">Crie uma nova categoria para agrupar seus serviços.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-purple-200 flex items-center"><Type className="h-4 w-4 mr-2" />Nome da Classe</Label>
              <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Ex: Consultas" 
                className="bg-white/10 border-white/20 text-white" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-purple-200 flex items-center"><FileText className="h-4 w-4 mr-2" />Descrição</Label>
              <Textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Uma breve descrição da categoria." 
                className="bg-white/10 border-white/20 text-white" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-purple-200 flex items-center"><ImageIcon className="h-4 w-4 mr-2" />Ícone (Lucide)</Label>
              <Input 
                value={icon} 
                onChange={(e) => setIcon(e.target.value)} 
                placeholder="Ex: Stethoscope" 
                className="bg-white/10 border-white/20 text-white" 
              />
               <p className="text-xs text-purple-300">Use um nome de ícone da biblioteca <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="underline">Lucide React</a>.</p>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" onClick={handleClose} variant="outline" className="text-purple-200 border-purple-400 hover:bg-purple-400/10 hover:text-white">
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                {loading ? 'Criando...' : 'Criar Classe'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </Dialog>
  );
};

export default NewServiceClassModal;
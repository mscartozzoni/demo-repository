import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { User, Mail, Phone } from 'lucide-react';

const NewUserForm = ({ onUserCreated, onCancel }) => {
  const [formData, setFormData] = useState({ full_name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name) {
      toast({ variant: "destructive", title: "Erro", description: "O nome completo é obrigatório." });
      return;
    }
    setLoading(true);

    // Mock user creation
    setTimeout(() => {
        const newUser = { id: `mock_${Date.now()}`, ...formData };
        setLoading(false);
        toast({ title: "Sucesso!", description: `Paciente ${newUser.full_name} criado (simulação).` });
        onUserCreated(newUser);
    }, 500);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label className="text-purple-200 flex items-center"><User className="h-4 w-4 mr-2" />Nome Completo</Label>
          <Input name="full_name" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} placeholder="Nome do Paciente" className="bg-white/10 border-white/20 text-white" required />
        </div>
        <div className="space-y-2">
          <Label className="text-purple-200 flex items-center"><Mail className="h-4 w-4 mr-2" />E-mail</Label>
          <Input name="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="email@exemplo.com" className="bg-white/10 border-white/20 text-white" />
        </div>
        <div className="space-y-2">
          <Label className="text-purple-200 flex items-center"><Phone className="h-4 w-4 mr-2" />Telefone</Label>
          <Input name="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="(00) 90000-0000" className="bg-white/10 border-white/20 text-white" />
        </div>
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" onClick={onCancel} variant="outline" className="text-purple-200 border-purple-400 hover:bg-purple-400/10 hover:text-white">
            Cancelar
          </Button>
          <Button type="submit" disabled={loading} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            {loading ? 'Salvando...' : 'Salvar Paciente'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default NewUserForm;
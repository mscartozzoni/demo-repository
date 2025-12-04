import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Mail, Phone, Edit, Trash2, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

const Patients = ({ patients, setPatients }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    birthDate: '',
    firstConsultationDate: '',
    lastConsultationDate: ''
  });

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', cpf: '', birthDate: '', firstConsultationDate: '', lastConsultationDate: '' });
    setEditingPatient(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingPatient) {
      const updatedPatients = patients.map(p =>
        p.id === editingPatient.id ? { ...editingPatient, ...formData } : p
      );
      setPatients(updatedPatients);
      toast({
        title: "Sucesso! ✨",
        description: "Paciente atualizado com sucesso!",
      });
    } else {
      if (patients.some(p => p.phone === formData.phone)) {
        toast({
          variant: "destructive",
          title: "Telefone duplicado!",
          description: "Um paciente com este número de telefone já existe.",
        });
        return;
      }

      const newPatient = {
        ...formData,
        id: `PAT-${Date.now()}`, // Auto-generate patientId
        createdAt: new Date().toISOString()
      };
      setPatients([newPatient, ...patients]);
      toast({
        title: "Sucesso! 🎉",
        description: "Paciente adicionado com sucesso!",
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name || '',
      email: patient.email || '',
      phone: patient.phone || '',
      cpf: patient.cpf || '',
      birthDate: patient.birthDate || '',
      firstConsultationDate: patient.firstConsultationDate || '',
      lastConsultationDate: patient.lastConsultationDate || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    // In a real app, you'd check for associated budgets/appointments first
    setPatients(patients.filter(p => p.id !== id));
    toast({
      title: "Paciente removido",
      description: "O paciente foi removido com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold gradient-text mb-2">Pacientes</h2>
          <p className="text-gray-600 dark:text-gray-400">Gerencie seus pacientes e seu histórico de consultas.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={resetForm}
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Paciente
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-effect">
            <DialogHeader>
              <DialogTitle className="gradient-text text-2xl">
                {editingPatient ? 'Editar Paciente' : 'Novo Paciente'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required className="mt-1" placeholder="(XX) XXXXX-XXXX" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input id="cpf" value={formData.cpf} onChange={(e) => setFormData({ ...formData, cpf: e.target.value })} className="mt-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="birthDate">Data de Nascimento</Label>
                <Input id="birthDate" type="date" value={formData.birthDate} onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })} className="mt-1" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstConsultationDate">Data da Primeira Consulta</Label>
                  <Input id="firstConsultationDate" type="date" value={formData.firstConsultationDate} onChange={(e) => setFormData({ ...formData, firstConsultationDate: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="lastConsultationDate">Data da Última Consulta</Label>
                  <Input id="lastConsultationDate" type="date" value={formData.lastConsultationDate} onChange={(e) => setFormData({ ...formData, lastConsultationDate: e.target.value })} className="mt-1" />
                </div>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                {editingPatient ? 'Atualizar' : 'Adicionar'} Paciente
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-effect rounded-2xl p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="hidden md:grid grid-cols-6 gap-4 font-bold p-4 text-sm text-gray-600 dark:text-gray-400 border-b border-white/10">
          <div className="col-span-2">Paciente</div>
          <div>Telefone</div>
          <div>Primeira Consulta</div>
          <div>Última Consulta</div>
          <div>Ações</div>
        </div>

        <div className="space-y-2 mt-2">
          {filteredPatients.map((patient, index) => (
            <motion.div 
              key={patient.id} 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: index * 0.05 }} 
              className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl items-center hover:bg-white/70 dark:hover:bg-gray-700/50 transition-all"
            >
              <div className="col-span-1 md:col-span-2 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0 items-center justify-center text-white font-bold text-lg hidden md:flex">
                  {patient.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-lg">{patient.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {patient.email}
                  </p>
                </div>
              </div>

              <div className="col-span-1 flex items-center gap-1"><Phone className="w-3 h-3 md:hidden" />{patient.phone}</div>
              
              <div className="col-span-1 flex items-center gap-1">
                <Calendar className="w-4 h-4 text-gray-500" />
                {patient.firstConsultationDate ? new Date(patient.firstConsultationDate).toLocaleDateString('pt-BR') : 'N/A'}
              </div>

              <div className="col-span-1 flex items-center gap-1">
                <Calendar className="w-4 h-4 text-gray-500" />
                {patient.lastConsultationDate ? new Date(patient.lastConsultationDate).toLocaleDateString('pt-BR') : 'N/A'}
              </div>

              <div className="col-span-1 flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(patient)} className="hover:bg-purple-100 dark:hover:bg-gray-700">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(patient.id)} className="hover:bg-red-100 dark:hover:bg-red-900">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
             <User className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-500">Nenhum paciente encontrado.</p>
            <p className="text-sm text-gray-400">Tente adicionar um novo paciente!</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Patients;
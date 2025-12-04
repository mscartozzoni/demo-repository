import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, User, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

const Appointments = ({ appointments, setAppointments, patients }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [formData, setFormData] = useState({
    patientId: '',
    date: '',
    notes: ''
  });

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.name : 'Paciente não encontrado';
  };

  const resetForm = () => {
    setFormData({ patientId: '', date: '', notes: '' });
    setEditingAppointment(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.patientId || !formData.date) {
      toast({ variant: 'destructive', title: 'Campos obrigatórios', description: 'Paciente e data são obrigatórios.' });
      return;
    }

    if (editingAppointment) {
      const updatedAppointments = appointments.map(app =>
        app.id === editingAppointment.id ? { ...editingAppointment, ...formData } : app
      );
      setAppointments(updatedAppointments);
      toast({ title: 'Sucesso!', description: 'Consulta atualizada.' });
    } else {
      const newAppointment = {
        ...formData,
        id: `APT-${Date.now()}`, // Auto-generate appointmentId
        createdAt: new Date().toISOString()
      };
      setAppointments([newAppointment, ...appointments]);
      toast({ title: 'Sucesso!', description: 'Nova consulta agendada.' });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      patientId: appointment.patientId,
      date: appointment.date,
      notes: appointment.notes || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    setAppointments(appointments.filter(app => app.id !== id));
    toast({ title: 'Removido', description: 'Consulta removida.' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold gradient-text mb-2">Consultas</h2>
          <p className="text-gray-600 dark:text-gray-400">Gerencie as consultas dos seus pacientes.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600" onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />Nova Consulta
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-effect">
            <DialogHeader><DialogTitle className="gradient-text text-2xl">{editingAppointment ? 'Editar' : 'Nova'} Consulta</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="patientId">Paciente</Label>
                <Select value={formData.patientId} onValueChange={(value) => setFormData({ ...formData, patientId: value })}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione o paciente" /></SelectTrigger>
                  <SelectContent>
                    {patients.map(patient => (
                      <SelectItem key={patient.id} value={patient.id}>{patient.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date">Data da Consulta</Label>
                <Input id="date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="notes">Notas</Label>
                <Input id="notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="mt-1" />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                {editingAppointment ? 'Atualizar' : 'Agendar'} Consulta
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-effect rounded-2xl p-4">
        <div className="hidden md:grid grid-cols-4 gap-4 font-bold p-4 text-sm text-gray-600 dark:text-gray-400 border-b border-white/10">
          <div>Paciente</div>
          <div>Data</div>
          <div>Notas</div>
          <div>Ações</div>
        </div>
        <div className="space-y-2 mt-2">
          {appointments.map((app, index) => (
            <motion.div 
              key={app.id} 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: index * 0.05 }} 
              className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl items-center hover:bg-white/70 dark:hover:bg-gray-700/50 transition-all"
            >
              <div className="font-semibold">{getPatientName(app.patientId)}</div>
              <div>{new Date(app.date).toLocaleDateString('pt-BR')}</div>
              <div className="text-sm text-gray-500">{app.notes || 'N/A'}</div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(app)}><Edit className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(app.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </motion.div>
          ))}
        </div>
        {appointments.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-500">Nenhuma consulta agendada.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Appointments;
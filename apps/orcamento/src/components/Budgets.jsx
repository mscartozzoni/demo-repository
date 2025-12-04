import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Send, CreditCard, Copy, Eye, FileText, AlertTriangle, CalendarCheck, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { initializeCheckout } from '@/api/EcommerceApi';
import BudgetForm from '@/components/BudgetForm';
import BudgetPreview from '@/components/BudgetPreview';

const Budgets = ({ budgets, setBudgets, patients, priceTables, templates, clinicProtocol, appointments }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentBudget, setCurrentBudget] = useState(null);

  const getPatient = (patientId) => {
    return patients.find(p => p.id === patientId);
  };

  const filteredBudgets = budgets.filter(budget => {
    const patient = getPatient(budget.patientId);
    if (!patient) return false;
    const searchTermLower = searchTerm.toLowerCase();
    return patient.name.toLowerCase().includes(searchTermLower) || (budget.auditCode && budget.auditCode.toLowerCase().includes(searchTermLower));
  });

  const handleFormSubmit = (formData) => {
    if (currentBudget) {
      // Update
      const updatedBudgets = budgets.map(b => 
        b.id === currentBudget.id ? { ...b, ...formData, updatedAt: new Date().toISOString() } : b
      );
      setBudgets(updatedBudgets);
      toast({ title: 'Sucesso! ✨', description: 'Orçamento atualizado.' });
    } else {
      // Create
      const newBudget = {
        ...formData,
        id: `BUD-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setBudgets([newBudget, ...budgets]);
      toast({ title: 'Sucesso! 🎉', description: 'Novo orçamento criado.' });
    }
    
    setIsFormOpen(false);
    setCurrentBudget(null);
  };
  
  const handleEdit = (budget) => {
    setCurrentBudget(budget);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    setBudgets(budgets.filter(b => b.id !== id));
    toast({ title: 'Removido', description: 'Orçamento removido.' });
  };
  
  const handlePreview = (budget) => {
    setCurrentBudget(budget);
    setIsPreviewOpen(true);
  };

  const handlePay = async (budget) => {
    const storeItems = budget.items.filter(item => item.storeVariantId);
    if (storeItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Nenhum item da loja",
        description: "Este orçamento não contém itens da loja para pagamento online.",
      });
      return;
    }

    try {
      const items = storeItems.map(item => ({
        variant_id: item.storeVariantId,
        quantity: item.quantity,
      }));

      const successUrl = `${window.location.origin}/success`;
      const cancelUrl = window.location.href;

      const { url } = await initializeCheckout({ items, successUrl, cancelUrl });
      
      window.location.href = url;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro no Checkout",
        description: "Houve um problema ao iniciar o pagamento. Verifique se os itens do orçamento estão sincronizados com a loja.",
      });
    }
  };

  const copyLink = (budgetId) => {
    const link = `${window.location.origin}/budget/${budgetId}`;
    navigator.clipboard.writeText(link);
    toast({ title: 'Link Copiado!', description: 'O link para o orçamento foi copiado.' });
  }

  const sendEmail = () => {
    toast({ title: '🚧 Em breve!', description: 'O envio por email estará disponível em breve!' });
  }

  const getStatusChip = (status) => {
    switch (status) {
      case 'Aprovado': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'Pendente': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'Rejeitado': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold gradient-text mb-2">Orçamentos</h2>
          <p className="text-gray-600 dark:text-gray-400">Crie e gerencie seus orçamentos</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600" onClick={() => setCurrentBudget(null)}>
              <Plus className="w-4 h-4 mr-2" />Novo Orçamento
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-effect max-w-4xl">
            <DialogHeader><DialogTitle className="gradient-text text-2xl">{currentBudget ? 'Editar' : 'Novo'} Orçamento</DialogTitle></DialogHeader>
            <BudgetForm patients={patients} priceTables={priceTables} templates={templates} appointments={appointments} onSubmit={handleFormSubmit} existingBudget={currentBudget} />
          </DialogContent>
        </Dialog>
      </div>

       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-effect rounded-2xl p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Buscar por paciente ou código de auditoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="hidden md:grid grid-cols-7 gap-4 font-bold p-4 text-sm text-gray-600 dark:text-gray-400 border-b border-white/10">
          <div className="col-span-2">Paciente</div>
          <div>Código</div>
          <div>Data</div>
          <div>Valor</div>
          <div>Status</div>
          <div className="col-span-1">Ações</div>
        </div>
        
        <div className="space-y-2 mt-2">
          {filteredBudgets.map((budget, index) => {
            const patient = getPatient(budget.patientId);
            const hasNoConsultation = patient && !patient.firstConsultationDate;

            return (
             <motion.div 
              key={budget.id} 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: index * 0.05 }} 
              className="grid grid-cols-1 md:grid-cols-7 gap-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl items-center hover:bg-white/70 dark:hover:bg-gray-700/50 transition-all"
            >
              <div className="col-span-1 md:col-span-2 font-semibold text-lg flex items-center gap-2">
                {patient ? patient.name : 'Paciente não encontrado'}
                {hasNoConsultation && <AlertTriangle className="w-4 h-4 text-orange-400" title="Paciente sem primeira consulta registrada."/>}
                {budget.appointmentId && <CalendarCheck className="w-4 h-4 text-blue-400" title="Orçamento vinculado a uma consulta."/>}
              </div>
              
              <div className="col-span-1 text-xs font-mono text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Hash className="w-3 h-3" /> {budget.auditCode || 'N/A'}
              </div>

              <div className="col-span-1">{new Date(budget.createdAt).toLocaleDateString('pt-BR')}</div>
              
              <div className="col-span-1 text-lg font-bold gradient-text">R$ {budget.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              
              <div className="col-span-1">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusChip(budget.status)}`}>{budget.status}</span>
              </div>

              <div className="col-span-1 flex flex-wrap gap-1">
                <Button variant="ghost" size="icon" onClick={() => handlePay(budget)} className="text-green-500 hover:bg-green-100 dark:hover:bg-green-900/50"><CreditCard className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handlePreview(budget)} className="hover:bg-blue-100 dark:hover:bg-blue-900/50"><Eye className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleEdit(budget)} className="hover:bg-purple-100 dark:hover:bg-purple-900/50"><Edit className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(budget.id)} className="hover:bg-red-100 text-red-500 dark:hover:bg-red-900/50"><Trash2 className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => copyLink(budget.id)} className="hover:bg-gray-200 dark:hover:bg-gray-700"><Copy className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={sendEmail} className="hover:bg-gray-200 dark:hover:bg-gray-700"><Send className="w-4 h-4" /></Button>
              </div>
            </motion.div>
          )})}
        </div>

        {filteredBudgets.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-500">Nenhum orçamento encontrado.</p>
            <p className="text-sm text-gray-400">Tente criar um novo orçamento!</p>
          </div>
        )}
      </motion.div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl h-[95vh] glass-effect p-0 overflow-y-auto">
            {currentBudget && <BudgetPreview budget={currentBudget} patient={patients.find(p => p.id === currentBudget.patientId)} template={templates.find(t => t.id === currentBudget.templateId)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Budgets;
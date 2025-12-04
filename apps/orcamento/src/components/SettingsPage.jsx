import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Palette, Sun, Moon, Banknote, CalendarDays, Check, FileCog, KeyRound, Info, Upload, Download, Eraser, History, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { Checkbox } from "@/components/ui/checkbox";
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
} from "@/components/ui/alert-dialog"


const paymentMethodOptions = [
    { id: 'pix', label: 'Pix' },
    { id: 'cartao_credito', label: 'Cartão de Crédito' },
    { id: 'transferencia', label: 'Transferência' },
    { id: 'cartao_debito', label: 'Cartão de Débito' },
]

const SettingsPage = ({ templates, setTemplates, isDarkMode, setIsDarkMode, clinicProtocol, setClinicProtocol, backupData, exportBackup, importBackup, clearBackup }) => {
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templateFormData, setTemplateFormData] = useState({ name: '', primaryColor: '#8B5CF6', secondaryColor: '#EC4899', header: 'Orçamento', footer: 'Obrigado!' });

  const [protocolData, setProtocolData] = useState(clinicProtocol);
  const importFileRef = useRef(null);

  useEffect(() => {
    setProtocolData(clinicProtocol);
  }, [clinicProtocol]);

  const handleTemplateSubmit = (e) => {
    e.preventDefault();
    if (editingTemplate) {
      setTemplates(templates.map(t => t.id === editingTemplate.id ? { ...templateFormData, id: t.id } : t));
      toast({ title: "Atualizado! ✨", description: "Template atualizado." });
    } else {
      setTemplates([...templates, { ...templateFormData, id: Date.now().toString() }]);
      toast({ title: "Criado! 🎉", description: "Novo template criado." });
    }
    setTemplateFormData({ name: '', primaryColor: '#8B5CF6', secondaryColor: '#EC4899', header: 'Orçamento', footer: 'Obrigado!' });
    setEditingTemplate(null);
    setIsTemplateDialogOpen(false);
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setTemplateFormData(template);
    setIsTemplateDialogOpen(true);
  };

  const handleDeleteTemplate = (id) => {
    if (templates.length > 1) {
      setTemplates(templates.filter(t => t.id !== id));
      toast({ title: "Removido", description: "Template removido." });
    } else {
      toast({ title: "Atenção", description: "É necessário ter ao menos um template.", variant: "destructive" });
    }
  };
  
  const handleProtocolChange = (field, value) => {
    setProtocolData(prev => ({...prev, [field]: value}));
  };
  
  const handlePaymentMethodChange = (methodId, checked) => {
    const currentMethods = protocolData.paymentMethods || [];
    let newMethods;
    if(checked) {
        newMethods = [...currentMethods, methodId];
    } else {
        newMethods = currentMethods.filter(id => id !== methodId);
    }
    handleProtocolChange('paymentMethods', newMethods);
  };

  const saveProtocol = () => {
    setClinicProtocol(protocolData);
    toast({ title: "Salvo! ✅", description: "Protocolo da clínica atualizado." });
  }

  const handleImportClick = () => {
    importFileRef.current.click();
  };

  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      importBackup(file);
    }
  };

  return (
    <div className="space-y-8">
      <div>
          <h2 className="text-4xl font-bold gradient-text mb-2">Configurações</h2>
          <p className="text-gray-600 dark:text-gray-400">Personalize o sistema para o seu fluxo de trabalho.</p>
      </div>

       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-effect rounded-2xl p-6">
        <h3 className="text-2xl font-bold gradient-text mb-4">Aparência</h3>
        <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl">
          <div className="flex items-center gap-3">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isDarkMode ? 'moon' : 'sun'}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isDarkMode ? <Moon className="w-6 h-6 text-yellow-400" /> : <Sun className="w-6 h-6 text-orange-500" />}
              </motion.div>
            </AnimatePresence>
            <div>
              <p className="font-semibold text-lg">Modo Escuro</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ative para uma experiência visual com pouca luz.</p>
            </div>
          </div>
          <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} aria-label="Toggle dark mode" />
        </div>
      </motion.div>

       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-effect rounded-2xl p-6">
        <h3 className="text-2xl font-bold gradient-text mb-4 flex items-center gap-2"><History className="w-6 h-6 text-purple-500"/> Backup e Restauração</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Gerencie os dados locais do aplicativo. Os backups são automáticos.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Button variant="outline" onClick={handleImportClick}><Upload className="w-4 h-4 mr-2"/> Importar Backup</Button>
            <input type="file" ref={importFileRef} onChange={handleFileImport} accept=".json" className="hidden" />
            <Button variant="outline" onClick={exportBackup}><Download className="w-4 h-4 mr-2"/> Exportar para Financeiro</Button>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full"><Eraser className="w-4 h-4 mr-2"/> Limpar Dados Locais</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso irá apagar permanentemente todos os dados armazenados no seu navegador.
                        Você deve exportar seus dados antes de fazer isso.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={clearBackup}>Sim, apagar tudo</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
        <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 max-h-60 overflow-y-auto">
            <h4 className="font-semibold mb-2 flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-yellow-500"/> Log de Auditoria (Últimas 50 ações)</h4>
            <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                {backupData?.auditLog && backupData.auditLog.length > 0 ? (
                    backupData.auditLog.map((log, index) => (
                        <li key={index} className="flex justify-between items-center p-1 bg-white/50 dark:bg-gray-800/50 rounded">
                            <span>{log.action} por <span className="font-semibold">{log.user}</span></span>
                            <span className="font-mono">{new Date(log.timestamp).toLocaleString('pt-BR')}</span>
                        </li>
                    ))
                ) : (
                    <li>Nenhum registro de auditoria encontrado.</li>
                )}
            </ul>
        </div>
      </motion.div>
      
       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-effect rounded-2xl p-6">
        <h3 className="text-2xl font-bold gradient-text mb-4 flex items-center gap-2"><KeyRound className="w-6 h-6 text-pink-500"/> Configuração de Pagamento (Stripe)</h3>
        <div className="space-y-4">
            <div>
              <Label htmlFor="stripePk">Chave Publicável (Publishable Key)</Label>
              <Input id="stripePk" type="password" value={protocolData.stripePk || ''} onChange={e => handleProtocolChange('stripePk', e.target.value)} className="mt-1" placeholder="pk_test_..."/>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/50 border-l-4 border-blue-500 text-blue-800 dark:text-blue-200 p-4 rounded-md">
                <div className="flex">
                    <div className="py-1"><Info className="w-5 h-5 text-blue-500 mr-3"/></div>
                    <div>
                        <p className="font-bold">Importante!</p>
                        <p className="text-sm">Para pagamentos funcionarem, você deve criar "Produtos" no seu <a href="https://dashboard.stripe.com/products" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Dashboard do Stripe</a>. Depois, associe o "ID do Preço" de cada produto na sua Tabela de Preços.</p>
                    </div>
                </div>
            </div>
        </div>
      </motion.div>

       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-effect rounded-2xl p-6">
        <h3 className="text-2xl font-bold gradient-text mb-4 flex items-center gap-2"><FileCog className="w-6 h-6"/> Protocolo da Clínica</h3>
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
             <div>
              <Label htmlFor="acceptanceValue">Valor de Aceite (R$)</Label>
              <div className="relative mt-1"><Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input id="acceptanceValue" type="number" value={protocolData.acceptanceValue || ''} onChange={e => handleProtocolChange('acceptanceValue', parseFloat(e.target.value))} className="pl-10" /></div>
            </div>
            <div>
              <Label htmlFor="paymentDeadline">Prazo Pagamento (dias antes da cirurgia)</Label>
               <div className="relative mt-1"><CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input id="paymentDeadline" type="number" value={protocolData.paymentDeadline || ''} onChange={e => handleProtocolChange('paymentDeadline', parseInt(e.target.value))} className="pl-10" /></div>
            </div>
          </div>
          <div>
            <Label>Formas de Pagamento Aceitas</Label>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
              {paymentMethodOptions.map(method => (
                <div key={method.id} className="flex items-center space-x-2 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <Checkbox id={method.id} checked={protocolData.paymentMethods?.includes(method.id)} onCheckedChange={checked => handlePaymentMethodChange(method.id, checked)} />
                  <label htmlFor={method.id} className="text-sm font-medium leading-none cursor-pointer">{method.label}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
         <div className="mt-6 flex justify-end">
            <Button onClick={saveProtocol} className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
              <Check className="w-4 h-4 mr-2" />
              Salvar Protocolo
            </Button>
         </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold gradient-text">Templates de Orçamento</h3>
          <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
            <DialogTrigger asChild><Button onClick={() => { setEditingTemplate(null); setTemplateFormData({ name: '', primaryColor: '#8B5CF6', secondaryColor: '#EC4899', header: 'Orçamento', footer: 'Obrigado!' }); }}><Plus className="w-4 h-4 mr-2" /> Novo Template</Button></DialogTrigger>
            <DialogContent className="glass-effect max-w-2xl">
              <DialogHeader><DialogTitle className="gradient-text text-2xl">{editingTemplate ? 'Editar Template' : 'Novo Template'}</DialogTitle></DialogHeader>
              <form onSubmit={handleTemplateSubmit} className="space-y-4">
                <Input placeholder="Nome do Template" value={templateFormData.name} onChange={(e) => setTemplateFormData({ ...templateFormData, name: e.target.value })} required />
                 <div className="grid grid-cols-2 gap-4">
                  <div><Label>Cor Primária</Label><div className="flex gap-2"><Input type="color" value={templateFormData.primaryColor} onChange={(e) => setTemplateFormData({ ...templateFormData, primaryColor: e.target.value })} className="w-16 h-10 p-1" /><Input value={templateFormData.primaryColor} onChange={(e) => setTemplateFormData({ ...templateFormData, primaryColor: e.target.value })}/></div></div>
                  <div><Label>Cor Secundária</Label><div className="flex gap-2"><Input type="color" value={templateFormData.secondaryColor} onChange={(e) => setTemplateFormData({ ...templateFormData, secondaryColor: e.target.value })} className="w-16 h-10 p-1" /><Input value={templateFormData.secondaryColor} onChange={(e) => setTemplateFormData({ ...templateFormData, secondaryColor: e.target.value })}/></div></div>
                </div>
                <Input placeholder="Cabeçalho" value={templateFormData.header} onChange={(e) => setTemplateFormData({ ...templateFormData, header: e.target.value })} />
                <Textarea placeholder="Rodapé" value={templateFormData.footer} onChange={(e) => setTemplateFormData({ ...templateFormData, footer: e.target.value })} />
                <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600">{editingTemplate ? 'Atualizar' : 'Criar'}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map((template) => (
            <motion.div key={template.id} className="glass-effect rounded-2xl p-6 card-hover">
              <div className="flex justify-between items-start mb-4"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${template.primaryColor}, ${template.secondaryColor})` }}><Palette className="w-6 h-6 text-white" /></div><div><h3 className="font-bold text-lg">{template.name}</h3><p className="text-sm text-gray-600 dark:text-gray-400">Template</p></div></div><div className="flex gap-2"><Button variant="ghost" size="icon" onClick={() => handleEditTemplate(template)}><Edit className="w-4 h-4" /></Button><Button variant="ghost" size="icon" onClick={() => handleDeleteTemplate(template.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button></div></div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
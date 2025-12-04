import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const InvoiceModal = ({ isOpen, onClose, patientName, onGenerate }) => {
  const { toast } = useToast();
  const [items, setItems] = useState([{ description: '', quantity: 1, price: '' }]);
  const [logo, setLogo] = useState(null);
  const [clinicInfo, setClinicInfo] = useState({
    name: "Clínica Dr. Márcio",
    address: "Rua das Estrelas, 123, São Paulo - SP",
    phone: "(11) 98765-4321",
    email: "contato@marciocirurgia.com"
  });

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, price: '' }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleLogoUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          variant: 'destructive',
          title: 'Arquivo muito grande',
          description: 'Por favor, selecione um logo com menos de 2MB.',
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => setLogo(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity, 10) || 0;
      return total + (price * quantity);
    }, 0).toFixed(2);
  };
  
  const handleGenerateClick = () => {
    const invoiceData = {
      patientName,
      clinicInfo,
      logo,
      items,
      total: calculateTotal()
    };
    onGenerate(invoiceData);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <DialogContent className="sm:max-w-[650px] bg-slate-800 border-slate-700 text-white p-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <DialogHeader className="p-6">
                <DialogTitle className="text-2xl">Gerar Fatura</DialogTitle>
                <DialogDescription className="text-slate-400">Crie uma fatura personalizada para {patientName}.</DialogDescription>
              </DialogHeader>
              <div className="px-6 py-4 max-h-[60vh] overflow-y-auto space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="clinic-name">Nome da Clínica</Label>
                        <Input id="clinic-name" value={clinicInfo.name} onChange={e => setClinicInfo({...clinicInfo, name: e.target.value})} className="bg-slate-700 border-slate-600"/>
                    </div>
                    <div>
                        <Label htmlFor="clinic-phone">Telefone</Label>
                        <Input id="clinic-phone" value={clinicInfo.phone} onChange={e => setClinicInfo({...clinicInfo, phone: e.target.value})} className="bg-slate-700 border-slate-600"/>
                    </div>
                    <div>
                        <Label htmlFor="clinic-address">Endereço</Label>
                        <Input id="clinic-address" value={clinicInfo.address} onChange={e => setClinicInfo({...clinicInfo, address: e.target.value})} className="bg-slate-700 border-slate-600"/>
                    </div>
                     <div>
                        <Label htmlFor="clinic-email">Email</Label>
                        <Input id="clinic-email" type="email" value={clinicInfo.email} onChange={e => setClinicInfo({...clinicInfo, email: e.target.value})} className="bg-slate-700 border-slate-600"/>
                    </div>
                </div>

                <div>
                  <Label htmlFor="logo-upload">Logo da Clínica</Label>
                  <div className="mt-2 flex items-center gap-4">
                    {logo ? <img-replace src={logo} alt="Logo da Clínica" className="h-16 w-16 object-contain rounded-md bg-slate-700 p-1" /> : <div className="h-16 w-16 bg-slate-700 rounded-md flex items-center justify-center text-slate-500">Logo</div>}
                    <Input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} className="bg-slate-700 border-slate-600 file:text-white" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Itens da Fatura</h3>
                  <div className="space-y-3">
                    {items.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-slate-700/50 rounded-md">
                        <Input placeholder="Descrição do item" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} className="flex-grow bg-slate-700 border-slate-600" />
                        <Input type="number" placeholder="Qtd" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} className="w-20 bg-slate-700 border-slate-600" />
                        <Input type="number" placeholder="Preço (R$)" value={item.price} onChange={(e) => handleItemChange(index, 'price', e.target.value)} className="w-28 bg-slate-700 border-slate-600" />
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index)} className="text-red-400 hover:bg-red-500/10 hover:text-red-300">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" onClick={handleAddItem} className="mt-3 border-dashed border-slate-600 hover:bg-slate-700">
                    <Plus className="h-4 w-4 mr-2" /> Adicionar Item
                  </Button>
                </div>
              </div>
              <DialogFooter className="p-6 bg-slate-800/50 flex justify-between items-center">
                <div className="text-xl font-bold">
                    Total: <span className="text-blue-400">R$ {calculateTotal()}</span>
                </div>
                <Button type="button" onClick={handleGenerateClick} className="bg-blue-600 hover:bg-blue-700">Gerar e Enviar Fatura</Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

export default InvoiceModal;
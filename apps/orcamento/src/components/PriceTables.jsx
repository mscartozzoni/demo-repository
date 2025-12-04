import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Upload, ChevronDown, Database, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '@/api/EcommerceApi';

const PriceTables = ({ priceTables, setPriceTables }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    procedure: '',
    clinicValue: 0,
    hospitalValue: 0,
    materialValue: 0,
    stripePriceId: '',
    source: 'manual'
  });
  const navigate = useNavigate();

  const resetForm = () => {
    setFormData({ code: '', procedure: '', clinicValue: 0, hospitalValue: 0, materialValue: 0, stripePriceId: '', source: 'manual' });
  }

  const syncWithStore = async () => {
    setIsSyncing(true);
    try {
      const response = await getProducts();
      const storeProducts = response.products;

      const newProcedures = storeProducts.map(product => {
        const variant = product.variants[0];
        const price = variant.price_in_cents / 100;

        return {
          id: `store_${product.id}`,
          code: product.id.substring(0, 8).toUpperCase(),
          procedure: product.title,
          clinicValue: price,
          hospitalValue: 0,
          materialValue: 0,
          stripePriceId: '',
          source: 'store',
          storeProductId: product.id,
          storeVariantId: variant.id
        };
      });

      const existingManualProcedures = priceTables.filter(p => p.source !== 'store');
      const mergedProcedures = [...existingManualProcedures, ...newProcedures];

      setPriceTables(mergedProcedures);
      
      toast({ 
        title: "Sincronizado! 🎉", 
        description: `${newProcedures.length} produtos da loja foram importados como procedimentos.` 
      });
    } catch (error) {
      toast({ 
        variant: 'destructive',
        title: "Erro na sincronização", 
        description: error.message 
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingItem) {
      const updated = priceTables.map(item =>
        item.id === editingItem.id ? { ...formData, id: item.id } : item
      );
      setPriceTables(updated);
      toast({ title: "Atualizado! ✨", description: "Procedimento atualizado." });
    } else {
      const newItem = { ...formData, id: Date.now().toString(), source: 'manual' };
      setPriceTables([...priceTables, newItem]);
      toast({ title: "Adicionado! 🎉", description: "Novo procedimento adicionado." });
    }

    resetForm();
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item) => {
    if (item.source === 'store') {
      toast({ 
        variant: 'destructive',
        title: "Não editável", 
        description: "Produtos da loja não podem ser editados. Edite-os na loja online." 
      });
      return;
    }
    setEditingItem(item);
    setFormData(item);
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    const item = priceTables.find(p => p.id === id);
    if (item?.source === 'store') {
      toast({ 
        variant: 'destructive',
        title: "Não removível", 
        description: "Produtos da loja não podem ser removidos daqui. Remova-os da loja online." 
      });
      return;
    }
    setPriceTables(priceTables.filter(item => item.id !== id));
    toast({ title: "Removido", description: "Procedimento removido." });
  };

  const handleImport = () => {
    toast({ title: "🚧 Em desenvolvimento", description: "A importação será implementada em breve!" });
  }

  const calculateTotals = (item) => {
    const totalClinic = (item.clinicValue || 0) + (item.materialValue || 0);
    const total = totalClinic + (item.hospitalValue || 0);
    return { totalClinic, total };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold gradient-text mb-2">Tabela de Preços</h2>
          <p className="text-gray-600 dark:text-gray-400">Gerencie os valores e IDs de preço do Stripe.</p>
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Database className="w-4 h-4 mr-2" />
                Dados
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="glass-effect">
              <DropdownMenuItem onClick={() => navigate('/patients')}>Pacientes</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/budgets')}>Orçamentos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/prices')}>Tabela de Preços</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" onClick={syncWithStore} disabled={isSyncing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            Sincronizar Loja
          </Button>

          <Button variant="outline" onClick={handleImport}>
            <Upload className="w-4 h-4 mr-2" />
            Importar
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600" onClick={() => { setEditingItem(null); resetForm(); }}>
                <Plus className="w-4 h-4 mr-2" />Novo
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-effect">
              <DialogHeader><DialogTitle className="gradient-text text-2xl">{editingItem ? 'Editar' : 'Novo'} Procedimento</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label htmlFor="code">Código</Label><Input id="code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} required className="mt-1" /></div>
                  <div><Label htmlFor="procedure">Nome</Label><Input id="procedure" value={formData.procedure} onChange={(e) => setFormData({ ...formData, procedure: e.target.value })} required className="mt-1" /></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div><Label htmlFor="clinicValue">Clínica (R$)</Label><Input id="clinicValue" type="number" step="0.01" value={formData.clinicValue} onChange={(e) => setFormData({ ...formData, clinicValue: parseFloat(e.target.value) || 0 })} required className="mt-1" /></div>
                  <div><Label htmlFor="hospitalValue">Hospital (R$)</Label><Input id="hospitalValue" type="number" step="0.01" value={formData.hospitalValue} onChange={(e) => setFormData({ ...formData, hospitalValue: parseFloat(e.target.value) || 0 })} className="mt-1" /></div>
                  <div><Label htmlFor="materialValue">Material (R$)</Label><Input id="materialValue" type="number" step="0.01" value={formData.materialValue} onChange={(e) => setFormData({ ...formData, materialValue: parseFloat(e.target.value) || 0 })} className="mt-1" /></div>
                </div>
                <div><Label htmlFor="stripePriceId">ID do Preço (Stripe)</Label><Input id="stripePriceId" value={formData.stripePriceId || ''} onChange={(e) => setFormData({ ...formData, stripePriceId: e.target.value })} className="mt-1" placeholder="price_..."/></div>
                <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600">{editingItem ? 'Atualizar' : 'Adicionar'}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-effect rounded-2xl p-4">
        <div className="hidden md:grid grid-cols-8 gap-4 font-bold p-4 text-sm text-gray-600 dark:text-gray-400 border-b">
          <div className="col-span-2">Procedimento</div>
          <div className="col-span-2">ID do Preço (Stripe)</div>
          <div>Total Clínica</div>
          <div>Total Geral</div>
          <div>Origem</div>
          <div>Ações</div>
        </div>
        <div className="space-y-2 mt-2">
          {priceTables.map((item, index) => {
            const { totalClinic, total } = calculateTotals(item);
            return (
              <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="grid grid-cols-1 md:grid-cols-8 gap-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl items-center hover:bg-white/70 dark:hover:bg-gray-700/50 transition-all">
                <div className="col-span-1 md:col-span-2">
                  <p className="font-semibold text-lg">{item.procedure}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.code}</p>
                </div>
                <div className="col-span-1 md:col-span-2 break-all">
                  <span className="md:hidden font-bold">ID Stripe: </span>
                  {item.stripePriceId || "Não definido"}
                </div>
                <div className="col-span-1 font-bold">
                  <span className="md:hidden font-bold">Total Clínica: </span>
                  R$ {totalClinic.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="col-span-1">
                  <p className="text-xl font-bold gradient-text">
                    <span className="md:hidden font-bold">Total: </span>
                    R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="col-span-1">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.source === 'store' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    {item.source === 'store' ? 'Loja' : 'Manual'}
                  </span>
                </div>
                <div className="col-span-1 flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="hover:bg-purple-100 dark:hover:bg-gray-700">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="hover:bg-red-100 dark:hover:bg-red-900">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default PriceTables;
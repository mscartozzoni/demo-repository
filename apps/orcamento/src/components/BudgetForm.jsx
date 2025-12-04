import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Percent, Tag, Calendar, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const generateAuditCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'AUD-';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const BudgetForm = ({ patients, priceTables, templates, appointments, onSubmit, existingBudget }) => {
  const [formData, setFormData] = useState({
    patientId: existingBudget?.patientId || '',
    appointmentId: existingBudget?.appointmentId || '',
    templateId: existingBudget?.templateId || templates[0]?.id || '',
    items: existingBudget?.items || [],
    notes: existingBudget?.notes || '',
    discountType: existingBudget?.discountType || 'percentage',
    discountValue: existingBudget?.discountValue || 0,
    total: existingBudget?.total || 0,
    status: existingBudget?.status || 'Pendente',
    origin: existingBudget?.origin || 'Surgical',
    auditCode: existingBudget?.auditCode || '',
    interestRate: existingBudget?.interestRate || 2.5, // Default interest rate
  });

  const [currentItem, setCurrentItem] = useState({
    procedure: '',
    price: 0,
    quantity: 1,
    source: 'manual',
    clinicValue: 0,
    hospitalValue: 0,
    materialValue: 0,
  });
  
  const [patientAppointments, setPatientAppointments] = useState([]);

  useEffect(() => {
    if (formData.patientId) {
      setPatientAppointments(appointments.filter(a => a.patientId === formData.patientId));
    } else {
      setPatientAppointments([]);
    }
  }, [formData.patientId, appointments]);

  useEffect(() => {
    if(existingBudget) {
      setFormData({
        patientId: existingBudget.patientId,
        appointmentId: existingBudget.appointmentId,
        templateId: existingBudget.templateId,
        items: existingBudget.items,
        notes: existingBudget.notes,
        discountType: existingBudget.discountType,
        discountValue: existingBudget.discountValue,
        total: existingBudget.total,
        status: existingBudget.status,
        origin: existingBudget.origin || 'Surgical',
        auditCode: existingBudget.auditCode || '',
        interestRate: existingBudget.interestRate || 2.5,
      });
    }
  }, [existingBudget, templates]);

  const handleAddItem = () => {
    if (currentItem.procedure && currentItem.price > 0) {
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, { ...currentItem, id: Date.now().toString() }]
      }));
      setCurrentItem({ procedure: '', price: 0, quantity: 1, source: 'manual', clinicValue: 0, hospitalValue: 0, materialValue: 0 });
    }
  };

  const handleRemoveItem = (id) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const handleProcedureSelect = (procedureId) => {
    const procedure = priceTables.find(p => p.id === procedureId);
    if (procedure) {
      const totalValue = (procedure.clinicValue || 0) + (procedure.hospitalValue || 0) + (procedure.materialValue || 0);
      setCurrentItem({
        ...currentItem,
        procedure: procedure.procedure,
        price: totalValue,
        clinicValue: procedure.clinicValue || 0,
        hospitalValue: procedure.hospitalValue || 0,
        materialValue: procedure.materialValue || 0,
        source: procedure.source || 'manual',
        storeProductId: procedure.storeProductId,
        storeVariantId: procedure.storeVariantId
      });
    }
  };
  
  useEffect(() => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discountAmount = 0;
    if (formData.discountType === 'percentage') {
      discountAmount = subtotal * (formData.discountValue / 100);
    } else {
      discountAmount = formData.discountValue;
    }
    const finalTotal = subtotal - discountAmount;
    setFormData(prev => ({ ...prev, total: finalTotal > 0 ? finalTotal : 0 }));
  }, [formData.items, formData.discountType, formData.discountValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const calculateInstallment = (total, months, interestRate) => {
    if (months === 1) return total;
    const monthlyInterest = interestRate / 100;
    const installment = (total * monthlyInterest) / (1 - Math.pow(1 + monthlyInterest, -months));
    return isNaN(installment) ? 0 : installment;
  };

  const installmentOptions = [2, 5, 6, 10];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="patient">Paciente</Label>
          <Select value={formData.patientId} onValueChange={(value) => setFormData({ ...formData, patientId: value, appointmentId: '' })}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione o paciente" /></SelectTrigger>
            <SelectContent>{patients.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="appointment">Vincular à Consulta</Label>
          <Select value={formData.appointmentId} onValueChange={(value) => setFormData({ ...formData, appointmentId: value })} disabled={!formData.patientId}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Opcional" /></SelectTrigger>
            <SelectContent>
              {patientAppointments.length > 0 ? patientAppointments.map(app => (
                <SelectItem key={app.id} value={app.id}><Calendar className="w-4 h-4 inline mr-2" />{new Date(app.date).toLocaleDateString('pt-BR')}</SelectItem>
              )) : <div className="p-4 text-center text-sm text-gray-500">Nenhuma consulta.</div>}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="origin">Origem do Orçamento</Label>
          <Select value={formData.origin} onValueChange={(value) => setFormData({ ...formData, origin: value })}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Surgical">Cirúrgico</SelectItem>
              <SelectItem value="Aesthetic">Estético</SelectItem>
              <SelectItem value="Consultation">Consulta</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="template">Template</Label>
          <Select value={formData.templateId} onValueChange={(value) => setFormData({ ...formData, templateId: value })}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione o template" /></SelectTrigger>
            <SelectContent>{templates.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Label htmlFor="auditCode">Código de Auditoria</Label>
            <Input id="auditCode" value={formData.auditCode} readOnly placeholder="Clique em Gerar" className="mt-1 bg-gray-100 dark:bg-gray-800" />
          </div>
          <Button type="button" variant="outline" onClick={() => setFormData({...formData, auditCode: generateAuditCode()})}>
            <Hash className="w-4 h-4 mr-2" /> Gerar
          </Button>
        </div>
      </div>

      <div className="glass-effect rounded-xl p-4 space-y-4">
        <h3 className="font-semibold gradient-text">Adicionar Procedimentos</h3>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
          <div className="col-span-12 md:col-span-5"><Label>Procedimento</Label><Select onValueChange={handleProcedureSelect}><SelectTrigger className="mt-1"><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{priceTables.map(p => <SelectItem key={p.id} value={p.id}>{p.code} - {p.procedure} {p.source === 'store' && '🛍️'}</SelectItem>)}</SelectContent></Select></div>
          <div className="col-span-6 md:col-span-3"><Label>Valor</Label><Input type="number" value={currentItem.price} onChange={(e) => setCurrentItem({ ...currentItem, price: parseFloat(e.target.value) })} className="mt-1" /></div>
          <div className="col-span-6 md:col-span-2"><Label>Qtd</Label><Input type="number" min="1" value={currentItem.quantity} onChange={(e) => setCurrentItem({ ...currentItem, quantity: parseInt(e.target.value) })} className="mt-1" /></div>
          <div className="col-span-12 md:col-span-2 flex items-end"><Button type="button" onClick={handleAddItem} className="w-full"><Plus className="w-4 h-4 mr-2" /> Adicionar</Button></div>
        </div>
        {formData.items.length > 0 && <div className="space-y-2">{formData.items.map(item => <div key={item.id} className="flex items-center justify-between bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg"><div className="flex-1"><p className="font-medium">{item.procedure} {item.source === 'store' && '🛍️'}</p><p className="text-sm text-gray-600 dark:text-gray-400">{item.quantity}x R$ {item.price.toLocaleString('pt-BR')} = R$ {(item.price * item.quantity).toLocaleString('pt-BR')}</p></div><Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)} className="hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900"><Trash2 className="w-4 h-4" /></Button></div>)}</div>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="notes">Observações</Label>
          <Textarea id="notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="mt-1" rows={5} />
        </div>
        <div className="space-y-4">
          <div>
            <Label>Desconto / Negociação</Label>
            <div className="flex gap-2 mt-1">
              <Select value={formData.discountType} onValueChange={value => setFormData({...formData, discountType: value})}><SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="percentage"><Percent className="w-4 h-4 inline mr-2"/> %</SelectItem><SelectItem value="fixed"><Tag className="w-4 h-4 inline mr-2"/> R$</SelectItem></SelectContent></Select>
              <Input type="number" min="0" value={formData.discountValue} onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })} className="flex-1" />
            </div>
          </div>
          <div className="glass-effect rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <Label>Calculadora de Parcelas</Label>
              <div className="flex items-center gap-2">
                <Input type="number" value={formData.interestRate} onChange={e => setFormData({...formData, interestRate: parseFloat(e.target.value) || 0})} className="w-20 h-8 text-sm" />
                <Percent className="w-4 h-4 text-gray-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {installmentOptions.map(months => {
                const installmentValue = calculateInstallment(formData.total, months, formData.interestRate);
                return (
                  <div key={months} className="bg-white/50 dark:bg-gray-800/50 p-2 rounded">
                    <p className="font-semibold">{months}x de R$ {installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <p className="text-xs text-gray-500">Total: R$ {(installmentValue * months).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-effect rounded-xl p-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-3xl font-bold gradient-text">R$ {formData.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600" disabled={!formData.patientId || formData.items.length === 0}>
        {existingBudget ? 'Atualizar Orçamento' : 'Criar Orçamento'}
      </Button>
    </form>
  );
};

export default BudgetForm;
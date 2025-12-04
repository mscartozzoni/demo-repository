import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, ArrowRight, Loader2, DollarSign, User, Stethoscope, Ticket, BadgePercent, Hotel, PlusCircle, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useHospitalData } from '@/hooks/useBudgets';

const mockCoupons = {
    'VERAO15': { id: 'c1', code: 'VERAO15', discount_type: 'percentage', discount_value: 15, description: '15% de desconto para o verão' },
    'INVERNO10': { id: 'c2', code: 'INVERNO10', discount_type: 'fixed', discount_value: 100, description: 'R$100 de desconto' }
};

const BudgetCreationStep = ({ patient, service, onBack, onNext }) => {
  const [manualDiscount, setManualDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);
  const { toast } = useToast();

  const [selectedHospitalId, setSelectedHospitalId] = useState('');
  const [showSpecialMaterials, setShowSpecialMaterials] = useState(false);
  const [specialMaterials, setSpecialMaterials] = useState([]);
  const [newMaterialName, setNewMaterialName] = useState('');
  const [newMaterialValue, setNewMaterialValue] = useState('');

  const { hospitals, getHospitalCost } = useHospitalData();

  const hospitalCost = useMemo(() => {
    if (!service || !selectedHospitalId) return 0;
    return getHospitalCost(service.id, selectedHospitalId);
  }, [service, selectedHospitalId, getHospitalCost]);

  const materialsCost = useMemo(() => {
    return specialMaterials.reduce((total, item) => total + (parseFloat(item.value) || 0), 0);
  }, [specialMaterials]);

  const servicePrice = service?.basePrice || 0;
  const scienceFee = service?.science_fee || 0;
  
  const subtotal = servicePrice + hospitalCost + materialsCost + scienceFee;

  const couponDiscountValue = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discount_type === 'percentage') {
      return (servicePrice * appliedCoupon.discount_value) / 100;
    }
    return appliedCoupon.discount_value;
  }, [appliedCoupon, servicePrice]);

  const totalDiscount = (parseFloat(manualDiscount) || 0) + couponDiscountValue;
  const total = Math.max(0, subtotal - totalDiscount);

  const handleAddMaterial = () => {
    if (newMaterialName && newMaterialValue) {
      setSpecialMaterials([...specialMaterials, { name: newMaterialName, value: parseFloat(newMaterialValue) }]);
      setNewMaterialName('');
      setNewMaterialValue('');
    }
  };

  const handleRemoveMaterial = (index) => {
    setSpecialMaterials(specialMaterials.filter((_, i) => i !== index));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsCheckingCoupon(true);
    setAppliedCoupon(null);
    setTimeout(() => {
      const coupon = mockCoupons[couponCode.toUpperCase()];
      if (coupon) {
        setAppliedCoupon(coupon);
        toast({ title: 'Sucesso!', description: 'Cupom aplicado.', className: 'bg-green-600 text-white' });
      } else {
        toast({ variant: 'destructive', title: 'Cupom inválido.' });
      }
      setIsCheckingCoupon(false);
    }, 500);
  };

  const handleNext = () => {
    onNext({
      patient_id: patient.id,
      service_id: service.id,
      patients: patient,
      services: service,
      subtotal,
      discount_amount: totalDiscount,
      total,
      notes: `Hospital: ${hospitals.find(h => h.id === selectedHospitalId)?.name || 'N/A'}. Materiais: ${specialMaterials.map(m => `${m.name} (R$${m.value})`).join(', ')}`,
      hospital_cost: hospitalCost,
      materials_cost: materialsCost,
      coupon_code: appliedCoupon?.code,
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="p-4 rounded-lg bg-black/20">
            <div className="flex items-center space-x-3 mb-2"><User className="h-5 w-5 text-purple-300" /> <h4 className="font-semibold text-white">{patient.full_name}</h4></div>
            <div className="flex items-center space-x-3"><Stethoscope className="h-5 w-5 text-pink-300" /> <h4 className="font-semibold text-white">{service.name}</h4></div>
          </div>
          <div>
            <Label className="text-cyan-200 font-semibold mb-2 block">Hospital</Label>
            <Select value={selectedHospitalId} onValueChange={setSelectedHospitalId}><SelectTrigger><SelectValue placeholder="Selecione o hospital (opcional)" /></SelectTrigger><SelectContent>{hospitals.map(h => <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="flex items-center justify-between mt-4">
            <Label htmlFor="special-materials-switch" className="text-yellow-200 font-semibold">Adicionar Materiais Especiais?</Label>
            <Switch id="special-materials-switch" checked={showSpecialMaterials} onCheckedChange={setShowSpecialMaterials} />
          </div>
          {showSpecialMaterials && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2 bg-black/20 p-4 rounded-lg">
              {specialMaterials.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm"><span className="text-white">{item.name}</span><div className="flex items-center gap-2"><span className="text-yellow-300">R$ {item.value.toFixed(2)}</span><Button variant="ghost" size="icon" className="h-6 w-6 text-red-400" onClick={() => handleRemoveMaterial(index)}><Trash2 className="h-4 w-4" /></Button></div></div>
              ))}
              <div className="flex gap-2 items-center pt-2 border-t border-white/10"><Input value={newMaterialName} onChange={(e) => setNewMaterialName(e.target.value)} placeholder="Nome do material" className="bg-white/10 text-xs h-8" /><Input type="number" value={newMaterialValue} onChange={(e) => setNewMaterialValue(e.target.value)} placeholder="Valor" className="bg-white/10 text-xs h-8 w-24" /><Button size="icon" className="h-8 w-8 bg-yellow-500 hover:bg-yellow-600 flex-shrink-0" onClick={handleAddMaterial}><PlusCircle className="h-4 w-4" /></Button></div>
            </motion.div>
          )}
        </div>
        <div className="space-y-4">
            <div className="p-6 rounded-lg bg-black/30">
                <h4 className="font-bold text-white mb-4">Composição de Custos e Descontos</h4>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center"><span className="flex items-center gap-2 text-purple-200"><Stethoscope/>Serviço</span> <span className="text-white">R$ {servicePrice.toFixed(2)}</span></div>
                    <div className="flex justify-between items-center"><span className="flex items-center gap-2 text-cyan-200"><Hotel/>Hospital</span> <span className="text-white">R$ {hospitalCost.toFixed(2)}</span></div>
                    <div className="flex justify-between items-center"><span className="flex items-center gap-2 text-yellow-200"><PlusCircle/>Materiais</span> <span className="text-white">R$ {materialsCost.toFixed(2)}</span></div>
                    <div className="flex justify-between items-center"><span className="flex items-center gap-2 text-green-300"><DollarSign/>Taxa Científica</span> <span className="text-white">R$ {scienceFee.toFixed(2)}</span></div>
                    <div className="border-t border-white/10 pt-2 mt-2 flex justify-between items-center font-semibold text-base"><span className="text-white">Subtotal</span> <span className="text-white">R$ {subtotal.toFixed(2)}</span></div>
                </div>
                <div className="space-y-4 mt-4">
                    <div>
                        <Label className="text-red-300">Desconto Manual (R$)</Label>
                        <Input name="manual_discount" type="number" value={manualDiscount} onChange={(e) => setManualDiscount(e.target.value)} className="bg-white/10 border-white/20 text-white"/>
                    </div>
                    <div>
                        <Label className="text-red-300">Cupom de Desconto</Label>
                        <div className="flex items-center space-x-2">
                          <div className="relative flex-grow"><Ticket className="absolute left-3 top-2.5 h-5 w-5 text-purple-300" /><Input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="INSIRA O CÓDIGO" className="bg-white/10 border-white/20 text-white pl-10"/></div>
                          <Button onClick={handleApplyCoupon} disabled={isCheckingCoupon || !couponCode} className="bg-purple-600 hover:bg-purple-700">{isCheckingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Aplicar'}</Button>
                        </div>
                        {appliedCoupon && (<p className="text-green-400 text-xs mt-2">Cupom "{appliedCoupon.code}" aplicado: {appliedCoupon.description} (-R$ {couponDiscountValue.toFixed(2)})</p>)}
                    </div>
                </div>
                 <div className="border-t-2 border-green-500/50 pt-3 mt-4">
                    <div className="flex justify-between items-center text-xl font-bold">
                        <span className="text-white">TOTAL</span>
                        <span className="text-green-400">R$ {total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-8">
        <Button variant="outline" onClick={onBack} className="text-purple-200 border-purple-300 hover:bg-purple-400/10"><ArrowLeft className="h-4 w-4 mr-2" />Voltar</Button>
        <Button onClick={handleNext} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">Avançar para Pagamento <ArrowRight className="h-4 w-4 ml-2" /></Button>
      </div>
    </motion.div>
  );
};

export default BudgetCreationStep;
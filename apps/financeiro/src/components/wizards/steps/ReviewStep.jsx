import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Check, Loader2, User, Stethoscope, Hotel, PlusCircle, BadgePercent, DollarSign, CreditCard, Percent } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const ReviewStep = ({ budgetData, onBack, onNext }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!termsAccepted) {
      toast({ variant: 'destructive', title: 'Termos não aceitos', description: 'Você precisa confirmar que o paciente foi informado.' });
      return;
    }
    setIsSaving(true);
    await onNext();
    setIsSaving(false);
  };
  
  const { patient, service } = budgetData;
  const { subtotal, discount_amount, hospital_cost, materials_cost } = budgetData.budgetDetails;
  const { total, entry_amount, installments, payment_method, fees } = budgetData.paymentDetails;
  
  const remainingBalanceWithFees = total - entry_amount;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
                <div className="p-4 rounded-lg bg-black/20">
                    <div className="flex items-center space-x-3 mb-2"><User className="h-5 w-5 text-purple-300" /><h4 className="font-semibold text-white">{patient.full_name}</h4></div>
                    <div className="flex items-center space-x-3"><Stethoscope className="h-5 w-5 text-pink-300" /><h4 className="font-semibold text-white">{service.name}</h4></div>
                </div>
                
                 <div className="p-4 rounded-lg bg-black/20">
                    <h4 className="font-bold text-white mb-2">Custos</h4>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between"><span className="flex items-center gap-2 text-gray-300"><Stethoscope/>Serviço</span> <span className="text-white">R$ {(subtotal - hospital_cost - materials_cost).toFixed(2)}</span></div>
                        <div className="flex justify-between"><span className="flex items-center gap-2 text-gray-300"><Hotel/>Hospital</span> <span className="text-white">R$ {hospital_cost.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span className="flex items-center gap-2 text-gray-300"><PlusCircle/>Materiais</span> <span className="text-white">R$ {materials_cost.toFixed(2)}</span></div>
                         <div className="border-t border-white/10 pt-1 mt-1 flex justify-between font-semibold"><span className="text-white">Subtotal</span> <span className="text-white">R$ {subtotal.toFixed(2)}</span></div>
                    </div>
                </div>
            </div>

            <div className="p-4 rounded-lg bg-black/20">
                <h4 className="font-bold text-white mb-2">Pagamento</h4>
                <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="flex items-center gap-2 text-red-300"><BadgePercent/>Descontos</span> <span className="text-white">- R$ {discount_amount.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="flex items-center gap-2 text-green-300"><DollarSign/>Entrada</span> <span className="text-white">- R$ {entry_amount.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="flex items-center gap-2 text-amber-300"><Percent/>Taxas</span> <span className="text-white">+ R$ {fees.toFixed(2)}</span></div>
                    <div className="border-t border-white/10 pt-1 mt-1 flex justify-between font-semibold"><span className="text-white">Forma de Pagamento</span> <span className="text-white">{payment_method}</span></div>
                    <div className="flex justify-between font-semibold"><span className="text-white">Parcelamento</span> <span className="text-white">{installments}x</span></div>
                </div>
            </div>
        </div>
        
        <div className="mt-8 p-6 rounded-lg bg-green-900/50 border border-green-500/50">
            <div className="flex justify-between items-center text-2xl font-bold">
                <span className="text-white">VALOR TOTAL FINAL</span>
                <span className="text-green-300">R$ {total.toFixed(2)}</span>
            </div>
             {installments > 1 && remainingBalanceWithFees > 0 && (
                <p className="text-right text-green-200 text-sm mt-1">
                    Saldo restante em {installments}x de R$ {(remainingBalanceWithFees / installments).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
             )}
        </div>

        <div className="flex items-center space-x-2 mt-6">
            <Checkbox id="terms-review" checked={termsAccepted} onCheckedChange={setTermsAccepted} className="border-purple-300 data-[state=checked]:bg-purple-600 data-[state=checked]:text-white"/>
            <Label htmlFor="terms-review" className="text-purple-200 text-sm cursor-pointer">Declaro que o paciente foi informado sobre todos os valores, taxas e condições de pagamento.</Label>
        </div>

        <div className="flex justify-between items-center mt-8">
            <Button variant="outline" onClick={onBack} disabled={isSaving} className="text-purple-200 border-purple-300 hover:bg-purple-400/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
            </Button>
            <Button onClick={handleSave} disabled={isSaving || !termsAccepted} className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
                {isSaving ? 'Finalizando...' : 'Finalizar e Salvar Orçamento'}
            </Button>
        </div>
    </motion.div>
  );
};

export default ReviewStep;
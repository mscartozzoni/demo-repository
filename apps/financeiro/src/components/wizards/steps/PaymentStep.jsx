import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, ArrowRight, Loader2, CreditCard, Percent, DollarSign, BrainCircuit } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const mockProtocols = [
    { id: 'p1', name: 'Padrão Clínica', max_installments: 12, protocol_payment_methods: [{ payment_methods: { id: 'pm1', name: 'Cartão de Crédito', fee_percent: 2.5, interest_rate_percent: 1.99 } }, { payment_methods: { id: 'pm2', name: 'PIX', fee_percent: 0, interest_rate_percent: 0 } }] },
    { id: 'p2', name: 'Campanha de Verão', max_installments: 6, protocol_payment_methods: [{ payment_methods: { id: 'pm2', name: 'PIX', fee_percent: 0, interest_rate_percent: 0 } }] },
];

const mockAiSuggestion = {
    protocol_id: 'p1',
    entry_amount: 5000,
    installments: 10,
    reason: "Para este perfil e procedimento, sugerimos o protocolo padrão com uma entrada robusta para garantir comprometimento e um parcelamento estendido para facilitar a aprovação."
};

const PaymentStep = ({ baseBudget, onBack, onNext }) => {
  const [protocols] = useState(mockProtocols);
  const [selectedProtocolId, setSelectedProtocolId] = useState('');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethodId, setSelectedMethodId] = useState('');
  const [installments, setInstallments] = useState(1);
  const [entryAmount, setEntryAmount] = useState(baseBudget.entry_amount || (baseBudget.services?.depositFixed ?? 0));
  
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const { toast } = useToast();

  const getAiSuggestion = useCallback(() => {
      setLoadingAi(true);
      setTimeout(() => {
          setAiSuggestion(mockAiSuggestion);
          setLoadingAi(false);
          toast({ title: "Sugestão da IA pronta!", description: "Analisamos o perfil e o procedimento.", className: 'bg-blue-600 text-white' });
      }, 1000);
  }, [toast]);

  const applyAiSuggestion = () => {
    if (!aiSuggestion) return;
    setSelectedProtocolId(aiSuggestion.protocol_id);
    setEntryAmount(aiSuggestion.entry_amount);
    setTimeout(() => {
        setInstallments(aiSuggestion.installments);
        toast({ title: "Sugestão aplicada!", className: 'bg-green-600 text-white'});
    }, 100);
    setAiSuggestion(null);
  };

  useEffect(() => {
      if (protocols.length > 0 && !selectedProtocolId) {
          setSelectedProtocolId(protocols[0].id);
      }
  }, [protocols, selectedProtocolId]);
  
  const selectedProtocol = protocols.find(p => p.id === selectedProtocolId);

  useEffect(() => {
    if (selectedProtocol) {
      const availableMethods = selectedProtocol.protocol_payment_methods.map(p => p.payment_methods);
      setPaymentMethods(availableMethods);
      if (availableMethods.length > 0 && !availableMethods.some(pm => pm.id === selectedMethodId)) {
        setSelectedMethodId(availableMethods[0].id);
        setInstallments(1);
      }
    }
  }, [selectedProtocol, selectedMethodId]);

  const selectedMethod = paymentMethods.find(pm => pm.id === selectedMethodId);
  const currentRemainingBalance = Math.max(0, baseBudget.total - entryAmount);

  const fees = useMemo(() => {
    if (!selectedMethod) return 0;
    let currentFees = 0;
    if (selectedMethod.fee_percent > 0) {
      currentFees += currentRemainingBalance * (selectedMethod.fee_percent / 100);
    }
    if (installments > 1 && selectedMethod.interest_rate_percent > 0) {
      currentFees += currentRemainingBalance * (selectedMethod.interest_rate_percent / 100) * (installments - 1);
    }
    return Math.round(currentFees * 100) / 100;
  }, [selectedMethod, installments, currentRemainingBalance]);

  const finalTotal = baseBudget.total + fees;
  const remainingBalanceWithFees = currentRemainingBalance + fees;

  const handleNextClick = () => {
    onNext({ 
        total: finalTotal, 
        entry_amount: entryAmount,
        installments,
        payment_method: selectedMethod?.name,
        fees,
    });
  };
  
  const installmentOptions = selectedProtocol ? Array.from({ length: selectedProtocol.max_installments }, (_, i) => i + 1) : [1];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
                <Card className="bg-blue-900/30 border border-blue-500/50 p-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3"><BrainCircuit className="h-6 w-6 text-blue-300" /><div><h4 className="font-semibold text-white">Assistente de IA</h4><p className="text-xs text-blue-200">Deixe a IA sugerir a melhor condição.</p></div></div>
                        <Button onClick={getAiSuggestion} disabled={loadingAi} size="sm" variant="outline" className="text-blue-200 border-blue-400 hover:bg-blue-400/10">{loadingAi ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sugerir"}</Button>
                    </div>
                    {aiSuggestion && (<motion.div initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} className="mt-4 bg-black/20 p-4 rounded-lg"><p className="text-sm text-blue-200 italic">"{aiSuggestion.reason}"</p><div className="flex justify-end mt-2"><Button onClick={applyAiSuggestion} size="sm">Aplicar</Button></div></motion.div>)}
                </Card>

                <div className="p-6 rounded-lg bg-black/20">
                  <h4 className="text-xl font-bold text-white mb-4">Configuração</h4>
                  <div className="space-y-4">
                    <div>
                        <Label className="text-purple-200">Sinal / Valor de Entrada (R$)</Label>
                        <Input type="number" value={entryAmount} onChange={(e) => setEntryAmount(parseFloat(e.target.value) || 0)} className="bg-white/10 border-white/20"/>
                    </div>
                    <div>
                        <Label className="text-purple-200 font-semibold mb-2 block">Protocolo de Pagamento</Label>
                        <Select value={selectedProtocolId} onValueChange={setSelectedProtocolId}><SelectTrigger><SelectValue placeholder="Selecione..."/></SelectTrigger><SelectContent>{protocols.map(p => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}</SelectContent></Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-purple-200">Forma de Pagamento</Label>
                        <Select value={selectedMethodId} onValueChange={(v) => { setSelectedMethodId(v); setInstallments(1); }} disabled={!selectedProtocol}><SelectTrigger><SelectValue placeholder="Selecione..."/></SelectTrigger><SelectContent>{paymentMethods.map(pm => (<SelectItem key={pm.id} value={pm.id}>{pm.name}</SelectItem>))}</SelectContent></Select>
                      </div>
                      <div>
                        <Label className="text-purple-200">Parcelas</Label>
                        <Select value={String(installments)} onValueChange={(v) => setInstallments(parseInt(v))} disabled={!selectedMethod || (selectedProtocol && selectedProtocol.max_installments <= 1)}><SelectTrigger><SelectValue placeholder="N/A"/></SelectTrigger><SelectContent>{installmentOptions.map(i => (<SelectItem key={i} value={String(i)}>{i}x</SelectItem>))}</SelectContent></Select>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
            <div className="p-6 rounded-lg bg-black/30 flex flex-col">
                <h4 className="text-xl font-bold text-white mb-4">Resumo Financeiro Final</h4>
                <div className="space-y-3 text-sm flex-grow">
                  <div className="flex justify-between items-center text-purple-200"><span>Valor Total (sem taxas)</span><span>R$ {baseBudget.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
                  <div className="flex justify-between items-center text-purple-200"><span>Entrada</span><span>- R$ {entryAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
                  <hr className="border-white/10" />
                  <div className="flex justify-between items-center font-semibold text-base text-white"><span>Saldo Remanescente</span><span>R$ {currentRemainingBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
                  <div className="flex justify-between items-center text-amber-300"><div className="flex items-center space-x-2"><Percent className="h-4 w-4" /><span>Taxas e Juros (sobre saldo)</span></div><span>+ R$ {fees.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
                </div>
                <div className="border-t-2 border-green-500/50 pt-4 mt-4">
                    <div className="flex justify-between items-center text-white font-bold text-2xl">
                        <div className="flex items-center space-x-2"><CreditCard className="h-6 w-6" /><span>Total Final</span></div>
                        <span>R$ {finalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    {installments > 1 && remainingBalanceWithFees > 0 && (<p className="text-right text-purple-200 text-sm">{installments}x de R$ {(remainingBalanceWithFees / installments).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>)}
                </div>
            </div>
        </div>

      <div className="flex justify-between items-center mt-8">
        <Button variant="outline" onClick={onBack} className="text-purple-200 border-purple-300 hover:bg-purple-400/10"><ArrowLeft className="h-4 w-4 mr-2" />Voltar</Button>
        <Button onClick={handleNextClick} disabled={!selectedMethod} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">Avançar para Revisão <ArrowRight className="h-4 w-4 ml-2" /></Button>
      </div>
    </motion.div>
  );
};

export default PaymentStep;
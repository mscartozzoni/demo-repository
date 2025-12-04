import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar, FilePlus2 } from 'lucide-react';

const SetSurgeryDateModal = ({ isOpen, onClose, onSubmit, quote }) => {
  const [surgeryDate, setSurgeryDate] = useState('');

  const hasDraftInvoice = quote?.invoices?.some(inv => inv.status === 'draft');

  useEffect(() => {
    if (quote?.surgery_date) {
      setSurgeryDate(quote.surgery_date);
    } else {
      setSurgeryDate('');
    }
  }, [quote]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (quote && quote.id) {
      onSubmit(quote.id, surgeryDate || null);
    }
  };

  const modalTitle = hasDraftInvoice ? "Agendar Cirurgia" : "Gerar Fatura de Saldo";
  const modalDescription = hasDraftInvoice 
    ? "Defina a data da cirurgia para ativar a fatura."
    : "Defina a data da cirurgia ou gere uma fatura em rascunho.";
  const buttonText = hasDraftInvoice ? "Agendar e Ativar Fatura" : "Gerar Fatura";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 w-full max-w-md"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-3 rounded-xl">
                {hasDraftInvoice ? <Calendar className="h-6 w-6 text-white" /> : <FilePlus2 className="h-6 w-6 text-white" />}
            </div>
            <div>
                <h3 className="text-2xl font-bold text-white">{modalTitle}</h3>
                <p className="text-purple-200">{modalDescription}</p>
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            <div>
              <Label className="text-purple-200">Data da Cirurgia (Opcional)</Label>
              <Input 
                type="date" 
                className="bg-white/10 border-white/20 text-white"
                value={surgeryDate}
                onChange={(e) => setSurgeryDate(e.target.value)}
              />
              <p className="text-xs text-purple-300 mt-2">
                {hasDraftInvoice 
                  ? "A data de vencimento da fatura será definida para 48h antes da cirurgia."
                  : "Se a data for definida, o vencimento será 48h antes. Se não, a fatura será um rascunho."
                }
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button variant="ghost" onClick={onClose} className="text-purple-200">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} className="bg-gradient-to-r from-cyan-500 to-blue-500">
              {buttonText}
            </Button>
          </div>
        </motion.div>
      </div>
    </Dialog>
  );
};

export default SetSurgeryDateModal;
import React from 'react';
import { motion } from 'framer-motion';
import { Dialog } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const FinanceModal = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 w-full max-w-2xl"
        >
          <h3 className="text-2xl font-bold text-white mb-6">Nova Transação Financeira</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label className="text-purple-200">Tipo</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receber">Conta a Receber</SelectItem>
                  <SelectItem value="pagar">Conta a Pagar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-purple-200">Valor</Label>
              <Input className="bg-white/10 border-white/20 text-white" placeholder="R$ 0,00" />
            </div>
            <div>
              <Label className="text-purple-200">Data de Vencimento</Label>
              <Input type="date" className="bg-white/10 border-white/20 text-white" />
            </div>
            <div>
              <Label className="text-purple-200">Categoria</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="procedimento">Procedimento</SelectItem>
                  <SelectItem value="fornecedor">Fornecedor</SelectItem>
                  <SelectItem value="aluguel">Aluguel</SelectItem>
                  <SelectItem value="equipamento">Equipamento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mb-6">
            <Label className="text-purple-200">Descrição</Label>
            <Textarea className="bg-white/10 border-white/20 text-white" placeholder="Descrição da transação..." />
          </div>
          <div className="flex justify-end space-x-4">
            <Button variant="ghost" onClick={onClose} className="text-purple-200">
              Cancelar
            </Button>
            <Button onClick={onSubmit} className="bg-gradient-to-r from-green-500 to-emerald-500">
              Criar Transação
            </Button>
          </div>
        </motion.div>
      </div>
    </Dialog>
  );
};

export default FinanceModal;
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { PartyPopper, MessageSquare, FileText, CheckCircle } from 'lucide-react';

const FinalizeStep = ({ quote, patient, onFinish }) => {
  const { toast } = useToast();

  const handleAction = (action) => {
    toast({
      title: "🚧 Funcionalidade em breve!",
      description: `A ação de "${action}" será implementada em breve.`,
      variant: 'info'
    });
  };

  if (!quote || !patient) {
    return (
        <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Erro ao finalizar</h2>
            <p className="text-red-400 mt-2">Não foi possível carregar os dados do orçamento. Por favor, tente novamente.</p>
            <Button onClick={onFinish} className="mt-6">Voltar</Button>
        </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
      <div className="flex justify-center mb-6">
        <PartyPopper className="h-16 w-16 text-green-400" />
      </div>
      <h2 className="text-2xl font-bold text-white">Orçamento Criado com Sucesso!</h2>
      <p className="text-purple-200 mt-2 mb-6">
        O orçamento para <span className="font-semibold text-white">{patient.full_name}</span> no valor de 
        <span className="font-semibold text-white"> R$ {Number(quote.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} </span> 
        foi salvo.
      </p>

      <div className="bg-black/20 p-4 rounded-lg mb-6">
        <div className="flex items-center text-left space-x-3">
          <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
          <p className="text-sm text-gray-300">
            O status do orçamento foi definido como <span className="font-semibold text-white">'{quote.status}'</span> e o status de pagamento como <span className="font-semibold text-white">'{quote.payment_status}'</span>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Button variant="outline" className="w-full h-20 flex-col space-y-1" onClick={() => handleAction('Enviar Mensagem')}>
          <MessageSquare className="h-6 w-6 text-purple-300" />
          <span className="text-purple-200">Enviar para Paciente</span>
        </Button>
        <Button variant="outline" className="w-full h-20 flex-col space-y-1" onClick={() => handleAction('Ver Contrato')}>
          <FileText className="h-6 w-6 text-purple-300" />
          <span className="text-purple-200">Gerar/Ver Contrato</span>
        </Button>
      </div>

      <Button 
        onClick={onFinish}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
      >
        Concluir
      </Button>
    </motion.div>
  );
};

export default FinalizeStep;
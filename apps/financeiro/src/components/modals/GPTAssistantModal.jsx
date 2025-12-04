import React from 'react';
import { motion } from 'framer-motion';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bot, Send, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const GPTAssistantModal = ({ isOpen, onClose }) => {
  const { toast } = useToast();

  const handleGPTQuery = () => {
    toast({
      title: "🚧 Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀"
    });
  };

  const handleSuggestionClick = () => {
    toast({
      title: "🚧 A IA para sugestão de valores está sendo preparada! Logo estará disponível. 🚀"
    });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 w-full max-w-4xl h-[600px] flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Assistente GPT Financeiro</h3>
                <p className="text-purple-200">Especializado em análises financeiras e planejamento</p>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose} className="text-purple-200">
              ✕
            </Button>
          </div>
          
          <div className="flex-1 bg-white/5 rounded-lg p-4 mb-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white/10 rounded-lg p-3 max-w-md">
                  <p className="text-white text-sm">
                    Olá! Sou seu assistente financeiro especializado. Posso ajudar com análises de ROI, 
                    planejamento de investimentos, projeções de receita e muito mais. Como posso ajudá-lo hoje?
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
             <Button onClick={handleSuggestionClick} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Sparkles className="h-4 w-4 mr-2" />
              Sugerir Valores
            </Button>
            <Input 
              className="flex-1 bg-white/10 border-white/20 text-white" 
              placeholder="Digite sua pergunta sobre finanças..." 
            />
            <Button onClick={handleGPTQuery} className="bg-gradient-to-r from-green-500 to-emerald-500">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </Dialog>
  );
};

export default GPTAssistantModal;
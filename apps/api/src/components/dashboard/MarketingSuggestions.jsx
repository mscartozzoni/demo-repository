import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const MarketingSuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const mockSuggestions = [
      {
        id: '1',
        title: 'Campanha de Check-ups Pós-Procedimento',
        description: 'Pacientes que realizaram procedimentos há 3 meses. Taxa de conversão estimada: 35%',
        targetAudience: '42 pacientes',
        icon: Target
      },
      {
        id: '2',
        title: 'Desconto em Lipo para Clientes Fiéis',
        description: 'Ofereça desconto em lipoaspiração para clientes que já realizaram mais de 2 procedimentos.',
        targetAudience: '15 pacientes',
        icon: Mail
      }
    ];
    setSuggestions(mockSuggestions);
  }, []);

  const handleImplement = (title) => {
    toast({
      title: "🚧 Funcionalidade em desenvolvimento",
      description: "A implementação automática de campanhas estará disponível em breve! Solicite na próxima conversa! 🚀"
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="glass-effect rounded-2xl p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <TrendingUp className="w-5 h-5 text-purple-600" />
        <h2 className="text-xl font-semibold text-slate-800">Sugestões de Marketing IA</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            className="p-4 bg-white/50 rounded-xl hover:bg-white/80 transition-colors space-y-3"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <suggestion.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 mb-1">{suggestion.title}</h3>
                <p className="text-sm text-slate-600 mb-2">{suggestion.description}</p>
                <p className="text-xs text-purple-600 font-medium">Público-alvo: {suggestion.targetAudience}</p>
              </div>
            </div>
            <Button
              onClick={() => handleImplement(suggestion.title)}
              size="sm"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Implementar Campanha
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MarketingSuggestions;
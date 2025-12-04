import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SectorCard = ({ sector, stats, icon, color, gradient }) => {
  const { toast } = useToast();

  const handleSectorClick = () => {
    toast({
      title: "🚧 Esta funcionalidade ainda não foi implementada",
      description: "Mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀"
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      className="h-full"
    >
      <Card className={`h-full glass-effect-strong hover:shadow-xl transition-all duration-300 border-0 ${gradient} relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <div className="text-6xl transform rotate-12 mt-4 mr-4">
            {icon}
          </div>
        </div>
        
        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground text-lg font-bold capitalize">
              {sector}
            </CardTitle>
            <div className="text-3xl">{icon}</div>
          </div>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-secondary rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-foreground" />
                  <span className="text-foreground text-sm font-medium">Total</span>
                </div>
                <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
              </div>
              
              <div className="bg-secondary rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-foreground" />
                  <span className="text-foreground text-sm font-medium">Pendentes</span>
                </div>
                <p className="text-2xl font-bold text-foreground mt-1">{stats.pendentes}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Badge variant="secondary" className="bg-secondary text-foreground border-border">
                  Em andamento: {stats.emAndamento}
                </Badge>
              </div>
              <div className="flex items-center space-x-1 text-foreground text-sm">
                <CheckCircle className="h-4 w-4" />
                <span>{stats.resolvidos} resolvidos</span>
              </div>
            </div>
            
            <Button 
              onClick={handleSectorClick}
              className="w-full bg-secondary hover:bg-secondary/80 text-foreground border-border"
              variant="outline"
            >
              Gerenciar Setor
              <TrendingUp className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SectorCard;
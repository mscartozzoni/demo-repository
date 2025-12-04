import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ListChecks } from 'lucide-react';

const SystemLogsFeed = ({ logs }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }
    
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}m atrás`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h atrás`;
    const days = Math.floor(hours / 24);
    return `${days}d atrás`;
  };

  const getActionColor = (action) => {
    if (action.includes('Criado') || action.includes('Adicionado') || action.includes('Login')) {
      return 'bg-green-500/20 text-green-300 border-green-500/30';
    }
    if (action.includes('Removido') || action.includes('Falha')) {
      return 'bg-red-500/20 text-red-300 border-red-500/30';
    }
    if (action.includes('Alterada') || action.includes('Atualizado')) {
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    }
    return 'bg-secondary text-secondary-foreground';
  };

  const recentLogs = logs
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 15);

  return (
    <Card className="h-full glass-effect-strong text-foreground">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-foreground">
          <ListChecks className="h-5 w-5 text-green-400" />
          <span>Logs do Sistema</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
          {recentLogs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-secondary transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <Badge className={`text-xs font-normal ${getActionColor(log.action)}`}>
                    {log.action}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTime(log.created_at)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {log.details}
                </p>
                 <span className="text-xs text-muted-foreground font-medium">
                    por {log.user?.name || 'Sistema'}
                 </span>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemLogsFeed;
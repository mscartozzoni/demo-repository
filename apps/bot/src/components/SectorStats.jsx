import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { Briefcase, MessageSquare, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const SectorStats = () => {
  const { messages, currentUser } = useData();

  const userSector = currentUser?.sector || 'todos';

  const sectorMessages = userSector === 'todos' 
    ? messages 
    : messages.filter(m => m.type === userSector);

  const pendingCount = sectorMessages.filter(m => m.status === 'pendente').length;

  const getAverageResponseTime = () => {
    const resolvedMessages = sectorMessages.filter(m => m.status === 'resolvido' && m.resolvedTimestamp);
    if (resolvedMessages.length === 0) return 'N/A';
    
    const totalTime = resolvedMessages.reduce((acc, msg) => {
      return acc + (new Date(msg.resolvedTimestamp) - new Date(msg.timestamp));
    }, 0);
    
    const avgMilliseconds = totalTime / resolvedMessages.length;
    const hours = Math.floor(avgMilliseconds / 3600000);
    const minutes = Math.floor((avgMilliseconds % 3600000) / 60000);

    return `${hours > 0 ? `${hours}h ` : ''}${minutes}m`;
  };

  const stats = [
    { name: 'Setor Atual', value: userSector, icon: Briefcase },
    { name: 'Conversas Pendentes', value: pendingCount, icon: MessageSquare },
    { name: 'Tempo Médio', value: getAverageResponseTime(), icon: Clock },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="dark:glass-effect-strong">
            <CardContent className="p-4 flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.name}</p>
                <p className="text-2xl font-bold text-foreground capitalize">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default SectorStats;
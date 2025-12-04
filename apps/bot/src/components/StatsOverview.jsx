
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, Clock, CheckCircle } from 'lucide-react';

const StatsOverview = ({ messages = [] }) => { // Default messages to an empty array
  const totalMessages = messages.length;
  // Ensure message.status exists before filtering
  const pendingMessages = messages.filter(m => m.status === 'pendente').length;
  const inProgressMessages = messages.filter(m => m.status === 'em_andamento').length;
  const resolvedMessages = messages.filter(m => m.status === 'resolvido').length;
  // The 'isNewPatient' property might not exist on all messages, assuming it's intended for a specific message type or use case.
  // For now, keeping it as is, but it might also need a default if the property is optional.
  const newPatients = messages.filter(m => m.isNewPatient).length;

  const stats = [
    {
      title: 'Total de Mensagens',
      value: totalMessages,
      icon: Users,
      color: 'from-blue-500 to-blue-700', 
      change: '+12%'
    },
    {
      title: 'Pendentes',
      value: pendingMessages,
      icon: Clock,
      color: 'from-amber-500 to-amber-700', 
      change: '+5%'
    },
    {
      title: 'Em Andamento',
      value: inProgressMessages,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-700', 
      change: '+8%'
    },
    {
      title: 'Resolvidas',
      value: resolvedMessages,
      icon: CheckCircle,
      color: 'from-emerald-500 to-emerald-700', 
      change: '+15%'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300 glass-effect-strong text-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-sm text-green-500 font-medium mt-1">
                    {stat.change} vs. semana passada
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color} pulse-glow shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsOverview;

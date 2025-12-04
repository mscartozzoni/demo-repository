import React from 'react';
import { motion } from 'framer-motion';
import { HeartPulse, CheckCircle, User } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={`${colorClass} rounded-xl p-6 text-white`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm opacity-90">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <Icon className="w-8 h-8 opacity-80" />
    </div>
  </motion.div>
);

const EvolutionStats = ({ stats }) => {
  const statItems = [
    { title: 'Acompanhamento', value: stats.monitoring, icon: HeartPulse, colorClass: 'status-monitoring', delay: 0.1 },
    { title: 'Estáveis', value: stats.stable, icon: CheckCircle, colorClass: 'status-stable', delay: 0.2 },
    { title: 'Pendentes', value: stats.pending, icon: User, colorClass: 'status-pending', delay: 0.3 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statItems.map(item => <StatCard key={item.title} {...item} />)}
    </div>
  );
};

export default EvolutionStats;
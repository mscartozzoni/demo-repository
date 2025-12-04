import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, AlertCircle, CheckCircle } from 'lucide-react';

const ProactiveAlerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const mockAlerts = [
      { id: '1', type: 'reminder', message: 'Lembrete: Follow-up com Ana Costa agendado para amanhã', priority: 'medium' },
      { id: '2', type: 'suggestion', message: 'Sugestão: Enviar pesquisa de satisfação para pacientes do último mês', priority: 'low' },
      { id: '3', type: 'alert', message: 'Alerta: 3 pacientes sem retorno há mais de 6 meses', priority: 'high' }
    ];
    setAlerts(mockAlerts);
  }, []);

  const getIcon = (priority) => {
    if (priority === 'high') return <AlertCircle className="w-5 h-5 text-red-500" />;
    if (priority === 'medium') return <Bell className="w-5 h-5 text-orange-500" />;
    return <CheckCircle className="w-5 h-5 text-blue-500" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="glass-effect rounded-2xl p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <Bell className="w-5 h-5 text-purple-600" />
        <h2 className="text-xl font-semibold text-slate-800">Alertas Proativos</h2>
      </div>
      
      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            className="flex items-start gap-3 p-3 bg-white/50 rounded-xl hover:bg-white/80 transition-colors"
          >
            {getIcon(alert.priority)}
            <p className="text-sm text-slate-700 flex-1">{alert.message}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProactiveAlerts;
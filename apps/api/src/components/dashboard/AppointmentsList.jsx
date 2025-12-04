import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const mockAppointments = [
      { id: '1', patient: 'Maria Silva', time: '09:00', procedure: 'Botox' },
      { id: '2', patient: 'João Santos', time: '10:30', procedure: 'Consulta' },
      { id: '3', patient: 'Ana Costa', time: '14:00', procedure: 'Preenchimento' },
      { id: '4', patient: 'Carlos Oliveira', time: '15:30', procedure: 'Avaliação' }
    ];
    setAppointments(mockAppointments);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-effect rounded-2xl p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="w-5 h-5 text-purple-600" />
        <h2 className="text-xl font-semibold text-slate-800">Consultas de Hoje</h2>
      </div>
      
      <div className="space-y-3">
        {appointments.map((apt, index) => (
          <motion.div
            key={apt.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className="flex items-center justify-between p-3 bg-white/50 rounded-xl hover:bg-white/80 transition-colors"
          >
            <div>
              <p className="font-medium text-slate-800">{apt.patient}</p>
              <p className="text-sm text-slate-600">{apt.procedure}</p>
            </div>
            <div className="flex items-center gap-2 text-purple-600">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{apt.time}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AppointmentsList;
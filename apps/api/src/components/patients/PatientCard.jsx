import React from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PatientCard = ({ patient, delay, onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-effect rounded-2xl p-6 hover:shadow-2xl transition-shadow space-y-4 flex flex-col"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">{patient.name}, {patient.age}</h3>
            <p className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
              patient.status === 'active' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-orange-100 text-orange-700'
            }`}>
              {patient.status === 'active' ? 'Ativo' : 'Follow-up'}
            </p>
          </div>
        </div>
        {patient.status === 'follow-up' && (
          <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
        )}
      </div>

      <div className="space-y-2 text-sm flex-grow">
        <div className="flex items-center gap-2 text-slate-600">
          <Calendar className="w-4 h-4" />
          <span>Última visita: {new Date(patient.lastVisit).toLocaleDateString('pt-BR')}</span>
        </div>
      </div>

      <Button
        onClick={onSelect}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        size="sm"
      >
        Ver Detalhes
      </Button>
    </motion.div>
  );
};

export default PatientCard;
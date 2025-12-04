import React from 'react';
import { motion } from 'framer-motion';
import { X, User, Mail, Phone, Calendar, Stethoscope, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PatientDetailModal = ({ patient, onClose }) => {
  if (!patient) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-effect rounded-2xl p-8 w-full max-w-lg space-y-6 relative"
      >
        <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={onClose}>
            <X className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center flex-shrink-0">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{patient.name}, {patient.age}</h2>
            <p className={`text-sm font-medium px-2 py-1 rounded-full inline-block mt-1 ${
              patient.status === 'active' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-orange-100 text-orange-700'
            }`}>
              {patient.status === 'active' ? 'Ativo' : 'Requer Follow-up'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-slate-600 p-2 bg-white/50 rounded-lg">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>{patient.email}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 p-2 bg-white/50 rounded-lg">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>{patient.phone}</span>
            </div>
        </div>

        <div className="space-y-3">
            <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                <div>
                    <h4 className="font-semibold text-slate-700">Agendamentos</h4>
                    <p className="text-slate-600">Última visita: {new Date(patient.lastVisit).toLocaleDateString('pt-BR')}</p>
                    <p className="text-slate-600">Próxima consulta: {patient.nextAppointment ? new Date(patient.nextAppointment).toLocaleDateString('pt-BR') : 'Não agendada'}</p>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <Stethoscope className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                <div>
                    <h4 className="font-semibold text-slate-700">Histórico Cirúrgico</h4>
                    <p className="text-slate-600">{patient.surgicalHistory}</p>
                </div>
            </div>
            {patient.status === 'follow-up' && (
                 <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-orange-800">Alerta de Follow-up</h4>
                        <p className="text-orange-700">Este paciente requer acompanhamento para o procedimento de {patient.procedures[patient.procedures.length - 1]}.</p>
                    </div>
                </div>
            )}
        </div>
        
      </motion.div>
    </motion.div>
  );
};

export default PatientDetailModal;
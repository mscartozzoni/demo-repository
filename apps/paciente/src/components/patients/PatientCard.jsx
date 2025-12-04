import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Phone, Mail, CalendarPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const PatientCard = ({ patient, isHighlighted, onActionClick }) => {
  const getStatusBadge = (status) => {
    switch(status) {
        case 'active': return 'status-active';
        case 'pending_budget': return 'status-pending';
        default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getStatusText = (status) => {
     switch(status) {
        case 'active': return 'Jornada Ativa';
        case 'pending_budget': return 'Aguardando Orçamento';
        default: return 'Inativo';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`rounded-2xl transition-all duration-700 ${isHighlighted ? 'ring-2 ring-blue-500 ring-offset-4 ring-offset-slate-900 shadow-2xl shadow-blue-500/30' : ''}`}
    >
        <Card className="card-hover h-full flex flex-col">
            <Link to={`/admin/secretaria/pacientes/${patient.id}`} className="flex-grow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{patient.full_name}</CardTitle>
                      <span className={`status-badge ${getStatusBadge(patient.journeyStatus)} mt-2`}>
                        {getStatusText(patient.journeyStatus)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {patient.email && <div className="flex items-center space-x-2 text-sm text-gray-300"><Mail className="w-4 h-4" /><span>{patient.email}</span></div>}
                  {patient.phone && <div className="flex items-center space-x-2 text-sm text-gray-300"><Phone className="w-4 h-4" /><span>{patient.phone}</span></div>}
                </CardContent>
            </Link>

            <div className="p-6 pt-0 flex gap-2">
                <Button className="w-full btn-secondary" onClick={() => onActionClick('Agendar Consulta')}>
                    <CalendarPlus className="w-4 h-4 mr-2" />
                    Agendar
                </Button>
                 <Button size="icon" variant="ghost" className="shrink-0" onClick={() => onActionClick('Editar Paciente')}>
                    <Edit className="w-4 h-4" />
                </Button>
            </div>
        </Card>
    </motion.div>
  );
};

export default PatientCard;
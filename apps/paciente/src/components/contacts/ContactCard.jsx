
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Phone, 
  Mail,
  MessageSquare,
  UserPlus
} from 'lucide-react';

const ContactCard = ({ contact, onConvert, isHighlighted }) => {

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
      case 'contacted':
        return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`card-hover h-full flex flex-col ${isHighlighted ? 'ring-2 ring-blue-500 shadow-blue-500/30' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg">{contact.full_name || contact.name}</CardTitle>
            <span className={`status-badge ${getStatusBadge(contact.status)}`}>
              {contact.status === 'new' ? 'Novo' : contact.status === 'contacted' ? 'Contactado' : 'Geral'}
            </span>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3 flex-grow">
          {contact.email && <div className="flex items-center space-x-2 text-sm text-gray-300"><Mail className="w-4 h-4" /><span>{contact.email}</span></div>}
          {contact.phone && <div className="flex items-center space-x-2 text-sm text-gray-300"><Phone className="w-4 h-4" /><span>{contact.phone}</span></div>}
          {contact.reason && <div className="flex items-start space-x-2 text-sm text-gray-300"><MessageSquare className="w-4 h-4 mt-1 flex-shrink-0" /><span>{contact.reason}</span></div>}
        </CardContent>
        <div className="p-6 pt-0">
          <Button className="w-full btn-primary" onClick={() => onConvert(contact)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Converter em Paciente
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default ContactCard;

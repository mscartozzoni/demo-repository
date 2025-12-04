import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Clock, MessageSquare, CheckCircle, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const MessageCard = ({ message, onStatusChange }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-500';
      case 'em_andamento': return 'bg-blue-500';
      case 'resolvido': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta': return 'border-l-red-500';
      case 'media': return 'border-l-yellow-500';
      case 'baixa': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const getSectorIcon = (type) => {
    switch (type) {
      case 'agendamento': return '📅';
      case 'duvidas': return '❓';
      case 'orcamento': return '💰';
      default: return '📋';
    }
  };

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
    return date.toLocaleDateString();
  };

  const handleAction = (action) => {
    toast({
      title: "🚧 Esta funcionalidade ainda não foi implementada",
      description: "Mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀"
    });
  };

  const handleViewConversation = () => {
    navigate(`/conversation/${message.patientId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className={`border-l-4 ${getPriorityColor(message.priority)} hover:shadow-lg transition-all duration-300 glass-effect-subtle`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-400 text-white">
                  {message.patientName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-foreground">{message.patientName}</span>
                  {message.isNewPatient && (
                    <Badge variant="secondary" className="text-xs bg-blue-400 text-white">
                      Novo
                    </Badge>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">ID: {message.patientId}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getSectorIcon(message.type)}</span>
              <div className={`w-3 h-3 rounded-full ${getStatusColor(message.status)}`}></div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
              <p className="text-muted-foreground text-sm leading-relaxed">{message.message}</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatTime(message.timestamp)}</span>
                </div>
                <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                  {message.type.charAt(0).toUpperCase() + message.type.slice(1)}
                </Badge>
              </div>
              
              <div className="flex space-x-2">
                {message.status === 'pendente' && (
                  <Button 
                    size="sm" 
                    variant="glass"
                    onClick={() => handleAction('accept')}
                    className="text-xs"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Aceitar
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="glass"
                  onClick={handleViewConversation}
                  className="text-xs"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Ver Histórico
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MessageCard;
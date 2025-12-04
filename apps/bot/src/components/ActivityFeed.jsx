import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock, MessageSquare } from 'lucide-react';

const ActivityFeed = ({ messages }) => {
  const formatTime = (timestamp) => {
    // A timestamp can be a string or a Date object. Ensure we have a Date object.
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }
    
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return date.toLocaleDateString();
  };

  const getSectorColor = (type) => {
    switch (type) {
      case 'agendamento': return 'bg-blue-300 text-blue-900';
      case 'duvidas': return 'bg-purple-300 text-purple-900';
      case 'orcamento': return 'bg-green-300 text-green-900';
      default: return 'bg-gray-300 text-gray-900';
    }
  };

  const recentMessages = messages
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 10);

  return (
    <Card className="h-full glass-effect-strong text-foreground">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-foreground">
          <MessageSquare className="h-5 w-5 text-blue-400" />
          <span>Atividades Recentes</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
          {recentMessages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-secondary transition-colors"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-400 text-white text-xs">
                  {message.patientName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm text-foreground truncate">
                    {message.patientName}
                  </span>
                  <Badge className={`text-xs ${getSectorColor(message.type)}`}>
                    {message.type}
                  </Badge>
                  {message.isNewPatient && (
                    <Badge variant="secondary" className="text-xs bg-gray-300 text-gray-900">
                      Novo
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {message.message}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
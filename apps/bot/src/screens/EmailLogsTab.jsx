import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';
import { Mail, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const EmailLogsTab = () => {
  const { emailLogs, loading } = useData();

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'opened':
        return <Eye className="h-4 w-4 text-blue-400" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'sent':
        return 'success';
      case 'opened':
        return 'default';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };
  
  const getStatusLabel = (status) => {
    const labels = {
        sent: 'Enviado',
        opened: 'Aberto',
        failed: 'Falhou'
    };
    return labels[status] || status;
  }

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-effect-strong text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-6 w-6 text-blue-300" />
            <span>Logs de Entrega de E-mail</span>
          </CardTitle>
          <CardDescription className="text-gray-300">
            Acompanhe o status de todos os e-mails enviados pelo sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-gray-400">Carregando logs...</p>
          ) : (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
              {emailLogs.length > 0 ? (
                emailLogs.map((log) => (
                  <motion.div
                    key={log.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate" title={log.recipient}>{log.recipient}</p>
                      <p className="text-xs text-gray-400 truncate" title={log.subject}>{log.subject}</p>
                    </div>
                    <div className="flex items-center space-x-4 ml-4">
                      <Badge variant={getStatusVariant(log.status)} className="flex items-center space-x-1 w-28 justify-center">
                        {getStatusIcon(log.status)}
                        <span className="capitalize">{getStatusLabel(log.status)}</span>
                      </Badge>
                      <p className="text-xs text-gray-400 w-32 text-right">{formatTimestamp(log.timestamp)}</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-gray-400 py-8">Nenhum log de e-mail encontrado.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EmailLogsTab;
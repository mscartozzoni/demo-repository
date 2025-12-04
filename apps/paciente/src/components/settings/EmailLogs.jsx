import React, { useState, useEffect, useCallback } from 'react';
import { useApi } from '@/contexts/ApiContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Mail, AlertCircle, CheckCircle2, Send, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

const StatusIcon = ({ status }) => {
  switch (status) {
    case 'sent':
      return <Send className="h-5 w-5 text-blue-400" />;
    case 'delivered':
      return <CheckCircle2 className="h-5 w-5 text-green-400" />;
    case 'bounced':
    case 'delivery_delayed':
      return <AlertCircle className="h-5 w-5 text-yellow-400" />;
    default:
      return <Mail className="h-5 w-5 text-slate-500" />;
  }
};

const EmailLogs = () => {
  const { getEmailLogs } = useApi();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const data = await getEmailLogs();
    setLogs(data);
    setLoading(false);
  }, [getEmailLogs]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <Card className="bg-slate-800/50 border-slate-700 text-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-bold">Logs de Entrega de E-mail</CardTitle>
          <CardDescription>Status dos e-mails enviados pelo sistema.</CardDescription>
        </div>
        <Button variant="outline" size="icon" onClick={fetchLogs} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4">
            {loading && logs.length === 0 ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : (
              <AnimatePresence>
                {logs.map((log, index) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-start space-x-4 p-4 rounded-lg bg-slate-900/70 border border-slate-800 hover:bg-slate-800 transition-colors duration-200"
                  >
                    <div className="mt-1">
                       <StatusIcon status={log.status} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-slate-300">{log.subject || 'Sem Assunto'}</p>
                        <span className="text-xs text-slate-500">
                          {new Date(log.created_at).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">Para: {log.to_email}</p>
                      <div className="mt-1">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          log.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                          log.status === 'sent' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            {!loading && logs.length === 0 && (
              <div className="text-center py-10 text-slate-500">
                <Mail className="mx-auto h-12 w-12" />
                <p className="mt-4">Nenhum log de e-mail encontrado.</p>
                <p className="text-sm">Os logs aparecerão aqui assim que os e-mails forem enviados.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default EmailLogs;
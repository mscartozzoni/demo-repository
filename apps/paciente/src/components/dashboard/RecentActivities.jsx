import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useApi } from '@/contexts/ApiContext';
import { Bot, UserPlus, Loader2, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RecentActivities = () => {
  const { getContacts } = useApi();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecentContacts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getContacts();
      const sorted = (data || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setActivities(sorted.slice(0, 5));
    } catch (error) {
      // handled in context
    } finally {
      setLoading(false);
    }
  }, [getContacts]);

  useEffect(() => {
    fetchRecentContacts();
  }, [fetchRecentContacts]);

  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " anos";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " meses";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " dias";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m";
    return "agora";
  };

  const getActivityIcon = (activity) => {
    if (activity.contact_reason?.toLowerCase().includes('bot')) {
      return <Bot className="w-5 h-5 text-cyan-400" />;
    }
    return <UserPlus className="w-5 h-5 text-blue-400" />;
  };

  const getActivityText = (activity) => {
    if (activity.contact_reason?.toLowerCase().includes('bot')) {
      return (
        <span>
          Mensagem do bot para <span className="font-semibold text-white">{activity.full_name}</span>.
        </span>
      );
    }
    return (
      <span>
        Novo contato: <span className="font-semibold text-white">{activity.full_name}</span>.
      </span>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
      <Card className="glass-effect overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Atividades Recentes do Bot
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            </div>
          ) : activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                  onClick={() => navigate('/contacts')}
                >
                  <div className="p-2 bg-slate-700 rounded-full">
                    {getActivityIcon(activity)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-300">{getActivityText(activity)}</p>
                  </div>
                  <span className="text-xs text-gray-400">{formatTimeAgo(activity.created_at)}</span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Nenhuma atividade recente do bot.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecentActivities;
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import StatsOverview from '@/components/StatsOverview';
import SystemLogsFeed from '@/components/SystemLogsFeed';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AuditDashboard = () => {
  const { messages, systemLogs, employees } = useData();

  const userActivityData = useMemo(() => {
    if (!employees || !systemLogs) return [];

    const activity = employees.map(emp => ({
      name: emp.full_name,
      Login: 0,
      'Usuário Criado': 0,
      'Usuário Removido': 0,
      'Etiqueta Criada': 0,
      'Etiqueta Adicionada': 0
    }));

    systemLogs.forEach(log => {
      const userEntry = activity.find(u => u.name === log.employee?.full_name);
      if (userEntry && typeof userEntry[log.action] === 'number') {
        userEntry[log.action]++;
      }
    });
    
    return activity.filter(a => Object.values(a).some(v => typeof v === 'number' && v > 0));
  }, [systemLogs, employees]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <StatsOverview messages={messages} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemLogsFeed logs={systemLogs} />
        
        <Card className="glass-effect-strong">
          <CardHeader>
            <CardTitle>Atividade por Usuário</CardTitle>
          </CardHeader>
          <CardContent>
            {userActivityData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userActivityData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      borderColor: "hsl(var(--border))",
                      color: "hsl(var(--foreground))"
                    }}
                  />
                  <Legend wrapperStyle={{fontSize: "12px"}}/>
                  <Bar dataKey="Login" stackId="a" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Usuário Criado" stackId="a" fill="#82ca9d" />
                  <Bar dataKey="Usuário Removido" stackId="a" fill="#ffc658" />
                  <Bar dataKey="Etiqueta Criada" stackId="a" fill="#ff8042" />
                  <Bar dataKey="Etiqueta Adicionada" stackId="a" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
               <div className="text-center py-10 text-muted-foreground">
                  <p>Nenhuma atividade de usuário para exibir.</p>
               </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default AuditDashboard;
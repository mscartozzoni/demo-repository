
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Users, DollarSign, Clock, MailWarning, Flag, Activity } from 'lucide-react';
import { Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Widget = ({ icon, title, value, description, children, profile, allowedRoles }) => {
    if (allowedRoles && !allowedRoles.includes(profile.role)) {
        return null;
    }

    return (
        <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
            <Card className="glass-effect-soft h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    {icon}
                </CardHeader>
                <CardContent>
                    {value && <div className="text-2xl font-bold">{value}</div>}
                    {description && <p className="text-xs text-muted-foreground">{description}</p>}
                    {children}
                </CardContent>
            </Card>
        </motion.div>
    );
};


const DashboardWidgets = ({ profile }) => {
    const { messages, leads, budgets, follow_ups } = useData();

    const metrics = useMemo(() => {
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        startOfWeek.setHours(0,0,0,0);

        const dailyBalance = (budgets || [])
            .filter(b => b.status === 'approved' && new Date(b.budget_date) >= startOfDay)
            .reduce((sum, b) => sum + (b.total_amount || 0), 0);

        const weeklyBalance = (budgets || [])
            .filter(b => b.status === 'approved' && new Date(b.budget_date) >= startOfWeek)
            .reduce((sum, b) => sum + (b.total_amount || 0), 0);

        const pendingLeads = (leads || []).filter(l => l.status === 'new' || l.status === 'contacted').length;

        const pendingFollowUps = (follow_ups || []).filter(f => f.status === 'pending').length;

        const commsStages = (messages || []).reduce((acc, msg) => {
            const status = msg.status || 'new';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, { new: 0, replied: 0, archived: 0 });

        const priorityTags = (messages || []).reduce((acc, msg) => {
            const priority = msg.priority || 'baixa';
            acc[priority] = (acc[priority] || 0) + 1;
            return acc;
        }, { urgente: 0, alta: 0, media: 0, baixa: 0 });
        
        const commsChartData = Object.entries(commsStages).map(([name, value]) => ({ name, value }));

        return { dailyBalance, weeklyBalance, pendingLeads, pendingFollowUps, commsStages, priorityTags, commsChartData };
    }, [messages, leads, budgets, follow_ups]);
    
    const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Widget
                profile={profile}
                allowedRoles={['admin']}
                icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                title="Balanço (Semana)"
                value={formatCurrency(metrics.weeklyBalance)}
                description={`+${formatCurrency(metrics.dailyBalance)} hoje`}
            />
            <Widget
                profile={profile}
                allowedRoles={['admin', 'secretaria', 'receptionist']}
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
                title="Leads Pendentes"
                value={metrics.pendingLeads}
                description="Leads aguardando contato"
            />
            <Widget
                profile={profile}
                allowedRoles={['admin', 'medico']}
                icon={<Clock className="h-4 w-4 text-muted-foreground" />}
                title="Follow-ups"
                value={metrics.pendingFollowUps}
                description="Pacientes para acompanhamento"
            />
             <Widget
                profile={profile}
                allowedRoles={['admin', 'medico', 'secretaria', 'receptionist']}
                icon={<MailWarning className="h-4 w-4 text-muted-foreground" />}
                title="Mensagens Novas"
                value={metrics.commsStages.new}
                description="Aguardando primeira resposta"
            />

            <div className="lg:col-span-2">
                <Widget
                    profile={profile}
                    allowedRoles={['admin']}
                    icon={<BarChart className="h-4 w-4 text-muted-foreground" />}
                    title="Estágios da Comunicação"
                >
                    <ResponsiveContainer width="100%" height={150}>
                        <BarChart data={metrics.commsChartData} layout="vertical" margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                             <XAxis type="number" hide />
                             <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
                             <Tooltip cursor={{ fill: 'hsla(var(--muted), 0.5)' }} contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                             <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Widget>
            </div>
            
            <div className="lg:col-span-2">
                 <Widget
                    profile={profile}
                    allowedRoles={['admin', 'medico', 'secretaria', 'receptionist']}
                    icon={<Activity className="h-4 w-4 text-muted-foreground" />}
                    title="Prioridades Ativas"
                 >
                     <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-red-500">{metrics.priorityTags.urgente}</p>
                            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1"><Flag className="h-3 w-3 text-red-500"/>Urgente</p>
                        </div>
                         <div className="text-center">
                            <p className="text-2xl font-bold text-orange-500">{metrics.priorityTags.alta}</p>
                            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1"><Flag className="h-3 w-3 text-orange-500"/>Alta</p>
                        </div>
                         <div className="text-center">
                            <p className="text-2xl font-bold text-yellow-500">{metrics.priorityTags.media}</p>
                            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1"><Flag className="h-3 w-3 text-yellow-500"/>Média</p>
                        </div>
                         <div className="text-center">
                            <p className="text-2xl font-bold text-gray-500">{metrics.priorityTags.baixa}</p>
                            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1"><Flag className="h-3 w-3 text-gray-500"/>Baixa</p>
                        </div>
                     </div>
                 </Widget>
            </div>
        </div>
    );
};

export default DashboardWidgets;

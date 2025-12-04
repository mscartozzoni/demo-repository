
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Users, Calendar, CircleDollarSign, MessageSquare, CheckSquare, Loader2, ArrowRight } from 'lucide-react';
import { useApi } from '@/contexts/ApiContext';
import { useAuth } from '@/contexts/AuthContext';
import TodaysAgenda from '@/components/dashboard/TodaysAgenda';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const StatCard = ({ title, value, icon, link, color, isLoading }) => {
  const Icon = icon;
  return (
    <Card className="card-hover">
      <Link to={link}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">{title}</CardTitle>
          <Icon className={`h-5 w-5 ${color}`} />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          ) : (
            <div className="text-4xl font-bold">{value}</div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-effect p-3 rounded-lg">
        <p className="label font-semibold">{`${label}`}</p>
        <p className="intro text-blue-300">{`Agendamentos: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const { getDashboardStats, getAppointmentsForToday, getWeeklyAppointmentStats, getBudgets, loading } = useApi();
  const { user } = useAuth();
  
  const [stats, setStats] = useState({ totalPatients: '...', todaysAppointmentsCount: '...', pendingBudgetsCount: '...', unreadMessagesCount: '...', completedThisMonthCount: '...' });
  const [appointments, setAppointments] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [budgetData, setBudgetData] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const fetchData = useCallback(async () => {
      setIsDataLoading(true);
      try {
        const [statsData, appointmentsData, weeklyStats, budgets] = await Promise.all([
          getDashboardStats(),
          getAppointmentsForToday(),
          getWeeklyAppointmentStats(),
          getBudgets(),
        ]);
        setStats(statsData || { totalPatients: 0, todaysAppointmentsCount: 0, pendingBudgetsCount: 0, unreadMessagesCount: 0, completedThisMonthCount: 0 });
        setAppointments(appointmentsData || []);
        setWeeklyData(weeklyStats || []);
        
        if (budgets) {
          const statusCounts = budgets.reduce((acc, budget) => {
            acc[budget.status] = (acc[budget.status] || 0) + 1;
            return acc;
          }, {});
          setBudgetData([
            { name: 'Pendentes', value: statusCounts.pendente || 0, fill: '#facc15' }, // yellow-400
            { name: 'Aceitos', value: statusCounts.aceito || 0, fill: '#4ade80' }, // green-400
            { name: 'Recusados', value: statusCounts.recusado || 0, fill: '#f87171' }, // red-400
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsDataLoading(false);
      }
    }, [getDashboardStats, getAppointmentsForToday, getWeeklyAppointmentStats, getBudgets]);
    
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const welcomeMessage = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - Portal da Secretária</title>
        <meta name="description" content="Visão geral e rápida do seu dia de trabalho." />
      </Helmet>
      
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold gradient-text">{`${welcomeMessage}, ${user?.user_metadata?.full_name?.split(' ')[0] || 'Usuário'}!`}</h1>
          <p className="text-gray-400 mt-1">Aqui está um resumo rápido da sua clínica hoje.</p>
        </motion.div>
        
        {/* Cards de Estatísticas */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
            <StatCard title="Total de Pacientes" value={stats.totalPatients} icon={Users} link="/admin/secretaria/pacientes" color="text-blue-400" isLoading={isDataLoading}/>
          </motion.div>
          <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
            <StatCard title="Agendamentos Hoje" value={stats.todaysAppointmentsCount} icon={Calendar} link="/agenda" color="text-green-400" isLoading={isDataLoading}/>
          </motion.div>
          <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
            <StatCard title="Orçamentos Pendentes" value={stats.pendingBudgetsCount} icon={CircleDollarSign} link="/orcamento" color="text-yellow-400" isLoading={isDataLoading}/>
          </motion.div>
          <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible">
            <StatCard title="Mensagens não Lidas" value={stats.unreadMessagesCount} icon={MessageSquare} link="/admin/secretaria/mensagens" color="text-purple-400" isLoading={isDataLoading}/>
          </motion.div>
          <motion.div custom={4} variants={cardVariants} initial="hidden" animate="visible">
            <StatCard title="Consultas no Mês" value={stats.completedThisMonthCount} icon={CheckSquare} link="/financeiro" color="text-teal-400" isLoading={isDataLoading}/>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agenda do Dia */}
          <motion.div className="lg:col-span-1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card className="h-full glass-effect">
              <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Agenda do Dia</CardTitle>
                  <Link to="/agenda" className="text-sm text-blue-400 hover:underline flex items-center gap-1">
                      Ver tudo <ArrowRight className="w-4 h-4" />
                  </Link>
              </CardHeader>
              <CardContent>
                <TodaysAgenda appointments={appointments} loading={loading} selectedDate={new Date()} onRefetch={fetchData} />
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Gráficos */}
          <motion.div className="lg:col-span-2 space-y-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Card className="glass-effect">
                <CardHeader>
                    <CardTitle>Agendamentos da Semana</CardTitle>
                    <CardDescription>Volume de consultas e cirurgias nos últimos 7 dias.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false}/>
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }} />
                            <Bar dataKey="agendamentos" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card className="glass-effect">
                <CardHeader>
                    <CardTitle>Status dos Orçamentos</CardTitle>
                    <CardDescription>Distribuição dos orçamentos enviados.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={budgetData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                            <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                            <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} width={80} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }} />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

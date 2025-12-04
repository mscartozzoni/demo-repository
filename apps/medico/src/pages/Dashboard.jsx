import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, BarChart, FileText, Bot, Clock, Workflow, ListTodo } from 'lucide-react';
import { Helmet } from 'react-helmet';

const StatCard = ({ title, value, icon: Icon, change, isPositive }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/80"
  >
    <div className="flex justify-between items-start">
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-slate-400">{title}</h3>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
      <div className="p-3 bg-slate-700/50 rounded-lg">
        <Icon className="w-6 h-6 text-blue-400" />
      </div>
    </div>
    <p className={`text-xs mt-4 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>{change}</p>
  </motion.div>
);

const QuickActionCard = ({ title, icon: Icon, onClick }) => (
  <motion.div whileHover={{ scale: 1.05 }} className="h-full">
    <Card
      onClick={onClick}
      className="bg-slate-800/50 border-slate-700/80 h-full cursor-pointer hover:bg-slate-800 transition-colors"
    >
      <CardContent className="flex flex-col items-center justify-center p-6 h-full">
        <div className="mb-2 p-3 rounded-full bg-slate-700/50">
          <Icon className="w-6 h-6 text-slate-300" />
        </div>
        <p className="text-sm font-semibold text-center text-slate-300">{title}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const UpcomingAppointmentCard = ({ patientName, time, procedure }) => (
  <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-800/50 transition-colors">
    <div className="bg-slate-700 p-3 rounded-full">
      <Clock className="w-5 h-5 text-slate-300" />
    </div>
    <div className="flex-1">
      <p className="font-semibold text-white">{patientName}</p>
      <p className="text-sm text-slate-400">{procedure}</p>
    </div>
    <div className="text-right">
      <p className="font-medium text-slate-200">{time}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const stats = [
    { title: 'Consultas Hoje', value: '08', icon: Calendar, change: '+2 vs ontem', isPositive: true },
    { title: 'Novos Pacientes', value: '12', icon: Users, change: '+5% este mês', isPositive: true },
    { title: 'Faturamento Mensal', value: 'R$45k', icon: BarChart, change: '-2.5% vs mês passado', isPositive: false },
    { title: 'Documentos Pendentes', value: '03', icon: FileText, change: '1 Vencendo hoje', isPositive: false },
  ];

  const quickActions = [
    { title: 'Ver Tarefas', icon: ListTodo, onClick: () => navigate('/medico/actions') },
    { title: 'Adicionar Paciente', icon: Users, onClick: () => navigate('/medico/prontuarios', { state: { openAddPatientModal: true } }) },
    { title: 'Clinic Flow', icon: Workflow, onClick: () => navigate('/medico/clinic-flow') },
    { title: 'Assistente IA', icon: Bot, onClick: () => navigate('/medico/assistente-ia') },
  ];
  
  const upcomingAppointments = [
      { patientName: 'Ana Beatriz Costa', time: '14:00', procedure: 'Retorno Pós-operatório' },
      { patientName: 'Carlos Eduardo Lima', time: '15:30', procedure: 'Consulta Avaliativa' },
      { patientName: 'Fernanda Souza', time: '17:00', procedure: 'Aplicação de Toxina Botulínica' },
  ];
  
  return (
    <>
      <Helmet>
        <title>Dashboard - Portal do Médico</title>
        <meta name="description" content="Dashboard principal do Portal do Médico com visão geral da clínica." />
      </Helmet>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold text-white">Bem-vindo(a) de volta, {profile?.full_name?.split(' ')[0] || 'Doutor(a)'}!</h1>
          <p className="text-slate-400 mt-1">Aqui está um resumo da sua clínica hoje.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="bg-slate-800/50 border-slate-700/80 h-full">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {quickActions.map(action => (
                    <QuickActionCard key={action.title} {...action} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="bg-slate-800/50 border-slate-700/80 h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-white">Próximos Compromissos</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/medico/agenda')}>Ver todos</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                    {upcomingAppointments.map(appt => <UpcomingAppointmentCard key={appt.time} {...appt} />)}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
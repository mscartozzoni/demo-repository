import React from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, DollarSign, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const Dashboard = ({ patients, budgets, appointments }) => {
  const totalBudgets = budgets.length;
  const totalPatients = patients.length;
  const approvedBudgets = budgets.filter(b => b.status === 'Aprovado').length;
  const pendingBudgets = budgets.filter(b => b.status === 'Pendente').length;
  const monthlyRevenue = budgets
    .filter(b => b.status === 'Aprovado' && new Date(b.createdAt).getMonth() === new Date().getMonth() && new Date(b.createdAt).getFullYear() === new Date().getFullYear())
    .reduce((sum, budget) => sum + (budget.total || 0), 0);

  const lastConsultations = appointments
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
    .map(app => {
      const patient = patients.find(p => p.id === app.patientId);
      return { ...app, patientName: patient ? patient.name : 'Paciente Desconhecido' };
    });

  const stats = [
    {
      title: 'Total de Pacientes',
      value: totalPatients,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/50'
    },
    {
      title: 'Orçamentos Criados',
      value: totalBudgets,
      icon: FileText,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-100 dark:bg-pink-900/50'
    },
    {
      title: 'Orçamentos Aprovados',
      value: approvedBudgets,
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/50'
    },
    {
      title: 'Receita Mensal',
      value: `R$ ${monthlyRevenue.toLocaleString('pt-BR')}`,
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/50'
    }
  ];

  // Revenue Trends Data
  const getMonthlyRevenueData = () => {
    const revenueByMonth = {};
    const today = new Date();
    for (let i = 0; i < 6; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthYear = `${d.toLocaleString('pt-BR', { month: 'short' })}/${d.getFullYear().toString().slice(-2)}`;
      revenueByMonth[monthYear] = 0;
    }

    budgets.filter(b => b.status === 'Aprovado').forEach(budget => {
      const budgetDate = new Date(budget.createdAt);
      const monthYear = `${budgetDate.toLocaleString('pt-BR', { month: 'short' })}/${budgetDate.getFullYear().toString().slice(-2)}`;
      if (revenueByMonth.hasOwnProperty(monthYear)) {
        revenueByMonth[monthYear] += budget.total || 0;
      }
    });

    return Object.keys(revenueByMonth).sort((a, b) => {
      const [mA, yA] = a.split('/');
      const [mB, yB] = b.split('/');
      const dateA = new Date(`01-${mA}-20${yA}`);
      const dateB = new Date(`01-${mB}-20${yB}`);
      return dateA - dateB;
    }).map(monthYear => ({
      name: monthYear,
      revenue: revenueByMonth[monthYear],
    }));
  };

  const revenueData = getMonthlyRevenueData();

  // Procedure Distribution Data
  const getProcedureDistributionData = () => {
    const distribution = { 'Cirúrgico': 0, 'Estético': 0, 'Consulta': 0 };
    budgets.filter(b => b.status === 'Aprovado').forEach(budget => {
      if (distribution.hasOwnProperty(budget.origin)) {
        distribution[budget.origin] += budget.total || 0;
      }
    });
    return Object.keys(distribution).map(name => ({
      name,
      value: distribution[name],
    })).filter(item => item.value > 0);
  };

  const procedureData = getProcedureDistributionData();
  const COLORS = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-4xl font-bold gradient-text mb-2">Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400">Visão geral do seu sistema de orçamentos</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-2xl p-6 card-hover"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-xl`}>
                  <Icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                </div>
              </div>
              <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold gradient-text">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-effect rounded-2xl p-6"
        >
          <h3 className="text-2xl font-bold gradient-text mb-6">Tendência de Receita (Últimos 6 meses)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
              <Tooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Receita']} contentStyle={{ background: 'rgba(55, 65, 81, 0.8)', borderColor: '#4B5563', borderRadius: '8px' }} itemStyle={{ color: '#E5E7EB' }} labelStyle={{ color: '#D1D5DB' }} />
              <Line type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-effect rounded-2xl p-6"
        >
          <h3 className="text-2xl font-bold gradient-text mb-6">Distribuição de Procedimentos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={procedureData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {procedureData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Receita']} contentStyle={{ background: 'rgba(55, 65, 81, 0.8)', borderColor: '#4B5563', borderRadius: '8px' }} itemStyle={{ color: '#E5E7EB' }} labelStyle={{ color: '#D1D5DB' }} />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: '#D1D5DB' }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>


      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-effect rounded-2xl p-8"
      >
        <h3 className="text-2xl font-bold gradient-text mb-6">Últimas Consultas</h3>
        {lastConsultations.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Nenhuma consulta agendada recentemente.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {lastConsultations.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl hover:bg-white/70 dark:hover:bg-gray-700/50 transition-all"
              >
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{app.patientName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{app.procedure}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-purple-600 dark:text-purple-400">{new Date(app.date).toLocaleDateString('pt-BR')}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{app.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
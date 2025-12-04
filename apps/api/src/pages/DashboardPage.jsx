import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import StatsCard from '@/components/dashboard/StatsCard';
import AppointmentsList from '@/components/dashboard/AppointmentsList';
import MarketingSuggestions from '@/components/dashboard/MarketingSuggestions';
import ProactiveAlerts from '@/components/dashboard/ProactiveAlerts';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Calendar, Users, TrendingUp, Bell, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import jsPDF from 'jspdf';

const DashboardPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    monthlyGrowth: 0,
    pendingAlerts: 0
  });

  // Define initialStats outside the useEffect to be accessible everywhere
  const initialStats = { todayAppointments: 3, totalPatients: 247, monthlyGrowth: 12.5, pendingAlerts: 3 };

  useEffect(() => {
    const storedStats = localStorage.getItem('clinic_stats');
    if (storedStats) {
      setStats(JSON.parse(storedStats));
    } else {
      setStats(initialStats);
      localStorage.setItem('clinic_stats', JSON.stringify(initialStats));
    }
    
    // Proactive daily report toast
    const today = new Date().toDateString();
    const lastToastDate = localStorage.getItem('last_daily_toast');
    if (lastToastDate !== today) {
        toast({
            title: `Bom dia, ${user.name}!`,
            description: `Você tem ${initialStats.todayAppointments} consultas hoje; ideia de campanha: desconto em lipo para clientes fiéis.`,
            duration: 8000
        });
        localStorage.setItem('last_daily_toast', today);
    }
  }, [user, toast]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString('pt-BR');
    
    doc.setFontSize(22);
    doc.text(`Relatório Diário - ${today}`, 14, 20);
    doc.setFontSize(16);
    doc.text(`Olá, ${user.name}!`, 14, 30);
    
    doc.setFontSize(12);
    doc.text(`- Consultas Hoje: ${stats.todayAppointments}`, 14, 45);
    doc.text(`- Total de Pacientes: ${stats.totalPatients}`, 14, 52);
    doc.text(`- Crescimento Mensal: ${stats.monthlyGrowth}%`, 14, 59);
    doc.text(`- Alertas Pendentes: ${stats.pendingAlerts}`, 14, 66);
    
    doc.setFontSize(14);
    doc.text("Sugestão de Campanha:", 14, 80);
    doc.setFontSize(12);
    doc.text("- Desconto em lipoaspiração para clientes fiéis.", 14, 87);

    doc.save(`relatorio_diario_${today.replace(/\//g, '-')}.pdf`);
    
    toast({
        title: "Relatório Exportado!",
        description: "Seu relatório diário em PDF foi gerado com sucesso.",
    });
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - Meu Assistente Clínico</title>
        <meta name="description" content="Visão geral diária da sua clínica com insights inteligentes" />
      </Helmet>
      
      <Layout>
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
              <p className="text-slate-600 mt-1">Bom dia, {user?.name}! Visão geral do dia {new Date().toLocaleDateString('pt-BR')}</p>
            </div>
            <Button onClick={exportToPDF} className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
                <FileDown className="w-4 h-4 mr-2" />
                Exportar Relatório PDF
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard title="Consultas Hoje" value={stats.todayAppointments} icon={Calendar} color="purple" delay={0.1}/>
            <StatsCard title="Total de Pacientes" value={stats.totalPatients} icon={Users} color="blue" delay={0.2}/>
            <StatsCard title="Crescimento Mensal" value={`${stats.monthlyGrowth}%`} icon={TrendingUp} color="green" delay={0.3}/>
            <StatsCard title="Alertas Pendentes" value={stats.pendingAlerts} icon={Bell} color="orange" delay={0.4}/>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AppointmentsList />
            <ProactiveAlerts />
          </div>

          <MarketingSuggestions />
        </div>
      </Layout>
    </>
  );
};

export default DashboardPage;
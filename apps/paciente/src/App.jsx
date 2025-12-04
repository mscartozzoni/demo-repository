
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import Patients from '@/pages/Patients';
import PatientDetails from '@/pages/PatientDetails';
import Calendar from '@/pages/Calendar';
import Deadlines from '@/pages/Deadlines';
import Messages from '@/pages/Messages';
import Protocols from '@/pages/Protocols';
import PatientJourney from '@/pages/PatientJourney';
import Settings from '@/pages/Settings';
import Contacts from '@/pages/Contacts';
import ClinicalNotes from '@/pages/ClinicalNotes';
import Financial from '@/pages/Financial';
import Budget from '@/pages/Budget';
import Bot from '@/pages/Bot';

// Auth and Portal Imports
import Login from '@/pages/auth/Login';
import NotRegistered from '@/pages/auth/NotRegistered';
import PatientDashboard from '@/pages/patient-portal/PatientDashboard';
import PatientAppointments from '@/pages/patient-portal/PatientAppointments';
import PatientDocuments from '@/pages/patient-portal/PatientDocuments';
import PatientHistory from '@/pages/patient-portal/PatientHistory';
import PatientProfile from '@/pages/patient-portal/PatientProfile';

import { Toaster } from '@/components/ui/toaster';
import { useNotifications } from '@/contexts/NotificationContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Loader2, BellRing } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext'; 
import { useApi } from '@/contexts/ApiContext';

const BudgetNotificationHandler = () => {
    const { getBudgets } = useApi();
    const { addNotification } = useNotifications();
    const { user } = useAuth();

    useEffect(() => {
        const checkBudgets = async () => {
            if (user && user.user_metadata.role === 'secretary') { 
                const budgets = await getBudgets();
                if (!budgets) return;

                const now = new Date();
                budgets.forEach(budget => {
                    if (budget.status === 'pendente') {
                        const sentDate = new Date(budget.sentDate);
                        const diffDays = (now.getTime() - sentDate.getTime()) / (1000 * 3600 * 24);

                        if (diffDays >= 3 && diffDays < 4) {
                            addNotification({
                                title: 'Orçamento Pendente',
                                description: `Fazer follow-up com ${budget.patientName}. Orçamento enviado há 3 dias.`,
                                icon: <BellRing className="w-4 h-4 text-yellow-400" />,
                                targetRole: 'secretary',
                            });
                        }
                        else if (diffDays >= 10 && diffDays < 11) {
                            addNotification({
                                title: 'Orçamento Urgente',
                                description: `Orçamento para ${budget.patientName} pendente há 10 dias.`,
                                icon: <BellRing className="w-4 h-4 text-red-400" />,
                                targetRole: 'secretary',
                            });
                        }
                    }
                });
            }
        };

        const intervalId = setInterval(checkBudgets, 3600 * 1000);
        checkBudgets();

        return () => clearInterval(intervalId);
    }, [getBudgets, addNotification, user]);

    return null;
}

const AppRoutes = () => {
    const { user, loading } = useAuth();
    const isAuthenticated = !!user;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-900">
                <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <Routes>
            <Route path="/auth/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
            <Route path="/auth/nao-cadastrado" element={<NotRegistered />} />
            
            <Route path="/*" element={isAuthenticated ? <MainLayout /> : <Navigate to="/auth/login" />} />

            <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/auth/login"} />} />
        </Routes>
    );
};

const MainLayout = () => {
    const { user } = useAuth();
    const userRole = user?.user_metadata?.role;

    let defaultPath = '/admin/secretaria/dashboard'; // Default for secretary
    if (userRole === 'doctor') {
      defaultPath = '/admin/medico/dashboard';
    } else if (userRole === 'patient' || userRole === 'autorizado') {
      defaultPath = '/dashboard/paciente';
    }

    return (
        <Layout>
            <BudgetNotificationHandler />
            <Routes>
                <Route path="/" element={<Navigate to={defaultPath} replace />} />

                <Route path="/admin/secretaria/*" element={<ProtectedRoute roles={['secretary']}><SecretaryRoutes /></ProtectedRoute>} />
                
                <Route path="/admin/medico/*" element={<ProtectedRoute roles={['doctor']}><DoctorRoutes /></ProtectedRoute>} />

                <Route path="/dashboard/paciente/*" element={<ProtectedRoute roles={['patient', 'autorizado']}><PatientRoutes /></ProtectedRoute>} />
                
                <Route path="/admin/paciente/*" element={<Navigate to="/dashboard/paciente" replace />} />

                <Route path="/agenda" element={<ProtectedRoute roles={['secretary', 'doctor']}><Calendar /></ProtectedRoute>} />
                <Route path="/orcamento" element={<ProtectedRoute roles={['secretary']}><Budget /></ProtectedRoute>} />
                <Route path="/financeiro" element={<ProtectedRoute roles={['secretary']}><Financial /></ProtectedRoute>} />
                <Route path="/bot" element={<ProtectedRoute roles={['secretary']}><Bot /></ProtectedRoute>} />
                <Route path="/prontuario" element={<ProtectedRoute roles={['doctor']}><ClinicalNotes /></ProtectedRoute>} />
                
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

                <Route path="*" element={<Navigate to={defaultPath} />} />
            </Routes>
        </Layout>
    );
};

const SecretaryRoutes = () => (
    <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="pacientes" element={<Patients />} />
        <Route path="pacientes/:patientId" element={<PatientDetails />} />
        <Route path="mensagens" element={<Messages />} />
        <Route path="jornada" element={<PatientJourney />} />
        <Route path="leads" element={<Contacts />} />
        <Route path="prazos" element={<Deadlines />} />
        <Route path="protocolos" element={<Protocols />} />
        <Route path="*" element={<Navigate to="dashboard" />} />
    </Routes>
);

const DoctorRoutes = () => (
    <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="pacientes" element={<Patients />} />
        <Route path="pacientes/:patientId" element={<PatientDetails />} />
        <Route path="mensagens" element={<Messages />} />
        <Route path="*" element={<Navigate to="dashboard" />} />
    </Routes>
);

const PatientRoutes = () => (
    <Routes>
        <Route path="/" element={<PatientDashboard />} />
        <Route path="agendamentos" element={<PatientAppointments />} />
        <Route path="documentos" element={<PatientDocuments />} />
        <Route path="historico" element={<PatientHistory />} />
        <Route path="perfil" element={<PatientProfile />} />
        <Route path="*" element={<Navigate to="/" />} />
    </Routes>
);

function App() {
  return (
    <HelmetProvider>
        <Helmet>
            <title>Portal Clínico Unificado</title>
            <meta name="description" content="Sistema de gestão unificado para secretárias e médicos." />
        </Helmet>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900/50 text-white">
            <AppRoutes />
        </div>
        <Toaster />
    </HelmetProvider>
  );
}

export default App;

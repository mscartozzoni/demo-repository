
import React, { useState, useEffect, createContext, useContext, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import Patients from '@/pages/Patients';
import CadernoDigital from '@/pages/CadernoDigital';
import Journey from '@/pages/Journey';
import Evolution from '@/pages/Evolution';
import ProtocolConfig from '@/pages/ProtocolConfig';
import AdminConfig from '@/pages/AdminConfig';
import AgendaConfig from '@/pages/AgendaConfig';
import Actions from '@/pages/Actions';
import Messages from '@/pages/Messages';
import Agenda from '@/pages/Agenda';
import Teleconsultas from '@/pages/Teleconsultas';
import SchemaMapper from '@/pages/SchemaMapper';
import ProfilePage from '@/pages/Profile';
import TeamPage from '@/pages/Team';
import Blog from '@/pages/Blog';
import Analytics from '@/pages/Analytics';
import Financial from '@/pages/Financial';
import Documents from '@/pages/Documents';
import WebsiteBuilder from '@/pages/WebsiteBuilder';
import QrCodeGenerator from '@/pages/QrCodeGenerator';
import Products from '@/pages/Products';
import ErrorLogs from '@/pages/ErrorLogs';
import Storage from '@/pages/Storage';
import StorageManager from '@/pages/StorageManager';
import WordPressTroubleshooter from '@/pages/WordPressTroubleshooter';
import Firewall from '@/pages/Firewall';
import DatabaseOptimization from '@/pages/DatabaseOptimization';
import AIAudit from '@/pages/AIAudit';
import Orcamento from '@/pages/Orcamento';
import OrcamentoGestao from '@/pages/OrcamentoGestao';
import UserManagement from '@/pages/UserManagement';
import StatusPage from '@/pages/Status';
import Login from '@/pages/auth/Login';
import Callback from '@/pages/auth/Callback';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { SchemaProvider } from '@/contexts/SchemaContext';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { ShieldBan as BanIcon, Loader2 } from 'lucide-react';
import ClinicFlow from '@/pages/ClinicFlow';
import GoogleCalendarView from '@/pages/GoogleCalendarView';
import AssistenteIA from '@/pages/AssistenteIA';
import ErrorBoundary from '@/components/errors/ErrorBoundary';

const EmbeddedFinancialPage = lazy(() => import('./pages/EmbeddedFinancial'));

const ThemeContext = createContext(null);
export const useTheme = () => useContext(ThemeContext);
const LayoutConfigContext = createContext(null);
export const useLayoutConfig = () => useContext(LayoutConfigContext);

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'theme-default');
  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  return <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>;
};

const LayoutConfigProvider = ({ children }) => {
  const [headerStyle, setHeaderStyle] = useState(() => localStorage.getItem('headerStyle') || 'default');
  useEffect(() => {
    localStorage.setItem('headerStyle', headerStyle);
  }, [headerStyle]);
  return <LayoutConfigContext.Provider value={{ headerStyle, setHeaderStyle }}>
            {children}
        </LayoutConfigContext.Provider>;
};

const DisconnectedBanner = () => {
  const location = useLocation();
  const hideOnRoutes = ['/medico/clinic-flow', '/medico/financial', '/medico/assistente-ia', '/medico/google-calendar'];
  if (hideOnRoutes.includes(location.pathname)) {
    return null;
  }
  return <div className="bg-yellow-500/10 text-yellow-300 text-sm font-medium text-center p-2 flex items-center justify-center gap-2">
      <BanIcon className="w-4 h-4" />
      <span>Sistema Completo de Prontuário Médico funcionando!</span>
    </div>;
};

const LoadingFallback = () => (
    <div className="flex justify-center items-center h-screen bg-slate-900">
        <Loader2 className="animate-spin text-blue-500 h-16 w-16" />
    </div>
);

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingFallback />;
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }
  
  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
     return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingFallback />;
  }

  if (user && profile) {
    if (location.pathname === '/' || location.pathname.startsWith('/auth')) {
      switch (profile.role) {
        case 'medico':
          return <Navigate to="/medico" replace />;
        case 'secretaria':
          return <Navigate to="/secretaria" replace />;
        case 'paciente':
          return <Navigate to="/paciente" replace />;
        default:
          // Fallback for any other roles, or admin.
          return <Navigate to="/medico" replace />;
      }
    }
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/callback" element={<Callback />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />

      {/* Public Routes */}
      <Route path="/status" element={<StatusPage />} />
      <Route path="/financeiro-externo" element={
        <Suspense fallback={<LoadingFallback />}>
          <EmbeddedFinancialPage />
        </Suspense>
      } />
      
      {/* Root Redirect */}
      <Route path="/" element={<Navigate to="/auth/login" replace />} />

      {/* Medico Portal */}
      <Route path="/medico" element={<ProtectedRoute allowedRoles={['medico', 'admin']}><Layout><Navigate to="/medico/dashboard" replace /></Layout></ProtectedRoute>} />
      <Route path="/medico/*" element={
        <ProtectedRoute allowedRoles={['medico', 'admin']}>
          <Layout>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="agenda" element={<Agenda />} />
                <Route path="google-calendar" element={<GoogleCalendarView />} />
                <Route path="teleconsultas" element={<Teleconsultas />} />
                <Route path="prontuarios" element={<Patients />} />
                <Route path="prontuarios/:id" element={<CadernoDigital />} />
                <Route path="patients/:id/journey" element={<Journey />} />
                <Route path="patients/:id/evolution" element={<Evolution />} />
                <Route path="messages" element={<Messages />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="team" element={<TeamPage />} />
                <Route path="blog" element={<Blog />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="financial" element={<Financial />} />
                <Route path="clinic-flow" element={<ClinicFlow />} />
                <Route path="documents" element={<Documents />} />
                <Route path="website-builder" element={<WebsiteBuilder />} />
                <Route path="qr-code-generator" element={<QrCodeGenerator />} />
                <Route path="products" element={<Products />} />
                <Route path="protocol-config" element={<ProtocolConfig />} />
                <Route path="orcamento" element={<Orcamento />} />
                <Route path="orcamento-gestao" element={<OrcamentoGestao />} />
                <Route path="user-management" element={<UserManagement />} />
                <Route path="config" element={<AdminConfig />} />
                <Route path="config/agenda" element={<AgendaConfig />} />
                <Route path="actions" element={<Actions />} />
                <Route path="schema-mapper" element={<SchemaMapper />} />
                <Route path="error-logs" element={<ErrorLogs />} />
                <Route path="storage" element={<Storage />} />
                <Route path="storage-manager" element={<StorageManager />} />
                <Route path="wordpress-troubleshooter" element={<WordPressTroubleshooter />} />
                <Route path="firewall" element={<Firewall />} />
                <Route path="database-optimization" element={<DatabaseOptimization />} />
                <Route path="ai-audit" element={<AIAudit />} />
                <Route path="assistente-ia" element={<AssistenteIA />} />
              </Routes>
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Secretaria Portal */}
      <Route path="/secretaria" element={<ProtectedRoute allowedRoles={['secretaria']}><Layout><Navigate to="/secretaria/dashboard" replace /></Layout></ProtectedRoute>} />
      <Route path="/secretaria/*" element={
        <ProtectedRoute allowedRoles={['secretaria']}>
          <Layout>
            <Suspense fallback={<LoadingFallback />}>
                <Routes>
                    <Route path="dashboard" element={<div>Secretaria Dashboard</div>} />
                    <Route path="agenda" element={<Agenda />} />
                    <Route path="prontuarios" element={<Patients />} />
                    <Route path="messages" element={<Messages />} />
                </Routes>
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />

      {/* Paciente Portal */}
      <Route path="/paciente" element={<ProtectedRoute allowedRoles={['paciente']}><Layout><Navigate to="/paciente/dashboard" replace /></Layout></ProtectedRoute>} />
      <Route path="/paciente/*" element={
        <ProtectedRoute allowedRoles={['paciente']}>
          <Layout>
            <Suspense fallback={<LoadingFallback />}>
                <Routes>
                    <Route path="dashboard" element={<div>Paciente Dashboard</div>} />
                    <Route path="meus-agendamentos" element={<Agenda />} />
                    <Route path="meus-documentos" element={<Documents />} />
                </Routes>
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />

      {/* Unauthorized Page */}
      <Route path="/unauthorized" element={
          <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white">
              <BanIcon className="w-16 h-16 text-red-500 mb-4" />
              <h1 className="text-3xl font-bold">Acesso Negado</h1>
              <p className="text-slate-400">Você não tem permissão para acessar esta página.</p>
          </div>
      } />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to={user ? "/" : "/auth/login"} replace />} />
    </Routes>
  );
};


function App() {
  return (
    <Router>
      <ErrorBoundary>
        <ToastProvider>
          <AuthProvider>
            <SchemaProvider>
              <ThemeProvider>
                <LayoutConfigProvider>
                  <Helmet>
                    <title>Portal Clínico - Sistema de Gestão Médica</title>
                    <meta name="description" content="Sistema completo para gestão de pacientes, caderno digital e acompanhamento médico." />
                  </Helmet>
                  <DisconnectedBanner />
                  <Suspense fallback={<LoadingFallback />}>
                    <AppRoutes />
                  </Suspense>
                  <Toaster />
                </LayoutConfigProvider>
              </ThemeProvider>
            </SchemaProvider>
          </AuthProvider>
        </ToastProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;

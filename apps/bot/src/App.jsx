
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { DataProvider } from '@/contexts/DataContext';
import { AuthProvider, useAuth } from '@/contexts/auth/AuthContext';
import LoginScreen from '@/screens/LoginScreen';
import SignUpScreen from '@/screens/SignUpScreen';
import MainLayout from '@/components/MainLayout';
import Workspace from '@/screens/Workspace';
import AuditDashboard from '@/screens/AuditDashboard';
import Settings from '@/screens/Settings';
import ConversationHistory from '@/screens/ConversationHistory';
import Contacts from '@/screens/Contacts';
import PublicPortal from '@/screens/PublicPortal';
import IntegrationManual from '@/screens/IntegrationManual';
import PatientClinicScreen from '@/screens/PatientClinicScreen';
import PatientPortalScreen from '@/screens/PatientPortalScreen';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AnimatePresence } from 'framer-motion';
import PatientHubScreen from '@/screens/PatientHubScreen';
import EmailSenderScreen from '@/screens/EmailSenderScreen';
import AIScreen from '@/screens/AIScreen';
import PublicPatientPortal from './screens/PublicPatientPortal';

const ProtectedRoute = ({ children, adminOnly = false, allowedProfiles = [] }) => {
  const { session, loading, profile } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="aurora-effect"></div>
        <p className="text-white z-10">Carregando Sessão...</p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (!profile && !loading) {
     return <Navigate to="/login?error=no_profile" state={{ from: location }} replace />;
  }

  const userRole = profile?.role;

  if (adminOnly && userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  if (allowedProfiles.length > 0 && !allowedProfiles.includes(userRole)) {
     return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const location = useLocation();
  const { profile } = useAuth();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/signup" element={<SignUpScreen />} />
        <Route path="/portal-publico" element={<PublicPortal />} />
        <Route path="/portal/:patientId" element={<PublicPatientPortal />} />
        
        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route index element={<Workspace />} />
          <Route path="workspace" element={<Navigate to="/" replace />} />
          
          {/* Dynamic routes based on profile */}
          {profile?.role === 'admin' && (
            <>
              <Route path="ai-area" element={<AIScreen />} />
              <Route path="audit" element={<AuditDashboard />} />
              <Route path="settings" element={<Settings />} />
              <Route path="email-sender" element={<EmailSenderScreen />} />
              <Route path="docs/integration" element={<IntegrationManual />} />
              <Route path="paciente-portal" element={<PatientPortalScreen />} />
            </>
          )}
          
          <Route path="leads" element={<ProtectedRoute allowedProfiles={['admin', 'secretaria', 'receptionist']}><Contacts /></ProtectedRoute>} />
          <Route path="patients" element={<ProtectedRoute allowedProfiles={['admin', 'medico', 'secretaria']}><PatientHubScreen /></ProtectedRoute>} />
          <Route path="patient-clinic/:patientId" element={<ProtectedRoute allowedProfiles={['admin', 'medico', 'secretaria']}><PatientClinicScreen /></ProtectedRoute>} />
          <Route path="conversation/:contactId" element={<ProtectedRoute allowedProfiles={['admin', 'medico', 'secretaria', 'receptionist']}><ConversationHistory /></ProtectedRoute>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

const App = () => (
  <Router>
    <ThemeProvider>
      <HelmetProvider>
        <AuthProvider>
          <DataProvider>
            <AppRoutes />
            <Toaster />
          </DataProvider>
        </AuthProvider>
      </HelmetProvider>
    </ThemeProvider>
  </Router>
);

export default App;

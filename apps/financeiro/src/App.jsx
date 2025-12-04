import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import Patients from '@/pages/Patients';
import Budgets from '@/pages/Budgets';
import Finances from '@/pages/Finances';
import Investments from '@/pages/Investments';
import Messages from '@/pages/Messages';
import Protocols from '@/pages/Protocols';
import Journey from '@/pages/Journey';
import Services from '@/pages/Services';
import Invoices from '@/pages/Invoices';
import ProtectedRoute from '@/components/ProtectedRoute';
import NewBudgetWizard from '@/components/wizards/NewBudgetWizard'; // Keep for routing if needed

function App() {
  return (
    <>
      <Helmet>
        <title>Portal Financeiro</title>
        <meta name="description" content="Portal completo para gestão de orçamentos, finanças e crescimento da clínica médica estética" />
      </Helmet>
      
      <Routes>
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="patients" element={<Patients />} />
          <Route path="budgets" element={<Budgets />} />
          <Route path="messages" element={<Messages />} />
          <Route path="journey" element={<Journey />} />
          <Route path="finances" element={<Finances />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="services" element={<Services />} />
          <Route path="protocols" element={<Protocols />} />
          <Route path="investments" element={<Investments />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}

export default App;
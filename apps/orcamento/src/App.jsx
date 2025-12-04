import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useBackup } from '@/hooks/useBackup';

import MainLayout from '@/components/MainLayout';
import Dashboard from '@/components/Dashboard';
import Patients from '@/components/Patients';
import Appointments from '@/components/Appointments';
import Budgets from '@/components/Budgets';
import PriceTables from '@/components/PriceTables';
import SettingsPage from '@/components/SettingsPage';
import StorePage from '@/pages/StorePage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import SuccessPage from '@/pages/SuccessPage';

function App() {
  const location = useLocation();
  const { backupData, restoreBackup, createBackup, clearBackup, exportBackup, importBackup } = useBackup();
  
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [priceTables, setPriceTables] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [clinicProtocol, setClinicProtocol] = useState({});
  const [stripePromise, setStripePromise] = useState(null);
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme === 'dark';
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Load data from backup on initial mount
  useEffect(() => {
    const data = restoreBackup();
    if (data) {
      setPatients(data.patients || []);
      setAppointments(data.appointments || []);
      setBudgets(data.budgets || []);
      setPriceTables(data.priceTables || []);
      setTemplates(data.templates || []);
      setClinicProtocol(data.clinicProtocol || {});
    }
  }, []);

  // Update backup whenever data changes
  useEffect(() => {
    const dataToBackup = {
      patients,
      appointments,
      budgets,
      priceTables,
      templates,
      clinicProtocol,
    };
    // Avoid creating backup on initial empty state
    if (patients.length > 0 || appointments.length > 0 || budgets.length > 0 || priceTables.length > 0 || templates.length > 0 || Object.keys(clinicProtocol).length > 0) {
      createBackup(dataToBackup);
    }
  }, [patients, appointments, budgets, priceTables, templates, clinicProtocol]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (clinicProtocol && clinicProtocol.stripePk) {
      setStripePromise(loadStripe(clinicProtocol.stripePk));
    }
  }, [clinicProtocol.stripePk]);


  return (
    <>
      <Helmet>
        <title>MediBudget Pro - Orçamentos e Loja Online</title>
        <meta name="description" content="Sistema completo de gestão de orçamentos e loja online para procedimentos cirúrgicos e estéticos" />
      </Helmet>

      <Elements stripe={stripePromise}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard patients={patients} budgets={budgets} appointments={appointments} />} />
              <Route path="patients" element={<Patients patients={patients} setPatients={setPatients} />} />
              <Route path="appointments" element={<Appointments appointments={appointments} setAppointments={setAppointments} patients={patients} />} />
              <Route path="budgets" element={<Budgets budgets={budgets} setBudgets={setBudgets} patients={patients} priceTables={priceTables} templates={templates} clinicProtocol={clinicProtocol} appointments={appointments} />} />
              <Route path="prices" element={<PriceTables priceTables={priceTables} setPriceTables={setPriceTables} />} />
              <Route path="settings" element={<SettingsPage templates={templates} setTemplates={setTemplates} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} clinicProtocol={clinicProtocol} setClinicProtocol={setClinicProtocol} backupData={backupData} exportBackup={exportBackup} importBackup={importBackup} clearBackup={clearBackup} />} />
              <Route path="store" element={<StorePage />} />
              <Route path="product/:id" element={<ProductDetailPage />} />
              <Route path="success" element={<SuccessPage />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </Elements>
      <Toaster />
    </>
  );
}

export default App;
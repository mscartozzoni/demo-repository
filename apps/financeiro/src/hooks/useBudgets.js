import { useState, useEffect, useCallback } from 'react';

const mockBudgetsData = [
  { id: 'b1', patient_id: '1', created_at: '2025-10-22T10:00:00Z', total: 15000, status: 'approved', payment_status: 'paid', notes: 'Lipoaspiração de abdômen', surgery_date: '2025-11-15', patients: { id: '1', full_name: 'Ana Silva', email: 'ana.silva@example.com' }, invoices: [{id: 'i1', status: 'paid'}], services: { name: 'Lipoaspiração', type: 'surgical' } },
  { id: 'b2', patient_id: '2', created_at: '2025-10-21T11:30:00Z', total: 2500, status: 'sent', payment_status: 'pending', notes: 'Preenchimento labial', surgery_date: null, patients: { id: '2', full_name: 'Bruno Costa', email: 'bruno.costa@example.com' }, invoices: [], services: { name: 'Preenchimento', type: 'aesthetic' } },
  { id: 'b3', patient_id: '3', created_at: '2025-10-20T14:00:00Z', total: 22000, status: 'draft', payment_status: 'pending', notes: 'Prótese de Silicone', surgery_date: null, patients: { id: '3', full_name: 'Carla Dias', email: 'carla.dias@example.com' }, invoices: [], services: { name: 'Prótese de Silicone', type: 'surgical' } },
  { id: 'b4', patient_id: '4', created_at: '2025-10-19T09:00:00Z', total: 1800, status: 'canceled', payment_status: 'pending', notes: 'Toxina Botulínica', surgery_date: null, patients: { id: '4', full_name: 'Daniel Martins', email: 'daniel.martins@example.com' }, invoices: [], services: { name: 'Botox', type: 'aesthetic' } },
];

let mockBudgets = [...mockBudgetsData];

export const useBudgets = (filters = {}) => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBudgets = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      try {
        let data = [...mockBudgets];
        if (filters.search) {
          data = data.filter(b => b.patients.full_name.toLowerCase().includes(filters.search.toLowerCase()));
        }
        if (filters.status) {
          data = data.filter(b => b.status === filters.status);
        }
        if (filters.limit) {
          data = data.slice(0, filters.limit);
        }
        setBudgets(data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [filters.search, filters.status, filters.limit]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);
  
  const createBudget = useCallback(async (budgetData, returnData = false) => {
      await new Promise(res => setTimeout(res, 500)); // Simulate API call
      const newBudget = {
        ...budgetData,
        id: `b${Date.now()}`,
        created_at: new Date().toISOString(),
        status: budgetData.status || 'draft',
        payment_status: budgetData.payment_status || 'pending',
      };
      mockBudgets.unshift(newBudget);
      if (returnData) {
          return newBudget;
      }
  }, []);
  
  const updateBudgetStatus = useCallback(async (budgetId, status) => {
    await new Promise(res => setTimeout(res, 300));
    mockBudgets = mockBudgets.map(b => b.id === budgetId ? {...b, status} : b);
    fetchBudgets();
  }, [fetchBudgets]);

  return { budgets, loading, error, refetch: fetchBudgets, createBudget, updateBudgetStatus };
};

const mockHospitals = [
    { id: 'h1', name: 'Hospital Sírio-Libanês' },
    { id: 'h2', name: 'Hospital Albert Einstein' },
    { id: 'h3', name: 'Hospital do Coração (HCor)' },
];
const mockHospitalCosts = {
    's1': { 'h1': 5000, 'h2': 7000, 'h3': 4500 }, // Lipo
    's2': { 'h1': 8000, 'h2': 10000, 'h3': 7500 }, // Silicone
};

export const useHospitalData = () => {
    const getHospitalCost = (serviceId, hospitalId) => {
        return mockHospitalCosts[serviceId]?.[hospitalId] || 0;
    };
    return { hospitals: mockHospitals, getHospitalCost };
};
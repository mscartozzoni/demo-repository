import { useState, useEffect, useCallback } from 'react';

const mockReceivable = [
    { id: 'r1', description: 'Saldo Lipoaspiração - Ana Silva', amount_total: 7000, due_date: '2025-11-10', status: 'pending' },
    { id: 'r2', description: 'Entrada Botox - Bruno Costa', amount_total: 500, due_date: '2025-10-25', status: 'pending' },
    { id: 'r3', description: 'Parcela 2/3 Prótese - Carla Dias', amount_total: 5000, due_date: '2025-10-15', status: 'overdue' },
];

const mockPayable = [
    { id: 'p1', description: 'Aluguel da Clínica', amount_total: 8000, due_date: '2025-11-05', status: 'pending' },
    { id: 'p2', description: 'Fornecedor de Próteses', amount_total: 12000, due_date: '2025-10-28', status: 'pending' },
    { id: 'p3', description: 'Marketing Digital', amount_total: 3500, due_date: '2025-10-20', status: 'paid' },
];

export const useFinances = () => {
  const [receivable, setReceivable] = useState([]);
  const [payable, setPayable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFinances = useCallback(() => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      try {
        setReceivable(mockReceivable.filter(item => ['pending', 'overdue', 'partially_paid'].includes(item.status)));
        setPayable(mockPayable.filter(item => ['pending', 'overdue', 'partially_paid'].includes(item.status)));
      } catch (err) {
        console.error("Error fetching finances:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }, 500);
  }, []);

  useEffect(() => {
    fetchFinances();
  }, [fetchFinances]);

  return { receivable, payable, loading, error, refetch: fetchFinances };
};
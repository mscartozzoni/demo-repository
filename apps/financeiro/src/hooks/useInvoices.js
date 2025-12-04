import { useState, useEffect, useCallback } from 'react';

const mockInvoices = [
    { id: 'inv1', quote_id: 'b1', issue_date: '2025-10-22', due_date: '2025-11-13', amount: 7000, status: 'draft', created_at: '2025-10-22T10:05:00Z', patients: { full_name: 'Ana Silva' } },
    { id: 'inv2', quote_id: 'b2', issue_date: '2025-10-21', due_date: '2025-10-28', amount: 2500, status: 'open', created_at: '2025-10-21T11:35:00Z', patients: { full_name: 'Bruno Costa' } },
    { id: 'inv3', quote_id: 'b5', issue_date: '2025-09-15', due_date: '2025-09-22', amount: 18000, status: 'paid', created_at: '2025-09-15T14:00:00Z', patients: { full_name: 'Fernanda Lima' } },
    { id: 'inv4', quote_id: 'b6', issue_date: '2025-09-10', due_date: '2025-09-17', amount: 4000, status: 'overdue', created_at: '2025-09-10T16:00:00Z', patients: { full_name: 'Gustavo Pereira' } },
];

export const useInvoices = (filters = {}) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInvoices = useCallback(() => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      try {
        setInvoices(mockInvoices);
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }, 500);
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return { invoices, loading, error, refetch: fetchInvoices };
};
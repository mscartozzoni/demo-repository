import { useState, useCallback, useEffect } from 'react';

let mockPatients = [
  { id: '1', full_name: 'Ana Silva', email: 'ana.silva@example.com', phone: '(11) 98765-4321', document_id: '123.456.789-01', created_at: '2025-10-20T10:00:00Z' },
  { id: '2', full_name: 'Bruno Costa', email: 'bruno.costa@example.com', phone: '(21) 91234-5678', document_id: '234.567.890-12', created_at: '2025-10-19T11:00:00Z' },
  { id: '3', full_name: 'Carla Dias', email: 'carla.dias@example.com', phone: '(31) 95678-1234', document_id: '345.678.901-23', created_at: '2025-10-18T12:00:00Z' },
  { id: '4', full_name: 'Daniel Martins', email: 'daniel.martins@example.com', phone: '(41) 98765-8765', document_id: '456.789.012-34', created_at: '2025-10-17T13:00:00Z' },
  { id: '5', full_name: 'Eduarda Ferreira', email: 'eduarda.ferreira@example.com', phone: '(51) 91234-9876', document_id: '567.890.123-45', created_at: '2025-10-16T14:00:00Z' },
];

export const usePatients = (searchTermProp = '') => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchPatients = useCallback((searchTerm) => {
    setLoading(true);
    setError(null);
    
    setTimeout(() => {
      try {
        let data = [...mockPatients];
        if (searchTerm) {
          const lowercasedTerm = searchTerm.toLowerCase();
          data = data.filter(p =>
            p.full_name.toLowerCase().includes(lowercasedTerm) ||
            (p.document_id && p.document_id.includes(lowercasedTerm)) ||
            (p.email && p.email.toLowerCase().includes(lowercasedTerm))
          );
        }
        setPatients(data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      } catch (err) {
        console.error("Error filtering patients:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  const addPatient = (newPatientData) => {
    const newPatient = { 
        ...newPatientData, 
        id: `patient_${Date.now()}`,
        created_at: new Date().toISOString(),
    };
    mockPatients.unshift(newPatient);
    searchPatients(''); // Refreshes the list
    return newPatient;
  };

  const refetch = useCallback(() => {
    searchPatients(searchTermProp);
  }, [searchPatients, searchTermProp]);

  useEffect(() => {
    searchPatients(searchTermProp);
  }, [searchTermProp, searchPatients]);

  return { patients, loading, error, searchPatients, refetch, addPatient };
};
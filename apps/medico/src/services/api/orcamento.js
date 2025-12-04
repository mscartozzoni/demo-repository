import { handleApiError } from './utils';

let mockOrcamentos = [
    { id: 1, patient_id: 'patient-1', patient: { id: 'patient-1', name: 'Ana Silva' }, title: 'Rinoplastia', total_amount: 25000, status: 'sent', created_at: new Date().toISOString() },
    { id: 2, patient_id: 'patient-2', patient: { id: 'patient-2', name: 'Bruno Costa' }, title: 'Lipoaspiração', total_amount: 35000, status: 'approved', created_at: new Date().toISOString() },
    { id: 3, patient_id: 'patient-3', patient: { id: 'patient-3', name: 'Carla Dias' }, title: 'Prótese de Mama', total_amount: 30000, status: 'draft', created_at: new Date().toISOString() },
];
let nextId = 4;


export const getOrcamentos = async (patientId) => {
    console.warn("getOrcamentos is using mock data.");
    await new Promise(resolve => setTimeout(resolve, 600));
    
    if (patientId) {
        return mockOrcamentos.filter(o => o.patient_id === patientId);
    }
    return mockOrcamentos;
};

export const createOrcamento = async (orcamentoData) => {
    console.warn("createOrcamento is using mock data.");
    await new Promise(resolve => setTimeout(resolve, 300));
    const newOrcamento = { ...orcamentoData, id: nextId++, created_at: new Date().toISOString() };
    mockOrcamentos.push(newOrcamento);
    return [newOrcamento];
};
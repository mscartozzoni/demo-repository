import { handleApiError } from './utils';

export const getPatientEvolutionHistory = async (patientId, accessToken) => {
    console.warn("getPatientEvolutionHistory is using mock data.");
    
    const mockHistory = [
        { id: 'evo1', date: '2025-10-15T10:00:00Z', notes: 'Paciente refere melhora da dor. Edema diminuindo.', vitals: { weight: '68kg', edema: 'Leve', drainVolume: '20ml', painScale: [3] }, woundState: 'Cicatriz com bom aspecto, sem sinais de infecção.' },
        { id: 'evo2', date: '2025-10-12T11:30:00Z', notes: 'Queixa-se de dor moderada na área operada.', vitals: { weight: '69kg', edema: 'Moderado', drainVolume: '50ml', painScale: [6] }, woundState: 'Leve hiperemia perilesional.' },
    ];

    const mockPatients = [
        { id: '1', name: 'Ana Silva', procedure: 'Mamoplastia', surgeryDate: '2025-10-01', lastEvolution: '2025-10-15', nextAppointment: '2025-10-22', status: 'monitoring', vitals: { weight: '68kg', edema: 'Leve', drainVolume: '20ml', painScale: [3] }, woundState: 'Cicatriz com bom aspecto.', complaint: 'Leve desconforto ao dormir.' },
        { id: '2', name: 'Beatriz Costa', procedure: 'Abdominoplastia', surgeryDate: '2025-09-25', lastEvolution: '2025-10-14', nextAppointment: '2025-10-21', status: 'stable', vitals: { weight: '75kg', edema: 'Ausente', drainVolume: null, painScale: [1] }, woundState: 'Cicatriz normocrômica.', complaint: 'Nenhuma.' },
        { id: '3', name: 'Carla Dias', procedure: 'Rinoplastia', surgeryDate: '2025-10-10', lastEvolution: '2025-10-17', nextAppointment: '2025-10-24', status: 'pending', vitals: { weight: '55kg', edema: 'Moderado', drainVolume: null, painScale: [4] }, woundState: 'Edema nasal e equimose periorbital.', complaint: 'Dificuldade para respirar pelo nariz.' },
    ];

    if (patientId) {
        return new Promise(resolve => setTimeout(() => resolve({ success: true, data: mockHistory }), 500));
    }

    return new Promise(resolve => setTimeout(() => resolve({ success: true, data: mockPatients }), 500));
};
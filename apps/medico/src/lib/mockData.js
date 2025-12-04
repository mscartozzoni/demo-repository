
import { subDays, addDays, setHours, setMinutes } from 'date-fns';

const now = new Date();

export const mockPatientsData = [
  { 
    id: '1', 
    full_name: 'Ana Beatriz Costa', 
    email: 'ana.beatriz@example.com', 
    phone: '(11) 98765-4321', 
    created_at: subDays(now, 45).toISOString(),
    cpf: '111.222.333-44',
    date_of_birth: '1990-05-15',
    address: 'Rua das Flores, 123, São Paulo, SP',
    surgery_date: subDays(now, 15).toISOString(),
    first_contact_date: subDays(now, 60).toISOString(),
  },
  { 
    id: '2', 
    full_name: 'Carlos Eduardo Lima', 
    email: 'carlos.eduardo@example.com', 
    phone: '(21) 91234-5678', 
    created_at: subDays(now, 90).toISOString(),
    cpf: '222.333.444-55',
    date_of_birth: '1985-11-20',
    address: 'Avenida Copacabana, 456, Rio de Janeiro, RJ',
    surgery_date: subDays(now, 5).toISOString(),
    first_contact_date: subDays(now, 120).toISOString(),
  },
  { 
    id: '3', 
    full_name: 'Daniela Freitas Souza', 
    email: 'daniela.freitas@example.com', 
    phone: '(31) 99999-8888', 
    created_at: subDays(now, 15).toISOString(),
    cpf: '333.444.555-66',
    date_of_birth: '1995-02-10',
    address: 'Rua da Bahia, 789, Belo Horizonte, MG',
    surgery_date: addDays(now, 20).toISOString(),
    first_contact_date: subDays(now, 30).toISOString(),
  },
  { 
    id: '4', 
    full_name: 'Eduardo Pereira Alves', 
    email: 'eduardo.pereira@example.com', 
    phone: '(41) 98765-1234', 
    created_at: subDays(now, 5).toISOString(),
    cpf: '444.555.666-77',
    date_of_birth: '1988-09-30',
    address: 'Rua XV de Novembro, 101, Curitiba, PR',
    surgery_date: null,
    first_contact_date: subDays(now, 10).toISOString(),
  },
];

export const mockAppointmentsData = [
    { 
        id: 'appt_1', 
        appointment_time: setMinutes(setHours(now, 9), 0).toISOString(), 
        title: 'Consulta com Ana Beatriz Costa', 
        description: 'Retorno pós-operatório de 15 dias.',
        patient_id: '1',
        doctor_id: 'doc_1',
        starts_at: setMinutes(setHours(now, 9), 0).toISOString(),
        ends_at: setMinutes(setHours(now, 9), 30).toISOString(),
        status: 'completed',
    },
    { 
        id: 'appt_2', 
        appointment_time: setMinutes(setHours(now, 11), 30).toISOString(), 
        title: 'Teleconsulta com Eduardo Pereira', 
        description: 'Primeira avaliação para Rinoplastia.', 
        patient_id: '4',
        doctor_id: 'doc_1',
        starts_at: setMinutes(setHours(now, 11), 30).toISOString(),
        ends_at: setMinutes(setHours(now, 12), 0).toISOString(),
        status: 'scheduled',
    },
    { 
        id: 'appt_3', 
        appointment_time: setMinutes(setHours(addDays(now, 2), 14), 0).toISOString(), 
        title: 'Consulta pré-operatória', 
        description: 'Alinhamento final para cirurgia.', 
        patient_id: '3',
        doctor_id: 'doc_1',
        starts_at: setMinutes(setHours(addDays(now, 2), 14), 0).toISOString(),
        ends_at: setMinutes(setHours(addDays(now, 2), 14), 30).toISOString(),
        status: 'scheduled',
    },
];

export const mockSurgeriesData = [
    { 
        id: 'surg_1', 
        surgery_datetime: setHours(subDays(now, 5), 8).toISOString(), 
        procedure_name: 'Abdominoplastia', 
        patient_id: '2',
        doctor_id: 'doc_1',
        hospital_name: 'Hospital Vila Nova Star',
        status: 'completed'
    },
];

export const mockPersonalEventsData = [
    {
        id: 'pe_1',
        starts_at: setHours(addDays(now, 3), 18).toISOString(),
        ends_at: setHours(addDays(now, 3), 20).toISOString(),
        title: 'Congresso de Cirurgia Plástica',
        description: 'Participar da palestra sobre novas técnicas de reconstrução.',
        doctor_id: 'doc_1',
    }
];

export const mockJourneysData = [
  { 
    id: 'jour_1', 
    patient_id: '1', 
    protocol_name: 'Pós-operatório Rinoplastia',
    current_stage: 3,
    total_stages: 8,
    status: 'on-track',
    updated_at: subDays(now, 7).toISOString()
  },
  { 
    id: 'jour_2', 
    patient_id: '2',
    protocol_name: 'Pós-operatório Abdominoplastia',
    current_stage: 2,
    total_stages: 10,
    status: 'delayed',
    updated_at: subDays(now, 2).toISOString()
  },
  { 
    id: 'jour_3', 
    patient_id: '3',
    protocol_name: 'Pré-operatório Mamoplastia',
    current_stage: 2,
    total_stages: 5,
    status: 'on-track',
    updated_at: subDays(now, 3).toISOString()
  },
];

export const mockEvolutionData = [
    {
        id: 'evo_1',
        patient_id: '2',
        procedure: 'Abdominoplastia',
        status: 'monitoring',
        surgeryDate: subDays(now, 5).toISOString(),
        lastEvolution: subDays(now, 1).toISOString(),
        nextAppointment: addDays(now, 7).toISOString(),
        vitals: { weight: '84', edema: '2+', drainVolume: '50', painScale: [4] },
        woundState: 'Apresenta boa cicatrização, sem sinais de infecção.',
        complaint: 'Relata dor moderada na área da incisão.'
    },
    {
        id: 'evo_2',
        patient_id: '1',
        procedure: 'Rinoplastia',
        status: 'stable',
        surgeryDate: subDays(now, 15).toISOString(),
        lastEvolution: subDays(now, 2).toISOString(),
        nextAppointment: addDays(now, 15).toISOString(),
        vitals: { weight: '58', edema: '1+', drainVolume: '', painScale: [1] },
        woundState: 'Cicatriz com bom aspecto, sem rubor ou calor.',
        complaint: 'Respiração normalizada.'
    },
];

export const mockDocumentsData = [
    { id: 'doc_1', patient_id: '1', type: 'receita', title: 'Receita Pós-operatória', created_at: subDays(now, 15).toISOString(), status: 'finalizado' },
    { id: 'doc_2', patient_id: '3', type: 'exames', title: 'Solicitação de Exames Pré-Op', created_at: subDays(now, 25).toISOString(), status: 'finalizado' },
    { id: 'doc_3', patient_id: '1', type: 'atendimento', title: 'Ficha de Atendimento Inicial', created_at: subDays(now, 60).toISOString(), status: 'finalizado' },
    { id: 'doc_4', patient_id: '2', type: 'evolucao', title: 'Evolução Médica - 1º Retorno', created_at: subDays(now, 7).toISOString(), status: 'rascunho' },
];

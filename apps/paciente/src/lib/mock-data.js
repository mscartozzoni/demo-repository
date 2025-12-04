
import { v4 as uuidv4 } from 'uuid';

const now = new Date();
const todayDateString = now.toISOString().split('T')[0];
const yesterday = new Date();
yesterday.setDate(now.getDate() - 1);
const yesterdayDateString = yesterday.toISOString().split('T')[0];
const tomorrow = new Date();
tomorrow.setDate(now.getDate() + 1);
const tomorrowDateString = tomorrow.toISOString().split('T')[0];
const nextWeek = new Date();
nextWeek.setDate(now.getDate() + 7);
const nextWeekDateString = nextWeek.toISOString().split('T')[0];


const d = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
};

export const mockBudgets = [
    {
        id: `bud_${uuidv4()}`,
        patientId: 'patient-1',
        patientName: 'Ana Silva',
        consultationDate: d(5),
        sentDate: d(4),
        status: 'pendente',
        amount: 15000,
        procedure: 'Rinoplastia',
    },
    {
        id: `bud_${uuidv4()}`,
        patientId: 'patient-2',
        patientName: 'Bruno Costa',
        consultationDate: d(12),
        sentDate: d(11),
        status: 'aceito',
        amount: 25000,
        procedure: 'Lipoaspiração HD',
    },
    {
        id: `bud_${uuidv4()}`,
        patientId: 'patient-3',
        patientName: 'Carla Dias',
        consultationDate: d(20),
        sentDate: d(15),
        status: 'recusado',
        amount: 18000,
        procedure: 'Mamoplastia',
    },
    {
        id: `bud_${uuidv4()}`,
        patientId: 'contact-1',
        patientName: 'Helena Souza',
        consultationDate: d(2),
        sentDate: d(1),
        status: 'pendente',
        amount: 9000,
        procedure: 'Blefaroplastia',
    }
];

export const mockPatients = [
    { id: 'patient-1', full_name: 'Ana Silva', email: 'paciente@example.com', phone: '(11) 98765-4321', status: 'active', birthdate: '1990-05-15', cpf: '123.456.789-00', address: 'Rua das Flores, 123, São Paulo, SP', created_at: d(30) },
    { id: 'patient-2', full_name: 'Bruno Costa', email: 'bruno.costa@example.com', phone: '(21) 91234-5678', status: 'active', birthdate: '1985-11-20', cpf: '987.654.321-00', address: 'Av. Principal, 456', created_at: d(45) },
    { id: 'patient-3', full_name: 'Carla Dias', email: 'carla.dias@example.com', phone: '(31) 95555-8888', status: 'inactive', birthdate: null, cpf: null, address: 'Praça Central, 789', created_at: d(60) },
];

export const mockLeads = [
    { id: 'lead-1', full_name: 'Fernanda Lima', email: 'fernanda.lima@email.com', phone: '(41) 98877-6655', interest: 'Rinoplastia', status: 'new', source: 'Instagram', created_at: '2025-10-22T10:00:00Z' },
    { id: 'lead-2', full_name: 'Gustavo Martins', email: 'gustavo.martins@email.com', phone: '(51) 99988-7766', interest: 'Lipoaspiração', status: 'contacted', source: 'Google', created_at: '2025-10-21T15:30:00Z' },
];

const createAppt = (id, patient_id, dateTime, visit_type, type, status, other = {}) => {
    return {
        id,
        patient_id,
        start_at: dateTime,
        appointment_time: dateTime,
        end_at: new Date(new Date(dateTime).getTime() + 30 * 60 * 1000).toISOString(),
        visit_type,
        type,
        status,
        ...other
    }
}

export const mockAppointments = [
    // Past appointments for patient-1
    createAppt('appt-past-p1-1', 'patient-1', `${d(30)}T10:00:00`, 'Primeira Avaliação', 'consultation', 'realizada', { doctor: 'Dr. Carlos Andrade', notes: 'Paciente interessada em rinoplastia.' }),
    createAppt('appt-past-p1-2', 'patient-1', `${d(15)}T11:00:00`, 'Entrega de Exames', 'consultation', 'realizada', { doctor: 'Dr. Carlos Andrade', notes: 'Exames pré-operatórios OK.' }),
    createAppt('appt-past-p1-3', 'patient-1', `${d(5)}T14:00:00`, 'Consulta Anestésica', 'consultation', 'realizada', { doctor: 'Dr. Anestesista', notes: 'Paciente apta para cirurgia.' }),
    createAppt('appt-past-p1-4', 'patient-1', `${yesterdayDateString}T09:00:00`, 'Dúvidas Finais', 'consultation', 'realizada', { doctor: 'Dr. Carlos Andrade' }),
    
    createAppt('appt-past-1', 'patient-3', `${yesterdayDateString}T10:00:00`, 'Avaliação', 'consultation', 'realizada'),
    
    // Today's appointments
    createAppt('appt-1', 'patient-2', `${todayDateString}T10:00:00`, 'Avaliação', 'consultation', 'agendado', { reason: 'Primeira avaliação para Lipo HD' }),
    createAppt('appt-2', 'patient-3', `${todayDateString}T11:30:00`, 'Retorno', 'consultation', 'realizada'),
    createAppt('appt-4', 'contact-1', `${todayDateString}T14:00:00`, 'Consulta Online', 'consultation', 'agendado'),
    createAppt('appt-conflict', 'patient-2', `${todayDateString}T15:00:00`, 'Avaliação', 'consultation', 'agendado'),

    // Future appointments for patient-1
    createAppt('appt-future-p1-1', 'patient-1', `${tomorrowDateString}T08:00:00`, 'Cirurgia de Rinoplastia', 'surgery', 'agendado', { end_at: `${tomorrowDateString}T11:00:00`, doctor: 'Dr. Carlos Andrade', location: 'Hospital Sírio-Libanês' }),
    createAppt('appt-future-p1-2', 'patient-1', `${nextWeekDateString}T16:00:00`, 'Retorno Pós-cirúrgico', 'consultation', 'agendado', { doctor: 'Dr. Carlos Andrade', location: 'Consultório Principal' }),
    createAppt('appt-future-p1-3', 'patient-1', `${d(-30)}T10:00:00`, 'Retorno 30 dias', 'consultation', 'agendado', { doctor: 'Dr. Carlos Andrade', location: 'Consultório Principal' }),
];

export const mockJourneyStages = [
    { id: 'stage-1-1', journey_id: 'journey-1', stage_name: 'Consulta Pré-operatória', status: 'completed', due_date: d(10), created_at: d(20), order: 1, completed_at: d(10) },
    { id: 'stage-1-2', journey_id: 'journey-1', stage_name: 'Realização da Cirurgia', status: 'in_progress', due_date: tomorrowDateString, created_at: d(20), order: 2, completed_at: null, notes:"Falar com hospital sobre preparo" },
    { id: 'stage-1-3', journey_id: 'journey-1', stage_name: 'Retorno 7 dias', status: 'pending', due_date: d(-7), created_at: d(20), order: 3, completed_at: null },
];

export const mockJourneys = [
    {
        id: 'journey-1',
        patient_id: 'patient-1',
        title: 'Protocolo Pós-Rinoplastia',
        status: 'in_progress',
        start_date: d(20),
        current_stage: 'Realização da Cirurgia',
    },
];

export const mockHospitals = [
    { id: 'hosp-1', name: 'Hospital Sírio-Libanês' },
    { id: 'hosp-2', name: 'Hospital Albert Einstein' },
    { id: 'hosp-3', name: 'Hospital Vila Nova Star' },
];

export const mockSurgeryTypes = [
    { value: 'Rinoplastia' },
    { value: 'Mamoplastia' },
    { value: 'Lipoaspiração' },
];

export const mockEmployees = [];

export const mockProtocols = [
    { id: 'proto-1', name: 'Protocolo Pós-Rinoplastia', stages: [{ stage_name: 'Consulta Pré-operatória' }, { stage_name: 'Realização da Cirurgia' }, { stage_name: 'Retorno 7 dias' }] },
    { id: 'proto-2', name: 'Protocolo Lipo HD', stages: [{ stage_name: 'Avaliação Física' }, { stage_name: 'Exames Pré-operatórios' }, { stage_name: 'Cirurgia' }] },
];

export const mockAppointmentTypes = [
    { id: 'type-1', visit_type: 'Consulta de Avaliação', duration_minutes: 30, is_online: false },
    { id: 'type-2', visit_type: 'Consulta de Retorno', duration_minutes: 20, is_online: false },
    { id: 'type-3', visit_type: 'Consulta Online', duration_minutes: 25, is_online: true },
];

export const mockContacts = [
    { id: 'contact-1', name: 'Helena Souza', full_name: 'Helena Souza', email: 'helena.s@email.com', phone: '(11) 98765-1111', reason: 'Interesse em blefaroplastia', status: 'new', created_at: d(5) },
    { id: 'contact-2', name: 'Igor Nobre', full_name: 'Igor Nobre', email: 'igor.nobre@email.com', phone: '(21) 91234-2222', reason: 'Dúvidas sobre recuperação', status: 'contacted', created_at: d(8) },
];

export const mockConversations = [
    { id: 'convo-1', summary: 'Reagendamento de consulta...', status: 'open', last_message_at: '2025-10-23T11:05:00Z', participant: { id: 'patient-1', full_name: 'Ana Silva', email: 'ana.silva@example.com' }, unread_count: 0 },
    { id: 'convo-2', summary: 'Assistente: Olá! Como posso ajudar?', status: 'bot', last_message_at: '2025-10-23T10:30:00Z', participant: { id: 'contact-1', full_name: 'Helena Souza', email: 'helena.s@email.com' }, unread_count: 1 },
];

export const mockMessages = [
    { id: uuidv4(), conversation_id: 'convo-1', content: 'Olá, gostaria de reagendar minha consulta.', sender_role: 'patient', created_at: '2025-10-23T11:00:00Z' },
    { id: uuidv4(), conversation_id: 'convo-1', content: 'Claro, Ana! Para qual data gostaria de verificar a disponibilidade?', sender_role: 'secretary', created_at: '2025-10-23T11:05:00Z' },
    { id: uuidv4(), conversation_id: 'convo-2', content: 'Olá! Como posso ajudar?', sender_role: 'bot', created_at: '2025-10-23T10:30:00Z' },
];

export const mockNotifications = [
    { id: uuidv4(), type: 'new_email', message: 'Novo email de Laboratório Exemplo', created_at: new Date().toISOString(), read: false },
    { id: uuidv4(), type: 'patient_created', message: 'Novo Paciente Cadastrado: Bruno Costa', created_at: '2025-10-23T11:30:00Z', read: false },
    { id: uuidv4(), type: 'new_lead', message: 'Novo Lead: Helena Souza', created_at: '2025-10-22T14:00:00Z', read: true },
];

export const mockEmailLogs = [
    { id: uuidv4(), to_email: 'ana.silva@example.com', subject: 'Confirmação de Consulta', status: 'delivered', created_at: '2025-10-20T09:00:00Z' },
    { id: uuidv4(), to_email: 'bruno.costa@example.com', subject: 'Lembrete de Retorno', status: 'sent', created_at: '2025-10-22T15:00:00Z' },
];

export const mockEmails = [
    {
        id: uuidv4(),
        from: { name: 'Laboratório Exemplo', address: 'resultados@labexemplo.com' },
        to: [{ name: 'Clínica', address: 'clinica@mscartozzoni.com.br' }],
        subject: 'Resultado de Exame: Ana Silva',
        snippet: 'Prezados, segue em anexo o resultado dos exames pré-operatórios da paciente Ana Silva.',
        body: '<div><p>Prezados, segue em anexo o resultado dos exames pré-operatórios da paciente Ana Silva.</p><p>Atenciosamente,<br/>Equipe Laboratório Exemplo</p></div>',
        timestamp: new Date(new Date().setHours(now.getHours() - 1)).toISOString(),
        isRead: false,
        folder: 'inbox',
    },
    {
        id: uuidv4(),
        from: { name: 'Carla Dias', address: 'carla.dias@example.com' },
        to: [{ name: 'Clínica', address: 'clinica@mscartozzoni.com.br' }],
        subject: 'Re: Dúvidas sobre o pós-operatório',
        snippet: 'Muito obrigada pelo rápido retorno! Tenho mais uma pergunta sobre a medicação...',
        body: '<div><p>Muito obrigada pelo rápido retorno! Tenho mais uma pergunta sobre a medicação. O analgésico X pode ser substituído pelo Y?</p><p>Abraços,<br/>Carla</p></div>',
        timestamp: new Date(new Date().setDate(now.getDate() - 1)).toISOString(),
        isRead: true,
        folder: 'inbox',
    },
    {
        id: uuidv4(),
        from: { name: 'Clínica', address: 'clinica@mscartozzoni.com.br' },
        to: [{ name: 'Ana Silva', address: 'ana.silva@example.com' }],
        subject: 'Confirmação de Cirurgia',
        snippet: 'Sua cirurgia está confirmada para o dia 26/11/2025 às 08:00.',
        body: '<div><p>Prezada Ana, sua cirurgia está confirmada para o dia 26/11/2025 às 08:00 no Hospital Sírio-Libanês. Por favor, chegue com 2 horas de antecedência.</p></div>',
        timestamp: new Date(new Date().setDate(now.getDate() - 2)).toISOString(),
        isRead: true,
        folder: 'sent',
    },
];

export const mockPatientDocuments = {
    'patient-1': [
        { id: 'doc-1', title: 'Exames de Sangue Pré-operatórios', type: 'Exame Laboratorial', date: d(15), url: '#' },
        { id: 'doc-2', title: 'Avaliação Cardiológica', type: 'Laudo Médico', date: d(14), url: '#' },
        { id: 'doc-3', title: 'Receita Pós-operatório', type: 'Receita Médica', date: d(1), url: '#' },
        { id: 'doc-4', title: 'Termo de Consentimento (Rinoplastia)', type: 'Documento', date: d(10), url: '#' },
    ]
};

export const mockMedicalHistory = {
    'patient-1': [
        { id: 'hist-1', date: d(30), title: 'Primeira Avaliação', doctor: 'Dr. Carlos Andrade', summary: 'Paciente queixa-se de desconforto estético nasal e leve dificuldade respiratória. Planejada rinoplastia funcional e estética.' },
        { id: 'hist-2', date: d(15), title: 'Entrega de Exames', doctor: 'Dr. Carlos Andrade', summary: 'Exames pré-operatórios dentro da normalidade. Risco cirúrgico baixo.' },
        { id: 'hist-3', date: d(5), title: 'Consulta Anestésica', doctor: 'Dr. Anestesista', summary: 'Paciente avaliada e liberada para o procedimento sob anestesia geral.' },
    ]
};

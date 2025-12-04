
const clinic_id = 'clinic_123';

const mockStaffs = [
  {
    id: 'staff_admin_01',
    clinic_id,
    name: 'Admin Master',
    profile: 'Admin',
    sector: 'Administrativo',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?u=adminmaster'
  },
  {
    id: 'staff_medico_01',
    clinic_id,
    name: 'Dr. House',
    profile: 'Médico',
    sector: 'Atendimento',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?u=drhouse'
  },
  {
    id: 'staff_secretaria_01',
    clinic_id,
    name: 'Secretária Beth',
    profile: 'Secretária',
    sector: 'Agendamento',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?u=beth'
  }
];

const mockPatients = [
  {
    id: 'patient_1',
    clinic_id,
    full_name: "Maria Silva",
    phone: "5511987654321",
    email: "maria.silva@example.com",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'patient_2',
    clinic_id,
    full_name: "João Santos",
    phone: "5521912345678",
    email: "joao.santos@example.com",
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'patient_3',
    clinic_id,
    full_name: "Ana Costa",
    phone: "5531988887777",
    email: "ana.costa@example.com",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const mockMessages = [
  {
    id: 'msg_1',
    clinic_id,
    patient_id: "patient_1",
    content: "Gostaria de agendar uma consulta para próxima semana",
    type: 'communication',
    from_contact: true,
    user_id: null,
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: 'msg_2',
    clinic_id,
    patient_id: "patient_1",
    content: "Olá Maria, claro! Temos horários disponíveis na terça-feira às 10h.",
    type: 'communication',
    from_contact: false,
    user_id: 'staff_secretaria_01',
    created_at: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: 'msg_3',
    clinic_id,
    patient_id: "patient_2",
    content: "Qual o valor da consulta de cardiologia?",
    type: 'communication',
    from_contact: true,
    user_id: null,
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    read: false,
  }
];

const mockAppointments = [
    {
        id: 'appt_1',
        clinic_id,
        patient_id: 'patient_1',
        staff_id: 'staff_medico_01',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'confirmed', // scheduled, confirmed, cancelled, completed
        notes: 'Primeira consulta de rotina.'
    }
];

const mockBudgets = [
    {
        id: 'budget_1',
        clinic_id,
        patient_id: 'patient_2',
        staff_id: 'staff_secretaria_01',
        amount: 450.00,
        service: 'Consulta Cardiologia + Eletrocardiograma',
        status: 'sent', // draft, sent, approved, rejected
        created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString()
    }
];

const mockSurgeries = [];
const mockDocuments = [
    {
        id: 'doc_1',
        clinic_id,
        patient_id: 'patient_1',
        title: 'Resultados Exame de Sangue',
        url: '/documents/patient_1/blood_test_results.pdf',
        type: 'lab_result',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    }
];

const mockSystemLogs = [
  {
    id: 1,
    clinic_id,
    created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    user: { name: "Admin Master" },
    action: "Login",
    details: "Usuário 'Admin Master' logou no sistema.",
  },
];

const mockTags = [
    // Fluxo de Consulta
    { id: 'tag_consulta', name: "#consulta", color: "bg-blue-500" },
    { id: 'tag_agendada', name: "#agendada", color: "bg-cyan-500" },
    { id: 'tag_confirmada', name: "#confirmada", color: "bg-teal-500" },
    { id: 'tag_realizada', name: "#realizada", color: "bg-green-500" },

    // Fluxo de Orçamento
    { id: 'tag_orcamento', name: "#orcamento", color: "bg-yellow-500" },
    { id: 'tag_enviado', name: "#enviado", color: "bg-amber-500" },
    { id: 'tag_aceito', name: "#aceito", color: "bg-lime-500" },

    // Fluxo de Pagamento
    { id: 'tag_pagamento', name: "#pagamento", color: "bg-orange-500" },
    { id: 'tag_parcial', name: "#parcial", color: "bg-red-500" },
    { id: 'tag_total', name: "#total", color: "bg-pink-500" },
    
    // Fluxo de Cirurgia
    { id: 'tag_cirurgia', name: "#cirurgia", color: "bg-indigo-500" },
    { id: 'tag_cirurgia_agendada', name: "#cirurgia-agendada", color: "bg-violet-500" },
    { id: 'tag_cirurgia_confirmada', name: "#cirurgia-confirmada", color: "bg-fuchsia-500" },
    { id: 'tag_cirurgia_realizada', name: "#cirurgia-realizada", color: "bg-purple-500" },
];


const mockConversations = [
  {
    patient_id: 'patient_1',
    priority: 'media',
    tags: ['tag_consulta']
  },
  {
    patient_id: 'patient_2',
    priority: 'alta',
    tags: []
  },
  {
    patient_id: 'patient_3',
    priority: 'baixa',
    tags: []
  }
];

const mockSettings = {
    apiKey: 'mock-api-key-12345',
    externalIdParam: 'patient_id',
    openaiApiKey: '',
    openaiModel: 'gpt-4',
};

const mockEmailLogs = [];

const mockMailboxes = [
    {
        id: 'mailbox_1',
        email: 'secretaria@marcioplasticsurgery.com',
        functions: [
            { name: 'Agendamento de Consulta', tags: ['tag_consulta', 'tag_agendada', 'tag_confirmada', 'tag_realizada'] }
        ]
    },
    {
        id: 'mailbox_2',
        email: 'medico@marcioplasticsurgery.com',
        functions: [
             { name: 'Orçamento', tags: ['tag_orcamento', 'tag_enviado', 'tag_aceito'] }
        ]
    },
    {
        id: 'mailbox_3',
        email: 'financeiro@marcioplasticsurgery.com',
        functions: [
            { name: 'Pagamentos', tags: ['tag_aceito', 'tag_pagamento', 'tag_parcial', 'tag_total'] },
            { name: 'Agendamento de Cirurgia', tags: ['tag_pagamento', 'tag_parcial', 'tag_total', 'tag_cirurgia', 'tag_cirurgia_agendada', 'tag_cirurgia_confirmada', 'tag_cirurgia_realizada'] }
        ]
    }
];


const mockPatientJourneys = [
    {
        patient_id: 'patient_1',
        tags: [
            { tagId: 'tag_consulta', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
            { tagId: 'tag_agendada', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
            { tagId: 'tag_confirmada', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
        ]
    },
    {
        patient_id: 'patient_2',
        tags: [
             { tagId: 'tag_consulta', timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() }
        ]
    }
];

const view_patient_data = mockPatients.map(patient => ({
    ...patient,
    messages: mockMessages.filter(m => m.patient_id === patient.id),
    appointments: mockAppointments.filter(a => a.patient_id === patient.id),
    budgets: mockBudgets.filter(b => b.patient_id === patient.id),
    documents: mockDocuments.filter(d => d.patient_id === patient.id),
    surgeries: mockSurgeries.filter(s => s.patient_id === patient.id),
}));


export const initialMockData = {
  clinic_id,
  staffs: mockStaffs,
  patients: mockPatients,
  messages: mockMessages,
  appointments: mockAppointments,
  budgets: mockBudgets,
  surgeries: mockSurgeries,
  documents: mockDocuments,
  tags: mockTags,
  conversations: mockConversations,
  systemLogs: mockSystemLogs,
  settings: mockSettings,
  emailLogs: mockEmailLogs,
  mailboxes: mockMailboxes,
  patientJourneys: mockPatientJourneys,
  view_patient_data: view_patient_data
};

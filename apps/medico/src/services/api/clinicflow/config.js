// @/services/api/clinicflow/config.js

/**
 * @file Arquivo de configuração para os endpoints da API ClinicFlow.
 * Define a estrutura, métodos e caminhos para todas as operações de banco de dados.
 * Estes caminhos são relativos à Edge Function 'clinic-flow'.
 */

export const clinicFlowApiConfig = {
  // A URL base é o nome da Edge Function
  baseUrl: 'clinic-flow',
  endpoints: {
    // --- Pacientes ---
    getPatients: {
      method: 'GET',
      path: '/patients',
      description: 'Recupera a lista de todos os pacientes.',
    },
    getPatientById: {
      method: 'GET',
      path: '/patients/{patientId}',
      description: 'Recupera os detalhes de um paciente específico.',
    },
    createPatient: {
      method: 'POST',
      path: '/patients',
      description: 'Cria um novo registro de paciente.',
    },
    updatePatient: {
      method: 'PUT',
      path: '/patients/{patientId}',
      description: 'Atualiza os dados de um paciente existente.',
    },
    deletePatient: {
      method: 'DELETE',
      path: '/patients/{patientId}',
      description: 'Remove um paciente do banco de dados.',
    },

    // --- Agendamentos ---
    getAppointments: {
      method: 'GET',
      path: '/appointments',
    },
    createAppointment: {
      method: 'POST',
      path: '/appointments',
    },
    updateAppointment: {
      method: 'PUT',
      path: '/appointments/{appointmentId}',
    },
    deleteAppointment: {
      method: 'DELETE',
      path: '/appointments/{appointmentId}',
    },

    // --- Documentos (Prontuários, etc) ---
    getDocuments: {
      method: 'GET',
      path: '/documents',
    },
    createDocument: {
      method: 'POST',
      path: '/documents',
    },
    updateDocument: {
      method: 'PUT',
      path: '/documents/{documentId}',
    },
    deleteDocument: {
      method: 'DELETE',
      path: '/documents/{documentId}',
    },

    // --- Prescrições ---
    getPrescriptions: {
      method: 'GET',
      path: '/prescriptions',
    },
    createPrescription: {
      method: 'POST',
      path: '/prescriptions',
    },
    updatePrescription: {
      method: 'PUT',
      path: '/prescriptions/{prescriptionId}',
    },
    deletePrescription: {
      method: 'DELETE',
      path: '/prescriptions/{prescriptionId}',
    },

    // --- Exames ---
    getExams: {
      method: 'GET',
      path: '/exams',
    },
    createExam: {
      method: 'POST',
      path: '/exams',
    },
    updateExam: {
      method: 'PUT',
      path: '/exams/{examId}',
    },
    deleteExam: {
      method: 'DELETE',
      path: '/exams/{examId}',
    },
  },
};
import { handleApiError } from './utils';

// This is a mock implementation that uses a helper function to simulate fetching data.
const mockConversationsData = (userId) => [
  {
    id: 1,
    participant: { id: 'patient-1', name: 'Ana Beatriz Costa', avatar: 'https://i.pravatar.cc/150?u=patient1', phone: '5511987654321' },
    unread: 2,
    messages: [
      { id: 101, sender_id: 'patient-1', sender_name: 'Ana Beatriz Costa', content: 'Doutor, estou sentindo um pouco de dor na área da cirurgia, é normal?', timestamp: new Date(Date.now() - 86400000).toISOString() },
      { id: 102, sender_id: userId, sender_name: 'Dr. Usuário', content: 'Olá Ana, um pouco de desconforto é esperado. A dor é intensa?', timestamp: new Date(Date.now() - 86000000).toISOString() },
      { id: 103, sender_id: 'patient-1', sender_name: 'Ana Beatriz Costa', content: 'Não muito, mas queria saber se posso tomar o analgésico.', timestamp: new Date(Date.now() - 3600000).toISOString() },
    ],
  },
  {
    id: 2,
    participant: { id: 'team-1', name: 'Equipe de Enfermagem', avatar: 'https://i.pravatar.cc/150?u=team1' },
    unread: 1,
    messages: [
      { id: 201, sender_id: 'team-1', sender_name: 'Enf. Joana', content: 'Dr. Márcio, os exames pré-operatórios da paciente Daniela Freitas estão prontos.', timestamp: new Date(Date.now() - 172800000).toISOString() },
    ],
  },
  {
    id: 3,
    participant: { id: 'patient-2', name: 'Carlos Eduardo Lima', avatar: 'https://i.pravatar.cc/150?u=patient2', phone: '5521912345678' },
    unread: 0,
    messages: [
      { id: 301, sender_id: 'patient-2', sender_name: 'Carlos Eduardo Lima', content: 'Obrigado por ligar, doutor. Estou me sentindo melhor.', timestamp: new Date(Date.now() - 259200000).toISOString() },
      { id: 302, sender_id: userId, sender_name: 'Dr. Usuário', content: 'Que bom! Qualquer coisa, pode me chamar por aqui.', timestamp: new Date(Date.now() - 259000000).toISOString() },
    ],
  },
];


export const getConversations = async (userId) => {
    console.warn("getConversations is using mock data.");
    
    // Simulating an API call with a delay
    return new Promise(resolve => {
        setTimeout(() => {
            if (!userId) {
                // Return an empty array or an error if no user is logged in
                resolve({ success: true, data: [] });
                return;
            }
            const data = mockConversationsData(userId);
            resolve({ success: true, data });
        }, 1000);
    });
};
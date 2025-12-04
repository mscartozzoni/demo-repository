
import { handleApiError } from '@/services/api/utils';

export const getRecentActivities = async () => {
    console.warn("getRecentActivities is using mock data.");
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockData = [
        { id: 1, changed_at: new Date().toISOString(), description: 'Paciente Ana Silva atualizada.' },
        { id: 2, changed_at: new Date().toISOString(), description: 'Novo agendamento criado.' },
    ];
    return { success: true, data: mockData };
};

export const createWherebyMeeting = async (meetingData) => {
    console.warn("createWherebyMeeting is not fully implemented. Using mock data.", meetingData);
    const randomId = Math.random().toString(36).substring(7);
    return { success: true, data: { roomUrl: `https://marcioplasticsurgery.whereby.com/exemplo-${randomId}` } };
};

export const sendMessage = async (messageData) => {
    console.warn("sendMessage is not fully implemented.", messageData);
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 500));
};

export const sendEmail = async (emailData) => {
    console.warn("sendEmail is not fully implemented.", emailData);
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 500));
};

import { handleApiError } from './utils';

const MOCK_PROTOCOL = {
    id: 'proto_default_123',
    name: 'Protocolo Padrão de Cirurgia Plástica',
    description: 'Um protocolo base para acompanhamento de pacientes.',
    doctor_id: 'user_id_placeholder', // This would be dynamic in a real scenario
    protocol_stages: [
        { id: 'stage_1', name: 'Consulta Inicial', order: 1, duration_days: 0, description: 'Primeiro contato e avaliação do paciente.' },
        { id: 'stage_2', name: 'Consulta Pré-Operatória', order: 2, duration_days: 14, description: 'Exames e instruções pré-cirurgia.' },
        { id: 'stage_3', name: 'Dia da Cirurgia', order: 3, duration_days: 1, description: 'Realização do procedimento cirúrgico.' },
        { id: 'stage_4', name: 'Retorno Pós-Operatório (7 dias)', order: 4, duration_days: 7, description: 'Avaliação inicial da recuperação.' },
        { id: 'stage_5', name: 'Retorno Pós-Operatório (30 dias)', order: 5, duration_days: 30, description: 'Acompanhamento de longo prazo.' }
    ]
};

export const getDefaultProtocol = async (doctorId) => {
    console.warn("getDefaultProtocol is using mock data.");
    return new Promise(resolve => setTimeout(() => resolve(MOCK_PROTOCOL), 500));
};

export const addProtocolStage = async (stageData) => {
    console.warn("addProtocolStage is using mock data.");
    const newStage = { ...stageData, id: `stage_${Date.now()}` };
    MOCK_PROTOCOL.protocol_stages.push(newStage);
    MOCK_PROTOCOL.protocol_stages.sort((a, b) => a.order - b.order);
    return new Promise(resolve => setTimeout(() => resolve(newStage), 300));
};

export const updateProtocolStage = async (stageId, stageData) => {
    console.warn("updateProtocolStage is using mock data.");
    const index = MOCK_PROTOCOL.protocol_stages.findIndex(s => s.id === stageId);
    if (index !== -1) {
        MOCK_PROTOCOL.protocol_stages[index] = { ...MOCK_PROTOCOL.protocol_stages[index], ...stageData };
    }
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 300));
};

export const deleteProtocolStage = async (stageId) => {
    console.warn("deleteProtocolStage is using mock data.");
    MOCK_PROTOCOL.protocol_stages = MOCK_PROTOCOL.protocol_stages.filter(s => s.id !== stageId);
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 300));
};

export const updateStageOrder = async (orderUpdates) => {
    console.warn("updateStageOrder is using mock data.");
    orderUpdates.forEach(update => {
        const stage = MOCK_PROTOCOL.protocol_stages.find(s => s.id === update.id);
        if (stage) {
            stage.order = update.order;
        }
    });
    MOCK_PROTOCOL.protocol_stages.sort((a, b) => a.order - b.order);
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 300));
};
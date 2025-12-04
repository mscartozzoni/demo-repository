import { handleApiError } from './utils';
import { getDefaultProtocol } from './protocols';

// This is a MOCKED API. It now dynamically generates journeys based on the default protocol.
let mockPatientJourneys = {};

const generateJourneyForPatient = async (patientId, patientName, patientEmail) => {
    const protocol = await getDefaultProtocol(patientId); // doctorId is not used in mock
    if (!protocol || !protocol.protocol_stages) {
        return null;
    }

    const newJourney = {
        id: `jour_${patientId}`,
        patient_id: patientId,
        patient_name: patientName,
        patient_email: patientEmail,
        protocol_name: protocol.name,
        current_stage: 1,
        total_stages: protocol.protocol_stages.length,
        stages: protocol.protocol_stages.map(stage => ({
            ...stage, // Copy all stage data from protocol
            status: stage.order === 1 ? 'active' : 'upcoming',
            due_date: new Date(Date.now() + (stage.order * 7 * 24 * 60 * 60 * 1000)).toISOString(), // Mock due date
        })),
    };
    
    mockPatientJourneys[patientId] = newJourney;
    return newJourney;
};

export const getJourneys = async () => {
    console.log('[Mock API] Fetching all journeys...');
    // This is simplified. In a real app, you'd fetch all active journeys from a DB.
    // Here, we'll just return the ones we've generated in-memory.
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ success: true, data: Object.values(mockPatientJourneys) });
        }, 500);
    });
};

export const getJourneyByPatientId = async (patientId) => {
    console.log(`[Mock API] Fetching journey for patient id: ${patientId}`);
    return new Promise(async (resolve) => {
        setTimeout(async () => {
            if (mockPatientJourneys[patientId]) {
                resolve({ success: true, data: mockPatientJourneys[patientId] });
                return;
            }
            
            // If no journey exists, create one on-the-fly for the demo
            console.log(`[Mock API] No journey found for ${patientId}. Generating a new one...`);
            // In a real app, you'd fetch patient details first. Here we mock them.
            const patientName = `Paciente ${patientId.split('-')[1]}`;
            const patientEmail = `paciente.${patientId.split('-')[1]}@email.com`;
            const newJourney = await generateJourneyForPatient(patientId, patientName, patientEmail);

            if (newJourney) {
                resolve({ success: true, data: newJourney });
            } else {
                resolve({ success: false, error: { message: "Não foi possível criar uma jornada para este paciente. Verifique se um protocolo padrão está configurado." } });
            }
        }, 300);
    });
};

export const updateStageStatus = async (journeyId, stageId, newStatus) => {
    console.log(`[Mock API] Updating stage ${stageId} in journey ${journeyId} to ${newStatus}`);
    return new Promise(resolve => {
        setTimeout(() => {
            const patientId = journeyId.replace('jour_', '');
            const journey = mockPatientJourneys[patientId];
            if (journey) {
                const stage = journey.stages.find(s => s.id === stageId);
                if (stage) {
                    stage.status = newStatus;
                    
                    // Update current stage number
                    const activeOrCompletedStages = journey.stages.filter(s => s.status === 'completed' || s.status === 'active');
                    journey.current_stage = activeOrCompletedStages.length;

                    resolve({ success: true, data: stage });
                    return;
                }
            }
            resolve({ success: false, error: { message: "Could not update stage." }})
        }, 500);
    });
};

export const addStageToJourney = async (journeyId, stageData) => {
    return handleApiError({ message: "Feature not implemented." }, 'addStageToJourney', true);
}

export const removeStageFromJourney = async (journeyId, stageId) => {
    return handleApiError({ message: "Feature not implemented." }, 'removeStageFromJourney', true);
}
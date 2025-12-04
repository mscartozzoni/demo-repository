import { handleApiError } from './utils';

let mockTeam = [
    { id: 'user-1', organization_id: 'org-1', full_name: 'Dr. Márcio', email: 'marcio@email.com', app_role: 'owner' },
    { id: 'user-2', organization_id: 'org-1', full_name: 'Secretária Ana', email: 'ana@email.com', app_role: 'member' },
];
let nextUserId = 3;

export const getTeamMembers = async (organizationId) => {
    console.warn("getTeamMembers is using mock data.");
    const members = mockTeam.filter(m => m.organization_id === organizationId);
    return new Promise(resolve => setTimeout(() => resolve({ success: true, data: members }), 300));
};

export const inviteUser = async (email, role, organizationId) => {
    console.warn("inviteUser is using mock data.");
    const newUser = {
        id: `user-${nextUserId++}`,
        organization_id: organizationId,
        full_name: 'Novo Membro (Convidado)',
        email: email,
        app_role: role,
    };
    mockTeam.push(newUser);
    console.log(`Mock invite sent to ${email}.`);
    return new Promise(resolve => setTimeout(() => resolve({ success: true, data: newUser }), 500));
};

export const removeUserFromTeam = async (userId) => {
    console.warn("removeUserFromTeam is using mock data.");
    const initialLength = mockTeam.length;
    mockTeam = mockTeam.filter(m => m.id !== userId);
    if (mockTeam.length < initialLength) {
        return new Promise(resolve => setTimeout(() => resolve({ success: true, data: {} }), 300));
    }
    return handleApiError({ message: 'User not found' }, 'removeUserFromTeam');
};

export const transferOwnership = async (organizationId, newOwnerId) => {
    console.warn("transferOwnership is using mock data.");
    // This is a critical action, so in mock mode we just log it.
    console.log(`Simulating ownership transfer of org ${organizationId} to user ${newOwnerId}.`);
    return new Promise(resolve => setTimeout(() => resolve({ success: true, data: { message: 'Ownership transferred successfully (simulation).' } }), 500));
};
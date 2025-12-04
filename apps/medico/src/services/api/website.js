import { handleApiError } from './utils';

let mockWebsite = null;

export const getMyWebsite = async (userId) => {
    console.warn("getMyWebsite is using mock data.");
    return new Promise(resolve => setTimeout(() => resolve({ success: true, data: mockWebsite }), 300));
};

export const createMyWebsite = async (userId, organizationId) => {
    console.warn("createMyWebsite is using mock data.");
    if (mockWebsite) {
        return { success: true, data: mockWebsite };
    }
    mockWebsite = {
        id: 'website-1',
        user_id: userId,
        organization_id: organizationId,
        sections: {}, // Default empty sections
        optimization_score: 75,
        last_optimized_at: null,
    };
    return new Promise(resolve => setTimeout(() => resolve({ success: true, data: mockWebsite }), 300));
};

export const updateMyWebsite = async (websiteId, payload) => {
    console.warn("updateMyWebsite is using mock data.");
    if (mockWebsite && mockWebsite.id === websiteId) {
        mockWebsite = { ...mockWebsite, ...payload };
        return new Promise(resolve => setTimeout(() => resolve({ success: true, data: mockWebsite }), 300));
    }
    return handleApiError({ message: 'Website not found' }, 'updateMyWebsite');
};
import { handleApiError } from './utils';

let mockProfiles = {};

const MOCK_PROFILES_KEY = 'mock_profiles_data';

const loadProfiles = () => {
    try {
        const data = localStorage.getItem(MOCK_PROFILES_KEY);
        if (data) {
            mockProfiles = JSON.parse(data);
        } else {
            // Initialize with some default data if nothing in localStorage
            mockProfiles = {
                'usr_1': { id: 'usr_1', full_name: 'Dr. Ricardo', email: 'ricardo.alves@email.com', avatar_url: '', bio: 'Admin do sistema.', app_role: 'admin' },
                'legacy-user-placeholder': { id: 'legacy-user-placeholder', full_name: 'Dr. MySystem', email: 'dr@mysystem.com', avatar_url: '', bio: 'Usuário do sistema legado.', app_role: 'admin' },
            };
        }
    } catch (e) {
        console.error("Could not load profiles from localStorage", e);
        mockProfiles = {};
    }
};

const saveProfiles = () => {
    try {
        localStorage.setItem(MOCK_PROFILES_KEY, JSON.stringify(mockProfiles));
    } catch (e) {
        console.error("Could not save profiles to localStorage", e);
    }
};

loadProfiles();

export const getProfiles = async () => {
    console.warn("getProfiles is using mock data.");
    const profilesArray = Object.values(mockProfiles);
    return new Promise(resolve => setTimeout(() => resolve({ success: true, data: profilesArray }), 100));
};

export const getProfileById = async (userId) => {
    console.warn("getProfileById is using mock data.");
    const profile = mockProfiles[userId];
    if (profile) {
        return new Promise(resolve => setTimeout(() => resolve({ success: true, data: profile }), 100));
    }
    return new Promise(resolve => setTimeout(() => resolve({ success: false, error: { message: 'Profile not found' } }), 100));
};

export const updateUserProfile = async (userId, updates) => {
    console.warn("updateUserProfile is using mock data.");
    if (!mockProfiles[userId]) {
        mockProfiles[userId] = { id: userId, ...updates };
    } else {
        mockProfiles[userId] = { ...mockProfiles[userId], ...updates };
    }
    saveProfiles();
    const updatedProfile = mockProfiles[userId];
    return new Promise(resolve => setTimeout(() => resolve({ success: true, data: updatedProfile }), 100));
};

export const uploadProfileAvatar = async (userId, file) => {
    console.warn("uploadProfileAvatar is using mock data.");
    const mockUrl = URL.createObjectURL(file);
    
    if (mockProfiles[userId]) {
        mockProfiles[userId].avatar_url = mockUrl;
        saveProfiles();
    }
    
    return new Promise(resolve => setTimeout(() => resolve({ success: true, data: mockUrl }), 500));
};
import { handleApiError } from './utils';
import { add } from 'date-fns';

const WHEREBY_API_KEY = import.meta.env.VITE_WHEREBY_API_KEY;
const WHEREBY_API_URL = 'https://api.whereby.com/v1/meetings';

export const createWherebyMeeting = async () => {
    console.warn("createWherebyMeeting is using a mock implementation until API key is fully validated.");

    if (!WHEREBY_API_KEY || WHEREBY_API_KEY.includes("...")) {
        console.error("Whereby API Key is not configured correctly in .env file.");
        // Fallback to mock data if API key is not set
        const randomId = Math.random().toString(36).substring(7);
        const mockRoomUrl = `https://marcioplasticsurgery.whereby.com/mock-room-${randomId}`;
        const mockHostUrl = `${mockRoomUrl}?roomKey=mock-host-key`;
        return { success: true, data: { roomUrl: mockRoomUrl, hostRoomUrl: mockHostUrl } };
    }

    try {
        const endDate = add(new Date(), { hours: 1 });
        const response = await fetch(WHEREBY_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${WHEREBY_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                isLocked: true,
                endDate: endDate.toISOString(),
                roomMode: "group",
                fields: ["hostRoomUrl"],
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data };

    } catch (error) {
        return handleApiError(error, 'createWherebyMeeting');
    }
};
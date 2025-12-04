
export const handleApiError = (error, functionName = 'unknown') => {
    const errorMessage = error.message || `An unknown error occurred in ${functionName}.`;
    console.error(`API Error in ${functionName}:`, error);

    return { success: false, message: errorMessage, error };
};

// Mock functions that were using Supabase-specific logic
export const getActions = async () => {
  console.warn("getActions is using mock data.");
  return { success: true, data: [] };
};

export const getNewsCarouselData = async () => {
  console.warn("getNewsCarouselData is using mock data.");
  return { success: true, data: [] };
};

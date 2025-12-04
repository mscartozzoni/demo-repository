let mockErrorLogs = [];
let nextErrorId = 1;

export const logError = async (errorData) => {
    console.warn('logError is using mock data. Error was logged to console instead.', errorData);
    const newLog = { id: `err-${nextErrorId++}`, ...errorData, created_at: new Date().toISOString() };
    mockErrorLogs.unshift(newLog);
    return Promise.resolve({ success: true });
};

export const getErrorLogs = async (filters = {}) => {
    console.warn("getErrorLogs is using mock data.");
    return new Promise(resolve => {
        setTimeout(() => {
            let logs = [...mockErrorLogs];
            if (filters.severity && filters.severity !== 'all') {
                logs = logs.filter(log => log.severity === filters.severity);
            }
            if (filters.search) {
                logs = logs.filter(log => log.error_message.toLowerCase().includes(filters.search.toLowerCase()));
            }
            resolve({ success: true, data: logs.slice(0, 50) });
        }, 500);
    });
};
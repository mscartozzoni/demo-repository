
import React, { createContext, useContext } from 'react';
import { useApiLogic } from '@/hooks/useApiLogic';

const ApiContext = createContext(null);

export const useApi = () => {
    const context = useContext(ApiContext);
    if (!context) {
        throw new Error('useApi must be used within an ApiProvider');
    }
    return context;
};

export const ApiProvider = ({ children }) => {
    const api = useApiLogic();
    return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};

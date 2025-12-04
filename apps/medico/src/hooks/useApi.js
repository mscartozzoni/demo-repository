import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

const useApi = (apiFunction, { initialData = null, autoRun = true, deps = [] } = {}) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(autoRun);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunction(...args);
      if (result.success) {
        setData(result.data);
        return { success: true, data: result.data };
      } else {
        throw new Error(result.message || 'API call failed');
      }
    } catch (err) {
      const errorMessage = err.message || 'Ocorreu um erro inesperado.';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Erro de API',
        description: errorMessage,
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [apiFunction, toast]);
  
  const stableDeps = JSON.stringify(deps);

  useEffect(() => {
    if (autoRun) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRun, execute, stableDeps]);

  return { data, setData, loading, error, execute };
};

export default useApi;
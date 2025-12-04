import React, { createContext, useContext, useState, useEffect } from 'react';

const SessionContext = createContext();

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return context;
};

export const SessionProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading and auto-login with mock user
    const timer = setTimeout(() => {
      setUser({
        id: 'mock-user-1',
        email: 'demo@clinica.com',
        user_metadata: {
          full_name: 'Usuário Demo',
          avatar_url: null
        }
      });
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const signOut = async () => {
    // Mock sign out - just reload the page
    window.location.reload();
    return { error: null };
  };

  const value = {
    user,
    loading,
    signOut
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};
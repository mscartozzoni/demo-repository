import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('clinic_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const mockUser = {
      id: '1',
      email: email,
      name: 'Doutor(a)',
      onboardingComplete: false,
    };
    
    const storedUser = localStorage.getItem('clinic_user');
    if(storedUser) {
        const existingUser = JSON.parse(storedUser);
        if (existingUser.email === email) {
            setUser(existingUser);
            setIsAuthenticated(true);
            return;
        }
    }

    localStorage.setItem('clinic_user', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsAuthenticated(true);
  };
  
  const completeOnboarding = (userName, assistantSettings) => {
    const updatedUser = { ...user, name: userName, onboardingComplete: true };
    setUser(updatedUser);
    localStorage.setItem('clinic_user', JSON.stringify(updatedUser));
    localStorage.setItem('clinic_assistant_settings', JSON.stringify(assistantSettings));
  };


  const logout = () => {
    localStorage.removeItem('clinic_user');
    localStorage.removeItem('clinic_assistant_settings');
    localStorage.removeItem('clinic_chat_messages');
    localStorage.removeItem('clinic_patients');
    localStorage.removeItem('clinic_stats');
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    completeOnboarding
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
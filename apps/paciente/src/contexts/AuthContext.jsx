
import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AuthContext = createContext(undefined);

// Updated mockUsers with 'is_blocked' property
let mockUsers = {
    'secretary-1': {
        id: 'secretary-1',
        email: 'secretaria@example.com',
        password: 'password123',
        is_blocked: false,
        user_metadata: {
            full_name: 'Ana Paula (Secretária)',
            role: 'secretary',
        }
    },
    'doctor-1': {
        id: 'doctor-1',
        email: 'medico@example.com',
        password: 'password123',
        is_blocked: false,
        user_metadata: {
            full_name: 'Dr. Carlos Andrade',
            role: 'doctor',
        }
    },
    'patient-1': {
        id: 'patient-1',
        email: 'paciente@example.com',
        password: 'password123',
        is_blocked: false,
        user_metadata: {
            full_name: 'Ana Silva',
            role: 'patient',
            emergency_contact_name: 'Ricardo Silva',
            emergency_contact_phone: '(11) 91111-2222'
        }
    },
    'blocked-patient': {
        id: 'blocked-patient',
        email: 'blocked@example.com',
        password: 'password123',
        is_blocked: true,
        user_metadata: {
            full_name: 'Usuário Bloqueado',
            role: 'patient',
        }
    }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem('authUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      localStorage.removeItem('authUser');
    }
    setLoading(false);
  }, []);

  const signIn = async (email, password) => {
    setLoading(true);
    await new Promise(res => setTimeout(res, 500));

    // Development bypass
    if (import.meta.env.VITE_APP_ENV === 'development') {
        const devUser = Object.values(mockUsers).find(u => u.user_metadata.role === 'secretary');
        if (devUser) {
            const userToStore = { 
              ...devUser, 
              id: devUser.id, 
              user_metadata: { ...devUser.user_metadata, role: 'secretary' } // Set role to 'secretary' for admin access
            };
            delete userToStore.password;
            localStorage.setItem('authUser', JSON.stringify(userToStore));
            setUser(userToStore);
            setLoading(false);
            return { success: true, message: `Login de desenvolvimento (Admin) bem-sucedido!`, user: userToStore };
        }
    }

    const foundUserEntry = Object.entries(mockUsers).find(
      ([, u]) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!foundUserEntry) {
        setLoading(false);
        return { success: false, reason: 'not_found', message: "E-mail não cadastrado." };
    }

    const [userId, userObject] = foundUserEntry;

    if (userObject.is_blocked) {
        setLoading(false);
        return { success: false, reason: 'blocked', message: "Esta conta está bloqueada. Entre em contato com o suporte." };
    }

    if (userObject.password === password) {
        const userToStore = { 
            ...userObject, 
            id: userObject.id || userId,
            user_metadata: { ...userObject.user_metadata, role: 'autorizado' } 
        };
        delete userToStore.password;

        localStorage.setItem('authUser', JSON.stringify(userToStore));
        setUser(userToStore);
        setLoading(false);
        return { success: true, message: `Bem-vindo(a) de volta, ${userToStore.user_metadata.full_name}!`, user: userToStore };
    }

    setLoading(false);
    return { success: false, reason: 'wrong_password', message: "Senha inválida. Tente novamente." };
  };

  const signUp = async (email, password, options) => {
    setLoading(true);
    await new Promise(res => setTimeout(res, 500));

    if (Object.values(mockUsers).some(u => u.email.toLowerCase() === email.toLowerCase())) {
        setLoading(false);
        return { success: false, message: "Este e-mail já está em uso." };
    }
    
    const newUser = {
      id: uuidv4(),
      email: email,
      password: password,
      is_blocked: false,
      user_metadata: {
        full_name: options?.data?.full_name || 'Novo Usuário',
        role: options?.data?.role || 'patient',
      }
    };

    mockUsers[newUser.id] = newUser;
    
    setLoading(false);
    return { success: true, message: "Cadastro realizado com sucesso! Você agora pode fazer o login." };
  };

  const signOut = async () => {
    setLoading(true);
    await new Promise(res => setTimeout(res, 200));
    localStorage.removeItem('authUser');
    setUser(null);
    setLoading(false);
    return { success: true, message: "Você saiu da sua conta." };
  };
  
  const updateUser = useCallback(async (updatedUserData) => {
    localStorage.setItem('authUser', JSON.stringify(updatedUserData));
    setUser(updatedUserData);
    mockUsers[updatedUserData.id] = {
      ...mockUsers[updatedUserData.id],
      ...updatedUserData,
    };
    return updatedUserData;
  }, []);

  const value = useMemo(() => ({
    user,
    session: user ? { user } : null,
    loading,
    signIn,
    signUp,
    signOut,
    updateUser,
  }), [user, loading, updateUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

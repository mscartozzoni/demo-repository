import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(undefined);

// This is now a mock Auth Provider, disconnected from Supabase.
export const AuthProvider = ({ children }) => {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On initial load, simulate checking for a session
  useEffect(() => {
    setTimeout(() => {
      // You can uncomment the line below to simulate being logged in automatically
      // setUser({ id: 'mock-user-id', email: 'user@example.com', user_metadata: { full_name: 'Mock User', role: 'secretary' } });
      setLoading(false);
    }, 500);
  }, []);

  const signIn = async (email, password) => {
    setLoading(true);
    await new Promise(res => setTimeout(res, 500)); // Simulate network request
    if (email && password) {
      toast({
        title: "Login bem-sucedido (Simulação)!",
        description: "Bem-vindo de volta!",
      });
      setUser({
        id: 'mock-user-id',
        email: email,
        user_metadata: { full_name: 'Usuário de Teste', role: 'secretary' },
      });
    } else {
       toast({
        variant: "destructive",
        title: "Falha no Login (Simulação)",
        description: "Email ou senha inválidos.",
      });
    }
    setLoading(false);
  };

  const signUp = async (email, password, options) => {
    setLoading(true);
    await new Promise(res => setTimeout(res, 500)); // Simulate network request
    toast({
      title: "Cadastro realizado (Simulação)!",
      description: "Você agora pode fazer o login com suas credenciais.",
    });
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    await new Promise(res => setTimeout(res, 500)); // Simulate network request
    setUser(null);
    toast({
      title: "Você saiu da sua conta.",
    });
    setLoading(false);
  };

  const value = useMemo(() => ({
    user,
    session: user ? { user } : null, // Mock session
    loading,
    signUp,
    signIn,
    signOut,
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
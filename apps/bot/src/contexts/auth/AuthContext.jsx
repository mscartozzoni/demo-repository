import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchProfileAndPermissions = useCallback(async (userId) => {
    if (!userId) return null;
    try {
      // Passo 1: Buscar o perfil principal do usuário
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError);
        throw profileError;
      }

      // Passo 2: Buscar as permissões do usuário na tabela system_access (opcional)
      let permissionsData = [];
      try {
        const { data, error: permissionsError } = await supabase
          .from('system_access')
          .select('permissions, is_enabled, system:clinic_systems(slug, name)')
          .eq('user_id', userId);

        if (!permissionsError && data) {
          permissionsData = data;
        }
      } catch (permError) {
        // Ignorar erro de permissões - não é crítico
        console.warn('Tabela system_access não disponível:', permError);
      }

      // Passo 3: Combinar os dados em um único objeto de perfil
      const comprehensiveProfile = {
        ...profileData,
        access: permissionsData && permissionsData.length > 0 
          ? permissionsData.map(p => ({
              system: p.system?.slug || '',
              system_name: p.system?.name || '',
              permissions: p.permissions || [],
              enabled: p.is_enabled !== false,
            }))
          : [],
      };

      return comprehensiveProfile;

    } catch (error) {
      console.error('Erro ao buscar perfil:', error.message);
      toast({
        variant: "destructive",
        title: "Erro ao buscar perfil",
        description: error.message || "Não foi possível carregar os dados do seu perfil.",
      });
      return null;
    }
  }, [toast]);
  
  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        const userProfile = await fetchProfileAndPermissions(currentSession.user.id);
        setProfile(userProfile);
      }
      setLoading(false);
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setLoading(true);
        const userProfile = await fetchProfileAndPermissions(session.user.id);
        setProfile(userProfile);
        setLoading(false);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchProfileAndPermissions]);

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Falha no Login",
        description: error.message || 'E-mail ou senha inválidos.',
      });
      return { error };
    }
    
    // O onAuthStateChange vai cuidar de buscar o perfil e redirecionar.
    toast({ title: "Login realizado com sucesso!" });
    navigate('/', { replace: true });
    return { data };
  }, [toast, navigate]);

  const signUp = useCallback(async (email, password, fullName, role = 'receptionist') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
      },
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Falha no Cadastro",
        description: error.message,
      });
      return { error };
    }
    
    if (data.user && !data.user.email_confirmed_at) {
        toast({
            title: "Cadastro quase completo!",
            description: "Enviamos um e-mail de confirmação. Por favor, verifique sua caixa de entrada.",
            duration: 10000,
        });
    }

    return { data };
  }, [toast]);


  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null); // Limpa o perfil localmente
    navigate('/login', { replace: true });
  }, [navigate]);

  const value = useMemo(() => ({
    session,
    user,
    profile,
    loading,
    signIn,
    signOut,
    signUp,
  }), [session, user, profile, loading, signIn, signOut, signUp]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

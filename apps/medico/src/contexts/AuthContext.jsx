
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId) => {
    if (!userId) return null;
    try {
      const { data, error, status } = await supabase
        .from('user_profiles')
        .select(`*`)
        .eq('id', userId)
        .single();
      
      if (error && status !== 406) {
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error.message);
      return null;
    }
  }, []);

  const handleSession = useCallback(async (session) => {
    setSession(session);
    const currentUser = session?.user ?? null;
    setUser(currentUser);

    if (currentUser) {
      const userProfile = await fetchProfile(currentUser.id);
      setProfile(userProfile);
    } else {
      setProfile(null);
    }
    setLoading(false);
  }, [fetchProfile]);

  useEffect(() => {
    setLoading(true);
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      await handleSession(session);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
           await handleSession(session);
        }
        if (event === 'SIGNED_OUT') {
           setUser(null);
           setProfile(null);
           setSession(null);
           navigate('/auth/login');
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [handleSession, navigate]);

  const login = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  }, []);
  
  const register = useCallback(async ({ email, password, fullName }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'paciente' // Default role for new signups
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    
    if (data.user && data.user.identities && data.user.identities.length === 0) {
        return { success: false, error: "Este e-mail já está em uso." };
    }

    return { success: true, user: data.user };
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Sign out Failed",
        description: error.message || "Something went wrong",
      });
    }
    // The onAuthStateChange listener will handle navigation and state clearing
  }, [toast]);

  const sendPasswordResetEmail = useCallback(async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) {
        toast({ variant: 'destructive', title: 'Erro', description: error.message });
    }
  }, [toast]);
  
  const updatePassword = useCallback(async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
        toast({ variant: 'destructive', title: 'Erro', description: error.message });
    }
    return { error };
  }, [toast]);

  const updateUserProfile = useCallback(async (profileData) => {
    if (!user) {
        return { success: false, error: "Usuário não autenticado."};
    }
    const { data, error } = await supabase
        .from('user_profiles')
        .update({ ...profileData, updated_at: new Date() })
        .eq('id', user.id)
        .select()
        .single();

    if (error) {
        console.error("Error updating profile:", error);
        return { success: false, error: error.message };
    }

    setProfile(data);
    return { success: true, data };
  }, [user]);

  const value = useMemo(() => ({
    user,
    profile,
    session,
    loading,
    login,
    register,
    signOut,
    updateUserProfile,
    sendPasswordResetEmail,
    updatePassword,
  }), [user, profile, session, loading, login, register, signOut, updateUserProfile, sendPasswordResetEmail, updatePassword]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

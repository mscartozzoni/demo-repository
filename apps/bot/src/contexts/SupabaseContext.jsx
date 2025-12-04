import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useData } from './DataContext';
import { supabase } from '@/supabaseClient'; // Import the actual supabase client

const SupabaseContext = createContext(null);

export const useSupabase = () => useContext(SupabaseContext);

// Mock Supabase client for schema deployment and data sync simulation
const mockSupabaseClient = {
    rpc: async (method, { sql }) => {
        console.log(`[MOCK SUPABASE RPC] Executing: ${sql.substring(0, 100)}...`);
        return new Promise(resolve => setTimeout(() => resolve({ data: null, error: null }), 500));
    },
    from: (tableName) => ({
        upsert: async (data) => {
            console.log(`[MOCK SUPABASE UPSERT] Table: ${tableName}, Data: ${JSON.stringify(data).substring(0, 100)}...`);
            return new Promise(resolve => setTimeout(() => resolve({ data: null, error: null }), 500));
        }
    })
};

// Supabase schema definitions
const supabaseSchema = [
    // inbox_tags table
    `CREATE TABLE IF NOT EXISTS public.inbox_tags (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        color TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,
    // inbox_users table
    `CREATE TABLE IF NOT EXISTS public.inbox_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        sector TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        smtp TEXT,
        auth_email TEXT UNIQUE
    );`,
    // leads table (renamed from patients for generic use)
    `CREATE TABLE IF NOT EXISTS public.leads (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        full_name TEXT NOT NULL,
        email TEXT UNIQUE,
        phone TEXT,
        source TEXT,
        status TEXT DEFAULT 'new',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,
    // log_controls table
    `CREATE TABLE IF NOT EXISTS public.log_controls (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        event_type TEXT NOT NULL,
        description TEXT,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        user_id UUID REFERENCES public.inbox_users(id)
    );`,
    // messages table
    `CREATE TABLE IF NOT EXISTS public.messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
        sender_id UUID REFERENCES public.inbox_users(id),
        content TEXT NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        is_read BOOLEAN DEFAULT FALSE,
        message_type TEXT DEFAULT 'text'
    );`,
    // message_tags table (junction table for messages and tags)
    `CREATE TABLE IF NOT EXISTS public.message_tags (
        message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
        tag_id UUID REFERENCES public.inbox_tags(id) ON DELETE CASCADE,
        PRIMARY KEY (message_id, tag_id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,
    // Add RLS policies (example for leads table)
    `ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;`,
    `DROP POLICY IF EXISTS "Enable read access for all users" ON public.leads;`,
    `CREATE POLICY "Enable read access for all users" ON public.leads FOR SELECT USING (TRUE);`,
    `DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.leads;`,
    `CREATE POLICY "Enable insert for authenticated users only" ON public.leads FOR INSERT WITH CHECK (auth.role() = 'authenticated');`,
    `DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.leads;`,
    `CREATE POLICY "Enable update for authenticated users only" ON public.leads FOR UPDATE USING (auth.role() = 'authenticated');`,
    `DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.leads;`,
    `CREATE POLICY "Enable delete for authenticated users only" ON public.leads FOR DELETE USING (auth.role() = 'authenticated');`
];


export const SupabaseProvider = ({ children }) => {
    const { toast } = useToast();
    const { addLogEntry, getAllData } = useData();
    const [isIntegrated, setIsIntegrated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // Use the actual Supabase client if credentials are set, otherwise use mock
    const [currentSupabaseClient, setCurrentSupabaseClient] = useState(mockSupabaseClient);
    
    useEffect(() => {
        const url = localStorage.getItem('supabaseUrl');
        const key = localStorage.getItem('supabaseAnonKey');
        if (url && key && url !== 'YOUR_SUPABASE_URL' && key !== 'YOUR_SUPABASE_ANON_KEY') {
            setIsIntegrated(true);
            // In a real scenario, you would initialize the real Supabase client here.
            // For this task, we will stick to the mock client for safety.
            // setCurrentSupabaseClient(createClient(url, key));
            console.log("Supabase Integration Activated (Simulated)");
        } else {
            setIsIntegrated(false);
            setCurrentSupabaseClient(mockSupabaseClient);
        }
    }, []);
    
    const setCredentials = (url, key) => {
        localStorage.setItem('supabaseUrl', url);
        localStorage.setItem('supabaseAnonKey', key);
        if (url && key && url !== 'YOUR_SUPABASE_URL' && key !== 'YOUR_SUPABASE_ANON_KEY') {
            setIsIntegrated(true);
            // setCurrentSupabaseClient(createClient(url, key));
            toast({
                title: "Credenciais Supabase Salvas!",
                description: "A integração com o Supabase está ativa (em modo de simulação).",
            });
            addLogEntry('Supabase Integration', 'Credentials saved and integration activated (simulated).');
        } else {
            setIsIntegrated(false);
            setCurrentSupabaseClient(mockSupabaseClient);
            toast({
                title: "Credenciais Supabase Inválidas",
                description: "Por favor, insira uma URL e chave de API válidas para ativar a integração.",
                variant: "destructive"
            });
            addLogEntry('Supabase Integration', 'Invalid credentials provided.');
        }
    };
    
    const deploySchema = useCallback(async () => {
        if (!isIntegrated) {
            toast({ title: 'Integração Inativa', description: 'Por favor, insira as credenciais do Supabase primeiro.', variant: 'destructive' });
            return;
        }

        setIsLoading(true);
        toast({ title: '🚀 Iniciando Implantação do Esquema...', description: 'Criando tabelas no Supabase (simulação).' });
        addLogEntry('Supabase Schema Deployment', 'Starting schema deployment simulation.');
        
        try {
            for (const statement of supabaseSchema) {
                console.log(`[SIMULATING EXECUTION]:\n${statement.substring(0, 100)}...\n`);
                await currentSupabaseClient.rpc('execute_sql', { sql: statement });
            }
            toast({ title: '✅ Esquema Implantado com Sucesso!', description: 'Todas as tabelas foram criadas no Supabase (simulação).' });
            addLogEntry('Supabase Schema Deployment', 'Schema deployment simulation successful.');
        } catch (error) {
            toast({ title: '❌ Erro na Implantação', description: error.message, variant: 'destructive' });
            addLogEntry('Supabase Schema Deployment', `Error during simulation: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [isIntegrated, toast, addLogEntry, currentSupabaseClient]);

    const syncData = useCallback(async (force = false) => {
        if (!isIntegrated) {
            toast({ title: 'Integração Inativa', description: 'Ative a integração para sincronizar.', variant: 'destructive' });
            return;
        }
        setIsLoading(true);
        toast({ title: '🔄 Sincronizando Dados...', description: 'Enviando dados locais para o Supabase (simulação).' });
        addLogEntry('Supabase Data Sync', 'Starting data sync simulation.');

        try {
            const localData = getAllData();
            
            if(localData.patients && localData.patients.length > 0) {
                 const leadsToUpsert = localData.patients.map(p => ({
                     id: p.id,
                     full_name: p.full_name,
                     email: p.email,
                     phone: p.phone,
                     created_at: p.created_at,
                 }));
                 await currentSupabaseClient.from('leads').upsert(leadsToUpsert);
                 console.log(`[SYNC] Upserted ${leadsToUpsert.length} records to 'leads' table.`);
            }
            
            if(localData.messages && localData.messages.length > 0) {
                 const messagesToUpsert = localData.messages.map(m => ({
                     id: m.id,
                     lead_id: m.patient_id,
                     content: m.content,
                     timestamp: m.created_at,
                     is_read: m.read,
                     message_type: m.type
                 }));
                 await currentSupabaseClient.from('messages').upsert(messagesToUpsert);
                 console.log(`[SYNC] Upserted ${messagesToUpsert.length} records to 'messages' table.`);
            }

            if(localData.tags && localData.tags.length > 0) {
                const tagsToUpsert = localData.tags.map(t => ({ id: t.id, name: t.name, color: t.color }));
                await currentSupabaseClient.from('inbox_tags').upsert(tagsToUpsert);
                console.log(`[SYNC] Upserted ${tagsToUpsert.length} records to 'inbox_tags' table.`);
            }
            
            if(localData.staffs && localData.staffs.length > 0) {
                const usersToUpsert = localData.staffs.map(u => ({ id: u.id, full_name: u.name, role: u.role }));
                await currentSupabaseClient.from('inbox_users').upsert(usersToUpsert);
                console.log(`[SYNC] Upserted ${usersToUpsert.length} records to 'inbox_users' table.`);
            }

            toast({ title: '✅ Sincronização Concluída', description: 'Dados locais enviados para o Supabase (simulação).' });
            addLogEntry('Supabase Data Sync', 'Data sync simulation successful.');
        } catch (error) {
            toast({ title: '❌ Erro na Sincronização', description: error.message, variant: 'destructive' });
             addLogEntry('Supabase Data Sync', `Error during simulation: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [isIntegrated, toast, addLogEntry, getAllData, currentSupabaseClient]);

    const backupSupabase = useCallback(async () => {
        console.log("Simulating Supabase backup...");
        toast({ title: '🚧 Funcionalidade em Desenvolvimento', description: 'O backup do Supabase será implementado em breve.' });
        addLogEntry('Supabase Backup', 'Backup simulation initiated.');
    }, [toast, addLogEntry]);
    
    const restoreSupabase = useCallback(async (file) => {
        console.log("Simulating Supabase restore...");
        toast({ title: '🚧 Funcionalidade em Desenvolvimento', description: 'A restauração para o Supabase será implementada em breve.' });
        addLogEntry('Supabase Restore', 'Restore simulation initiated.');
    }, [toast, addLogEntry]);

    const value = {
        isIntegrated,
        isLoading,
        setCredentials,
        deploySchema,
        syncData,
        backupSupabase,
        restoreSupabase,
        supabaseClient: currentSupabaseClient,
    };

    return (
        <SupabaseContext.Provider value={value}>
            {children}
        </SupabaseContext.Provider>
    );
};

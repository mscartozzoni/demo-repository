import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/supabaseClient';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { useEmailSync } from '@/hooks/useEmailSync';

const DataContext = createContext(null);

export const useData = () => {
  return useContext(DataContext);
};

export const DataProvider = ({ children }) => {
  const { toast } = useToast();

  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [tags, setTags] = useState([]);
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [patientPortalData, setPatientPortalData] = useState([]);
  const [mailboxes, setMailboxes] = useState([]);
  const [leads, setLeads] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [follow_ups, setFollowUps] = useState([]);
  const [settings, setSettings] = useState({});


  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        contactsRes, messagesRes, tagsRes, usersRes, patientsRes, leadsRes, budgetsRes, followUpsRes, settingsRes
      ] = await Promise.all([
        supabase.from('inbox_contacts').select('*'),
        supabase.from('inbox_messages').select('*').order('created_at', { ascending: false }),
        supabase.from('inbox_tags').select('*'),
        supabase.from('inbox_users').select('*'),
        supabase.from('patients').select('*'),
        supabase.from('leads').select('*'),
        supabase.from('budgets').select('*'),
        supabase.from('follow_ups').select('*'),
        supabase.from('settings').select('*'),
      ]);

      if (contactsRes.error) throw contactsRes.error;
      setContacts(contactsRes.data || []);

      if (messagesRes.error) throw messagesRes.error;
      setMessages(messagesRes.data || []);
      
      if (tagsRes.error) throw tagsRes.error;
      setTags(tagsRes.data || []);

      if (usersRes.error) throw usersRes.error;
      setUsers(usersRes.data || []);
        
      if (patientsRes.error) throw patientsRes.error;
      setPatients(patientsRes.data || []);

      if (leadsRes.error) throw leadsRes.error;
      setLeads(leadsRes.data || []);

      if (budgetsRes.error) throw budgetsRes.error;
      setBudgets(budgetsRes.data || []);
      
      if (followUpsRes.error) throw followUpsRes.error;
      setFollowUps(followUpsRes.data || []);

      if (settingsRes.error) throw settingsRes.error;
      const settingsData = (settingsRes.data || []).reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {});
      setSettings(settingsData);


      // Mock patient portal data
      const portalData = (patientsRes.data || []).map(p => ({
          ...p,
          appointments: [{ id: 1, date: new Date(Date.now() + 86400000 * 2), staff_id: "Dr. House" }],
          messages: [{ id: 1, from_contact: false, content: "Seu resultado de exame está disponível.", created_at: new Date() }],
          documents: [{ id: 1, name: "Exame de Sangue.pdf" }]
      }));
      setPatientPortalData(portalData);

      // Derive conversations from messages and contacts
      const uniquePatientIds = [...new Set((messagesRes.data || []).map(m => m.patient_id))];
      const convos = uniquePatientIds.map(patient_id => {
          const lastMessage = (messagesRes.data || []).find(m => m.patient_id === patient_id);
          return {
              patient_id,
              priority: lastMessage?.priority || 'baixa',
              tags: [], // Tags need to be handled via message_tags table
              created_at: lastMessage?.created_at
          }
      });
      setConversations(convos);

    } catch (error) {
      console.error('Error fetching data from Supabase:', error);
      toast({
        variant: 'destructive',
        title: "Erro ao carregar dados",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Real-time listeners
  useRealtimeData({
    onNewMessage: (newMessage) => setMessages(prev => [newMessage, ...prev]),
    onUpdateMessage: (updatedMessage) => setMessages(prev => prev.map(m => m.id === updatedMessage.id ? updatedMessage : m)),
    onNewContact: (newContact) => setContacts(prev => [newContact, ...prev]),
    onUpdateContact: (updatedContact) => setContacts(prev => prev.map(c => c.id === updatedContact.id ? updatedContact : c)),
  });

  // Email sync simulation
  useEmailSync();

  const addLogEntry = useCallback(async (action, details) => {
    const newLog = {
      action,
      details,
      sector: 'system',
      user: 'Admin Master'
    };
    const { error } = await supabase.from('inbox_system_logs').insert(newLog);
    if(error) console.error("Error adding log:", error.message);
    setSystemLogs(prev => [{ ...newLog, id: Date.now(), created_at: new Date().toISOString() }, ...prev]);
  }, []);
  
  const addContact = useCallback(async (contactData) => {
    try {
      // Apenas colunas válidas da tabela inbox_contacts
      const payload = {
        patient_id: contactData.patient_id,
        name: contactData.name,
        last_activity: contactData.last_activity || null,
      };

      const { data, error } = await supabase.from('inbox_contacts').insert(payload).select().single();
      
      if (error) {
        // Erro 409 - Conflict: patient_id já existe (campo UNIQUE)
        if (error.code === '23505' || (error.message && (error.message.includes('duplicate') || error.message.includes('unique')))) {
          toast({ 
            variant: 'destructive', 
            title: "Contato já existe", 
            description: `O ID do paciente "${payload.patient_id}" já está cadastrado no sistema.` 
          });
          
          // Busca o contato existente para retorná-lo
          const { data: existingContact } = await supabase
            .from('inbox_contacts')
            .select('*')
            .eq('patient_id', payload.patient_id)
            .single();
            
          return existingContact;
        }
        
        // Outros erros
        toast({ variant: 'destructive', title: "Erro ao adicionar contato", description: error.message });
        console.error('❌ Erro ao adicionar contato:', { error, payload });
        return null;
      }
      
      toast({ title: "Sucesso!", description: "Novo contato adicionado." });
      addLogEntry('Contato Adicionado', `Novo contato: ${data.name}`);
      return data;
      
    } catch (err) {
      console.error('❌ Erro inesperado ao adicionar contato:', err);
      toast({ 
        variant: 'destructive', 
        title: "Erro inesperado", 
        description: "Falha na comunicação com o banco de dados." 
      });
      return null;
    }
  }, [toast, addLogEntry]);

  const addMessage = useCallback(async (messageData) => {
    // Normaliza payload para schema real de inbox_messages
    const payload = {
      patient_id: messageData.patient_id,
      patient_name: messageData.patient_name || messageData.name || 'Paciente',
      message: messageData.content || messageData.message,
      type: messageData.type || 'communication',
      status: messageData.status || 'pendente',
      priority: messageData.priority || 'media',
      is_new_patient: typeof messageData.is_new_patient === 'boolean' ? messageData.is_new_patient : false,
      from: messageData.from || (messageData.from_contact === false ? 'agent' : 'patient'),
      assigned_to_id: messageData.assigned_to_id || messageData.user_id || null,
    };

    const { data, error } = await supabase.from('inbox_messages').insert(payload).select().single();
     if (error) {
      toast({ variant: 'destructive', title: "Erro ao enviar mensagem", description: error.message });
      return null;
    }
    setMessages(prev => [data, ...prev]);
    return data;
  }, [toast]);

  const markMessagesAsRead = useCallback(async (patientId) => {
    const { error } = await supabase.from('inbox_messages').update({ status: 'read' }).eq('patient_id', patientId).eq('from', 'user');
    if (error) {
      console.error('Error marking messages as read:', error.message);
    } else {
      setMessages(prev => prev.map(m => (m.patient_id === patientId && m.status !== 'replied') ? { ...m, status: 'read' } : m));
    }
  }, []);

  const addTag = useCallback(async (tagData) => {
    try {
      const { data, error } = await supabase.from('inbox_tags').insert(tagData).select().single();
      
      if (error) {
        // Erro 409 - Conflict: nome da tag já existe
        if (error.code === '23505' || error.message.includes('duplicate') || error.message.includes('unique')) {
          toast({ 
            variant: 'destructive', 
            title: "Etiqueta já existe", 
            description: `A etiqueta "${tagData.name}" já está cadastrada no sistema.` 
          });
          
          // Busca a tag existente
          const { data: existingTag } = await supabase
            .from('inbox_tags')
            .select('*')
            .eq('name', tagData.name)
            .single();
            
          return existingTag;
        }
        
        // Outros erros
        toast({ variant: 'destructive', title: "Erro ao adicionar etiqueta", description: error.message });
        console.error('❌ Erro 409 - Detalhes da etiqueta:', { error, tagData });
        return null;
      }
      
      setTags(prev => [...prev, data]);
      addLogEntry('Etiqueta Adicionada', `Nova etiqueta criada: ${data.name}`);
      return data;
      
    } catch (err) {
      console.error('❌ Erro inesperado ao adicionar etiqueta:', err);
      toast({ 
        variant: 'destructive', 
        title: "Erro inesperado", 
        description: "Falha na comunicação com o banco de dados." 
      });
      return null;
    }
  }, [addLogEntry, toast]);
  
  const removeTag = useCallback(async (tagId) => {
    const tagName = tags?.find(t => t.id === tagId)?.name;
    const { error } = await supabase.from('inbox_tags').delete().eq('id', tagId);
    if(error) {
      toast({ variant: 'destructive', title: "Erro ao remover etiqueta", description: error.message });
    } else {
      setTags(prev => prev.filter(t => t.id !== tagId));
      if (tagName) {
        addLogEntry('Etiqueta Removida', `Etiqueta removida: ${tagName}`);
      }
    }
  }, [tags, addLogEntry, toast]);

  const updateUser = useCallback(async (userId, updatedData) => {
    const { data, error } = await supabase.from('inbox_contacts').update(updatedData).eq('id', userId).select().single();
    if (error) {
       toast({ variant: 'destructive', title: "Erro ao atualizar contato", description: error.message });
    } else {
       toast({ title: "Sucesso!", description: `Dados de ${data.name} atualizados.` });
       addLogEntry('Contato Atualizado', `Dados de ${data.name} atualizados.`);
    }
  }, [addLogEntry, toast]);

    const addUser = useCallback(async (userData) => {
        try {
            const { data, error } = await supabase.from('inbox_users').insert(userData).select().single();
            
            if (error) {
                // Erro 409 - Conflict: email ou outro campo único já existe
                if (error.code === '23505' || error.message.includes('duplicate') || error.message.includes('unique')) {
                    toast({ 
                        variant: 'destructive', 
                        title: "Usuário já existe", 
                        description: `O email "${userData.auth_email}" já está cadastrado no sistema.` 
                    });
                    return null;
                }
                
                // Outros erros
                toast({ variant: 'destructive', title: "Erro ao adicionar usuário", description: error.message });
                console.error('❌ Erro 409 - Detalhes do usuário:', { error, userData });
                return null;
            }
            
            setUsers(prev => [...prev, data]);
            addLogEntry('Usuário Adicionado', `Novo usuário: ${data.name}`);
            return data;
            
        } catch (err) {
            console.error('❌ Erro inesperado ao adicionar usuário:', err);
            toast({ 
                variant: 'destructive', 
                title: "Erro inesperado", 
                description: "Falha na comunicação com o banco de dados." 
            });
            return null;
        }
    }, [toast, addLogEntry]);

    const removeUser = useCallback(async (userId) => {
        const userToRemove = users.find(u => u.id === userId);
        if (!userToRemove) return;

        const { error } = await supabase.from('inbox_users').delete().eq('id', userId);
        if (error) {
            toast({ variant: 'destructive', title: "Erro ao remover usuário", description: error.message });
        } else {
            setUsers(prev => prev.filter(u => u.id !== userId));
            addLogEntry('Usuário Removido', `Usuário removido: ${userToRemove.name}`);
        }
    }, [users, toast, addLogEntry]);
    
  const updateMailboxes = useCallback((newMailboxes) => {
    setMailboxes(newMailboxes);
    // Here you would also sync with Supabase `settings` table in a real scenario
  }, []);
  
  const updateConversation = useCallback((patientId, updates) => {
    setConversations(prev => prev.map(c => c.patient_id === patientId ? { ...c, ...updates } : c));
    toast({ title: "Conversa atualizada!" });
  }, [toast]);

  const updateSettings = useCallback(async (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    for (const [key, value] of Object.entries(newSettings)) {
        const { error } = await supabase
            .from('settings')
            .upsert({ key, value }, { onConflict: 'key' });
        if (error) {
            toast({ variant: 'destructive', title: `Erro ao salvar ${key}`, description: error.message });
        }
    }
  }, [toast]);

  const value = {
    contacts,
    messages,
    tags,
    users,
    systemLogs,
    emailLogs,
    conversations,
    patients,
    patientPortalData,
    mailboxes,
    leads,
    budgets,
    follow_ups,
    settings,
    loading,
    fetchData,
    addLogEntry,
    addContact,
    addMessage,
    markMessagesAsRead,
    addTag,
    removeTag,
    updateUser,
    addUser,
    removeUser,
    setEmailLogs,
    updateMailboxes,
    updateConversation,
    updateSettings,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

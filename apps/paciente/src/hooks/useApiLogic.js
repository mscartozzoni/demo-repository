
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { v4 as uuidv4 } from 'uuid';
import { 
    mockPatients, 
    mockLeads, 
    mockAppointments, 
    mockNotifications, 
    mockConversations, 
    mockMessages, 
    mockJourneys, 
    mockJourneyStages,
    mockEmailLogs,
    mockEmails,
    mockBudgets,
    mockHospitals,
    mockSurgeryTypes,
    mockAppointmentTypes,
    mockContacts,
    mockProtocols,
    mockPatientDocuments,
    mockMedicalHistory,
} from '@/lib/mock-data';

export const useApiLogic = () => {
    const { toast } = useToast();
    const { user, updateUser } = useAuth();
    const { addNotification } = useNotifications();
    const [loading, setLoading] = useState(false);

    const [patients, setPatients] = useState(mockPatients);
    const [leads, setLeads] = useState(mockLeads);
    const [appointments, setAppointments] = useState(mockAppointments);
    const [notifications, setNotifications] = useState(mockNotifications);
    const [conversations, setConversations] = useState(mockConversations);
    const [messages, setMessages] = useState(mockMessages);
    const [journeys, setJourneys] = useState(mockJourneys);
    const [journeyStages, setJourneyStages] = useState(mockJourneyStages);
    const [emailLogs, setEmailLogs] = useState(mockEmailLogs);
    const [emails, setEmails] = useState(mockEmails);
    const [budgets, setBudgets] = useState(mockBudgets);
    const [contacts, setContacts] = useState(mockContacts);
    const [patientDocuments, setPatientDocuments] = useState(mockPatientDocuments);
    const [medicalHistory, setMedicalHistory] = useState(mockMedicalHistory);

    const apiRequest = useCallback(async (action, options = {}) => {
        if (!options.silent) setLoading(true);
        await new Promise(resolve => setTimeout(resolve, options.delay || 500));
        try {
            const result = await action();
            if (options.successMessage) {
                 const message = typeof options.successMessage === 'function' ? options.successMessage(result) : options.successMessage;
                toast({ title: "Sucesso!", description: message });
            }
            return result;
        } catch (error) {
            console.error("API Error:", error);
            toast({
                variant: "destructive",
                title: "Ocorreu um erro",
                description: error.message || "Não foi possível completar a sua solicitação. Tente novamente.",
            });
            throw error;
        } finally {
            if (!options.silent) setLoading(false);
        }
    }, [toast]);
    
    const getDashboardStats = useCallback(() => apiRequest(() => {
        const today = new Date().toISOString().split('T')[0];
        const thisMonth = new Date().toISOString().slice(0, 7);
        return {
            totalPatients: patients.length,
            todaysAppointmentsCount: appointments.filter(a => (a.start_at || a.appointment_time || '').startsWith(today)).length,
            pendingBudgetsCount: budgets.filter(b => b.status === 'pendente').length,
            unreadMessagesCount: conversations.filter(c => c.unread_count > 0).length,
            completedThisMonthCount: appointments.filter(a => (a.start_at || a.appointment_time || '').startsWith(thisMonth) && a.status === 'realizada').length,
        };
    }), [apiRequest, patients, appointments, budgets, conversations]);

    const getWeeklyAppointmentStats = useCallback(() => apiRequest(() => {
        const today = new Date();
        const weekData = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
            weekData.push({
                name: dayName.charAt(0).toUpperCase() + dayName.slice(1,3),
                agendamentos: appointments.filter(a => (a.start_at || a.appointment_time || '').startsWith(dateString)).length,
            });
        }
        return weekData;
    }), [apiRequest, appointments]);
    
    const getAppointmentsForToday = useCallback(() => apiRequest(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        return appointments
            .filter(apt => (apt.start_at || apt.appointment_time).startsWith(todayStr))
            .map(apt => ({ ...apt, patient: patients.find(p => p.id === apt.patient_id) || contacts.find(c => c.id === apt.patient_id) || {full_name: "Desconhecido"}}))
            .sort((a,b) => new Date(a.start_at) - new Date(b.start_at));
    }), [apiRequest, appointments, patients, contacts]);


    const getPatientDetails = useCallback((patientId) => apiRequest(() => {
        const patient = patients.find(p => p.id === patientId);
        if (!patient) return null;

        const patientJourney = journeys.find(j => j.patient_id === patientId);
        let journeyWithStages = null;
        if (patientJourney) {
            const stages = journeyStages
                .filter(s => s.journey_id === patientJourney.id)
                .sort((a, b) => a.order - b.order);
            journeyWithStages = { ...patientJourney, stages };
        }

        const patientAppointments = appointments
            .filter(a => a.patient_id === patientId)
            .sort((a, b) => new Date(b.start_at) - new Date(a.start_at));

        const patientBudgets = budgets
            .filter(b => b.patientId === patientId)
            .sort((a, b) => new Date(b.sentDate) - new Date(a.sentDate));

        const interactions = [
            ...patientAppointments.map(a => ({ type: 'appointment', date: a.start_at, title: a.visit_type })),
            ...(patientJourney?.stages.map(s => ({ type: 'journey_stage', date: s.created_at, title: s.stage_name })) || [])
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        const firstContactDate = interactions.length > 0 ? interactions[interactions.length - 1].date : patient.created_at;
        const lastInteractionDate = interactions.length > 0 ? interactions[0].date : null;

        return {
            ...patient,
            journey: journeyWithStages,
            appointments: patientAppointments,
            budgets: patientBudgets,
            firstContactDate,
            lastInteractionDate
        };
    }), [patients, journeys, journeyStages, appointments, budgets, apiRequest]);
    
    const getBudgets = useCallback(() => apiRequest(() => {
        return budgets.sort((a, b) => new Date(b.sentDate) - new Date(a.sentDate));
    }), [apiRequest, budgets]);

    const updateBudgetStatus = useCallback((budgetId, status) => apiRequest(() => {
        setBudgets(prev => prev.map(b => b.id === budgetId ? { ...b, status } : b));
        const budget = budgets.find(b => b.id === budgetId);
        if (user && user.user_metadata.role === 'secretary') {
            addNotification({
                type: 'budget_status_change',
                message: `Orçamento para ${budget.patientName} atualizado para ${status}.`,
            });
        }
        return true;
    }, { successMessage: "Status do orçamento atualizado!" }), [apiRequest, addNotification, budgets, user]);


    const createContact = useCallback((contactData) => apiRequest(() => {
        const newContact = { 
            id: `contact_${uuidv4()}`,
            name: contactData.full_name,
            full_name: contactData.full_name,
            ...contactData, 
            created_at: new Date().toISOString(),
            status: 'new'
        };
        setContacts(prev => [newContact, ...prev]);
        addNotification({type: 'new_lead', message: `Novo Contato: ${newContact.name}`})
        return newContact;
    }, { successMessage: (data) => `${data.name} foi adicionado(a) como contato.`}), [apiRequest, addNotification]);
    
    const checkPhoneExists = useCallback((phone, excludeId = null) => apiRequest(() => {
        const normalizedPhone = phone.replace(/\D/g, '');
        if (!normalizedPhone) return null;

        const allPeople = [
            ...patients.map(p => ({ ...p, type: 'patient' })),
            ...contacts.map(c => ({ ...c, type: 'contact' }))
        ];

        const foundPerson = allPeople.find(p => {
            const pPhone = p.phone.replace(/\D/g, '');
            return p.id !== excludeId && pPhone === normalizedPhone;
        });

        if (foundPerson) {
             return { exists: true, type: foundPerson.type, name: foundPerson.full_name || foundPerson.name, id: foundPerson.id };
        }
        
        return null;
    }, { silent: true }), [patients, contacts, apiRequest]);

    const createPatient = useCallback((patientData) => apiRequest(async () => {
        const phoneExists = await checkPhoneExists(patientData.phone, patientData.contact_id);
        if (phoneExists) {
            throw new Error(`Este telefone já pertence a ${phoneExists.name}.`);
        }

        const contactId = patientData.contact_id;
        
        const newPatient = { 
            id: `patient_${uuidv4()}`,
            ...patientData,
            created_at: new Date().toISOString(),
            status: 'active',
        };
        delete newPatient.contact_id;
        setPatients(prev => [newPatient, ...prev]);
        
        if (contactId) {
            setContacts(prev => prev.filter(c => c.id !== contactId));
             toast({ title: "Sucesso!", description: `${newPatient.full_name} foi convertido para paciente.` });
        } else {
             toast({ title: "Sucesso!", description: `${newPatient.full_name} foi adicionado como paciente.` });
        }
        
        addNotification({type: 'patient_created', message: `Novo Paciente: ${newPatient.full_name}`});
        return newPatient;
    }), [apiRequest, toast, addNotification, checkPhoneExists]);


    const getPatients = useCallback(() => apiRequest(() => {
        const activeJourneys = new Set(journeys.filter(j => j.status === 'in_progress').map(j => j.patient_id));
        const pendingBudgets = new Set(budgets.filter(b => b.status === 'pendente').map(b => b.patientId));
        
        return patients.map(p => {
            const hasActiveJourney = activeJourneys.has(p.id);
            const hasPendingBudget = pendingBudgets.has(p.id);
            let journeyStatus = 'inactive';
            if (hasActiveJourney) journeyStatus = 'active';
            else if (hasPendingBudget) journeyStatus = 'pending_budget';

            return {...p, journeyStatus };
        });
    }), [apiRequest, patients, journeys, budgets]);

    const searchPatientsAndContacts = useCallback((query) => apiRequest(() => {
        const lowerQuery = query.toLowerCase().replace(/\D/g, '');
        if (!lowerQuery) return [];

        const matchingPatients = patients
            .filter(p => p.full_name.toLowerCase().includes(lowerQuery) || p.phone.replace(/\D/g, '').includes(lowerQuery))
            .map(p => ({ ...p, type: 'patient' }));
        const matchingContacts = contacts
            .filter(c => c.name.toLowerCase().includes(lowerQuery) || c.phone.replace(/\D/g, '').includes(lowerQuery))
            .map(c => ({ ...c, type: 'contact' }));
        return [...matchingPatients, ...matchingContacts];
    }, { silent: true }), [apiRequest, patients, contacts]);

    const getPatientById = useCallback((id) => apiRequest(() => {
        return patients.find(p => p.id === id);
    }), [apiRequest, patients]);
    
    const getLeads = useCallback(() => apiRequest(() => contacts.filter(c => c.status !== 'converted')), [apiRequest, contacts]);
    const getContacts = useCallback((query) => apiRequest(() => {
        if (!query) return contacts;
        const lowerQuery = query.toLowerCase();
        return contacts.filter(c => (c.name || c.full_name).toLowerCase().includes(lowerQuery));
    }), [apiRequest, contacts]);
    
    const getAppointments = useCallback(() => apiRequest(() => appointments), [apiRequest, appointments]);
    
    const getAppointmentsForDay = useCallback((dateStr) => apiRequest(() => {
        return appointments
            .filter(apt => (apt.start_at || apt.appointment_time).startsWith(dateStr))
            .map(apt => ({ ...apt, patient: patients.find(p => p.id === apt.patient_id) || contacts.find(c => c.id === apt.patient_id) || {full_name: "Desconhecido"}}))
            .sort((a,b) => new Date(a.start_at) - new Date(b.start_at));
    }), [apiRequest, appointments, patients, contacts]);
    
    const getAppointmentsForWeek = useCallback((startDateStr) => apiRequest(() => {
        const startDate = new Date(startDateStr);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 7);
        return appointments
            .filter(apt => {
                const apptDate = new Date(apt.start_at || apt.appointment_time);
                return apptDate >= startDate && apptDate < endDate;
            })
            .map(apt => ({ ...apt, patient: patients.find(p => p.id === apt.patient_id) || contacts.find(c => c.id === apt.patient_id) || {full_name: "Desconhecido"}}));
    }), [apiRequest, appointments, patients, contacts]);

    const addAppointment = useCallback((appointmentData) => apiRequest(() => {
        const newAppointment = { 
            ...appointmentData, 
            id: `appt_${uuidv4()}`,
        };
        setAppointments(prev => [...prev, newAppointment]);
        const patientName = newAppointment.patient?.full_name || 'Paciente';
        addNotification({type: 'new_appointment', message: `Novo agendamento para ${patientName} às ${newAppointment.start_at.split('T')[1].slice(0,5)}`});
        return newAppointment;
    }, { successMessage: (data) => `Agendamento para ${data.patient.full_name} criado com sucesso.` }), [apiRequest, addNotification]);
    
    const updateAppointment = useCallback((appointmentData) => apiRequest(() => {
        setAppointments(prev => prev.map(appt => appt.id === appointmentData.id ? appointmentData : appt));
        return appointmentData;
    }, { successMessage: (data) => `Agendamento para ${data.patient.full_name} atualizado.` }), [apiRequest]);


    const updateAppointmentStatus = useCallback((id, status, silent = false) => apiRequest(() => {
        let updatedAppt = null;
        setAppointments(prev => prev.map(appt => {
            if (appt.id === id) {
                updatedAppt = { ...appt, status: status };
                return updatedAppt;
            }
            return appt;
        }));
        if (updatedAppt && !silent) {
            const patientName = patients.find(p => p.id === updatedAppt.patient_id)?.full_name || 'Paciente';
            addNotification({type: 'appointment_update', message: `Agendamento de ${patientName} atualizado para ${status}`});
        }
        return updatedAppt;
    }, { successMessage: !silent ? "Status do agendamento atualizado!" : undefined, silent }), [apiRequest, addNotification, patients]);

    const addSurgery = useCallback((surgeryData) => apiRequest(() => {
        const newSurgery = { 
            ...surgeryData, 
            id: `surg_${uuidv4()}`,
            appointment_time: surgeryData.start_at,
        };
        setAppointments(prev => [...prev, newSurgery]);
        const patientName = surgeryData.patient?.full_name || 'Paciente';
        addNotification({type: 'new_surgery', message: `Nova cirurgia para ${patientName}`});
        return newSurgery;
    }, { successMessage: (data) => `Cirurgia para ${data.patient.full_name} agendada com sucesso.` }), [apiRequest, addNotification]);


    const getNotifications = useCallback(() => apiRequest(() => {
        return notifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }), [apiRequest, notifications]);
    
    const markNotificationAsRead = useCallback((notificationId) => apiRequest(() => {
        setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
        return true;
    }, { silent: true }), [apiRequest]);

    const markAllNotificationsAsRead = useCallback(() => apiRequest(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        return true;
    }), [apiRequest]);


    const getConversations = useCallback(() => apiRequest(() => {
        const allPeople = [
            ...patients.map(p => ({ id: p.id, name: p.full_name, avatarUrl: p.avatarUrl, online: Math.random() > 0.5 })),
            ...contacts.map(c => ({ id: c.id, name: c.full_name || c.name, avatarUrl: c.avatarUrl, online: Math.random() > 0.7 }))
        ];

        let unifiedConversations = conversations.map(c => {
            const participant = allPeople.find(p => p.id === c.participant_id);
            return {
                ...c,
                participant: participant || { id: c.participant_id, name: "Usuário Removido" },
            };
        });

        allPeople.forEach(p => {
            if (!unifiedConversations.some(c => c.participant_id === p.id)) {
                unifiedConversations.push({
                    id: `conv_${p.id}`,
                    participant_id: p.id,
                    participant: p,
                    summary: 'Nenhuma mensagem ainda',
                    last_message_at: null,
                    unread_count: 0,
                    status: 'active'
                });
            }
        });
        
        return unifiedConversations.sort((a,b) => {
            if (a.last_message_at && b.last_message_at) {
                return new Date(b.last_message_at) - new Date(a.last_message_at);
            }
            if (a.last_message_at) return -1;
            if (b.last_message_at) return 1;
            return 0;
        });

    }, { silent: true }), [apiRequest, conversations, patients, contacts]);
    
    const getMessagesForConversation = useCallback((conversationId) => apiRequest(() => {
        return messages.filter(m => m.conversation_id === conversationId);
    }, { silent: true, delay: 200 }), [apiRequest, messages]);

    const sendMessage = useCallback((conversationId, content) => apiRequest(() => {
        const newMessage = {
            id: `msg_${uuidv4()}`,
            conversation_id: conversationId,
            sender_id: user.id,
            sender_role: 'secretary',
            content,
            created_at: new Date().toISOString(),
        };
        setMessages(prev => [...prev, newMessage]);
        setConversations(prev => prev.map(c => c.id === conversationId ? {
            ...c,
            summary: `Você: ${content}`,
            last_message_at: newMessage.created_at,
            unread_count: 0
        } : c));
        return newMessage;
    }, { silent: true, delay: 100 }), [apiRequest, user]);
    
    const getAiSuggestion = useCallback((conversationId) => apiRequest(() => {
        // Mock AI suggestion logic
        const suggestions = [
            "Olá! Como posso ajudar hoje?",
            "Para agendar uma consulta, por favor, me informe o melhor dia e horário para você.",
            "Nossos horários de atendimento são de segunda a sexta, das 9h às 18h.",
            "Posso verificar a disponibilidade na agenda do Dr. para você.",
        ];
        return suggestions[Math.floor(Math.random() * suggestions.length)];
    }, { delay: 700 }), [apiRequest]);
    
    const getHospitals = useCallback(() => apiRequest(() => mockHospitals), [apiRequest]);
    const getSurgeryTypes = useCallback(() => apiRequest(() => mockSurgeryTypes), [apiRequest]);
    const getAppointmentTypes = useCallback(() => apiRequest(() => mockAppointmentTypes), [apiRequest]);
    
    const getSuggestedTime = useCallback((dateStr) => apiRequest(() => {
        const dayAppointments = appointments
            .filter(a => a.start_at.startsWith(dateStr))
            .sort((a,b) => new Date(a.start_at) - new Date(b.start_at));

        const workStart = 9;
        const workEnd = 18;
        const slotDuration = 30;

        for (let h = workStart; h < workEnd; h++) {
            for (let m = 0; m < 60; m += slotDuration) {
                const potentialStart = new Date(`${dateStr}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`);
                if (potentialStart < new Date()) continue;

                const potentialEnd = new Date(potentialStart.getTime() + slotDuration * 60000);
                
                const conflict = dayAppointments.some(apt => {
                    const aptStart = new Date(apt.start_at);
                    const aptEnd = new Date(apt.end_at);
                    return (potentialStart < aptEnd && potentialEnd > aptStart);
                });

                if (!conflict) {
                    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
                }
            }
        }
        return null;
    }), [apiRequest, appointments]);
    
    const checkTimeConflict = useCallback((dateTime, excludeAppointmentId = null) => apiRequest(() => {
        const dateStr = dateTime.split('T')[0];
        const time = new Date(dateTime);
        const endTime = new Date(time.getTime() + 30 * 60000);
        
        const dayAppointments = appointments.filter(a => a.start_at.startsWith(dateStr) && a.id !== excludeAppointmentId);
        
        const conflict = dayAppointments.some(apt => {
            const aptStart = new Date(apt.start_at);
            const aptEnd = new Date(apt.end_at);
            return time < aptEnd && endTime > aptStart;
        });

        return conflict;
    }, { silent: true }), [appointments]);

    const getJourneyProtocols = useCallback(() => apiRequest(() => mockProtocols), [apiRequest]);

    const getPatientDataForPortal = useCallback(() => apiRequest(() => {
        if (!user || user.user_metadata.role !== 'patient') return null;

        const patientId = user.id;
        const now = new Date();

        const allPatientAppointments = appointments
            .filter(a => a.patient_id === patientId)
            .sort((a, b) => new Date(a.start_at) - new Date(b.start_at));

        const upcomingAppointments = allPatientAppointments
            .filter(a => new Date(a.start_at) >= now && a.status !== 'cancelado')
            .slice(0, 3);
        
        const pastAppointments = allPatientAppointments
            .filter(a => new Date(a.start_at) < now)
            .reverse()
            .slice(0, 5);
        
        const docs = (patientDocuments[patientId] || []).slice(0, 5);
        const history = (medicalHistory[patientId] || []).slice(0, 3);
        const patientProfile = patients.find(p => p.id === patientId);

        return {
            upcomingAppointments,
            pastAppointments,
            documents: docs,
            history,
            profile: { ...user.user_metadata, ...patientProfile }
        };
    }), [apiRequest, user, appointments, patientDocuments, medicalHistory, patients]);
    
    const getPatientAppointmentsForPortal = useCallback(() => apiRequest(() => {
        if (!user || user.user_metadata.role !== 'patient') return { upcoming: [], past: [] };
        
        const patientId = user.id;
        const now = new Date();
        const allPatientAppointments = appointments
            .filter(a => a.patient_id === patientId)
            .sort((a, b) => new Date(a.start_at) - new Date(b.start_at));

        const upcoming = allPatientAppointments.filter(a => new Date(a.start_at) >= now);
        const past = allPatientAppointments.filter(a => new Date(a.start_at) < now).reverse();

        return { upcoming, past };

    }), [apiRequest, user, appointments]);

    const getPatientDocumentsForPortal = useCallback(() => apiRequest(() => {
        if (!user || user.user_metadata.role !== 'patient') return [];
        return patientDocuments[user.id] || [];
    }), [apiRequest, user, patientDocuments]);

    const getPatientHistoryForPortal = useCallback(() => apiRequest(() => {
        if (!user || user.user_metadata.role !== 'patient') return [];
        return medicalHistory[user.id] || [];
    }), [apiRequest, user, medicalHistory]);

    const updatePatientProfile = useCallback((profileData) => apiRequest(async () => {
        if (!user || user.user_metadata.role !== 'patient') throw new Error("Acesso não autorizado");

        setPatients(prev => prev.map(p => p.id === user.id ? { ...p, ...profileData } : p));
        
        const updatedUser = await updateUser({
            ...user,
            user_metadata: {
                ...user.user_metadata,
                ...profileData,
            }
        });
        
        return updatedUser;
    }, { successMessage: "Seu perfil foi atualizado com sucesso!" }), [apiRequest, user, updateUser]);


    return {
        loading,
        getPatients,
        getPatientById,
        getPatientDetails,
        createPatient,
        searchPatientsAndContacts,
        getLeads,
        getContacts,
        createContact,
        checkPhoneExists,
        getAppointments,
        getAppointmentsForDay,
        getAppointmentsForToday,
        getAppointmentsForWeek,
        addAppointment,
        updateAppointment,
        updateAppointmentStatus,
        addSurgery,
        getHospitals,
        getSurgeryTypes,
        getBudgets,
        updateBudgetStatus,
        getAppointmentTypes,
        getSuggestedTime,
        checkTimeConflict,
        getJourneyProtocols,
        getDashboardStats,
        getWeeklyAppointmentStats,
        // Chat
        getConversations,
        getMessagesForConversation,
        sendMessage,
        getAiSuggestion,
        // Patient Portal
        getPatientDataForPortal,
        getPatientAppointmentsForPortal,
        getPatientDocumentsForPortal,
        getPatientHistoryForPortal,
        updatePatientProfile,
    };
};

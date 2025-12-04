
import { supabase } from '@/lib/customSupabaseClient';
import { handleApiError } from './utils';

const TABLE_NAME = 'appointments';

export const getAppointmentsForDay = async (day) => {
    const startOfDay = new Date(day);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(day);
    endOfDay.setHours(23, 59, 59, 999);

    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .gte('starts_at', startOfDay.toISOString())
            .lte('starts_at', endOfDay.toISOString())
            .order('starts_at', { ascending: true });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return handleApiError(error, 'getAppointmentsForDay');
    }
};

export const addAppointment = async (appointmentData) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert([appointmentData])
            .select();

        if (error) throw error;
        return { success: true, data: data[0] };
    } catch (error) {
        return handleApiError(error, 'addAppointment');
    }
};

export const updateAppointment = async (appointmentId, updatedData) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update(updatedData)
            .eq('id', appointmentId)
            .select();

        if (error) throw error;
        return { success: true, data: data[0] };
    } catch (error) {
        return handleApiError(error, 'updateAppointment');
    }
};

export const deleteAppointment = async (appointmentId) => {
    try {
        const { error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('id', appointmentId);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        return handleApiError(error, 'deleteAppointment');
    }
};


import { supabase } from '@/lib/customSupabaseClient';
import { handleApiError } from './utils';

const TABLE_NAME = 'patients';

export const getPatients = async (searchTerm = '', roleFilter = 'all') => {
    try {
        let query = supabase
            .from(TABLE_NAME)
            .select('*')
            .order('full_name', { ascending: true });

        if (searchTerm) {
            query = query.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`);
        }
        
        // This assumes you have a column to filter by role, e.g., 'status' or 'type'
        // Let's use 'current_status' as an example, since it exists on the table.
        if (roleFilter && roleFilter !== 'all') {
             // Assuming 'contato' and 'paciente' map to values in 'current_status'
            query = query.eq('current_status', roleFilter);
        }

        const { data, error } = await query;
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return handleApiError(error, 'getPatients');
    }
};

export const getPatientById = async (id) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return handleApiError(error, 'getPatientById');
    }
};

export const addPatient = async (patientData) => {
    try {
        // Ensure required fields are present
        const dataToInsert = {
            full_name: patientData.full_name,
            email: patientData.email,
            phone: patientData.phone,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            current_status: 'contato', // Default status
            ...patientData,
        };

        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert([dataToInsert])
            .select()
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return handleApiError(error, 'addPatient');
    }
};

export const updatePatient = async (id, patientData) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update({ ...patientData, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return handleApiError(error, 'updatePatient');
    }
};

export const deletePatient = async (id) => {
    try {
        const { error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        return handleApiError(error, 'deletePatient');
    }
};

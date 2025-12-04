
import { supabase } from '@/lib/customSupabaseClient';
import { handleApiError } from './utils';

const TABLE_NAME = 'consultation_types';

export const getConsultationTypes = async () => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;
        return data;
    } catch (error) {
        handleApiError(error, 'getConsultationTypes');
        return [];
    }
};

export const saveConsultationType = async (typeData) => {
    try {
        const upsertData = {
            ...typeData,
            updated_at: new Date().toISOString(),
        };

        // If id is provided, it's an update. If not, it's an insert and Supabase will generate the UUID.
        if (!upsertData.id) {
            delete upsertData.id;
        }
        
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .upsert(upsertData)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        throw handleApiError(error, 'saveConsultationType');
    }
};

export const deleteConsultationType = async (typeId) => {
    try {
        const { error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('id', typeId);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        throw handleApiError(error, 'deleteConsultationType');
    }
};

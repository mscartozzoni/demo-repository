
import { supabase } from '@/lib/customSupabaseClient';
import { handleApiError } from './utils';

const TABLE_NAME = 'documents';

export const getAllDocuments = async () => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select(`
                *,
                patient:patients(full_name)
            `)
            .order('updated_at', { ascending: false });

        if (error) throw error;
        
        // Supabase returns patient as an object { full_name: "..." } or null. Let's flatten it.
        const processedData = data.map(doc => ({
            ...doc,
            patient: doc.patient ? { full_name: doc.patient.full_name } : { full_name: 'N/A' }
        }));

        return { success: true, data: processedData };
    } catch (error) {
        return handleApiError(error, 'getAllDocuments');
    }
};

export const getDocumentsByPatient = async (patientId) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('patient_id', patientId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return handleApiError(error, 'getDocumentsByPatient');
    }
};

export const addDocument = async (docData) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert([docData])
            .select()
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return handleApiError(error, 'addDocument');
    }
};

export const updateDocument = async (docId, updatedData) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update({ ...updatedData, updated_at: new Date().toISOString() })
            .eq('id', docId)
            .select()
            .single();
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return handleApiError(error, 'updateDocument');
    }
};

export const deleteDocument = async (docId) => {
    try {
        const { error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('id', docId);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        return handleApiError(error, 'deleteDocument');
    }
};

export const getDocumentById = async (docId) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('id', docId)
            .single();
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return handleApiError(error, 'getDocumentById');
    }
};

export const uploadDocumentFile = async (filePath, file, fileOptions) => {
    try {
        const { data, error } = await supabase.storage
            .from('documents')
            .upload(filePath, file, fileOptions);

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return handleApiError(error, 'uploadDocumentFile');
    }
};

export const getDocumentDownloadUrl = async (filePath) => {
    try {
        const { data, error } = supabase.storage
            .from('documents')
            .getPublicUrl(filePath);

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return handleApiError(error, 'getDocumentDownloadUrl');
    }
};

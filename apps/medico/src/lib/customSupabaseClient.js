import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gnawourfpbsqernpucso.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduYXdvdXJmcGJzcWVybnB1Y3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5MTI4NTUsImV4cCI6MjA3NjQ4ODg1NX0.wgqvKrG-wgQsP-8F4keP_MSxCAD4assR7lMSAM0o5t8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

import { useCallback } from 'react';
import { useData } from '@/contexts/DataContext';
import { supabase } from '@/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

export const useEmailClient = () => {
  const dataContext = useData();
  const toastContext = useToast();

  const sendEmail = useCallback(async ({ recipient, subject, body, patient_id }) => {
    if (!dataContext || !toastContext) return;
    const { addLogEntry, setEmailLogs, addMessage } = dataContext;
    const { toast } = toastContext;

    addLogEntry('Email Send', `Attempting to send email to ${recipient}.`);

    const { data, error } = await supabase.functions.invoke('send-email', {
      body: { to: recipient, subject, html: body },
    });

    const newLog = {
      id: `email_${Date.now()}`,
      recipient,
      subject,
      status: error ? 'failed' : 'sent',
      timestamp: new Date().toISOString(),
    };
    setEmailLogs(prev => [newLog, ...prev]);

    if (error) {
      console.error('Error sending email:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error Sending Email',
        description: `Failed to send email: ${error.message}`,
      });
      addLogEntry('Email Send Failed', `Failed to send email to ${recipient}. Error: ${error.message}`);
      throw new Error(error.message);
    }

    if (patient_id) {
       const sentMessage = {
         patient_id,
         content: `Email sent to ${recipient}: "${subject}"`,
         type: 'internal_note',
         from: 'system',
         status: 'sent',
         priority: 'baixa',
         is_new_patient: false,
         patient_name: ''
       };
       await addMessage(sentMessage);
    }
    
    toast({
      title: 'Email Sent (Simulation)',
      description: `Email has been queued for sending to ${recipient}.`,
    });
    addLogEntry('Email Sent', `Email successfully queued for ${recipient}.`);

    return data;
  }, [dataContext, toastContext]);
  
  const receiveEmail = useCallback(async ({ from_email, from_name, subject, body, to_patient_id }) => {
     if (!dataContext) return;
     const { addLogEntry, addMessage } = dataContext;

     console.log(`SIMULATING EMAIL RECEIVE from ${from_email}`);
      const newMessage = {
        patient_id: to_patient_id,
        patient_name: from_name,
        message: `${subject}\n---\n${body}`,
        type: 'communication',
        status: 'new',
        priority: 'baixa',
        is_new_patient: false,
        from: from_email,
     };
     await addMessage(newMessage);
     addLogEntry('Email Received', `New email received from ${from_email}.`);
  }, [dataContext]);

  return { sendEmail, receiveEmail };
};

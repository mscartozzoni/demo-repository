
import { useEffect, useCallback } from 'react';
import { useEmailClient } from './useEmailClient';
import { useData } from '@/contexts/DataContext';

export const useEmailSync = (interval = 60000) => {
  const { receiveEmail } = useEmailClient();
  const dataContext = useData();

  const checkAndSyncEmails = useCallback(async () => {
    if (!dataContext || !receiveEmail) return;

    const { loading, contacts } = dataContext;
    if (loading || !contacts || contacts.length === 0) return;

    console.log('Simulating IMAP poll for new emails...');
    
    const shouldReceive = Math.random() > 0.8;
    if (shouldReceive) {
      const randomContact = contacts[Math.floor(Math.random() * contacts.length)];
      
      const simulatedEmail = {
        from_email: `${randomContact.name.split(' ')[0].toLowerCase()}@example.com`,
        from_name: randomContact.name,
        subject: `Re: Consulta ${Math.floor(Math.random() * 100)}`,
        body: `Olá, gostaria de saber mais detalhes sobre o procedimento. \n\nObrigado,\n${randomContact.name}`,
        to_patient_id: randomContact.patient_id,
      };

      console.log('Simulated new email received:', simulatedEmail);
      await receiveEmail(simulatedEmail);
    }
  }, [receiveEmail, dataContext]);

  useEffect(() => {
    const intervalId = setInterval(checkAndSyncEmails, interval);
    return () => clearInterval(intervalId);
  }, [checkAndSyncEmails, interval]);
};


import React, { useEffect, useCallback } from 'react';
import { supabase } from '@/supabaseClient';

export const useRealtimeData = ({
  onNewMessage,
  onUpdateMessage,
  onNewContact,
  onUpdateContact
}) => {
  const handleMessageInsert = useCallback((payload) => {
    console.log('Real-time: New message received', payload.new);
    if (onNewMessage) onNewMessage(payload.new);
  }, [onNewMessage]);
  
  const handleMessageUpdate = useCallback((payload) => {
    console.log('Real-time: Message updated', payload.new);
    if (onUpdateMessage) onUpdateMessage(payload.new);
  }, [onUpdateMessage]);

  const handleContactInsert = useCallback((payload) => {
    console.log('Real-time: New contact', payload.new);
    if (onNewContact) onNewContact(payload.new);
  }, [onNewContact]);

  const handleContactUpdate = useCallback((payload) => {
    console.log('Real-time: Contact updated', payload.new);
    if (onUpdateContact) onUpdateContact(payload.new);
  }, [onUpdateContact]);


  useEffect(() => {
    const messagesChannel = supabase
      .channel('public:inbox_messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'inbox_messages' }, handleMessageInsert)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'inbox_messages' }, handleMessageUpdate)
      .subscribe();

    const contactsChannel = supabase
      .channel('public:inbox_contacts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'inbox_contacts' }, handleContactInsert)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'inbox_contacts' }, handleContactUpdate)
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(contactsChannel);
    };
  }, [handleMessageInsert, handleMessageUpdate, handleContactInsert, handleContactUpdate]);
};

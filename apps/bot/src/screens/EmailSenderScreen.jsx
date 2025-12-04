
import React from 'react';
import EmailForm from '@/components/EmailForm';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const EmailSenderScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Helmet>
        <title>Disparador de E-mail - Gestão IA</title>
        <meta name="description" content="Envie e-mails diretamente do sistema." />
      </Helmet>
      <EmailForm />
    </motion.div>
  );
};

export default EmailSenderScreen;

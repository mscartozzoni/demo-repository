import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const Bot = () => {
  const botUrl = "https://yellowgreen-fox-917634.hostingersite.com";

  return (
    <>
      <Helmet>
        <title>Bot Gestão IA - Portal Unificado</title>
        <meta name="description" content="Plataforma integrada de comunicação e gestão de leads." />
      </Helmet>
      <motion.div
        className="h-full w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <iframe
          src={botUrl}
          title="Bot Gestão IA"
          className="w-full h-full border-0 rounded-lg"
          allow="fullscreen; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </motion.div>
    </>
  );
};

export default Bot;
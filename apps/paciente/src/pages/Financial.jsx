import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const Financial = () => {
  return (
    <>
      <Helmet>
        <title>Gestão Financeira - Portal Unificado</title>
        <meta name="description" content="Dashboard financeiro integrado." />
      </Helmet>
      <motion.div 
        className="h-full w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <iframe
          src="https://lightgrey-falcon-767774.hostingersite.com/dashboard"
          title="Gestão Financeira"
          className="w-full h-full border-0 rounded-lg"
          allow="fullscreen"
        />
      </motion.div>
    </>
  );
};

export default Financial;
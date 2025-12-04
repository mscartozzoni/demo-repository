import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 p-6 md:p-8 ml-0 md:ml-64"
      >
        {children}
      </motion.main>
    </div>
  );
};

export default Layout;
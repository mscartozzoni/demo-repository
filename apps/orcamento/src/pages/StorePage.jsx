import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import ProductsList from '@/components/ProductsList';

const StorePage = () => {
  return (
    <>
      <Helmet>
        <title>Loja - MediBudget Pro</title>
        <meta name="description" content="Explore nossos produtos exclusivos." />
      </Helmet>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-extrabold tracking-tight text-center gradient-text">
            Nossa Loja Exclusiva
          </h1>
          <p className="mt-4 text-lg text-center text-muted-foreground max-w-2xl mx-auto">
            Descubra uma seleção de produtos cuidadosamente escolhidos para complementar sua jornada de bem-estar e beleza.
          </p>
        </motion.div>
        
        <ProductsList />
      </div>
    </>
  );
};

export default StorePage;
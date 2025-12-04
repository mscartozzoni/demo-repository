import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingBag } from 'lucide-react';

const SuccessPage = () => {
  return (
    <>
      <Helmet>
        <title>Compra Realizada com Sucesso!</title>
        <meta name="description" content="Página de confirmação de compra." />
      </Helmet>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
          className="glass-effect rounded-3xl p-10 md:p-16 shadow-2xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            <CheckCircle className="w-24 h-24 text-green-500 dark:text-green-400 mx-auto" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mt-6">
            Pagamento Aprovado!
          </h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-md mx-auto">
            Sua compra foi realizada com sucesso. Agradecemos pela sua confiança! Em breve você receberá um e-mail com os detalhes do pedido.
          </p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Link to="/store">
              <Button className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 text-lg">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Continuar Comprando
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default SuccessPage;
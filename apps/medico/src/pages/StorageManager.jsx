import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Helmet } from 'react-helmet';

const StorageManager = () => {
  const { toast } = useToast();

  const listBuckets = () => {
    toast({
      variant: "destructive",
      title: "Supabase Desconectado",
      description: "Esta funcionalidade requer a integração com o Supabase Storage, que foi removida.",
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
        <Helmet>
            <title>Gerenciador de Storage - Portal do Médico</title>
            <meta name="description" content="Gerencie seus buckets de armazenamento." />
        </Helmet>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="bg-slate-800/50 border-slate-700 text-white">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Gerenciador de Storage</CardTitle>
                    <p className="text-slate-400">Esta funcionalidade está desativada pois o Supabase foi removido.</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button
                        onClick={listBuckets}
                        disabled={true}
                        className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold"
                    >
                        Listar Buckets
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    </div>
  );
};

export default StorageManager;
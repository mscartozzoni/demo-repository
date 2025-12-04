import React from 'react';
    import { Helmet } from 'react-helmet-async';
    import { motion } from 'framer-motion';
    import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
    import { FileText } from 'lucide-react';

    const ClinicalNotes = () => {
      return (
        <>
          <Helmet>
            <title>Prontuário - Portal Médico</title>
            <meta name="description" content="Acesse e gerencie os prontuários e notas clínicas dos pacientes." />
          </Helmet>
          <div className="space-y-8">
            <motion.h1 
                className="text-3xl font-bold gradient-text"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Prontuário Eletrônico
            </motion.h1>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Card className="glass-effect">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="text-blue-400" />
                            <span>Módulo em Desenvolvimento</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-10 flex flex-col items-center justify-center h-full">
                            <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                            <p className="text-xl font-semibold text-gray-300 mb-2">Página de Prontuários</p>
                            <p className="text-gray-400">Esta área será dedicada à visualização e criação de prontuários e notas clínicas dos pacientes.</p>
                            <p className="text-gray-400 mt-1">É um recurso exclusivo para o perfil de médico.</p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
          </div>
        </>
      );
    };

    export default ClinicalNotes;
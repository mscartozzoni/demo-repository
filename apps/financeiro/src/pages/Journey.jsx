import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Journey = () => {
    const { toast } = useToast();
    return (
        <motion.div
            key="journey"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            <div className="text-center py-20">
                <Users className="h-16 w-16 text-purple-300 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-white mb-2">Jornada do Paciente</h3>
                <p className="text-purple-200 mb-6">Acompanhamento completo da jornada do paciente com prazos</p>
                <Button onClick={() => toast({ title: "🚧 Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀" })}>
                    Visualizar Jornadas
                </Button>
            </div>
        </motion.div>
    );
};

export default Journey;
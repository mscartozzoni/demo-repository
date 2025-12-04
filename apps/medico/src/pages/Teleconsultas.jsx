import React from 'react';
import { motion } from 'framer-motion';
import { Video, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Teleconsultas = () => {
  const { profile } = useAuth();
  const roomUrl = import.meta.env.VITE_WHEREBY_ROOM_URL || "https://whereby.com/drmarcioscartozzoni";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Video className="w-8 h-8 text-blue-400" />
            Sala de Teleconsulta
          </h1>
          <p className="text-slate-400 mt-2">Sua sala de reuniões virtual principal para atendimentos online.</p>
        </div>
      </div>

      <div className="glass-effect rounded-xl overflow-hidden aspect-video">
        {roomUrl ? (
          <iframe
            src={`${roomUrl}?lang=pt&displayName=${encodeURIComponent(profile?.name || 'Médico')}&background=off`}
            allow="camera; microphone; fullscreen; speaker; display-capture"
            className="w-full h-full border-0"
            title="Sala de Teleconsulta Whereby"
          ></iframe>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-800">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            <p className="ml-4 text-slate-300">Carregando sala de teleconsulta...</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Teleconsultas;
import React from 'react';
import { motion } from 'framer-motion';
import { User, Sparkles } from 'lucide-react';

const ChatMessage = ({ message }) => {
  const isAssistant = message.type === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isAssistant ? '' : 'flex-row-reverse'}`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isAssistant 
          ? 'bg-gradient-to-br from-purple-500 to-blue-600' 
          : 'bg-gradient-to-br from-slate-600 to-slate-700'
      }`}>
        {isAssistant ? (
          <Sparkles className="w-4 h-4 text-white" />
        ) : (
          <User className="w-4 h-4 text-white" />
        )}
      </div>
      
      <div className={`flex-1 max-w-[80%] ${isAssistant ? '' : 'flex justify-end'}`}>
        <div className={`p-4 rounded-2xl ${
          isAssistant 
            ? 'bg-white/70 text-slate-800' 
            : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
        }`}>
          <p className="text-sm leading-relaxed">{message.content}</p>
          <p className={`text-xs mt-2 ${isAssistant ? 'text-slate-500' : 'text-purple-100'}`}>
            {new Date(message.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
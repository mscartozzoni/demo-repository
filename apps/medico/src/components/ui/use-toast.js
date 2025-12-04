
import * as React from 'react';
import { ToastContext } from '@/components/ui/ToastProvider';

const useToast = () => {
  const context = React.useContext(ToastContext);

  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};

// Mantendo uma função 'toast' de fallback para evitar quebras se chamada fora do contexto,
// embora a verificação em `useToast` seja a guarda principal.
const toast = () => {
    throw new Error('toast() function must be used within a ToastProvider');
}

export { useToast, toast };

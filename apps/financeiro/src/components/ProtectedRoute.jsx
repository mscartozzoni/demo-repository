import React from 'react';
import { useSession } from '@/contexts/SessionContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { loading } = useSession();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Carregando portal...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
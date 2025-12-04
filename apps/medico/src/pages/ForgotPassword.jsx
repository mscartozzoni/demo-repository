
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { sendPasswordResetEmail } = useAuth();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    await sendPasswordResetEmail(email);

    toast({
      title: "E-mail de redefinição enviado!",
      description: "Verifique sua caixa de entrada para as instruções de redefinição de senha.",
    });
    setLoading(false);
    navigate('/login');
  };

  return (
    <>
      <Helmet>
        <title>Esqueceu a Senha - Portal Clínico</title>
        <meta name="description" content="Redefina sua senha para acessar o Portal Clínico." />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 p-4">
        <div className="glass-effect p-8 rounded-lg shadow-lg w-full max-w-md text-white border border-slate-700">
          <h1 className="text-3xl font-bold text-center mb-6">Redefinir Senha</h1>
          <p className="text-center text-slate-300 mb-8">
            Insira seu e-mail para receber um link de redefinição de senha.
          </p>
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-slate-200">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
              disabled={loading}
            >
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...</> : 'Enviar Link de Redefinição'}
            </Button>
          </form>
          <p className="mt-8 text-center text-slate-400">
            Lembrou da senha?{' '}
            <Button variant="link" onClick={() => navigate('/login')} className="text-blue-400 hover:text-blue-300 p-0 h-auto">
              Fazer Login
            </Button>
          </p>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;

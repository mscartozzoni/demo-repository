
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updatePassword } = useAuth();
  
  useEffect(() => {
    // Supabase automatically handles the access token from the URL hash
    // onAuthStateChange will fire with a SIGNED_IN event.
    // We can just check for the presence of the hash.
    if (window.location.hash.includes('access_token')) {
        setHasToken(true);
    }
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!hasToken) {
        toast({
            variant: "destructive",
            title: "Token inválido",
            description: "Use o link enviado para o seu e-mail.",
        });
        return;
    }
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Senhas não conferem",
        description: "Por favor, digite a mesma senha nos dois campos.",
      });
      return;
    }
    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Senha muito curta",
        description: "A senha deve ter no mínimo 6 caracteres.",
      });
      return;
    }
    setLoading(true);
    
    const { error } = await updatePassword(password);

    if (!error) {
        toast({
          title: "Senha redefinida com sucesso!",
          description: "Você já pode fazer login com sua nova senha.",
        });
        navigate('/auth/login', { replace: true });
    } else {
        toast({
            variant: "destructive",
            title: "Erro ao redefinir senha",
            description: error.message || "Tente novamente mais tarde.",
        });
    }

    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Redefinir Senha - Portal Clínico</title>
        <meta name="description" content="Redefina sua senha no Portal Clínico." />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-effect p-8 rounded-lg shadow-lg w-full max-w-md text-white border border-slate-700"
        >
          <h1 className="text-3xl font-bold text-center mb-6">Redefinir Senha</h1>
          <p className="text-center text-slate-300 mb-8">
            Digite sua nova senha abaixo.
          </p>
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <Label htmlFor="password" className="text-slate-200">Nova Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Sua nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password" className="text-slate-200">Confirmar Nova Senha</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirme sua nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
              disabled={loading || !hasToken}
            >
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Redefinindo...</> : 'Redefinir Senha'}
            </Button>
            {!hasToken && <p className="text-yellow-400 text-sm text-center">Abra esta página através do link enviado para o seu e-mail.</p>}
          </form>
          <p className="mt-8 text-center text-slate-400">
            Lembrou da senha?{' '}
            <Button variant="link" onClick={() => navigate('/auth/login')} className="text-blue-400 hover:text-blue-300 p-0 h-auto">
              Fazer Login
            </Button>
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default ResetPassword;

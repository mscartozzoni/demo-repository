
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn(email, password);
    if (result.success) {
      toast({
        title: "Login bem-sucedido!",
        description: result.message,
      });

      const userRole = result.user?.user_metadata?.role;
      if (userRole === 'autorizado') {
        navigate('/dashboard/paciente');
      } else if (userRole === 'secretary' || userRole === 'doctor') {
        navigate('/'); // This will be redirected to the correct admin dashboard by App.jsx
      } else {
        navigate('/');
      }
    } else {
      if (result.reason === 'not_found') {
        navigate('/auth/nao-cadastrado');
      } else {
        toast({
          variant: "destructive",
          title: "Falha no Login",
          description: result.message,
        });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-blue-900/50 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700 backdrop-blur-sm"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Bem-vindo de volta</h1>
          <p className="text-slate-400">Acesse sua conta para continuar</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2 relative">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-slate-400 hover:text-white"
              disabled={loading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <Button type="submit" className="w-full btn-primary" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Entrar'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;

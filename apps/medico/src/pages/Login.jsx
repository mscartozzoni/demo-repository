
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Bot, Mail, Lock, UserPlus, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha o e-mail e a senha.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    const { success, error } = await login(email, password);
    if (success) {
      toast({
        title: "Login bem-sucedido!",
        description: "Bem-vindo(a) de volta!",
      });
      // Navigation is handled by AppRoutes after profile loads
    } else {
       toast({
        variant: "destructive",
        title: "Falha no Login",
        description: error || "E-mail ou senha inválidos.",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>Login - Portal Clínico</title>
        <meta name="description" content="Faça login no Portal Clínico para gerenciar seus pacientes e compromissos." />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-effect p-8 rounded-lg shadow-lg w-full max-w-md text-white border border-slate-700 flex flex-col items-center"
        >
          <Bot className="h-16 w-16 text-blue-400 mb-4" />
          <h1 className="text-3xl font-bold text-center mb-2">Portal Clínico</h1>
          <p className="text-center text-slate-300 mb-6">
            Acesse sua conta para gerenciar sua clínica.
          </p>

          <form onSubmit={handleLogin} className="w-full space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700 focus:ring-blue-500"
                disabled={isSubmitting}
                autoComplete="email"
              />
            </div>
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-slate-700 focus:ring-blue-500"
                  disabled={isSubmitting}
                  autoComplete="current-password"
                />
              </div>
              <div className="text-right mt-2">
                <Button
                  type="button"
                  variant="link"
                  className="text-slate-400 hover:text-blue-300 text-xs h-auto p-0"
                  onClick={() => navigate('/forgot-password')}
                >
                  Esqueci a senha
                </Button>
              </div>
            </div>
             <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Entrar'}
              </Button>
          </form>

          <div className="flex items-center w-full my-6">
            <hr className="flex-grow border-slate-600"/>
            <span className="mx-4 text-slate-400 text-sm">OU</span>
            <hr className="flex-grow border-slate-600"/>
          </div>

          <Button 
            variant="outline" 
            className="w-full bg-transparent border-slate-600 hover:bg-slate-800"
            onClick={() => navigate('/register')}
            disabled={isSubmitting}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Criar Nova Conta
          </Button>

          <p className="mt-8 text-center text-xs text-slate-500">
            Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade.
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default Login;

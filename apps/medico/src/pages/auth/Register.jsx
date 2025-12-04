
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { success, error } = await register({ email, password, fullName });

    if (success) {
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Enviamos um e-mail de confirmação. Por favor, verifique sua caixa de entrada.",
      });
      // Don't navigate immediately. Let user confirm email.
    } else {
       toast({
        variant: "destructive",
        title: "Falha no Cadastro",
        description: error || "Ocorreu um erro desconhecido. Tente novamente.",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>Cadastro - Portal Clínico</title>
        <meta name="description" content="Crie sua conta no Portal Clínico." />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-effect p-8 rounded-lg shadow-lg w-full max-w-md text-white border border-slate-700 relative"
        >
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 left-4 text-slate-300 hover:bg-slate-800 hover:text-white"
            onClick={() => navigate('/auth/login')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold text-center mb-2 mt-8">Criar Conta</h1>
            <p className="text-center text-slate-300 mb-6">
              Comece a gerenciar sua clínica hoje mesmo.
            </p>
          </div>

          <form onSubmit={handleRegister} className="w-full space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Nome Completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700 focus:ring-blue-500"
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700 focus:ring-blue-500"
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="password"
                placeholder="Senha (mínimo 6 caracteres)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700 focus:ring-blue-500"
                disabled={isSubmitting}
                required
                minLength="6"
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Criar Conta'}
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-500">
            Ao se cadastrar, você concorda com nossos Termos de Serviço e Política de Privacidade.
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default Register;

import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {
    login,
    user
  } = useAuth();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const handleSubmit = e => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha email e senha.",
        variant: "destructive"
      });
      return;
    }
    login(email, password);
    toast({
      title: "Login realizado! 🎉",
      description: "Bem-vindo ao Meu Assistente Clínico"
    });
    const storedUser = JSON.parse(localStorage.getItem('clinic_user'));
    if (storedUser && storedUser.onboardingComplete) {
      navigate('/dashboard');
    } else {
      navigate('/onboarding');
    }
  };
  return <>
      <Helmet>
        <title>Login - Meu Assistente Clínico</title>
        <meta name="description" content="Acesse seu assistente IA confidencial para gestão inteligente de pacientes" />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }} className="w-full max-w-md">
          <div className="glass-effect rounded-2xl p-8 space-y-6">
            <div className="text-center space-y-2">
              <motion.div initial={{
              scale: 0
            }} animate={{
              scale: 1
            }} transition={{
              delay: 0.2,
              type: "spring"
            }} className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Meu Assistente Clínico
              </h1>
              <p className="text-slate-600">Gestão inteligente e confidencial de pacientes</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} className="transition-all focus:ring-2 focus:ring-purple-500" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Senha
                </Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="transition-all focus:ring-2 focus:ring-purple-500" />
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105">Entrar Dr. Marcio Scartozzoni</Button>
            </form>

            <div className="text-center text-sm text-slate-500">
              <p className="flex items-center justify-center gap-2">
                <Lock className="w-3 h-3" />
                Autenticação segura com criptografia
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>;
};
export default LoginPage;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calculator, User, Mail, Lock, Loader2, UserPlus } from 'lucide-react';
import { useSession } from '@/contexts/SessionContext';
import { useToast } from '@/components/ui/use-toast';
import { Link, useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const { signUp } = useSession();
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6 || formData.password.trim() === '') {
        toast({
            variant: "destructive",
            title: "Senha inválida",
            description: "A senha deve ter pelo menos 6 caracteres e não pode estar em branco.",
        });
        return;
    }
    if (formData.fullName.trim() === '' || formData.email.trim() === '') {
        toast({
            variant: "destructive",
            title: "Campos obrigatórios",
            description: "Nome completo e e-mail são obrigatórios.",
        });
        return;
    }

    setLoading(true);
    const { data, error } = await signUp(formData.fullName, formData.email, formData.password);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro no Cadastro",
        description: error.message,
      });
      setLoading(false);
    } else {
        toast({
            title: "Cadastro realizado com sucesso!",
            description: data.message,
        });
        navigate('/login');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 text-center text-white">
          <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full">
                <Calculator className="h-10 w-10 text-white" />
              </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">Crie sua Conta</h1>
          <p className="text-purple-200 mb-8">Junte-se ao Portal Financeiro.</p>

          <motion.form onSubmit={handleSignup} className="space-y-6">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-300" />
              <Input name="fullName" type="text" placeholder="Nome completo" value={formData.fullName} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-white/10 border-white/20 rounded-lg text-white placeholder:text-purple-300 focus:ring-purple-500" />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-300" />
              <Input name="email" type="email" placeholder="Seu e-mail" value={formData.email} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-white/10 border-white/20 rounded-lg text-white placeholder:text-purple-300 focus:ring-purple-500" />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-300" />
              <Input name="password" type="password" placeholder="Crie uma senha (mín. 6 caracteres)" value={formData.password} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-white/10 border-white/20 rounded-lg text-white placeholder:text-purple-300 focus:ring-purple-500" />
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button type="submit" size="lg" className="w-full text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <UserPlus className="mr-2 h-5 w-5" />}
                Cadastrar
              </Button>
            </motion.div>
          </motion.form>

          <div className="mt-8 text-center">
            <p className="text-purple-200">
              Já tem uma conta?{' '}
              <Link to="/login" className="font-semibold text-white hover:underline">
                Faça o login
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
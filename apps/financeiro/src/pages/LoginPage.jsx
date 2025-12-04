import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calculator, LogIn, Mail, Lock, Loader2, Sparkles, Wand2, UserPlus } from 'lucide-react';
import { useSession } from '@/contexts/SessionContext';
import { useToast } from '@/components/ui/use-toast';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { signInWithPassword, signInWithOtp } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [loginMode, setLoginMode] = useState('password'); // 'password' or 'magiclink'
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signInWithPassword(email, password);
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro no Login",
        description: error.message,
      });
      setLoading(false);
    } else {
      navigate('/patients');
    }
  };

  const handleMagicLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signInWithOtp(email);
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao Enviar Link",
        description: error.message,
      });
    } else {
      setEmailSent(true);
      toast({
        title: "Verifique seu E-mail",
        description: "Enviamos um link mágico para você acessar o portal.",
      });
    }
    setLoading(false);
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
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
          
          <h1 className="text-3xl font-bold mb-2">Portal Financeiro</h1>
          <p className="text-purple-200 mb-8">Gestão Integrada para sua Clínica.</p>

          {emailSent ? (
            <div className="text-center p-4 bg-green-500/20 rounded-lg">
              <h3 className="font-bold text-lg text-green-300">Link enviado!</h3>
              <p className="text-green-200">Verifique sua caixa de entrada (e spam) para acessar.</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {loginMode === 'password' ? (
                <motion.form key="password" variants={formVariants} initial="hidden" animate="visible" exit="exit" onSubmit={handlePasswordLogin} className="space-y-6">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-300" />
                    <Input type="email" placeholder="Seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-10 pr-4 py-3 bg-white/10 border-white/20 rounded-lg text-white placeholder:text-purple-300 focus:ring-purple-500" />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-300" />
                    <Input type="password" placeholder="Sua senha" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full pl-10 pr-4 py-3 bg-white/10 border-white/20 rounded-lg text-white placeholder:text-purple-300 focus:ring-purple-500" />
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button type="submit" size="lg" className="w-full text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <LogIn className="mr-2 h-5 w-5" />}
                      Entrar
                    </Button>
                  </motion.div>
                   <Button variant="link" className="text-purple-300" onClick={() => setLoginMode('magiclink')}>Ou entre com um link mágico <Wand2 className="ml-2 h-4 w-4" /></Button>
                </motion.form>
              ) : (
                 <motion.form key="magiclink" variants={formVariants} initial="hidden" animate="visible" exit="exit" onSubmit={handleMagicLink} className="space-y-6">
                   <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-300" />
                    <Input type="email" placeholder="Seu e-mail para receber o link" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-10 pr-4 py-3 bg-white/10 border-white/20 rounded-lg text-white placeholder:text-purple-300 focus:ring-purple-500" />
                  </div>
                   <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button type="submit" size="lg" className="w-full text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600" disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                      Enviar Link Mágico
                    </Button>
                  </motion.div>
                  <Button variant="link" className="text-purple-300" onClick={() => setLoginMode('password')}>Voltar para login com senha</Button>
                 </motion.form>
              )}
            </AnimatePresence>
          )}

          <div className="mt-8 text-center">
            <p className="text-purple-200">
              Não tem uma conta?{' '}
              <Link to="/signup" className="font-semibold text-white hover:underline">
                Cadastre-se <UserPlus className="inline ml-1 h-4 w-4" />
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
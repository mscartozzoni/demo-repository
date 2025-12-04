import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mic, Play, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const OnboardingPage = () => {
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState('');
  const [personality, setPersonality] = useState('authoritative');
  const { completeOnboarding } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNext = () => {
    if (step === 1 && !userName.trim()) {
      toast({
        title: "Nome é obrigatório",
        description: "Por favor, diga-nos como devemos chamá-lo.",
        variant: "destructive",
      });
      return;
    }
    setStep(s => s + 1);
  };

  const handleFinish = () => {
    const settings = {
      voiceEnabled: true,
      voiceSpeed: 0.9,
      voicePitch: 0.9,
      personality: personality,
      proactiveAlerts: true,
      marketingSuggestions: true,
      emailReports: true
    };
    completeOnboarding(userName, settings);
    toast({
      title: `Bem-vindo(a), ${userName}!`,
      description: "Seu assistente clínico foi configurado com sucesso.",
    });
    navigate('/dashboard');
  };
  
  const playTestVoice = () => {
      if ('speechSynthesis' in window) {
        const text = `Olá, ${userName || 'Doutor(a)'}. Eu sou seu assistente clínico. Com um tom ${personality === 'authoritative' ? 'amigável e autoritário' : 'empático e compreensivo'}, estou pronto para otimizar a gestão da sua clínica.`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.9;
        utterance.pitch = 0.9;
        
        const voices = window.speechSynthesis.getVoices();
        const ptBrVoice = voices.find(voice => voice.lang === 'pt-BR' && voice.name.includes('Male'));
        if (ptBrVoice) {
          utterance.voice = ptBrVoice;
        }
        
        window.speechSynthesis.speak(utterance);
      } else {
        toast({
          title: "Recurso não disponível",
          description: "Seu navegador não suporta síntese de voz.",
          variant: "destructive"
        });
      }
  };

  return (
    <>
      <Helmet>
        <title>Configuração Inicial - Meu Assistente Clínico</title>
        <meta name="description" content="Configure seu assistente clínico pessoal." />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg glass-effect rounded-2xl p-8 space-y-6"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Configuração Inicial
            </h1>
            <p className="text-slate-600">Vamos personalizar seu assistente clínico.</p>
          </div>
          
          <div className="flex items-center justify-center gap-4 my-4">
              <div className={`w-3 h-3 rounded-full transition-colors ${step >= 1 ? 'bg-purple-600' : 'bg-slate-300'}`}></div>
              <div className={`w-3 h-3 rounded-full transition-colors ${step >= 2 ? 'bg-purple-600' : 'bg-slate-300'}`}></div>
          </div>

          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userName" className="flex items-center gap-2 text-lg">
                  <User className="w-5 h-5" />
                  Como podemos chamá-lo(a)?
                </Label>
                <Input
                  id="userName"
                  type="text"
                  placeholder="Ex: Dr. Márcio"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="transition-all focus:ring-2 focus:ring-purple-500 text-base p-4"
                />
              </div>
              <Button onClick={handleNext} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Próximo <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-lg">
                  <Mic className="w-5 h-5" />
                  Personalidade e Voz do Assistente
                </Label>
                <p className="text-sm text-slate-500">Escolha o tom de comunicação do seu assistente.</p>
                <Select value={personality} onValueChange={setPersonality}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="authoritative">Amigável, mas autoritário</SelectItem>
                    <SelectItem value="empathetic">Empático e compreensivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-center">
                 <Button onClick={playTestVoice} variant="outline">
                    <Play className="w-4 h-4 mr-2" />
                    Testar Voz
                 </Button>
              </div>
              <Button onClick={handleFinish} className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
                Concluir Configuração
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default OnboardingPage;
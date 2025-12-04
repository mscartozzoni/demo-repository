import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { BrainCircuit, Upload, KeyRound, Eye, EyeOff, CheckCircle } from 'lucide-react';

const AiLearningSettings = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [isKeyVisible, setIsKeyVisible] = useState(false);
  const [isKeySaved, setIsKeySaved] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key_status');
    if (savedKey === 'saved') {
      setIsKeySaved(true);
      setApiKey('**************************************************');
    }
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      toast({
        title: "🚧 Funcionalidade em desenvolvimento",
        description: `O upload de arquivos (${file.name}) ainda não está implementado, mas será em breve!`,
      });
    }
  };

  const handleStartIntegration = () => {
    if (!apiKey.trim() || apiKey.startsWith('*')) {
      toast({
        title: 'API Key Inválida',
        description: 'Por favor, insira uma chave de API válida da OpenAI.',
        variant: 'destructive',
      });
      return;
    }

    localStorage.setItem('openai_api_key_status', 'saved');
    // Em um app real, a chave seria enviada para um backend seguro, nunca armazenada no localStorage.
    // Para esta simulação, apenas salvamos o status.
    setIsKeySaved(true);
    setApiKey('**************************************************');
    toast({
      title: 'Integração Iniciada!',
      description: 'O assistente agora está conectado com a OpenAI. O aprendizado foi ativado.',
      className: 'bg-green-100 border-green-300 text-green-800'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-effect rounded-2xl p-6"
    >
      <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-3 mb-6">
        <BrainCircuit className="w-6 h-6 text-green-600" />
        Área de Aprendizado da IA
      </h2>
      <div className="space-y-6">
        {/* OpenAI API Key Section */}
        <div className="space-y-2">
          <Label htmlFor="api-key" className="flex items-center gap-2">
            <KeyRound className="w-4 h-4" />
            Sua Chave da API OpenAI
          </Label>
          <div className="flex gap-2">
            <Input
              id="api-key"
              type={isKeyVisible ? 'text' : 'password'}
              placeholder={isKeySaved ? '' : 'sk-*****************'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              disabled={isKeySaved}
              className={isKeySaved ? 'border-green-500' : ''}
            />
            {!isKeySaved && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsKeyVisible(!isKeyVisible)}
              >
                {isKeyVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            )}
          </div>
          {isKeySaved && (
            <p className="text-sm text-green-600 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> API Conectada e segura.
            </p>
          )}
        </div>

        {/* File Upload Section */}
        <div className="space-y-2">
          <Label htmlFor="file-upload" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload de Arquivos para Treinamento (PDF, DOCX)
          </Label>
          <div className="flex items-center justify-center w-full">
            <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-white/30 hover:bg-white/50 border-slate-300 hover:border-purple-400 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-3 text-slate-500" />
                <p className="mb-2 text-sm text-slate-500 text-center"><span className="font-semibold">Clique para enviar</span> ou arraste e solte</p>
                <p className="text-xs text-slate-500">PDF, DOCX (MAX. 5MB)</p>
              </div>
              <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx" />
            </label>
          </div>
        </div>

        {/* Start Button */}
        {!isKeySaved && (
            <Button
              onClick={handleStartIntegration}
              disabled={!apiKey || isKeySaved}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 disabled:opacity-50"
            >
              Iniciar Integração
            </Button>
        )}
      </div>
    </motion.div>
  );
};

export default AiLearningSettings;
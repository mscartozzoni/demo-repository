
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Palette, ListChecks, ArrowRight, Settings, Link as LinkIcon, Save, Calendar, Video, CreditCard, KeyRound, Laptop as Notebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/App';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const themes = [
    { name: 'Padrão', value: 'theme-default', colors: ['#0f172a', '#3b82f6', '#1e293b'] },
    { name: 'Onda Azul', value: 'theme-blue-wave', colors: ['#0b132b', '#1c2541', '#3a506b'] },
    { name: 'Harmonia Verde', value: 'theme-green-harmony', colors: ['#1a2e39', '#2a9d8f', '#264653'] },
    { name: 'Névoa Púrpura', value: 'theme-purple-haze', colors: ['#231942', '#5e548e', '#9f86c0'] },
];

const AppearanceSettings = ({ onBack }) => {
    const { theme, setTheme } = useTheme();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        <div>
            <Helmet>
                <title>Configurações de Aparência - Portal do Médico</title>
                <meta name="description" content="Personalize a aparência do seu portal." />
            </Helmet>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Button variant="ghost" onClick={onBack} className="mb-4">
                    <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                    Voltar para Configurações
                </Button>
                <h1 className="text-4xl font-extrabold text-white">Configurações de Aparência</h1>
                <p className="text-lg text-slate-300 mt-2">
                    Ajuste o visual do seu portal para uma experiência única.
                </p>
            </motion.div>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mt-8 space-y-12"
            >
                <section>
                    <h2 className="text-2xl font-bold text-white flex items-center mb-6">
                        <Palette className="w-7 h-7 mr-3 text-primary" />
                        Tema Visual
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {themes.map((t) => (
                            <div
                                key={t.value}
                                onClick={() => setTheme(t.value)}
                                className={`relative rounded-xl p-4 cursor-pointer border-2 transition-all duration-300 ${
                                    theme === t.value ? 'border-primary scale-105' : 'border-slate-700 hover:border-slate-500'
                                }`}
                            >
                                {theme === t.value && (
                                    <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                                        <ArrowRight className="w-4 h-4 text-primary-foreground rotate-45" />
                                    </div>
                                )}
                                <div className="flex space-x-2 h-20 rounded-lg overflow-hidden mb-3">
                                    {t.colors.map(color => (
                                        <div key={color} className="w-1/3 h-full" style={{ backgroundColor: color }}></div>
                                    ))}
                                </div>
                                <p className="font-semibold text-center text-white">{t.name}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </motion.div>
        </div>
    )
}

const IntegrationSettings = ({ onBack }) => {
    const { toast } = useToast();
    const [googleCalendarUrl, setGoogleCalendarUrl] = useState('');
    const [googleClientId, setGoogleClientId] = useState('');

    useEffect(() => {
        const storedUrl = localStorage.getItem('googleCalendarUrl');
        if (storedUrl) {
            setGoogleCalendarUrl(storedUrl);
        }
        const storedClientId = localStorage.getItem('googleClientId');
        if (storedClientId) {
            setGoogleClientId(storedClientId);
        }
    }, []);

    const handleSave = (key, value, successMessage) => {
        localStorage.setItem(key, value);
        toast({
            title: 'Salvo com Sucesso!',
            description: successMessage,
            className: 'bg-green-600 text-white',
        });
    };
    
    return (
         <div>
            <Helmet>
                <title>Configurações de Integrações - Portal do Médico</title>
                <meta name="description" content="Gerencie as integrações do seu portal." />
            </Helmet>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Button variant="ghost" onClick={onBack} className="mb-4">
                    <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                    Voltar para Configurações
                </Button>
                <h1 className="text-4xl font-extrabold text-white">Configurações de Integrações</h1>
                <p className="text-lg text-slate-300 mt-2">
                    Conecte e gerencie serviços externos para ampliar as funcionalidades.
                </p>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-8 space-y-6"
            >
                {/* Google SSO */}
                <div className="glass-effect p-6 rounded-xl">
                    <div className="flex items-center gap-4 mb-4">
                        <KeyRound className="w-6 h-6 text-red-400" />
                        <h3 className="text-xl font-bold text-white">Google SSO (SAML)</h3>
                    </div>
                    <p className="text-slate-400 mb-4">Configure a autenticação via Google para um login seguro e simplificado.</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Input 
                            type="text"
                            placeholder="Google Client ID"
                            value={googleClientId}
                            onChange={(e) => setGoogleClientId(e.target.value)}
                            className="flex-grow"
                        />
                        <Button onClick={() => handleSave('googleClientId', googleClientId, 'O Client ID do Google foi salvo.')}>
                            <Save className="w-4 h-4 mr-2" />
                            Salvar
                        </Button>
                    </div>
                </div>

                {/* Google Calendar */}
                <div className="glass-effect p-6 rounded-xl">
                    <div className="flex items-center gap-4 mb-4">
                        <Calendar className="w-6 h-6 text-blue-400" />
                        <h3 className="text-xl font-bold text-white">Google Agenda</h3>
                    </div>
                    <p className="text-slate-400 mb-4">Adicione o link público do seu Google Agenda para acesso rápido na página da Agenda.</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Input 
                            type="text"
                            placeholder="https://calendar.app.google/..."
                            value={googleCalendarUrl}
                            onChange={(e) => setGoogleCalendarUrl(e.target.value)}
                            className="flex-grow"
                        />
                        <Button onClick={() => handleSave('googleCalendarUrl', googleCalendarUrl, 'O link do Google Agenda foi salvo.')}>
                            <Save className="w-4 h-4 mr-2" />
                            Salvar
                        </Button>
                    </div>
                </div>

                {/* Whereby */}
                <div className="glass-effect p-6 rounded-xl">
                    <div className="flex items-center gap-4 mb-2">
                        <Video className="w-6 h-6 text-purple-400" />
                        <h3 className="text-xl font-bold text-white">Whereby</h3>
                    </div>
                     <p className="text-slate-400">A integração com o Whereby está ativa para teleconsultas.</p>
                </div>
                
                {/* Stripe */}
                <div className="glass-effect p-6 rounded-xl">
                     <div className="flex items-center gap-4 mb-2">
                        <CreditCard className="w-6 h-6 text-green-400" />
                        <h3 className="text-xl font-bold text-white">Stripe</h3>
                    </div>
                    <p className="text-slate-400">Configurações de pagamento via Stripe (em breve).</p>
                </div>
            </motion.div>
         </div>
    );
};


const SettingsCard = ({ icon: Icon, title, description, path, onClick }) => {
    const navigate = useNavigate();
    const clickHandler = onClick ? onClick : () => navigate(path);

    return (
        <motion.div
            variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 }
            }}
            whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)' }}
            className="glass-effect rounded-xl p-6 flex flex-col cursor-pointer"
            onClick={clickHandler}
        >
            <div className="flex-grow">
                <div className="flex items-center gap-4 mb-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                        <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                </div>
                <p className="text-slate-400">{description}</p>
            </div>
            <div className="mt-6">
                <Button variant="ghost" className="text-primary hover:text-primary w-full justify-start p-0">
                    Acessar
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </motion.div>
    )
}

const AdminConfig = () => {
  const [activeTab, setActiveTab] = useState('hub'); // hub, appearance, integrations

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (activeTab === 'appearance') {
      return <AppearanceSettings onBack={() => setActiveTab('hub')} />;
  }

  if (activeTab === 'integrations') {
      return <IntegrationSettings onBack={() => setActiveTab('hub')} />;
  }

  return (
    <div>
      <Helmet>
        <title>Configurações - Portal do Médico</title>
        <meta name="description" content="Gerencie as configurações do seu portal." />
      </Helmet>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-4">
            <Settings className="w-10 h-10 text-primary" />
            <div>
                 <h1 className="text-4xl font-extrabold text-white">Configurações</h1>
                 <p className="text-lg text-slate-300 mt-2">
                    Gerencie os módulos e personalize a aparência do seu portal.
                 </p>
            </div>
        </div>
       
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
          <SettingsCard
              icon={Palette}
              title="Aparência"
              description="Personalize temas, cores e o estilo visual do seu portal para refletir sua identidade."
              path="#"
              onClick={() => setActiveTab('appearance')}
          />
          <SettingsCard
              icon={ListChecks}
              title="Painel de Ações"
              description="Visualize e gerencie todas as suas tarefas pendentes, checklists e ações em um único lugar."
              path="/medico/actions"
          />
           <SettingsCard
              icon={LinkIcon}
              title="Integrações"
              description="Gerencie as configurações de integrações externas como Whereby, Stripe, e Google Agenda."
              path="#"
              onClick={() => setActiveTab('integrations')}
          />
          <SettingsCard
              icon={Notebook}
              title="Configurações de Agenda"
              description="Gerencie os tipos de consulta, horários de atendimento e outras configurações da agenda."
              path="/medico/config/agenda"
          />
      </motion.div>
    </div>
  );
};

export default AdminConfig;

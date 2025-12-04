import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { User, Bell, Link, Mail, Key, Shield } from 'lucide-react';
import ProfileSettings from '@/components/settings/ProfileSettings';
import EmailConnection from '@/components/settings/EmailConnection';
import EmailLogs from '@/components/settings/EmailLogs';
import GoogleCalendarSettings from '@/components/settings/GoogleCalendarSettings'; 
import { Button } from '@/components/ui/button';

const settingsTabs = [
  { id: 'profile', name: 'Perfil', icon: User },
  { id: 'notifications', name: 'Notificações', icon: Bell },
  { id: 'integrations', name: 'Integrações', icon: Link },
  { id: 'email', name: 'E-mail', icon: Mail },
  { id: 'security', name: 'Segurança', icon: Key },
  { id: 'privacy', name: 'Privacidade', icon: Shield },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState('email');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'email':
        return (
          <>
            <EmailConnection />
            <EmailLogs />
          </>
        );
      case 'integrations':
        return (
          <>
            <GoogleCalendarSettings />
            {/* Outras integrações podem ser adicionadas aqui */}
          </>
        );
      default:
        return (
          <div className="text-center py-20 glass-effect rounded-lg">
            <h3 className="text-xl font-semibold">Em Breve</h3>
            <p className="text-gray-400 mt-2">Esta seção de configurações estará disponível em breve.</p>
          </div>
        );
    }
  };

  return (
    <>
      <Helmet>
        <title>Configurações - Portal Unificado</title>
        <meta name="description" content="Gerencie as configurações do seu perfil, notificações, e-mail e segurança." />
      </Helmet>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold gradient-text">Configurações</h1>
          <p className="text-gray-400 mt-1">Personalize sua experiência no portal.</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de Navegação */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:w-1/4"
          >
            <nav className="space-y-1">
              {settingsTabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'secondary' : 'ghost'}
                  className="w-full justify-start text-base py-6"
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon className="w-5 h-5 mr-3" />
                  {tab.name}
                </Button>
              ))}
            </nav>
          </motion.aside>

          {/* Conteúdo Principal */}
          <motion.main
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 space-y-6"
          >
            {renderContent()}
          </motion.main>
        </div>
      </div>
    </>
  );
};

export default Settings;
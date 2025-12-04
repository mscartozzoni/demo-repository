import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  User, 
  MessageSquare, 
  Shield, 
  ChevronRight, 
  Building2,
  UserCheck,
  Mail,
  Settings
} from 'lucide-react';

const AccountTypeSelector = ({ onSelectType, currentStep = 1 }) => {
  const [selectedType, setSelectedType] = useState(null);

  const accountTypes = [
    {
      id: 'general',
      title: 'Conta Geral',
      subtitle: 'Acesso básico ao sistema',
      description: 'Conta principal para acessar funcionalidades básicas da plataforma.',
      icon: User,
      color: 'bg-blue-500',
      step: 1,
      features: [
        'Acesso ao dashboard principal',
        'Visualização de dados gerais',
        'Perfil básico de usuário',
        'Configurações pessoais'
      ],
      permissions: ['read:dashboard', 'read:profile'],
      duration: 'Permanente'
    },
    {
      id: 'communication',
      title: 'Conta de Comunicação',
      subtitle: 'Acesso ao sistema de mensagens',
      description: 'Especializada para gestão de mensagens e comunicação com pacientes.',
      icon: MessageSquare,
      color: 'bg-green-500',
      step: 2,
      features: [
        'Inbox de mensagens por setor',
        'Resposta a pacientes',
        'Classificação e tags',
        'Relatórios de atendimento'
      ],
      permissions: ['read:messages', 'write:messages', 'manage:tags'],
      duration: 'Por tempo definido',
      sectorBased: true
    },
    {
      id: 'admin',
      title: 'Conta Administrativa',
      subtitle: 'Acesso completo ao sistema',
      description: 'Controle total sobre usuários, configurações e permissões.',
      icon: Shield,
      color: 'bg-purple-500',
      step: 3,
      features: [
        'Gestão de usuários',
        'Configurações do sistema',
        'Relatórios completos',
        'Controle de permissões'
      ],
      permissions: ['admin:all'],
      duration: 'Permanente',
      restricted: true
    }
  ];

  const handleSelectType = (type) => {
    setSelectedType(type);
    if (onSelectType) {
      onSelectType(type);
    }
  };

  const getStepStatus = (step) => {
    if (step < currentStep) return 'completed';
    if (step === currentStep) return 'current';
    return 'upcoming';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Escolha o Tipo de Conta</h2>
        <p className="text-muted-foreground">
          Selecione o nível de acesso apropriado para suas necessidades
        </p>
        <div className="flex items-center justify-center gap-2 mt-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  getStepStatus(step) === 'completed' 
                    ? 'bg-green-500 text-white' 
                    : getStepStatus(step) === 'current'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {getStepStatus(step) === 'completed' ? '✓' : step}
              </div>
              {step < 3 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground mx-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Account Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {accountTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType?.id === type.id;
          const isAvailable = type.step <= currentStep + 1;
          const isCurrentStep = type.step === currentStep;

          return (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: type.step * 0.1 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 h-full ${
                  isSelected 
                    ? 'ring-2 ring-primary shadow-lg scale-105' 
                    : isAvailable
                    ? 'hover:shadow-lg hover:scale-102'
                    : 'opacity-50 cursor-not-allowed'
                } ${isCurrentStep ? 'border-primary border-2' : ''}`}
                onClick={() => isAvailable && handleSelectType(type)}
              >
                <CardHeader className="text-center space-y-4">
                  <div className="mx-auto">
                    <div 
                      className={`w-16 h-16 rounded-full ${type.color} flex items-center justify-center mx-auto`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <CardTitle className="text-lg">{type.title}</CardTitle>
                      {type.step === currentStep && (
                        <Badge variant="default">Atual</Badge>
                      )}
                      {type.restricted && (
                        <Badge variant="secondary">Restrito</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{type.subtitle}</p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-xs text-center text-muted-foreground">
                    {type.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Settings className="h-3 w-3" />
                      Funcionalidades
                    </h4>
                    <ul className="text-xs space-y-1">
                      {type.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-primary rounded-full" />
                          {feature}
                        </li>
                      ))}
                      {type.features.length > 3 && (
                        <li className="text-muted-foreground">
                          +{type.features.length - 3} mais
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Sector Info */}
                  {type.sectorBased && (
                    <div className="bg-muted/50 p-2 rounded text-xs">
                      <div className="flex items-center gap-1 font-medium">
                        <Building2 className="h-3 w-3" />
                        Baseado no Setor
                      </div>
                      <p className="text-muted-foreground mt-1">
                        Permissões definidas pelo setor escolhido
                      </p>
                    </div>
                  )}

                  {/* Duration */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Duração:</span>
                    <span className="font-medium">{type.duration}</span>
                  </div>

                  {/* Step indicator */}
                  <div className="flex items-center justify-center gap-2 pt-2 border-t">
                    <div className="text-xs text-muted-foreground">
                      Passo {type.step} de 3
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Type Actions */}
      {selectedType && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 p-6 bg-muted/30 rounded-lg"
        >
          <div className="text-center">
            <h3 className="font-medium">Conta Selecionada: {selectedType.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedType.description}
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setSelectedType(null)}
            >
              Voltar
            </Button>
            <Button 
              onClick={() => handleSelectType(selectedType)}
              className="flex items-center gap-2"
            >
              <UserCheck className="h-4 w-4" />
              Continuar com {selectedType.title}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-medium text-blue-900">Estrutura Hierárquica</h4>
            <p className="text-blue-700 mt-1">
              Cada tipo de conta possui permissões específicas. A Conta de Comunicação permite acesso 
              ao inbox baseado no setor escolhido, controlando quais mensagens você pode visualizar e responder.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountTypeSelector;

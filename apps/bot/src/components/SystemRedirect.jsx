import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getSystemUrl } from '@/config/domains';
import { 
  Calendar, 
  Users, 
  BarChart3, 
  Stethoscope, 
  FileText, 
  DollarSign,
  Loader2,
  ExternalLink,
  ArrowRight,
  Bot,
  Database,
  ShoppingBag
} from 'lucide-react';

const SYSTEMS = {
  agenda: {
    id: 'e7c9dff7-b96b-4c05-8a2a-796841757b1c',
    name: 'Agenda',
    slug: 'agenda',
    description: 'Sistema de agendamento de consultas',
    icon: Calendar,
    color: 'bg-blue-500',
    url: getSystemUrl('agenda'),
    roles: ['admin', 'doctor', 'manager', 'receptionist']
  },
  crm: {
    id: 'ff708c08-f054-42b7-9d70-05bb721f58fc',
    name: 'CRM',
    slug: 'crm',
    description: 'Gestão de relacionamento com pacientes',
    icon: Users,
    color: 'bg-green-500',
    url: getSystemUrl('crm'),
    roles: ['admin', 'manager', 'receptionist']
  },
  dashboard: {
    id: 'ef6f2c6c-e48f-4152-a76a-6514587edb34',
    name: 'Dashboard',
    slug: 'dashboard',
    description: 'Dashboard central do ecossistema',
    icon: BarChart3,
    color: 'bg-purple-500',
    url: getSystemUrl('dashboard'),
    roles: ['admin', 'doctor']
  },
  medical: {
    id: 'e60d60aa-771f-49a7-acc0-3d449e4cf47b',
    name: 'Portal Médico',
    slug: 'medical',
    description: 'Gestão médica e prontuários',
    icon: Stethoscope,
    color: 'bg-red-500',
    url: getSystemUrl('medical'),
    roles: ['admin', 'doctor']
  },
  budget: {
    id: 'cc7063ea-6572-4c68-8222-4bd0382fd786',
    name: 'Orçamentos',
    slug: 'budget',
    description: 'Sistema de orçamentos e propostas',
    icon: FileText,
    color: 'bg-orange-500',
    url: getSystemUrl('budget'),
    roles: ['admin', 'doctor', 'manager']
  },
  financial: {
    id: 'b40d36d3-cdeb-40b7-843a-7a94aa7f87c9',
    name: 'Financeiro',
    slug: 'financial',
    description: 'Controle financeiro integrado',
    icon: DollarSign,
    color: 'bg-emerald-500',
    url: getSystemUrl('financial'),
    roles: ['admin', 'finance']
  },
  ai: {
    id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    name: 'IA do Dr. Marcio',
    slug: 'ai',
    description: 'Assistente inteligente',
    icon: Bot,
    color: 'bg-indigo-500',
    url: getSystemUrl('ai'),
    roles: ['admin', 'doctor']
  },
  database: {
    id: 'b2c3d4e5-f6a7-8901-2345-67890abcdef0',
    name: 'Database',
    slug: 'database',
    description: 'Gestão de banco de dados',
    icon: Database,
    color: 'bg-slate-500',
    url: getSystemUrl('database'),
    roles: ['admin']
  },
  shop: {
    id: 'c3d4e5f6-a7b8-9012-3456-7890abcdef01',
    name: 'Loja',
    slug: 'shop',
    description: 'E-commerce de produtos',
    icon: ShoppingBag,
    color: 'bg-pink-500',
    url: getSystemUrl('shop'),
    roles: ['admin', 'manager']
  }
};

export default function SystemRedirect() {
  const { profile, session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [availableSystems, setAvailableSystems] = useState([]);

  useEffect(() => {
    if (profile) {
      // Filtrar sistemas disponíveis baseado no role do usuário
      const userRole = profile.role;
      const systems = Object.values(SYSTEMS).filter(system => 
        system.roles.includes(userRole)
      );
      setAvailableSystems(systems);
      setLoading(false);
    }
  }, [profile]);

  const handleSystemAccess = (system) => {
    // Criar token de sessão para SSO (Single Sign-On)
    const token = session?.access_token;
    const redirectUrl = `${system.url}?token=${token}&user=${profile.id}`;
    
    // Abrir em nova aba
    window.open(redirectUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erro de Autenticação</CardTitle>
          <CardDescription>Não foi possível carregar seu perfil.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Bem-vindo, {profile.full_name}!
        </h2>
        <p className="text-muted-foreground mt-2">
          Selecione um sistema para acessar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableSystems.map((system) => {
          const Icon = system.icon;
          
          return (
            <Card 
              key={system.id} 
              className="hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => handleSystemAccess(system)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${system.color} text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <CardTitle className="mt-4">{system.name}</CardTitle>
                <CardDescription>{system.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSystemAccess(system);
                  }}
                >
                  Acessar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {availableSystems.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Nenhum Sistema Disponível</CardTitle>
            <CardDescription>
              Não há sistemas configurados para o seu perfil ({profile.role}).
              Entre em contato com o administrador.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm">Informações do Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email:</span>
            <span className="font-medium">{profile.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Função:</span>
            <span className="font-medium capitalize">{profile.role}</span>
          </div>
          {profile.phone && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Telefone:</span>
              <span className="font-medium">{profile.phone}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <span className={`font-medium ${profile.is_active ? 'text-green-600' : 'text-red-600'}`}>
              {profile.is_active ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

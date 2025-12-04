import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/auth/AuthContext';
import { 
  Bot, 
  RefreshCw, 
  Bell,
  Settings,
  Briefcase,
  LogOut,
  LogIn,
  BarChart3,
  Users,
  Sun,
  Moon,
  ChevronDown,
  BookOpen,
  User,
  Stethoscope,
  ClipboardList,
  HeartPulse,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useTheme } from '@/contexts/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const MainLayout = () => {
  const { messages, addLogEntry, fetchData } = useData();
  const { profile, signOut, session } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData(); // Fetch data from localStorage
    addLogEntry('Sincronização Manual', {details: 'Dados do painel foram sincronizados manualmente.'});
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "✅ Dados atualizados!",
        description: "Painel sincronizado com sucesso"
      });
    }, 1500);
  };

  const handleLogout = async () => {
    addLogEntry('Logout', { details: `Usuário '${profile?.full_name}' deslogou do sistema.` });
    await signOut();
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };
  
  const handleShowToast = () => {
     toast({
      title: "🚧 Esta funcionalidade ainda não foi implementada",
      description: "Mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀"
    });
  }

  const pendingCount = messages.filter(m => m.from_contact).length;

  const navItems = [
    { to: "/", icon: Briefcase, label: "Comunicação", profiles: ['Admin', 'Médico', 'Secretária'] },
    { to: "/medico", icon: Stethoscope, label: "Portal Médico", profiles: ['Admin', 'Médico'] },
    { to: "/secretaria", icon: ClipboardList, label: "Portal Secretária", profiles: ['Admin', 'Secretária'] },
    { to: "/paciente-portal", icon: HeartPulse, label: "Portal Paciente", profiles: ['Admin', 'Paciente'] },
    { to: "/contacts", icon: Users, label: "Pacientes", profiles: ['Admin', 'Médico', 'Secretária'] },
    { to: "/audit", icon: BarChart3, label: "Auditoria", profiles: ['Admin'] },
    { to: "/docs/integration", icon: BookOpen, label: "Manual API", profiles: ['Admin'] },
    { to: "/settings", icon: Settings, label: "Configurações", profiles: ['Admin'] },
  ];

  const availableNavItems = navItems.filter(item => {
    return item.profiles.includes(profile?.profile);
  });

  if (!profile) {
    return (
       <div className="flex items-center justify-center h-screen bg-background">
        <div className="aurora-effect"></div>
        <p className="text-white z-10">Carregando perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 relative overflow-hidden">
      <div className={`aurora-effect ${theme === 'light' ? 'opacity-0' : 'opacity-100'}`}></div>
      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl shadow-lg bg-gradient-to-r from-primary to-purple-500">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">
                  Gestão IA
                </h1>
                <p className="text-muted-foreground">
                  Sistema Inteligente de Sistema do Dr. Marcio
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
               <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-secondary/50 hover:bg-secondary"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShowToast}
                className="relative bg-secondary/50 hover:bg-secondary"
              >
                <Bell className="h-4 w-4 mr-2" />
                Notificações
                {pendingCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center notification-badge bg-red-500 text-white">
                    {pendingCount}
                  </Badge>
                )}
              </Button>
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-3 p-2 rounded-lg bg-secondary/50">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-r from-primary to-purple-400 text-white">
                        {profile && profile.full_name ? profile.full_name.charAt(0) : <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm text-left">
                      <p className="font-semibold">{profile.full_name || 'Usuário'}</p>
                      <p className="text-xs capitalize text-muted-foreground">{profile.profile || 'N/A'}</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 glass-effect" align="end">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
                     {theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                    <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>
                  </DropdownMenuItem>
                  {session && (
                    <DropdownMenuItem onClick={handleShowToast} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Preferências</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  {session ? (
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={handleLoginRedirect} className="text-primary focus:text-primary focus:bg-primary/10 cursor-pointer">
                      <LogIn className="mr-2 h-4 w-4" />
                      <span>Fazer Login</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </motion.header>

        <nav className="mb-6">
          <div className="flex items-center justify-center rounded-xl p-1 bg-secondary/50 border border-border">
            {availableNavItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `flex-1 text-center flex items-center justify-center space-x-2 p-2 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
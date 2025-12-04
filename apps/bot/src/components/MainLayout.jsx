
import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Bot, RefreshCw, Bell, Settings, LogOut, LogIn, BarChart3, Users, Sun, Moon, ChevronDown, BookOpen, User, Stethoscope, ClipboardList, HeartPulse, Flame, Send, BrainCircuit, ShieldAlert, LayoutDashboard } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from '@/contexts/ThemeContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const MainLayout = () => {
  const { messages, addLogEntry, fetchData } = useData();
  const { profile, signOut, session } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (messages) {
      const unreadMessages = messages.filter(m => m.status === 'new');
      setPendingCount(unreadMessages.length);
    }
  }, [messages]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    addLogEntry('Sincronização Manual', {
      details: 'Dados do painel foram sincronizados manualmente.'
    });
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "✅ Dados atualizados!",
        description: "Painel sincronizado com sucesso"
      });
    }, 1000);
  };

  const handleLogout = async () => {
    addLogEntry('Logout', { details: `Usuário '${profile?.full_name}' deslogou.` });
    await signOut();
  };

  const navItems = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard", profiles: ['admin', 'medico', 'secretaria', 'receptionist'] },
    { to: "/leads", icon: Flame, label: "Leads", profiles: ['admin', 'secretaria', 'receptionist'] },
    { to: "/patients", icon: Users, label: "Pacientes", profiles: ['admin', 'medico', 'secretaria'] },
    { to: "/ai-area", icon: BrainCircuit, label: "Área da IA", profiles: ['admin'] },
    { to: "/paciente-portal", icon: HeartPulse, label: "Simular Portal", profiles: ['admin'] },
    { to: "/email-sender", icon: Send, label: "Disparador", profiles: ['admin'] },
  ];

  const availableNavItems = navItems.filter(item => {
    return profile && item.profiles.includes(profile.role);
  });

  const isAdmin = profile?.role === 'admin';

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background text-center p-4">
        <div className="aurora-effect"></div>
        <ShieldAlert className="h-16 w-16 text-destructive mb-4 z-10" />
        <h1 className="text-2xl font-bold text-white z-10">Erro ao Carregar Perfil</h1>
        <p className="text-muted-foreground z-10 max-w-md mb-6">Não foi possível carregar os dados do seu perfil. Isso pode acontecer se o seu perfil ainda não foi configurado.</p>
        <Button onClick={handleLogout} className="z-10">
          <LogOut className="mr-2 h-4 w-4" />
          Voltar para o Login
        </Button>
      </div>
    );
  }
  
  return (
    <TooltipProvider>
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 relative overflow-hidden">
      <div className={`aurora-effect ${theme === 'light' ? 'opacity-0' : 'opacity-100'}`}></div>
      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl shadow-lg bg-gradient-to-r from-primary to-purple-500">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">Portal Clinic - A informação chega até você</h1>
                <p className="text-muted-foreground">Sistema Inteligente do Dr. Roboni</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
               <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="bg-secondary/50 hover:bg-secondary">
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/')} className="relative bg-secondary/50 hover:bg-secondary">
                <Bell className="h-4 w-4 mr-2" />
                Notificações
                {pendingCount > 0 && <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center notification-badge bg-red-500 text-white">
                    {pendingCount}
                  </Badge>}
              </Button>
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-3 p-2 rounded-lg bg-secondary/50">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                      <AvatarFallback className="bg-gradient-to-r from-primary to-purple-400 text-white">
                        {profile.full_name ? profile.full_name.charAt(0) : <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm text-left">
                      <p className="font-semibold">{profile.full_name || 'Usuário'}</p>
                      <p className="text-xs capitalize text-muted-foreground">{profile.role || 'N/A'}</p>
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
                  {isAdmin && <>
                      <DropdownMenuItem onClick={() => navigate('/audit')} className="cursor-pointer">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        <span>Auditoria</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/docs/integration')} className="cursor-pointer">
                        <BookOpen className="mr-2 h-4 w-4" />
                        <span>Manual API</span>
                      </DropdownMenuItem>
                    </>}
                  <DropdownMenuSeparator />
                  {session ? <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem> : <DropdownMenuItem onClick={() => navigate('/login')} className="text-primary focus:text-primary focus:bg-primary/10 cursor-pointer">
                      <LogIn className="mr-2 h-4 w-4" />
                      <span>Fazer Login</span>
                    </DropdownMenuItem>}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </motion.header>

        <nav className="mb-6">
          <div className="flex items-center justify-center rounded-xl p-1 bg-secondary/50 border border-border">
            {availableNavItems.map(item => <NavLink key={item.to} to={item.to} end={item.to === "/"} className={({ isActive }) => `flex-1 text-center flex items-center justify-center space-x-2 p-2 rounded-lg transition-all duration-300 ${isActive ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>)}
             {isAdmin && <Tooltip>
                    <TooltipTrigger asChild>
                        <NavLink to="/settings" className={({ isActive }) => `flex-shrink-0 text-center flex items-center justify-center p-2 rounded-lg transition-all duration-300 ml-1 ${isActive ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
                            <Settings className="h-5 w-5" />
                        </NavLink>
                    </TooltipTrigger>
                    <TooltipContent className="glass-effect">
                        <p>Configurações</p>
                    </TooltipContent>
                </Tooltip>}
          </div>
        </nav>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
    </TooltipProvider>
  );
};
export default MainLayout;

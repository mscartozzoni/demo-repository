import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  MessageSquare, 
  FileText, 
  Users, 
  Bot,
  BarChart3,
  ConciergeBell,
  FileStack,
  UserCircle,
  LogOut,
  Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useSession } from '@/contexts/SessionContext';
import { useToast } from '@/components/ui/use-toast';

const Layout = () => {
  const { user, signOut } = useSession();
  const { toast } = useToast();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/dashboard' },
    { id: 'patients', label: 'Pacientes', icon: UserCircle, path: '/patients' },
    { id: 'budgets', label: 'Orçamentos', icon: Calculator, path: '/budgets' },
    { id: 'messages', label: 'Mensagens', icon: MessageSquare, path: '/messages' },
    { id: 'journey', label: 'Jornada', icon: Users, path: '/journey' },
    { id: 'finances', label: 'Financeiro', icon: DollarSign, path: '/finances' },
    { id: 'invoices', label: 'Faturas', icon: FileStack, path: '/invoices' },
    { id: 'services', label: 'Serviços', icon: ConciergeBell, path: '/services' },
    { id: 'protocols', label: 'Protocolos', icon: FileText, path: '/protocols' },
    { id: 'investments', label: 'Investimentos', icon: TrendingUp, path: '/investments' },
  ];

  const handleCopy = (textToCopy) => {
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "Copiado!",
      description: "O texto foi copiado para a área de transferência.",
    });
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                <Calculator className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Portal Financeiro</h1>
                <p className="text-purple-200">Sistema Integrado de Gestão</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white">{user?.full_name || user?.email}</p>
                <p className="text-xs text-purple-300">{user?.role}</p>
              </div>
              <Avatar>
                 <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold">
                  {getInitials(user?.full_name || user?.email)}
                </AvatarFallback>
              </Avatar>
              <Button 
                onClick={signOut}
                variant="outline"
                className="text-purple-200 border-purple-400 hover:bg-purple-400/10 hover:text-white"
                size="icon"
                aria-label="Sair"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-sm border-b border-white/10"
      >
        <div className="container mx-auto px-6">
          <div className="flex space-x-1 overflow-x-auto py-2">
            {navItems.map((tab) => (
              <NavLink
                key={tab.id}
                to={tab.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 whitespace-nowrap px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md' 
                      : 'text-purple-200 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </motion.div>

      <main className="container mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Settings, User, LayoutDashboard, Users, Calendar, MessageSquare, Briefcase, Bot, FileText, Coins as HandCoins, Stethoscope, Contact } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const getInitials = (name = '') => {
  const nameParts = name.split(' ');
  if (nameParts.length > 1) {
    return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const NavItem = ({ to, icon: Icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-blue-500/20 text-blue-300'
          : 'text-gray-400 hover:bg-white/10 hover:text-white'
      }`
    }
  >
    <Icon className="w-5 h-5 mr-3" />
    <span>{children}</span>
  </NavLink>
);

const Sidebar = () => {
    const { user, signOut } = useAuth();
    const userRole = user?.user_metadata?.role;

    const secretaryNav = [
        { to: "/admin/secretaria/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/agenda", icon: Calendar, label: "Agenda" },
        { to: "/admin/secretaria/pacientes", icon: Users, label: "Pacientes" },
        { to: "/admin/secretaria/mensagens", icon: MessageSquare, label: "Mensagens" },
        { to: "/admin/secretaria/jornada", icon: Briefcase, label: "Jornada do Paciente" },
        { to: "/admin/secretaria/leads", icon: Contact, label: "Contatos" },
        { to: "/orcamento", icon: FileText, label: "Orçamentos" },
        { to: "/financeiro", icon: HandCoins, label: "Financeiro" },
        { to: "/bot", icon: Bot, label: "Automações" },
    ];

    const doctorNav = [
        { to: "/admin/medico/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/agenda", icon: Calendar, label: "Agenda" },
        { to: "/admin/medico/pacientes", icon: Users, label: "Pacientes" },
        { to: "/prontuario", icon: Stethoscope, label: "Prontuários" },
        { to: "/admin/medico/mensagens", icon: MessageSquare, label: "Mensagens" },
    ];

    const patientNav = [
        { to: "/admin/paciente/dashboard", icon: LayoutDashboard, label: "Início" },
        { to: "/admin/paciente/agendamentos", icon: Calendar, label: "Agendamentos" },
        { to: "/admin/paciente/documentos", icon: FileText, label: "Documentos" },
        { to: "/admin/paciente/historico", icon: Briefcase, label: "Meu Histórico" },
    ];
    
    const navItems = {
        secretary: secretaryNav,
        doctor: doctorNav,
        patient: patientNav,
    }[userRole] || [];

    const profileLink = userRole === 'patient' ? '/admin/paciente/perfil' : '/settings';

  return (
    <aside className="w-64 bg-slate-900/80 backdrop-blur-lg border-r border-white/10 flex flex-col">
      <div className="px-6 py-5">
        <h1 className="text-2xl font-bold gradient-text">Clínica</h1>
      </div>
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {navItems.map(item => <NavItem key={item.to} {...item}>{item.label}</NavItem>)}
      </nav>
      <div className="p-4 border-t border-white/10 mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full text-left rounded-lg hover:bg-white/5 p-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900">
            <div className="flex items-center">
              <Avatar className="w-10 h-10 mr-3">
                <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.full_name} />
                <AvatarFallback>{getInitials(user?.user_metadata?.full_name)}</AvatarFallback>
              </Avatar>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-white truncate">{user?.user_metadata?.full_name}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mb-2" side="top" align="start">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={profileLink}>
                <User className="mr-2 h-4 w-4" />
                <span>Meu Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Link to="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-red-400 focus:bg-red-500/10 focus:text-red-300">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
};

export default Sidebar;

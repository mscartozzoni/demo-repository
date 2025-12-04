
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, Calendar, FileText, MessageSquare, BarChart, Settings, HelpCircle, Menu, X, User, LogOut, ChevronDown, Bot, PenSquare, Video, DollarSign, FileImage, BookOpen, QrCode, Workflow, ListTodo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/App';
import ActionSearchModal from '@/components/ActionSearchModal';

const navItems = [
  { name: 'Dashboard', path: '/medico/dashboard', icon: LayoutDashboard },
  { name: 'Agenda do Médico', path: '/medico/agenda', icon: Calendar },
  { name: 'Painel de Ações', path: '/medico/actions', icon: ListTodo },
  { name: 'Teleconsultas', path: '/medico/teleconsultas', icon: Video },
  { name: 'Pacientes', path: '/medico/prontuarios', icon: Users },
  { name: 'Mensagens', path: '/medico/messages', icon: MessageSquare, badge: 3 },
  { name: 'Documentos', path: '/medico/documents', icon: FileText },
  { name: 'Financeiro', path: '/medico/financial', icon: DollarSign },
  { name: 'Analytics', path: '/medico/analytics', icon: BarChart },
  { name: 'Blog', path: '/medico/blog', icon: PenSquare },
  { name: 'Gerador QR', path: '/medico/qr-code-generator', icon: QrCode },
  { name: 'Clinic Flow', path: '/medico/clinic-flow', icon: Workflow },
  { name: 'Assistente IA', path: '/medico/assistente-ia', icon: Bot },
];

const SidebarNavItem = ({ item, isCollapsed }) => (
  <NavLink
    to={item.path}
    className={({ isActive }) =>
      `flex items-center p-3 rounded-lg transition-colors duration-200 ${isCollapsed ? 'justify-center' : ''} ${isActive ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-700/50 text-slate-400 hover:text-white'}`
    }
  >
    <item.icon className="h-5 w-5" />
    {!isCollapsed && <span className="ml-4 font-medium">{item.name}</span>}
    {!isCollapsed && item.badge && (
      <span className="ml-auto bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
        {item.badge}
      </span>
    )}
  </NavLink>
);

const Sidebar = ({ isCollapsed, isMobile, setMobileOpen }) => {
    const { setTheme } = useTheme();

    return (
        <motion.div
            animate={{ width: isCollapsed ? '5rem' : '16rem' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`fixed top-0 left-0 h-full bg-slate-800/50 backdrop-blur-lg border-r border-slate-700/80 z-40 flex flex-col ${isMobile ? 'flex' : 'hidden md:flex'}`}
        >
            <div className="p-4 flex items-center justify-between border-b border-slate-700/80" style={{ minHeight: '4rem' }}>
                {!isCollapsed && (
                    <Link to="/medico/dashboard" className="flex items-center gap-2">
                         <Bot className="h-8 w-8 text-blue-400" />
                        <span className="text-lg font-bold text-white">Portal Médico</span>
                    </Link>
                )}
                 {isCollapsed && (
                    <div className="w-full flex justify-center">
                         <Bot className="h-8 w-8 text-blue-400" />
                    </div>
                )}
                {isMobile && !isCollapsed && (
                    <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                        <X className="h-6 w-6 text-white" />
                    </Button>
                )}
            </div>
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <SidebarNavItem key={item.path} item={item} isCollapsed={isCollapsed} />
                ))}
            </nav>
            <div className="p-3 border-t border-slate-700/80">
                <NavLink to="/medico/config" className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors duration-200 ${isCollapsed ? 'justify-center' : ''} ${isActive ? 'bg-slate-700 text-white' : 'hover:bg-slate-700/50 text-slate-400 hover:text-white'}`}>
                    <Settings className="h-5 w-5" />
                    {!isCollapsed && <span className="ml-4 font-medium">Configurações do Perfil</span>}
                </NavLink>
                <Button variant="ghost" onClick={() => setTheme(prev => prev === 'theme-default' ? 'theme-dark' : 'theme-default')} className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-700/50">
                    <HelpCircle className="h-5 w-5" />
                    {!isCollapsed && <span className="ml-4 font-medium">Mudar Tema</span>}
                </Button>
            </div>
        </motion.div>
    );
};


const Header = ({ onMenuClick, onToggleCollapse, isCollapsed }) => {
    const { user, profile, signOut } = useAuth(); // Changed logout to signOut to match AuthContext
    const navigate = useNavigate();
    const [isSearchOpen, setSearchOpen] = useState(false);
    
    const getInitials = (name) => {
        if (!name || typeof name !== 'string') return 'U';
        const names = name.split(' ');
        if (names.length > 1) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const headerLeftMargin = isCollapsed ? '5rem' : '16rem';

    return (
        <header 
            className="fixed top-0 right-0 h-16 bg-slate-900/50 backdrop-blur-lg border-b border-slate-700/80 z-30 flex items-center justify-between px-4 md:px-6 transition-all duration-300"
            style={{ left: headerLeftMargin }}
        >
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden">
                    <Menu className="h-6 w-6" />
                </Button>
                 <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="hidden md:flex">
                    {isCollapsed ? <Menu className="h-6 w-6" /> : <X className="h-6 w-6" />}
                </Button>
            </div>

            <div className="flex-1 max-w-xs ml-4">
                <Button variant="outline" className="w-full justify-start text-slate-400" onClick={() => setSearchOpen(true)}>
                    <Bot className="mr-2 h-4 w-4"/>
                    Pesquisa com IA...
                    <kbd className="ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.avatar_url} /> {/* Use user object for avatar_url */}
                                <AvatarFallback>{getInitials(user?.full_name || user?.email)}</AvatarFallback>
                            </Avatar>
                            <div className="hidden md:flex flex-col items-start">
                                <span className="text-sm font-medium text-white">{user?.full_name}</span> {/* Use user object for full_name */}
                                <span className="text-xs text-slate-400">{user?.role}</span> {/* Use user object for role */}
                            </div>
                            <ChevronDown className="h-4 w-4 text-slate-400 hidden md:block" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700 text-white">
                        <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-700" />
                        <DropdownMenuItem onClick={() => navigate('/medico/profile')} className="cursor-pointer focus:bg-slate-700">
                            <User className="mr-2 h-4 w-4" />
                            <span>Perfil</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/medico/config')} className="cursor-pointer focus:bg-slate-700">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Configurações do Perfil</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-700"/>
                        <DropdownMenuItem onClick={signOut} className="cursor-pointer focus:bg-red-500/20 focus:text-red-300">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Sair</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <ActionSearchModal open={isSearchOpen} setSearchOpen={setSearchOpen} />
        </header>
    );
};

const Layout = ({ children }) => {
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isMobileOpen, setMobileOpen] = useState(false);
    
    const handleToggleCollapse = () => {
        setSidebarCollapsed(!isSidebarCollapsed);
    };

    const handleMenuClick = () => {
        setMobileOpen(!isMobileOpen);
    }
    
    const mainContentMargin = isSidebarCollapsed ? '5rem' : '16rem';

    return (
        <div className="min-h-screen bg-gradient-radial from-slate-900 to-slate-950 text-white">
             {/* Mobile Sidebar */}
            <AnimatePresence>
                {isMobileOpen && (
                     <motion.div 
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="md:hidden fixed inset-0 z-50"
                    >
                        <Sidebar 
                            isCollapsed={false}
                            isMobile={true} 
                            setMobileOpen={setMobileOpen}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

             {/* Desktop Sidebar */}
            <Sidebar isCollapsed={isSidebarCollapsed} />

            <div 
                className="pt-20 p-4 md:p-8 transition-all duration-300" 
                style={{ marginLeft: mainContentMargin }}
            >
                <Header 
                    onMenuClick={handleMenuClick} 
                    onToggleCollapse={handleToggleCollapse} 
                    isCollapsed={isSidebarCollapsed} 
                />
                <main>{children}</main>
            </div>
        </div>
    );
};

export default Layout;

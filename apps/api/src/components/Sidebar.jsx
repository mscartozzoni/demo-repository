import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, MessageSquare, Users, Settings, LogOut, Menu, X, Sparkles, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QrCodeModal } from '@/components/QrCodeModal';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/chat', icon: MessageSquare, label: 'Chat IA' },
    { path: '/patients', icon: Users, label: 'Pacientes' },
    { path: '/settings', icon: Settings, label: 'Configurações' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-xl hover:bg-white dark:bg-slate-900/80 dark:hover:bg-slate-800 dark:text-white"
        variant="outline"
        size="icon"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      <AnimatePresence>
        {(isOpen || window.innerWidth >= 768) && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 h-screen w-64 glass-effect border-r border-white/20 dark:border-slate-800 z-40 flex flex-col"
            >
              <div className="p-6 border-b border-white/20 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-800 dark:text-slate-200">Assistente</h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Clínico IA</p>
                  </div>
                </div>
              </div>

              <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                        : 'text-slate-700 hover:bg-white/50 dark:text-slate-300 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>

              <div className="p-4 space-y-2 border-t border-white/20 dark:border-slate-800">
                 <Button
                  onClick={() => setIsQrModalOpen(true)}
                  variant="outline"
                  className="w-full justify-start gap-3 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <QrCode className="w-5 h-5" />
                  Acesso Mobile
                </Button>
                <Button
                  onClick={logout}
                  variant="outline"
                  className="w-full justify-start gap-3 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/50 dark:hover:text-red-400 dark:hover:border-red-800"
                >
                  <LogOut className="w-5 h-5" />
                  Sair
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <QrCodeModal isOpen={isQrModalOpen} setIsOpen={setIsQrModalOpen} />
    </>
  );
};

export default Sidebar;
import React from 'react';
import { Bell } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationBell = () => {
    const { user } = useAuth();
    const { notifications, markAsRead } = useNotifications();
    
    const userRole = user?.user_metadata?.role;

    const filteredNotifications = notifications.filter(n => {
        // Show notification if it has no targetRole (general) or if the targetRole matches the user's role.
        return !n.targetRole || n.targetRole === userRole;
    });

    const unreadCount = filteredNotifications.filter(n => !n.read).length;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="relative p-2 glass-effect rounded-lg hover:bg-white/10 transition-all duration-200"
                >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <motion.span 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center"
                        >
                            {unreadCount}
                        </motion.span>
                    )}
                </motion.button>
            </PopoverTrigger>
            <PopoverContent className="w-80 glass-effect p-0" align="end">
                <div className="p-4 border-b border-white/10">
                    <h3 className="font-semibold">Notificações</h3>
                </div>
                <div className="max-h-96 overflow-y-auto scrollbar-thin">
                    <AnimatePresence>
                        {filteredNotifications.length > 0 ? (
                            filteredNotifications.map((notification) => (
                                <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    className={`p-4 border-b border-white/10 hover:bg-white/5 transition-colors duration-200 ${!notification.read ? 'bg-blue-500/10' : ''}`}
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className="mt-1">{notification.icon}</div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{notification.title}</p>
                                            <p className="text-xs text-gray-400">{notification.description}</p>
                                        </div>
                                        {!notification.read && (
                                            <button onClick={() => markAsRead(notification.id)} className="w-2 h-2 mt-1 bg-blue-400 rounded-full shrink-0" title="Marcar como lida"></button>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-4 text-center text-sm text-gray-400"
                            >
                                Nenhuma notificação nova.
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default NotificationBell;
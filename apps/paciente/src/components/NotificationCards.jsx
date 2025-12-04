import React, { useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Calendar, Bot } from 'lucide-react';

const defaultItems = [
    {
        key: 'bot_messages',
        title: 'Novas Mensagens do Bot',
        count: 0,
        description: 'Respostas automáticas e solicitações pendentes.',
        icon: Bot,
        color: 'from-blue-500 to-cyan-400',
        href: 'https://bot.portal-clinic.com.br'
    },
    {
        key: 'patient_messages',
        title: 'Mensagens de Pacientes',
        count: 0,
        description: 'Dúvidas e solicitações de reagendamento.',
        icon: MessageSquare,
        color: 'from-purple-500 to-pink-500',
        path: '/messages'
    },
    {
        key: 'today_appointments',
        title: 'Próximos Agendamentos',
        count: 0,
        description: 'Consultas agendadas para hoje.',
        icon: Calendar,
        color: 'from-green-500 to-emerald-500',
        path: '/calendar'
    }
];

// Toca um "sino" curto usando Web Audio API (fallback silencioso se bloqueado)
const playChime = () => {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = 880; // A5
        g.gain.setValueAtTime(0.001, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.1, ctx.currentTime + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
        o.connect(g).connect(ctx.destination);
        o.start();
        o.stop(ctx.currentTime + 0.26);
    } catch (_) {
        // ignorar se não puder tocar
    }
};

const NotificationCards = ({ items, botUrl = 'https://bot.portal-clinic.com.br', soundEnabled = true }) => {
    const navigate = useNavigate();

    const notifications = useMemo(() => {
        const base = defaultItems.map((d) => ({ ...d }));
        if (items && Array.isArray(items)) {
            const map = new Map(base.map(b => [b.key || b.title, b]));
            for (const it of items) {
                const k = it.key || it.title;
                if (map.has(k)) map.set(k, { ...map.get(k), ...it }); else map.set(k, it);
            }
            return Array.from(map.values()).map((n) => n.key === 'bot_messages' ? { ...n, href: botUrl } : n);
        }
        // default injeta Bot URL
        return base.map((n) => n.key === 'bot_messages' ? { ...n, href: botUrl } : n);
    }, [items, botUrl]);

    // Tocar som ao aumentar contagem
    const prevCountsRef = useRef({});
    useEffect(() => {
        let increased = false;
        const next = {};
        for (const n of notifications) {
            const key = n.key || n.title;
            const prev = prevCountsRef.current[key] ?? 0;
            next[key] = n.count || 0;
            if ((n.count || 0) > prev) increased = true;
        }
        prevCountsRef.current = next;
        if (soundEnabled && increased) playChime();
    }, [notifications, soundEnabled]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    const handleActivate = (n) => {
        if (n.href) {
            window.open(n.href, '_blank', 'noopener,noreferrer');
            return;
        }
        if (n.path) navigate(n.path);
    };

    return (
        <motion.div
            className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
        {notifications.map((notification, index) => (
                <motion.div
                    key={index}
                    variants={itemVariants}
            className="card-hover cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label={`${notification.title} (${notification.count})`}
            onClick={() => handleActivate(notification)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleActivate(notification); } }}
                >
                    <div className="floating-card p-6 flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${notification.color} flex items-center justify-center shrink-0`}>
                            <notification.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-white">{notification.title}</h3>
                                <span className={`px-2 py-1 text-xs font-bold text-white bg-gradient-to-br ${notification.color} rounded-full`}>
                                    {notification.count}
                                </span>
                            </div>
                                                        <p className="text-sm text-gray-400 mt-1">{notification.description}</p>
                                                        {notification.key === 'bot_messages' && (
                                                            <div className="mt-3">
                                                                <a
                                                                    href={botUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-cyan-300 hover:text-cyan-200 text-sm underline"
                                                                    onClick={(e)=> e.stopPropagation()}
                                                                >
                                                                    Abrir Bot
                                                                </a>
                                                            </div>
                                                        )}
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default NotificationCards;
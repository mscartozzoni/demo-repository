import React from 'react';
    import { Helmet } from 'react-helmet';
    import { motion } from 'framer-motion';
    import { Users, Eye, TrendingUp, AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';

    const stats = [
        { name: 'Visitantes Únicos', value: '1.2K', change: '12.5%', changeType: 'increase', icon: Users, color: 'text-blue-400' },
        { name: 'Visualizações de Página', value: '6.8K', change: '8.2%', changeType: 'increase', icon: Eye, color: 'text-green-400' },
        { name: 'Taxa de Rejeição', value: '42.3%', change: '1.9%', changeType: 'decrease', icon: AlertCircle, color: 'text-red-400' },
        { name: 'Duração da Sessão', value: '3m 45s', change: '5.1%', changeType: 'increase', icon: TrendingUp, color: 'text-yellow-400' },
    ];

    const StatCard = ({ stat, index }) => (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass-effect p-6 rounded-xl flex flex-col justify-between"
        >
            <div className="flex items-center justify-between mb-4">
                <p className="text-slate-400 text-sm font-medium">{stat.name}</p>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
                <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                <div className="flex items-center text-sm">
                    {stat.changeType === 'increase' ? (
                        <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                        <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}>{stat.change}</span>
                    <span className="text-slate-500 ml-1">vs. mês passado</span>
                </div>
            </div>
        </motion.div>
    );

    const Analytics = () => {
        return (
            <div className="space-y-8">
                <Helmet>
                    <title>Análise do Site - Portal do Médico</title>
                    <meta name="description" content="Visualize as estatísticas e análises de tráfego do seu site." />
                </Helmet>

                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <h1 className="text-4xl font-extrabold text-white leading-tight">Análise do Site</h1>
                    <p className="text-lg text-slate-300 mt-2">
                        Acompanhe o desempenho do seu portal e entenda o comportamento dos seus visitantes.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <StatCard key={stat.name} stat={stat} index={index} />
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="glass-effect p-6 rounded-xl"
                    >
                        <h3 className="text-xl font-bold text-white mb-4">Tráfego por Fonte</h3>
                        <div className="mt-4 h-48 flex items-center justify-center bg-slate-800/50 rounded-lg">
                            <img alt="Gráfico de pizza mostrando fontes de tráfego" src="https://images.unsplash.com/photo-1586448354773-30706da80a04" />
                        </div>
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="glass-effect p-6 rounded-xl"
                    >
                        <h3 className="text-xl font-bold text-white mb-4">Páginas Mais Visitadas</h3>
                        <div className="mt-4 h-48 flex items-center justify-center bg-slate-800/50 rounded-lg">
                            <img alt="Gráfico de barras mostrando as páginas mais visitadas" src="https://images.unsplash.com/photo-1586448354773-30706da80a04" />
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    };

    export default Analytics;
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Shield, Cloud, Flame, Zap, Bot, DatabaseZap, Code, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getFirewallSettings, updateFirewallSettings } from '@/services/api/firewall';

const Firewall = () => {
    const { toast } = useToast();
    const [settings, setSettings] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isPurging, setIsPurging] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            const result = await getFirewallSettings();
            if (result.success) {
                setSettings(result.data);
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Erro ao carregar configurações',
                    description: 'Não foi possível buscar as configurações de firewall e CDN.',
                });
            }
            setIsLoading(false);
        };
        fetchSettings();
    }, [toast]);

    const handleSettingChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSaveSettings = async () => {
        setIsSaving(true);
        const result = await updateFirewallSettings(settings);
        if (result.success) {
            toast({
                title: 'Configurações Salvas!',
                description: 'Suas configurações de firewall e CDN foram atualizadas.',
            });
        } else {
            toast({
                variant: 'destructive',
                title: 'Erro ao Salvar',
                description: 'Não foi possível salvar as configurações.',
            });
        }
        setIsSaving(false);
    };

    const handlePurgeCache = async () => {
        setIsPurging(true);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate purging
        toast({
            title: 'Cache Limpo!',
            description: 'O cache da CDN foi limpo com sucesso.',
        });
        setIsPurging(false);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Firewall & CDN - Portal do Médico</title>
                <meta name="description" content="Gerencie as configurações de segurança e desempenho do seu aplicativo." />
            </Helmet>
            <div className="space-y-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-4xl font-extrabold text-white flex items-center gap-3">
                                <Shield className="w-10 h-10 text-primary" />
                                Firewall & CDN
                            </h1>
                            <p className="text-lg text-slate-300 mt-2">Proteja e acelere sua aplicação com as configurações da Hostinger.</p>
                        </div>
                        <Button size="lg" onClick={handleSaveSettings} disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-5 w-5" />
                                    Salvar Alterações
                                </>
                            )}
                        </Button>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="glass-effect">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl text-white"><Flame className="text-red-400" /> Web Application Firewall (WAF)</CardTitle>
                            <CardDescription>Proteja sua aplicação contra ameaças comuns da web.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <DatabaseZap className="w-6 h-6 text-blue-400" />
                                    <div>
                                        <p className="font-semibold text-white">Proteção contra Injeção de SQL</p>
                                        <p className="text-sm text-slate-400">Bloqueia tentativas de injeção de SQL maliciosas.</p>
                                    </div>
                                </div>
                                <Switch checked={settings.sql_injection_protection} onCheckedChange={(val) => handleSettingChange('sql_injection_protection', val)} />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Code className="w-6 h-6 text-yellow-400" />
                                    <div>
                                        <p className="font-semibold text-white">Proteção contra Cross-Site Scripting (XSS)</p>
                                        <p className="text-sm text-slate-400">Previne ataques de XSS que podem roubar dados de usuários.</p>
                                    </div>
                                </div>
                                <Switch checked={settings.xss_protection} onCheckedChange={(val) => handleSettingChange('xss_protection', val)} />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Bot className="w-6 h-6 text-purple-400" />
                                    <div>
                                        <p className="font-semibold text-white">Mitigação de Bots Maliciosos</p>
                                        <p className="text-sm text-slate-400">Identifica e bloqueia tráfego de bots maliciosos.</p>
                                    </div>
                                </div>
                                <Switch checked={settings.bot_mitigation} onCheckedChange={(val) => handleSettingChange('bot_mitigation', val)} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-effect">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl text-white"><Cloud className="text-cyan-400" /> Content Delivery Network (CDN)</CardTitle>
                            <CardDescription>Acelere a entrega de conteúdo globalmente.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Zap className="w-6 h-6 text-green-400" />
                                    <div>
                                        <p className="font-semibold text-white">Ativar CDN da Hostinger</p>
                                        <p className="text-sm text-slate-400">Distribui seu conteúdo para uma performance mais rápida.</p>
                                    </div>
                                </div>
                                <Switch checked={settings.cdn_enabled} onCheckedChange={(val) => handleSettingChange('cdn_enabled', val)} />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                                <div>
                                    <p className="font-semibold text-white">Nível de Cache</p>
                                    <p className="text-sm text-slate-400">Define quão agressivamente o conteúdo é cacheado.</p>
                                </div>
                                <Select value={settings.cache_level} onValueChange={(val) => handleSettingChange('cache_level', val)} disabled={!settings.cdn_enabled}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Selecione o nível" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="basic">Básico</SelectItem>
                                        <SelectItem value="aggressive">Agressivo</SelectItem>
                                        <SelectItem value="everything">Tudo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={handlePurgeCache} disabled={isPurging || !settings.cdn_enabled} className="w-full" variant="outline">
                                {isPurging ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Limpando Cache...
                                    </>
                                ) : (
                                    'Limpar Cache da CDN'
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default Firewall;
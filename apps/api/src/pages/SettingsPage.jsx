import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import AiLearningSettings from '@/components/settings/AiLearningSettings';
import { useTheme } from '@/contexts/ThemeContext';
import { Bell, Brush, Mic, Save, BrainCircuit, Moon, Sun } from 'lucide-react';

const SettingsPage = () => {
    const { toast } = useToast();
    const { theme, toggleTheme } = useTheme();
    const [settings, setSettings] = useState({
        voiceEnabled: true,
        voiceSpeed: 0.9,
        voicePitch: 0.9,
        personality: 'authoritative',
        proactiveAlerts: true,
        marketingSuggestions: true,
        emailReports: true
    });
    
    useEffect(() => {
        const storedSettings = localStorage.getItem('clinic_assistant_settings');
        if (storedSettings) {
            setSettings(JSON.parse(storedSettings));
        }
    }, []);

    const handleSettingChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };
    
    const handleSave = () => {
        localStorage.setItem('clinic_assistant_settings', JSON.stringify(settings));
        toast({
            title: "Configurações Salvas! ✨",
            description: "Suas preferências foram atualizadas com sucesso.",
        });
    };

    return (
        <>
            <Helmet>
                <title>Configurações - Meu Assistente Clínico</title>
                <meta name="description" content="Personalize seu assistente clínico e notificações." />
            </Helmet>
            <Layout>
                <div className="space-y-8">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Configurações</h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">Personalize o comportamento e a aparência do seu assistente.</p>
                    </motion.div>

                    <AiLearningSettings />

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-effect rounded-2xl p-6">
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-3 mb-6"><Brush className="w-6 h-6 text-indigo-600" /> Aparência</h2>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="dark-mode" className="flex items-center gap-2">
                                {theme === 'dark' ? <Moon /> : <Sun />}
                                Modo Escuro
                            </Label>
                            <Switch id="dark-mode" checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-effect rounded-2xl p-6">
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-3 mb-6"><Mic className="w-6 h-6 text-purple-600" /> Voz e Personalidade</h2>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="voice-enabled">Ativar Respostas por Voz</Label>
                                <Switch id="voice-enabled" checked={settings.voiceEnabled} onCheckedChange={(value) => handleSettingChange('voiceEnabled', value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Personalidade</Label>
                                 <Select value={settings.personality} onValueChange={(value) => handleSettingChange('personality', value)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="authoritative">Amigável, mas autoritário</SelectItem>
                                        <SelectItem value="empathetic">Empático e compreensivo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Velocidade da Voz: {Math.round(settings.voiceSpeed * 100)}%</Label>
                                <Slider value={[settings.voiceSpeed]} onValueChange={(value) => handleSettingChange('voiceSpeed', value[0])} max={1.5} min={0.5} step={0.1} />
                            </div>
                            <div className="space-y-2">
                                <Label>Tom da Voz: {Math.round(settings.voicePitch * 100)}%</Label>
                                <Slider value={[settings.voicePitch]} onValueChange={(value) => handleSettingChange('voicePitch', value[0])} max={1.5} min={0.5} step={0.1} />
                            </div>
                        </div>
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-effect rounded-2xl p-6">
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-3 mb-6"><Bell className="w-6 h-6 text-blue-600" /> Notificações</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="proactive-alerts">Alertas Proativos (ex: follow-ups)</Label>
                                <Switch id="proactive-alerts" checked={settings.proactiveAlerts} onCheckedChange={(value) => handleSettingChange('proactiveAlerts', value)} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="marketing-suggestions">Sugestões de Marketing</Label>
                                <Switch id="marketing-suggestions" checked={settings.marketingSuggestions} onCheckedChange={(value) => handleSettingChange('marketingSuggestions', value)} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="email-reports">Relatórios Diários por Email</Label>
                                <Switch id="email-reports" checked={settings.emailReports} onCheckedChange={(value) => handleSettingChange('emailReports', value)} />
                            </div>
                        </div>
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex justify-end">
                        <Button onClick={handleSave} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                            <Save className="w-4 h-4 mr-2" />
                            Salvar Alterações
                        </Button>
                    </motion.div>
                </div>
            </Layout>
        </>
    );
};

export default SettingsPage;
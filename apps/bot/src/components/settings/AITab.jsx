
import React, { useState, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BrainCircuit, Save, KeyRound } from 'lucide-react';
import IntegrationCard from './IntegrationCard';

const AITab = () => {
    const { settings, updateSettings } = useData();
    const { toast } = useToast();

    const [apiKey, setApiKey] = useState('');
    const [apiModel, setApiModel] = useState('gpt-4');

    useEffect(() => {
        if (settings) {
            setApiKey(settings.openaiApiKey || '');
            setApiModel(settings.openaiModel || 'gpt-4');
        }
    }, [settings]);

    const handleSave = () => {
        updateSettings({ 
            openaiApiKey: apiKey,
            openaiModel: apiModel
        });
        toast({
            title: 'Configurações de IA salvas!',
            description: 'Sua chave de API e modelo foram atualizados com sucesso.',
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Inteligência Artificial</h2>
                <p className="text-muted-foreground">Configure a integração com a OpenAI para habilitar recursos inteligentes.</p>
            </div>
            
            <IntegrationCard
                icon={<BrainCircuit className="h-6 w-6 text-primary-foreground" />}
                title="Configuração da OpenAI"
                description="Insira sua chave de API da OpenAI e escolha o modelo para usar."
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="openai-api-key" className="flex items-center gap-2">
                            <KeyRound className="h-4 w-4" />
                            Chave da API da OpenAI
                        </Label>
                        <Input 
                            id="openai-api-key"
                            type="password"
                            placeholder="sk-********************************"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            Sua chave de API é armazenada localmente no seu navegador.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="openai-model">Modelo de IA</Label>
                        <Select value={apiModel} onValueChange={setApiModel}>
                            <SelectTrigger id="openai-model">
                                <SelectValue placeholder="Selecione um modelo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="gpt-4">GPT-4</SelectItem>
                                <SelectItem value="gpt-4-turbo-preview">GPT-4 Turbo</SelectItem>
                                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                            </SelectContent>
                        </Select>
                         <p className="text-xs text-muted-foreground">
                            Modelos mais avançados podem gerar custos maiores.
                        </p>
                    </div>

                    <Button onClick={handleSave} disabled={!apiKey}>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Configurações
                    </Button>
                </div>
            </IntegrationCard>
        </div>
    );
};

export default AITab;

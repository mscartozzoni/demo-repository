
import React, { useState, useEffect } from 'react';
import { useSupabase } from '@/contexts/SupabaseContext';
import IntegrationCard from './IntegrationCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plug, Server, Database, Save, CheckCircle, XCircle, RotateCw, UploadCloud } from 'lucide-react';

const ConnectionsTab = () => {
    const { 
        isIntegrated, 
        isLoading, 
        setCredentials, 
        deploySchema, 
        syncData 
    } = useSupabase();
    
    const [supabaseUrl, setSupabaseUrl] = useState('');
    const [supabaseAnonKey, setSupabaseAnonKey] = useState('');

    useEffect(() => {
        setSupabaseUrl(localStorage.getItem('supabaseUrl') || '');
        setSupabaseAnonKey(localStorage.getItem('supabaseAnonKey') || '');
    }, [isIntegrated]);
    
    const handleSaveCredentials = () => {
        setCredentials(supabaseUrl, supabaseAnonKey);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Conexões Externas</h2>
                <p className="text-muted-foreground">Conecte o sistema a serviços externos como o Supabase.</p>
            </div>
            
            <IntegrationCard
                icon={<Server className="h-6 w-6 text-primary-foreground" />}
                title="Integração com Supabase"
                description="Conecte a um banco de dados Supabase para persistência de dados na nuvem."
            >
                <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <Label>Status:</Label>
                        {isIntegrated ? (
                            <div className="flex items-center gap-2 text-green-400 font-semibold">
                                <CheckCircle className="h-5 w-5" />
                                <span>Ativo</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-amber-400 font-semibold">
                                <XCircle className="h-5 w-5" />
                                <span>Inativo</span>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-border my-4" /> 

                    <div className="space-y-2">
                        <Label htmlFor="supabase-url">URL do Projeto Supabase</Label>
                        <Input 
                            id="supabase-url" 
                            placeholder="https://exemplo.supabase.co" 
                            value={supabaseUrl}
                            onChange={(e) => setSupabaseUrl(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="supabase-key">Chave Pública (Anon Key)</Label>
                        <Input 
                            id="supabase-key" 
                            type="password"
                            placeholder="cole sua chave anon aqui"
                            value={supabaseAnonKey}
                            onChange={(e) => setSupabaseAnonKey(e.target.value)}
                        />
                    </div>
                    
                    <Button onClick={handleSaveCredentials} disabled={isLoading || !supabaseUrl || !supabaseAnonKey}>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Credenciais
                    </Button>
                </div>
            </IntegrationCard>

            {isIntegrated && (
                 <Card className="glass-effect-soft">
                    <CardHeader>
                        <CardTitle>Gerenciamento do Banco de Dados</CardTitle>
                        <CardDescription>Execute ações no seu banco de dados Supabase.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className="flex items-start space-x-3 p-4 rounded-md bg-yellow-900/50 border border-yellow-700 text-yellow-300">
                           <Plug className="h-4 w-4 flex-shrink-0 mt-1" />
                           <div>
                               <h4 className="font-semibold">Atenção!</h4>
                               <p className="text-sm">
                                   Estas ações são executadas em modo de simulação. Nenhuma alteração real será feita no seu banco de dados até que a integração seja totalmente implementada.
                               </p>
                           </div>
                       </div>
                       
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <Button variant="outline" onClick={deploySchema} disabled={isLoading}>
                                <Database className="mr-2 h-4 w-4" />
                                {isLoading ? "Implantando..." : "Implantar Esquema"}
                            </Button>
                            <Button variant="outline" onClick={() => syncData()} disabled={isLoading}>
                                <UploadCloud className="mr-2 h-4 w-4" />
                                {isLoading ? "Sincronizando..." : "Sincronizar Dados"}
                            </Button>
                            <Button variant="destructive" onClick={() => syncData(true)} disabled={isLoading}>
                                <RotateCw className="mr-2 h-4 w-4" />
                                {isLoading ? "Forçando..." : "Forçar Re-sincronização"}
                            </Button>
                        </div>
                    </CardContent>
                 </Card>
            )}
        </div>
    );
};

export default ConnectionsTab;

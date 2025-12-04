import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { 
  Database, 
  FileSpreadsheet, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  AlertTriangle,
  Activity,
  Users,
  MessageSquare,
  Code
} from 'lucide-react';
import { useHybridData } from '@/hooks/useHybridData';
import HybridApiDemo from '@/components/HybridApiDemo';

const HybridConnectionStatus = () => {
  const { 
    connectionStatus, 
    loading, 
    error, 
    testConnections, 
    getDashboardData,
    refreshData 
  } = useHybridData();
  
  const [dashboardData, setDashboardData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const data = await getDashboardData();
    setDashboardData(data);
  };

  const handleRefresh = async () => {
    await refreshData();
    await loadDashboardData();
    
    toast({
      title: "✅ Dados Atualizados",
      description: "Status das conexões híbridas atualizado com sucesso."
    });
  };

  const handleTestConnections = async () => {
    await testConnections();
    
    if (connectionStatus.overall) {
      toast({
        title: "✅ Conexões OK",
        description: "Todas as conexões estão funcionando corretamente."
      });
    } else {
      toast({
        variant: "destructive",
        title: "❌ Problemas na Conexão",
        description: "Algumas conexões não estão funcionando."
      });
    }
  };

  const getStatusBadge = (status, label) => (
    <Badge variant={status ? "default" : "destructive"} className="flex items-center gap-1">
      {status ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
      {label}: {status ? 'OK' : 'Erro'}
    </Badge>
  );

  const getHealthColor = (health) => {
    switch (health) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <Tabs defaultValue="status" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="status" className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Status & Métricas
        </TabsTrigger>
        <TabsTrigger value="demo" className="flex items-center gap-2">
          <Code className="h-4 w-4" />
          Demo da API
        </TabsTrigger>
      </TabsList>

      <TabsContent value="status" className="space-y-6 mt-6">
        {/* Status das Conexões */}
      <Card className="glass-effect-soft">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Status das Conexões Híbridas
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleTestConnections}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Testar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Supabase */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Database className={`h-6 w-6 ${connectionStatus.supabase ? 'text-green-500' : 'text-red-500'}`} />
                <div>
                  <h3 className="font-semibold">Supabase</h3>
                  <p className="text-sm text-muted-foreground">Dados estruturados</p>
                </div>
              </div>
              {getStatusBadge(connectionStatus.supabase, 'Banco')}
            </div>

            {/* Status Google Sheets */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className={`h-6 w-6 ${connectionStatus.sheets ? 'text-green-500' : 'text-red-500'}`} />
                <div>
                  <h3 className="font-semibold">Google Sheets</h3>
                  <p className="text-sm text-muted-foreground">Chat e logs</p>
                </div>
              </div>
              {getStatusBadge(connectionStatus.sheets, 'Planilha')}
            </div>
          </div>

          {/* Status Geral */}
          <div className="mt-4 p-4 border rounded-lg bg-secondary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {connectionStatus.overall ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                )}
                <span className="font-semibold">
                  Sistema Híbrido: {connectionStatus.overall ? 'Operacional' : 'Problemas Detectados'}
                </span>
              </div>
            </div>

            {error && (
              <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                {error}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Métricas do Dashboard */}
      {dashboardData && (
        <Card className="glass-effect-soft">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Métricas do Sistema Híbrido
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Users className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold">{dashboardData.totalPatients}</div>
                <div className="text-sm text-muted-foreground">Pacientes</div>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <MessageSquare className="h-6 w-6 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold">{dashboardData.pendingMessages}</div>
                <div className="text-sm text-muted-foreground">Pendentes</div>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <Activity className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                <div className="text-2xl font-bold">{dashboardData.todayAppointments}</div>
                <div className="text-sm text-muted-foreground">Hoje</div>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className={`h-6 w-6 mx-auto mb-2 rounded-full ${getHealthColor(dashboardData.systemHealth)}`}>
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div className="text-sm font-semibold capitalize">{dashboardData.systemHealth}</div>
                <div className="text-sm text-muted-foreground">Sistema</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Arquitetura de Dados */}
      <Card className="glass-effect-soft">
        <CardHeader>
          <CardTitle>Arquitetura de Dados Híbrida</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-green-500" />
                  Google Sheets
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Mensagens de chat</li>
                  <li>• Logs de atividade</li>
                  <li>• Métricas do sistema</li>
                  <li>• Dados para análise manual</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Database className="h-4 w-4 text-blue-500" />
                  Supabase
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Dados de pacientes</li>
                  <li>• Agendamentos</li>
                  <li>• Orçamentos</li>
                  <li>• Dados relacionais</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">💡 Vantagens da Arquitetura Híbrida</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>Performance:</strong> Dados estruturados no Supabase para consultas rápidas</li>
                <li>• <strong>Flexibilidade:</strong> Chat e logs no Sheets para análise manual</li>
                <li>• <strong>Backup:</strong> Dados distribuídos em duas plataformas</li>
                <li>• <strong>Escalabilidade:</strong> Cada tipo de dado na plataforma ideal</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent value="demo" className="mt-6">
      <HybridApiDemo />
    </TabsContent>

    </Tabs>
  );
};

export default HybridConnectionStatus;

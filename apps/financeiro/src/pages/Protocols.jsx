import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FileText, Loader2, Tag, Percent, ListOrdered, Ticket, PlusCircle, Edit, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import ProtocolFormModal from '@/components/modals/ProtocolFormModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const mockProtocols = [
    { id: 'p1', name: 'Padrão Clínica', description: 'Protocolo geral para todos os procedimentos.', default_discount_percent: 5, max_installments: 12, active: true, is_default: true, protocol_payment_methods: [{payment_methods: {id: 'pm1', name: 'Cartão de Crédito'}}, {payment_methods: {id: 'pm2', name: 'PIX'}}], is_campaign: false, campaigns: null },
    { id: 'p2', name: 'Campanha de Verão', description: 'Condições especiais para o verão.', default_discount_percent: 15, max_installments: 6, active: true, is_default: false, protocol_payment_methods: [{payment_methods: {id: 'pm2', name: 'PIX'}}], is_campaign: true, campaigns: {id: 'c1', code: 'VERAO15'} },
    { id: 'p3', name: 'Protocolo Antigo', description: 'Protocolo legado, não usar.', default_discount_percent: 0, max_installments: 3, active: false, is_default: false, protocol_payment_methods: [], is_campaign: false, campaigns: null },
];

const Protocols = () => {
  const [protocols, setProtocols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [protocolToDefault, setProtocolToDefault] = useState(null);
  const [isSettingDefault, setIsSettingDefault] = useState(false);

  const { toast } = useToast();

  const fetchProtocols = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
        setProtocols(mockProtocols);
        setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    fetchProtocols();
  }, [fetchProtocols]);

  const handleNewProtocol = () => {
    setSelectedProtocol(null);
    setIsModalOpen(true);
  };

  const handleEditProtocol = (protocol) => {
    setSelectedProtocol(protocol);
    setIsModalOpen(true);
  };
  
  const handleSetDefault = async () => {
    if (!protocolToDefault) return;
    setIsSettingDefault(true);
    
    setTimeout(() => {
        toast({
            variant: 'success',
            title: 'Sucesso!',
            description: `Protocolo "${protocolToDefault.name}" definido como padrão (simulação).`,
            className: 'bg-green-600 text-white'
        });
        fetchProtocols();
        setIsSettingDefault(false);
        setIsAlertOpen(false);
        setProtocolToDefault(null);
    }, 500);
  };

  const openConfirmationDialog = (protocol) => {
    setProtocolToDefault(protocol);
    setIsAlertOpen(true);
  };

  const handleManageCampaign = (protocol) => {
    toast({
      title: "🚧 Gerenciar Campanha",
      description: "Esta funcionalidade para criar ou editar a campanha associada ao protocolo será implementada em breve!",
    });
  };

  const handleSaveProtocol = () => {
      toast({
        variant: 'success',
        title: 'Protocolo salvo com sucesso! (simulação)',
        className: 'bg-green-600 text-white'
      });
      fetchProtocols();
  }

  return (
    <>
      <motion.div
        key="protocols"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-8"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white tracking-tight">Protocolos de Pagamento</h1>
          <Button onClick={handleNewProtocol} className="bg-purple-600 hover:bg-purple-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Protocolo
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-16 w-16 text-purple-300 animate-spin" />
          </div>
        ) : protocols.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-lg">
              <FileText className="h-16 w-16 text-purple-300 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">Nenhum Protocolo Encontrado</h3>
              <p className="text-purple-200 mb-6">Crie seu primeiro protocolo para padronizar suas regras de pagamento.</p>
              <Button onClick={handleNewProtocol} className="bg-purple-600 hover:bg-purple-700">
                <PlusCircle className="mr-2 h-4 w-4" />
                Criar Protocolo
             </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {protocols.map((protocol) => (
              <motion.div key={protocol.id} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                  <Card className={`bg-white/10 border-white/20 text-white h-full flex flex-col ${protocol.is_default ? 'border-yellow-400 border-2' : ''}`}>
                      <CardHeader>
                          <CardTitle className="flex justify-between items-start">
                             <span className="text-2xl font-bold flex items-center gap-2">
                                {protocol.name}
                                {protocol.is_default && <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />}
                             </span>
                              <Badge variant={protocol.active ? 'success' : 'destructive'} className={`${protocol.active ? 'bg-green-500/20 text-green-300 border-green-500' : 'bg-red-500/20 text-red-300 border-red-500'}`}>
                                  {protocol.active ? 'Ativo' : 'Inativo'}
                              </Badge>
                          </CardTitle>
                          <CardDescription className="text-purple-200">{protocol.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow flex flex-col justify-between space-y-4">
                          <div className="space-y-3 text-sm">
                             <div className="flex items-center text-purple-100">
                                  <Percent className="h-4 w-4 mr-2 text-purple-300"/>
                                  <span>Desconto Padrão: <strong>{protocol.default_discount_percent}%</strong></span>
                             </div>
                              <div className="flex items-center text-purple-100">
                                  <ListOrdered className="h-4 w-4 mr-2 text-purple-300"/>
                                  <span>Parcelas Máximas: <strong>{protocol.max_installments}x</strong></span>
                              </div>
                              {protocol.is_campaign && protocol.campaigns && (
                                  <div className="flex items-center text-green-300 bg-green-500/10 p-2 rounded-md">
                                      <Ticket className="h-4 w-4 mr-2"/>
                                      <span>Cupom: <strong className="font-mono">{protocol.campaigns.code}</strong></span>
                                  </div>
                              )}
                          </div>
                          <div>
                              <h4 className="font-semibold mb-2 text-purple-200">Meios de Pagamento</h4>
                              <div className="flex flex-wrap gap-2">
                                  {protocol.protocol_payment_methods.length > 0 ? protocol.protocol_payment_methods.map(({ payment_methods }) => (
                                       <Badge key={payment_methods.id} variant="secondary" className="bg-purple-800/50 text-purple-200">
                                          {payment_methods.name}
                                      </Badge>
                                  )) : <span className="text-xs text-purple-400">Nenhum associado</span>}
                              </div>
                          </div>
                      </CardContent>
                      <CardFooter className="flex flex-col sm:flex-row gap-2">
                           <Button 
                              variant="outline" 
                              className="w-full border-purple-400 text-purple-300 hover:bg-purple-500/20 hover:text-white"
                              onClick={() => handleManageCampaign(protocol)}
                          >
                              <Tag className="h-4 w-4 mr-2" />
                              {protocol.is_campaign ? 'Gerenciar' : 'Criar Campanha'}
                          </Button>
                           <Button variant="outline" className="w-full" onClick={() => handleEditProtocol(protocol)}>
                                <Edit className="h-4 w-4 mr-2" /> Editar
                            </Button>
                            {!protocol.is_default && (
                                <Button 
                                    variant="outline" 
                                    className="w-full border-yellow-400 text-yellow-300 hover:bg-yellow-500/20 hover:text-white"
                                    onClick={() => openConfirmationDialog(protocol)}
                                >
                                    <Star className="h-4 w-4 mr-2" /> Padrão
                                </Button>
                            )}
                      </CardFooter>
                  </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <ProtocolFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        protocol={selectedProtocol}
        onSave={handleSaveProtocol}
      />
      
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Alteração de Protocolo Padrão?</AlertDialogTitle>
            <AlertDialogDescription>
              Isso fará com que "{protocolToDefault?.name}" se torne o novo protocolo padrão para todos os novos orçamentos. O protocolo padrão anterior será desmarcado. Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSettingDefault}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleSetDefault} disabled={isSettingDefault}>
              {isSettingDefault && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Protocols;
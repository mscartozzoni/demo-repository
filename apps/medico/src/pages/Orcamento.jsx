import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { getOrcamentos } from '@/services/api/orcamento';
import { useNavigate } from 'react-router-dom';

const Orcamento = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [orcamentos, setOrcamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrcamentos();
  }, []);

  const fetchOrcamentos = async () => {
    setLoading(true);
    try {
      const data = await getOrcamentos();
      if(data) {
        setOrcamentos(data);
      } else {
        const mockData = [
          { id: 1, patient: { name: 'Ana Silva' }, title: 'Rinoplastia', total_amount: 25000, status: 'sent', created_at: new Date().toISOString() },
          { id: 2, patient: { name: 'Bruno Costa' }, title: 'Lipoaspiração', total_amount: 35000, status: 'approved', created_at: new Date().toISOString() },
          { id: 3, patient: { name: 'Carla Dias' }, title: 'Prótese de Mama', total_amount: 30000, status: 'draft', created_at: new Date().toISOString() },
        ];
        setOrcamentos(mockData);
        toast({ title: "Modo de Demonstração", description: "Conecte o Supabase para gerenciar orçamentos reais.", variant: "default" });
      }
    } catch (error) {
      toast({ title: "Erro ao buscar orçamentos", description: "Usando dados de demonstração. Conecte o Supabase.", variant: "destructive" });
      const mockData = [
        { id: 1, patient: { name: 'Ana Silva' }, title: 'Rinoplastia', total_amount: 25000, status: 'sent', created_at: new Date().toISOString() },
        { id: 2, patient: { name: 'Bruno Costa' }, title: 'Lipoaspiração', total_amount: 35000, status: 'approved', created_at: new Date().toISOString() },
        { id: 3, patient: { name: 'Carla Dias' }, title: 'Prótese de Mama', total_amount: 30000, status: 'draft', created_at: new Date().toISOString() },
      ];
      setOrcamentos(mockData);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (orcamento) => {
    if (orcamento?.patient?.id) {
        navigate('/medico/orcamento-gestao', { state: { patientId: orcamento.patient.id, orcamentoId: orcamento.id } });
    } else {
        toast({
            title: "🚧 Funcionalidade em construção!",
            description: "A edição de orçamentos sem paciente definido será implementada em breve.",
        });
    }
  };
  
  const statusVariant = {
    draft: 'default',
    sent: 'secondary',
    approved: 'success',
    rejected: 'destructive',
  };

  return (
    <>
      <Helmet>
        <title>Orçamentos - Portal do Médico</title>
        <meta name="description" content="Crie e gerencie os orçamentos dos seus pacientes." />
      </Helmet>
      <div className="flex flex-col gap-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">Gerenciador de Orçamentos</h1>
            <p className="text-slate-400 mt-1">Crie, envie e acompanhe os orçamentos dos seus pacientes.</p>
          </div>
          <Button onClick={() => navigate('/medico/prontuarios')} className="bg-blue-600 hover:bg-blue-700 text-white">
            <PlusCircle className="w-5 h-5 mr-2" />
            Criar Novo Orçamento
          </Button>
        </motion.div>

        <Card className="bg-slate-800/50 border-slate-700 text-white">
          <CardHeader>
            <CardTitle>Orçamentos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center p-8 text-slate-400">Carregando orçamentos...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-slate-800/30">
                    <TableHead className="text-white">Paciente</TableHead>
                    <TableHead className="text-white">Título</TableHead>
                    <TableHead className="text-white">Valor</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                    <TableHead className="text-white">Data</TableHead>
                    <TableHead className="text-right text-white">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orcamentos.map((orc) => (
                    <TableRow key={orc.id} className="border-slate-700 hover:bg-slate-800/30">
                      <TableCell>{orc.patient?.name || 'N/A'}</TableCell>
                      <TableCell>{orc.title}</TableCell>
                      <TableCell>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(orc.total_amount)}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[orc.status] || 'default'}>{orc.status}</Badge>
                      </TableCell>
                      <TableCell>{new Date(orc.created_at).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell className="text-right">
                         <Button variant="ghost" size="icon" onClick={() => handleActionClick(orc)}>
                           <MoreHorizontal className="w-5 h-5" />
                         </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Orcamento;
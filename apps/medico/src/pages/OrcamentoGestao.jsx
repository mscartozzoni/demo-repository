import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator.jsx';
import { ArrowLeft, Trash2, Plus, DollarSign, Send, Save, Printer } from 'lucide-react';
import { createOrcamento } from '@/services/api/orcamento';
import { useAuth } from '@/contexts/AuthContext';
import { getPatientById } from '@/services/api/patients';

const OrcamentoGestao = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user } = useAuth();
    
    const [patient, setPatient] = useState(null);
    const [orcamento, setOrcamento] = useState({
        title: '',
        status: 'draft',
        items: [],
        notes: '',
    });
    const [newItem, setNewItem] = useState({ description: '', price: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const patientFromState = location.state?.patient;
        if (patientFromState) {
            setPatient(patientFromState);
            setLoading(false);
        } else if (location.state?.patientId) {
            const fetchPatient = async () => {
                const { data, error } = await getPatientById(location.state.patientId);
                if (error) {
                    toast({ variant: 'destructive', title: 'Erro', description: 'Paciente não encontrado.' });
                    navigate('/medico/prontuarios');
                } else {
                    setPatient(data);
                }
                setLoading(false);
            };
            fetchPatient();
        } else {
            toast({ variant: 'destructive', title: 'Erro', description: 'Nenhum paciente selecionado.' });
            navigate('/medico/prontuarios');
        }
    }, [location.state, navigate, toast]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrcamento(prev => ({ ...prev, [name]: value }));
    };

    const handleNewItemChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: value }));
    };

    const handleAddItem = () => {
        if (!newItem.description || !newItem.price) {
            toast({ variant: 'destructive', title: 'Erro', description: 'Preencha a descrição e o valor do item.' });
            return;
        }
        setOrcamento(prev => ({
            ...prev,
            items: [...prev.items, { ...newItem, id: Date.now(), price: parseFloat(newItem.price) }]
        }));
        setNewItem({ description: '', price: '' });
    };

    const handleRemoveItem = (itemId) => {
        setOrcamento(prev => ({
            ...prev,
            items: prev.items.filter(item => item.id !== itemId)
        }));
    };

    const totalAmount = useMemo(() => {
        return orcamento.items.reduce((sum, item) => sum + (item.price || 0), 0);
    }, [orcamento.items]);

    const handleSave = async (status = 'draft') => {
        if (!orcamento.title || orcamento.items.length === 0) {
            toast({ variant: 'destructive', title: 'Erro ao Salvar', description: 'O orçamento precisa de um título e pelo menos um item.' });
            return;
        }

        const orcamentoData = {
            ...orcamento,
            status,
            total_amount: totalAmount,
            patient_id: patient.id,
            doctor_id: user.id,
        };
        
        const [result] = await createOrcamento(orcamentoData); // API returns an array
        if(result) {
            toast({ title: `Orçamento ${status === 'sent' ? 'enviado' : 'salvo'}!`, description: 'O orçamento foi atualizado com sucesso.', className: 'bg-green-600 text-white' });
            navigate('/medico/prontuarios');
        } else {
            toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível salvar o orçamento.' });
        }
    };
    
    const handlePrint = () => {
        toast({ title: '🚧 Impressão em Breve!', description: 'A funcionalidade de impressão de orçamento será implementada em breve.' });
    };

    if (loading) {
        return <div className="text-center p-8">Carregando...</div>;
    }

    return (
        <>
            <Helmet>
                <title>Gestão de Orçamento - Portal do Médico</title>
            </Helmet>
            <div className="space-y-6">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center justify-between">
                         <Button variant="outline" onClick={() => navigate(`/medico/prontuarios/${patient?.id}`)}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar para o Prontuário
                        </Button>
                        <div className="flex gap-2">
                             <Button variant="outline" onClick={handlePrint}><Printer className="w-4 h-4 mr-2" />Imprimir</Button>
                             <Button variant="secondary" onClick={() => handleSave('draft')}><Save className="w-4 h-4 mr-2" />Salvar Rascunho</Button>
                             <Button onClick={() => handleSave('sent')}><Send className="w-4 h-4 mr-2" />Salvar e Enviar</Button>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="glass-effect">
                            <CardHeader>
                                <CardTitle>Detalhes do Orçamento</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Input 
                                    name="title" 
                                    placeholder="Título do Orçamento (ex: Rinoplastia + Pós-operatório)" 
                                    value={orcamento.title} 
                                    onChange={handleInputChange} 
                                    className="text-lg"
                                />
                                <Textarea 
                                    name="notes"
                                    placeholder="Observações adicionais, condições de pagamento, etc."
                                    value={orcamento.notes}
                                    onChange={handleInputChange}
                                />
                            </CardContent>
                        </Card>

                        <Card className="glass-effect">
                            <CardHeader>
                                <CardTitle>Itens do Orçamento</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Descrição</TableHead>
                                            <TableHead className="w-[150px]">Valor (R$)</TableHead>
                                            <TableHead className="w-[50px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orcamento.items.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.description}</TableCell>
                                                <TableCell>{item.price.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                         <TableRow>
                                            <TableCell>
                                                <Input name="description" placeholder="Novo item" value={newItem.description} onChange={handleNewItemChange} />
                                            </TableCell>
                                            <TableCell>
                                                <Input name="price" type="number" placeholder="0.00" value={newItem.price} onChange={handleNewItemChange} />
                                            </TableCell>
                                            <TableCell>
                                                <Button size="icon" onClick={handleAddItem}>
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <Card className="glass-effect">
                            <CardHeader>
                                <CardTitle>Paciente</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="font-bold text-lg">{patient?.full_name}</p>
                                <p className="text-sm text-slate-400">{patient?.email}</p>
                                <p className="text-sm text-slate-400">{patient?.phone}</p>
                            </CardContent>
                        </Card>
                        <Card className="glass-effect">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Resumo</CardTitle>
                                <Select value={orcamento.status} onValueChange={(val) => setOrcamento(p => ({...p, status: val}))}>
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Rascunho</SelectItem>
                                        <SelectItem value="sent">Enviado</SelectItem>
                                        <SelectItem value="approved">Aprovado</SelectItem>
                                        <SelectItem value="rejected">Rejeitado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center text-slate-300">
                                    <span>Subtotal</span>
                                    <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalAmount)}</span>
                                </div>
                                 <Separator />
                                <div className="flex justify-between items-center font-bold text-white text-xl">
                                    <span>Total</span>
                                    <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalAmount)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrcamentoGestao;
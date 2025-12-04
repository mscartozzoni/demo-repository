import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, Clock, Hash, Check, X, Phone } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const BudgetCard = ({ budget, onUpdateStatus }) => {
    const { toast } = useToast();
    const { user } = useAuth();
    const userRole = user?.user_metadata?.role;

    const getStatusProps = (status) => {
        switch (status) {
            case 'aceito':
                return { variant: 'success', text: 'Aceito' };
            case 'recusado':
                return { variant: 'destructive', text: 'Recusado' };
            case 'pendente':
            default:
                return { variant: 'warning', text: 'Pendente' };
        }
    };

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    const sentDate = new Date(budget.sentDate);
    const expirationDate = new Date(sentDate);
    expirationDate.setDate(sentDate.getDate() + 30); // Orçamento válido por 30 dias

    const daysSinceSent = Math.floor((new Date() - sentDate) / (1000 * 3600 * 24));

    const statusProps = getStatusProps(budget.status);

    const handleContact = () => {
        toast({
            title: '📞 Contatar Paciente',
            description: `Iniciando contato com ${budget.patientName}...`
        });
    };

    return (
        <Card className="glass-effect flex flex-col h-full hover:border-blue-500/50 transition-all duration-300">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-400" />
                        {budget.patientName}
                    </CardTitle>
                    <Badge variant={statusProps.variant}>{statusProps.text}</Badge>
                </div>
                <p className="text-sm text-gray-400 pt-1">{budget.procedure}</p>
            </CardHeader>
            <CardContent className="flex-1 space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span>Consulta: {formatDate(budget.consultationDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <span>Enviado: {formatDate(budget.sentDate)} ({daysSinceSent} dias atrás)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    <span>Validade: {formatDate(expirationDate.toISOString())}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <Hash className="w-3 h-3" />
                    <span>ID: {budget.id.split('_')[1].substring(0, 8)}</span>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                 <Button variant="outline" size="sm" onClick={handleContact}>
                    <Phone className="w-4 h-4 mr-2" />
                    Contatar
                </Button>
                {budget.status === 'pendente' && (
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="sm">Atualizar Status</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => onUpdateStatus(budget.id, 'aceito')}>
                                <Check className="w-4 h-4 mr-2 text-green-500" />
                                Marcar como Aceito
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onUpdateStatus(budget.id, 'recusado')}>
                                <X className="w-4 h-4 mr-2 text-red-500" />
                                Marcar como Recusado
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </CardFooter>
        </Card>
    );
};

export default BudgetCard;
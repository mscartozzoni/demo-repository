
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { saveConsultationType } from '@/services/api/consultationTypes';
import { Loader2, Palette, Clock, Hourglass } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const colors = [
  '#3b82f6', '#ef4444', '#22c55e', '#eab308', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'
];

const ConsultationTypeModal = ({ isOpen, onClose, onTypeAdded, typeToEdit }) => {
    const { toast } = useToast();
    const [name, setName] = useState('');
    const [color, setColor] = useState(colors[0]);
    const [duration, setDuration] = useState(30);
    const [interval, setInterval] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (typeToEdit) {
                setName(typeToEdit.name);
                setColor(typeToEdit.color || colors[0]);
                setDuration(typeToEdit.duration || 30);
                setInterval(typeToEdit.interval || 0);
            } else {
                setName('');
                setColor(colors[0]);
                setDuration(30);
                setInterval(0);
            }
        }
    }, [typeToEdit, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) {
            toast({ variant: 'destructive', title: 'Nome é obrigatório' });
            return;
        }
        setIsLoading(true);

        const typeData = {
            id: typeToEdit ? typeToEdit.id : `type-${Date.now()}`,
            name,
            color,
            duration: Number(duration),
            interval: Number(interval),
            lastUpdated: new Date().toISOString(),
        };

        try {
            const savedType = await saveConsultationType(typeData);
            toast({
                title: `Tipo de consulta ${typeToEdit ? 'atualizado' : 'criado'}!`,
                description: `"${savedType.name}" foi salvo com sucesso.`,
                className: 'bg-green-600 text-white'
            });
            if (onTypeAdded) {
                onTypeAdded(savedType);
            }
            onClose();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Erro ao salvar', description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-slate-800 border-slate-700 text-white">
                <DialogHeader>
                    <DialogTitle>{typeToEdit ? 'Editar' : 'Novo'} Tipo de Consulta</DialogTitle>
                    <DialogDescription>
                        Crie ou edite um tipo de consulta para usar na agenda.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome do Tipo</Label>
                        <Input
                            id="name"
                            placeholder="Ex: Consulta de Rotina"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            className="bg-slate-700 border-slate-600"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="duration" className="flex items-center gap-2"><Clock className="w-4 h-4" /> Duração (min)</Label>
                            <Input
                                id="duration"
                                type="number"
                                value={duration}
                                onChange={e => setDuration(e.target.value)}
                                required
                                className="bg-slate-700 border-slate-600"
                                min="1"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="interval" className="flex items-center gap-2"><Hourglass className="w-4 h-4" /> Intervalo (min)</Label>
                            <Input
                                id="interval"
                                type="number"
                                value={interval}
                                onChange={e => setInterval(e.target.value)}
                                required
                                className="bg-slate-700 border-slate-600"
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="flex items-center gap-2"><Palette className="w-4 h-4" /> Cor</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal bg-slate-700 border-slate-600">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full" style={{ backgroundColor: color }} />
                                        <span>{color}</span>
                                    </div>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700" align="start">
                                <div className="p-2 grid grid-cols-4 gap-2">
                                    {colors.map((c) => (
                                        <div
                                            key={c}
                                            className="w-8 h-8 rounded-full cursor-pointer ring-2 ring-transparent hover:ring-primary"
                                            style={{ backgroundColor: c }}
                                            onClick={() => setColor(c)}
                                        />
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                    
                    {typeToEdit?.lastUpdated && (
                        <div className="text-xs text-slate-400">
                            Última atualização: {format(new Date(typeToEdit.lastUpdated), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </div>
                    )}

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>Cancelar</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ConsultationTypeModal;

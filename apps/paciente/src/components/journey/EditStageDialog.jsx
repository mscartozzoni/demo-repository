import React, { useState, useEffect } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useApi } from '@/contexts/ApiContext';
import { useToast } from '@/components/ui/use-toast';
import { MessageSquare, PlusCircle } from 'lucide-react';

const ProgressNoteItem = ({ note }) => (
    <div className="text-xs p-2 bg-slate-800/50 rounded-md">
        <p className="font-semibold text-slate-300">{note.description}</p>
        <p className="text-slate-400 mt-1">
            - {note.responsible_professional} em {new Date(note.evolution_at).toLocaleDateString('pt-BR')}
        </p>
    </div>
);


const EditStageDialog = ({ stage, onSave, onClose, onRefreshJourneys, patientId }) => {
    const [formData, setFormData] = useState({
        stage_name: '',
        status: 'pending',
        due_date: '',
        notes: '',
    });
    const [newNote, setNewNote] = useState('');
    const { auth, addProgressNote } = useApi();
    const { toast } = useToast();

    useEffect(() => {
        if (stage) {
            setFormData({
                stage_name: stage.stage_name || '',
                status: stage.status || 'pending',
                due_date: stage.due_date ? new Date(stage.due_date).toISOString().split('T')[0] : '',
                notes: stage.notes || '',
            });
        } else {
             setFormData({ stage_name: '', status: 'pending', due_date: '', notes: '' });
        }
    }, [stage]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (!formData.stage_name) {
            toast({ variant: 'destructive', title: 'O título da etapa é obrigatório.' });
            return;
        }

        const dataToSave = { ...formData };
        if (dataToSave.due_date) {
            const localDate = new Date(dataToSave.due_date + 'T23:59:59');
            dataToSave.due_date = localDate.toISOString();
        } else {
            dataToSave.due_date = null;
        }

        if (dataToSave.status === 'completed' && !stage?.completed_at) {
            dataToSave.completed_at = new Date().toISOString();
        }

        onSave(dataToSave);
    };

    const handleAddNote = async () => {
        if (!newNote.trim()) return;
        
        const noteData = {
            patient_id: patientId,
            journey_stage_id: stage.id,
            description: newNote,
            evolution_at: new Date().toISOString(),
            responsible_professional: auth.user?.email || 'Sistema',
            title: `Nota: ${stage.stage_name}`
        };

        try {
            await addProgressNote(noteData);
            toast({ title: "✅ Nota de progresso adicionada!" });
            setNewNote('');
            onRefreshJourneys();
        } catch (error) {
            toast({ variant: "destructive", title: "Erro ao adicionar nota." });
        }
    };

    return (
        <DialogContent className="max-w-md">
            <DialogHeader>
                <DialogTitle>{stage?.id ? 'Editar Etapa da Jornada' : 'Adicionar Nova Etapa'}</DialogTitle>
                <DialogDescription>
                    {stage?.id ? 'Atualize os detalhes desta etapa.' : 'Adicione um novo marco na jornada do paciente.'}
                </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-4 py-4">
                <div>
                    <Label htmlFor="stage_name">Título da Etapa</Label>
                    <Input id="stage_name" name="stage_name" placeholder="Ex: Consulta Inicial" value={formData.stage_name} onChange={handleChange} />
                </div>
                <div>
                    <Label htmlFor="status">Status</Label>
                    <select id="status" name="status" className="input-field w-full" value={formData.status} onChange={handleChange}>
                        <option value="pending">Pendente</option>
                        <option value="in_progress">Em Andamento</option>
                        <option value="completed">Concluído</option>
                    </select>
                </div>
                <div>
                    <Label htmlFor="due_date">Data de Vencimento (Opcional)</Label>
                    <Input id="due_date" name="due_date" type="date" value={formData.due_date} onChange={handleChange} />
                </div>
                <div>
                    <Label htmlFor="notes">Notas Gerais da Etapa</Label>
                    <textarea id="notes" name="notes" className="input-field w-full h-20 resize-none" placeholder="Descreva os detalhes da etapa..." value={formData.notes} onChange={handleChange}></textarea>
                </div>
                
                {stage?.id && (
                    <div className="space-y-2">
                        <Label>Notas de Progresso</Label>
                        <ScrollArea className="h-24 w-full rounded-md border border-slate-700 p-2 bg-slate-900/50">
                            {stage.progress_notes?.length > 0 ? (
                                <div className="space-y-2">
                                    {stage.progress_notes.map(note => <ProgressNoteItem key={note.id} note={note} />)}
                                </div>
                            ) : (
                                <p className="text-xs text-center text-slate-400 py-4">Nenhuma nota de progresso.</p>
                            )}
                        </ScrollArea>
                        <div className="flex gap-2 items-center">
                            <Input 
                                placeholder="Adicionar nova nota..."
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                className="text-sm"
                            />
                            <Button size="icon" onClick={handleAddNote} className="shrink-0 btn-secondary h-9 w-9">
                                <PlusCircle className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

            </div>
            <DialogFooter>
                <Button variant="outline" onClick={onClose}>Cancelar</Button>
                <Button className="btn-primary" onClick={handleSave}>Salvar</Button>
            </DialogFooter>
        </DialogContent>
    );
};

export default EditStageDialog;
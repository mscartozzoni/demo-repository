import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { StickyNote, Plus, Trash2, Save } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const NoteModal = ({ patient, onSave, trigger }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [note, setNote] = useState('');
    const [checklist, setChecklist] = useState([]);
    const [newChecklistItem, setNewChecklistItem] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setTitle('');
            setNote('');
            setChecklist([]);
            setNewChecklistItem('');
        }
    }, [isOpen]);

    const handleAddChecklistItem = () => {
        if (newChecklistItem.trim()) {
            setChecklist(prev => [...prev, { id: crypto.randomUUID(), text: newChecklistItem, completed: false, completed_at: null }]);
            setNewChecklistItem('');
        }
    };

    const handleToggleChecklistItem = (id) => {
        setChecklist(prev => prev.map(item => 
            item.id === id 
            ? { ...item, completed: !item.completed, completed_at: !item.completed ? new Date().toISOString() : null } 
            : item
        ));
    };
    
    const handleRemoveChecklistItem = (id) => {
        setChecklist(prev => prev.filter(item => item.id !== id));
    };

    const handleSave = async () => {
        const doc = {
            patient_id: patient?.id,
            type: 'nota',
            title: title || 'Nota Rápida',
            content: {
                note,
                checklist,
            },
            status: 'finalizado'
        };

        const result = await onSave(doc);
        if (result.success) {
            setIsOpen(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <StickyNote className="w-5 h-5 text-amber-400" />
                        Nota Rápida
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Input 
                        placeholder="Título da Nota"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="bg-slate-700 border-slate-600"
                    />
                    <Textarea 
                        placeholder="Escreva sua anotação aqui..."
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        className="bg-slate-700 border-slate-600 min-h-[100px]"
                    />

                    <Separator className="bg-slate-600" />

                    <div>
                        <h4 className="font-semibold mb-2">Checklist de Tarefas</h4>
                        <div className="space-y-2">
                            {checklist.map(item => (
                                <div key={item.id} className="flex items-center gap-3 group">
                                    <Checkbox 
                                        id={`item-${item.id}`} 
                                        checked={item.completed}
                                        onCheckedChange={() => handleToggleChecklistItem(item.id)}
                                    />
                                    <div className="flex-1">
                                        <Label 
                                            htmlFor={`item-${item.id}`} 
                                            className={`transition-colors ${item.completed ? 'line-through text-slate-400' : 'text-white'}`}
                                        >
                                            {item.text}
                                        </Label>
                                        {item.completed && item.completed_at && (
                                            <p className="text-xs text-slate-500">
                                                Concluído em: {format(new Date(item.completed_at), "dd/MM/yy 'às' HH:mm", { locale: ptBR })}
                                            </p>
                                        )}
                                    </div>
                                    <Button size="icon" variant="ghost" className="h-7 w-7 opacity-0 group-hover:opacity-100" onClick={() => handleRemoveChecklistItem(item.id)}>
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2 mt-3">
                            <Input 
                                placeholder="Adicionar nova tarefa..."
                                value={newChecklistItem}
                                onChange={e => setNewChecklistItem(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAddChecklistItem()}
                                className="bg-slate-700 border-slate-600"
                            />
                            <Button onClick={handleAddChecklistItem}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button onClick={handleSave}>
                            <Save className="w-4 h-4 mr-2" />
                            Salvar Nota
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default NoteModal;
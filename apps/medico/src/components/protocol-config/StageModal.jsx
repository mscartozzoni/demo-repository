import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckIcon, PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const StageModal = ({ stage = null, onSave, children }) => {
    const isEdit = !!stage;
    
    const [formData, setFormData] = useState({
        id: stage?.id || null,
        name: stage?.name || '',
        event: stage?.event || 'Consulta',
        description: stage?.description || '',
        deadline: stage?.deadline || { type: 'after_previous', days: 7, return_number: 1 },
        checklist: stage?.checklist || [{ task: '', action_link: '' }],
        notifyRules: {
            beforeDue: stage?.notifyRules?.beforeDue || 2,
            onDue: stage?.notifyRules?.onDue === false ? false : true,
            afterDue: stage?.notifyRules?.afterDue || 1
        }
    });
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        setIsOpen(false);
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    
    const handleDeadlineChange = (field, value) => {
        const newDeadline = { ...formData.deadline, [field]: value };
        if (field === 'type') {
            // Reset days/return_number when type changes for cleaner data
            newDeadline.days = newDeadline.type === 'post_op' ? undefined : 7;
            newDeadline.return_number = newDeadline.type === 'post_op' ? 1 : undefined;
        }
        setFormData(prev => ({ ...prev, deadline: newDeadline }));
    };

    const handleChecklistChange = (index, field, value) => {
        const newChecklist = [...formData.checklist];
        newChecklist[index][field] = value;
        setFormData(prev => ({ ...prev, checklist: newChecklist }));
    };

    const addChecklistItem = () => {
        setFormData(prev => ({
            ...prev,
            checklist: [...prev.checklist, { task: '', action_link: '' }]
        }));
    };

    const removeChecklistItem = (index) => {
        const newChecklist = formData.checklist.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, checklist: newChecklist }));
    };

    const handleNotifyRulesChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            notifyRules: { ...prev.notifyRules, [field]: value }
        }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-white">
                        {isEdit ? 'Editar Etapa' : 'Nova Etapa'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Nome da Etapa</label>
                            <Input
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="Ex: Consulta Inicial"
                                className="bg-slate-700 border-slate-600 text-white"
                                required
                            />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-slate-300 mb-2">Evento Vinculado</label>
                            <select
                                value={formData.event}
                                onChange={(e) => handleChange('event', e.target.value)}
                                className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                required
                            >
                                <option value="Consulta">Consulta</option>
                                <option value="Cirurgia">Cirurgia</option>
                            </select>
                        </div>
                    </div>
                    
                     <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Descrição</label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="Descreva o que acontece nesta etapa..."
                            className="bg-slate-700 border-slate-600 text-white min-h-[80px]"
                        />
                    </div>

                    <div>
                        <h4 className="text-lg font-medium text-white mb-3">Lógica do Prazo (SLA)</h4>
                        <Tabs value={formData.deadline.type} onValueChange={(v) => handleDeadlineChange('type', v)} className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="after_previous">Pós-Etapa</TabsTrigger>
                                <TabsTrigger value="before_event">Pré-Evento</TabsTrigger>
                                <TabsTrigger value="post_op">Pós-Operatório</TabsTrigger>
                            </TabsList>
                            <TabsContent value="after_previous" className="bg-slate-700/50 p-4 rounded-b-lg">
                                <label className="block text-sm font-medium text-slate-300 mb-2">Concluir em (dias após etapa anterior)</label>
                                <Input type="number" value={formData.deadline.days || ''} onChange={e => handleDeadlineChange('days', parseInt(e.target.value) || 0)} className="bg-slate-700 border-slate-600 text-white" />
                            </TabsContent>
                            <TabsContent value="before_event" className="bg-slate-700/50 p-4 rounded-b-lg">
                                <label className="block text-sm font-medium text-slate-300 mb-2">Concluir até (dias antes da cirurgia)</label>
                                <Input type="number" value={formData.deadline.days || ''} onChange={e => handleDeadlineChange('days', parseInt(e.target.value) || 0)} className="bg-slate-700 border-slate-600 text-white" />
                            </TabsContent>
                             <TabsContent value="post_op" className="bg-slate-700/50 p-4 rounded-b-lg">
                               <label className="block text-sm font-medium text-slate-300 mb-2">Selecione o Retorno</label>
                               <select
                                value={formData.deadline.return_number || 1}
                                onChange={e => handleDeadlineChange('return_number', parseInt(e.target.value))}
                                className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                               >
                                  <option value="1">1º Retorno (4-5 dias)</option>
                                  <option value="2">2º Retorno (+7 dias)</option>
                                  <option value="3">3º Retorno (+7 dias)</option>
                                  <option value="4">4º Retorno (+14 dias)</option>
                                  <option value="5">5º Retorno (~30 dias total)</option>
                                  <option value="6">6º Retorno (6 meses)</option>
                               </select>
                               <p className="text-xs text-slate-400 mt-2">O prazo é calculado automaticamente com base na data da cirurgia.</p>
                            </TabsContent>
                        </Tabs>
                    </div>
                    
                    <div>
                        <h4 className="text-lg font-medium text-white mb-3">Checklist da Etapa</h4>
                        <div className="space-y-3">
                            {formData.checklist.map((item, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Input
                                        value={item.task}
                                        onChange={(e) => handleChecklistChange(index, 'task', e.target.value)}
                                        placeholder="Nome da tarefa"
                                        className="bg-slate-700 border-slate-600 text-white"
                                    />
                                    <Input
                                        value={item.action_link}
                                        onChange={(e) => handleChecklistChange(index, 'action_link', e.target.value)}
                                        placeholder="Link da Ação (opcional)"
                                        className="bg-slate-700 border-slate-600 text-white"
                                    />
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeChecklistItem(index)}>
                                        <TrashIcon className="w-4 h-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={addChecklistItem} className="mt-3 border-dashed border-slate-600">
                           <PlusIcon className="w-4 h-4 mr-2" /> Adicionar Tarefa
                        </Button>
                    </div>

                    <div>
                        <h4 className="text-lg font-medium text-white mb-3">Regras de Notificação</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Dias antes do prazo</label>
                                <Input
                                    type="number"
                                    value={formData.notifyRules.beforeDue}
                                    onChange={(e) => handleNotifyRulesChange('beforeDue', parseInt(e.target.value))}
                                    className="bg-slate-700 border-slate-600 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">No dia do prazo</label>
                                <select
                                    value={formData.notifyRules.onDue}
                                    onChange={(e) => handleNotifyRulesChange('onDue', e.target.value === 'true')}
                                    className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                >
                                    <option value="true">Sim</option>
                                    <option value="false">Não</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Dias após o prazo</label>
                                <Input
                                    type="number"
                                    value={formData.notifyRules.afterDue}
                                    onChange={(e) => handleNotifyRulesChange('afterDue', parseInt(e.target.value))}
                                    className="bg-slate-700 border-slate-600 text-white"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button type="submit" className="bg-green-600 hover:bg-green-700">
                            <CheckIcon className="w-4 h-4 mr-2" />
                            Salvar Etapa
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default StageModal;
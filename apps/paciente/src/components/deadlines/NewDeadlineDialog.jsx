import React from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const NewDeadlineDialog = ({ onSave }) => {
    return (
        <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>Criar Novo Prazo</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="md:col-span-2"><label className="block text-sm font-medium mb-2">Título</label><Input placeholder="Ex: Relatório Mensal de Atendimentos" /></div>
                <div className="md:col-span-2"><label className="block text-sm font-medium mb-2">Descrição</label><textarea className="input-field w-full h-24 resize-none" placeholder="Descreva os detalhes do prazo..."></textarea></div>
                <div><label className="block text-sm font-medium mb-2">Data de Vencimento</label><Input type="date" /></div>
                <div><label className="block text-sm font-medium mb-2">Prioridade</label><select className="input-field w-full"><option value="low">Baixa</option><option value="medium">Média</option><option value="high">Alta</option></select></div>
                <div><label className="block text-sm font-medium mb-2">Categoria</label><select className="input-field w-full"><option value="administrative">Administrativo</option><option value="legal">Legal</option><option value="technical">Técnico</option><option value="training">Treinamento</option><option value="compliance">Conformidade</option></select></div>
                <div><label className="block text-sm font-medium mb-2">Responsável</label><Input placeholder="Nome do responsável" /></div>
                 <div className="md:col-span-2"><label className="block text-sm font-medium mb-2">Associar Protocolo (Opcional)</label><Input placeholder="Digite o ID do protocolo, ex: PROT-2025-001" /></div>
            </div>
            <div className="flex justify-end space-x-2"><Button variant="outline">Cancelar</Button><Button className="btn-primary" onClick={onSave}>Salvar Prazo</Button></div>
        </DialogContent>
    );
};

export default NewDeadlineDialog;
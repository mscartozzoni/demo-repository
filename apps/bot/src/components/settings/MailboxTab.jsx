
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useData } from '@/contexts/DataContext';
import { Plus, Trash2, Edit, Mail, Tag } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

const MailboxTab = () => {
  const { toast } = useToast();
  const { mailboxes, updateMailboxes, tags } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMailbox, setEditingMailbox] = useState(null);
  const [newMailbox, setNewMailbox] = useState({ email: '', functions: [] });
  const [currentFunction, setCurrentFunction] = useState({ name: '', tags: [] });

  const handleAddMailbox = () => {
    if (!newMailbox.email || newMailbox.functions.length === 0) {
      toast({
        variant: 'destructive',
        title: "Erro",
        description: "Preencha o email e adicione pelo menos uma função."
      });
      return;
    }

    const mailboxToAdd = {
      id: `mailbox_${Date.now()}`,
      email: newMailbox.email,
      functions: newMailbox.functions
    };

    updateMailboxes([...(mailboxes || []), mailboxToAdd]);
    toast({
      title: "✅ Caixa de Entrada Adicionada!",
      description: `Email ${newMailbox.email} foi configurado.`
    });
    setNewMailbox({ email: '', functions: [] });
    setIsDialogOpen(false);
  };

  const handleEditMailbox = (mailbox) => {
    setEditingMailbox(mailbox);
    setNewMailbox({
      email: mailbox.email,
      functions: mailbox.functions
    });
    setIsDialogOpen(true);
  };

  const handleUpdateMailbox = () => {
    if (!newMailbox.email || newMailbox.functions.length === 0) {
      toast({
        variant: 'destructive',
        title: "Erro",
        description: "Preencha o email e adicione pelo menos uma função."
      });
      return;
    }

    const updatedMailboxes = (mailboxes || []).map(m =>
      m.id === editingMailbox.id
        ? { ...m, email: newMailbox.email, functions: newMailbox.functions }
        : m
    );

    updateMailboxes(updatedMailboxes);
    toast({
      title: "✅ Caixa de Entrada Atualizada!",
      description: `Email ${newMailbox.email} foi atualizado.`
    });
    setNewMailbox({ email: '', functions: [] });
    setEditingMailbox(null);
    setIsDialogOpen(false);
  };

  const handleDeleteMailbox = (mailboxId) => {
    const updatedMailboxes = (mailboxes || []).filter(m => m.id !== mailboxId);
    updateMailboxes(updatedMailboxes);
    toast({
      title: "Caixa de Entrada Removida",
      description: "A caixa de entrada foi excluída."
    });
  };

  const handleAddFunction = () => {
    if (!currentFunction.name || currentFunction.tags.length === 0) {
      toast({
        variant: 'destructive',
        title: "Erro",
        description: "Preencha o nome da função e selecione pelo menos uma etiqueta."
      });
      return;
    }

    setNewMailbox(prev => ({
      ...prev,
      functions: [...prev.functions, { ...currentFunction }]
    }));
    setCurrentFunction({ name: '', tags: [] });
    toast({
      title: "Função Adicionada!",
      description: `Função "${currentFunction.name}" foi adicionada.`
    });
  };

  const handleRemoveFunction = (index) => {
    setNewMailbox(prev => ({
      ...prev,
      functions: prev.functions.filter((_, i) => i !== index)
    }));
  };

  const handleToggleTag = (tagId) => {
    setCurrentFunction(prev => {
      const tagExists = prev.tags.includes(tagId);
      if (tagExists) {
        return { ...prev, tags: prev.tags.filter(t => t !== tagId) };
      } else {
        return { ...prev, tags: [...prev.tags, tagId] };
      }
    });
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingMailbox(null);
    setNewMailbox({ email: '', functions: [] });
    setCurrentFunction({ name: '', tags: [] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Caixas de Entrada</h2>
          <p className="text-muted-foreground">Configure os emails e suas funções com etiquetas associadas.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) handleDialogClose();
          else setIsDialogOpen(true);
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Caixa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingMailbox ? 'Editar Caixa de Entrada' : 'Nova Caixa de Entrada'}</DialogTitle>
              <DialogDescription>
                Configure o email e as funções com suas respectivas etiquetas.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email da Caixa de Entrada</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemplo@clinica.com"
                  value={newMailbox.email}
                  onChange={(e) => setNewMailbox(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Funções Configuradas</Label>
                  <Badge variant="secondary">{newMailbox.functions.length} função(ões)</Badge>
                </div>
                
                {newMailbox.functions.length > 0 && (
                  <div className="space-y-2">
                    {newMailbox.functions.map((func, index) => (
                      <Card key={index} className="glass-effect-soft">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <Tag className="h-4 w-4 text-primary" />
                                <span className="font-semibold">{func.name}</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {(func.tags || []).map(tagId => {
                                  const tag = (tags || []).find(t => t.id === tagId);
                                  return tag ? (
                                    <Badge key={tagId} style={{ backgroundColor: tag.color || '#888', color: 'white' }}>
                                      {tag.name}
                                    </Badge>
                                  ) : null;
                                })}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveFunction(index)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                <Card className="glass-effect-soft border-dashed">
                  <CardHeader>
                    <CardTitle className="text-base">Adicionar Nova Função</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="function-name">Nome da Função</Label>
                      <Input
                        id="function-name"
                        placeholder="Ex: Agendamento, Orçamento, Financeiro"
                        value={currentFunction.name}
                        onChange={(e) => setCurrentFunction(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>Etiquetas da Função</Label>
                      <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2 border rounded-lg bg-background/50">
                        {(tags || []).map(tag => (
                          <div key={tag.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`tag-${tag.id}`}
                              checked={(currentFunction.tags || []).includes(tag.id)}
                              onCheckedChange={() => handleToggleTag(tag.id)}
                            />
                            <label
                              htmlFor={`tag-${tag.id}`}
                              className="flex items-center gap-2 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              <Badge style={{ backgroundColor: tag.color || '#888', color: 'white' }}>
                                {tag.name}
                              </Badge>
                            </label>
                          </div>
                        ))}
                      </div>
                      {currentFunction.tags.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          {currentFunction.tags.length} etiqueta(s) selecionada(s)
                        </div>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleAddFunction}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Função
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleDialogClose}>
                Cancelar
              </Button>
              <Button onClick={editingMailbox ? handleUpdateMailbox : handleAddMailbox}>
                {editingMailbox ? 'Atualizar' : 'Adicionar'} Caixa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {(!mailboxes || mailboxes.length === 0) ? (
          <Card className="glass-effect-soft">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Mail className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                Nenhuma caixa de entrada configurada ainda.
                <br />
                Clique em "Nova Caixa" para começar.
              </p>
            </CardContent>
          </Card>
        ) : (
          mailboxes.map(mailbox => (
            <Card key={mailbox.id} className="glass-effect-soft">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-primary" />
                      {mailbox.email}
                    </CardTitle>
                    <CardDescription>
                      {mailbox.functions.length} função(ões) configurada(s)
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditMailbox(mailbox)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteMailbox(mailbox.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(mailbox.functions || []).map((func, index) => (
                    <div key={index} className="p-3 rounded-lg bg-secondary/50 space-y-2">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-primary" />
                        <span className="font-semibold">{func.name}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {(func.tags || []).map(tagId => {
                          const tag = (tags || []).find(t => t.id === tagId);
                          return tag ? (
                             <Badge key={tagId} style={{ backgroundColor: tag.color || '#888', color: 'white' }}>
                              {tag.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MailboxTab;

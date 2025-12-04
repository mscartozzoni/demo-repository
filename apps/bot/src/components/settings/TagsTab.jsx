import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useData } from '@/contexts/DataContext';
import { Tag, Plus, Trash2, Palette } from 'lucide-react';

const colorOptions = [
  'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 
  'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500', 
  'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500', 
  'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500'
];

const TagsTab = () => {
  const { toast } = useToast();
  const { tags, addTag, removeTag } = useData();
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(colorOptions[10]);

  const handleAddTag = () => {
    if (!newTagName) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, insira o nome da etiqueta."
      });
      return;
    }
    addTag({ name: newTagName, color: newTagColor });
    setNewTagName('');
    toast({
      title: "🎉 Etiqueta adicionada!",
      description: `A etiqueta "${newTagName}" foi criada com sucesso.`
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Gerenciamento de Etiquetas</h2>
        <p className="text-muted-foreground">Crie e personalize etiquetas para organizar suas conversas.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-effect-strong text-foreground">
          <CardHeader>
            <CardTitle className="text-foreground">Criar Nova Etiqueta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input 
              placeholder="Nome da Etiqueta" 
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              className="bg-input text-foreground border-border placeholder:text-muted-foreground"
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Palette className="h-4 w-4" /> Selecione uma Cor</label>
              <div className="grid grid-cols-9 gap-2">
                {colorOptions.map(color => (
                  <button
                    key={color}
                    onClick={() => setNewTagColor(color)}
                    className={`h-8 w-8 rounded-full ${color} transition-transform duration-200 ${newTagColor === color ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-white scale-110' : 'hover:scale-110'}`}
                    aria-label={`Select ${color} color`}
                  />
                ))}
              </div>
            </div>
            <Button onClick={handleAddTag} className="w-full" variant="glassPrimary">
              <Plus className="mr-2 h-4 w-4" />
              Criar Etiqueta
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-effect-strong text-foreground">
          <CardHeader>
            <CardTitle className="text-foreground">Etiquetas Existentes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
              {tags.map(tag => (
                <li key={tag.id} className="flex items-center justify-between p-2 rounded-md bg-secondary">
                  <div className="flex items-center space-x-3">
                    <Tag className={`h-5 w-5 ${tag.color.replace('bg-', 'text-')}`} />
                    <span className={`px-2 py-1 rounded-md text-sm font-medium text-white ${tag.color}`}>
                      {tag.name}
                    </span>
                  </div>
                  <Button variant="destructive" size="icon" className="h-8 w-8 bg-red-500/50 hover:bg-red-500/70" onClick={() => removeTag(tag.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TagsTab;
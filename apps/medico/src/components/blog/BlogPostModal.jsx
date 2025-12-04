import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Helmet } from 'react-helmet';
import { Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { generateBlogPost } from '@/services/api/ai';
import { getProfiles } from '@/services/api/profile';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';

const AIWriterAssistant = ({ onContentGenerated, onIsLoading }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleGenerate = async () => {
        if (!prompt) {
            toast({ variant: 'destructive', title: 'Prompt vazio', description: 'Por favor, insira um tema para a IA.' });
            return;
        }
        setIsLoading(true);
        onIsLoading(true);
        try {
            const response = await generateBlogPost(prompt);
            if (response.success && response.data) {
                onContentGenerated(response.data.title, response.data.content);
                toast({ title: 'Conteúdo gerado com sucesso!', className: 'bg-green-600 text-white' });
            } else {
                throw new Error(response.error?.message || 'Falha ao gerar conteúdo.');
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Erro da IA', description: error.message });
        } finally {
            setIsLoading(false);
            onIsLoading(false);
        }
    };

    return (
        <div className="space-y-3 p-4 rounded-lg bg-primary/10 border border-primary/20 my-4">
            <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-white">Assistente de IA</h4>
            </div>
            <p className="text-sm text-muted-foreground">Descreva o tema do post, e a IA irá gerar o título e o conteúdo para você.</p>
            <div className="flex gap-2">
                <Input 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ex: Benefícios da rinoplastia"
                    disabled={isLoading}
                />
                <Button onClick={handleGenerate} disabled={isLoading}>
                    {isLoading ? 'Gerando...' : 'Gerar'}
                </Button>
            </div>
        </div>
    );
};

const BlogPostModal = ({ isOpen, onClose, onSave, post }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [authors, setAuthors] = useState([]);
  const { user, profile } = useAuth();
  const isAdmin = profile?.app_role === 'admin';

  useEffect(() => {
    if (isOpen && isAdmin) {
        const fetchAuthors = async () => {
            const response = await getProfiles();
            if (response.success) {
                setAuthors(response.data);
            }
        };
        fetchAuthors();
    }
  }, [isOpen, isAdmin]);

  useEffect(() => {
    if (post) {
      setTitle(post.title || '');
      setContent(post.content || '');
      setImageUrl(post.image_url || '');
      setAuthorId(post.author_id || post.author?.id || user?.id);
    } else {
      setTitle('');
      setContent('');
      setImageUrl('');
      setAuthorId(user?.id || '');
    }
  }, [post, isOpen, user]);

  const handleSubmit = async () => {
    setIsSaving(true);
    const postData = { title, content, image_url: imageUrl };
    if (isAdmin) {
        postData.author_id = authorId;
    }
    await onSave(postData);
    setIsSaving(false);
    onClose();
  };
  
  const handleContentGenerated = (generatedTitle, generatedContent) => {
    setTitle(generatedTitle);
    setContent(generatedContent);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <Helmet>
        <title>{post ? 'Editar Post' : 'Novo Post'} - Portal do Médico</title>
        <meta name="description" content={post ? `Editando o post: ${post.title}` : "Criando um novo post para o blog."} />
      </Helmet>
      <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl text-white">
        <DialogHeader>
          <DialogTitle>{post ? 'Editar Post' : 'Novo Post'}</DialogTitle>
          <DialogDescription>
            {post ? 'Faça alterações no seu post existente.' : 'Crie um novo post para o seu blog.'}
          </DialogDescription>
        </DialogHeader>

        <AIWriterAssistant 
            onContentGenerated={handleContentGenerated} 
            onIsLoading={setIsAiLoading}
        />

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título do seu post"
              disabled={isAiLoading}
            />
          </div>
          {isAdmin && (
              <div className="space-y-2">
                <Label htmlFor="author">Autor</Label>
                <Select value={authorId} onValueChange={setAuthorId}>
                    <SelectTrigger id="author" disabled={isAiLoading}>
                        <SelectValue placeholder="Selecione um autor" />
                    </SelectTrigger>
                    <SelectContent>
                        {authors.map((author) => (
                            <SelectItem key={author.id} value={author.id}>
                                {author.full_name || author.username}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL da Imagem</Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
              disabled={isAiLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escreva o conteúdo do seu post aqui..."
              className="min-h-[200px]"
              disabled={isAiLoading}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost" disabled={isAiLoading}>Cancelar</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isSaving || isAiLoading} className="bg-blue-600 hover:bg-blue-700">
            {isSaving ? 'Salvando...' : 'Salvar Post'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPostModal;
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

const ProfileSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.user_metadata?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Perfil atualizado!',
        description: 'Suas informações foram salvas (simulação).',
      });
      setLoading(false);
    }, 1000);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  const handleAvatarUpload = () => {
    toast({
        title: '🚧 Em construção!',
        description: 'O upload de avatar será implementado em breve!',
        duration: 5000,
    });
  }

  return (
    <Card className="max-w-2xl bg-slate-800/50 border-slate-700 text-white">
      <CardHeader>
        <CardTitle>Perfil</CardTitle>
        <CardDescription>Gerencie suas informações pessoais.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-slate-700">
                <AvatarImage src={user?.user_metadata?.avatar_url} alt={name} />
                <AvatarFallback className="bg-slate-600 text-2xl">
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>
              <Button
                type="button"
                size="icon"
                className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                onClick={handleAvatarUpload}
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{name}</h2>
              <p className="text-slate-400">
                {user?.user_metadata?.role === 'secretary' ? 'Secretária' : 'Paciente'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={email} disabled />
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-slate-700 pt-6">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Alterações
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProfileSettings;

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSchema } from '@/contexts/SchemaContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IdCardIcon, PersonIcon, EnvelopeClosedIcon, Pencil2Icon, CameraIcon, CheckIcon } from '@radix-ui/react-icons';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Profile = () => {
  const { user, loading: authLoading, updateUserProfile } = useAuth();
  const { getAlias } = useSchema();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        bio: user.bio || '',
      });
      setAvatarPreview(user.avatar_url || '');
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // For now, avatar upload is mocked with a toast.
      if (avatarFile) {
        toast({
            title: "🚧 Funcionalidade não implementada",
            description: "O upload de avatar não está implementado com o mock de localStorage.",
            className: "bg-orange-600 text-white",
        });
      }

      const { success, error } = await updateUserProfile({
        full_name: formData.full_name,
        bio: formData.bio,
      });

      if (success) {
        toast({
          title: getAlias('toast_title', 'profile_update_success', 'Perfil Atualizado'),
          description: getAlias('toast_desc', 'profile_update_success', 'Suas informações foram salvas com sucesso.'),
        });
      } else {
        throw new Error(error || 'Falha ao atualizar o perfil.');
      }
      
    } catch (error) {
      toast({
        variant: 'destructive',
        title: getAlias('toast_title', 'update_error', 'Erro ao Salvar'),
        description: error.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  if (authLoading || !user) {
      return <div className="text-white text-center p-10">Carregando perfil...</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="flex items-center gap-4 mb-8">
        <IdCardIcon className="w-8 h-8 text-blue-400" />
        <div>
          <h1 className="text-3xl font-bold text-white">
            {getAlias('page_title', 'user_profile', 'Perfil de Usuário')}
          </h1>
          <p className="text-slate-400 mt-1">
            {getAlias('page_subtitle', 'profile_subtitle', 'Gerencie suas informações pessoais e configurações.')}
          </p>
        </div>
      </div>

      <div className="glass-effect rounded-xl p-6 md:p-8">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            <div className="relative group">
              <Avatar className="w-32 h-32 border-4 border-slate-700 group-hover:border-blue-500 transition-colors">
                <AvatarImage src={avatarPreview} alt={formData.full_name} />
                <AvatarFallback className="text-4xl bg-slate-800">
                  {getInitials(formData.full_name || user.email)}
                </AvatarFallback>
              </Avatar>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                className="hidden"
                accept="image/png, image/jpeg, image/gif"
              />
              <Button
                type="button"
                size="icon"
                variant="shine"
                className="absolute bottom-1 right-1 rounded-full h-10 w-10"
                onClick={() => {
                    toast({
                        title: "🚧 Funcionalidade não implementada",
                        description: "O upload de avatar não está implementado com o mock de localStorage.",
                        className: "bg-orange-600 text-white",
                    });
                    // fileInputRef.current.click(); // Keep this for future implementation
                }}
              >
                <CameraIcon className="w-5 h-5" />
              </Button>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-white">{user.full_name}</h2>
              <p className="text-blue-400">{user.email}</p>
              <p className="text-slate-400 mt-2 text-sm max-w-md">{user.bio || "Adicione uma pequena biografia sobre você."}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="full_name" className="flex items-center gap-2 text-slate-300">
                <PersonIcon />
                {getAlias('field_label', 'full_name', 'Nome Completo')}
              </Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className="bg-slate-800/50 border-slate-700"
                disabled={isSaving}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-slate-300">
                <EnvelopeClosedIcon />
                {getAlias('field_label', 'email', 'Email')}
              </Label>
              <Input
                id="email"
                value={user.email}
                disabled
                className="bg-slate-800/50 border-slate-700 disabled:opacity-70 disabled:cursor-not-allowed"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bio" className="flex items-center gap-2 text-slate-300">
                <Pencil2Icon />
                {getAlias('field_label', 'bio', 'Biografia')}
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="bg-slate-800/50 border-slate-700"
                placeholder="Conte-nos um pouco sobre você..."
                disabled={isSaving}
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <Button type="submit" variant="shine" disabled={isSaving}>
              <AnimatePresence mode="wait">
                <motion.span
                    key={isSaving ? 'saving' : 'save'}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-center"
                >
                  {isSaving ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      />
                      {getAlias('button', 'saving', 'Salvando...')}
                    </>
                  ) : (
                    <>
                      <CheckIcon className="w-4 h-4 mr-2" />
                      {getAlias('button', 'save_changes', 'Salvar Alterações')}
                    </>
                  )}
                </motion.span>
              </AnimatePresence>
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default Profile;

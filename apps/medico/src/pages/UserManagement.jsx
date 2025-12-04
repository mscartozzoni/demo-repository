import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Users, Edit, Shield, ToggleLeft, ToggleRight, Search, Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const MOCK_USERS_KEY = 'mock_users_data';

const getInitialUsers = () => {
  try {
    const savedUsers = localStorage.getItem(MOCK_USERS_KEY);
    if (savedUsers) {
      return JSON.parse(savedUsers);
    }
  } catch (error) {
    console.error("Failed to parse users from localStorage", error);
  }
  return [
    { id: 'usr_1', name: 'Dr. Ricardo', email: 'ricardo.alves@email.com', role: 'admin', status: 'active' },
    { id: 'usr_2', name: 'Juliana (Secretária)', email: 'juliana.s@email.com', role: 'editor', status: 'active' },
    { id: 'usr_3', name: 'Carlos (Financeiro)', email: 'carlos.f@email.com', role: 'viewer', status: 'inactive' },
    { id: 'usr_4', name: 'Ana (Enfermeira)', email: 'ana.p@email.com', role: 'editor', status: 'active' },
  ];
};

const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState(getInitialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error("Failed to save users to localStorage", error);
    }
  }, [users]);

  const openModalForEdit = (user) => {
    setCurrentUser({ ...user });
    setIsNewUser(false);
    setIsModalOpen(true);
  };

  const openModalForNew = () => {
    setCurrentUser({ name: '', email: '', role: 'viewer', status: 'active' });
    setIsNewUser(true);
    setIsModalOpen(true);
  };

  const handlePasswordReset = (user) => {
    toast({
      title: 'Redefinição de Senha Enviada!',
      description: `Um e-mail de redefinição de senha foi enviado para ${user.email}.`,
      className: 'bg-blue-600 text-white',
    });
  };

  const toggleUserStatus = (userId) => {
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } 
        : u
    ));
    toast({
      title: 'Status Alterado!',
      description: `O status do usuário foi atualizado com sucesso.`,
    });
  };

  const handleSaveChanges = () => {
    if (!currentUser || !currentUser.email || !currentUser.name) {
        toast({ variant: 'destructive', title: 'Erro', description: 'Nome e e-mail são obrigatórios.' });
        return;
    }

    if (isNewUser) {
        const newUser = { ...currentUser, id: `usr_${Date.now()}` };
        setUsers([...users, newUser]);
        toast({ title: 'Usuário Adicionado!', description: `${newUser.name} foi adicionado com sucesso.`, className: 'bg-green-600 text-white' });
    } else {
        setUsers(users.map(u => u.id === currentUser.id ? currentUser : u));
        toast({ title: 'Usuário Atualizado!', description: 'As informações do usuário foram salvas.', className: 'bg-green-600 text-white' });
    }
    setIsModalOpen(false);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Gerenciamento de Usuários - Portal do Médico</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Gerenciamento de Usuários</h1>
            <p className="text-slate-400 mt-2">Controle acessos, redefina senhas e gerencie permissões.</p>
          </div>
          <Button onClick={openModalForNew}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Novo Usuário
          </Button>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/80">
          <div className="p-4 flex items-center gap-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input 
                placeholder="Buscar por nome ou e-mail..."
                className="pl-10 bg-slate-800 border-slate-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-transparent">
                <TableHead className="text-white">Nome</TableHead>
                <TableHead className="text-white">Função</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-right text-white">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-slate-700/50">
                  <TableCell>
                    <div className="font-medium text-white">{user.name}</div>
                    <div className="text-sm text-slate-400">{user.email}</div>
                  </TableCell>
                  <TableCell>
                     <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'default' : 'outline'}>
                      {user.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openModalForEdit(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handlePasswordReset(user)}>
                        <Shield className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => toggleUserStatus(user.id)}>
                        {user.status === 'active' ? <ToggleRight className="h-5 w-5 text-green-400" /> : <ToggleLeft className="h-5 w-5 text-slate-400" />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>{isNewUser ? 'Adicionar Novo Usuário' : 'Editar Usuário'}</DialogTitle>
            <DialogDescription>
              {isNewUser ? 'Preencha os dados para criar um novo acesso.' : 'Altere as informações e permissões do usuário.'}
            </DialogDescription>
          </DialogHeader>
          {currentUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" value={currentUser.name} onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})} className="bg-slate-800 border-slate-600"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={currentUser.email} onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})} disabled={!isNewUser} className="bg-slate-800 border-slate-600 disabled:opacity-70"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Função</Label>
                 <Select value={currentUser.role} onValueChange={(value) => setCurrentUser({...currentUser, role: value})}>
                    <SelectTrigger className="w-full bg-slate-800 border-slate-600">
                      <SelectValue placeholder="Selecione uma função" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-white">
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveChanges}>{isNewUser ? 'Adicionar Usuário' : 'Salvar Alterações'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserManagement;
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Users2, UserPlus, Mail, Shield, Loader2, ServerCrash, Trash2, MoreVertical, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { getTeamMembers, inviteUser, removeUserFromTeam, transferOwnership } from '@/services/api/team';
import { useAuth } from '@/contexts/AuthContext';

const Team = () => {
    const { toast } = useToast();
    const { user, profile } = useAuth();
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isInviteModalOpen, setInviteModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('member');
    const [transferCandidate, setTransferCandidate] = useState(null);

    const fetchTeam = useCallback(async () => {
        if (!profile?.organization_id) {
            setLoading(false);
            // Using mock data since organization_id is not available
            const mockTeam = [
                { id: profile.id, full_name: profile.full_name, email: profile.email, app_role: 'owner', avatar_url: profile.avatar_url },
                { id: 'member-1', full_name: 'Dr. João Silva', email: 'joao.silva@example.com', app_role: 'admin', avatar_url: 'https://i.pravatar.cc/150?u=member1' },
                { id: 'member-2', full_name: 'Secretária Maria', email: 'maria.sec@example.com', app_role: 'member', avatar_url: 'https://i.pravatar.cc/150?u=member2' },
            ];
            setTeamMembers(mockTeam);
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const result = await getTeamMembers(profile.organization_id);
            if (result.success) {
                setTeamMembers(result.data);
            } else {
                setError('Falha ao carregar os membros da equipe.');
                toast({ variant: 'destructive', title: 'Erro', description: result.message });
            }
        } catch (e) {
            setError('Ocorreu um erro inesperado.');
            toast({ variant: 'destructive', title: 'Erro de Conexão', description: e.message });
        } finally {
            setLoading(false);
        }
    }, [profile, toast]);

    useEffect(() => {
        fetchTeam();
    }, [fetchTeam]);

    const handleInvite = async () => {
        setIsSubmitting(true);
        // Mocking invite
        setTimeout(() => {
             toast({ title: 'Sucesso!', description: 'Convite enviado para ' + inviteEmail + ' (Simulação).' });
            setIsSubmitting(false);
            setInviteModalOpen(false);
            setInviteEmail('');
            setInviteRole('member');
        }, 1000);
    };
    
    const handleRemoveMember = async (memberId) => {
        toast({ title: 'Membro Removido (Simulação)', description: 'O membro foi removido da equipe.' });
        setTeamMembers(prev => prev.filter(m => m.id !== memberId));
    };

    const handleOwnershipTransfer = async () => {
        toast({ variant: 'destructive', title: 'Ação Crítica (Simulação)', description: 'Transferência de titularidade não pode ser completada em modo de demonstração.' });
        setTransferCandidate(null);
    };

    const getInitials = (name) => {
        if (!name) return '??';
        return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    };
    
    const isOwner = profile?.app_role === 'owner';

    const renderContent = () => {
        if (loading) {
            return <div className="flex justify-center items-center h-48"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
        }
        if (error) {
            return <div className="text-center text-red-400 bg-red-900/20 p-4 rounded-lg"><ServerCrash className="mx-auto w-8 h-8 mb-2" />{error}</div>;
        }
        return (
            <div className="space-y-4">
                {teamMembers.map(member => (
                    <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-effect p-4 rounded-xl flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <Avatar>
                                <AvatarImage src={member.avatar_url} />
                                <AvatarFallback className="bg-muted">{getInitials(member.full_name)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold text-white">{member.full_name || member.email}</p>
                                <p className="text-sm text-slate-400">{member.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary capitalize">{member.app_role}</span>
                            {user.id !== member.id && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {isOwner && (
                                            <DropdownMenuItem onSelect={() => setTransferCandidate(member)}>
                                                <Crown className="mr-2 h-4 w-4" />
                                                Transferir Titularidade
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem className="text-red-500 focus:text-red-500" onSelect={() => handleRemoveMember(member.id)}>
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Remover
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        );
    };

    return (
        <>
            <Helmet>
                <title>Gerenciar Equipe - Portal do Médico</title>
                <meta name="description" content="Convide e gerencie os membros da sua equipe." />
            </Helmet>
            <div className="space-y-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-4xl font-extrabold text-white flex items-center gap-3">
                                <Users2 className="w-10 h-10" />
                                Gerenciar Equipe
                            </h1>
                            <p className="text-lg text-slate-300 mt-2">Convide e gerencie os membros da sua equipe.</p>
                        </div>
                        <Button size="lg" onClick={() => setInviteModalOpen(true)}>
                            <UserPlus className="w-5 h-5 mr-2" />
                            Convidar Membro
                        </Button>
                    </div>
                </motion.div>

                <div className="glass-effect p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-white mb-4">Membros da Equipe</h3>
                    {renderContent()}
                </div>
            </div>

            <Dialog open={isInviteModalOpen} onOpenChange={setInviteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Convidar Novo Membro</DialogTitle>
                        <DialogDescription>
                            Digite o e-mail do novo membro e atribua uma função. Ele receberá um convite para se juntar à sua equipe.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">E-mail</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input id="email" type="email" placeholder="nome@exemplo.com" className="pl-10" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="role" className="text-sm font-medium">Função</label>
                            <Select value={inviteRole} onValueChange={setInviteRole}>
                                <SelectTrigger>
                                    <Shield className="mr-2 w-4 h-4 text-muted-foreground" />
                                    <SelectValue placeholder="Selecione uma função" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="member">Membro</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setInviteModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleInvite} disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Enviar Convite
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={!!transferCandidate} onOpenChange={() => setTransferCandidate(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Transferir Titularidade da Organização</DialogTitle>
                        <DialogDescription>
                            Você está prestes a transferir a titularidade para <span className="font-bold text-white">{transferCandidate?.full_name}</span>. Esta ação é <span className="font-bold text-red-400">irreversível</span>.
                            Você perderá privilégios de proprietário e será rebaixado para o cargo de membro.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setTransferCandidate(null)}>Cancelar</Button>
                        <Button variant="destructive" onClick={handleOwnershipTransfer} disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Eu entendo, transferir titularidade
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Team;
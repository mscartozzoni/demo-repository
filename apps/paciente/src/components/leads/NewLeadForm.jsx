
import React, { useState, useCallback } from 'react';
import { DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApi } from '@/contexts/ApiContext';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useForm } from '@/hooks/useForm';

const NewLeadForm = ({ onSave, onClose }) => {
    const { createLead, checkPhoneExists } = useApi();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [phoneError, setPhoneError] = useState('');
    const { formData, handleChange, setFormData } = useForm({
        name: '',
        phone: '',
        email: '',
        interest: '',
        status: 'new',
        source: 'manual'
    });

    const handlePhoneBlur = useCallback(async (e) => {
        const phone = e.target.value;
        if (phone && phone.length > 8) { // Basic validation
            setPhoneError('');
            const exists = await checkPhoneExists(phone);
            if (exists) {
                setPhoneError(`Este telefone já pertence a ${exists.type === 'patient' ? 'um paciente' : 'um contato'}: ${exists.name}.`);
                toast({
                    variant: 'destructive',
                    title: 'Telefone duplicado',
                    description: `Este número já está cadastrado para ${exists.name}.`
                });
            }
        }
    }, [checkPhoneExists, toast]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (phoneError) {
            toast({
                variant: 'destructive',
                title: 'Não é possível salvar',
                description: 'O telefone informado já está em uso.'
            });
            return;
        }

        setLoading(true);
        try {
            const newLead = await createLead(formData);
            if (newLead) {
                onSave();
            }
        } catch (error) {
            // Error is handled by ApiContext
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <DialogHeader>
                <DialogTitle>Novo Lead</DialogTitle>
                <DialogDescription>Adicione um novo lead ou contato manualmente.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div>
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input 
                        id="phone" 
                        name="phone" 
                        type="tel" 
                        value={formData.phone} 
                        onChange={handleChange} 
                        onBlur={handlePhoneBlur}
                        maskOptions={{ mask: '+{55} (00) 00000-0000' }}
                        required 
                    />
                    {phoneError && <p className="text-sm text-red-500 mt-1">{phoneError}</p>}
                </div>
                <div>
                    <Label htmlFor="email">Email (Opcional)</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
                </div>
                <div>
                    <Label htmlFor="interest">Motivo do Contato (Opcional)</Label>
                    <Input id="interest" name="interest" value={formData.interest} onChange={handleChange} />
                </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                    Cancelar
                </Button>
                <Button type="submit" className="btn-primary" disabled={loading || !!phoneError}>
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Salvar Lead
                </Button>
            </DialogFooter>
        </form>
    );
};

export default NewLeadForm;

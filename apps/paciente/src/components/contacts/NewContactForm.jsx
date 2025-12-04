
import React, { useState } from 'react';
import { DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApi } from '@/contexts/ApiContext';
import { Loader2, Copy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const NewContactForm = ({ onSave, onClose }) => {
    const { createContact } = useApi();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        email: '',
        interest: '',
        status: 'new',
        source: 'manual'
    });

    const availabilityLink = 'https://portal-clinic.netlify.app/book/dr-marcio';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(availabilityLink);
        toast({
            title: 'Link Copiado!',
            description: 'O link de disponibilidade foi copiado.',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const newContact = await createContact(formData);
            if (newContact) {
                onSave(newContact);
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
                <DialogTitle>Novo Contato</DialogTitle>
                <DialogDescription>Adicione um novo contato manualmente.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div>
                    <Label htmlFor="full_name">Nome Completo</Label>
                    <Input id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} required />
                </div>
                <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required maskOptions={{ mask: 'INTERNATIONAL_PHONE' }} />
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
            <DialogFooter className="sm:justify-between">
                 <Button type="button" variant="secondary" onClick={handleCopyLink} className="mt-2 sm:mt-0">
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar Link de Agenda
                </Button>
                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button type="submit" className="btn-primary" disabled={loading}>
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Salvar Contato
                    </Button>
                </div>
            </DialogFooter>
        </form>
    );
};

export default NewContactForm;

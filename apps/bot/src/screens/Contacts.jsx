
import React, { useState, useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, UserPlus, FileDown, Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NewPatientForm from '@/components/NewPatientForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';

const Contacts = () => {
  const { contacts, loading } = useData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewPatientDialogOpen, setIsNewPatientDialogOpen] = useState(false);

  const filteredContacts = useMemo(() => {
    if (!contacts) return [];
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.patient_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [contacts, searchTerm]);

  const handleExport = () => {
    // This is a placeholder for CSV export functionality
    const headers = ['id', 'patient_id', 'name', 'last_activity', 'created_at'];
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(',') + '\n'
      + filteredContacts.map(c => headers.map(h => c[h]).join(',')).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "contacts.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="glass-effect">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-2xl font-bold">Leads e Contatos</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExport}>
                <FileDown className="mr-2 h-4 w-4" />
                Exportar
              </Button>
              <Dialog open={isNewPatientDialogOpen} onOpenChange={setIsNewPatientDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Novo Lead
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Lead</DialogTitle>
                    <DialogDescription>
                      Preencha os detalhes abaixo para criar um novo lead. Os campos com * são obrigatórios.
                    </DialogDescription>
                  </DialogHeader>
                  <NewPatientForm 
                    onFinished={() => setIsNewPatientDialogOpen(false)}
                    onCancel={() => setIsNewPatientDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nome ou ID..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10">
              <p>Carregando contatos...</p>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Inbox className="h-12 w-12 mx-auto mb-4" />
              <p className="font-semibold">Nenhum contato encontrado</p>
              <p className="text-sm">Tente ajustar sua busca ou adicione um novo lead.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center p-4 rounded-lg hover:bg-secondary/70 transition-colors cursor-pointer"
                  onClick={() => navigate(`/conversation/${contact.patient_id}`)}
                >
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarFallback>{contact.name ? contact.name.charAt(0) : '?'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">ID: {contact.patient_id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Última Atividade</p>
                    <p className="text-xs text-muted-foreground">
                      {contact.last_activity ? new Date(contact.last_activity).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Contacts;

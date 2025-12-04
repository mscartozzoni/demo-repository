
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation } from 'react-router-dom';
import { Contact, Plus, Search, Filter, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useApi } from '@/contexts/ApiContext';
import { useNotifications } from '@/contexts/NotificationContext';
import NewContactForm from '@/components/contacts/NewContactForm';
import ContactCard from '@/components/contacts/ContactCard';
import NewPatientForm from '@/components/patients/NewPatientForm';

const Contacts = () => {
  const { getContacts } = useApi();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNewContactFormOpen, setIsNewContactFormOpen] = useState(false);
  const [isConvertToPatientFormOpen, setIsConvertToPatientFormOpen] = useState(false);
  const [contactToConvert, setContactToConvert] = useState(null);
  const [highlightedContactId, setHighlightedContactId] = useState(null);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getContacts(searchTerm);
      setContacts(data || []);
      
      if (location.state?.newContactId) {
        setHighlightedContactId(location.state.newContactId);
        navigate(location.pathname, { replace: true, state: {} });
        setTimeout(() => setHighlightedContactId(null), 3000);
      }
    } finally {
      setLoading(false);
    }
  }, [searchTerm, getContacts, location.state, navigate]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchContacts();
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [fetchContacts]);

  const handleSaveContact = (newContact) => {
    setIsNewContactFormOpen(false);
    fetchContacts();
    addNotification({
        title: "Novo Lead Recebido!",
        description: `O contato ${newContact.full_name} foi adicionado.`,
        icon: <Contact className="w-4 h-4 text-blue-400" />
    });
    navigate(location.pathname, { replace: true, state: { newContactId: newContact.id } });
  };

  const handleSavePatient = (newPatient) => {
    setIsConvertToPatientFormOpen(false);
    setContactToConvert(null);
    fetchContacts();
    navigate('/admin/secretaria/pacientes', { state: { newPatientId: newPatient.id } });
  };

  const handleConvert = (contact) => {
    setContactToConvert(contact);
    setIsConvertToPatientFormOpen(true);
  };

  const filteredContacts = contacts.filter(contact => {
    if (selectedFilter === 'all') return contact.status !== 'converted';
    return contact.status === selectedFilter;
  });

  return (
    <>
      <Helmet>
        <title>Leads | Contatos - Portal Secretaria</title>
        <meta name="description" content="Gerenciamento centralizado de leads e contatos." />
      </Helmet>

      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Leads | Contatos</h1>
            <p className="text-gray-400">Gerencie todos os leads e contatos recebidos.</p>
          </div>

          <Dialog open={isNewContactFormOpen} onOpenChange={setIsNewContactFormOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary mt-4 md:mt-0">
                <Plus className="w-4 h-4 mr-2" />
                Novo Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <NewContactForm onSave={handleSaveContact} onClose={() => setIsNewContactFormOpen(false)} />
            </DialogContent>
          </Dialog>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Buscar por nome, email ou telefone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      aria-label="Buscar contatos"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      className="input-field"
                    >
                      <option value="all">Todos Ativos</option>
                      <option value="new">Novos</option>
                      <option value="contacted">Contactados</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-blue-400" />
          </div>
        ) : (
          <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(350px,1fr))]">
            <AnimatePresence>
              {filteredContacts.map(contact => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  onConvert={() => handleConvert(contact)}
                  isHighlighted={contact.id === highlightedContactId}
                />
              ))}
            </AnimatePresence>

            {!loading && filteredContacts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12 [grid-column:1/-1]"
              >
                <Contact className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nenhum lead encontrado</h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm ? 'Tente ajustar os filtros de busca' : 'Nenhum lead ativo recebido ainda.'}
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>
      
      <Dialog open={isConvertToPatientFormOpen} onOpenChange={setIsConvertToPatientFormOpen}>
        <DialogContent className="max-w-4xl">
          <NewPatientForm 
            onSave={handleSavePatient} 
            onClose={() => setIsConvertToPatientFormOpen(false)}
            contactToConvert={contactToConvert}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Contacts;

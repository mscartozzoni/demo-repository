
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

import {
  Users,
  Plus,
  Search,
  Filter,
  Loader2,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import { useApi } from '@/contexts/ApiContext';
import NewLeadForm from '@/components/leads/NewLeadForm';
import LeadCard from '@/components/leads/LeadCard';
import NewPatientForm from '@/components/patients/NewPatientForm';

const Leads = () => {
  const { getLeads, convertLeadToPatient } = useApi();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNewLeadFormOpen, setIsNewLeadFormOpen] = useState(false);
  const [isConvertToPatientFormOpen, setIsConvertToPatientFormOpen] = useState(false);
  const [leadToConvert, setLeadToConvert] = useState(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getLeads(searchTerm);
      setLeads(data || []);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, getLeads]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchLeads();
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [fetchLeads]);

  const handleSaveLead = () => {
    setIsNewLeadFormOpen(false);
    fetchLeads();
  };

  const handleSavePatient = (newPatient) => {
    setIsConvertToPatientFormOpen(false);
    setLeadToConvert(null);
    fetchLeads(); // Refreshes the leads list (the converted one will be gone)
    // Navigate to the new patient's detail page
    navigate(`/admin/secretaria/pacientes/${newPatient.id}`);
  };

  const handleConvert = async (lead) => {
    try {
      // In mock, this just prepares the form. In real API, it might do more.
      setLeadToConvert(lead);
      setIsConvertToPatientFormOpen(true);
    } catch (error) {
      // Erro tratado no ApiContext
    }
  };

  const filteredLeads = leads.filter(lead => {
    const term = searchTerm.toLowerCase();
    const nameMatch = (lead.name || lead.full_name || '').toLowerCase().includes(term);
    const emailMatch = (lead.email || '').toLowerCase().includes(term);
    const phoneMatch = (lead.phone || '').replace(/\D/g, '').includes(term.replace(/\D/g, ''));
    
    const statusMatch = selectedFilter === 'all' ? lead.status !== 'converted' : lead.status === selectedFilter;

    return (nameMatch || emailMatch || phoneMatch) && statusMatch;
  });

  return (
    <>
      <Helmet>
        <title>Leads - Portal Secretaria</title>
        <meta name="description" content="Gerenciamento de leads e contatos." />
      </Helmet>

      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Contatos</h1>
            <p className="text-gray-400">Gerencie todos os leads e contatos recebidos.</p>
          </div>

          <Dialog open={isNewLeadFormOpen} onOpenChange={setIsNewLeadFormOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary mt-4 md:mt-0">
                <Plus className="w-4 h-4 mr-2" />
                Novo Contato
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg bg-slate-900 border-slate-800">
              <NewLeadForm onSave={handleSaveLead} onClose={() => setIsNewLeadFormOpen(false)} />
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
                      aria-label="Buscar leads"
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
              {filteredLeads.map(lead => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onConvert={() => handleConvert(lead)}
                />
              ))}
            </AnimatePresence>

            {!loading && filteredLeads.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12 [grid-column:1/-1]"
              >
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nenhum contato encontrado</h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm ? 'Tente ajustar os filtros de busca' : 'Nenhum contato ativo recebido ainda.'}
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>
      
      <Dialog open={isConvertToPatientFormOpen} onOpenChange={setIsConvertToPatientFormOpen}>
        <DialogContent className="max-w-4xl bg-slate-900 border-slate-800">
          <NewPatientForm 
            onSave={handleSavePatient} 
            onClose={() => setIsConvertToPatientFormOpen(false)}
            contactToConvert={leadToConvert}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Leads;

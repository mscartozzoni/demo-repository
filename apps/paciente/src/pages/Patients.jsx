import React, { useState, useEffect, useCallback } from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Helmet } from 'react-helmet-async';
    import { useLocation, useNavigate, Link } from 'react-router-dom';
    import { 
      Users, 
      ArrowRight, 
      Search, 
      Filter, 
      Loader2
    } from 'lucide-react';
    import { Card, CardContent } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { useToast } from '@/components/ui/use-toast';
    import { useApi } from '@/contexts/ApiContext';
    import PatientCard from '@/components/patients/PatientCard';

    const Patients = () => {
      const { toast } = useToast();
      const { getPatients, searchPatients } = useApi();
      const location = useLocation();
      const navigate = useNavigate();
      
      const [searchTerm, setSearchTerm] = useState('');
      const [filter, setFilter] = useState('active_journey');
      const [patients, setPatients] = useState([]);
      const [loading, setLoading] = useState(true);
      const [highlightedPatientId, setHighlightedPatientId] = useState(null);

      const fetchPatientsData = useCallback(async () => {
        setLoading(true);
        try {
          const data = searchTerm ? await searchPatients(searchTerm) : await getPatients();
          setPatients(data || []);
          
          if (location.state?.newPatientId) {
            setHighlightedPatientId(location.state.newPatientId);
            const currentPath = location.pathname;
            navigate(currentPath, { replace: true, state: {} });
            setTimeout(() => setHighlightedPatientId(null), 3000);
          }
        } catch (error) {
           // handled in ApiContext
        } finally {
          setLoading(false);
        }
      }, [searchTerm, getPatients, searchPatients, location.state, navigate, location.pathname]);

      useEffect(() => {
        const debounceTimer = setTimeout(() => {
          fetchPatientsData();
        }, 300);
        return () => clearTimeout(debounceTimer);
      }, [fetchPatientsData]);

      const handleFeatureClick = (feature) => {
        toast({
          title: `👥 ${feature}`,
          description: "🚧 Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀"
        });
      };

      const filteredPatients = (patients || []).filter(patient => {
        if (filter === 'all') return true;
        if (filter === 'active_journey') return patient.journeyStatus === 'active' || patient.journeyStatus === 'pending_budget';
        if (filter === 'inactive') return patient.journeyStatus === 'inactive' && patient.status === 'inactive';
        return true;
      });

      return (
        <>
          <Helmet>
            <title>Pacientes - Portal Unificado</title>
            <meta name="description" content="Gestão completa de pacientes - Cadastro, edição, visualização e controle de informações dos pacientes" />
          </Helmet>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h1 className="text-3xl font-bold gradient-text mb-2">Pacientes</h1>
                <p className="text-gray-400">Gerencie todos os pacientes cadastrados</p>
              </div>
              
              <Button asChild className="btn-primary mt-4 md:mt-0">
                  <Link to="/admin/secretaria/leads">
                    Gerenciar Leads e Pacientes
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
              </Button>

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
                          placeholder="Buscar por nome..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select
                          value={filter}
                          onChange={(e) => setFilter(e.target.value)}
                          className="input-field"
                        >
                          <option value="active_journey">Jornada Ativa</option>
                          <option value="all">Todos os Pacientes</option>
                          <option value="inactive">Inativos</option>
                        </select>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        onClick={() => handleFeatureClick('Exportar')}
                      >
                        Exportar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {loading ? (
              <div className="flex justify-center items-center h-64"><Loader2 className="w-12 h-12 animate-spin text-blue-400" /></div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredPatients.map((patient) => (
                    <PatientCard 
                      key={patient.id} 
                      patient={patient}
                      isHighlighted={patient.id === highlightedPatientId}
                      onActionClick={handleFeatureClick}
                    />
                  ))}
                </AnimatePresence>
                {!loading && filteredPatients.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-12 lg:col-span-3"
                  >
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Nenhum paciente encontrado</h3>
                    <p className="text-gray-400 mb-6">{searchTerm ? 'Tente ajustar os filtros de busca' : 'Nenhum paciente com jornada ativa. Altere o filtro para ver todos.'}</p>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </>
      );
    };

    export default Patients;
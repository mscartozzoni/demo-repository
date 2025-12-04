
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  MixerHorizontalIcon, 
  ExclamationTriangleIcon,
  ChevronRightIcon
} from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { getPatients } from '@/services/api/patients';
import AddPatientModal from '@/components/patients/AddPatientModal';
import { useSchema } from '@/contexts/SchemaContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const LoadingSkeleton = () => (
  <div className="glass-effect rounded-xl p-4 flex items-center gap-4 animate-pulse">
    <div className="h-12 w-12 rounded-full bg-slate-700"></div>
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-slate-700 rounded w-3/4"></div>
      <div className="h-3 bg-slate-700 rounded w-1/2"></div>
    </div>
    <div className="h-6 w-6 bg-slate-700 rounded-full"></div>
  </div>
);

const Patients = () => {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [roleFilter, setRoleFilter] = useState('all');

  const fetchPatientsData = useCallback(async (search, role) => {
    if (!user) {
        setLoading(false);
        return;
    };
    try {
      setLoading(true);
      setError(null);
      const response = await getPatients(search, role);
      const patientsData = response?.data || [];
      setPatients(Array.isArray(patientsData) ? patientsData : []);
    } catch (err) {
      setError(err.message);
      setPatients([]);
      toast({
        variant: "destructive",
        title: "Erro ao carregar registros",
        description: err.message || "Não foi possível buscar os contatos e pacientes.",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (location.state?.openAddPatientModal) {
      setIsAddPatientModalOpen(true);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    if (!authLoading) {
      fetchPatientsData(debouncedSearchTerm, roleFilter);
    }
  }, [authLoading, debouncedSearchTerm, roleFilter, fetchPatientsData]);

  const getInitials = (name) => {
    if (!name) return 'P';
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const isLoading = authLoading || loading;

  return (
    <>
      <AddPatientModal
        isOpen={isAddPatientModalOpen}
        onClose={() => setIsAddPatientModalOpen(false)}
        onPatientAdded={() => fetchPatientsData(debouncedSearchTerm, roleFilter)}
      />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Prontuários</h1>
            <p className="text-slate-400 mt-2">Acesse e gerencie os prontuários de seus pacientes e contatos.</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setIsAddPatientModalOpen(true)} variant="default">
              <PlusIcon className="w-4 h-4 mr-2" />
              Adicionar Contato
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-effect rounded-xl p-4"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Buscar por nome, telefone ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="border-slate-600 hover:border-blue-500">
              <MixerHorizontalIcon className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
          <AnimatePresence>
            {showFilters && (
                <motion.div
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginTop: '1rem' }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-slate-300">Status:</label>
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-[180px] bg-slate-800/50 border-slate-700">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="contato">Contato</SelectItem>
                                <SelectItem value="paciente">Paciente</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading && Array.from({ length: 6 }).map((_, i) => <LoadingSkeleton key={i} />)}
          {error && <p className="text-yellow-400 col-span-full text-center flex items-center justify-center gap-2"><ExclamationTriangleIcon className="w-4 h-4"/> {error}</p>}
          {!isLoading && !error && patients.map((patient, index) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Link to={`/medico/prontuarios/${patient.id}`} className="w-full">
                <div className="glass-effect rounded-xl p-4 flex items-center gap-4 hover:bg-slate-700/40 transition-all duration-300 group">
                    <Avatar className="h-12 w-12 border-2 border-slate-600">
                        <AvatarImage src={patient.avatar_url} />
                        <AvatarFallback className="bg-slate-700 text-slate-300">{getInitials(patient.full_name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <h3 className="text-md font-semibold text-white truncate">{patient.full_name}</h3>
                        <p className="text-sm text-slate-400">{patient.email}</p>
                    </div>
                    <ChevronRightIcon className="w-6 h-6 text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {!isLoading && !error && patients.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 col-span-full"
          >
            <div className="glass-effect rounded-xl p-8 max-w-md mx-auto">
              <MagnifyingGlassIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Nenhum prontuário encontrado</h3>
              <p className="text-slate-400 mb-4">
                {searchTerm ? 'Tente ajustar os termos de busca' : 'Comece adicionando um novo contato'}
              </p>
              <Button onClick={() => setIsAddPatientModalOpen(true)} variant="default">
                <PlusIcon className="w-4 h-4 mr-2" />
                Adicionar Contato
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default Patients;

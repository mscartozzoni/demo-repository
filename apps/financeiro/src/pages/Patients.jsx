import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Search, User, Mail, Phone, Loader2, FileText, MessageSquare, Users, Edit, Save, X } from 'lucide-react';
import NewBudgetModal from '@/components/modals/NewBudgetModal';
import { usePatients } from '@/hooks/usePatients';
import NewPatientDialog from '@/components/modals/NewPatientDialog';

const getInitials = (name) => {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
};

const PatientCard = ({ patient, index, onNewBudget, onNavigateToMessages, onActionClick, onPatientUpdated }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ full_name: patient.full_name, email: patient.email, phone: patient.phone });
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    const handleEditToggle = () => {
        if (isEditing) {
            setEditData({ full_name: patient.full_name, email: patient.email, phone: patient.phone });
        }
        setIsEditing(!isEditing);
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({...prev, [name]: value}));
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Mock save
        setTimeout(() => {
            toast({ title: 'Sucesso!', description: 'Paciente atualizado (simulação).' });
            setIsEditing(false);
            onPatientUpdated(); // This will refetch the mock data
            setIsSaving(false);
        }, 500);
    };


    return (
         <motion.div
            key={patient.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6 h-full flex flex-col justify-between hover:bg-white/15 transition-all duration-300">
                <div>
                    <div className="flex items-start space-x-4">
                        <Avatar className="h-12 w-12 flex-shrink-0">
                            <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white font-bold">
                                {getInitials(patient.full_name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-grow">
                            {isEditing ? (
                                <Input name="full_name" value={editData.full_name} onChange={handleInputChange} className="bg-white/20 border-white/30 text-xl font-semibold mb-1" />
                            ) : (
                                <h3 className="text-xl font-semibold text-white">{patient.full_name}</h3>
                            )}

                            {isEditing ? (
                                <>
                                    <Input name="email" value={editData.email} onChange={handleInputChange} className="bg-white/20 border-white/30 text-sm mt-1" placeholder="E-mail" />
                                    <Input name="phone" value={editData.phone} onChange={handleInputChange} className="bg-white/20 border-white/30 text-sm mt-1" placeholder="Telefone" />
                                </>
                            ) : (
                                <>
                                    <p className="text-purple-300 text-sm">{patient.email || 'Sem e-mail'}</p>
                                    <p className="text-purple-300 text-sm">{patient.phone || 'Sem telefone'}</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-white/10 justify-end">
                    {isEditing ? (
                        <>
                            <Button size="icon" variant="ghost" onClick={handleEditToggle} className="text-red-400 hover:bg-red-400/10">
                                <X className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={handleSave} disabled={isSaving} className="text-green-400 hover:bg-green-400/10">
                                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button size="icon" variant="ghost" onClick={handleEditToggle} className="text-purple-300 hover:bg-purple-400/10">
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-cyan-300 border-cyan-400 hover:bg-cyan-400/10" onClick={() => onNewBudget(patient)}>
                                <FileText className="h-4 w-4 mr-1" /> Orçamento
                            </Button>
                            <Button size="sm" variant="outline" className="text-green-300 border-green-400 hover:bg-green-400/10" onClick={() => onNavigateToMessages(patient.id)}>
                                <MessageSquare className="h-4 w-4 mr-1" /> Mensagens
                            </Button>
                            <Button size="sm" variant="outline" className="text-amber-300 border-amber-400 hover:bg-amber-400/10" onClick={() => onActionClick("A Jornada do Paciente será implementada em breve.")}>
                                <Users className="h-4 w-4 mr-1" /> Jornada
                            </Button>
                        </>
                    )}
                </div>
            </Card>
        </motion.div>
    )
}

const Patients = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { patients, loading, error, searchPatients, addPatient } = usePatients('');
    const [showFormModal, setShowFormModal] = useState(false);
    const [showNewBudgetModal, setShowNewBudgetModal] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const { toast } = useToast();
    const navigate = useNavigate();
    
    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        searchPatients(term);
    }

    const handleNewBudget = (patient) => {
        setSelectedPatient(patient);
        setShowNewBudgetModal(true);
    };

    const handleBudgetCreated = () => {
        setShowNewBudgetModal(false);
        setSelectedPatient(null);
        navigate('/budgets');
    };

    const handleActionClick = (message) => {
        toast({
            title: "🚧 Funcionalidade em construção!",
            description: message,
        });
    };
    
    const handlePatientCreated = (newPatientData) => {
        const newPatient = addPatient(newPatientData);
        toast({ title: "Sucesso!", description: `Paciente ${newPatient.full_name} criado.` });
        setShowFormModal(false);
        handleNewBudget(newPatient);
    };

    return (
        <>
            <motion.div
                key="patients"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
            >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-white">Central de Pacientes</h2>
                        <p className="text-purple-200 mt-2">Gerencie todos os seus pacientes em um único lugar.</p>
                    </div>
                    <Button onClick={() => setShowFormModal(true)} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Paciente
                    </Button>
                </div>

                <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                    <div className="max-w-md">
                        <Label className="text-purple-200">Buscar por Nome, CPF ou E-mail</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-purple-300" />
                            <Input
                                className="pl-10 bg-white/10 border-white/20 text-white"
                                placeholder="Digite para buscar..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                </Card>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {loading && <div className="col-span-full flex justify-center items-center h-64"><Loader2 className="h-8 w-8 text-purple-300 animate-spin" /></div>}
                    {error && <p className="text-red-400 text-center col-span-full">Erro ao carregar pacientes.</p>}
                    {!loading && patients.map((patient, index) => (
                        <PatientCard 
                            key={patient.id}
                            patient={patient}
                            index={index}
                            onNewBudget={handleNewBudget}
                            onNavigateToMessages={(patientId) => navigate('/messages', { state: { patientId } })}
                            onActionClick={handleActionClick}
                            onPatientUpdated={searchPatients}
                        />
                    ))}
                </div>
                 {!loading && patients.length === 0 && (
                    <div className="text-center py-10 col-span-full">
                        <p className="text-purple-300">Nenhum paciente encontrado. Adicione um novo paciente para começar.</p>
                    </div>
                )}
            </motion.div>

            <NewPatientDialog
                isOpen={showFormModal}
                onClose={() => setShowFormModal(false)}
                onPatientCreated={handlePatientCreated}
            />
            {selectedPatient && (
                <NewBudgetModal
                    isOpen={showNewBudgetModal}
                    onClose={() => {
                        setShowNewBudgetModal(false);
                        setSelectedPatient(null);
                    }}
                    onBudgetCreated={handleBudgetCreated}
                    patient={selectedPatient}
                />
            )}
        </>
    );
};

export default Patients;
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import cep from 'cep-promise';
import { useForm } from '@/hooks/useForm';
import { useApi } from '@/contexts/ApiContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, User, Phone, Mail, ShieldAlert, AlertCircle, CheckCircle, MapPin, X } from 'lucide-react';
import { formatPhoneNumber } from '@/lib/phone-mask';
import { validateCPF } from '@/lib/cpf-validator';
import { cn } from '@/lib/utils';

const PatientProfile = () => {
    const { user } = useAuth();
    const { updatePatientProfile, getPatientById, loading: apiLoading } = useApi();
    
    const [initialData, setInitialData] = useState({
        full_name: '',
        email: '',
        phone: '',
        birthdate: '',
        cpf: '',
        cep: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
    });

    const [isCpfValid, setIsCpfValid] = useState(true);
    const [cpfTouched, setCpfTouched] = useState(false);
    const [cepLoading, setCepLoading] = useState(false);
    const [cepError, setCepError] = useState('');
    const [addressFetched, setAddressFetched] = useState(false);

    const { formData, handleChange, setFormData, setFieldValue } = useForm(initialData);

    useEffect(() => {
        const loadPatientData = async () => {
            if (user) {
                const patientData = await getPatientById(user.id);
                const fullData = { ...user.user_metadata, ...patientData };
                const initialCpf = fullData.cpf || '';
                
                const data = {
                    full_name: fullData.full_name || '',
                    email: user.email || '',
                    phone: fullData.phone ? formatPhoneNumber(fullData.phone) : '',
                    birthdate: fullData.birthdate || '',
                    cpf: initialCpf,
                    cep: fullData.cep || '',
                    street: fullData.street || '',
                    number: fullData.number || '',
                    complement: fullData.complement || '',
                    neighborhood: fullData.neighborhood || '',
                    city: fullData.city || '',
                    state: fullData.state || '',
                    emergency_contact_name: fullData.emergency_contact_name || '',
                    emergency_contact_phone: fullData.emergency_contact_phone ? formatPhoneNumber(fullData.emergency_contact_phone) : '',
                };
                setInitialData(data);
                setFormData(data);

                if (initialCpf) setIsCpfValid(validateCPF(initialCpf));
                if (data.street) setAddressFetched(true);
            }
        };
        loadPatientData();
    }, [user, getPatientById, setFormData]);

    const handlePhoneChange = (e) => {
        const { name, value } = e.target;
        const formattedValue = formatPhoneNumber(value);
        setFieldValue(name, formattedValue);
    };

    const handleCpfChange = (value) => {
        setFieldValue('cpf', value);
        setCpfTouched(true);
        const unmaskedValue = value.replace(/[^\d]/g, '');
        if (unmaskedValue.length === 11) {
            setIsCpfValid(validateCPF(unmaskedValue));
        } else {
            setIsCpfValid(true);
        }
    };

    const handleCepChange = useCallback(async (value) => {
        setFieldValue('cep', value);
        const unmaskedCep = value.replace(/[^\d]/g, '');
        
        if (unmaskedCep.length < 8) {
            setCepError('');
            setAddressFetched(false);
            return;
        }

        setCepLoading(true);
        setCepError('');
        try {
            const address = await cep(unmaskedCep);
            setFieldValue('street', address.street);
            setFieldValue('neighborhood', address.neighborhood);
            setFieldValue('city', address.city);
            setFieldValue('state', address.state);
            setAddressFetched(true);
            document.getElementById('number')?.focus();
        } catch (error) {
            setCepError('CEP inválido ou não encontrado.');
            setAddressFetched(false);
            ['street', 'neighborhood', 'city', 'state'].forEach(field => setFieldValue(field, ''));
        } finally {
            setCepLoading(false);
        }
    }, [setFieldValue]);

    const handleClearAddress = () => {
        const fieldsToClear = ['cep', 'street', 'number', 'complement', 'neighborhood', 'city', 'state'];
        fieldsToClear.forEach(field => setFieldValue(field, ''));
        setAddressFetched(false);
        setCepError('');
        setCepLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const unmaskedCpf = formData.cpf.replace(/[^\d]/g, '');
        if (unmaskedCpf && !validateCPF(unmaskedCpf)) {
            setIsCpfValid(false);
            setCpfTouched(true);
            return;
        }

        try {
            const submissionData = {
                ...formData,
                phone: formData.phone.replace(/[^\d+]/g, ''),
                emergency_contact_phone: formData.emergency_contact_phone.replace(/[^\d+]/g, ''),
                cpf: unmaskedCpf,
                cep: formData.cep.replace(/[^\d]/g, ''),
            };
            await updatePatientProfile(submissionData);
        } catch(error) {
            // error is handled by ApiContext
        }
    };

    const isSaveDisabled = apiLoading || (cpfTouched && !isCpfValid && formData.cpf.replace(/[^\d]/g, '').length === 11) || !formData.number;

    return (
        <>
            <Helmet><title>Meus Dados</title></Helmet>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h1 className="text-3xl font-bold gradient-text">Meus Dados Pessoais</h1>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="floating-card">
                            <CardHeader><CardTitle className="flex items-center gap-2"><User />Informações de Contato</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div><Label htmlFor="full_name">Nome Completo</Label><Input id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} /></div>
                                <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" value={formData.email} disabled /></div>
                                <div><Label htmlFor="phone">Telefone</Label><Input id="phone" name="phone" value={formData.phone} onChange={handlePhoneChange} placeholder="+55 (11) 99999-9999" /></div>
                                <div><Label htmlFor="birthdate">Data de Nascimento</Label><Input id="birthdate" name="birthdate" type="date" value={formData.birthdate} onChange={handleChange} /></div>
                            </CardContent>
                        </Card>

                        <Card className="floating-card">
                            <CardHeader><CardTitle className="flex items-center gap-2"><ShieldAlert className="text-red-400" />Contato de Emergência</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div><Label htmlFor="emergency_contact_name">Nome do Contato</Label><Input id="emergency_contact_name" name="emergency_contact_name" value={formData.emergency_contact_name} onChange={handleChange} /></div>
                                <div><Label htmlFor="emergency_contact_phone">Telefone do Contato</Label><Input id="emergency_contact_phone" name="emergency_contact_phone" value={formData.emergency_contact_phone} onChange={handlePhoneChange} placeholder="+55 (11) 99999-9999" /></div>
                            </CardContent>
                        </Card>
                        
                        <Card className="floating-card md:col-span-2">
                             <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle className="flex items-center gap-2"><MapPin />Endereço</CardTitle>
                                    {formData.cep && (
                                        <Button variant="ghost" size="sm" onClick={handleClearAddress} className="text-xs text-slate-400 hover:text-white">
                                            <X className="w-4 h-4 mr-1" />
                                            Limpar
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-6 gap-4">
                                <div className="relative md:col-span-2">
                                    <Label htmlFor="cep">CEP</Label>
                                    <Input id="cep" name="cep" value={formData.cep} onAccept={handleCepChange} mask="00000-000" placeholder="00000-000" />
                                    {cepLoading && <Loader2 className="absolute right-3 top-9 w-5 h-5 animate-spin text-blue-400" />}
                                    {cepError && <p className="text-xs text-red-500 mt-1">{cepError}</p>}
                                </div>
                                <div className="md:col-span-4"><Label htmlFor="street">Rua</Label><Input id="street" name="street" value={formData.street} onChange={handleChange} disabled={addressFetched} /></div>
                                <div className="md:col-span-2">
                                    <Label htmlFor="number">Número <span className="text-red-500">*</span></Label>
                                    <Input id="number" name="number" value={formData.number} onChange={handleChange} required />
                                </div>
                                <div className="md:col-span-4"><Label htmlFor="complement">Complemento</Label><Input id="complement" name="complement" value={formData.complement} onChange={handleChange} /></div>
                                <div className="md:col-span-2"><Label htmlFor="neighborhood">Bairro</Label><Input id="neighborhood" name="neighborhood" value={formData.neighborhood} onChange={handleChange} disabled={addressFetched} /></div>
                                <div className="md:col-span-2"><Label htmlFor="city">Cidade</Label><Input id="city" name="city" value={formData.city} onChange={handleChange} disabled={addressFetched} /></div>
                                <div className="md:col-span-2"><Label htmlFor="state">Estado</Label><Input id="state" name="state" value={formData.state} onChange={handleChange} disabled={addressFetched} /></div>
                            </CardContent>
                        </Card>

                        <Card className="floating-card md:col-span-2">
                             <CardHeader><CardTitle className="flex items-center gap-2">Outras Informações</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <Label htmlFor="cpf">CPF</Label>
                                    <Input id="cpf" name="cpf" value={formData.cpf} onAccept={handleCpfChange} onBlur={() => setCpfTouched(true)} mask="000.000.000-00" placeholder="000.000.000-00" className={cn({ 'border-red-500 focus:border-red-500': cpfTouched && !isCpfValid, 'border-green-500 focus:border-green-500': cpfTouched && isCpfValid && formData.cpf.replace(/[^\d]/g, '').length === 11, })} />
                                    {cpfTouched && formData.cpf && (
                                        <div className="absolute right-3 top-9">
                                            {isCpfValid ? (formData.cpf.replace(/[^\d]/g, '').length === 11 && <CheckCircle className="w-5 h-5 text-green-500" />) : (<AlertCircle className="w-5 h-5 text-red-500" />)}
                                        </div>
                                    )}
                                    {cpfTouched && !isCpfValid && <p className="text-xs text-red-500 mt-1">CPF inválido.</p>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <Button type="submit" disabled={isSaveDisabled}>
                            {apiLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Salvar Alterações
                        </Button>
                    </div>
                </form>
            </motion.div>
        </>
    );
};

export default PatientProfile;
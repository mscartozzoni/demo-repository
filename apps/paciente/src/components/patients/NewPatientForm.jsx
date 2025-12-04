
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, ArrowRight, Calendar, Clock, Copy, AlertCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApi } from '@/contexts/ApiContext';
import { useToast } from '@/components/ui/use-toast';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const FormSection = ({ title, children, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={`space-y-4 rounded-lg border border-slate-700 p-4 ${className}`}
  >
    <h3 className="text-md font-semibold text-blue-300">{title}</h3>
    {children}
  </motion.div>
);

const FieldWrapper = ({ children, className }) => (
  <div className={className}>{children}</div>
);

const ValidatedInput = ({ id, value, onChange, onBlur, isValid, error, ...props }) => (
    <div className="relative">
        <Input 
            id={id} 
            name={id} 
            value={value} 
            onChange={onChange} 
            onBlur={onBlur}
            className={error ? 'border-red-500 focus:border-red-500' : ''}
            {...props} 
        />
        <AnimatePresence>
            {isValid && !error && (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                    <CheckCircle className="text-green-500" size={16} />
                </motion.div>
            )}
             {error && (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                    <AlertCircle className="text-red-500" size={16} />
                </motion.div>
            )}
        </AnimatePresence>
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
);


const NewPatientForm = ({ onSave, onClose, contactToConvert }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    contact_id: null,
    full_name: '',
    birth_date: '',
    cpf: '',
    phone: '',
    email: '',
    cep: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    appointment_date: '',
    appointment_time: '',
  });

  const [validation, setValidation] = useState({});
  const [errors, setErrors] = useState({});
  const [cepLoading, setCepLoading] = useState(false);
  const { createPatient, loading, checkPhoneExists, searchPatientsAndContacts } = useApi();
  const { toast } = useToast();
  const availabilityLink = 'https://portal-clinic.netlify.app/book/dr-marcio';

  const [phoneSuggestions, setPhoneSuggestions] = useState([]);
  const [isTypingPhone, setIsTypingPhone] = useState(false);

  useEffect(() => {
    if (contactToConvert) {
      setFormData(prev => ({
        ...prev,
        contact_id: contactToConvert.id,
        full_name: contactToConvert.full_name || contactToConvert.name || '',
        phone: contactToConvert.phone || '',
        email: contactToConvert.email || '',
      }));
    }
  }, [contactToConvert]);

  const lookupCep = useCallback(async (cep) => {
    setCepLoading(true);
    setValidation(prev => ({ ...prev, cep: false }));
    toast({ title: 'Buscando endereço pelo CEP...' });
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.ok) throw new Error('CEP não encontrado');
      const addressData = await response.json();
      if (addressData.erro) throw new Error('CEP inválido ou não encontrado.');

      setFormData(prev => ({
        ...prev,
        address: addressData.logradouro,
        neighborhood: addressData.bairro,
        city: addressData.localidade,
        state: addressData.uf,
      }));
      setValidation(prev => ({ ...prev, cep: true }));
      toast({ title: 'Endereço encontrado!', description: 'Por favor, confirme os dados e preencha o número.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro ao buscar CEP', description: error.message || 'Verifique o CEP e tente novamente.' });
      setValidation(prev => ({ ...prev, cep: false }));
    } finally {
      setCepLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const cep = formData.cep.replace(/\D/g, '');
    if (cep.length === 8) {
      lookupCep(cep);
    }
  }, [formData.cep, lookupCep]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if(errors[name]) {
        setErrors(prev => ({...prev, [name]: null}));
    }

    if (name === 'phone') {
      setIsTypingPhone(true);
    }
  };
  
  useEffect(() => {
    if (isTypingPhone && formData.phone.replace(/\D/g, '').length > 5) {
        const handler = setTimeout(async () => {
            const results = await searchPatientsAndContacts(formData.phone);
            const filteredResults = results.filter(p => p.id !== (contactToConvert?.id || formData.contact_id));
            setPhoneSuggestions(filteredResults);
        }, 300);
        return () => clearTimeout(handler);
    } else {
        setPhoneSuggestions([]);
    }
}, [formData.phone, isTypingPhone, searchPatientsAndContacts, contactToConvert, formData.contact_id]);

  const handleValidation = (field, isValid) => {
      setValidation(prev => ({ ...prev, [field]: isValid }));
      if(isValid) {
          toast({ title: `Campo "${field}" validado com sucesso!`, className: 'bg-green-600/20 border-green-500' });
      }
  };
  
  const handlePhoneBlur = useCallback(async (e) => {
      setIsTypingPhone(false);
      const phone = e.target.value;
      if (phone && phone.replace(/\D/g, '').length >= 8) { // Basic validation
          setErrors(prev => ({ ...prev, phone: null }));
          const excludeId = contactToConvert ? contactToConvert.id : formData.contact_id;
          const exists = await checkPhoneExists(phone, excludeId);
          if (exists) {
              const errorMessage = `Este telefone já pertence a ${exists.type === 'patient' ? 'um paciente' : 'um contato'}: ${exists.name}.`;
              setErrors(prev => ({ ...prev, phone: errorMessage }));
              toast({ variant: 'destructive', title: 'Telefone duplicado', description: errorMessage });
          } else {
              handleValidation('Telefone', true);
          }
      }
  }, [checkPhoneExists, toast, contactToConvert, formData.contact_id]);

  const handleSelectSuggestion = (person) => {
    setFormData(prev => ({
        ...prev,
        contact_id: person.id,
        full_name: person.full_name || person.name,
        phone: person.phone,
        email: person.email || '',
        cpf: person.cpf || '',
        birth_date: person.birth_date || '',
    }));
    setPhoneSuggestions([]);
    setIsTypingPhone(false);
    toast({ title: `Dados de "${person.full_name || person.name}" carregados.`})
  };

  const handleClearAddress = () => {
    setFormData(prev => ({
      ...prev,
      cep: '',
      address: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
    }));
    setValidation(prev => ({ ...prev, cep: false }));
    toast({ title: 'Campos de endereço limpos.' });
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
    if (Object.values(errors).some(Boolean)) {
        toast({ variant: 'destructive', title: 'Formulário inválido', description: 'Por favor, corrija os erros antes de salvar.' });
        return;
    }
    
    if (!formData.number && formData.address) {
        toast({ variant: 'destructive', title: 'Campo obrigatório', description: 'O campo "Número" do endereço é obrigatório.' });
        setErrors(prev => ({...prev, number: "Campo obrigatório"}));
        return;
    }
    
    const patientData = { ...formData };
    delete patientData.appointment_date;
    delete patientData.appointment_time;

    const newPatient = await createPatient(patientData);
    if (newPatient) {
      toast({ title: "Cadastro Atualizado com Sucesso!" });
      if (formData.appointment_date && formData.appointment_time) {
        setStep(2);
      } else {
        onSave(newPatient);
      }
    }
  };
  
  const handleConfirmAppointment = async () => {
      toast({ title: 'Verificando disponibilidade da agenda...'});
      await new Promise(res => setTimeout(res, 1500));
      const isAvailable = Math.random() > 0.1;

      if(isAvailable) {
          toast({ title: 'Horário disponível! Agendamento confirmado.'});
          onSave(formData);
      } else {
          toast({ variant: 'destructive', title: 'Horário indisponível!', description: 'Por favor, selecione outra data ou horário.'});
      }
  }

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
        <AnimatePresence mode="wait">
            {step === 1 && (
                <motion.div
                    key="step1"
                    exit={{ opacity: 0, x: -50 }}
                >
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>{contactToConvert || formData.contact_id ? 'Converter Contato em Paciente' : 'Novo Paciente'}</DialogTitle>
                            <DialogDescription>
                            Preencha os dados abaixo para finalizar o cadastro do paciente.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6 max-h-[70vh] overflow-y-auto p-1">
                            <FormSection title="Informações Pessoais">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FieldWrapper className="md:col-span-2">
                                        <Label htmlFor="full_name">Nome Completo</Label>
                                        <ValidatedInput id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} onBlur={(e) => handleValidation('Nome', e.target.value.trim().split(' ').length > 1)} isValid={validation['Nome']} required />
                                    </FieldWrapper>
                                    <FieldWrapper>
                                        <Label htmlFor="birth_date">Data de Nascimento</Label>
                                        <Input id="birth_date" name="birth_date" type="date" value={formData.birth_date} onChange={handleChange} />
                                    </FieldWrapper>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FieldWrapper>
                                        <Label htmlFor="cpf">CPF</Label>
                                        <ValidatedInput id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} onBlur={(e) => handleValidation('CPF', e.target.value.length >= 11)} isValid={validation['CPF']} maskOptions={{ mask: '000.000.000-00' }} />
                                    </FieldWrapper>
                                    <FieldWrapper className="relative">
                                        <Label htmlFor="phone">Telefone / WhatsApp</Label>
                                        <ValidatedInput id="phone" name="phone" value={formData.phone} onChange={handleChange} onBlur={handlePhoneBlur} isValid={validation['Telefone']} error={errors.phone} maskOptions={{ mask: 'INTERNATIONAL_PHONE' }} required />
                                         <AnimatePresence>
                                            {phoneSuggestions.length > 0 && (
                                                <motion.ul
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="absolute z-10 w-full bg-slate-800 border border-slate-700 rounded-md mt-1 shadow-lg max-h-48 overflow-y-auto"
                                                >
                                                    {phoneSuggestions.map(p => (
                                                        <li key={p.id} onClick={() => handleSelectSuggestion(p)} className="px-3 py-2 text-sm cursor-pointer hover:bg-slate-700">
                                                            <div className="font-semibold">{p.full_name || p.name}</div>
                                                            <div className="text-xs text-gray-400">{p.phone} - {p.type === 'patient' ? 'Paciente' : 'Contato'}</div>
                                                        </li>
                                                    ))}
                                                </motion.ul>
                                            )}
                                        </AnimatePresence>
                                    </FieldWrapper>
                                    <FieldWrapper>
                                        <Label htmlFor="email">Email</Label>
                                        <ValidatedInput id="email" name="email" type="email" value={formData.email} onChange={handleChange} onBlur={(e) => handleValidation('Email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value))} isValid={validation['Email']} />
                                    </FieldWrapper>
                                </div>
                            </FormSection>

                            <FormSection title="Endereço">
                                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                     <FieldWrapper className="md:col-span-1">
                                        <Label htmlFor="cep">CEP</Label>
                                        <div className="relative flex items-center">
                                            <Input id="cep" name="cep" value={formData.cep} onChange={handleChange} maskOptions={{ mask: '00000-000' }} />
                                            <div className="absolute right-1 h-full flex items-center">
                                                {cepLoading ? (
                                                    <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                                                ) : formData.cep && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={handleClearAddress}
                                                        className="px-2 text-gray-400 hover:text-white"
                                                        aria-label="Limpar endereço"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                     </FieldWrapper>
                                      <FieldWrapper className="md:col-span-3">
                                        <Label htmlFor="address">Logradouro</Label>
                                        <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
                                      </FieldWrapper>
                                 </div>
                                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                      <FieldWrapper className="md:col-span-1">
                                        <Label htmlFor="number">Número</Label>
                                        <ValidatedInput id="number" name="number" value={formData.number} onChange={handleChange} error={errors.number} required />
                                      </FieldWrapper>
                                      <FieldWrapper className="md:col-span-1">
                                        <Label htmlFor="complement">Complemento</Label>
                                        <Input id="complement" name="complement" value={formData.complement} onChange={handleChange} />
                                      </FieldWrapper>
                                      <FieldWrapper className="md:col-span-2">
                                        <Label htmlFor="neighborhood">Bairro</Label>
                                        <Input id="neighborhood" name="neighborhood" value={formData.neighborhood} onChange={handleChange} required />
                                      </FieldWrapper>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <FieldWrapper>
                                        <Label htmlFor="city">Cidade</Label>
                                        <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
                                      </FieldWrapper>
                                      <FieldWrapper>
                                        <Label htmlFor="state">Estado</Label>
                                        <Input id="state" name="state" value={formData.state} onChange={handleChange} required />
                                      </FieldWrapper>
                                  </div>
                            </FormSection>

                            <FormSection title="Agendamento da Avaliação (Opcional)">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="appointment_date">Data da Avaliação</Label>
                                    <Input id="appointment_date" name="appointment_date" type="date" value={formData.appointment_date} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label htmlFor="appointment_time">Hora da Avaliação</Label>
                                    <Input id="appointment_time" name="appointment_time" type="time" value={formData.appointment_time} onChange={handleChange} />
                                </div>
                                </div>
                            </FormSection>
                        </div>

                        <div className="flex justify-between items-center pt-4 mt-4 border-t border-slate-700">
                            <Button type="button" variant="secondary" onClick={handleCopyLink}>
                                <Copy className="w-4 h-4 mr-2" />
                                Copiar Link de Agenda
                            </Button>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={onClose} type="button" disabled={loading}>
                                Cancelar
                                </Button>
                                <Button type="submit" disabled={loading || Object.values(errors).some(Boolean)} className="btn-primary">
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Salvar Cadastro
                                </Button>
                            </div>
                        </div>
                    </form>
                </motion.div>
            )}

            {step === 2 && (
                <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <DialogHeader>
                        <DialogTitle>Confirmar Agendamento</DialogTitle>
                        <DialogDescription>
                        O cadastro do paciente foi salvo. Agora, confirme o agendamento da avaliação.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="my-8 text-center space-y-4 p-6 rounded-lg bg-slate-800/50 border border-slate-700">
                        <p className="text-lg">Confirmar avaliação para <strong className="gradient-text">{formData.full_name}</strong> em:</p>
                        <div className="flex items-center justify-center gap-4 text-xl font-semibold">
                            <div className="flex items-center gap-2"><Calendar className="text-blue-400" /> <span>{new Date(formData.appointment_date + 'T00:00:00').toLocaleDateString('pt-BR')}</span></div>
                            <div className="flex items-center gap-2"><Clock className="text-blue-400" /> <span>{formData.appointment_time}</span></div>
                        </div>
                    </div>
                     <div className="flex justify-end pt-4 mt-4 border-t border-slate-700">
                        <Button variant="outline" onClick={() => onSave(formData)} type="button" disabled={loading}>
                          Salvar Sem Agendar
                        </Button>
                        <Button onClick={handleConfirmAppointment} disabled={loading} className="ml-2 btn-primary">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Confirmar Agendamento <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
  );
};

export default NewPatientForm;

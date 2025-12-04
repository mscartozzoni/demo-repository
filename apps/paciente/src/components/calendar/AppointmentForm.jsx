
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { computeSmartSuggestions as computeSmartSuggestionsUtil, formatLocalDateTime as fmtDT, parseLocalDateTime as parseDT } from './utils/scheduling.js';
import { DialogHeader, DialogTitle, DialogFooter, DialogDescription, Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch.jsx';
import { useApi } from '@/contexts/ApiContext';
import { Loader2, Search, Wand2, Video } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import NewPatientForm from '@/components/patients/NewPatientForm';

const formatLocalDateTime = fmtDT;
const parseLocalDateTime = parseDT;

const highlight = (text, query) => {
    if (!query) return text;
    const i = text.toLowerCase().indexOf(query.toLowerCase());
    if (i === -1) return text;
    const before = text.slice(0, i);
    const match = text.slice(i, i + query.length);
    const after = text.slice(i + query.length);
    return (<span>{before}<mark className="bg-yellow-500/30 text-yellow-200 rounded px-0.5">{match}</mark>{after}</span>);
};

const AppointmentForm = ({ appointment, selectedDate, onSave, onClose }) => {
    const { searchPatients, getSuggestedTime, getContacts, getAppointmentTypes, getAppointmentsForDay, addAppointment, updateAppointment } = useApi();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        patient_id: '',
        doctor_id: '54110e37-aa52-4159-a646-17ceadb617f4',
        start_at: '',
        end_at: '',
        visit_type: '',
        status: 'agendado',
        reason: '',
        appointment_type_id: '',
        is_online: false,
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedPersonName, setSelectedPersonName] = useState('');
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loadingSuggestion, setLoadingSuggestion] = useState(false);
    const [contactToConvert, setContactToConvert] = useState(null);
    const [isConvertToPatientOpen, setIsConvertToPatientOpen] = useState(false);
    const [appointmentTypes, setAppointmentTypes] = useState([]);
    const [loadingTypes, setLoadingTypes] = useState(true);
    const [dayAppointments, setDayAppointments] = useState([]);
    const [smartSuggestions, setSmartSuggestions] = useState([]);

    const todayString = new Date().toISOString().split('T')[0];

    const WORK_START_HOUR = 9;
    const WORK_END_HOUR = 18;

    const getCurrentDateISO = () => {
        if (formData.start_at) {
            const date = new Date(formData.start_at);
            if (!isNaN(date)) return date.toISOString().split('T')[0];
        }
        return selectedDate ? new Date(selectedDate).toISOString().split('T')[0] : todayString;
    };
    
    const endTimeValue = useMemo(() => {
        const typeInfo = appointmentTypes.find(t => t.id == formData.appointment_type_id);
        const duration = typeInfo ? typeInfo.duration_minutes : 30;
        if (!formData.start_at) return '';
        const s = parseLocalDateTime(formData.start_at);
        if (Number.isNaN(s.getTime())) return '';
        const e = new Date(s.getTime() + duration * 60000);
        const pad = (n) => String(n).padStart(2, '0');
        return `${pad(e.getHours())}:${pad(e.getMinutes())}`;
    }, [formData.start_at, formData.appointment_type_id, appointmentTypes]);

    const computeSmartSuggestions = useCallback((dateStr, durationMin, appts) => {
        return computeSmartSuggestionsUtil({
            dateStr,
            durationMin,
            appointments: appts,
            options: {
                workStartHour: WORK_START_HOUR,
                workEndHour: WORK_END_HOUR,
                lunchBreak: { start: '12:00', end: '13:00' },
            }
        });
    }, [WORK_START_HOUR, WORK_END_HOUR]);

    const updateTimes = useCallback((startTimeStr, typeId) => {
        const typeInfo = appointmentTypes.find(t => t.id == typeId);
        const duration = typeInfo ? typeInfo.duration_minutes : 30;
        if (!startTimeStr) return;
        
        const startDate = parseLocalDateTime(startTimeStr);
        if (Number.isNaN(startDate.getTime())) return;
        
        const endDate = new Date(startDate.getTime() + duration * 60000);
        setFormData(prev => ({
            ...prev,
            start_at: formatLocalDateTime(startDate),
            end_at: endDate.toISOString(),
        }));
    }, [appointmentTypes]);

    useEffect(() => {
        const fetchTypes = async () => {
            setLoadingTypes(true);
            try {
                const types = await getAppointmentTypes();
                setAppointmentTypes(types || []);
                if (!appointment && types && types.length > 0) {
                   setFormData(prev => {
                       const firstType = types[0];
                       const initialDate = selectedDate && !isNaN(new Date(selectedDate)) ? new Date(selectedDate) : new Date();
                       if (initialDate < new Date()) initialDate.setDate(new Date().getDate()); // Ensure it's not in the past
                       if (initialDate.getHours() < 9) initialDate.setHours(9,0,0,0);
                       
                       const startTime = initialDate;
                       const duration = firstType.duration_minutes || 30;
                       const endTime = new Date(startTime.getTime() + duration * 60000);

                       return {
                           ...prev,
                           appointment_type_id: firstType.id,
                           visit_type: firstType.visit_type,
                           is_online: firstType.is_online,
                           start_at: !Number.isNaN(startTime.getTime?.()) ? formatLocalDateTime(startTime) : '',
                           end_at: !Number.isNaN(endTime.getTime?.()) ? endTime.toISOString() : '',
                       };
                   });
                }
            } finally {
                setLoadingTypes(false);
            }
        };
        fetchTypes();
    }, [getAppointmentTypes, appointment, selectedDate]);

    useEffect(() => {
        const loadDay = async () => {
            try {
                const dateStr = getCurrentDateISO();
                if (!dateStr) return;
                const list = await getAppointmentsForDay?.(dateStr, formData.doctor_id);
                const appts = Array.isArray(list) ? list : [];
                setDayAppointments(appts);
                const typeInfo = appointmentTypes.find(t => t.id == formData.appointment_type_id);
                const duration = typeInfo ? typeInfo.duration_minutes : 30;
                setSmartSuggestions(computeSmartSuggestions(dateStr, duration, appts));
            } catch (_) {
                setDayAppointments([]);
                setSmartSuggestions([]);
            }
        };
        if (appointmentTypes.length > 0 && formData.start_at) loadDay();
    }, [formData.doctor_id, formData.start_at, appointmentTypes, computeSmartSuggestions, getAppointmentsForDay]);
    
    useEffect(() => {
        if (appointment && appointmentTypes.length > 0) {
            const typeInfo = appointmentTypes.find(t => t.id === appointment.appointment_type_id);
            const initialDate = appointment.appointment_time || appointment.start_at;
            const startTime = initialDate && !isNaN(new Date(initialDate)) ? new Date(initialDate) : (selectedDate && !isNaN(new Date(selectedDate)) ? new Date(selectedDate) : new Date());
            const endTime = appointment.end_at && !isNaN(new Date(appointment.end_at)) ? new Date(appointment.end_at) : new Date(startTime.getTime() + (typeInfo?.duration_minutes || 30) * 60000);

            setFormData({
                id: appointment.id,
                patient_id: appointment.patient?.id || appointment.patient_id,
                doctor_id: appointment.doctor_id || '54110e37-aa52-4159-a646-17ceadb617f4',
                start_at: !Number.isNaN(startTime.getTime?.()) ? formatLocalDateTime(startTime) : '',
                end_at: !Number.isNaN(endTime.getTime?.()) ? endTime.toISOString() : '',
                visit_type: typeInfo?.visit_type || appointment.visit_type,
                status: appointment.status || 'agendado',
                reason: appointment.reason || '',
                appointment_type_id: appointment.appointment_type_id || '',
                is_online: typeInfo?.is_online || appointment.is_online,
            });
            
            if (appointment.patient) {
                setSelectedPersonName(appointment.patient.full_name);
                setSearchQuery(appointment.patient.full_name);
            }
        }
    }, [appointment, selectedDate, appointmentTypes]);

    const handleSearch = useCallback(async (query) => {
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }
        setLoadingSearch(true);
        try {
            const [patients, contacts] = await Promise.all([
                searchPatients(query),
                getContacts(query)
            ]);
            
            const patientResults = (patients || []).map(p => ({ ...p, type: 'patient' }));
            const contactResults = (contacts || []).map(c => ({ ...c, type: 'contact', full_name: c.name }));

            setSearchResults([...patientResults, ...contactResults]);
            setDropdownOpen(true);
            setActiveIndex(-1);
        } catch (error) {
        } finally {
            setLoadingSearch(false);
        }
    }, [searchPatients, getContacts]);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (searchQuery && searchQuery !== selectedPersonName) {
                handleSearch(searchQuery);
            }
        }, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery, selectedPersonName, handleSearch]);

    const handleSelectPerson = (person) => {
        if (person.type === 'patient') {
            setFormData(prev => ({ ...prev, patient_id: person.id }));
            setSelectedPersonName(person.full_name);
            setSearchQuery(person.full_name);
            setDropdownOpen(false);
        } else {
            setContactToConvert(person);
            setIsConvertToPatientOpen(true);
            setDropdownOpen(false);
        }
    };
    
    const handlePatientCreated = (newPatient) => {
        setIsConvertToPatientOpen(false);
        setContactToConvert(null);
        setFormData(prev => ({ ...prev, patient_id: newPatient.id }));
        setSelectedPersonName(newPatient.full_name);
        setSearchQuery(newPatient.full_name);
        toast({ title: "Paciente criado!", description: "Agora você pode finalizar o agendamento." });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (type === 'checkbox') {
             setFormData(prev => ({ ...prev, [name]: checked }));
             return;
        }

        if (name === 'appointment_type_id') {
            const selectedType = appointmentTypes.find(t => t.id == value);
            setFormData(prev => {
                const newFormData = { 
                    ...prev, 
                    appointment_type_id: value, 
                    visit_type: selectedType?.visit_type || '',
                    is_online: selectedType?.is_online || false
                };
                updateTimes(newFormData.start_at, value);
                return newFormData;
            });
        } else {
             setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSuggestTime = async () => {
        if (!formData.appointment_type_id) {
            toast({ variant: 'destructive', title: 'Selecione um tipo de consulta primeiro.'});
            return;
        }
        setLoadingSuggestion(true);
        try {
            const localFirst = smartSuggestions?.[0];
            if (localFirst) {
                updateTimes(localFirst, formData.appointment_type_id);
                const suggestedDate = parseLocalDateTime(localFirst);
                if (!isNaN(suggestedDate)) {
                    toast({ title: '✨ Horário sugerido!', description: `Sugerido ${suggestedDate.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}` });
                }
            } else {
                 toast({ variant: 'destructive', title: 'Nenhum horário encontrado', description: 'Tente outra data ou tipo de consulta.' });
            }
        } finally {
            setLoadingSuggestion(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.patient_id) {
            toast({ variant: "destructive", title: "Paciente não selecionado", description: "Por favor, busque e selecione um paciente ou crie um novo a partir de um contato." });
            return;
        }
        if (!formData.start_at || isNaN(new Date(formData.start_at))) {
            toast({ variant: "destructive", title: "Data ou hora inválida", description: "Por favor, selecione uma data e hora válidas para o agendamento." });
            return;
        }
        const startDate = parseLocalDateTime(formData.start_at);
        const typeInfo = appointmentTypes.find(t => t.id == formData.appointment_type_id);
        const duration = typeInfo ? typeInfo.duration_minutes : 30;
        const endDate = new Date(startDate.getTime() + duration * 60000);
        
        const payload = {
            ...formData,
            start_at: startDate.toISOString(),
            end_at: endDate.toISOString(),
            appointment_time: startDate.toISOString(),
            patient: { id: formData.patient_id, full_name: selectedPersonName }
        };

        try {
            if(appointment) {
                await updateAppointment(payload);
            } else {
                await addAppointment(payload);
            }
            onSave(payload);
        } catch(e) {
            // Error is already toasted by useApi
        }
    };

    if (loadingTypes) {
        return (
            <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    const startTimeDatePart = formData.start_at && !isNaN(new Date(formData.start_at)) ? formData.start_at.split('T')[0] : '';
    const startTimeTimePart = formData.start_at && !isNaN(new Date(formData.start_at)) ? formData.start_at.split('T')[1] : '';

    return (
        <>
            <form onSubmit={handleSubmit}>
                <DialogHeader>
                    <DialogTitle>{appointment ? 'Editar Consulta' : 'Nova Consulta'}</DialogTitle>
                    <DialogDescription>Preencha os detalhes abaixo para criar ou editar uma consulta.</DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh] p-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 px-4">
                        <div className="md:col-span-2 relative">
                            <Label htmlFor="patient-search">Paciente ou Contato</Label>
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input 
                                    id="patient-search"
                                    placeholder="Buscar paciente ou contato..." 
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); setDropdownOpen(true); }}
                                    onKeyDown={(e) => {
                                        if (!dropdownOpen) return;
                                        if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, searchResults.length - 1)); }
                                        if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)); }
                                        if (e.key === 'Enter' && activeIndex >= 0) { e.preventDefault(); handleSelectPerson(searchResults[activeIndex]); }
                                        if (e.key === 'Escape') { setDropdownOpen(false); }
                                    }}
                                    className="pl-9"
                                    aria-autocomplete="list"
                                    aria-expanded={dropdownOpen}
                                    aria-controls="patient-search-listbox"
                                />
                                {loadingSearch && <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 animate-spin" />}
                            </div>
                            {(dropdownOpen && (searchResults.length > 0 || (searchQuery.length >= 2 && !loadingSearch))) && (
                                <ul id="patient-search-listbox" role="listbox" className="absolute z-10 w-full bg-slate-800 border border-white/20 rounded-lg mt-1 max-h-56 overflow-y-auto">
                                    {searchResults.length > 0 ? searchResults.map((p, idx) => (
                                        <li
                                            key={p.id}
                                            role="option"
                                            aria-selected={activeIndex === idx}
                                            onClick={() => handleSelectPerson(p)}
                                            className={`px-4 py-2 cursor-pointer flex justify-between items-center ${activeIndex === idx ? 'bg-white/10' : 'hover:bg-white/10'}`}
                                            onMouseEnter={() => setActiveIndex(idx)}
                                        >
                                            <span>{highlight(p.full_name || p.name || 'Sem nome', searchQuery)}</span>
                                            {p.type === 'contact' && <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">Contato</span>}
                                        </li>
                                    )) : (
                                        <li className="px-4 py-3 text-sm text-gray-400">Nenhum resultado</li>
                                    )}
                                </ul>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="appointment_type_id">Tipo de Consulta</Label>
                            <select id="appointment_type_id" name="appointment_type_id" value={formData.appointment_type_id} onChange={handleChange} className="input-field w-full">
                                {appointmentTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.visit_type}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="date">Data</Label>
                            <Input id="date" type="date" name="date" min={todayString} value={startTimeDatePart} onChange={e => {
                                const date = e.target.value;
                                const time = startTimeTimePart || '09:00';
                                const newStartAt = `${date}T${time}`;
                                updateTimes(newStartAt, formData.appointment_type_id);
                            }} />
                        </div>
                        <div className="relative">
                            <Label htmlFor="start_time">Início</Label>
                            <Input id="start_time" type="time" name="start_time" value={startTimeTimePart} onChange={e => {
                                const time = e.target.value;
                                const date = startTimeDatePart;
                                if (!date) return;
                                const newStartAt = `${date}T${time}`;
                                updateTimes(newStartAt, formData.appointment_type_id);
                            }} />
                             <Button type="button" size="icon" variant="ghost" className="absolute right-0 bottom-0 h-10 w-10 text-blue-400 hover:text-blue-300" onClick={handleSuggestTime} disabled={loadingSuggestion} title="Sugerir próximo horário">
                                {loadingSuggestion ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                            </Button>
                            {smartSuggestions?.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {smartSuggestions.slice(0,5).map((s) => (
                                        <Button
                                            key={s}
                                            type="button"
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => updateTimes(s, formData.appointment_type_id)}
                                            title="Sugerido (minimiza intervalos)"
                                        >
                                            {s.split('T')[1]}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="end_time">Fim</Label>
                            <Input id="end_time" type="time" name="end_time" value={endTimeValue} readOnly disabled className="bg-slate-800/50" />
                        </div>
                        <div className="md:col-span-2">
                            <Label htmlFor="reason">Motivo (Opcional)</Label>
                            <Input id="reason" name="reason" placeholder="Ex: Primeira avaliação, retorno..." value={formData.reason} onChange={handleChange} />
                        </div>
                        <div className="md:col-span-2 flex items-center space-x-2 pt-2">
                            <Switch
                                id="is_online"
                                name="is_online"
                                checked={formData.is_online}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_online: checked }))}
                            />
                            <Label htmlFor="is_online" className="mb-0 flex items-center gap-2">
                                <Video className="w-4 h-4 text-blue-400" />
                                Consulta Online? (Gerar link de vídeo)
                            </Label>
                        </div>
                    </div>
                </ScrollArea>
                <DialogFooter className="pt-4 pr-4 border-t border-slate-700 mt-4">
                    <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button type="submit" className="btn-primary" disabled={loadingSuggestion || !formData.patient_id}>
                        {loadingSuggestion ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : null}
                        {appointment ? 'Salvar Alterações' : 'Salvar Consulta'}
                    </Button>
                </DialogFooter>
            </form>

            <Dialog open={isConvertToPatientOpen} onOpenChange={setIsConvertToPatientOpen}>
                <DialogContent className="max-w-4xl">
                    <NewPatientForm 
                        onSave={handlePatientCreated} 
                        onClose={() => setIsConvertToPatientOpen(false)}
                        contactToConvert={contactToConvert}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AppointmentForm;

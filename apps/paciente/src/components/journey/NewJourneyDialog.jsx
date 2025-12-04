import React, { useState, useEffect } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useApi } from '@/contexts/ApiContext';

const NewJourneyDialog = ({ onSave, onClose }) => {
    const [patientId, setPatientId] = useState('');
    const [protocolId, setProtocolId] = useState('');
    const [patients, setPatients] = useState([]);
    const [protocols, setProtocols] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    const { searchPatients, getJourneyProtocols } = useApi();

    useEffect(() => {
        const fetchProtocols = async () => {
            const data = await getJourneyProtocols();
            setProtocols(data || []);
            if (data && data.length > 0) {
                setProtocolId(data[0].id);
            }
        };
        fetchProtocols();
    }, [getJourneyProtocols]);

    useEffect(() => {
        const fetchPatients = async () => {
            if (searchTerm.length > 2) {
                const data = await searchPatients(searchTerm);
                setPatients(data || []);
            } else {
                setPatients([]);
            }
        };
        const debounce = setTimeout(() => fetchPatients(), 300);
        return () => clearTimeout(debounce);
    }, [searchTerm, searchPatients]);


    const handleSave = () => {
        if (!patientId || !protocolId) {
            alert('Por favor, selecione um paciente e um protocolo.');
            return;
        }
        onSave(patientId, protocolId);
    };

    return (
        <DialogContent className="max-w-md">
            <DialogHeader>
                <DialogTitle>Iniciar Nova Jornada de Paciente</DialogTitle>
                <DialogDescription>
                    Selecione um paciente e um protocolo para criar uma nova jornada.
                </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-4 py-4">
                <div>
                    <Label htmlFor="patient-search">Buscar Paciente</Label>
                    <input
                        id="patient-search"
                        type="text"
                        placeholder="Digite o nome do paciente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field w-full"
                    />
                     {patients.length > 0 && (
                        <div className="mt-2 max-h-40 overflow-y-auto rounded-md border border-slate-700 bg-slate-800">
                            {patients.map(p => (
                                <div 
                                    key={p.id} 
                                    onClick={() => { setPatientId(p.id); setSearchTerm(p.full_name); setPatients([]); }}
                                    className="p-2 cursor-pointer hover:bg-slate-700"
                                >
                                    {p.full_name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div>
                    <Label htmlFor="protocol-select">Protocolo</Label>
                    <select id="protocol-select" value={protocolId} onChange={(e) => setProtocolId(e.target.value)} className="input-field w-full">
                        {protocols.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={onClose}>Cancelar</Button>
                <Button className="btn-primary" onClick={handleSave}>Iniciar Jornada</Button>
            </DialogFooter>
        </DialogContent>
    );
};

export default NewJourneyDialog;
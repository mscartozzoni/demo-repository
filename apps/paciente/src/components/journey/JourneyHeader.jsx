import React from 'react';
import { motion } from 'framer-motion';
import { Route, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JourneyHeader = ({ patient, allPatients, currentPatientId, onPatientChange }) => {
    const navigate = useNavigate();

    const handlePatientChange = (e) => {
        const newPatientId = e.target.value;
        onPatientChange(newPatientId);
        navigate(`/journey/${newPatientId}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between"
        >
            <div>
                <h1 className="text-3xl font-bold gradient-text mb-2 flex items-center gap-3">
                    <Route className="w-8 h-8"/>
                    Jornada do Paciente
                </h1>
                <p className="text-gray-400">Acompanhamento completo de cada etapa do tratamento.</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-400" />
                <select
                    value={currentPatientId}
                    onChange={handlePatientChange}
                    className="input-field min-w-[250px]"
                >
                    {allPatients.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
            </div>
        </motion.div>
    );
};

export default JourneyHeader;
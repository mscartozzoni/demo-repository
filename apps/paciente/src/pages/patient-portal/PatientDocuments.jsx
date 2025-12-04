import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useApi } from '@/contexts/ApiContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2, FileText, Download, Filter } from 'lucide-react';
import { format } from 'date-fns';

const DocumentCard = ({ doc }) => (
    <motion.div
        className="floating-card p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
    >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
                <FileText className="w-8 h-8 text-blue-400" />
                <div>
                    <p className="font-bold text-white">{doc.title}</p>
                    <p className="text-sm text-slate-300">{doc.type} - {format(new Date(doc.date), 'dd/MM/yyyy')}</p>
                </div>
            </div>
            <Button size="sm" onClick={() => window.open(doc.url, '_blank')}>
                <Download className="w-4 h-4 mr-2" />
                Baixar
            </Button>
        </div>
    </motion.div>
);

const PatientDocuments = () => {
    const { getPatientDocumentsForPortal, loading } = useApi();
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        const fetchDocs = async () => {
            const data = await getPatientDocumentsForPortal();
            if (data) setDocuments(data);
        };
        fetchDocs();
    }, []);

    if (loading && documents.length === 0) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="w-16 h-16 animate-spin text-blue-500" /></div>;
    }

    return (
        <>
            <Helmet><title>Meus Documentos</title></Helmet>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <motion.h1 className="text-3xl font-bold gradient-text" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                        Documentos e Receitas
                    </motion.h1>
                    <Button variant="outline">
                        <Filter className="w-4 h-4 mr-2" />
                        Filtrar
                    </Button>
                </div>

                <div className="space-y-4">
                    {documents.length > 0 ? (
                        documents.map(doc => <DocumentCard key={doc.id} doc={doc} />)
                    ) : (
                        <Card className="floating-card text-center py-16">
                            <FileText className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold">Nenhum Documento</h3>
                            <p className="text-slate-400">Seus documentos e receitas aparecerão aqui.</p>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
};

export default PatientDocuments;
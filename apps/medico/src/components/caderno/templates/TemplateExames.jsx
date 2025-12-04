import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import GenericDocumentTemplate from './GenericDocumentTemplate';

const padraoExames = [
    'Hemograma completo',
    'Coagulograma',
    'Glicemia de jejum',
    'Ureia e creatinina',
    'Eletrocardiograma (ECG)',
    'Radiografia de tórax PA e perfil',
    'Tipagem Sanguínea e Fator RH'
];

const TemplateExames = ({ content, setContent, patient, printableId, isPreview, isImmutable, isCancelled }) => {
    const [exames, setExames] = useState([]);
    const [indicacao, setIndicacao] = useState('');

    useEffect(() => {
        setExames(content?.lista_exames || []);
        setIndicacao(content?.indicacao_clinica || '');
    }, [content]);

    const updateParentContent = (newExames, newIndicacao) => {
        if (isImmutable) return;
        setContent({ lista_exames: newExames, indicacao_clinica: newIndicacao });
    };

    const addExame = (exame = '') => {
        if (isImmutable) return;
        let newExames;
        if (exame && !exames.includes(exame)) {
            newExames = [...exames, exame];
        } else if (!exame) {
            newExames = [...exames, ''];
        } else {
            return; // Don't add duplicates
        }
        setExames(newExames);
        updateParentContent(newExames, indicacao);
    };

    const removeExame = (index) => {
        if (isImmutable) return;
        const newExames = exames.filter((_, i) => i !== index);
        setExames(newExames);
        updateParentContent(newExames, indicacao);
    };

    const handleExameChange = (index, value) => {
        if (isImmutable) return;
        const newExames = [...exames];
        newExames[index] = value;
        setExames(newExames);
        updateParentContent(newExames, indicacao);
    };

    const handleIndicacaoChange = (e) => {
        if (isImmutable) return;
        const newIndicacao = e.target.value;
        setIndicacao(newIndicacao);
        updateParentContent(exames, newIndicacao);
    };

    const EditUI = () => (
        <div className="space-y-6 text-white p-4">
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Hipótese Diagnóstica / Indicação Clínica</label>
                <Input
                    value={indicacao}
                    onChange={handleIndicacaoChange}
                    placeholder="Ex: Pré-operatório para Rinoplastia"
                    className="bg-slate-800 border-slate-600 text-white"
                    disabled={isImmutable}
                />
            </div>
            
            <div>
                <h4 className="text-lg font-medium text-white mb-3">Exames Solicitados</h4>
                <div className="space-y-3">
                    {exames.map((exame, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <Input
                                value={exame}
                                onChange={(e) => handleExameChange(index, e.target.value)}
                                placeholder="Nome do exame"
                                className="bg-slate-800 border-slate-600 text-white flex-1"
                                disabled={isImmutable}
                            />
                             {!isImmutable && (
                                <Button size="icon" variant="ghost" onClick={() => removeExame(index)} className="text-red-400 hover:bg-red-900/50">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
                {!isImmutable && (
                    <Button variant="outline" size="sm" onClick={() => addExame('')} className="mt-3 border-slate-600 hover:border-blue-500 text-white">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Adicionar Exame
                    </Button>
                )}
            </div>
            
             {!isImmutable && (
                <div>
                    <h4 className="text-lg font-medium text-white mb-3">Adicionar Exames Padrão</h4>
                    <div className="flex flex-wrap gap-2">
                        {padraoExames.map(exame => (
                            <Button
                                key={exame}
                                size="sm"
                                variant="secondary"
                                onClick={() => addExame(exame)}
                                className="bg-slate-600 hover:bg-slate-500 text-white"
                                disabled={isImmutable}
                            >
                                 <PlusCircle className="w-4 h-4 mr-2" />
                                {exame}
                            </Button>
                        ))}
                    </div>
                </div>
             )}
        </div>
    );

    const PrintLayout = () => (
        <GenericDocumentTemplate patient={patient} isCancelled={isCancelled}>
             <div className="space-y-8">
                <h2 className="text-xl font-bold text-center uppercase text-gray-800">Solicitação de Exames</h2>
                
                <div>
                    <h3 className="text-md font-semibold mb-2 border-b border-gray-300 pb-1">Indicação Clínica</h3>
                    <p className="text-sm text-gray-700">{indicacao || 'Não especificada'}</p>
                </div>
                
                <div>
                    <h3 className="text-md font-semibold mb-2 border-b border-gray-300 pb-1">Exames Solicitados</h3>
                    {exames.filter(e => e.trim() !== '').length > 0 
                        ? (
                            <ul className="list-disc list-inside space-y-1 pl-2 text-sm text-gray-800">
                                {exames.filter(e => e.trim() !== '').map((e, i) => <li key={i}>{e}</li>)}
                            </ul>
                        )
                        : <p className="text-sm text-gray-600">Nenhum exame solicitado.</p>
                    }
                </div>
            </div>
        </GenericDocumentTemplate>
    );

    if (isPreview) {
        return <div id={printableId}><PrintLayout /></div>
    }
    
    return (
        <div className="flex flex-col lg:flex-row h-full">
            <div className="w-full lg:w-1/2 p-4 no-print border-b lg:border-b-0 lg:border-r border-slate-700 overflow-y-auto">
                <EditUI />
            </div>
            <div className="w-full lg:w-1/2 p-4 bg-slate-200 overflow-y-auto">
                <div id={printableId}>
                    <PrintLayout />
                </div>
            </div>
        </div>
    );
};

export default TemplateExames;
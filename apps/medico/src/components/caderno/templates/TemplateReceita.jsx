import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import GenericDocumentTemplate from './GenericDocumentTemplate';

const padraoReceitas = [
    { med: 'Amoxicilina 500mg', pos: 'Tomar 1 comprimido de 8/8 horas por 7 dias.' },
    { med: 'Dipirona 500mg', pos: 'Tomar 1 comprimido até de 6/6 horas se dor ou febre.' },
    { med: 'Ibuprofeno 600mg', pos: 'Tomar 1 comprimido de 12/12 horas por 5 dias.' },
];

const TemplateReceita = ({ content, setContent, patient, printableId, isPreview, isImmutable, isCancelled }) => {
    const [prescricao, setPrescricao] = useState('');
    const [observacoes, setObservacoes] = useState('');
    
    useEffect(() => {
        if (isImmutable) return;
        setContent(prev => ({ ...prev, prescricao, observacoes }));
    }, [prescricao, observacoes, setContent, isImmutable]);

    useEffect(() => {
        setPrescricao(content?.prescricao || '');
        setObservacoes(content?.observacoes || '');
    }, [content]);

    const addPrescricaoPadrao = (receita) => {
        if (isImmutable) return;
        const novaLinha = `${receita.med}\nUso: ${receita.pos}`;
        setPrescricao(prev => prev ? `${prev}\n\n${novaLinha}` : novaLinha);
    };

    const EditUI = () => (
        <div className="space-y-6 text-white p-4">
            {!isImmutable && (
                <div>
                    <h4 className="text-lg font-medium text-white mb-3">Adicionar Prescrições Padrão</h4>
                    <div className="flex flex-wrap gap-2">
                        {padraoReceitas.map((receita, index) => (
                            <Button
                                key={index}
                                size="sm"
                                variant="secondary"
                                onClick={() => addPrescricaoPadrao(receita)}
                                className="bg-slate-600 hover:bg-slate-500 text-white"
                            >
                                <PlusCircle className="w-4 h-4 mr-2" />
                                {receita.med}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            <div>
                <h4 className="text-lg font-medium text-white mb-3">Prescrição</h4>
                <Textarea
                    value={prescricao}
                    onChange={(e) => { if (!isImmutable) setPrescricao(e.target.value) }}
                    placeholder={isImmutable ? "Este documento está finalizado e não pode ser editado." : "Digite a prescrição ou use os botões de atalho acima..."}
                    className="bg-slate-800 border-slate-600 text-white min-h-[250px]"
                    disabled={isImmutable}
                />
            </div>
             <div>
                <h4 className="text-lg font-medium text-white mb-3">Observações Gerais</h4>
                 <Textarea
                    value={observacoes}
                    onChange={(e) => { if (!isImmutable) setObservacoes(e.target.value) }}
                    placeholder={isImmutable ? "" : "Observações adicionais, se houver."}
                    className="bg-slate-800 border-slate-600 text-white"
                    disabled={isImmutable}
                />
            </div>
        </div>
    );

    const PrintLayout = () => (
        <GenericDocumentTemplate patient={patient} isCancelled={isCancelled}>
            <div className="space-y-8">
                <h2 className="text-xl font-bold text-center uppercase text-gray-800">Receituário Simples</h2>
                
                <div>
                    <h3 className="text-md font-semibold mb-2 border-b border-gray-300 pb-1">Prescrição</h3>
                    <div className="text-sm text-gray-800 whitespace-pre-wrap min-h-[400px]">
                        {prescricao || 'Nenhuma prescrição adicionada.'}
                    </div>
                </div>

                {observacoes && (
                     <div>
                        <h3 className="text-md font-semibold mb-2 border-b border-gray-300 pb-1">Observações</h3>
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">{observacoes}</p>
                    </div>
                )}
            </div>
        </GenericDocumentTemplate>
    );

    if (isPreview) {
        return <div id={printableId}><PrintLayout /></div>
    }

    // Na visualização de edição, mostramos a UI de edição e a prévia lado a lado
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

export default TemplateReceita;
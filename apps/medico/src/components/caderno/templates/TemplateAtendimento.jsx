import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import GenericDocumentTemplate from './GenericDocumentTemplate';

const surgeryTypes = [
    "Rinoplastia",
    "Mamoplastia de Aumento",
    "Mamoplastia Redutora",
    "Mastopexia",
    "Abdominoplastia",
    "Lipoaspiração",
    "Blefaroplastia",
    "Otoplastia",
];

const TemplateAtendimento = ({ content, setContent, patient, printableId, isPreview }) => {
    const [localContent, setLocalContent] = useState(content || {});

    useEffect(() => {
        setLocalContent(content || {});
    }, [content]);

    const handleContentChange = (field, value, subField = null) => {
        const updatedContent = { ...localContent };
        if (subField) {
            updatedContent[field] = { ...(updatedContent[field] || {}), [subField]: value };
        } else {
            updatedContent[field] = value;
        }

        // Calculate IMC
        if (field === 'avaliacao_corporal' && (subField === 'peso' || subField === 'altura')) {
            const peso = subField === 'peso' ? parseFloat(value) : parseFloat(updatedContent.avaliacao_corporal?.peso || 0);
            const altura = subField === 'altura' ? parseFloat(value) : parseFloat(updatedContent.avaliacao_corporal?.altura || 0);
            if (peso > 0 && altura > 0) {
                const alturaMetros = altura / 100;
                const imcCalculado = (peso / (alturaMetros * alturaMetros)).toFixed(2);
                updatedContent.avaliacao_corporal.imc = imcCalculado;
            } else {
                updatedContent.avaliacao_corporal.imc = '';
            }
        }
        setLocalContent(updatedContent);
        setContent(updatedContent); // Update parent state immediately
    };

    const EditUI = () => (
        <div className="space-y-6 text-white p-4">
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Queixa Principal</label>
                <Textarea value={localContent.queixa_principal || ''} onChange={(e) => handleContentChange('queixa_principal', e.target.value)} placeholder="Descreva a queixa principal do paciente..." className="bg-slate-700 border-slate-600 text-white min-h-[80px]" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">História da Doença Atual (HDA)</label>
                <Textarea value={localContent.hda || ''} onChange={(e) => handleContentChange('hda', e.target.value)} placeholder="Detalhes sobre a condição atual..." className="bg-slate-700 border-slate-600 text-white min-h-[120px]" />
            </div>

            <div>
                <h4 className="text-lg font-medium text-white mb-3">Avaliação Corporal</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputGroup label="Peso (kg)" placeholder="70" value={localContent.avaliacao_corporal?.peso || ''} onChange={(e) => handleContentChange('avaliacao_corporal', e.target.value, 'peso')} type="number" />
                    <InputGroup label="Altura (cm)" placeholder="175" value={localContent.avaliacao_corporal?.altura || ''} onChange={(e) => handleContentChange('avaliacao_corporal', e.target.value, 'altura')} type="number" />
                    <InputGroup label="IMC" placeholder="-" value={localContent.avaliacao_corporal?.imc || ''} readOnly />
                </div>
            </div>

            <div>
                <h4 className="text-lg font-medium text-white mb-3">Sinais Vitais</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <InputGroup label="Pressão Arterial" placeholder="120/80 mmHg" value={localContent.pressao_arterial || ''} onChange={(e) => handleContentChange('pressao_arterial', e.target.value)} />
                    <InputGroup label="Freq. Cardíaca" placeholder="72 bpm" value={localContent.freq_cardiaca || ''} onChange={(e) => handleContentChange('freq_cardiaca', e.target.value)} />
                    <InputGroup label="Freq. Respiratória" placeholder="16 rpm" value={localContent.freq_respiratoria || ''} onChange={(e) => handleContentChange('freq_respiratoria', e.target.value)} />
                    <InputGroup label="Temperatura" placeholder="36.5°C" value={localContent.temperatura || ''} onChange={(e) => handleContentChange('temperatura', e.target.value)} />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Exame Físico</label>
                <Textarea value={localContent.exame_fisico || ''} onChange={(e) => handleContentChange('exame_fisico', e.target.value)} placeholder="Descrição do exame físico..." className="bg-slate-700 border-slate-600 text-white min-h-[100px]" />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Hipótese Diagnóstica</label>
                <Input value={localContent.hipotese_diagnostica || ''} onChange={(e) => handleContentChange('hipotese_diagnostica', e.target.value)} placeholder="CID-10 ou descrição" className="bg-slate-700 border-slate-600 text-white" />
            </div>

            <div className="p-4 bg-slate-700/30 rounded-lg space-y-4">
                <h4 className="text-lg font-medium text-white">Indicação Cirúrgica</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputGroup label="Nome da Cirurgia (Procedimento Principal)" placeholder="Ex: Rinoplastia + Septoplastia" value={localContent.indicacao_cirurgica?.nome_cirurgia || ''} onChange={(e) => handleContentChange('indicacao_cirurgica', e.target.value, 'nome_cirurgia')} />
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Tipo de Cirurgia</label>
                        <Select onValueChange={(value) => handleContentChange('indicacao_cirurgica', value, 'tipo_cirurgia')} value={localContent.indicacao_cirurgica?.tipo_cirurgia}>
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                {surgeryTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Plano Terapêutico</label>
                <Textarea value={localContent.plano_terapeutico || ''} onChange={(e) => handleContentChange('plano_terapeutico', e.target.value)} placeholder="Condutas, medicações, exames solicitados..." className="bg-slate-700 border-slate-600 text-white min-h-[100px]" />
            </div>
        </div>
    );
    
    const PrintLayout = () => (
        <GenericDocumentTemplate patient={patient}>
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-center mb-6 uppercase text-gray-800">Ficha de Atendimento</h2>
                
                <Section title="Queixa Principal">{localContent.queixa_principal}</Section>
                <Section title="História da Doença Atual (HDA)">{localContent.hda}</Section>
                
                <Section title="Avaliação Corporal">
                    <div className="grid grid-cols-3 gap-4">
                        <p><strong>Peso:</strong> {localContent.avaliacao_corporal?.peso || 'N/A'} kg</p>
                        <p><strong>Altura:</strong> {localContent.avaliacao_corporal?.altura || 'N/A'} cm</p>
                        <p><strong>IMC:</strong> {localContent.avaliacao_corporal?.imc || 'N/A'}</p>
                    </div>
                </Section>
                
                <Section title="Sinais Vitais">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <p><strong>PA:</strong> {localContent.pressao_arterial || 'N/A'}</p>
                        <p><strong>FC:</strong> {localContent.freq_cardiaca || 'N/A'}</p>
                        <p><strong>FR:</strong> {localContent.freq_respiratoria || 'N/A'}</p>
                        <p><strong>Temp:</strong> {localContent.temperatura || 'N/A'}</p>
                    </div>
                </Section>

                <Section title="Exame Físico">{localContent.exame_fisico}</Section>
                <Section title="Hipótese Diagnóstica">{localContent.hipotese_diagnostica}</Section>
                <Section title="Indicação Cirúrgica">
                    <p><strong>Procedimento:</strong> {localContent.indicacao_cirurgica?.nome_cirurgia || 'N/A'}</p>
                    <p><strong>Tipo:</strong> {localContent.indicacao_cirurgica?.tipo_cirurgia || 'N/A'}</p>
                </Section>
                <Section title="Plano Terapêutico">{localContent.plano_terapeutico}</Section>
            </div>
        </GenericDocumentTemplate>
    );

    return isPreview ? (
        <div id={printableId}><PrintLayout /></div>
    ) : (
        <EditUI />
    );
};

const Section = ({ title, children }) => (
    <div className="break-inside-avoid">
        <h3 className="text-md font-semibold mb-2 border-b border-gray-200 pb-1">{title}</h3>
        <div className="text-sm text-gray-700 whitespace-pre-wrap">{children || 'Não preenchido'}</div>
    </div>
);

const InputGroup = ({ label, ...props }) => (
    <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>
        <Input {...props} className={`bg-slate-700 border-slate-600 text-white ${props.readOnly ? 'opacity-70' : ''}`} />
    </div>
);

export default TemplateAtendimento;
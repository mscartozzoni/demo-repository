import React, { useState, useEffect } from 'react';
    import { Input } from '@/components/ui/input';
    import { Textarea } from '@/components/ui/textarea';
    import { Button } from '@/components/ui/button';
    import { CheckIcon, FileTextIcon, InfoCircledIcon, ClipboardIcon } from '@radix-ui/react-icons';
    import GenericDocumentTemplate from './GenericDocumentTemplate';
    import { useToast } from '@/components/ui/use-toast';
    import { format } from 'date-fns';

    const surgicalTemplates = [
      {
        category: 'Termos de Consentimento',
        items: [
          { name: 'Consentimento Cirúrgico Geral', icon: InfoCircledIcon, content: 'Eu, [Nome do Paciente], autorizo o Dr. [Nome do Médico] a realizar o procedimento de [Nome do Procedimento]...' },
          { name: 'Consentimento para Anestesia', icon: InfoCircledIcon, content: 'Declaro que fui informado sobre os riscos e benefícios da anestesia...' },
        ],
      },
      {
        category: 'Orientações Pré-Operatórias',
        items: [
          { name: 'Orientações Gerais', icon: CheckIcon, content: 'Jejum de 8 horas. Suspender medicamentos anticoagulantes. Trazer exames no dia da cirurgia...' },
          { name: 'Orientações para Rinoplastia', icon: CheckIcon, content: 'Evitar exposição solar por 15 dias antes. Higienizar o nariz com soro fisiológico...' },
        ],
      },
      {
        category: 'Orientações Pós-Operatórias',
        items: [
          { name: 'Recomendações Pós-Lipoaspiração', icon: CheckIcon, content: 'Uso contínuo da cinta modeladora por 30 dias. Realizar drenagem linfática a partir do 5º dia...' },
          { name: 'Recomendações Pós-Mamoplastia', icon: CheckIcon, content: 'Não levantar os braços acima dos ombros por 21 dias. Dormir de barriga para cima...' },
        ],
      },
      {
        category: 'Relatórios e Declarações',
        items: [
          { name: 'Relatório Cirúrgico', icon: FileTextIcon, content: 'Paciente submetido(a) a [Procedimento] no dia [Data]...' },
          { name: 'Declaração de Acompanhante', icon: FileTextIcon, content: 'Declaro para os devidos fins que [Nome do Acompanhante] acompanhou o(a) paciente...' },
        ],
      },
    ];

    const TemplateSurgical = ({ content, setContent, patient }) => {
        const { toast } = useToast();
        const [documentName, setDocumentName] = useState('');
        const [documentText, setDocumentText] = useState('');
        const [selectedTemplateName, setSelectedTemplateName] = useState('');
        const [documentData, setDocumentData] = useState({
            document_date: new Date().toLocaleDateString('pt-BR'),
            patient_name: patient?.name || '',
        });

        useEffect(() => {
            const defaultName = patient 
                ? `Documento Cirúrgico - ${patient.name} - ${format(new Date(), 'dd-MM-yyyy')}`
                : `Documento Cirúrgico - ${format(new Date(), 'dd-MM-yyyy')}`;
            
            setDocumentName(content?.documentName || defaultName);
            setDocumentText(content?.documentContent || '');
            setSelectedTemplateName(content?.templateType || '');
        }, [content, patient]);

        useEffect(() => {
            setContent(prev => ({
                ...prev,
                documentName,
                documentContent: documentText,
                templateType: selectedTemplateName,
            }));
        }, [documentName, documentText, selectedTemplateName, setContent]);

        const handleTemplateClick = (template) => {
            setSelectedTemplateName(template.name);
            setDocumentText(template.content.replace('[Nome do Paciente]', patient?.name || '[Nome do Paciente]'));
            setDocumentName(`${template.name} - ${patient?.name || ''}`);
            toast({
                title: `Modelo '${template.name}' carregado!`,
                description: "O conteúdo foi preenchido na área de texto.",
            });
        };

        const handleDataChange = (e) => {
            const { id, value } = e.target;
            setDocumentData(prev => ({ ...prev, [id]: value }));
        };

        const EditUI = () => (
            <div className="space-y-6 mt-4 text-white p-4">
                {!patient && (
                     <div className="p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg text-yellow-300 text-sm">
                        Atenção: Nenhum paciente selecionado. O documento será um modelo genérico.
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Nome do Documento</label>
                    <Input 
                        value={documentName}
                        onChange={(e) => setDocumentName(e.target.value)}
                        className="bg-slate-800 border-slate-600"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Biblioteca de Modelos</label>
                    <div className="space-y-4">
                        {surgicalTemplates.map(category => (
                            <div key={category.category}>
                                <h5 className="text-slate-400 text-sm font-semibold mb-2">{category.category}</h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {category.items.map(template => (
                                        <Button
                                            key={template.name}
                                            variant="outline"
                                            onClick={() => handleTemplateClick(template)}
                                            className={`justify-start text-left h-auto py-2 ${selectedTemplateName === template.name ? 'bg-blue-600/80 border-blue-500' : 'border-slate-700 bg-slate-800/50 hover:bg-slate-700/70'}`}
                                        >
                                            <template.icon className="w-4 h-4 mr-3 flex-shrink-0" />
                                            <span className="text-xs">{template.name}</span>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Conteúdo</label>
                    <Textarea 
                        value={documentText}
                        onChange={(e) => setDocumentText(e.target.value)}
                        placeholder="Selecione um modelo ou escreva o conteúdo aqui..."
                        className="bg-slate-800 border-slate-600 min-h-[250px]"
                    />
                </div>
            </div>
        );

        const PrintLayout = () => (
            <GenericDocumentTemplate patient={patient}>
                <div className="flex justify-end mb-8">
                    <div className="w-full sm:w-1/3">
                        <label htmlFor="document_date" className="text-sm text-gray-500">Data</label>
                        <Input 
                            id="document_date" 
                            className="lined-input" 
                            value={documentData.document_date}
                            onChange={handleDataChange}
                            placeholder="DD/MM/AAAA"
                        />
                    </div>
                </div>

                <div className="mb-8">
                    <label htmlFor="patient_name" className="text-sm text-gray-500">Paciente</label>
                    <Input 
                        id="patient_name" 
                        className="lined-input font-semibold" 
                        value={documentData.patient_name}
                        onChange={handleDataChange}
                        placeholder="Nome completo do paciente"
                    />
                </div>

                <div className="mb-8">
                    <h2 className="text-lg font-bold text-center mb-4 uppercase text-gray-600">{documentName || 'Documento Cirúrgico'}</h2>
                    <Textarea 
                        id="surgical_content"
                        className="lined-textarea text-base" 
                        rows="20" 
                        value={documentText}
                        onChange={(e) => setDocumentText(e.target.value)}
                        placeholder="Conteúdo do documento..."
                    />
                </div>
                
                <div className="flex justify-end mt-12">
                    <div className="w-full sm:w-2/5 text-center">
                        <Input 
                            id="digital_signature"
                            className="lined-input text-center font-semibold"
                            placeholder="Assinatura Digital / CRM"
                        />
                         <label htmlFor="digital_signature" className="text-xs text-gray-500 pt-2 block">(Certificação Digital)</label>
                    </div>
                </div>
            </GenericDocumentTemplate>
        );

        return (
            <div className="flex flex-col lg:flex-row">
                <div className="w-full lg:w-1/2 p-4 no-print border-b lg:border-b-0 lg:border-r border-slate-700 max-h-[70vh] overflow-y-auto">
                    <EditUI />
                </div>
                <div className="w-full lg:w-1/2 p-4 bg-slate-200">
                    <div id="printable-content-surgical" className="scale-[0.9] sm:scale-[1] lg:scale-[0.65] origin-top-left lg:-translate-x-10 lg:-translate-y-10">
                        <PrintLayout />
                    </div>
                </div>
            </div>
        );
    };

    export default TemplateSurgical;
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Camera, Eye, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import GenericDocumentTemplate from './GenericDocumentTemplate';

const TemplateEvolucao = ({ content, setContent, patient, printableId, isPreview }) => {
    const { toast } = useToast();

    const handleChange = (field, value, subField = null) => {
        setContent(prev => {
            const newContent = { ...prev };
            if (subField) {
                newContent[field] = {
                    ...(newContent[field] || {}),
                    [subField]: value
                };
            } else {
                newContent[field] = value;
            }
            return newContent;
        });
    };

    const handlePhotoUpload = () => {
        toast({
            title: "🚧 Upload de Fotos",
            description: "Funcionalidade de upload de fotos ainda não implementada. Você pode solicitá-la no próximo prompt! 🚀",
        });
    };
    
    const handleAction = (action) => {
         toast({
            title: `🚧 Ação: ${action}`,
            description: "Esta funcionalidade não está implementada. Você pode solicitá-la em seu próximo prompt! 🚀",
        });
    };

    const dor = content?.sinais_inflamatorios?.dor || 0;
    
    const mockImages = [
        { id: 1, alt: "Foto da evolução do paciente - vista frontal", description: "Vista frontal" },
        { id: 2, alt: "Foto da evolução do paciente - vista lateral esquerda", description: "Perfil Esquerdo" },
        { id: 3, alt: "Foto da evolução do paciente - vista lateral direita", description: "Perfil Direito" },
    ];

    const EditUI = () => (
        <div className="space-y-6 text-white p-4">
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Evolução Subjetiva</label>
                <Textarea
                    value={content?.subjetivo || ''}
                    onChange={(e) => handleChange('subjetivo', e.target.value)}
                    placeholder="Relato do paciente, queixas, melhora ou piora dos sintomas..."
                    className="bg-slate-800 border-slate-600 text-white min-h-[100px]"
                />
            </div>

            <div>
                <h4 className="text-lg font-medium text-white mb-3">Avaliação Pós-operatória</h4>
                <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputGroup label="Volume do Dreno (ml)" placeholder="50" type="number" value={content?.avaliacao_pos_op?.volume_dreno || ''} onChange={(e) => handleChange('avaliacao_pos_op', e.target.value, 'volume_dreno')} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Sinais Inflamatórios</label>
                        <div className="flex items-center gap-6">
                            <CheckboxGroup label="Rubor" checked={content?.sinais_inflamatorios?.rubor || false} onChange={(e) => handleChange('sinais_inflamatorios', e.target.checked, 'rubor')} />
                            <CheckboxGroup label="Calor" checked={content?.sinais_inflamatorios?.calor || false} onChange={(e) => handleChange('sinais_inflamatorios', e.target.checked, 'calor')} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Escala de Dor: <span className="font-bold text-blue-400">{dor}</span></label>
                        <Slider
                            defaultValue={[dor]}
                            max={10}
                            step={1}
                            onValueChange={(value) => handleChange('sinais_inflamatorios', value[0], 'dor')}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Estado da Ferida Operatória</label>
                        <Textarea
                            value={content?.avaliacao_pos_op?.estado_ferida || ''}
                            onChange={(e) => handleChange('avaliacao_pos_op', e.target.value, 'estado_ferida')}
                            placeholder="Aspecto da incisão, presença de secreções, cicatrização..."
                            className="bg-slate-800 border-slate-600 text-white min-h-[80px]"
                        />
                    </div>
                </div>
            </div>

            <div>
                <h4 className="text-lg font-medium text-white mb-3">Fotografias de Acompanhamento</h4>
                <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                        <AnimatePresence>
                        {mockImages.map((image, index) => (
                            <motion.div 
                                key={image.id}
                                className="relative group rounded-lg overflow-hidden aspect-square"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <img class="w-full h-full object-cover" alt={image.alt} src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
                                <div className="image-overlay">
                                    <Button size="icon" variant="ghost" className="h-9 w-9 bg-black/50 hover:bg-black/80" onClick={() => handleAction('Ver')}>
                                        <Eye className="w-5 h-5" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-9 w-9 bg-black/50 hover:bg-red-500/80" onClick={() => handleAction('Excluir')}>
                                        <Trash2 className="w-5 h-5" />
                                    </Button>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/80 to-transparent">
                                    <p className="text-white text-xs truncate">{image.description}</p>
                                </div>
                            </motion.div>
                        ))}
                        </AnimatePresence>
                    </div>
                    <Button variant="outline" onClick={handlePhotoUpload} className="w-full border-dashed border-slate-500 hover:border-blue-500 hover:text-blue-400">
                        <Camera className="w-4 h-4 mr-2" />
                        Adicionar Mais Fotos
                    </Button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Plano e Conduta</label>
                <Textarea
                    value={content?.plano || ''}
                    onChange={(e) => handleChange('plano', e.target.value)}
                    placeholder="Mudanças na medicação, solicitação de novos exames, orientações, agendamento de retorno..."
                    className="bg-slate-800 border-slate-600 text-white min-h-[100px]"
                />
            </div>
        </div>
    );
    
    const PrintLayout = () => (
         <GenericDocumentTemplate patient={patient}>
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-center mb-6 uppercase text-gray-800">Evolução Médica</h2>
                
                <Section title="Evolução Subjetiva">{content?.subjetivo}</Section>
                
                <Section title="Avaliação Pós-operatória">
                    <p><strong>Volume do Dreno:</strong> {content?.avaliacao_pos_op?.volume_dreno || 'N/A'} ml</p>
                    <div className="mt-2">
                        <strong>Sinais Inflamatórios:</strong>
                        <ul className="list-disc list-inside">
                           <li>Rubor: {content?.sinais_inflamatorios?.rubor ? 'Sim' : 'Não'}</li>
                           <li>Calor: {content?.sinais_inflamatorios?.calor ? 'Sim' : 'Não'}</li>
                           <li>Dor (0-10): {content?.sinais_inflamatorios?.dor || '0'}</li>
                        </ul>
                    </div>
                    <p className="mt-2"><strong>Estado da Ferida:</strong> {content?.avaliacao_pos_op?.estado_ferida || 'Não descrito'}</p>
                </Section>

                <Section title="Plano e Conduta">{content?.plano}</Section>
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

const Section = ({ title, children }) => (
    <div className="break-inside-avoid">
        <h3 className="text-md font-semibold mb-2 border-b border-gray-200 pb-1">{title}</h3>
        <div className="text-sm text-gray-700 whitespace-pre-wrap">{children || 'Não preenchido'}</div>
    </div>
);


const InputGroup = ({ label, ...props }) => (
    <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>
        <Input {...props} className="bg-slate-700 border-slate-600 text-white" />
    </div>
);

const CheckboxGroup = ({ label, ...props }) => (
    <div className="flex items-center gap-2">
        <input type="checkbox" {...props} id={label} className="h-4 w-4 rounded border-slate-500 bg-slate-800 text-blue-600 focus:ring-blue-500" />
        <label htmlFor={label} className="text-sm text-slate-300">{label}</label>
    </div>
);

export default TemplateEvolucao;
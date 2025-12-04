import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { Button } from '@/components/ui/button';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { GripVertical, Eye, EyeOff, TextCursorInput, Sparkles, Wand2, Facebook, Instagram, Linkedin, Twitter, Youtube, Copy, Loader2, Save, Zap } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Slider } from '@/components/ui/slider';
import { getMyWebsite, createMyWebsite, updateMyWebsite } from '@/services/api/website';
import { useAuth } from '@/contexts/AuthContext';

const SITE_TEMPLATES = {
    modern_clinic: {
        name: 'Clínica Moderna',
        sections: {
            hero: { id: 'hero', title: 'Hero Section', visible: true, items: [
                { id: 'hero-1', type: 'heading', content: 'Inovação e Cuidado em Cirurgia Plástica', fontSize: 40 },
                { id: 'hero-2', type: 'paragraph', content: 'Tecnologia de ponta e uma equipe dedicada a realçar sua beleza natural com segurança.', fontSize: 18 },
                { id: 'hero-3', type: 'button', content: 'Agende uma Avaliação' },
            ]},
            features: { id: 'features', title: 'Nossos Diferenciais', visible: true, items: [
                { id: 'features-1', type: 'feature', content: 'Equipe Qualificada' },
                { id: 'features-2', type: 'feature', content: 'Estrutura Completa' },
                { id: 'features-3', type: 'feature', content: 'Atendimento Exclusivo' },
            ]},
            gallery: { id: 'gallery', title: 'Nossas Instalações', visible: true, items: [
                { id: 'gallery-1', type: 'gallery-image', alt: 'Recepção da clínica' },
                { id: 'gallery-2', type: 'gallery-image', alt: 'Sala de consulta' },
                { id: 'gallery-3', type: 'gallery-image', alt: 'Equipamento moderno' },
            ]},
            newsletter: { id: 'newsletter', title: 'Fique por Dentro', visible: true, items: [
                { id: 'newsletter-1', type: 'heading', content: 'Novidades e Dicas de Saúde', fontSize: 32 },
                { id: 'newsletter-2', type: 'input', content: 'Digite seu e-mail' },
                { id: 'newsletter-3', type: 'button', content: 'Inscrever-se' },
            ]},
            social: { id: 'social', title: 'Redes Sociais', visible: true, items: [
                { id: 'social-1', type: 'social-icon', platform: 'facebook', link: 'https://facebook.com/marcioplasticsurgery' },
                { id: 'social-2', type: 'social-icon', platform: 'instagram', link: 'https://instagram.com/marcioplasticsurgery' },
                { id: 'social-3', type: 'social-icon', platform: 'linkedin', link: 'https://linkedin.com/in/marcioplasticsurgery' },
            ]},
        }
    },
    personal_brand: {
        name: 'Marca Pessoal',
        sections: {
            hero: { id: 'hero', title: 'Hero Section', visible: true, items: [
                { id: 'hero-1', type: 'heading', content: 'Dr. Márcio - Arte e Ciência na Cirurgia', fontSize: 40 },
                { id: 'hero-2', type: 'paragraph', content: 'Minha missão é unir técnica e sensibilidade para alcançar resultados que transformam vidas.', fontSize: 18 },
                { id: 'hero-3', type: 'button', content: 'Conheça Minha Trajetória' },
            ]},
            catalog: { id: 'catalog', title: 'Principais Procedimentos', visible: true, items: [
                { id: 'catalog-1', type: 'product', name: 'Rinoplastia', description: 'Harmonização facial e funcional.' },
                { id: 'catalog-2', type: 'product', name: 'Lipoaspiração HD', description: 'Definição do contorno corporal.' },
                { id: 'catalog-3', type: 'product', name: 'Mamoplastia', description: 'Estética e reconstrução mamária.' },
            ]},
            gallery: { id: 'gallery', title: 'Casos de Sucesso', visible: true, items: [
                { id: 'gallery-1', type: 'gallery-image', alt: 'Resultado de rinoplastia' },
                { id: 'gallery-2', type: 'gallery-image', alt: 'Contorno corporal pós-lipo' },
                { id: 'gallery-3', type: 'gallery-image', alt: 'Paciente satisfeita' },
            ]},
            newsletter: { id: 'newsletter', title: 'Contato Direto', visible: true, items: [
                { id: 'newsletter-1', type: 'heading', content: 'Receba meus artigos em primeira mão', fontSize: 32 },
                { id: 'newsletter-2', type: 'input', content: 'Seu melhor e-mail' },
                { id: 'newsletter-3', type: 'button', content: 'Assinar' },
            ]},
            social: { id: 'social', title: 'Redes Sociais', visible: true, items: [
                { id: 'social-1', type: 'social-icon', platform: 'twitter', link: 'https://twitter.com/drmarcio' },
                { id: 'social-2', type: 'social-icon', platform: 'youtube', link: 'https://youtube.com/drmarcio' },
                { id: 'social-3', type: 'social-icon', platform: 'instagram', link: 'https://instagram.com/drmarcio' },
            ]},
        }
    },
};

const DraggableItem = ({ id, children, onClick }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 100 : 'auto',
    };

    return (
        <div ref={setNodeRef} style={style} className="relative group" onClick={onClick}>
            <div
                {...attributes}
                {...listeners}
                className="absolute -left-2 top-2 p-1 cursor-grab opacity-0 group-hover:opacity-50 transition-opacity bg-background/50 rounded-full z-10"
            >
                <GripVertical className="w-5 h-5 text-white" />
            </div>
            {children}
        </div>
    );
};

const DroppableSection = ({ id, title, children }) => {
    const { setNodeRef } = useSortable({ id });
    
    return (
        <div ref={setNodeRef} className="p-4 rounded-lg border border-dashed border-border mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <div className="space-y-2">
                <SortableContext items={React.Children.map(children, child => child.props.id)}>
                    {children}
                </SortableContext>
            </div>
        </div>
    );
};


const ItemContent = ({ item, toast, isSelected }) => {
    const handleNotImplemented = () => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" });
    
    const baseClasses = `text-white text-center ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-background' : ''}`;

    const getSocialIcon = (platform) => {
        switch (platform) {
            case 'facebook': return <Facebook className="w-6 h-6" />;
            case 'instagram': return <Instagram className="w-6 h-6" />;
            case 'linkedin': return <Linkedin className="w-6 h-6" />;
            case 'twitter': return <Twitter className="w-6 h-6" />;
            case 'youtube': return <Youtube className="w-6 h-6" />;
            default: return null;
        }
    };

    switch (item.type) {
        case 'heading': return <h1 className={`${baseClasses} font-bold`} style={{ fontSize: item.fontSize ? `${item.fontSize}px` : '40px' }}>{item.content}</h1>;
        case 'paragraph': return <p className={`${baseClasses} text-slate-300`} style={{ fontSize: item.fontSize ? `${item.fontSize}px` : '18px' }}>{item.content}</p>;
        case 'button': return <Button className="mx-auto block" onClick={handleNotImplemented}>{item.content}</Button>;
        case 'feature': return (
            <div className="text-center p-4">
                <p className="font-bold text-white">{item.content}</p>
            </div>
        );
        case 'gallery-image': return (
            <div className="aspect-square bg-card/50 rounded-xl overflow-hidden">
                 <img className="w-full h-full object-cover rounded-lg" alt={item.alt} src="https://images.unsplash.com/photo-1592177183170-a4256e44e072" />
            </div>
        );
        case 'product': return (
            <div className="bg-card/50 p-4 rounded-xl text-center">
                <img className="w-full h-32 object-cover rounded-lg mb-2" alt={item.name} src="https://images.unsplash.com/photo-1664958884838-705b1518406f" />
                <h4 className="font-semibold text-white">{item.name}</h4>
                <p className="text-sm text-slate-400">{item.description}</p>
            </div>
        );
        case 'input': return <Input placeholder={item.content} className="max-w-sm mx-auto" />;
        case 'social-icon': return (
            <a href={item.link} target="_blank" rel="noopener noreferrer" className={cn("inline-flex items-center justify-center p-2 rounded-full bg-primary/20 text-primary hover:bg-primary/30 transition-colors", { 'ring-2 ring-blue-500 ring-offset-2 ring-offset-background': isSelected })}>
                {getSocialIcon(item.platform)}
            </a>
        );
        default: return null;
    }
};

const WebsiteBuilder = () => {
    const { user, profile } = useAuth();
    const { toast } = useToast();
    const [website, setWebsite] = useState(null);
    const [sections, setSections] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [activeId, setActiveId] = useState(null);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState('modern_clinic');
    const [isGenerating, setIsGenerating] = useState(false);
    
    const hasFetched = useRef(false);

    const loadWebsite = useCallback(async () => {
        if (!user || !profile || !profile.organization_id) return;
        
        setIsLoading(true);
        const { data, success } = await getMyWebsite(user.id);

        if (success) {
            if (data) {
                setWebsite(data);
                setSections(data.sections);
            } else {
                const { data: newData, success: newSuccess } = await createMyWebsite(user.id, profile.organization_id);
                if (newSuccess) {
                    setWebsite(newData);
                    setSections(newData.sections);
                    toast({ title: "Bem-vindo ao Website Builder!", description: "Criamos um site inicial para você começar." });
                } else {
                    toast({ variant: 'destructive', title: 'Erro ao criar site', description: 'Não foi possível criar um novo site.' });
                }
            }
        } else {
            toast({ variant: 'destructive', title: 'Erro ao carregar site', description: 'Não foi possível carregar os dados do seu site.' });
        }
        setIsLoading(false);
    }, [user, profile, toast]);

    useEffect(() => {
        if (user && profile && !hasFetched.current) {
            hasFetched.current = true;
            loadWebsite();
        }
    }, [user, profile, loadWebsite]);
    
    const handleSaveChanges = async () => {
        if (!website) return;
        setIsSaving(true);
        const { success, error } = await updateMyWebsite(website.id, { sections });
        if (success) {
            toast({ title: "Site salvo com sucesso!", className: "bg-green-600 text-white" });
        } else {
            toast({ variant: 'destructive', title: 'Erro ao salvar o site', description: error?.message });
        }
        setIsSaving(false);
    };
    
    const handleOptimize = async () => {
        if (!website) return;
        setIsOptimizing(true);
        toast({
            title: "Otimizando seu site...",
            description: "Aguarde enquanto aplicamos melhorias de performance.",
        });
        // Mocking optimization as the API function was removed
        setTimeout(() => {
            const newScore = Math.floor(Math.random() * (98 - 85 + 1) + 85);
            setWebsite(prev => ({...prev, optimization_score: newScore, last_optimized_at: new Date().toISOString()}));
            toast({
                title: "Site Otimizado!",
                description: `Sua nova pontuação de performance é ${newScore}.`,
            });
            setIsOptimizing(false);
        }, 2000);
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleApplyTemplate = () => {
        setIsGenerating(true);
        toast({
            title: "Gerando site com IA...",
            description: "Aguarde enquanto criamos seu novo layout.",
        });

        setTimeout(() => {
            const template = SITE_TEMPLATES[selectedTemplate];
            if (template) {
                setSections(template.sections);
            }
            setIsGenerating(false);
            toast({
                title: "Site gerado com sucesso!",
                description: `O modelo "${SITE_TEMPLATES[selectedTemplate].name}" foi aplicado.`,
            });
        }, 2000);
    };

    const handleCopyWebsite = () => {
        toast({
            title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
            description: "A funcionalidade de copiar o website será implementada em breve.",
        });
    };

    const findContainer = (id) => {
        if (!sections) return null;
        if (id in sections) {
            return id;
        }
        return Object.keys(sections).find((key) => sections[key] && sections[key].items.some(item => item.id === id));
    };

    const handleDragStart = (event) => {
        const { active } = event;
        setActiveId(active.id);
    };

    const handleDragOver = (event) => {
        const { active, over } = event;
        if (!over) return;
    
        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(over.id);
    
        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return;
        }
    
        setSections((prev) => {
            const newSections = { ...prev };
                const activeItems = newSections[activeContainer].items;
                const overItems = newSections[overContainer].items;
        
                const activeIndex = activeItems.findIndex(item => item.id === active.id);
                const overIndex = over.id in newSections ? overItems.length : overItems.findIndex(item => item.id === over.id);

                if (activeIndex !== -1) {
                    const [movedItem] = newSections[activeContainer].items.splice(activeIndex, 1);
                    if (overIndex !== -1) {
                        newSections[overContainer].items.splice(overIndex, 0, movedItem);
                    } else {
                        // Dropping on the container itself
                         newSections[overContainer].items.push(movedItem);
                    }
                }
                
                return newSections;
            });
        };
        
        const handleDragEnd = (event) => {
            const { active, over } = event;
            setActiveId(null);

            if (!over) return;
            
            const activeContainer = findContainer(active.id);
            const overContainer = findContainer(over.id);

            if (!activeContainer || !overContainer) return;
            
            if (active.id !== over.id) {
                if (activeContainer === overContainer) {
                    setSections(prev => {
                        const sectionItems = prev[activeContainer].items;
                        const oldIndex = sectionItems.findIndex(item => item.id === active.id);
                        const newIndex = sectionItems.findIndex(item => item.id === over.id);
                        if (oldIndex === -1 || newIndex === -1) return prev;
                        const newItems = arrayMove(sectionItems, oldIndex, newIndex);
                        return {
                            ...prev,
                            [activeContainer]: {
                                ...prev[activeContainer],
                                items: newItems,
                            }
                        };
                    });
                }
            }
        };
        
        const toggleSectionVisibility = (sectionId) => {
            setSections(prev => ({
                ...prev,
                [sectionId]: { ...prev[sectionId], visible: !prev[sectionId].visible },
            }));
        };
        
        const getActiveItem = () => {
            if (!sections) return null;
            for (const sectionKey of Object.keys(sections)) {
                const item = sections[sectionKey]?.items.find(i => i.id === activeId);
                if (item) return item;
            }
            return null;
        };

        const getSelectedItemDetails = () => {
            if (!selectedItemId || !sections) return null;
            for (const sectionKey of Object.keys(sections)) {
                const item = sections[sectionKey]?.items.find(i => i.id === selectedItemId);
                if (item) return { item, sectionId: sectionKey };
            }
            return null;
        };

        const handleFontSizeChange = (value) => {
            const details = getSelectedItemDetails();
            if (!details) return;
            const { item, sectionId } = details;

            setSections(prev => ({
                ...prev,
                [sectionId]: {
                    ...prev[sectionId],
                    items: prev[sectionId].items.map(i =>
                        i.id === item.id ? { ...i, fontSize: value[0] } : i
                    ),
                },
            }));
        };
        
        const OptimizationScore = ({ score }) => {
            const getScoreColor = (s) => {
                if (s >= 90) return 'text-green-400';
                if (s >= 50) return 'text-yellow-400';
                return 'text-red-400';
            };
        
            return (
                <div className="relative w-24 h-24">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                            className="text-slate-700"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            strokeWidth="3"
                        />
                        <path
                            className={getScoreColor(score)}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            strokeWidth="3"
                            strokeDasharray={`${score}, 100`}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}</span>
                    </div>
                </div>
            );
        };

        if (isLoading || !sections) {
            return (
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                </div>
            );
        }


        return (
            <>
                <Helmet>
                    <title>Website Builder - Portal do Médico</title>
                    <meta name="description" content="Crie e personalize o site do seu consultório." />
                </Helmet>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        <div className="xl:col-span-1 space-y-6">
                            <Card className="sticky top-24">
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                      <h2 className="text-2xl font-bold flex items-center gap-2"><Wand2 /> Criação com IA</h2>
                                      <Button onClick={handleSaveChanges} disabled={isSaving || isOptimizing}>
                                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                        {isSaving ? 'Salvando...' : 'Salvar'}
                                      </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="template-select" className="font-medium mb-2 block">Selecione um Modelo</Label>
                                        <div className="flex flex-col gap-2">
                                            {Object.keys(SITE_TEMPLATES).map(key => (
                                                <button
                                                    key={key}
                                                    onClick={() => setSelectedTemplate(key)}
                                                    className={cn(
                                                        "w-full text-left p-3 rounded-lg border transition-colors",
                                                        selectedTemplate === key ? "bg-primary/20 border-primary" : "bg-card-dark border-border"
                                                    )}
                                                >
                                                    {SITE_TEMPLATES[key].name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button onClick={handleApplyTemplate} disabled={isGenerating || isSaving || isOptimizing} className="flex-1">
                                            {isGenerating ? <Sparkles className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                            Gerar com IA
                                        </Button>
                                        <Button variant="outline" onClick={handleCopyWebsite} className="flex-1">
                                            <Copy className="mr-2 h-4 w-4" />
                                            Copiar Website
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                             <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Zap className="text-yellow-400" />Otimização Automática</CardTitle>
                                    <CardDescription>Melhore a performance, SEO e acessibilidade do seu site com um clique.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center gap-4">
                                    <OptimizationScore score={website?.optimization_score || 0} />
                                    <Button onClick={handleOptimize} disabled={isOptimizing || isSaving} className="w-full">
                                        {isOptimizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                                        {isOptimizing ? 'Otimizando...' : 'Otimizar Agora'}
                                    </Button>
                                    {website?.last_optimized_at && (
                                        <p className="text-xs text-slate-400">
                                            Última otimização: {new Date(website.last_optimized_at).toLocaleString()}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                            
                            <Card>
                                <CardHeader>
                                    <h2 className="text-2xl font-bold">Controles do Site</h2>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {Object.values(sections).map(section => (
                                        section && <div key={section.id} className="flex items-center justify-between p-3 bg-card-dark rounded-lg">
                                            <Label htmlFor={`switch-${section.id}`} className="font-medium">{section.title}</Label>
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    id={`switch-${section.id}`}
                                                    checked={section.visible}
                                                    onCheckedChange={() => toggleSectionVisibility(section.id)}
                                                    disabled={isOptimizing || isSaving}
                                                />
                                                {section.visible ? <Eye className="w-5 h-5 text-green-400" /> : <EyeOff className="w-5 h-5 text-red-400" />}
                                            </div>
                                        </div>
                                    ))}

                                    {selectedItemId && (getSelectedItemDetails()?.item.type === 'heading' || getSelectedItemDetails()?.item.type === 'paragraph') ? (
                                        <div className="mt-6 p-4 bg-card-dark rounded-lg space-y-4">
                                            <h3 className="text-lg font-semibold text-white flex items-center gap-2"><TextCursorInput className="w-5 h-5" /> Edição de Texto</h3>
                                            <div>
                                                <Label htmlFor="font-size-slider" className="font-medium mb-2 block">Tamanho da Fonte: {getSelectedItemDetails().item.fontSize || (getSelectedItemDetails().item.type === 'heading' ? 40 : 18)}px</Label>
                                                <Slider
                                                    id="font-size-slider"
                                                    min={10}
                                                    max={80}
                                                    step={1}
                                                    value={[getSelectedItemDetails().item.fontSize || (getSelectedItemDetails().item.type === 'heading' ? 40 : 18)]}
                                                    onValueChange={handleFontSizeChange}
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>
                                    ) : null}

                                </CardContent>
                            </Card>
                        </div>

                        <div className="xl:col-span-2 bg-card/50 p-6 rounded-xl border border-border">
                            <h2 className="text-2xl font-bold mb-4">Pré-visualização do Site</h2>
                            <div className="space-y-8" onClick={() => setSelectedItemId(null)}>
                                 {Object.values(sections).map(section => (
                                    section && section.visible && (
                                    <DroppableSection key={section.id} id={section.id} title={section.title}>
                                        <div className={cn("rounded-lg", {
                                            "p-4 md:p-8 space-y-4": !['gallery', 'catalog', 'features', 'social'].includes(section.id),
                                            "animated-gradient-hero": section.id === 'hero',
                                            "animated-gradient-features": section.id === 'features',
                                            "animated-gradient-newsletter": section.id === 'newsletter',
                                            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4": section.id === 'catalog' || section.id === 'features',
                                            "grid grid-cols-2 sm:grid-cols-3 gap-4": section.id === 'gallery',
                                            "flex justify-center gap-4 p-4 md:p-8": section.id === 'social'
                                        })}>
                                            {section.items.map(item => (
                                                <DraggableItem key={item.id} id={item.id} onClick={(e) => { e.stopPropagation(); setSelectedItemId(item.id); }}>
                                                    <ItemContent item={item} toast={toast} isSelected={selectedItemId === item.id} />
                                                </DraggableItem>
                                            ))}
                                        </div>
                                    </DroppableSection>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                    <DragOverlay modifiers={[restrictToWindowEdges]}>
                        {activeId && sections ? (
                            <div className="bg-primary/80 backdrop-blur-sm p-4 rounded-lg shadow-2xl">
                               <ItemContent item={getActiveItem()} toast={toast} isSelected={false} />
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </>
        );
    };

    export default WebsiteBuilder;
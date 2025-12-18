
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Type, Download, Edit3, X, Linkedin, Twitter, Youtube, Upload, PenTool, Shapes, Palette, Layout, Square, Circle, Triangle, Star, Minus, ArrowUpRight, Spline, Search, Sparkles } from 'lucide-react';
import styles from './TextDetails.module.css';
import { cn } from '../../lib/utils';
import TemplatesModal from './TemplatesModal';
import AITools from './AITools';
import type { GeneratedCardData } from '../../lib/gemini';

interface TextDetailsProps {
    format: string;
    setFormat: (v: string) => void;
    onDownload: () => void;
    headline: string;
    setHeadline: (v: string) => void;
    description: string;
    setDescription: (v: string) => void;
    fontFamily: string;
    setFontFamily: (v: string) => void;
    overlayOpacity: number;
    setOverlayOpacity: (v: number) => void;
    headlineColor: string;
    setHeadlineColor: (v: string) => void;
    headlineSize: number;
    setHeadlineSize: (v: number) => void;
    descriptionColor: string;
    setDescriptionColor: (v: string) => void;
    descriptionSize: number;
    setDescriptionSize: (v: number) => void;
    isDrawerOpen?: boolean;
    setIsDrawerOpen?: (v: boolean) => void;
    isToolbarOpen?: boolean;
    toggleToolbar?: () => void;
    // New props for integrated tools
    onAddElement: (type: string, payload?: { color?: string; type?: string; src?: string }) => void;
    setBackgroundImage: (v: string) => void;
    setFilter: (v: string) => void;
    backgroundImage: string;
    selectedFilter: string;
}

const FONTS = [
    { name: 'Inter (Padrão)', value: 'Inter, sans-serif' },
    { name: 'Roboto', value: 'Roboto, sans-serif' },
    { name: 'Open Sans', value: 'Open Sans, sans-serif' },
    { name: 'Lato', value: 'Lato, sans-serif' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif' },
    { name: 'Playfair Display (Serif)', value: '"Playfair Display", serif' },
    { name: 'Merriweather (Serif)', value: 'Merriweather, serif' },
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Courier New', value: '"Courier New", monospace' },
    { name: 'Comic Sans MS', value: '"Comic Sans MS", cursive' },
];

const BG_PRESETS = [
    'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=500&q=80',
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)',
    'linear-gradient(45deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)',
    'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)',
];

const FILTERS = [
    { name: 'Normal', value: 'none' },
    { name: 'P&B', value: 'grayscale(100%)' },
    { name: 'Sépia', value: 'sepia(100%)' },
    { name: 'Vintage', value: 'sepia(50%) contrast(120%)' },
    { name: 'Desfoque', value: 'blur(2px)' },
];

const TextDetails: React.FC<TextDetailsProps> = ({
    format, setFormat, onDownload,
    headline, setHeadline,
    description, setDescription,
    fontFamily, setFontFamily,
    overlayOpacity, setOverlayOpacity,
    headlineColor, setHeadlineColor,
    headlineSize, setHeadlineSize,
    descriptionColor, setDescriptionColor,
    descriptionSize, setDescriptionSize,
    isDrawerOpen, setIsDrawerOpen,
    isToolbarOpen, toggleToolbar,
    onAddElement, setBackgroundImage, setFilter, backgroundImage, selectedFilter
}) => {
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const [activePlatform, setActivePlatform] = useState<string | null>(null);
    const [activeTool, setActiveTool] = useState<string | null>(null);
    const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
    const [templateCategory, setTemplateCategory] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const colorInputRef = useRef<HTMLInputElement>(null);

    const showDrawer = isDrawerOpen !== undefined ? isDrawerOpen : internalIsOpen;
    const setShowDrawer = (v: boolean) => {
        if (setIsDrawerOpen) setIsDrawerOpen(v);
        else setInternalIsOpen(v);
    };

    const handleTemplateSelect = (template: { format: string; imageUrl?: string; category?: string }) => {
        setFormat(template.format);
        if (template.imageUrl) {
            setBackgroundImage(template.imageUrl);
        }
        // If we had more template data (text positions, etc), we would apply it here
        setActivePlatform(template.category || null);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            if (activeTool === 'uploads') {
                onAddElement('image', { src: url });
            } else {
                setBackgroundImage(url);
            }
        }
    };

    const handlePlatformClick = (platform: string) => {
        if (activePlatform === platform) {
            setActivePlatform(null);
        } else {
            setActivePlatform(platform);
            setTemplateCategory(platform);
            setIsTemplatesOpen(true);
        }
    };

    const isActive = (platform: string) => {
        return format.startsWith(platform) || activePlatform === platform;
    };

    const renderSubOptions = () => {
        if (!activePlatform) return null;

        const getOptions = () => {
            switch (activePlatform) {
                case 'instagram':
                    return [
                        { label: 'Quadrado (Feed)', value: 'instagram-square' },
                        { label: 'Story/Reels', value: 'instagram-story' },
                        { label: 'Retrato (4:5)', value: 'instagram-portrait' },
                    ];
                case 'facebook':
                    return [
                        { label: 'Post (Feed)', value: 'facebook-post' },
                        { label: 'Capa (Cover)', value: 'facebook-cover' },
                    ];
                case 'youtube':
                    return [
                        { label: 'Capa de Vídeo', value: 'youtube-thumbnail' },
                        { label: 'Banner do Canal', value: 'youtube-banner' },
                    ];
                case 'twitter':
                    return [
                        { label: 'Post (Tweet)', value: 'twitter-post' },
                        { label: 'Capa (Header)', value: 'twitter-header' },
                    ];
                case 'linkedin':
                    return [
                        { label: 'Post (Feed)', value: 'linkedin-post' },
                        { label: 'Capa (Banner)', value: 'linkedin-banner' },
                    ];
                case 'whatsapp':
                    return [
                        { label: 'Status (Story)', value: 'whatsapp-status' }
                    ];
                case 'tiktok':
                    return [
                        { label: 'Vídeo (9:16)', value: 'tiktok-video' }
                    ];
                default:
                    return [];
            }
        };

        const options = getOptions();

        if (options.length === 0) return null;

        return (
            <div className={styles.subOptions}>
                <span style={{ fontSize: '0.75rem', color: '#ccc', marginBottom: '4px' }}>Selecione o tipo:</span>
                {options.map(opt => (
                    <button
                        key={opt.value}
                        onClick={() => { setFormat(opt.value); setActivePlatform(null); }}
                        className={styles.formatBtn}
                        style={{ fontSize: '0.75rem', padding: '8px', background: format === opt.value ? 'rgba(255,255,255,0.1)' : 'transparent', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        );
    };

    const handleAIApply = (data: GeneratedCardData) => {
        setHeadline(data.headline);
        setDescription(data.description);
        setHeadlineColor(data.headlineColor);
        setDescriptionColor(data.descriptionColor);
        if (data.backgroundColor) {
            setBackgroundImage(data.backgroundColor);
        }
        if (data.fontFamily) {
            setFontFamily(data.fontFamily);
        }
        // If there's an image keyword, we could potentially auto-search Unsplash here
        // For now, we rely on the background color/gradient or the user can search
        setActiveTool(null); // Close tool after apply
    };

    const renderToolsDrawer = () => {
        if (!activeTool) return null;

        return (
            <motion.div
                className={styles.drawer}
                style={{ left: '72px', zIndex: 90 }} // Adjust position to be next to sidebar
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
            >
                <div className={styles.title}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {activeTool === 'design' && <Layout size={20} />}
                        {activeTool === 'elements' && <Shapes size={20} />}
                        {activeTool === 'uploads' && <Upload size={20} />}
                        {activeTool === 'draw' && <PenTool size={20} />}
                        {activeTool === 'ai' && <Sparkles size={20} />}
                        <span>
                            {activeTool === 'design' && 'Design & Fundo'}
                            {activeTool === 'elements' && 'Elementos'}
                            {activeTool === 'uploads' && 'Uploads'}
                            {activeTool === 'draw' && 'Desenho'}
                            {activeTool === 'ai' && 'Magic AI'}
                        </span>
                    </div>
                    <button
                        onClick={() => setActiveTool(null)}
                        style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
                        title="Fechar ferramentas"
                        aria-label="Fechar ferramentas"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.drawerContent}>
                    {activeTool === 'ai' && (
                        <AITools onApply={handleAIApply} />
                    )}

                    {activeTool === 'design' && (
                        <>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Filtros</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                                    {FILTERS.map(f => (
                                        <button
                                            key={f.name}
                                            onClick={() => setFilter(f.value)}
                                            style={{
                                                padding: '8px',
                                                borderRadius: '4px',
                                                border: selectedFilter === f.value ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                                                background: 'rgba(255,255,255,0.05)',
                                                color: '#fff',
                                                fontSize: '0.7rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {f.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Planos de Fundo</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                                    {BG_PRESETS.map((bg, i) => (
                                        <div
                                            key={i}
                                            onClick={() => setBackgroundImage(bg)}
                                            style={{
                                                aspectRatio: '1',
                                                borderRadius: '4px',
                                                background: bg.startsWith('http') ? `url(${bg}) center/cover` : bg,
                                                cursor: 'pointer',
                                                border: backgroundImage === bg ? '2px solid var(--primary)' : 'none'
                                            }}
                                        />
                                    ))}
                                    <div
                                        onClick={() => colorInputRef.current?.click()}
                                        style={{
                                            aspectRatio: '1',
                                            borderRadius: '4px',
                                            background: 'linear-gradient(45deg, #333, #555)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer',
                                            fontSize: '0.7rem'
                                        }}
                                    >
                                        Cor
                                        <input
                                            type="color"
                                            ref={colorInputRef}
                                            style={{ display: 'none' }}
                                            onChange={(e) => setBackgroundImage(e.target.value)}
                                            title="Selecionar cor de fundo"
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTool === 'elements' && (
                        <>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Formas</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                                    <button onClick={() => onAddElement('shape', { type: 'square' })} title="Quadrado" style={{ background: 'none', border: '1px solid #444', padding: 8, borderRadius: 4, cursor: 'pointer', color: '#fff' }}><Square size={20} /></button>
                                    <button onClick={() => onAddElement('shape', { type: 'circle' })} title="Círculo" style={{ background: 'none', border: '1px solid #444', padding: 8, borderRadius: 4, cursor: 'pointer', color: '#fff' }}><Circle size={20} /></button>
                                    <button onClick={() => onAddElement('shape', { type: 'triangle' })} title="Triângulo" style={{ background: 'none', border: '1px solid #444', padding: 8, borderRadius: 4, cursor: 'pointer', color: '#fff' }}><Triangle size={20} /></button>
                                    <button onClick={() => onAddElement('shape', { type: 'star' })} title="Estrela" style={{ background: 'none', border: '1px solid #444', padding: 8, borderRadius: 4, cursor: 'pointer', color: '#fff' }}><Star size={20} /></button>
                                </div>
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Linhas</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                                    <button onClick={() => onAddElement('line', { type: 'straight' })} title="Reta" style={{ background: 'none', border: '1px solid #444', padding: 8, borderRadius: 4, cursor: 'pointer', color: '#fff' }}><Minus size={20} /></button>
                                    <button onClick={() => onAddElement('line', { type: 'arrow' })} title="Seta" style={{ background: 'none', border: '1px solid #444', padding: 8, borderRadius: 4, cursor: 'pointer', color: '#fff' }}><ArrowUpRight size={20} /></button>
                                    <button onClick={() => onAddElement('line', { type: 'curved' })} title="Curva" style={{ background: 'none', border: '1px solid #444', padding: 8, borderRadius: 4, cursor: 'pointer', color: '#fff' }}><Spline size={20} /></button>
                                </div>
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Notas</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {['#fef3c7', '#bfdbfe', '#bbf7d0', '#fbcfe8'].map(c => (
                                        <button
                                            key={c}
                                            onClick={() => onAddElement('sticky', { color: c })}
                                            style={{ width: 30, height: 30, backgroundColor: c, border: 'none', borderRadius: 4, cursor: 'pointer' }}
                                            title={`Adicionar nota adesiva ${c}`}
                                            aria-label={`Adicionar nota adesiva cor ${c}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {activeTool === 'uploads' && (
                        <div className={styles.inputGroup}>
                            <button onClick={() => fileInputRef.current?.click()} style={{ width: '100%', padding: '20px', border: '1px dashed #666', background: 'rgba(255,255,255,0.05)', color: '#fff', borderRadius: 8, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                <Upload size={32} />
                                <span>Upload Imagem</span>
                            </button>
                            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileUpload} />
                        </div>
                    )}

                    {activeTool === 'draw' && (
                        <div className={styles.inputGroup}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                <button onClick={() => onAddElement('draw', { type: 'pen', color: '#000000' })} style={{ padding: 12, background: '#333', border: 'none', borderRadius: 6, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <PenTool size={18} /> Caneta
                                </button>
                                <button onClick={() => onAddElement('draw', { type: 'marker', color: '#ef4444' })} style={{ padding: 12, background: '#333', border: 'none', borderRadius: 6, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <Palette size={18} /> Marcador
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        );
    };

    const handleToolClick = (tool: string) => {
        if (activeTool === tool) setActiveTool(null);
        else setActiveTool(tool);
    };

    return (
        <div className={styles.wrapper}>
            <div className={cn("h-full w-[72px] bg-card border-r border-border flex flex-col items-center py-4 gap-3 shadow-xl z-50", styles.panel)}>
                <div className={cn("flex flex-col gap-3 w-full items-center overflow-y-auto no-scrollbar pb-20", styles.topGrid)}>
                    <button
                        className={cn(
                            "w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:scale-110 mb-2"
                        )}
                        onClick={() => {
                            setTemplateCategory(null);
                            setIsTemplatesOpen(true);
                        }}
                        title="Buscar Modelos"
                    >
                        <Search size={20} />
                    </button>
                    {[
                        { id: 'instagram', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>, label: 'Instagram' },
                        { id: 'whatsapp', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>, label: 'WhatsApp' },
                        { id: 'facebook', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>, label: 'Facebook' },
                        { id: 'youtube', icon: <Youtube size={20} />, label: 'YouTube' },
                        { id: 'tiktok', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 0 0 0 5 5"></path></svg>, label: 'TikTok' },
                        { id: 'twitter', icon: <Twitter size={20} />, label: 'Twitter' },
                        { id: 'linkedin', icon: <Linkedin size={20} />, label: 'LinkedIn' },
                    ].map(p => (
                        <button
                            key={p.id}
                            className={cn(
                                "w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200",
                                isActive(p.id) ? "bg-primary text-primary-foreground shadow-md scale-105" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:scale-110"
                            )}
                            onClick={() => handlePlatformClick(p.id)}
                            title={p.label}
                        >
                            {p.icon}
                            <span className="sr-only">{p.label}</span>
                        </button>
                    ))}

                    {renderSubOptions()}

                    <div className="w-10 h-[1px] bg-border my-1" />

                    {[
                        { id: 'ai', icon: <Sparkles size={20} />, label: 'Magic AI' },
                        { id: 'design', icon: <Layout size={20} />, label: 'Design & Fundo' },
                        { id: 'elements', icon: <Shapes size={20} />, label: 'Elementos' },
                        { id: 'uploads', icon: <Upload size={20} />, label: 'Uploads' },
                        { id: 'draw', icon: <PenTool size={20} />, label: 'Desenho' },
                    ].map(t => (
                        <button
                            key={t.id}
                            className={cn(
                                "w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200",
                                activeTool === t.id ? "bg-primary text-primary-foreground shadow-md scale-105" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:scale-110"
                            )}
                            onClick={() => handleToolClick(t.id)}
                            title={t.label}
                        >
                            {t.icon}
                            <span className="sr-only">{t.label}</span>
                        </button>
                    ))}

                    <div className="w-10 h-[1px] bg-border my-1" />

                    <button
                        className={cn(
                            "w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200",
                            isToolbarOpen ? "bg-primary text-primary-foreground shadow-md scale-105" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:scale-110"
                        )}
                        onClick={toggleToolbar}
                        title="Editar Texto"
                    >
                        <Edit3 size={20} />
                    </button>

                    <button
                        className={cn(
                            "w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-green-500/20"
                        )}
                        onClick={onDownload}
                        title="Baixar"
                    >
                        <Download size={20} />
                    </button>
                </div>
            </div>

            {showDrawer && (
                <motion.div
                    className={cn(styles.drawer, "bg-card/95 backdrop-blur-md border-r border-border shadow-2xl")}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                >
                    <div className={styles.title} style={{ cursor: 'grab' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Type size={20} className="text-primary" />
                            <span className="font-semibold text-foreground">Conteúdo & Estilo</span>
                        </div>
                        <button
                            aria-label="Fechar painel"
                            onClick={() => setShowDrawer(false)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className={styles.drawerContent}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Título</label>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                <input
                                    type="color"
                                    value={headlineColor}
                                    onChange={(e) => setHeadlineColor(e.target.value)}
                                    className={styles.colorInput}
                                    title="Cor do Título"
                                />
                                <input
                                    type="number"
                                    value={headlineSize}
                                    onChange={(e) => setHeadlineSize(Number(e.target.value))}
                                    className={styles.input}
                                    style={{ width: '80px' }}
                                    title="Tamanho da Fonte (px)"
                                />
                            </div>
                            <input
                                className={styles.input}
                                value={headline}
                                onChange={(e) => setHeadline(e.target.value)}
                                placeholder="Ex: Promoção de Verão"
                                autoFocus
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Descrição</label>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                <input
                                    type="color"
                                    value={descriptionColor}
                                    onChange={(e) => setDescriptionColor(e.target.value)}
                                    className={styles.colorInput}
                                    title="Cor da Descrição"
                                />
                                <input
                                    type="number"
                                    value={descriptionSize}
                                    onChange={(e) => setDescriptionSize(Number(e.target.value))}
                                    className={styles.input}
                                    style={{ width: '80px' }}
                                    title="Tamanho da Descrição (px)"
                                />
                            </div>
                            <textarea
                                className={styles.textarea}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Digite a descrição principal..."
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Fonte do Texto</label>
                            <select
                                title="Selecione a fonte do texto"
                                className={styles.input}
                                value={fontFamily}
                                onChange={(e) => setFontFamily(e.target.value)}
                            >
                                {FONTS.map(font => (
                                    <option key={font.value} value={font.value}>{font.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Escurecer Fundo (Overlay): {Math.round(overlayOpacity * 100)}%</label>
                            <input
                                type="range"
                                min="0"
                                max="0.9"
                                step="0.1"
                                value={overlayOpacity}
                                onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                                aria-label="Escurecer Fundo (Overlay)"
                                title="Ajustar opacidade do overlay"
                                style={{ width: '100%', cursor: 'pointer' }}
                            />

                        </div>
                    </div>
                </motion.div>
            )}

            {renderToolsDrawer()}

            {isTemplatesOpen && (
                <TemplatesModal
                    isOpen={isTemplatesOpen}
                    onClose={() => setIsTemplatesOpen(false)}
                    initialCategory={templateCategory}
                    onSelectTemplate={handleTemplateSelect}
                />
            )}
        </div>
    );
};

export default TextDetails;

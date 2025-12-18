import React, { useState, useRef } from 'react';
import { Layout, Type, Upload, PenTool, Shapes, Search, ChevronRight, Square, Circle, Triangle, Hexagon, Star, Minus, ArrowUpRight, Spline, Palette } from 'lucide-react';
import styles from './EditorSidebar.module.css';

interface EditorSidebarProps {
    selectedFilter: string;
    setFilter: (v: string) => void;
    backgroundImage: string;
    setBackgroundImage: (v: string) => void;
    onAddElement: (type: string, payload?: { color?: string; type?: string; src?: string }) => void;
}

const TABS = [
    { id: 'design', icon: Layout, label: 'Design' },
    { id: 'elements', icon: Shapes, label: 'Elementos' },
    { id: 'text', icon: Type, label: 'Texto' },
    { id: 'uploads', icon: Upload, label: 'Uploads' },
    { id: 'draw', icon: PenTool, label: 'Desenho' },
];

const FILTERS = [
    { name: 'Normal', value: 'none' },
    { name: 'P&B', value: 'grayscale(100%)' },
    { name: 'Sépia', value: 'sepia(100%)' },
    { name: 'Vintage', value: 'sepia(50%) contrast(120%)' },
    { name: 'Desfoque', value: 'blur(2px)' },
    { name: 'Saturado', value: 'saturate(200%)' },
    { name: 'Frio', value: 'hue-rotate(180deg)' },
    { name: 'Invertido', value: 'invert(100%)' },
    { name: 'Brilhante', value: 'brightness(150%)' },
    { name: 'Escuro', value: 'brightness(50%)' },
    { name: 'Quente', value: 'sepia(30%) saturate(140%)' },
    { name: 'Contraste', value: 'contrast(200%)' },
    { name: 'Fade', value: 'opacity(50%)' },
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

const EditorSidebar: React.FC<EditorSidebarProps> = ({
    selectedFilter, setFilter,
    backgroundImage, setBackgroundImage,
    onAddElement
}) => {
    const [activeTab, setActiveTab] = useState<string | null>('design');
    const [searchTerm, setSearchTerm] = useState('');
    const colorInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleTabClick = (tabId: string) => {
        if (activeTab === tabId) {
            setActiveTab(null); // Toggle close
        } else {
            setActiveTab(tabId);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            // Check if active tab is uploads, then add as element, else bg
            if (activeTab === 'uploads') {
                onAddElement('image', { src: url });
            } else {
                setBackgroundImage(url);
            }
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'design':
                return (
                    <>
                        <h3 className={styles.sectionTitle}>Filtros</h3>
                        <div className={styles.grid3}>
                            {FILTERS.map(f => (
                                <div
                                    key={f.name}
                                    className={`${styles.filterItem} ${selectedFilter === f.value ? styles.filterActive : ''}`}
                                    onClick={() => setFilter(f.value)}
                                >
                                    <div className={styles.filterPreview} style={{ filter: f.value }}>
                                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=60" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <span className={styles.filterName}>{f.name}</span>
                                </div>
                            ))}
                        </div>

                        <h3 className={styles.sectionTitle}>Planos de Fundo</h3>
                        <div className={styles.grid3}>
                            {BG_PRESETS.map((bg, i) => (
                                <div
                                    key={i}
                                    className={`${styles.preset} ${backgroundImage === bg ? styles.presetActive : ''}`}
                                    style={{ background: bg.startsWith('http') ? `url(${bg}) center/cover` : bg }}
                                    onClick={() => setBackgroundImage(bg)}
                                />
                            ))}
                            <div className={styles.moreBtn} onClick={() => colorInputRef.current?.click()}>
                                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(45deg, red, blue)' }} />
                                <span>Cor</span>
                                <input
                                    type="color"
                                    ref={colorInputRef}
                                    style={{ display: 'none' }}
                                    onChange={(e) => setBackgroundImage(e.target.value)}
                                    title="Escolher cor de fundo"
                                />
                            </div>
                        </div>
                    </>
                );

            case 'elements':
                return (
                    <>
                        <div className={styles.searchContainer}>
                            <Search className={styles.searchIcon} />
                            <input
                                className={styles.searchInput}
                                placeholder="Buscar formas, linhas..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <h3 className={styles.sectionTitle}>Formas</h3>
                        <div className={styles.grid4}>
                            <button className={styles.elementItem} onClick={() => onAddElement('shape', { type: 'square' })} title="Quadrado"><Square /></button>
                            <button className={styles.elementItem} onClick={() => onAddElement('shape', { type: 'circle' })} title="Círculo"><Circle /></button>
                            <button className={styles.elementItem} onClick={() => onAddElement('shape', { type: 'triangle' })} title="Triângulo"><Triangle /></button>
                            <button className={styles.elementItem} onClick={() => onAddElement('shape', { type: 'star' })} title="Estrela"><Star /></button>
                            <button className={styles.elementItem} onClick={() => onAddElement('shape', { type: 'hexagon' })} title="Hexágono"><Hexagon /></button>
                        </div>

                        <h3 className={styles.sectionTitle}>Linhas</h3>
                        <div className={styles.grid4}>
                            <button className={styles.elementItem} onClick={() => onAddElement('line', { type: 'straight' })} title="Reta"><Minus /></button>
                            <button className={styles.elementItem} onClick={() => onAddElement('line', { type: 'arrow' })} title="Seta"><ArrowUpRight /></button>
                            <button className={styles.elementItem} onClick={() => onAddElement('line', { type: 'curved' })} title="Curva"><Spline /></button>
                        </div>

                        <h3 className={styles.sectionTitle}>Notas</h3>
                        <div className={styles.grid4}>
                            {['#fef3c7', '#bfdbfe', '#bbf7d0', '#fbcfe8'].map(c => (
                                <button
                                    key={c}
                                    className={styles.elementItem}
                                    style={{ backgroundColor: c }}
                                    onClick={() => onAddElement('sticky', { color: c })}
                                    title="Nota adesiva"
                                />
                            ))}
                        </div>
                    </>
                );

            case 'text':
                return (
                    <>
                        <button className={styles.uploadBtn} onClick={() => onAddElement('text', { type: 'heading' })}>
                            <Type size={32} />
                            <span>Adicionar caixa de texto</span>
                        </button>

                        <h3 className={styles.sectionTitle}>Combinações</h3>
                        <div className={styles.textPreset} onClick={() => onAddElement('text', { type: 'heading' })}>
                            <div className={styles.headingLarge}>Adicionar um título</div>
                        </div>
                        <div className={styles.textPreset} onClick={() => onAddElement('text', { type: 'subheading' })}>
                            <div className={styles.headingMedium}>Adicionar subtítulo</div>
                        </div>
                        <div className={styles.textPreset} onClick={() => onAddElement('text', { type: 'body' })}>
                            <div className={styles.bodyText}>Adicionar um pouquinho de texto</div>
                        </div>
                    </>
                );

            case 'uploads':
                return (
                    <>
                        <div className={styles.uploadBtn} onClick={() => fileInputRef.current?.click()}>
                            <Upload size={32} />
                            <span>Fazer upload de arquivos</span>
                            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileUpload} />
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#a1a1aa', textAlign: 'center' }}>
                            Suas imagens aparecerão aqui.
                        </p>
                    </>
                );

            case 'draw':
                return (
                    <>
                        <h3 className={styles.sectionTitle}>Ferramentas de Desenho</h3>
                        <div className={styles.grid2}>
                            <button type="button" className={styles.elementItem} onClick={() => onAddElement('draw', { type: 'pen', color: '#000000' })}>
                                <PenTool />
                                <span className={styles.toolLabel}>Caneta</span>
                            </button>
                            <button type="button" className={styles.elementItem} onClick={() => onAddElement('draw', { type: 'marker', color: '#ef4444' })}>
                                <Palette />
                                <span className={styles.toolLabel}>Marcador</span>
                            </button>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#a1a1aa', marginTop: 16 }}>
                            Selecione uma ferramenta para adicionar um desenho livre ao canvas.
                        </p>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        className={`${styles.tabBtn} ${activeTab === tab.id ? styles.activeTab : ''}`}
                        onClick={() => handleTabClick(tab.id)}
                    >
                        <tab.icon size={24} />
                        <span className={styles.tabLabel}>{tab.label}</span>
                    </button>
                ))}
            </aside>

            <div className={`${styles.panel} ${!activeTab ? styles.panelClosed : ''}`}>
                <div className={styles.panelHeader}>
                    <h2 className={styles.panelTitle}>
                        {TABS.find(t => t.id === activeTab)?.label}
                    </h2>
                </div>
                <div className={styles.panelContent}>
                    {renderContent()}
                </div>
                <button
                    className={styles.closePanelBtn}
                    onClick={() => setActiveTab(null)}
                    title="Fechar painel"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default EditorSidebar;

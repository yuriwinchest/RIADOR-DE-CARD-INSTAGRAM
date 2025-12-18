
import React, { useState } from 'react';
import { Sparkles, Wand2, Instagram, Loader2, ArrowRight } from 'lucide-react';
import styles from './AITools.module.css';
import { generateCardContent, type GeneratedCardData } from '../../lib/gemini';

interface AIToolsProps {
    onApply: (data: GeneratedCardData) => void;
}

const AITools: React.FC<AIToolsProps> = ({ onApply }) => {
    const [activeTab, setActiveTab] = useState<'generate' | 'instagram'>('generate');
    const [prompt, setPrompt] = useState('');
    const [instagramUrl, setInstagramUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedData, setGeneratedData] = useState<GeneratedCardData | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setIsLoading(true);
        try {
            const data = await generateCardContent(prompt);
            setGeneratedData(data);
        } catch (error) {
            console.error(error);
            alert('Erro ao gerar conteúdo. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInstagramImport = async () => {
        if (!instagramUrl.trim()) return;
        
        // Simulation of extracting data from Instagram Modal/URL
        // In a real scenario, this would call a backend endpoint
        setIsLoading(true);
        
        // We use Gemini to interpret the intent based on the URL text or simulate it
        const simulatedPrompt = `Extract context from this Instagram URL/Caption and create a card: ${instagramUrl}`;
        
        try {
            const data = await generateCardContent(simulatedPrompt);
            setGeneratedData(data);
        } catch (error) {
            console.error(error);
            alert('Erro ao extrair dados. Verifique o link.');
        } finally {
            setIsLoading(false);
        }
    };

    const applyContent = () => {
        if (generatedData) {
            onApply(generatedData);
            setGeneratedData(null);
            setPrompt('');
            setInstagramUrl('');
        }
    };

    return (
        <div className={styles.container}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <button 
                    className={`${styles.secondaryButton}`} 
                    style={{ flex: 1, background: activeTab === 'generate' ? 'rgba(255,255,255,0.2)' : 'transparent' }}
                    onClick={() => setActiveTab('generate')}
                >
                    <Sparkles size={16} style={{ display: 'inline', marginRight: 4 }} />
                    Criar com AI
                </button>
                <button 
                    className={`${styles.secondaryButton}`} 
                    style={{ flex: 1, background: activeTab === 'instagram' ? 'rgba(255,255,255,0.2)' : 'transparent' }}
                    onClick={() => setActiveTab('instagram')}
                >
                    <Instagram size={16} style={{ display: 'inline', marginRight: 4 }} />
                    Instagram
                </button>
            </div>

            {activeTab === 'generate' ? (
                <div className={styles.section}>
                    <label className={styles.label}>O que você quer criar?</label>
                    <textarea
                        className={styles.textarea}
                        placeholder="Ex: Post de dia dos namorados para loja de perfumes, tons de rosa..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                    <button 
                        className={styles.button} 
                        onClick={handleGenerate}
                        disabled={isLoading || !prompt.trim()}
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Wand2 size={20} />}
                        Gerar Card Mágico
                    </button>
                </div>
            ) : (
                <div className={styles.section}>
                    <label className={styles.label}>Link ou Legenda do Instagram</label>
                    <input
                        className={styles.input}
                        placeholder="Cole o link ou texto do post..."
                        value={instagramUrl}
                        onChange={(e) => setInstagramUrl(e.target.value)}
                    />
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        O sistema irá identificar o conteúdo e gerar um template compatível.
                    </p>
                    <button 
                        className={styles.button} 
                        onClick={handleInstagramImport}
                        disabled={isLoading || !instagramUrl.trim()}
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Instagram size={20} />}
                        Extrair e Criar
                    </button>
                </div>
            )}

            {generatedData && (
                <div className={styles.resultCard}>
                    <div className={styles.resultHeader}>
                        <span className={styles.resultTitle}>Sugestão Gerada</span>
                        <button onClick={() => setGeneratedData(null)} style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer' }}>×</button>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                        <div style={{ fontWeight: 'bold' }}>{generatedData.headline}</div>
                        <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>{generatedData.description}</div>
                        <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                            <span style={{ width: 16, height: 16, borderRadius: '50%', background: generatedData.headlineColor, border: '1px solid #fff' }} title="Cor Título" />
                            <span style={{ width: 16, height: 16, borderRadius: '50%', background: generatedData.descriptionColor, border: '1px solid #fff' }} title="Cor Descrição" />
                            <span style={{ width: 16, height: 16, borderRadius: '50%', background: generatedData.backgroundColor, border: '1px solid #fff' }} title="Fundo" />
                        </div>
                    </div>
                    <button className={styles.button} style={{ width: '100%', fontSize: '0.9rem' }} onClick={applyContent}>
                        Aplicar ao Canvas <ArrowRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default AITools;

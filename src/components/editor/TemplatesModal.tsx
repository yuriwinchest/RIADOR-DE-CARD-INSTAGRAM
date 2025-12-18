import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import styles from './TemplatesModal.module.css';

interface Template {
    id: string;
    title: string;
    category: string;
    imageUrl: string;
    format: string; // instagram-square, instagram-story, etc.
}

// Mock Data
const MOCK_TEMPLATES: Template[] = [
    { id: '1', title: 'Promoção Moderno', category: 'instagram', format: 'instagram-square', imageUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=500&q=80' },
    { id: '2', title: 'Story Vibrante', category: 'instagram', format: 'instagram-story', imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=500&q=80' },
    { id: '3', title: 'Post Minimalista', category: 'instagram', format: 'instagram-portrait', imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=500&q=80' },
    { id: '4', title: 'Capa Youtube Tech', category: 'youtube', format: 'youtube-thumbnail', imageUrl: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=500&q=80' },
    { id: '5', title: 'Banner LinkedIn', category: 'linkedin', format: 'linkedin-banner', imageUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=500&q=80' },
    { id: '6', title: 'Status WhatsApp', category: 'whatsapp', format: 'whatsapp-status', imageUrl: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=500&q=80' },
    { id: '7', title: 'Post Facebook', category: 'facebook', format: 'facebook-post', imageUrl: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?auto=format&fit=crop&w=500&q=80' },
    { id: '8', title: 'Capa Twitter', category: 'twitter', format: 'twitter-header', imageUrl: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=500&q=80' },
    { id: '9', title: 'TikTok Viral', category: 'tiktok', format: 'tiktok-video', imageUrl: 'https://images.unsplash.com/photo-1611605698383-ee989149bfbd?auto=format&fit=crop&w=500&q=80' },
    { id: '10', title: 'Venda Relâmpago', category: 'instagram', format: 'instagram-square', imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=500&q=80' },
];

interface TemplatesModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialCategory?: string | null;
    onSelectTemplate: (template: Template) => void;
}

const TemplatesModal: React.FC<TemplatesModalProps> = ({ isOpen, onClose, initialCategory, onSelectTemplate }) => {
    const [searchTerm, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null);

    if (!isOpen) return null;

    const filteredTemplates = MOCK_TEMPLATES.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.category.includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? t.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    const categories = Array.from(new Set(MOCK_TEMPLATES.map(t => t.category)));

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Galeria de Modelos</h2>
                    <button onClick={onClose} className={styles.closeBtn}>
                        <X size={24} />
                    </button>
                </div>

                <div className={styles.content}>
                    <div className={styles.searchSection}>
                        <Search className={styles.searchIcon} size={20} />
                        <input
                            type="text"
                            placeholder="Busque por modelos (ex: instagram, tech, promoção)..."
                            className={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                        <div className={styles.tags}>
                            <button
                                className={`${styles.tag} ${!selectedCategory ? styles.active : ''}`}
                                onClick={() => setSelectedCategory(null)}
                            >
                                Todos
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    className={`${styles.tag} ${selectedCategory === cat ? styles.active : ''}`}
                                    onClick={() => setSelectedCategory(cat)}
                                    style={{ textTransform: 'capitalize' }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.grid}>
                        {filteredTemplates.map(template => (
                            <div
                                key={template.id}
                                className={styles.card}
                                onClick={() => {
                                    onSelectTemplate(template);
                                    onClose();
                                }}
                            >
                                <div className={styles.imageContainer}>
                                    <img src={template.imageUrl} alt={template.title} className={styles.image} />
                                </div>
                                <div className={styles.cardInfo}>
                                    <div className={styles.cardTitle}>{template.title}</div>
                                    <div className={styles.cardCategory}>{template.category} • {template.format}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplatesModal;

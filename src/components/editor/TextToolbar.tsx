import React from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Minus, Plus } from 'lucide-react';
import styles from './TextToolbar.module.css';

const FONTS = [
    { name: 'Inter', value: 'Inter, sans-serif' },
    { name: 'Roboto', value: 'Roboto, sans-serif' },
    { name: 'Open Sans', value: 'Open Sans, sans-serif' },
    { name: 'Lato', value: 'Lato, sans-serif' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif' },
    { name: 'Playfair', value: '"Playfair Display", serif' },
    { name: 'Merriweather', value: 'Merriweather, serif' },
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Courier', value: '"Courier New", monospace' },
    { name: 'Comic Sans', value: '"Comic Sans MS", cursive' },
];

interface TextToolbarProps {
    fontFamily: string;
    setFontFamily: (v: string) => void;
    fontSize: number;
    setFontSize: (v: number) => void;
    color: string;
    setColor: (v: string) => void;
    isBold: boolean;
    toggleBold: () => void;
    isItalic: boolean;
    toggleItalic: () => void;
    isUnderline: boolean;
    toggleUnderline: () => void;
    align: 'left' | 'center' | 'right';
    setAlign: (v: 'left' | 'center' | 'right') => void;
    activeElement: string; // 'headline' or 'description'
}

const TextToolbar: React.FC<TextToolbarProps> = ({
    fontFamily, setFontFamily,
    fontSize, setFontSize,
    color, setColor,
    isBold, toggleBold,
    isItalic, toggleItalic,
    isUnderline, toggleUnderline,
    align, setAlign,
}) => {
    return (
        <div className={styles.toolbar}>
            {/* Font Family */}
            <div className={styles.group}>
                <select
                    className={styles.select}
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    style={{ width: '140px' }}
                >
                    {FONTS.map(font => (
                        <option key={font.value} value={font.value}>{font.name}</option>
                    ))}
                </select>
            </div>

            {/* Font Size */}
            <div className={styles.group}>
                <button className={styles.btn} onClick={() => setFontSize(fontSize - 1)}>
                    <Minus size={14} />
                </button>
                <span style={{ fontSize: '14px', fontWeight: 500, minWidth: '24px', textAlign: 'center' }}>
                    {fontSize}
                </span>
                <button className={styles.btn} onClick={() => setFontSize(fontSize + 1)}>
                    <Plus size={14} />
                </button>
            </div>

            {/* Color */}
            <div className={styles.group}>
                <div className={styles.colorPickerWrapper} title="Cor do Texto">
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className={styles.colorInput}
                    />
                    <div style={{ width: '100%', height: '100%', background: color }} />
                </div>
            </div>

            {/* Formatting */}
            <div className={styles.group}>
                <button className={`${styles.btn} ${isBold ? styles.active : ''}`} onClick={toggleBold} title="Negrito">
                    <Bold size={18} />
                </button>
                <button className={`${styles.btn} ${isItalic ? styles.active : ''}`} onClick={toggleItalic} title="Itálico">
                    <Italic size={18} />
                </button>
                <button className={`${styles.btn} ${isUnderline ? styles.active : ''}`} onClick={toggleUnderline} title="Sublinhado">
                    <Underline size={18} />
                </button>
            </div>

            {/* Alignment */}
            <div className={styles.group}>
                <button
                    className={`${styles.btn} ${align === 'left' ? styles.active : ''}`}
                    onClick={() => setAlign('left')}
                    title="Alinhar à Esquerda"
                >
                    <AlignLeft size={18} />
                </button>
                <button
                    className={`${styles.btn} ${align === 'center' ? styles.active : ''}`}
                    onClick={() => setAlign('center')}
                    title="Centralizar"
                >
                    <AlignCenter size={18} />
                </button>
                <button
                    className={`${styles.btn} ${align === 'right' ? styles.active : ''}`}
                    onClick={() => setAlign('right')}
                    title="Alinhar à Direita"
                >
                    <AlignRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default TextToolbar;

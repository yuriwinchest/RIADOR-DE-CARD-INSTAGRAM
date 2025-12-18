import React from 'react';
import {
    MousePointer2, PenTool, Shapes, Minus, StickyNote, Type, Table, X,
    Square, Circle, Triangle, Hexagon, Star,
    ArrowUpRight, Spline,
    Palette
} from 'lucide-react';
import styles from './QuickToolsMenu.module.css';

interface QuickToolsMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onTextClick: () => void;
    activeTool: string | null;
    setActiveTool: (tool: string | null) => void;
    onAddElement: (type: string, payload?: { color?: string; type?: string }) => void;
}

const QuickToolsMenu: React.FC<QuickToolsMenuProps> = ({
    isOpen,
    onClose,
    onTextClick,
    activeTool,
    setActiveTool,
    onAddElement
}) => {
    if (!isOpen) return null;

    const handleToolClick = (tool: string) => {
        if (tool === 'text') {
            onTextClick();
            // Don't close or toggle internal state for text, handled by parent
        }
        // Toggle if same tool clicked, otherwise set new
        setActiveTool(activeTool === tool ? null : tool);
    };

    const closeSubMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveTool(null);
    }

    const renderStickyMenu = () => (
        <div className={styles.subMenu}>
            <button type="button" aria-label="Fechar submenu" className={styles.closeSubMenu} onClick={closeSubMenu}><X size={14} /></button>
            <div className={styles.subMenuGrid}>
                {['#fef3c7', '#fed7aa', '#fbcfe8', '#bfdbfe', '#bbf7d0', '#e9d5ff'].map((color) => (
                    <button
                        type="button"
                        key={color}
                        className={styles.colorBtn}
                        style={{ backgroundColor: color }}
                        onClick={() => onAddElement('sticky', { color })}
                        title="Adicionar Nota"
                        aria-label={`Adicionar nota cor ${color}`}
                    />
                ))}
            </div>
        </div>
    );

    const renderElementsMenu = () => (
        <div className={styles.subMenu}>
            <button type="button" aria-label="Fechar submenu" className={styles.closeSubMenu} onClick={closeSubMenu}><X size={14} /></button>
            <div className={styles.subMenuGrid}>
                <button type="button" className={styles.shapeBtn} onClick={() => onAddElement('shape', { type: 'square' })} title="Quadrado"><Square size={20} /></button>
                <button type="button" className={styles.shapeBtn} onClick={() => onAddElement('shape', { type: 'circle' })} title="Círculo"><Circle size={20} /></button>
                <button type="button" className={styles.shapeBtn} onClick={() => onAddElement('shape', { type: 'triangle' })} title="Triângulo"><Triangle size={20} /></button>
                <button type="button" className={styles.shapeBtn} onClick={() => onAddElement('shape', { type: 'star' })} title="Estrela"><Star size={20} /></button>
                <button type="button" className={styles.shapeBtn} onClick={() => onAddElement('shape', { type: 'hexagon' })} title="Hexágono"><Hexagon size={20} /></button>
            </div>
        </div>
    );

    const renderLineMenu = () => (
        <div className={styles.subMenu}>
            <button type="button" aria-label="Fechar submenu" className={styles.closeSubMenu} onClick={closeSubMenu}><X size={14} /></button>
            <div className={styles.subMenuGrid}>
                <button type="button" className={styles.shapeBtn} onClick={() => onAddElement('line', { type: 'straight' })} title="Reta"><Minus size={20} /></button>
                <button type="button" className={styles.shapeBtn} onClick={() => onAddElement('line', { type: 'arrow' })} title="Seta"><ArrowUpRight size={20} /></button>
                <button type="button" className={styles.shapeBtn} onClick={() => onAddElement('line', { type: 'curved' })} title="Curva"><Spline size={20} /></button>
            </div>
        </div>
    );

    const renderDrawMenu = () => (
        <div className={styles.subMenu}>
            <button type="button" aria-label="Fechar submenu" className={styles.closeSubMenu} onClick={closeSubMenu}><X size={14} /></button>
            <div className={styles.subMenuGrid}>
                <button type="button" className={styles.shapeBtn} onClick={() => onAddElement('draw', { type: 'pen', color: '#000000' })} title="Caneta"><PenTool size={20} /></button>
                <button type="button" className={styles.shapeBtn} onClick={() => onAddElement('draw', { type: 'marker', color: '#ff0000' })} title="Marcador"><Palette size={20} /></button>
            </div>
        </div>
    );

    return (
        <div className={styles.menu}>
            {/* Close Button above the menu */}
            <button type="button" aria-label="Fechar menu" className={styles.closeBtn} onClick={onClose}>
                <X size={20} />
            </button>

            {/* Selection */}
            <button
                type="button"
                className={`${styles.item} ${activeTool === 'select' ? styles.active : ''}`}
                onClick={() => handleToolClick('select')}
                title="Seleção"
            >
                <div>
                    <MousePointer2 size={24} color={activeTool === 'select' ? '#7c3aed' : '#7c3aed'} />
                </div>
            </button>

            {/* Draw */}
            <button
                type="button"
                className={`${styles.item} ${activeTool === 'draw' ? styles.active : ''}`}
                onClick={() => handleToolClick('draw')}
                title="Desenhar"
            >
                <PenTool size={24} color={activeTool === 'draw' ? '#7c3aed' : '#ef4444'} />
                {activeTool === 'draw' && renderDrawMenu()}
            </button>

            {/* Elements */}
            <button
                type="button"
                className={`${styles.item} ${activeTool === 'elements' ? styles.active : ''}`}
                onClick={() => handleToolClick('elements')}
                title="Elementos"
            >
                <Shapes size={24} color={activeTool === 'elements' ? '#7c3aed' : '#374151'} />
                {activeTool === 'elements' && renderElementsMenu()}
            </button>

            {/* Line */}
            <button
                type="button"
                className={`${styles.item} ${activeTool === 'line' ? styles.active : ''}`}
                onClick={() => handleToolClick('line')}
                title="Linha"
            >
                <Minus size={24} style={{ transform: 'rotate(-45deg)' }} color={activeTool === 'line' ? '#7c3aed' : '#3b82f6'} />
                {activeTool === 'line' && renderLineMenu()}
            </button>

            {/* Sticky Note */}
            <button
                type="button"
                className={`${styles.item} ${activeTool === 'sticky' ? styles.active : ''}`}
                onClick={() => handleToolClick('sticky')}
                title="Nota Adesiva"
            >
                <StickyNote size={24} color={activeTool === 'sticky' ? '#7c3aed' : '#fbbf24'} />
                {activeTool === 'sticky' && renderStickyMenu()}
            </button>

            {/* Text */}
            <button
                type="button"
                className={`${styles.item} ${activeTool === 'text' ? styles.active : ''}`}
                onClick={() => handleToolClick('text')}
                title="Texto"
            >
                <Type size={24} color={activeTool === 'text' ? '#7c3aed' : '#a855f7'} />
            </button>

            {/* Table */}
            <button
                type="button"
                className={`${styles.item} ${activeTool === 'table' ? styles.active : ''}`}
                onClick={() => {
                    handleToolClick('table');
                    onAddElement('table');
                }}
                title="Tabela"
            >
                <Table size={24} color={activeTool === 'table' ? '#7c3aed' : '#1e3a8a'} />
            </button>
        </div>
    );
};

export default QuickToolsMenu;

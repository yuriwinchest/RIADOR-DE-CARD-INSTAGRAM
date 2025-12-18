import React from 'react';
import {
    ArrowLeft, ArrowRight, Copy, Grid2X2, Lock, Minus,
    MoreHorizontal, PaintBucket, Spline, Trash2, Unlock
} from 'lucide-react';
import styles from './LineToolbar.module.css';

interface LineToolbarProps {
    element: {
        color?: string;
        strokeWidth?: number;
        startMarker?: 'none' | 'arrow';
        endMarker?: 'none' | 'arrow';
        shapeType?: string;
        locked?: boolean;
    };
    onUpdate: (updates: Partial<LineToolbarProps['element']>) => void;
    onDelete: () => void;
    onDuplicate: () => void;
}

const LineToolbar: React.FC<LineToolbarProps> = ({ element, onUpdate, onDelete, onDuplicate }) => {
    if (!element) return null;

    return (
        <div className={styles.toolbarContainer}>
            {/* Primary Toolbar (Top) */}
            <div className={styles.primaryToolbar}>
                {/* Color Picker */}
                <div className={styles.toolGroup}>
                    <button className={styles.iconBtn} title="Cor da Linha">
                        <div className={styles.colorIndicator} style={{ backgroundColor: element.color }}></div>
                    </button>
                    {/* Simple color palette for demo - could be a popover */}
                    <div className={styles.colorPalette}>
                        {['#000000', '#ffffff', '#ef4444', '#22c55e', '#3b82f6', '#eab308'].map(c => (
                            <button
                                key={c}
                                className={styles.colorSwatch}
                                style={{ backgroundColor: c }}
                                onClick={() => onUpdate({ color: c })}
                                title={`Cor ${c}`}
                                aria-label={`Selecionar cor ${c}`}
                            />
                        ))}
                    </div>
                </div>

                <div className={styles.separator} />

                {/* Thickness */}
                <div className={styles.toolGroup}>
                    <button className={styles.iconBtn} title="Espessura">
                        <Minus size={20} strokeWidth={element.strokeWidth || 4} />
                    </button>
                    {/* Thickness presets */}
                    <div className={styles.thicknessPalette}>
                        {[2, 4, 8, 12].map(w => (
                            <button
                                key={w}
                                className={styles.thicknessBtn}
                                style={{ height: w, backgroundColor: 'currentColor' }}
                                onClick={() => onUpdate({ strokeWidth: w })}
                                title={`Espessura ${w}px`}
                                aria-label={`Definir espessura para ${w} pixels`}
                            />
                        ))}
                    </div>
                </div>

                <div className={styles.separator} />

                {/* Start Marker */}
                <button
                    className={`${styles.iconBtn} ${element.startMarker === 'arrow' ? styles.active : ''} `}
                    onClick={() => onUpdate({ startMarker: element.startMarker === 'arrow' ? 'none' : 'arrow' })}
                    title="Ponta Inicial"
                >
                    <ArrowLeft size={20} />
                </button>

                {/* Line Type (Curve/Straight) */}
                <button
                    className={`${styles.iconBtn} ${element.shapeType === 'curved' ? styles.active : ''} `}
                    onClick={() => onUpdate({ shapeType: element.shapeType === 'curved' ? 'straight' : 'curved' })}
                    title="Curvar"
                >
                    <Spline size={20} />
                </button>

                {/* End Marker */}
                <button
                    className={`${styles.iconBtn} ${element.endMarker === 'arrow' ? styles.active : ''} `}
                    onClick={() => onUpdate({ endMarker: element.endMarker === 'arrow' ? 'none' : 'arrow' })}
                    title="Ponta Final"
                >
                    <ArrowRight size={20} />
                </button>

                <div className={styles.separator} />

                {/* Opacity */}
                <button className={styles.iconBtn} title="Opacidade">
                    <Grid2X2 size={20} />
                </button>

                <div className={styles.separator} />

                <span className={styles.label}>Posição</span>

                <div className={styles.separator} />

                <button className={styles.iconBtn} title="Copiar Estilo">
                    <PaintBucket size={18} />
                </button>
            </div>

            {/* Secondary Toolbar (Bottom - Actions) */}
            <div className={styles.secondaryToolbar}>
                <button className={styles.actionBtn} title="Comentário">
                    <span style={{ fontSize: 18 }}>+</span>
                </button>
                <button className={styles.actionBtn} onClick={() => onUpdate({ locked: !element.locked })} title={element.locked ? "Desbloquear" : "Bloquear"}>
                    {element.locked ? <Lock size={18} /> : <Unlock size={18} />}
                </button>
                <button className={styles.actionBtn} onClick={onDuplicate} title="Duplicar">
                    <Copy size={18} />
                </button>
                <button className={`${styles.actionBtn} ${styles.deleteBtn} `} onClick={onDelete} title="Excluir">
                    <Trash2 size={18} />
                </button>
                <button className={styles.actionBtn} title="Mais opções">
                    <MoreHorizontal size={18} />
                </button>
            </div>
        </div>
    );
};

export default LineToolbar;

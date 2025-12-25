import React, { useState, useCallback } from 'react';
import CanvasArea, { type CanvasElement } from '../components/editor/CanvasArea';
import EditorHeader from '../components/editor/EditorHeader';
import styles from './Editor.module.css';

const Editor: React.FC = () => {
    const [format, setFormat] = useState<string>('instagram-square');
    const [headline, setHeadline] = useState('Promoção de Verão 2024');
    const [description, setDescription] = useState('Ganhe 50% de desconto em todos os itens apenas neste fim de semana.');
    const [filter, setFilter] = useState('none');
    const [backgroundImage, setBackgroundImage] = useState('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80');
    const [fontFamily, setFontFamily] = useState('Inter, sans-serif');
    const [overlayOpacity, setOverlayOpacity] = useState(0.2);
    const [headlineColor, setHeadlineColor] = useState('#ffffff');
    const [headlineSize, setHeadlineSize] = useState(48);
    const [descriptionColor, setDescriptionColor] = useState('#e0e0e0');
    const [descriptionSize, setDescriptionSize] = useState(16);
    const [headlinePos, setHeadlinePos] = useState({ x: 50, y: 100 });
    const [descriptionPos, setDescriptionPos] = useState({ x: 50, y: 300 });
    const [headlineWidth, setHeadlineWidth] = useState<number | string>('auto');
    const [descriptionWidth, setDescriptionWidth] = useState<number | string>('auto');
    const [imagePos, setImagePos] = useState({ x: 0, y: 0 });
    const [imageSize, setImageSize] = useState({ width: '100%', height: '100%' });

    // Elements State
    const [elements, setElements] = useState<CanvasElement[]>([]);

    const handleAddElement = (type: string, payload?: { color?: string; type?: string; src?: string }) => {
        const id = Date.now().toString();

        let newElement: CanvasElement = {
            id,
            type: type as CanvasElement['type'],
            x: 100,
            y: 100,
            width: 100,
            height: 100,
            color: payload?.color || '#ffffff',
            rotation: 0,
            src: payload?.src
        };

        if (type === 'sticky') {
            newElement = { ...newElement, width: 200, height: 200, content: 'Nova Nota', color: payload?.color || '#fef3c7' };
        } else if (type === 'shape') {
            newElement = { ...newElement, width: 100, height: 100, shapeType: payload?.type, color: '#374151' };
        } else if (type === 'line') {
            newElement = { ...newElement, width: 200, height: 20, shapeType: payload?.type, color: '#000000' };
        } else if (type === 'table') {
            newElement = { ...newElement, width: 300, height: 200, color: '#e5e7eb', rows: 3, cols: 3 };
        } else if (type === 'draw') {
            newElement = { ...newElement, width: 400, height: 400, color: payload?.color || '#000000', path: '' };
        } else if (type === 'image') {
            newElement = { ...newElement, width: 200, height: 200, src: payload?.src || '' };
        }

        setElements(prev => [...prev, newElement]);
    };

    const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
        setElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el));
    }, []);

    const deleteElement = (id: string) => {
        setElements(prev => prev.filter(el => el.id !== id));
    };

    const duplicateElement = (id: string) => {
        setElements(prev => {
            const el = prev.find(e => e.id === id);
            if (el) {
                const newEl = { ...el, id: Date.now().toString(), x: el.x + 20, y: el.y + 20 };
                return [...prev, newEl];
            }
            return prev;
        });
    };

    return (
        <div className={styles.page}>
            <EditorHeader />
            <main className={styles.main}>
                <div className={styles.workspace}>
                    <CanvasArea
                        format={format} setFormat={setFormat}
                        headline={headline} setHeadline={setHeadline}
                        description={description} setDescription={setDescription}
                        backgroundImage={backgroundImage} filter={filter}
                        fontFamily={fontFamily} setFontFamily={setFontFamily}
                        overlayOpacity={overlayOpacity} setOverlayOpacity={setOverlayOpacity}
                        headlineColor={headlineColor} setHeadlineColor={setHeadlineColor}
                        headlineSize={headlineSize} setHeadlineSize={setHeadlineSize}
                        descriptionColor={descriptionColor} setDescriptionColor={setDescriptionColor}
                        descriptionSize={descriptionSize} setDescriptionSize={setDescriptionSize}
                        headlinePos={headlinePos} setHeadlinePos={setHeadlinePos}
                        descriptionPos={descriptionPos} setDescriptionPos={setDescriptionPos}
                        headlineWidth={headlineWidth} setHeadlineWidth={setHeadlineWidth}
                        descriptionWidth={descriptionWidth} setDescriptionWidth={setDescriptionWidth}
                        imagePos={imagePos} setImagePos={setImagePos}
                        imageSize={imageSize} setImageSize={setImageSize}
                        elements={elements}
                        onUpdateElement={updateElement}
                        onDeleteElement={deleteElement}
                        onDuplicateElement={duplicateElement}
                        onAddElement={handleAddElement}
                        setBackgroundImage={setBackgroundImage}
                        setFilter={setFilter}
                    />
                </div>
            </main>
        </div>
    );
};

export default Editor;

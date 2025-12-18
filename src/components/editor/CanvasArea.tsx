import React, { useRef, useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import styles from './CanvasArea.module.css';
import { Rnd } from 'react-rnd';
import html2canvas from 'html2canvas';
import TextDetails from './TextDetails';
import TextToolbar from './TextToolbar';
import LineToolbar from './LineToolbar';

interface CanvasAreaProps {
    format: string;
    setFormat: (v: string) => void;
    headline: string;
    setHeadline: (v: string) => void;
    description: string;
    setDescription: (v: string) => void;
    backgroundImage: string;
    filter: string;
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
    headlinePos: { x: number, y: number };
    setHeadlinePos: (pos: { x: number, y: number }) => void;
    descriptionPos: { x: number, y: number };
    setDescriptionPos: (pos: { x: number, y: number }) => void;
    headlineWidth: number | string;
    setHeadlineWidth: (w: number | string) => void;
    descriptionWidth: number | string;
    setDescriptionWidth: (w: number | string) => void;
    imagePos: { x: number, y: number };
    setImagePos: (pos: { x: number, y: number }) => void;
    imageSize: { width: string, height: string };
    setImageSize: React.Dispatch<React.SetStateAction<{ width: string, height: string }>>;
    elements: CanvasElement[];
    onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
    onDeleteElement: (id: string) => void;
    onDuplicateElement: (id: string) => void;
    onAddElement: (type: string, payload?: { color?: string; type?: string; src?: string }) => void;
    setBackgroundImage: (v: string) => void;
    setFilter: (v: string) => void;
}

export interface CanvasElement {
    id: string;
    type: 'text' | 'sticky' | 'shape' | 'line' | 'draw' | 'table' | 'image';
    content?: string;
    src?: string; // For images
    color?: string;
    shapeType?: string;
    x: number;
    y: number;
    width: number | string;
    height: number | string;
    rotation?: number;
    rows?: number;
    cols?: number;
    path?: string;
    strokeWidth?: number;
    startMarker?: 'none' | 'arrow';
    endMarker?: 'none' | 'arrow';
    locked?: boolean;
    controlX?: number; // 0-100 percentage for bezier control point
    controlY?: number; // 0-100 percentage
}

// Helper to get class helper
const getFormatClass = (fmt: string) => {
    switch (fmt) {
        // Instagram
        case 'instagram-square': return styles['instagram-square'];
        case 'instagram-story': return styles['instagram-story'];
        case 'instagram-portrait': return styles['instagram-portrait'];

        // WhatsApp
        case 'whatsapp-status': return styles['whatsapp-status'];

        // Facebook
        case 'facebook-post': return styles['facebook-post'];
        case 'facebook-cover': return styles['facebook-cover'];

        // YouTube
        case 'youtube-thumbnail': return styles['youtube-thumbnail'];
        case 'youtube-banner': return styles['youtube-banner'];

        // Twitter
        case 'twitter-post': return styles['twitter-post'];
        case 'twitter-header': return styles['twitter-header'];

        // LinkedIn
        case 'linkedin-post': return styles['linkedin-post'];
        case 'linkedin-banner': return styles['linkedin-banner'];

        // TikTok
        case 'tiktok-video': return styles['tiktok-video'];

        default: return styles['instagram-square'];
    }
};

const CanvasArea: React.FC<CanvasAreaProps> = ({
    format, setFormat, headline, setHeadline, description, setDescription, backgroundImage, filter, fontFamily, setFontFamily,
    overlayOpacity, setOverlayOpacity, headlineColor, setHeadlineColor, headlineSize, setHeadlineSize, descriptionColor, setDescriptionColor, descriptionSize, setDescriptionSize,
    headlinePos, setHeadlinePos, descriptionPos, setDescriptionPos, imagePos, setImagePos, imageSize, setImageSize,
    headlineWidth, setHeadlineWidth, descriptionWidth, setDescriptionWidth,
    elements, onUpdateElement, onDeleteElement, onDuplicateElement,
    onAddElement, setBackgroundImage, setFilter
}) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [zoom, setZoom] = useState(1);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Tools State
    const [isTextToolbarOpen, setIsTextToolbarOpen] = useState(false); // Horizontal Text Settings

    // Styling States
    const [headlineBold, setHeadlineBold] = useState(false);
    const [headlineItalic, setHeadlineItalic] = useState(false);
    const [headlineUnderline, setHeadlineUnderline] = useState(false);
    const [headlineAlign, setHeadlineAlign] = useState<'left' | 'center' | 'right'>('center');

    const [descriptionBold, setDescriptionBold] = useState(false);
    const [descriptionItalic, setDescriptionItalic] = useState(false);
    const [descriptionUnderline, setDescriptionUnderline] = useState(false);
    const [descriptionAlign, setDescriptionAlign] = useState<'left' | 'center' | 'right'>('center');

    const selectedElement = elements.find(el => el.id === selectedId);

    // Drawing State (Simple implementation without external state for now)
    const [isDrawing, setIsDrawing] = useState(false);

    // Control Point Drag Logic
    const [draggingControl, setDraggingControl] = useState<string | null>(null);

    React.useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (draggingControl) {
                const el = elements.find(e => e.id === draggingControl);
                if (el) {
                    // Estimate element dimensions to normalize movement
                    let w = 100;
                    let h = 100;
                    if (typeof el.width === 'number') w = el.width;
                    else if (typeof el.width === 'string' && el.width.endsWith('px')) w = parseInt(el.width, 10) || 100;

                    if (typeof el.height === 'number') h = el.height;
                    else if (typeof el.height === 'string' && el.height.endsWith('px')) h = parseInt(el.height, 10) || 100;

                    // Convert pixel movement to SVG coordinate space (0-100)
                    const deltaX = (e.movementX / w) * 100;
                    const deltaY = (e.movementY / h) * 100;

                    const newX = Math.max(0, Math.min(100, (el.controlX ?? 50) + deltaX));
                    const newY = Math.max(0, Math.min(100, (el.controlY ?? 50) + deltaY));

                    onUpdateElement(draggingControl, { controlX: newX, controlY: newY });
                }
            }
        };

        const handleMouseUp = () => {
            setDraggingControl(null);
            setIsDrawing(false);
        };

        if (draggingControl || isDrawing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [draggingControl, elements, onUpdateElement, isDrawing]);

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));



    // Event listener for download trigger from sidebar - REMOVED REVERTING
    // React.useEffect(() => { ... });

    const handleDownload = async () => {
        if (canvasRef.current) {
            // Deselect everything before capture to hide borders
            setSelectedId(null);
            // Wait a tiny bit for render cycle (optional but safer) or use a layout effect.
            // For simplicity, we just hope React sync rendering handles it or we accept a border in screenshot if user keeps it selected.
            // Actually, usually <html> capture captures what's seen. 
            // We can wrap download in a timeout or flushSync, but let's just set state and await a tiny delay if needed.
            // Better: use a ref or check if we can wait for repaint. 
            // html2canvas reads the DOM. If generic React state update happens, it should be fine.
            // Let's manually remove selection for the screenshot.

            // Hacky but simple: Wait 100ms
            await new Promise(r => setTimeout(r, 100));

            const canvas = await html2canvas(canvasRef.current, { useCORS: true, scale: 2 });
            const link = document.createElement('a');
            link.download = `card-${format}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    };

    const isImage = backgroundImage.startsWith('http') || backgroundImage.startsWith('blob:') || backgroundImage.startsWith('data:');
    const isGradient = backgroundImage.startsWith('linear-gradient') || backgroundImage.startsWith('radial-gradient');

    // Simplified Drawing Logic for now: Just allow selecting color/width via LineToolbar if needed, or separate.
    // The user issue "Can't adjust line" likely refers to the "line" tool control points not working or "draw" tool not drawing.
    // Let's ensure the "Line" tool control points are draggable.
    // I added "setDraggingControl" logic but maybe z-index or event propagation is blocking it.
    // In the "line" render, I have `onMouseDown={(e) => { e.stopPropagation(); setDraggingControl(el.id); }}` on the circle.
    // This should work if `elements` state is updated correctly.

    // Fix: Ensure onUpdateElement properly updates nested properties or flat ones.
    // CanvasElement has controlX/controlY at root.

    // Also, "Draw" tool needs a toolbar to change color/width.
    // We can reuse LineToolbar for "draw" type elements too if we map properties.

    return (
        <div className={styles.canvasArea}>
            <div className={styles.topBar}>
                {/* Removed TextDetails sidebar to consolidate UI */}
                {/* Text editing drawer logic will be moved or handled differently */}
                <div className={styles.detailsContainer}>
                    <TextDetails
                        format={format} setFormat={setFormat}
                        onDownload={handleDownload}
                        headline={headline} setHeadline={setHeadline}
                        description={description} setDescription={setDescription}
                        fontFamily={fontFamily} setFontFamily={setFontFamily}
                        overlayOpacity={overlayOpacity} setOverlayOpacity={setOverlayOpacity}
                        headlineColor={headlineColor} setHeadlineColor={setHeadlineColor}
                        headlineSize={headlineSize} setHeadlineSize={setHeadlineSize}
                        descriptionColor={descriptionColor} setDescriptionColor={setDescriptionColor}
                        descriptionSize={descriptionSize} setDescriptionSize={setDescriptionSize}
                        isDrawerOpen={isDrawerOpen}
                        setIsDrawerOpen={setIsDrawerOpen}
                        isToolbarOpen={isTextToolbarOpen}
                        toggleToolbar={() => setIsTextToolbarOpen(!isTextToolbarOpen)}
                        onAddElement={onAddElement}
                        setBackgroundImage={setBackgroundImage}
                        setFilter={setFilter}
                        backgroundImage={backgroundImage}
                        selectedFilter={filter}
                    />
                </div>
            </div>

            {/* Quick Tools Menu removed - functionality moved to Sidebar */}

            {/* Stage Area - Centered Canvas and Contextual Tools */}
            <div className={styles.stageArea}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>

                    {/* Text Toolbar - Horizontal Top Bar (Now part of the flow) */}
                    {(isTextToolbarOpen || selectedId === 'headline' || selectedId === 'description') && (
                        <TextToolbar
                            activeElement={selectedId === 'description' ? 'description' : 'headline'}
                            fontFamily={fontFamily}
                            setFontFamily={setFontFamily}
                            fontSize={selectedId === 'headline' ? headlineSize : descriptionSize}
                            setFontSize={selectedId === 'headline' ? setHeadlineSize : setDescriptionSize}
                            color={selectedId === 'headline' ? headlineColor : descriptionColor}
                            setColor={selectedId === 'headline' ? setHeadlineColor : setDescriptionColor}
                            isBold={selectedId === 'headline' ? headlineBold : descriptionBold}
                            toggleBold={() => selectedId === 'headline' ? setHeadlineBold(!headlineBold) : setDescriptionBold(!descriptionBold)}
                            isItalic={selectedId === 'headline' ? headlineItalic : descriptionItalic}
                            toggleItalic={() => selectedId === 'headline' ? setHeadlineItalic(!headlineItalic) : setDescriptionItalic(!descriptionItalic)}
                            isUnderline={selectedId === 'headline' ? headlineUnderline : descriptionUnderline}
                            toggleUnderline={() => selectedId === 'headline' ? setHeadlineUnderline(!headlineUnderline) : setDescriptionUnderline(!descriptionUnderline)}
                            align={selectedId === 'headline' ? headlineAlign : descriptionAlign}
                            setAlign={selectedId === 'headline' ? setHeadlineAlign : setDescriptionAlign}
                        />
                    )}

                    {/* Line/Draw Toolbar */}
                    {(selectedElement?.type === 'line' || selectedElement?.type === 'draw') && (
                        <div style={{ marginBottom: 10, zIndex: 100 }}>
                            <LineToolbar
                                element={selectedElement}
                                onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)}
                                onDelete={() => onDeleteElement(selectedElement.id)}
                                onDuplicate={() => onDuplicateElement(selectedElement.id)}
                            />
                        </div>
                    )}


                    <div
                        className={`${styles.canvasWrapper} ${getFormatClass(format)}`}
                        style={{
                            transform: `scale(${zoom})`,
                            transformOrigin: 'center center', // Changed to center center for better vertical scaling
                        }}
                        ref={canvasRef}
                    >
                        <div
                            className={styles.cardContent}
                            style={{
                                backgroundColor: (isImage || isGradient) ? '#000' : backgroundImage,
                                backgroundImage: isGradient ? backgroundImage : 'none',
                                filter: filter,
                                overflow: 'hidden',
                                position: 'relative'
                            }}
                            onMouseDown={(e) => {
                                // Only deselect if clicking directly on the container
                                if (e.target === e.currentTarget) setSelectedId(null);
                            }}
                        >
                            {isImage && (
                                <Rnd
                                    size={imageSize}
                                    position={imagePos}
                                    onDragStop={(_e, d) => {
                                        setImagePos({ x: d.x, y: d.y });
                                    }}
                                    onResizeStop={(_e, _direction, ref, _delta, position) => {
                                        setImageSize({
                                            width: ref.style.width,
                                            height: ref.style.height,
                                        });
                                        setImagePos(position);
                                    }}
                                    onMouseDown={() => setSelectedId('image')}
                                    style={{
                                        zIndex: 0,
                                        border: selectedId === 'image' ? '2px solid #a855f7' : 'none', // Purple border
                                    }}
                                    resizeHandleStyles={{
                                        topLeft: {
                                            width: '10px', height: '10px', backgroundColor: '#a855f7', borderRadius: '50%', left: '-5px', top: '-5px'
                                        },
                                        topRight: {
                                            width: '10px', height: '10px', backgroundColor: '#a855f7', borderRadius: '50%', right: '-5px', top: '-5px'
                                        },
                                        bottomLeft: {
                                            width: '10px', height: '10px', backgroundColor: '#a855f7', borderRadius: '50%', left: '-5px', bottom: '-5px'
                                        },
                                        bottomRight: {
                                            width: '10px', height: '10px', backgroundColor: '#a855f7', borderRadius: '50%', right: '-5px', bottom: '-5px'
                                        }
                                    }}
                                    // Enable visible handles only when selected
                                    enableResizing={selectedId === 'image' ? undefined : false} // actually we want it resizing always? or only when selected? standard is usually only when selected to avoid accidental clicks. Let's keep it draggable always but resizable only when selected or always resizable but handles hidden until selected. 
                                    // User request: "notice that user can move... active on side mark"
                                    // If I hide handles when not selected, it's cleaner.
                                    lockAspectRatio={false}
                                >
                                    <img
                                        src={backgroundImage}
                                        alt="Background"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            pointerEvents: 'none',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)' // 3D effect shadow
                                        }}
                                    />
                                </Rnd>
                            )}
                            {/* Overlay */}
                            <div className={styles.overlay} style={{ opacity: overlayOpacity }} />


                            <Rnd
                                size={{ width: headlineWidth, height: 'auto' }}
                                position={headlinePos}
                                onDragStop={(_e, d) => setHeadlinePos({ x: d.x, y: d.y })}
                                onResizeStop={(_e, _direction, ref, _delta, position) => {
                                    setHeadlineWidth(ref.style.width);
                                    setHeadlinePos(position);
                                }}
                                enableResizing={selectedId === 'headline' ? { left: true, right: true, topLeft: true, topRight: true, bottomLeft: true, bottomRight: true } : false}
                                bounds="parent"
                                style={{
                                    zIndex: 10,
                                    fontFamily: fontFamily,
                                    border: selectedId === 'headline' ? '1px dashed #a855f7' : 'none'
                                }}
                            >
                                <h1
                                    className={styles.headline}
                                    style={{
                                        color: headlineColor,
                                        fontSize: `${headlineSize}px`,
                                        fontWeight: headlineBold ? 'bold' : 'normal',
                                        fontStyle: headlineItalic ? 'italic' : 'normal',
                                        textDecoration: headlineUnderline ? 'underline' : 'none',
                                        textAlign: headlineAlign,
                                        margin: 0,
                                        userSelect: 'none',
                                        cursor: 'move',
                                        width: '100%'
                                    }}
                                    onMouseDown={() => setSelectedId('headline')}
                                >
                                    {headline || 'Seu Título'}
                                </h1>
                            </Rnd>

                            <Rnd
                                size={{ width: descriptionWidth, height: 'auto' }}
                                position={descriptionPos}
                                onDragStop={(_e, d) => setDescriptionPos({ x: d.x, y: d.y })}
                                onResizeStop={(_e, _direction, ref, _delta, position) => {
                                    setDescriptionWidth(ref.style.width);
                                    setDescriptionPos(position);
                                }}
                                enableResizing={selectedId === 'description' ? { left: true, right: true, topLeft: true, topRight: true, bottomLeft: true, bottomRight: true } : false}
                                bounds="parent"
                                style={{
                                    zIndex: 10,
                                    fontFamily: fontFamily,
                                    border: selectedId === 'description' ? '1px dashed #a855f7' : 'none'
                                }}
                            >
                                <p
                                    className={styles.description}
                                    style={{
                                        color: descriptionColor,
                                        fontSize: `${descriptionSize}px`,
                                        fontWeight: descriptionBold ? 'bold' : 'normal',
                                        fontStyle: descriptionItalic ? 'italic' : 'normal',
                                        textDecoration: descriptionUnderline ? 'underline' : 'none',
                                        textAlign: descriptionAlign,
                                        margin: 0,
                                        userSelect: 'none',
                                        cursor: 'move',
                                        width: '100%'
                                    }}
                                    onMouseDown={() => setSelectedId('description')}
                                >
                                    {description || 'Escreva uma descrição chamativa para o seu card.'}
                                </p>
                            </Rnd>

                            {/* Render Extra Elements */}
                            {elements.map(el => (
                                <Rnd
                                    key={el.id}
                                    size={{ width: el.width, height: el.height }}
                                    position={{ x: el.x, y: el.y }}
                                    onDragStop={(_e, d) => onUpdateElement(el.id, { x: d.x, y: d.y })}
                                    onResizeStop={(_e, _direction, ref, _delta, position) => {
                                        onUpdateElement(el.id, {
                                            width: ref.style.width,
                                            height: ref.style.height,
                                            ...position,
                                        });
                                    }}
                                    disableDragging={selectedId === el.id && el.type === 'draw'}
                                    bounds="parent"
                                    style={{ zIndex: 20 }}
                                >
                                    {el.type === 'sticky' && (
                                        <div style={{
                                            width: '100%', height: '100%',
                                            backgroundColor: el.color,
                                            padding: '16px',
                                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            textAlign: 'center',
                                            fontSize: '1.2rem',
                                            fontFamily: 'Caveat, cursive', // Handwriting style if available
                                            color: '#374151'
                                        }}>
                                            <textarea
                                                aria-label="Sticky note content"
                                                placeholder="Type your note here"
                                                value={el.content}
                                                onChange={(e) => onUpdateElement(el.id, { content: e.target.value })}
                                                style={{
                                                    width: '100%', height: '100%',
                                                    background: 'transparent', border: 'none', resize: 'none',
                                                    fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit', outline: 'none'
                                                }}
                                            />
                                        </div>
                                    )}
                                    {el.type === 'shape' && (
                                        <div style={{
                                            width: '100%', height: '100%',
                                            backgroundColor: el.color,
                                            borderRadius: el.shapeType === 'circle' ? '50%' : '0',
                                            clipPath: el.shapeType === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' :
                                                el.shapeType === 'star' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' :
                                                    el.shapeType === 'hexagon' ? 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' : 'none'
                                        }} />
                                    )}
                                    {el.type === 'line' && (
                                        <div
                                            style={{ width: '100%', height: '100%', cursor: 'pointer' }}
                                            onMouseDown={(e) => { e.stopPropagation(); setSelectedId(el.id); }}
                                        >
                                            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                                                {el.shapeType === 'curved' ? (
                                                    <>
                                                        {/* Quadratic Bezier for adjustable curve */}
                                                        {/* Starts Bottom-Left (0,100), Ends Top-Right (100,0) */}
                                                        <path
                                                            d={`M 0 100 Q ${el.controlX ?? 50} ${el.controlY ?? 50} 100 0`}
                                                            fill="none"
                                                            stroke={el.color}
                                                            strokeWidth={el.strokeWidth || 4}
                                                            strokeLinecap="round"
                                                            vectorEffect="non-scaling-stroke"
                                                        />

                                                        {/* Control Point Handle (Green) */}
                                                        {selectedId === el.id && (
                                                            <>
                                                                {/* Guide lines */}
                                                                <line x1="0" y1="100" x2={el.controlX ?? 50} y2={el.controlY ?? 50} stroke="#a855f7" strokeWidth="1" strokeDasharray="2" vectorEffect="non-scaling-stroke" opacity="0.5" />
                                                                <line x1="100" y1="0" x2={el.controlX ?? 50} y2={el.controlY ?? 50} stroke="#a855f7" strokeWidth="1" strokeDasharray="2" vectorEffect="non-scaling-stroke" opacity="0.5" />

                                                                {/* Draggable Dot */}
                                                                <circle
                                                                    cx={el.controlX ?? 50}
                                                                    cy={el.controlY ?? 50}
                                                                    r="6"
                                                                    fill="#22c55e"
                                                                    stroke="white"
                                                                    strokeWidth="2"
                                                                    style={{ cursor: 'move', pointerEvents: 'auto' }}
                                                                    vectorEffect="non-scaling-stroke"
                                                                    onMouseDown={(e) => {
                                                                        e.stopPropagation();
                                                                        setDraggingControl(el.id);
                                                                    }}
                                                                />
                                                            </>
                                                        )}
                                                    </>
                                                ) : el.shapeType === 'arrow' ? (
                                                    <>
                                                        <defs>
                                                            <marker id={`arrow-${el.id}`} markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                                                                <path d="M0,0 L0,6 L9,3 z" fill={el.color} />
                                                            </marker>
                                                        </defs>
                                                        <line x1="0" y1="50" x2={el.endMarker === 'arrow' ? "90" : "100"} y2="50" stroke={el.color} strokeWidth={el.strokeWidth || 4} markerEnd={`url(#arrow-${el.id})`} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                                                    </>
                                                ) : (
                                                    // Straight Default - handled by props in toolbar now
                                                    <line
                                                        x1={el.startMarker === 'arrow' ? "10" : "0"}
                                                        y1="50"
                                                        x2={el.endMarker === 'arrow' ? "90" : "100"}
                                                        y2="50"
                                                        stroke={el.color}
                                                        strokeWidth={el.strokeWidth || 4}
                                                        strokeLinecap="round"
                                                        vectorEffect="non-scaling-stroke"
                                                        markerStart={el.startMarker === 'arrow' ? `url(#arrow-start-${el.id})` : undefined}
                                                        markerEnd={el.endMarker === 'arrow' ? `url(#arrow-${el.id})` : undefined}
                                                    />
                                                )}

                                                {/* Defs for markers if not already defined */}
                                                <defs>
                                                    <marker id={`arrow-${el.id}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
                                                        <path d="M0,0 L0,6 L6,3 z" fill={el.color} />
                                                    </marker>
                                                    <marker id={`arrow-start-${el.id}`} markerWidth="6" markerHeight="6" refX="1" refY="3" orient="auto" markerUnits="strokeWidth">
                                                        <path d="M6,0 L6,6 L0,3 z" fill={el.color} />
                                                    </marker>
                                                </defs>

                                                {/* Selection Highlight */}
                                                {selectedId === el.id && (
                                                    <>
                                                        <rect x="0" y="0" width="100" height="100" fill="none" stroke="#a855f7" strokeWidth="1" vectorEffect="non-scaling-stroke" strokeDasharray="4" style={{ pointerEvents: 'none' }} />
                                                    </>
                                                )}
                                            </svg>
                                        </div>
                                    )}
                                    {el.type === 'table' && (
                                        <div style={{
                                            width: '100%', height: '100%',
                                            backgroundColor: 'transparent',
                                            overflow: 'hidden',
                                        }}>
                                            <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse', border: `1px solid ${el.color}` }}>
                                                <tbody>
                                                    {[0, 1, 2].map(r => (
                                                        <tr key={r}>
                                                            {[0, 1, 2].map(c => (
                                                                <td key={c} style={{ border: `1px solid ${el.color || '#ddd'}`, padding: 4 }}>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                    {el.type === 'draw' && (
                                        <div
                                            style={{ width: '100%', height: '100%', cursor: 'crosshair', position: 'relative' }}
                                            onMouseDown={(e) => {
                                                e.stopPropagation();
                                                // Always select on click
                                                if (selectedId !== el.id) {
                                                    setSelectedId(el.id);
                                                }

                                                setIsDrawing(true);
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                const getPos = (evt: MouseEvent | React.MouseEvent) => ({
                                                    x: evt.clientX - rect.left,
                                                    y: evt.clientY - rect.top
                                                });

                                                const startPos = getPos(e);
                                                // Start path or append to existing? Usually freehand is one path, but if we want multiple strokes we need multiple paths or M command.
                                                // If path exists, append " M x y" to start a new sub-path.
                                                // If path is empty, just "M x y".
                                                let currentPath = el.path ? `${el.path} M ${startPos.x} ${startPos.y}` : `M ${startPos.x} ${startPos.y}`;

                                                onUpdateElement(el.id, { path: currentPath });

                                                const moveHandler = (moveEvent: MouseEvent) => {
                                                    const pos = getPos(moveEvent);
                                                    currentPath += ` L ${pos.x} ${pos.y}`;
                                                    onUpdateElement(el.id, { path: currentPath });
                                                };

                                                const upHandler = () => {
                                                    window.removeEventListener('mousemove', moveHandler);
                                                    window.removeEventListener('mouseup', upHandler);
                                                    setIsDrawing(false);
                                                };

                                                window.addEventListener('mousemove', moveHandler);
                                                window.addEventListener('mouseup', upHandler);
                                            }}
                                        >
                                            <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
                                                <path
                                                    d={el.path || ""}
                                                    fill="none"
                                                    stroke={el.color}
                                                    strokeWidth={el.strokeWidth || 4}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                {/* Visual border when selected so user knows drawing area */}
                                                {selectedId === el.id && (
                                                    <rect x="0" y="0" width="100%" height="100%" fill="none" stroke="#a855f7" strokeWidth="1" strokeDasharray="4" vectorEffect="non-scaling-stroke" style={{ pointerEvents: 'none' }} />
                                                )}
                                            </svg>
                                        </div>
                                    )}
                                </Rnd>
                            ))}


                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.zoomControls}>
                <button className={styles.zoomBtn} onClick={handleZoomIn} aria-label="Zoom in" title="Zoom in"><Plus size={18} /></button>
                <button className={styles.zoomBtn} onClick={handleZoomOut} aria-label="Zoom out" title="Zoom out"><Minus size={18} /></button>
            </div>
        </div>
    );
};

export default CanvasArea;

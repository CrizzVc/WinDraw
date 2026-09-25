import React, { useState, useRef, useEffect } from 'react';
import Canvas from './components/Canvas';
import TopBar from './components/TopBar';
import LeftRail from './components/LeftRail';
import LayersPanel from './components/LayersPanel';

const THUMB_W = 120;
const THUMB_H = 90;

const makeThumb = (src) => {
    if (!src || src.width === 0 || src.height === 0) return null;
    const t = document.createElement('canvas');
    t.width = THUMB_W;
    t.height = THUMB_H;
    const ctx = t.getContext('2d');
    const scale = Math.min(THUMB_W / src.width, THUMB_H / src.height);
    const w = src.width * scale;
    const h = src.height * scale;
    ctx.drawImage(src, (THUMB_W - w) / 2, (THUMB_H - h) / 2, w, h);
    return t.toDataURL('image/png');
};

const createLayer = () => ({
    id: Date.now() + Math.random(),
    visible: true,
    opacity: 1,
    blendMode: 'normal',
    thumb: null
});

function App() {
    const [layers, setLayers] = useState(() => [createLayer()]);
    const [activeLayerId, setActiveLayerId] = useState(layers[0].id);
    const canvasRefs = useRef({});

    const [brushColor, setBrushColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(5);
    const [isEraser, setIsEraser] = useState(false);
    const [historyStates, setHistoryStates] = useState({});
    const [layersOpen, setLayersOpen] = useState(true);

    // Layers Management
    const addLayer = () => {
        const newLayer = createLayer();
        setLayers((prev) => [newLayer, ...prev]);
        setActiveLayerId(newLayer.id);
    };

    const deleteLayer = (id) => {
        if (layers.length <= 1) return;
        const newLayers = layers.filter((l) => l.id !== id);
        setLayers(newLayers);
        if (activeLayerId === id) {
            setActiveLayerId(newLayers[0].id);
        }
        delete canvasRefs.current[id];
    };

    const toggleLayerVisibility = (id) => {
        setLayers((prev) =>
            prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l))
        );
    };

    const changeLayerOpacity = (id, newOpacity) => {
        setLayers((prev) =>
            prev.map((l) => (l.id === id ? { ...l, opacity: newOpacity } : l))
        );
    };

    const changeLayerBlend = (id, blendMode) => {
        setLayers((prev) =>
            prev.map((l) => (l.id === id ? { ...l, blendMode } : l))
        );
    };

    const refreshThumb = (layerId) => {
        const canvas = canvasRefs.current[layerId]?.getCanvas?.();
        if (!canvas) return;
        const thumb = makeThumb(canvas);
        setLayers((prev) =>
            prev.map((l) => (l.id === layerId ? { ...l, thumb } : l))
        );
    };

    const refreshAllThumbs = () => {
        setLayers((prev) =>
            prev.map((l) => {
                const canvas = canvasRefs.current[l.id]?.getCanvas?.();
                return canvas ? { ...l, thumb: makeThumb(canvas) } : l;
            })
        );
    };

    const handleHistoryChange = (layerId, state) => {
        setHistoryStates((prev) => ({
            ...prev,
            [layerId]: state
        }));
        refreshThumb(layerId);
    };

    // Keep thumbnails in sync when the canvas resolution changes
    useEffect(() => {
        const onResize = () => refreshAllThumbs();
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const activeLayer = layers.find((l) => l.id === activeLayerId) || layers[0];
    const activeHistory = historyStates[activeLayerId] || { canUndo: false, canRedo: false };
    const getActiveCanvas = () => canvasRefs.current[activeLayerId];

    const handleColorChange = (color) => {
        setBrushColor(color);
        if (isEraser) setIsEraser(false);
    };

    return (
        <div className="app-root">
            <div className="canvas-stack">
                {/* Render bottom up to respect canvas stacking */}
                {[...layers].reverse().map((layer) => (
                    <div
                        key={layer.id}
                        className="canvas-layer"
                        style={{
                            opacity: layer.visible ? layer.opacity : 0,
                            mixBlendMode: layer.blendMode,
                            pointerEvents: layer.id === activeLayerId ? 'auto' : 'none'
                        }}
                    >
                        <Canvas
                            ref={(el) => {
                                canvasRefs.current[layer.id] = el;
                            }}
                            brushColor={brushColor}
                            brushSize={brushSize}
                            isEraser={isEraser}
                            onHistoryChange={(state) => handleHistoryChange(layer.id, state)}
                            isActive={layer.id === activeLayerId}
                        />
                    </div>
                ))}
            </div>

            <TopBar
                currentColor={brushColor}
                onColorChange={handleColorChange}
                isEraser={isEraser}
                onToolChange={setIsEraser}
                layersOpen={layersOpen}
                onToggleLayers={() => setLayersOpen((v) => !v)}
            />

            <LeftRail
                currentSize={brushSize}
                onSizeChange={setBrushSize}
                opacity={activeLayer.opacity}
                onOpacityChange={(v) => changeLayerOpacity(activeLayer.id, v)}
                onUndo={() => getActiveCanvas()?.undo()}
                onRedo={() => getActiveCanvas()?.redo()}
                onClear={() => getActiveCanvas()?.clear()}
                canUndo={activeHistory.canUndo}
                canRedo={activeHistory.canRedo}
            />

            <LayersPanel
                open={layersOpen}
                layers={layers}
                activeLayerId={activeLayerId}
                onAddLayer={addLayer}
                onSelectLayer={(id) => {
                    setActiveLayerId(id);
                    refreshThumb(id);
                }}
                onToggleVisibility={toggleLayerVisibility}
                onDeleteLayer={deleteLayer}
                onBlendChange={changeLayerBlend}
            />
        </div>
    );
}

export default App;

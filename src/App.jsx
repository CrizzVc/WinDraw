import React, { useState, useRef, useEffect } from 'react';
import Canvas from './components/Canvas';
import FloatingToolbar from './components/FloatingToolbar';
import LayersPanel from './components/LayersPanel';

function App() {
    const [layers, setLayers] = useState([{ id: Date.now(), visible: true, opacity: 1 }]);
    const [activeLayerId, setActiveLayerId] = useState(layers[0].id);
    const canvasRefs = useRef({});

    const [brushColor, setBrushColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(5);
    const [isEraser, setIsEraser] = useState(false);
    const [historyStates, setHistoryStates] = useState({});

    // Layers Management
    const addLayer = () => {
        const newLayer = { id: Date.now(), visible: true, opacity: 1 };
        setLayers([newLayer, ...layers]);
        setActiveLayerId(newLayer.id);
    };

    const deleteLayer = (id) => {
        if (layers.length <= 1) return;
        const newLayers = layers.filter(l => l.id !== id);
        setLayers(newLayers);
        if (activeLayerId === id) {
            setActiveLayerId(newLayers[0].id);
        }

        // Cleanup ref
        delete canvasRefs.current[id];
    };

    const toggleLayerVisibility = (id) => {
        setLayers(layers.map(l =>
            l.id === id ? { ...l, visible: !l.visible } : l
        ));
    };

    const changeLayerOpacity = (id, newOpacity) => {
        setLayers(layers.map(l =>
            l.id === id ? { ...l, opacity: newOpacity } : l
        ));
    };

    const handleHistoryChange = (layerId, state) => {
        setHistoryStates(prev => ({
            ...prev,
            [layerId]: state
        }));
    };

    const activeHistory = historyStates[activeLayerId] || { canUndo: false, canRedo: false };
    const getActiveCanvas = () => canvasRefs.current[activeLayerId];

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
            <FloatingToolbar
                currentColor={brushColor}
                onColorChange={setBrushColor}
                currentSize={brushSize}
                onSizeChange={setBrushSize}
                isEraser={isEraser}
                onEraserToggle={() => setIsEraser(!isEraser)}
                onClear={() => getActiveCanvas()?.clear()}
                onUndo={() => getActiveCanvas()?.undo()}
                onRedo={() => getActiveCanvas()?.redo()}
                canUndo={activeHistory.canUndo}
                canRedo={activeHistory.canRedo}
            />

            <LayersPanel
                layers={layers}
                activeLayerId={activeLayerId}
                onAddLayer={addLayer}
                onSelectLayer={setActiveLayerId}
                onToggleVisibility={toggleLayerVisibility}
                onDeleteLayer={deleteLayer}
                onChangeOpacity={changeLayerOpacity}
            />

            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
                {/* Render bottom up to respect canvas stacking */}
                {[...layers].reverse().map((layer) => (
                    <div
                        key={layer.id}
                        style={{
                            position: 'absolute',
                            top: 0, left: 0,
                            width: '100%', height: '100%',
                            opacity: layer.visible ? layer.opacity : 0,
                            pointerEvents: layer.id === activeLayerId ? 'auto' : 'none'
                        }}
                    >
                        <Canvas
                            ref={el => canvasRefs.current[layer.id] = el}
                            brushColor={brushColor}
                            brushSize={brushSize}
                            isEraser={isEraser}
                            onHistoryChange={(state) => handleHistoryChange(layer.id, state)}
                            isActive={layer.id === activeLayerId}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;

import React, { useState, useRef } from 'react';
import Canvas from './components/Canvas';
import FloatingToolbar from './components/FloatingToolbar';

function App() {
    const canvasRef = useRef(null);
    const [brushColor, setBrushColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(5);
    const [isEraser, setIsEraser] = useState(false);
    const [historyState, setHistoryState] = useState({ canUndo: false, canRedo: false });

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            <FloatingToolbar
                currentColor={brushColor}
                onColorChange={setBrushColor}
                currentSize={brushSize}
                onSizeChange={setBrushSize}
                isEraser={isEraser}
                onEraserToggle={() => setIsEraser(!isEraser)}
                onClear={() => canvasRef.current?.clear()}
                onUndo={() => canvasRef.current?.undo()}
                onRedo={() => canvasRef.current?.redo()}
                canUndo={historyState.canUndo}
                canRedo={historyState.canRedo}
            />
            <Canvas
                ref={canvasRef}
                brushColor={brushColor}
                brushSize={brushSize}
                isEraser={isEraser}
                onHistoryChange={setHistoryState}
            />
        </div>
    );
}

export default App;

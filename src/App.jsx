import React, { useState } from 'react';
import Canvas from './components/Canvas';
import FloatingToolbar from './components/FloatingToolbar';

function App() {
    const [brushColor, setBrushColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(5);

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            <FloatingToolbar
                currentColor={brushColor}
                onColorChange={setBrushColor}
                currentSize={brushSize}
                onSizeChange={setBrushSize}
            />
            <Canvas brushColor={brushColor} brushSize={brushSize} />
        </div>
    );
}

export default App;

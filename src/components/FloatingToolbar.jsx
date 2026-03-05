import React from 'react';
import './FloatingToolbar.css';

const FloatingToolbar = ({
    currentColor,
    onColorChange,
    currentSize,
    onSizeChange,
    isEraser,
    onEraserToggle,
    onClear,
    onUndo,
    onRedo,
    canUndo,
    canRedo
}) => {
    const presetColors = ['#000000', '#FF3B30', '#4CD964', '#007AFF', '#FFCC00'];

    return (
        <div className="floating-toolbar">
            <div className="toolbar-section">
                <label>Tamaño</label>
                <input
                    type="range"
                    min="1"
                    max="50"
                    value={currentSize}
                    onChange={(e) => onSizeChange(parseInt(e.target.value))}
                    className="slider"
                />
                <span className="size-indicator">{currentSize}px</span>
            </div>

            <div className="separator"></div>

            <div className="toolbar-section colors">
                {presetColors.map((color) => (
                    <button
                        key={color}
                        className={`color - btn ${currentColor === color && !isEraser ? 'active' : ''} `}
                        style={{ backgroundColor: color }}
                        onClick={() => {
                            if (isEraser) onEraserToggle();
                            onColorChange(color);
                        }}
                        aria-label={`Color ${color} `}
                    />
                ))}
                <input
                    type="color"
                    value={currentColor}
                    disabled={isEraser}
                    onChange={(e) => {
                        if (isEraser) onEraserToggle();
                        onColorChange(e.target.value);
                    }}
                    className={`color - picker ${isEraser ? 'disabled' : ''} `}
                />
            </div>

            <div className="separator"></div>

            <div className="toolbar-section tools">
                <button
                    className={`tool - btn ${!isEraser ? 'active' : ''} `}
                    onClick={() => isEraser && onEraserToggle()}
                    title="Pincel"
                >
                    ✏️
                </button>
                <button
                    className={`tool - btn ${isEraser ? 'active' : ''} `}
                    onClick={() => !isEraser && onEraserToggle()}
                    title="Borrador"
                >
                    🧽
                </button>
            </div>

            <div className="separator"></div>

            <div className="toolbar-section actions">
                <button className="tool-btn action-btn disabled-check" onClick={onUndo} disabled={!canUndo} title="Deshacer">↩️</button>
                <button className="tool-btn action-btn disabled-check" onClick={onRedo} disabled={!canRedo} title="Rehacer">↪️</button>
                <button className="tool-btn action-btn danger" onClick={onClear} title="Limpiar Lienzo">🗑️</button>
            </div>

        </div>
    );
};

export default FloatingToolbar;

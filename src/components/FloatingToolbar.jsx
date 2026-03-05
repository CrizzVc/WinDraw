import React from 'react';
import './FloatingToolbar.css';

const FloatingToolbar = ({ currentColor, onColorChange, currentSize, onSizeChange }) => {
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
                        className={`color-btn ${currentColor === color ? 'active' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => onColorChange(color)}
                        aria-label={`Color ${color}`}
                    />
                ))}
                <input
                    type="color"
                    value={currentColor}
                    onChange={(e) => onColorChange(e.target.value)}
                    className="color-picker"
                />
            </div>
        </div>
    );
};

export default FloatingToolbar;

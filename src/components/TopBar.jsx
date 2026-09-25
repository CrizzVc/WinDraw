import React, { useState, useRef, useEffect } from 'react';
import './TopBar.css';
import { BrushIcon, EraserIcon, LayersIcon } from './icons';

const PRESET_COLORS = ['#000000', '#FFFFFF', '#FF3B30', '#FFCC00', '#4CD964', '#007AFF'];

const TopBar = ({
    currentColor,
    onColorChange,
    isEraser,
    onToolChange,
    layersOpen,
    onToggleLayers
}) => {
    const [colorOpen, setColorOpen] = useState(false);
    const colorRef = useRef(null);

    useEffect(() => {
        if (!colorOpen) return;
        const close = (e) => {
            if (colorRef.current && !colorRef.current.contains(e.target)) {
                setColorOpen(false);
            }
        };
        document.addEventListener('pointerdown', close);
        return () => document.removeEventListener('pointerdown', close);
    }, [colorOpen]);

    return (
        <header className="top-bar">
            <div className="top-bar-left">
                <span className="brand">Galería</span>
            </div>

            <div className="top-bar-right">
                <button
                    className={`top-btn ${!isEraser ? 'active' : ''}`}
                    onClick={() => onToolChange(false)}
                    title="Pincel"
                >
                    <BrushIcon />
                </button>
                <button
                    className={`top-btn ${isEraser ? 'active' : ''}`}
                    onClick={() => onToolChange(true)}
                    title="Borrador"
                >
                    <EraserIcon />
                </button>
                <button
                    className={`top-btn layers-toggle ${layersOpen ? 'panel-open' : ''}`}
                    onClick={onToggleLayers}
                    title="Capas"
                >
                    <LayersIcon />
                </button>

                <div className="color-control" ref={colorRef}>
                    <button
                        className={`color-circle ${isEraser ? 'dimmed' : ''}`}
                        style={{ backgroundColor: currentColor }}
                        onClick={() => setColorOpen((v) => !v)}
                        title="Color"
                    />
                    {colorOpen && (
                        <div className="color-popover">
                            <span className="popover-title">Color</span>
                            <div className="color-grid">
                                {PRESET_COLORS.map((color) => (
                                    <button
                                        key={color}
                                        className={`swatch ${currentColor.toLowerCase() === color.toLowerCase() && !isEraser ? 'selected' : ''}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => {
                                            onColorChange(color);
                                            setColorOpen(false);
                                        }}
                                        aria-label={`Color ${color}`}
                                    />
                                ))}
                                <label className="swatch custom" title="Color personalizado">
                                    <input
                                        type="color"
                                        value={currentColor}
                                        onChange={(e) => onColorChange(e.target.value)}
                                    />
                                </label>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default TopBar;

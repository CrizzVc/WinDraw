import React from 'react';
import './LeftRail.css';
import { UndoIcon, RedoIcon, TrashIcon } from './icons';

const buildTrack = (percent) => ({
    background: `linear-gradient(90deg, rgba(255,255,255,0.55) ${percent}%, rgba(255,255,255,0.14) ${percent}%)`
});

const LeftRail = ({
    currentSize,
    onSizeChange,
    opacity,
    onOpacityChange,
    onUndo,
    onRedo,
    onClear,
    canUndo,
    canRedo
}) => {
    const sizePercent = ((currentSize - 1) / 49) * 100;
    const opacityPercent = Math.round(opacity * 100);

    return (
        <div className="left-rail">
            <div className="rail-section">
                <div className="v-slider-box">
                    <input
                        type="range"
                        min="1"
                        max="50"
                        value={currentSize}
                        onChange={(e) => onSizeChange(parseInt(e.target.value, 10))}
                        className="v-slider"
                        style={buildTrack(sizePercent)}
                        title="Tamaño del pincel"
                    />
                </div>
                <span className="rail-value">{currentSize}</span>
            </div>

            <div className="rail-sep" />

            <div className="rail-section">
                <div className="v-slider-box">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={opacityPercent}
                        onChange={(e) => onOpacityChange(parseInt(e.target.value, 10) / 100)}
                        className="v-slider"
                        style={buildTrack(opacityPercent)}
                        title="Opacidad de la capa"
                    />
                </div>
                <span className="rail-value">{opacityPercent}%</span>
            </div>

            <div className="rail-sep" />

            <div className="rail-actions">
                <button className="rail-btn" onClick={onUndo} disabled={!canUndo} title="Deshacer">
                    <UndoIcon />
                </button>
                <button className="rail-btn" onClick={onRedo} disabled={!canRedo} title="Rehacer">
                    <RedoIcon />
                </button>
                <button className="rail-btn danger" onClick={onClear} title="Limpiar capa">
                    <TrashIcon />
                </button>
            </div>
        </div>
    );
};

export default LeftRail;

import React from 'react';
import './LayersPanel.css';

const LayersPanel = ({ layers, activeLayerId, onAddLayer, onSelectLayer, onToggleVisibility, onDeleteLayer, onChangeOpacity }) => {
    return (
        <div className="layers-panel">
            <div className="layers-header">
                <h3>Capas</h3>
                <button className="add-layer-btn" onClick={onAddLayer} title="Añadir Capa">
                    +
                </button>
            </div>

            <div className="layers-list">
                {layers.map((layer, index) => (
                    <div
                        key={layer.id}
                        className={`layer-item ${activeLayerId === layer.id ? 'active' : ''}`}
                        onClick={() => onSelectLayer(layer.id)}
                    >
                        <button
                            className={`visibility-btn ${!layer.visible ? 'hidden' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleVisibility(layer.id);
                            }}
                            title={layer.visible ? "Ocultar Capa" : "Mostrar Capa"}
                        >
                            👁️
                        </button>
                        <div className="layer-main">
                            <span className="layer-name">Capa {layers.length - index}</span>
                            {layers.length > 1 && (
                                <button
                                    className="delete-layer-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteLayer(layer.id);
                                    }}
                                    title="Eliminar Capa"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                        {activeLayerId === layer.id && (
                            <div className="layer-opacity-control">
                                <span className="opacity-label">Opacidad</span>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={layer.opacity}
                                    onChange={(e) => onChangeOpacity(layer.id, parseFloat(e.target.value))}
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <span className="opacity-value">{Math.round(layer.opacity * 100)}%</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LayersPanel;

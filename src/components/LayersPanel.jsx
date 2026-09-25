import React from 'react';
import './LayersPanel.css';
import { PlusIcon, CloseIcon, CheckIcon } from './icons';

export const BLEND_MODES = [
    { code: 'N', name: 'Normal', css: 'normal' },
    { code: 'M', name: 'Multiplicar', css: 'multiply' },
    { code: 'S', name: 'Tramar', css: 'screen' },
    { code: 'O', name: 'Superponer', css: 'overlay' },
    { code: 'HI', name: 'Luz fuerte', css: 'hard-light' }
];

const blendIndex = (css) => {
    const i = BLEND_MODES.findIndex((m) => m.css === css);
    return i === -1 ? 0 : i;
};

const LayersPanel = ({
    open,
    layers,
    activeLayerId,
    onAddLayer,
    onSelectLayer,
    onToggleVisibility,
    onDeleteLayer,
    onBlendChange
}) => {
    return (
        <aside className={`layers-panel ${open ? '' : 'closed'}`}>
            <div className="layers-header">
                <h3>Capas</h3>
                <button className="add-layer-btn" onClick={onAddLayer} title="Añadir capa">
                    <PlusIcon width={20} height={20} />
                </button>
            </div>

            <div className="layers-list">
                {layers.map((layer, index) => {
                    const isActive = activeLayerId === layer.id;
                    const currentBlend = BLEND_MODES[blendIndex(layer.blendMode)];
                    const nextBlend = BLEND_MODES[(blendIndex(layer.blendMode) + 1) % BLEND_MODES.length];

                    return (
                        <div
                            key={layer.id}
                            className={`layer-item ${isActive ? 'active' : ''}`}
                            onClick={() => onSelectLayer(layer.id)}
                        >
                            <div className="layer-thumb">
                                {layer.thumb && <img src={layer.thumb} alt="" draggable={false} />}
                            </div>

                            <div className="layer-info">
                                <span className="layer-name">Capa {layers.length - index}</span>
                                <button
                                    className="blend-chip"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onBlendChange(layer.id, nextBlend.css);
                                    }}
                                    title={`Modo de mezcla: ${currentBlend.name} (clic para cambiar)`}
                                >
                                    {currentBlend.code}
                                </button>
                                {layers.length > 1 && (
                                    <button
                                        className="delete-layer-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteLayer(layer.id);
                                        }}
                                        title="Eliminar capa"
                                    >
                                        <CloseIcon width={15} height={15} />
                                    </button>
                                )}
                            </div>

                            <button
                                className={`visibility-check ${layer.visible ? 'on' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleVisibility(layer.id);
                                }}
                                title={layer.visible ? 'Ocultar capa' : 'Mostrar capa'}
                            >
                                {layer.visible && <CheckIcon width={14} height={14} strokeWidth={2.6} />}
                            </button>
                        </div>
                    );
                })}
            </div>
        </aside>
    );
};

export default LayersPanel;

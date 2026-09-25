import React, { useState } from 'react';
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
    onBlendChange,
    onReorder
}) => {
    const [dragId, setDragId] = useState(null);
    const [overId, setOverId] = useState(null);
    const [dropSide, setDropSide] = useState(null);

    const clearDragState = () => {
        setDragId(null);
        setOverId(null);
        setDropSide(null);
    };

    const handleDragStart = (e, id) => {
        setDragId(id);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(id));
    };

    const handleDragOver = (e, id) => {
        if (dragId === null || dragId === id) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const rect = e.currentTarget.getBoundingClientRect();
        const side = e.clientY < rect.top + rect.height / 2 ? 'top' : 'bottom';
        if (overId !== id || dropSide !== side) {
            setOverId(id);
            setDropSide(side);
        }
    };

    const handleDrop = (e, id) => {
        e.preventDefault();
        if (dragId !== null && dragId !== id) {
            onReorder(dragId, id, dropSide || 'bottom');
        }
        clearDragState();
    };

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
                    const isDragged = dragId === layer.id;
                    const showIndicator = dragId !== null && overId === layer.id && !isDragged;

                    return (
                        <div
                            key={layer.id}
                            data-layer-id={layer.id}
                            className={[
                                'layer-item',
                                isActive ? 'active' : '',
                                isDragged ? 'dragging' : '',
                                showIndicator ? `drop-${dropSide}` : ''
                            ].join(' ').trim()}
                            draggable
                            onDragStart={(e) => handleDragStart(e, layer.id)}
                            onDragOver={(e) => handleDragOver(e, layer.id)}
                            onDrop={(e) => handleDrop(e, layer.id)}
                            onDragEnd={clearDragState}
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

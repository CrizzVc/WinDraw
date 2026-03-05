import React, { useRef, useEffect, useState } from 'react';

const Canvas = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastPoint, setLastPoint] = useState(null);

    // Set up logical vs physical canvas size
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resizeCanvas = () => {
            const parent = canvas.parentElement;
            if (!parent) return;

            const rect = parent.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;

            // Obtenemos el contexto
            const ctx = canvas.getContext('2d');
            // Guardamos la configuración visual antes de limpiar
            const lineCap = ctx.lineCap || 'round';
            const lineJoin = ctx.lineJoin || 'round';
            const strokeStyle = ctx.strokeStyle || '#f5f5f7';
            const lineWidth = ctx.lineWidth || 5;

            // Physical scale
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;

            // CSS display size
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;

            // Normalize coordinate system to CSS pixels
            ctx.scale(dpr, dpr);

            // Restauramos la configuración
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = '#f5f5f7'; // var(--text-main)
            ctx.lineWidth = 5;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        return () => window.removeEventListener('resize', resizeCanvas);
    }, []);

    const startDrawing = (e) => {
        const { offsetX, offsetY, pressure, pointerType } = e.nativeEvent;

        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);

        setIsDrawing(true);
        setLastPoint({ x: offsetX, y: offsetY, pressure: pointerType === 'pen' ? pressure : 1 });
    };

    const draw = (e) => {
        if (!isDrawing) return;

        const { offsetX, offsetY, pressure, pointerType } = e.nativeEvent;
        const ctx = canvasRef.current.getContext('2d');

        // Basic smooth path
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();

        setLastPoint({ x: offsetX, y: offsetY, pressure: pointerType === 'pen' ? pressure : 1 });
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        const ctx = canvasRef.current.getContext('2d');
        ctx.closePath();
        setIsDrawing(false);
        setLastPoint(null);
    };

    return (
        <canvas
            ref={canvasRef}
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerOut={stopDrawing}
            style={{
                display: 'block',
                touchAction: 'none', // Prevent scrolling and zooming while drawing
                cursor: 'crosshair',
            }}
        />
    );
};

export default Canvas;

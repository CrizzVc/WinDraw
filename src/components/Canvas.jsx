import React, { useRef, useEffect, useState } from 'react';

const Canvas = ({ brushColor = '#000000', brushSize = 5 }) => {
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

            const ctx = canvas.getContext('2d');

            // Save image data so we don't lose drawing on window resize
            let imageData = null;
            if (canvas.width > 0 && canvas.height > 0) {
                imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            }

            // Physical scale
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;

            // CSS display size
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;

            // Normalize coordinate system to CSS pixels
            ctx.scale(dpr, dpr);

            // Restore image data
            if (imageData) {
                ctx.putImageData(imageData, 0, 0);
            }
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        return () => window.removeEventListener('resize', resizeCanvas);
    }, []);

    const startDrawing = (e) => {
        const { offsetX, offsetY, pressure, pointerType } = e.nativeEvent;

        const ctx = canvasRef.current.getContext('2d');

        // Set current styles here to avoid using them in useEffect dependencies
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize;

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

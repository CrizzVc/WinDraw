import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

const Canvas = forwardRef(({ brushColor = '#000000', brushSize = 5, isEraser = false, onHistoryChange }, ref) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastPoint, setLastPoint] = useState(null);
    const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
    const [isHovering, setIsHovering] = useState(false);

    // History State
    const historyRef = useRef([]);
    const historyStepRef = useRef(-1);

    const saveHistory = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // slice history if we undid before saving new
        const nextStep = historyStepRef.current + 1;
        historyRef.current.splice(nextStep);

        // limit history size to 20 states
        if (historyRef.current.length >= 20) {
            historyRef.current.shift();
        } else {
            historyStepRef.current += 1;
        }

        historyRef.current.push(data);
        updateHistoryState();
    };

    const updateHistoryState = () => {
        if (onHistoryChange) {
            onHistoryChange({
                canUndo: historyStepRef.current > 0,
                canRedo: historyStepRef.current < historyRef.current.length - 1
            });
        }
    };

    useImperativeHandle(ref, () => ({
        clear: () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            saveHistory();
        },
        undo: () => {
            if (historyStepRef.current > 0) {
                historyStepRef.current -= 1;
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                ctx.putImageData(historyRef.current[historyStepRef.current], 0, 0);
                updateHistoryState();
            }
        },
        redo: () => {
            if (historyStepRef.current < historyRef.current.length - 1) {
                historyStepRef.current += 1;
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                ctx.putImageData(historyRef.current[historyStepRef.current], 0, 0);
                updateHistoryState();
            }
        }
    }));

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
            } else if (historyRef.current.length === 0) {
                // Initialize first history entry if empty
                saveHistory();
            }
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        return () => window.removeEventListener('resize', resizeCanvas);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const startDrawing = (e) => {
        const { offsetX, offsetY, pressure, pointerType } = e.nativeEvent;

        const ctx = canvasRef.current.getContext('2d');

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize;
        ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';

        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);

        setIsDrawing(true);
        setLastPoint({ x: offsetX, y: offsetY, pressure: pointerType === 'pen' ? pressure : 1 });
    };

    const draw = (e) => {
        const { offsetX, offsetY, pressure, pointerType } = e.nativeEvent;

        // Update custom cursor
        setCursorPos({ x: offsetX, y: offsetY });

        if (!isDrawing) return;

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

        saveHistory();
    };

    return (
        <div
            style={{ width: '100%', height: '100%', position: 'relative' }}
            onPointerEnter={() => setIsHovering(true)}
            onPointerLeave={() => { setIsHovering(false); stopDrawing(); }}
        >
            <canvas
                ref={canvasRef}
                onPointerDown={startDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
                style={{
                    display: 'block',
                    touchAction: 'none', // Prevent scrolling and zooming while drawing
                    cursor: 'none', // Hide default cursor so we can show our custom one
                }}
            />
            {/* Custom Cursor Overlay */}
            {isHovering && (
                <div
                    style={{
                        position: 'absolute',
                        left: cursorPos.x,
                        top: cursorPos.y,
                        width: brushSize,
                        height: brushSize,
                        borderRadius: '50%',
                        backgroundColor: isEraser ? 'rgba(255,255,255,0.5)' : brushColor,
                        border: '1px solid #000000', // Black border for visibility on any background
                        boxShadow: '0 0 0 1px rgba(255,255,255,0.8)', // Inner white ring for contrast
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none',
                        zIndex: 9999
                    }}
                />
            )}
        </div>
    );
});

export default Canvas;

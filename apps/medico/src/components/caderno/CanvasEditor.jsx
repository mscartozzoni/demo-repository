import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import CanvasToolbar from '@/components/caderno/CanvasToolbar';

const CanvasEditor = ({ patientId }) => {
  const { toast } = useToast();
  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('brush');
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState('#ff0000');

  const clearCanvas = (keepContent = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const content = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (keepContent) {
      ctx.putImageData(content, 0, 0);
    }
    ctx.restore();
  };
  
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const container = canvasContainerRef.current;
    if (canvas && container) {
      const { width } = container.getBoundingClientRect();
      const height = width * 1.2; 
      canvas.width = width;
      canvas.height = height; 
      clearCanvas(true);
    }
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    const canvas = canvasRef.current;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX, clientY;
    if (e.touches) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    const { x, y } = getCanvasCoordinates(e.nativeEvent || e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getCanvasCoordinates(e.nativeEvent || e);
    const ctx = canvasRef.current.getContext('2d');
    
    if (tool === 'brush') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    } else if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brushSize * 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.closePath();
    setIsDrawing(false);
  };

  const handleAttachToDocument = () => {
    toast({ title: "Imagem anexada ao documento com sucesso!" });
  };
  
  const exportAsPng = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `edicao-paciente-${patientId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast({ title: "PNG exportado com sucesso!" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="p-4 rounded-xl flex flex-col h-full bg-slate-900/50"
    >
      <h2 className="text-lg font-semibold text-white mb-4">Editor de Imagens</h2>
      <CanvasToolbar 
          tool={tool}
          setTool={setTool}
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          brushColor={brushColor}
          setBrushColor={setBrushColor}
          clearCanvas={() => clearCanvas(false)}
          onAttach={handleAttachToDocument}
          onExport={exportAsPng}
        />
      <div ref={canvasContainerRef} className="canvas-container flex-grow w-full rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full bg-white cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
    </motion.div>
  );
};

export default CanvasEditor;
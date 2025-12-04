import React from 'react';
import {
  Brush,
  Eraser,
  RotateCcw,
  Type,
  ArrowRight,
  FileText,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';

const CanvasToolbar = ({
  tool,
  setTool,
  brushSize,
  setBrushSize,
  brushColor,
  setBrushColor,
  clearCanvas,
  onAttach,
  onExport
}) => {
  const { toast } = useToast();

  const toolButtons = [
    { name: 'brush', icon: Brush, tooltip: 'Pincel' },
    { name: 'eraser', icon: Eraser, tooltip: 'Borracha' },
    { name: 'text', icon: Type, tooltip: 'Texto (em breve)' },
    { name: 'arrow', icon: ArrowRight, tooltip: 'Seta (em breve)' },
  ];

  const handleToolClick = (toolName) => {
    if (['text', 'arrow'].includes(toolName)) {
      toast({ title: `🚧 Ferramenta de ${toolName} ainda não foi implementada! 🚀` });
      return;
    }
    setTool(toolName);
  };

  return (
    <div className="glass-effect p-2 rounded-lg flex flex-wrap items-center justify-between gap-4 mb-4">
      <div className="flex items-center gap-2">
        {toolButtons.map(({ name, icon: Icon, tooltip }) => (
          <Button
            key={name}
            variant={tool === name ? 'default' : 'ghost'}
            size="icon"
            onClick={() => handleToolClick(name)}
            title={tooltip}
          >
            <Icon className="w-5 h-5" />
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="h-auto p-2">
              <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full border border-slate-500" style={{ backgroundColor: brushColor }}></div>
                  <span className="text-sm font-normal">{brushSize}px</span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-4">
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground">Cor</label>
                <input
                  type="color"
                  value={brushColor}
                  onChange={(e) => setBrushColor(e.target.value)}
                  className="w-full h-8 rounded border-none bg-transparent cursor-pointer p-0"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Tamanho: {brushSize}px</label>
                <Slider
                    value={[brushSize]}
                    onValueChange={(value) => setBrushSize(value[0])}
                    min={1}
                    max={50}
                    step={1}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={clearCanvas} title="Limpar tudo">
          <RotateCcw className="w-5 h-5" />
        </Button>
        <Button onClick={onAttach} size="icon" title="Anexar ao Documento">
          <FileText className="w-5 h-5" />
        </Button>
        <Button onClick={onExport} variant="outline" size="icon" title="Exportar PNG">
          <Download className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default CanvasToolbar;
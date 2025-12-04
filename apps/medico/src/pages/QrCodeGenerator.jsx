import React, { useState, useRef } from 'react';
    import { Helmet } from 'react-helmet';
    import { motion } from 'framer-motion';
    import { QRCodeCanvas } from 'qrcode.react';
    import { Input } from '@/components/ui/input';
    import { Button } from '@/components/ui/button';
    import { Label } from '@/components/ui/label';
    import { Slider } from '@/components/ui/slider';
    import { Download, QrCode } from 'lucide-react';

    const QrCodeGenerator = () => {
        const [value, setValue] = useState('https://www.hostinger.com.br');
        const [qrValue, setQrValue] = useState('https://www.hostinger.com.br');
        const [fgColor, setFgColor] = useState('#0d1117');
        const [bgColor, setBgColor] = useState('#ffffff');
        const [size, setSize] = useState(256);

        const qrRef = useRef(null);

        const handleGenerate = () => {
            setQrValue(value);
        };

        const handleDownload = () => {
            const canvas = qrRef.current.querySelector('canvas');
            const image = canvas.toDataURL("image/png");
            const anchor = document.createElement("a");
            anchor.href = image;
            anchor.download = `qrcode.png`;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
        };

        const colorPresets = [
            { name: 'Padrão', fg: '#0d1117', bg: '#ffffff' },
            { name: 'Oceano', fg: '#004d7a', bg: '#e0f7fa' },
            { name: 'Vulcão', fg: '#d4380d', bg: '#fff2e8' },
            { name: 'Névoa', fg: '#546e7a', bg: '#eceff1' },
            { name: 'Hortelã', fg: '#00897b', bg: '#e0f2f1' },
            { name: 'Ametista', fg: '#6a1b9a', bg: '#f3e5f5' },
        ];


        return (
            <>
                <Helmet>
                    <title>Gerador de QR Code - Portal do Médico</title>
                    <meta name="description" content="Gere e personalize QR Codes facilmente." />
                </Helmet>
                <div className="max-w-4xl mx-auto space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
                            <QrCode className="w-8 h-8 text-primary" />
                            Gerador de QR Code
                        </h1>
                        <p className="text-slate-400 mt-2">Crie, personalize e baixe QR Codes em segundos.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="glass-effect p-6 rounded-xl space-y-6"
                        >
                            <div>
                                <Label htmlFor="qr-input" className="text-slate-300 mb-2 block">Texto ou URL</Label>
                                <Input
                                    id="qr-input"
                                    type="text"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    placeholder="Digite o texto ou URL aqui"
                                />
                            </div>
                            <Button onClick={handleGenerate} className="w-full">
                                <QrCode className="mr-2 h-4 w-4" /> Gerar QR Code
                            </Button>

                            <div className="space-y-4 pt-4 border-t border-border">
                                <h3 className="text-lg font-semibold text-white">Personalização</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="fg-color" className="text-slate-300 mb-2 block text-sm">Cor do Código</Label>
                                        <Input id="fg-color" type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-full h-10 p-1" />
                                    </div>
                                    <div>
                                        <Label htmlFor="bg-color" className="text-slate-300 mb-2 block text-sm">Cor do Fundo</Label>
                                        <Input id="bg-color" type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 p-1" />
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-slate-300 mb-2 block text-sm">Temas Rápidos</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {colorPresets.map(preset => (
                                            <button key={preset.name} onClick={() => { setFgColor(preset.fg); setBgColor(preset.bg); }} className="p-2 rounded-md border-2 border-transparent hover:border-primary transition-all">
                                                <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.fg }}></div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="size" className="text-slate-300 mb-2 block">Tamanho ({size}px)</Label>
                                    <Slider
                                        id="size"
                                        min={64}
                                        max={1024}
                                        step={8}
                                        value={[size]}
                                        onValueChange={(value) => setSize(value[0])}
                                    />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex flex-col items-center justify-center glass-effect p-6 rounded-xl"
                        >
                            <div
                                ref={qrRef}
                                className="bg-white p-4 rounded-lg shadow-lg border border-border"
                                style={{ backgroundColor: bgColor }}
                            >
                                {qrValue ? (
                                    <QRCodeCanvas
                                        value={qrValue}
                                        size={size}
                                        fgColor={fgColor}
                                        bgColor={bgColor}
                                        level={"H"}
                                        includeMargin={true}
                                    />
                                ) : (
                                    <div
                                        className="flex items-center justify-center text-center text-slate-400"
                                        style={{ width: size, height: size }}
                                    >
                                        A pré-visualização do seu QR Code aparecerá aqui.
                                    </div>
                                )}
                            </div>
                            <Button onClick={handleDownload} className="mt-6 w-full max-w-xs" disabled={!qrValue}>
                                <Download className="mr-2 h-4 w-4" /> Baixar PNG
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </>
        );
    };

    export default QrCodeGenerator;
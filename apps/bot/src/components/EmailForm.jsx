
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

// Vite env helper: safely read import.meta.env with fallback
function env(name, fallback = '') {
  try {
    // eslint-disable-next-line no-undef
    return (import.meta && import.meta.env && import.meta.env[name]) ?? fallback;
  } catch (_) {
    return fallback;
  }
}

/**
 * EmailForm.jsx
 * Reusable form to send emails
 */
export default function EmailForm() {
  const { toast } = useToast();
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [from] = useState(env('VITE_EMAIL_FROM', 'contato@marcioplasticsurgery.com'));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    toast({
        title: "🚧 Envio de e-mail não implementado!",
        description: "Esta é uma simulação. Nenhuma mensagem foi enviada.",
        variant: "destructive"
    });
    
    console.log("Simulando envio de e-mail:", { to, from, subject, body });

    // Simulação de sucesso para fins de UI
    setTimeout(() => {
        setResult({ message: 'Simulação de envio bem-sucedida!', to, subject });
        setLoading(false);
    }, 1000);
  };

  return (
    <Card className="max-w-2xl mx-auto glass-effect-soft">
        <CardHeader>
            <CardTitle>Disparador de E-mail</CardTitle>
            <CardDescription>Crie e envie mensagens diretamente do sistema.</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="to">Para (to)</Label>
                    <Input id="to" type="email" required value={to} onChange={(e) => setTo(e.target.value)} placeholder="usuario@dominio.com" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="subject">Assunto (subject)</Label>
                    <Input id="subject" type="text" required value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Assunto do e-mail" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="from">Remetente (from)</Label>
                    <Input id="from" type="email" value={from} readOnly placeholder="remetente@dominio.com" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="body">Corpo HTML (body)</Label>
                    <Textarea id="body" rows={8} value={body} onChange={(e) => setBody(e.target.value)} placeholder="<strong>Olá!</strong> Escreva sua mensagem aqui." />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Enviando…' : 'Enviar E-mail (Simulação)'}
                </Button>

                {result && (
                    <div className="mt-4 p-4 bg-green-900/50 border border-green-700 rounded-lg">
                        <h4 className="font-bold text-green-300">Sucesso (Simulado)</h4>
                        <pre className="text-xs text-green-200 break-all whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
                    </div>
                )}

                {error && (
                    <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
                        <pre className="text-xs text-red-200 break-all whitespace-pre-wrap">{JSON.stringify(error, null, 2)}</pre>
                    </div>
                )}
            </form>
        </CardContent>
    </Card>
  );
}

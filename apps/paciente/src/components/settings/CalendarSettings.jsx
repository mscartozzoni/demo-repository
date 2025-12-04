import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Copy, Save, Link as LinkIcon } from 'lucide-react';

const CalendarSettings = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('AIzaSyA3tFf2mTIMA7ojDOHPrnCSJORW3pjlpjY');
  const [calendarId, setCalendarId] = useState('clinica@mscartozzoni.com.br');
  const availabilityLink = 'https://calendar.google.com/calendar/u/2?cid=Y2xpbmljYUBtc2NhcnRvenpvbmkuY29tLmJy';

  const handleSave = () => {
    toast({
      title: '🚧 Em Desenvolvimento',
      description: 'A funcionalidade de salvar as configurações da agenda será implementada em breve.',
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(availabilityLink);
    toast({
      title: 'Link Copiado!',
      description: 'O link de disponibilidade foi copiado para a área de transferência.',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Configurações da Agenda</CardTitle>
          <CardDescription>
            Integre sua agenda do Google Calendar para sincronizar eventos e compartilhar sua disponibilidade.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="google-api-key">Chave da API do Google Calendar</Label>
            <Input
              id="google-api-key"
              type="password"
              placeholder="Cole sua chave da API aqui"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="google-calendar-id">ID da Agenda do Google</Label>
            <Input
              id="clinica@mscartozzoni.com.br"
              placeholder="https://calendar.google.com/calendar/embed?src=clinica%40mscartozzoni.com.br&ctz=America%2FSao_Paulo"
              value={calendarId}
              onChange={(e) => setCalendarId(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="availability-link">Link da Agenda</Label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-grow">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="availability-link"
                  value={availabilityLink}
                  readOnly
                  className="pl-10 bg-slate-800/50"
                />
              </div>
              <Button variant="outline" size="icon" onClick={handleCopyLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-400">
              Compartilhe este link com pacientes para que eles possam ver seus horários livres.
            </p>
          </div>
          <div className="flex justify-end">
            <Button className="btn-primary" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Salvar Configurações
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CalendarSettings;
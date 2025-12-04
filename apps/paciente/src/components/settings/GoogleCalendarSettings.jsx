import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Save, Link as LinkIcon } from 'lucide-react';

const GoogleCalendarSettings = () => {
    const [calendarId, setCalendarId] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        const storedId = localStorage.getItem('googleCalendarId');
        if (storedId) {
            setCalendarId(storedId);
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('googleCalendarId', calendarId);
        toast({
            title: '✅ Salvo com sucesso!',
            description: 'Seu ID do Google Calendar foi salvo.',
        });
    };

    return (
        <Card className="glass-effect">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <img src="https://www.google.com/images/icons/product/calendar-32.png" alt="Google Calendar" className="w-8 h-8" />
                    <div>
                        <CardTitle>Integração com Google Calendar</CardTitle>
                        <CardDescription>
                            Exiba seu Google Calendar na página de Agenda.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="google-calendar-id">ID do Calendário do Google</Label>
                    <Input
                        id="google-calendar-id"
                        placeholder="seu-email@gmail.com ou o ID do calendário"
                        value={calendarId}
                        onChange={(e) => setCalendarId(e.target.value)}
                    />
                    <p className="text-xs text-gray-400 pt-1">
                        Você pode encontrar o ID nas configurações do seu Google Calendar, na seção "Integrar agenda". <a href="https://support.google.com/calendar/answer/41207?hl=pt-BR" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Saiba mais</a>.
                    </p>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar ID
                </Button>
            </CardFooter>
        </Card>
    );
};

export default GoogleCalendarSettings;
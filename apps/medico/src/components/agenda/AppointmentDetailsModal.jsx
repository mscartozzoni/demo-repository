import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, FileText, Video, Link as LinkIcon, Copy } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from "@/components/ui/use-toast";

const AppointmentDetailsModal = ({ isOpen, onClose, event }) => {
    const { toast } = useToast();

    if (!event) return null;

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text).then(() => {
            toast({
                title: "Copiado!",
                description: `O link de ${type} foi copiado para a área de transferência.`,
                className: "bg-green-600 text-white"
            });
        }, (err) => {
            toast({
                variant: "destructive",
                title: "Erro ao copiar",
                description: "Não foi possível copiar o link.",
            });
        });
    };

    const startTime = format(new Date(event.starts_at), 'HH:mm');
    const endTime = format(new Date(event.ends_at), 'HH:mm');
    const eventDate = format(new Date(event.starts_at), "EEEE, dd 'de' MMMM", { locale: ptBR });

    const DetailItem = ({ icon: Icon, label, value }) => (
        <div className="flex items-start gap-3">
            <Icon className="w-5 h-5 text-slate-400 mt-1" />
            <div>
                <p className="font-semibold text-slate-300">{label}</p>
                <p className="text-white">{value}</p>
            </div>
        </div>
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-slate-800 border-slate-700 text-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-3">
                        {event.whereby_link ? <Video className="text-blue-400" /> : <Calendar />}
                        {event.title}
                    </DialogTitle>
                    <DialogDescription>
                        Detalhes do agendamento.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <DetailItem icon={Calendar} label="Data" value={eventDate} />
                    <DetailItem icon={Clock} label="Horário" value={`${startTime} - ${endTime}`} />
                    {event.patient_id && <DetailItem icon={User} label="Paciente" value={event.patient_id} />}
                    {event.description && <DetailItem icon={FileText} label="Descrição" value={event.description} />}
                </div>

                {event.whereby_link && (
                    <div className="bg-slate-700/50 p-4 rounded-lg space-y-3">
                         <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><LinkIcon className="w-5 h-5"/> Links da Teleconsulta</h3>
                        <div className="flex items-center justify-between gap-2">
                           <div>
                               <p className="font-semibold text-slate-300">Link do Médico (Host)</p>
                               <a href={event.whereby_host_link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm truncate">{event.whereby_host_link}</a>
                           </div>
                            <Button size="icon" variant="ghost" onClick={() => copyToClipboard(event.whereby_host_link, "anfitrião")}>
                                <Copy className="w-4 h-4"/>
                            </Button>
                        </div>
                         <div className="flex items-center justify-between gap-2">
                           <div>
                               <p className="font-semibold text-slate-300">Link do Paciente</p>
                               <p className="text-blue-400 text-sm truncate">{event.whereby_link}</p>
                           </div>
                            <Button size="icon" variant="ghost" onClick={() => copyToClipboard(event.whereby_link, "paciente")}>
                                <Copy className="w-4 h-4"/>
                            </Button>
                        </div>
                    </div>
                )}
                
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} className="border-slate-600">Fechar</Button>
                    {event.whereby_host_link && (
                        <a href={event.whereby_host_link} target="_blank" rel="noopener noreferrer">
                            <Button>
                                <Video className="w-4 h-4 mr-2"/>
                                Entrar na Sala
                            </Button>
                        </a>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AppointmentDetailsModal;
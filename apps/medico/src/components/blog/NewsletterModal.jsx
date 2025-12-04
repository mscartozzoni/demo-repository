import React from 'react';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
    import { Button } from '@/components/ui/button';
    import { RocketIcon, PersonIcon } from '@radix-ui/react-icons';

    const NewsletterModal = ({ isOpen, onClose, post, onConfirm, isSending }) => {
      if (!post) return null;

      return (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="bg-slate-900 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle>Confirmar Envio de Newsletter</DialogTitle>
              <DialogDescription>
                Você está prestes a enviar o post "{post.title}" como uma newsletter para todos os seus assinantes.
              </DialogDescription>
            </DialogHeader>
            <div className="my-4 space-y-4">
              <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
                <h3 className="font-semibold text-lg text-white mb-2">{post.title}</h3>
                <div 
                  className="text-slate-300 text-sm max-h-40 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: post.content ? post.content.substring(0, 300) + '...' : '' }} 
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <PersonIcon className="w-4 h-4"/>
                <span>Isso será enviado para todos os pacientes com consentimento. (Funcionalidade simulada)</span>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">Cancelar</Button>
              </DialogClose>
              <Button onClick={onConfirm} disabled={isSending} className="bg-blue-600 hover:bg-blue-700">
                <RocketIcon className="w-4 h-4 mr-2" />
                {isSending ? 'Enviando...' : 'Confirmar e Enviar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    };

    export default NewsletterModal;
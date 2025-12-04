import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import QRCode from "qrcode.react";
import { useTheme } from '@/contexts/ThemeContext';

export const QrCodeModal = ({ isOpen, setIsOpen }) => {
  const { theme } = useTheme();
  const url = window.location.origin;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md glass-effect">
        <DialogHeader>
          <DialogTitle className="text-slate-800 dark:text-slate-200">Acesso Rápido Mobile</DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            Escaneie o QR Code com a câmera do seu celular para abrir o assistente.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center p-4 mt-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <QRCode
            value={url}
            size={256}
            bgColor={theme === 'dark' ? '#1e293b' : '#f1f5f9'}
            fgColor={theme === 'dark' ? '#e2e8f0' : '#0f172a'}
            level={"H"}
            includeMargin={true}
          />
        </div>
        <div className="text-center text-sm text-slate-500 dark:text-slate-400 mt-2 break-all">
          {url}
        </div>
      </DialogContent>
    </Dialog>
  );
};
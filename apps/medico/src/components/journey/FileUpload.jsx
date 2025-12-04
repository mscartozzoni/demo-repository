import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, File, X, Paperclip } from 'lucide-react';

const FileUpload = ({ onFilesChange, maxFiles = 5, maxFileSizeMB = 10 }) => {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    if (newFiles.length === 0) return;

    const validFiles = newFiles.filter(file => {
      if (file.size > maxFileSizeMB * 1024 * 1024) {
        // Ideally, show a toast message here
        console.warn(`Arquivo ${file.name} excede o tamanho máximo de ${maxFileSizeMB}MB.`);
        return false;
      }
      return true;
    });

    const updatedFiles = [...files, ...validFiles].slice(0, maxFiles);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-3">
      <Input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
        accept="image/*,application/pdf,.doc,.docx"
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current.click()}
        disabled={files.length >= maxFiles}
        className="w-full"
      >
        <Upload className="w-4 h-4 mr-2" />
        Adicionar Anexo
      </Button>
      
      {files.length > 0 && (
        <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Paperclip size={16} />
                Arquivos Anexados
            </h4>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-md bg-slate-800/70"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <File className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <div className="flex-grow overflow-hidden">
                    <p className="text-sm font-medium text-white truncate" title={file.name}>
                    {file.name}
                    </p>
                    <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-slate-400 hover:text-red-500"
                onClick={() => handleRemoveFile(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
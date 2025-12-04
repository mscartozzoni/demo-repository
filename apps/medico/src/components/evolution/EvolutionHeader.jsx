import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Calculator } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const EvolutionHeader = () => {
  const { toast } = useToast();

  const handleOrcamentoClick = () => {
    window.open('https://orcamento.marcioplasticsurgery.com', '_blank');
  };

  const handleExportCSV = () => {
    toast({ title: "Gerando CSV...", description: "Esta é uma demonstração." });
    const headers = "Paciente,Data,Tipo,Descrição,Status\n";
    const rows = [
        "Ana Silva,2024-05-10,Consulta,Retorno pós-operatório,Concluído",
        "Carlos Souza,2024-05-09,Exame,Resultados de sangue,Pendente",
        "Beatriz Costa,2024-05-08,Cirurgia,Rinoplastia,Realizada"
    ].join("\n");
    
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "evolucao_pacientes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "CSV gerado com sucesso!" });
  };

  const handleExportPDF = async () => {
    const evolutionBoard = document.getElementById('evolution-board');
    if (!evolutionBoard) {
        toast({ variant: "destructive", title: "Erro", description: "Quadro de evolução não encontrado." });
        return;
    }
    toast({ title: "Gerando PDF do quadro evolutivo..." });
    try {
        const canvas = await html2canvas(evolutionBoard, { scale: 2, useCORS: true, backgroundColor: '#0f172a' });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a3'
        });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth * ratio, imgHeight * ratio);
        pdf.save("quadro_evolutivo.pdf");
        toast({ title: "PDF gerado com sucesso!" });
    } catch (error) {
        toast({ variant: "destructive", title: "Erro ao gerar PDF", description: error.message });
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-white">Quadro Evolutivo</h1>
        <p className="text-slate-400 mt-2">Monitore a evolução clínica dos pacientes</p>
      </div>
      <div className="flex gap-3">
        <Button onClick={handleOrcamentoClick} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
          <Calculator className="w-4 h-4 mr-2" />
          Orçamento
        </Button>
        <Button onClick={handleExportCSV} variant="outline" className="border-slate-600">
          <Download className="w-4 h-4 mr-2" />
          Exportar CSV
        </Button>
        <Button onClick={handleExportPDF} variant="outline" className="border-slate-600">
          <FileText className="w-4 h-4 mr-2" />
          Exportar PDF
        </Button>
      </div>
    </div>
  );
};

export default EvolutionHeader;
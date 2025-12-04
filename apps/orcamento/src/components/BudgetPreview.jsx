import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer, Hotel as Hospital, Stethoscope, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const BudgetPreview = ({ budget, patient, template }) => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Orcamento-${patient?.name.replace(' ', '_')}-${budget.auditCode}`,
  });

  const subtotal = budget.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let discountAmount = 0;
  if (budget.discountType === 'percentage') {
    discountAmount = subtotal * (budget.discountValue / 100);
  } else {
    discountAmount = budget.discountValue;
  }
  const total = subtotal - discountAmount;

  const calculateInstallment = (total, months, interestRate) => {
    if (months === 1) return total;
    const monthlyInterest = interestRate / 100;
    const installment = (total * monthlyInterest) / (1 - Math.pow(1 + monthlyInterest, -months));
    return isNaN(installment) ? 0 : installment;
  };
  const installmentOptions = [2, 5, 6, 10];

  return (
    <div className="bg-gray-100 dark:bg-gray-900 p-4">
      <div className="flex justify-end gap-2 mb-4 print:hidden">
        <Button onClick={handlePrint}><Printer className="w-4 h-4 mr-2" /> Imprimir / Salvar PDF</Button>
      </div>
      <div ref={componentRef} className="bg-white p-12 shadow-lg text-black font-sans">
        <header className="flex justify-between items-start pb-8 border-b">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">{template?.header || 'Proposta de Orçamento'}</h1>
            <p className="text-gray-500 mt-1">{budget.origin} / {budget.auditCode}</p>
          </div>
          <div className="text-right">
            {template?.logo ? <img src={template.logo} alt="Logo" className="h-16 mb-2" /> : <h2 className="text-2xl font-bold">Sua Clínica</h2>}
            <p className="text-sm text-gray-600">Data: {new Date(budget.createdAt).toLocaleDateString('pt-BR')}</p>
          </div>
        </header>

        <section className="my-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Paciente</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <div><strong className="text-gray-600">Nome:</strong> {patient?.name}</div>
            <div><strong className="text-gray-600">Email:</strong> {patient?.email}</div>
            <div><strong className="text-gray-600">Telefone:</strong> {patient?.phone}</div>
            <div><strong className="text-gray-600">CPF:</strong> {patient?.cpf}</div>
          </div>
        </section>

        <section className="my-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Procedimentos e Custos</h2>
          <Accordion type="multiple" className="w-full">
            {budget.items.map((item) => (
              <AccordionItem value={item.id} key={item.id}>
                <AccordionTrigger className="text-base font-medium">
                  <div className="flex justify-between w-full pr-4">
                    <span>{item.quantity}x {item.procedure}</span>
                    <span className="font-bold">R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm font-semibold mb-2">Detalhamento de Custos (Unitário):</p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between"><span className="flex items-center"><Stethoscope className="w-4 h-4 mr-2 text-blue-500"/>Honorários Clínicos:</span> <span>R$ {(item.clinicValue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
                    <div className="flex justify-between"><span className="flex items-center"><Hospital className="w-4 h-4 mr-2 text-red-500"/>Custos Hospitalares:</span> <span>R$ {(item.hospitalValue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
                    <div className="flex justify-between"><span className="flex items-center"><Package className="w-4 h-4 mr-2 text-green-500"/>Materiais e Insumos:</span> <span>R$ {(item.materialValue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="my-8 grid grid-cols-5">
          <div className="col-span-3">
            {budget.notes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Observações</h3>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{budget.notes}</p>
              </div>
            )}
          </div>
          <div className="col-span-2">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-600">Subtotal:</span> <span>R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
                {discountAmount > 0 && <div className="flex justify-between text-sm"><span className="text-gray-600">Desconto:</span> <span className="text-green-600">- R$ {discountAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>}
                <div className="border-t my-2"></div>
                <div className="flex justify-between text-lg font-bold"><span className="text-gray-800">Total:</span> <span>R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="my-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Opções de Parcelamento</h3>
          <p className="text-xs text-gray-500 mb-4">Taxa de juros de {budget.interestRate}% a.m. para parcelamentos.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {installmentOptions.map(months => {
              const installmentValue = calculateInstallment(total, months, budget.interestRate);
              return (
                <div key={months} className="border p-3 rounded-lg text-center">
                  <p className="font-bold text-lg">{months}x</p>
                  <p className="text-gray-800">R$ {installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  <p className="text-xs text-gray-500 mt-1">Total: R$ {(installmentValue * months).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
              )
            })}
          </div>
        </section>

        <footer className="text-center pt-8 mt-8 border-t">
          <p className="text-xs text-gray-500">{template?.footer || 'Este orçamento é válido por 30 dias. Agradecemos a sua confiança!'}</p>
        </footer>
      </div>
    </div>
  );
};

export default BudgetPreview;
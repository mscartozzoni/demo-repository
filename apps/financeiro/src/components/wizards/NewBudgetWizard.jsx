import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import PatientSearchStep from '@/components/wizards/steps/PatientSearchStep';
import ServiceIndicationStep from '@/components/wizards/steps/ServiceIndicationStep';
import BudgetCreationStep from '@/components/wizards/steps/BudgetCreationStep';
import PaymentStep from '@/components/wizards/steps/PaymentStep';
import ReviewStep from '@/components/wizards/steps/ReviewStep';
import FinalizeStep from '@/components/wizards/steps/FinalizeStep';
import { useBudgets } from '@/hooks/useBudgets';

const STEPS = {
  PATIENT: 1,
  SERVICE: 2,
  DETAILS: 3,
  PAYMENT: 4,
  REVIEW: 5,
  FINALIZE: 6,
};

const STEP_TITLES = [
  "", // 0
  "Etapa 1 de 6: Selecionar Paciente",
  "Etapa 2 de 6: Indicação de Serviço",
  "Etapa 3 de 6: Detalhes do Orçamento",
  "Etapa 4 de 6: Configuração de Pagamento",
  "Etapa 5 de 6: Revisão e Finalização",
  "Etapa 6 de 6: Concluído!",
];

const NewBudgetWizard = ({ isOpen, onClose, onBudgetCreated, patient: preselectedPatient, appointment: preselectedAppointment }) => {
  const [step, setStep] = useState(STEPS.PATIENT);
  const [budgetData, setBudgetData] = useState({ 
    patient: null, 
    service: null,
    budgetDetails: null,
    paymentDetails: null,
    finalQuote: null,
    appointment: null,
  });
  const { createBudget } = useBudgets();

  useEffect(() => {
    if (isOpen) {
        if (preselectedPatient) {
          setBudgetData(prev => ({...prev, patient: preselectedPatient, appointment: preselectedAppointment || null}));
          setStep(STEPS.SERVICE);
        } else {
            resetWizard();
        }
    }
  }, [preselectedPatient, preselectedAppointment, isOpen]);


  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => {
    if (preselectedPatient && step === STEPS.SERVICE) {
        handleClose();
        return;
    }
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleSelectPatient = (patient) => {
    setBudgetData(prev => ({ ...prev, patient }));
    handleNext();
  };
  
  const handleIndicationSubmit = (service, appointment) => {
    setBudgetData(prev => ({ ...prev, service, appointment }));
    handleNext();
  };

  const handleBudgetCreationNext = (details) => {
    setBudgetData(prev => ({ ...prev, budgetDetails: details }));
    handleNext();
  };

  const handlePaymentNext = (paymentInfo) => {
    setBudgetData(prev => ({...prev, paymentDetails: paymentInfo}));
    handleNext();
  };
  
  const handleReviewNext = async () => {
    const finalData = { ...budgetData.budgetDetails, ...budgetData.paymentDetails };
    const newQuote = await createBudget(finalData, true); // Pass true to return the created budget
    setBudgetData(prev => ({...prev, finalQuote: newQuote}));
    handleNext();
  };

  const resetWizard = () => {
    setStep(STEPS.PATIENT);
    setBudgetData({ patient: null, service: null, budgetDetails: null, paymentDetails: null, finalQuote: null, appointment: null });
  };

  const handleClose = () => {
    resetWizard();
    onClose();
  };

  const handleFinish = () => {
    handleClose();
    onBudgetCreated();
  }
  
  const getStepComponent = () => {
    switch(step) {
      case STEPS.PATIENT:
        return <PatientSearchStep onSelectPatient={handleSelectPatient} />;
      case STEPS.SERVICE:
        return <ServiceIndicationStep patient={budgetData.patient} onBack={handleBack} onSubmit={handleIndicationSubmit} preselectedAppointment={budgetData.appointment} />;
      case STEPS.DETAILS:
        return <BudgetCreationStep patient={budgetData.patient} service={budgetData.service} appointment={budgetData.appointment} onBack={handleBack} onNext={handleBudgetCreationNext} />;
      case STEPS.PAYMENT:
        return <PaymentStep baseBudget={budgetData.budgetDetails} onBack={handleBack} onNext={handlePaymentNext} />;
      case STEPS.REVIEW:
        return <ReviewStep budgetData={budgetData} onBack={handleBack} onNext={handleReviewNext} />;
      case STEPS.FINALIZE:
        return <FinalizeStep quote={budgetData.finalQuote} patient={budgetData.patient} onFinish={handleFinish} />;
      default:
        return null;
    }
  };
  
  const getWidthForStep = () => {
    if (step >= STEPS.DETAILS && step <= STEPS.REVIEW) return "max-w-5xl";
    return "max-w-2xl";
  }

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`wizard-step-${step}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className={`bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8 w-full ${getWidthForStep()}`}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white">Novo Orçamento Detalhado</h3>
                <p className="text-purple-200">{STEP_TITLES[step]}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleClose} className="text-purple-200 -mr-4 -mt-2">X</Button>
            </div>
            {getStepComponent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </Dialog>
  );
};

export default NewBudgetWizard;
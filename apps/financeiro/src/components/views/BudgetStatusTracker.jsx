import React from 'react';
import { motion } from 'framer-motion';
import { Check, FileText, Send, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_MAP = {
    draft: 1,
    sent: 2,
    approved: 3,
    paid: 4,
};

const STEPS = [
    { id: 1, label: 'Criado', icon: FileText, status: 'draft' },
    { id: 2, label: 'Enviado', icon: Send, status: 'sent' },
    { id: 3, label: 'Aprovado', icon: Check, status: 'approved' },
    { id: 4, label: 'Pago', icon: DollarSign, status: 'paid' },
];

const BudgetStatusTracker = ({ status, paymentStatus }) => {
    const currentStatusId = STATUS_MAP[status] || 0;
    const isPaid = paymentStatus === 'paid';
    const activeStep = isPaid ? 4 : currentStatusId;

    return (
        <div className="w-full p-4">
            <div className="flex items-center justify-between">
                {STEPS.map((step, index) => {
                    const isActive = step.id <= activeStep;
                    const isCompleted = step.id < activeStep;
                    const Icon = step.icon;

                    return (
                        <React.Fragment key={step.id}>
                            <div className="flex flex-col items-center text-center z-10">
                                <motion.div
                                    animate={{
                                        scale: isActive ? 1.1 : 1,
                                        backgroundColor: isActive ? '#a855f7' : '#374151',
                                        color: isActive ? '#ffffff' : '#9ca3af',
                                    }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    className={cn(
                                        'h-12 w-12 rounded-full flex items-center justify-center border-2',
                                        isActive ? 'border-purple-500' : 'border-gray-600'
                                    )}
                                >
                                    <Icon className="h-6 w-6" />
                                </motion.div>
                                <p className={cn('mt-2 text-xs font-semibold', isActive ? 'text-white' : 'text-gray-400')}>
                                    {step.label}
                                </p>
                            </div>
                            {index < STEPS.length - 1 && (
                                <div className="flex-1 h-1 bg-gray-600 -mx-2 relative">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: isCompleted ? '100%' : '0%' }}
                                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                                        className="h-full bg-purple-500"
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default BudgetStatusTracker;
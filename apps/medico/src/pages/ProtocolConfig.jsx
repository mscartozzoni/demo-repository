import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import ProtocolHeader from '@/components/protocol-config/ProtocolHeader';
import ProtocolOverview from '@/components/protocol-config/ProtocolOverview';
import StageCard from '@/components/protocol-config/StageCard';
import NoStages from '@/components/protocol-config/NoStages';
import { 
    getDefaultProtocol, 
    addProtocolStage, 
    updateProtocolStage, 
    deleteProtocolStage,
    updateStageOrder
} from '@/services/api/protocols';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
    </div>
);

const ProtocolConfig = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [protocol, setProtocol] = useState(null);
  const [stages, setStages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProtocol = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const doctorId = user.id; // Assuming user.id is the doctor's ID
      const currentProtocol = await getDefaultProtocol(doctorId);
      setProtocol(currentProtocol);
      setStages(currentProtocol.protocol_stages || []);
    } catch (error) {
      toast({
        title: "Erro ao carregar protocolo",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchProtocol();
  }, [fetchProtocol]);

  const reorderAndSetStages = (updatedStages) => {
    const newOrderedStages = updatedStages
      .sort((a, b) => a.order - b.order)
      .map((stage, index) => ({ ...stage, order: index + 1 }));
    setStages(newOrderedStages);
    return newOrderedStages;
  };

  const handleAddStage = async (stageData) => {
    try {
      const newStagePayload = {
        ...stageData,
        protocol_id: protocol.id,
        order: stages.length + 1,
      };
      delete newStagePayload.id; // Ensure ID is not sent for new stages

      const newStage = await addProtocolStage(newStagePayload);
      const updatedStages = reorderAndSetStages([...stages, newStage]);
      setStages(updatedStages);
      toast({ title: "Nova etapa adicionada com sucesso!" });
    } catch (error) {
      toast({ title: "Erro ao adicionar etapa", description: error.message, variant: "destructive" });
    }
  };
  
  const handleUpdateStage = async (stageData) => {
    try {
      const { id, ...updatePayload } = stageData;
      await updateProtocolStage(id, updatePayload);
      const updatedStages = stages.map(stage =>
        stage.id === id ? { ...stage, ...stageData } : stage
      );
      setStages(reorderAndSetStages(updatedStages));
      toast({ title: "Etapa atualizada com sucesso!" });
    } catch (error) {
      toast({ title: "Erro ao atualizar etapa", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteStage = async (stageId) => {
    try {
      await deleteProtocolStage(stageId);
      const updatedStages = stages.filter(stage => stage.id !== stageId);
      setStages(reorderAndSetStages(updatedStages));
      toast({ title: "Etapa removida com sucesso!" });
    } catch (error) {
      toast({ title: "Erro ao remover etapa", description: error.message, variant: "destructive" });
    }
  };

  const moveStage = async (stageId, direction) => {
    const index = stages.findIndex(s => s.id === stageId);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === stages.length - 1)) {
      return;
    }
    
    const newStages = [...stages];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap stages
    [newStages[index], newStages[targetIndex]] = [newStages[targetIndex], newStages[index]];
    
    // Re-assign order
    const stagesToUpdate = newStages.map((stage, idx) => ({ ...stage, order: idx + 1 }));

    // Optimistically update UI
    setStages(stagesToUpdate);

    try {
        // Persist order changes to DB
        const updatePayload = stagesToUpdate.map(s => ({ id: s.id, order: s.order }));
        await updateStageOrder(updatePayload);
        toast({ title: "Ordem das etapas atualizada!" });
    } catch (error) {
        toast({ title: "Erro ao reordenar etapas", description: error.message, variant: "destructive" });
        // Revert UI on failure
        setStages(stages);
    }
  };

  if (isLoading) {
    return (
        <div className="space-y-6">
            <ProtocolHeader onAddStage={() => {}} />
            <LoadingSpinner />
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProtocolHeader onAddStage={handleAddStage} />
      <ProtocolOverview stages={stages} />
      
      <div className="space-y-4">
        {stages.map((stage, index) => (
          <StageCard
            key={stage.id}
            stage={stage}
            index={index}
            onMove={(direction) => moveStage(stage.id, direction)}
            onUpdate={handleUpdateStage}
            onDelete={() => handleDeleteStage(stage.id)}
            isFirst={index === 0}
            isLast={index === stages.length - 1}
          />
        ))}
      </div>

      {stages.length === 0 && <NoStages onAddStage={handleAddStage} />}
    </div>
  );
};

export default ProtocolConfig;
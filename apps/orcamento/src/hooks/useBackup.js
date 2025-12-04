import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

const BACKUP_KEY = 'mediBudgetBackup';

export const useBackup = () => {
    const [backupData, setBackupData] = useState(null);

    // Function to get a generic user identifier
    const getUserIdentifier = () => {
        // In a real app, this would come from an auth context, e.g., user.email or user.id
        // For local simulation, we can use a generic placeholder.
        return localStorage.getItem('userIdentifier') || 'local_user@example.com';
    };

    // Load initial backup data to display in settings
    useEffect(() => {
        try {
            const storedBackup = localStorage.getItem(BACKUP_KEY);
            if (storedBackup) {
                setBackupData(JSON.parse(storedBackup));
            }
        } catch (error) {
            console.error("Failed to load backup data from localStorage:", error);
            toast({
                variant: "destructive",
                title: "Erro ao Carregar Backup",
                description: "Não foi possível ler os dados locais. O backup pode estar corrompido.",
            });
        }
    }, []);

    const createBackup = (data) => {
        try {
            const newLog = {
                timestamp: new Date().toISOString(),
                user: getUserIdentifier(),
                action: "Data updated",
            };

            const currentState = JSON.parse(localStorage.getItem(BACKUP_KEY));
            const auditLog = currentState?.auditLog || [];

            const backupPayload = {
                ...data,
                auditLog: [newLog, ...auditLog.slice(0, 49)], // Keep last 50 logs
            };

            localStorage.setItem(BACKUP_KEY, JSON.stringify(backupPayload));
            setBackupData(backupPayload);
        } catch (error) {
            console.error("Failed to create backup:", error);
            toast({
                variant: "destructive",
                title: "Falha no Backup Automático",
                description: "Não foi possível salvar os dados. Verifique o espaço de armazenamento do navegador.",
            });
        }
    };

    const restoreBackup = () => {
        try {
            const storedBackup = localStorage.getItem(BACKUP_KEY);
            if (storedBackup) {
                const parsedData = JSON.parse(storedBackup);
                setBackupData(parsedData);
                 toast({
                    title: "Backup Restaurado",
                    description: "Dados locais carregados com sucesso.",
                });
                return parsedData;
            } else {
                 const defaultData = {
                    patients: [],
                    appointments: [],
                    budgets: [],
                    priceTables: [
                      { id: '1', code: 'CP001', procedure: 'Rinoplastia', clinicValue: 10000, hospitalValue: 5000, materialValue: 1000, source: 'manual' },
                      { id: '2', code: 'CP002', procedure: 'Mamoplastia', clinicValue: 12000, hospitalValue: 6000, materialValue: 2000, source: 'manual' },
                    ],
                    templates: [{ id: '1', name: 'Template Padrão', header: 'Proposta de Orçamento', footer: 'Obrigado pela confiança!' }],
                    clinicProtocol: { acceptanceValue: 1000, paymentMethods: ['pix', 'cartao_credito'], paymentDeadline: 15, stripePk: '' },
                    auditLog: [],
                 };
                 createBackup(defaultData);
                 return defaultData;
            }
        } catch (error) {
            console.error("Failed to restore backup:", error);
            toast({
                variant: "destructive",
                title: "Erro ao Restaurar Backup",
                description: "O backup local está corrompido e não pôde ser lido.",
            });
            return null;
        }
    };

    const exportBackup = () => {
        try {
            const storedBackup = localStorage.getItem(BACKUP_KEY);
            if (storedBackup) {
                const data = JSON.parse(storedBackup);
                // Exclude audit log from finance department export for privacy/relevance
                const { auditLog, ...exportData } = data;
                
                const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportData, null, 2))}`;
                const link = document.createElement('a');
                link.href = jsonString;
                link.download = `medibudget_backup_${new Date().toISOString().split('T')[0]}.json`;
                link.click();
                toast({
                    title: "Backup Exportado",
                    description: "O arquivo JSON foi baixado com sucesso.",
                });
            } else {
                 toast({
                    variant: "destructive",
                    title: "Nenhum Backup Encontrado",
                    description: "Não há dados locais para exportar.",
                });
            }
        } catch (error) {
             console.error("Failed to export backup:", error);
             toast({
                variant: "destructive",
                title: "Erro ao Exportar",
                description: "Não foi possível gerar o arquivo de backup.",
            });
        }
    };

    const importBackup = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                // Basic validation
                if (data.patients && data.budgets && data.priceTables) {
                    createBackup(data);
                    toast({
                        title: "Importação Concluída",
                        description: "Backup restaurado com sucesso. A página será recarregada.",
                    });
                    // Reload to apply the new state everywhere
                    setTimeout(() => window.location.reload(), 2000);
                } else {
                    throw new Error("Invalid backup file structure.");
                }
            } catch (error) {
                console.error("Failed to import backup:", error);
                toast({
                    variant: "destructive",
                    title: "Falha na Importação",
                    description: "O arquivo selecionado não é um backup válido.",
                });
            }
        };
        reader.readAsText(file);
    };

    const clearBackup = () => {
        try {
            localStorage.removeItem(BACKUP_KEY);
            setBackupData(null);
            toast({
                title: "Dados Locais Apagados",
                description: "Todo o backup local foi removido. A página será recarregada.",
            });
            setTimeout(() => window.location.reload(), 2000);
        } catch (error) {
            console.error("Failed to clear backup:", error);
            toast({
                variant: "destructive",
                title: "Erro ao Limpar Dados",
                description: "Não foi possível remover o backup local.",
            });
        }
    };

    return { backupData, createBackup, restoreBackup, exportBackup, importBackup, clearBackup };
};
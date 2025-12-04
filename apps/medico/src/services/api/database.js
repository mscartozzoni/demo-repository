const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    export const runDatabaseAnalysis = async () => {
        console.log('[Mock API] Running database analysis...');
        await new Promise(resolve => setTimeout(resolve, 2500));

        const indexHealth = random(70, 95);
        const tableBloat = random(5, 20);
        const queryPerformance = random(85, 99);
        
        const recommendations = [];
        if (indexHealth < 85) {
            recommendations.push('Reindexar tabelas para melhorar a performance de busca.');
        }
        if (tableBloat > 10) {
            recommendations.push('Executar VACUUM FULL para recuperar espaço não utilizado.');
        }
        if (queryPerformance < 90) {
            recommendations.push('Analisar e otimizar queries lentas.');
        }
        if (recommendations.length === 0) {
            recommendations.push('Nenhuma otimização crítica necessária. O desempenho está excelente.');
        }

        const analysisData = {
            lastAnalyzed: new Date().toISOString(),
            indexHealth,
            tableBloat,
            queryPerformance,
            recommendations,
        };

        return { success: true, data: analysisData };
    };

    export const runDatabaseOptimization = async (onLog) => {
        console.log('[Mock API] Running database optimization...');
        
        const logs = [
            { message: 'Iniciando otimização...', delay: 500 },
            { message: 'LOCK: Travando tabelas para manutenção...', delay: 1000 },
            { message: 'EXEC: VACUUM em tabela `patients`...', delay: 2000 },
            { message: 'EXEC: REINDEX em tabela `appointments`...', delay: 2000 },
            { message: 'EXEC: ANALYZE para atualizar estatísticas...', delay: 1500 },
            { message: 'UNLOCK: Liberando tabelas...', delay: 500 },
            { message: 'Otimização concluída com sucesso.', delay: 200 },
        ];

        for (const log of logs) {
            await new Promise(resolve => setTimeout(resolve, log.delay));
            if (onLog) {
                onLog({
                    timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                    message: log.message
                });
            }
        }
        
        const newAnalysisData = {
            lastAnalyzed: new Date().toISOString(),
            indexHealth: random(95, 100),
            tableBloat: random(1, 4),
            queryPerformance: random(98, 100),
            recommendations: ['Nenhuma otimização crítica necessária. O desempenho está excelente.'],
        };

        return { success: true, data: newAnalysisData };
    };
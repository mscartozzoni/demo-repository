const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    export const runAIAudit = async (onLog) => {
        console.log('[Mock API] Running AI Audit...');
        
        const logs = [
            { message: 'Iniciando análise de performance...', delay: 1000 },
            { message: 'Verificando configurações de segurança...', delay: 1500 },
            { message: 'Analisando padrões de usabilidade da interface...', delay: 2000 },
            { message: 'Identificando gargalos de processamento...', delay: 1200 },
            { message: 'Buscando por vulnerabilidades conhecidas...', delay: 1800 },
            { message: 'Gerando relatório de recomendações...', delay: 1000 },
            { message: 'Auditoria de IA concluída.', delay: 500 },
        ];

        for (const log of logs) {
            await new Promise(resolve => setTimeout(resolve, log.delay));
            if (onLog) {
                onLog({
                    timestamp: new Date().toLocaleTimeString(),
                    message: log.message
                });
            }
        }

        const performanceScore = random(60, 85);
        const securityScore = random(70, 90);
        const usabilityScore = random(65, 80);

        const recommendations = [];
        if (performanceScore < 75) {
            recommendations.push('Otimizar carregamento de recursos para melhorar a velocidade.');
        }
        if (securityScore < 80) {
            recommendations.push('Revisar políticas de acesso e permissões de usuários.');
        }
        if (usabilityScore < 70) {
            recommendations.push('Simplificar fluxos de trabalho para uma melhor experiência do usuário.');
        }
        if (recommendations.length === 0) {
            recommendations.push('Seu sistema está em excelente estado! Nenhuma otimização crítica necessária.');
        }

        const auditData = {
            lastAudited: new Date().toISOString(),
            performanceScore,
            securityScore,
            usabilityScore,
            recommendations,
        };

        return { success: true, data: auditData };
    };

    export const applyAIAuditFixes = async (onLog) => {
        console.log('[Mock API] Applying AI Audit Fixes...');

        const logs = [
            { message: 'Iniciando aplicação de correções...', delay: 500 },
            { message: 'Ajustando configurações de cache...', delay: 1500 },
            { message: 'Reforçando medidas de segurança...', delay: 2000 },
            { message: 'Otimizando consultas de banco de dados...', delay: 1800 },
            { message: 'Melhorando a responsividade da interface...', delay: 1200 },
            { message: 'Verificando integridade do sistema pós-correção...', delay: 1000 },
            { message: 'Correções de IA aplicadas com sucesso.', delay: 500 },
        ];

        for (const log of logs) {
            await new Promise(resolve => setTimeout(resolve, log.delay));
            if (onLog) {
                onLog({
                    timestamp: new Date().toLocaleTimeString(),
                    message: log.message
                });
            }
        }

        const newPerformanceScore = random(90, 98);
        const newSecurityScore = random(95, 99);
        const newUsabilityScore = random(88, 95);

        const auditData = {
            lastAudited: new Date().toISOString(),
            performanceScore: newPerformanceScore,
            securityScore: newSecurityScore,
            usabilityScore: newUsabilityScore,
            recommendations: ['Seu sistema foi otimizado pela IA e está funcionando com máxima eficiência!'],
        };

        return { success: true, data: auditData };
    };
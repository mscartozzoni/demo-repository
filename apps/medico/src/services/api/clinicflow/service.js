
// @/services/api/clinicflow/service.js
import { clinicFlowApiConfig } from './config';

/**
 * @file Serviço de API para o ClinicFlow.
 * Simula chamadas para uma Edge Function 'clinic-flow'.
 */

/**
 * Função genérica para simular a chamada a uma Edge Function.
 * @param {string} endpointName - O nome do endpoint definido em `clinicFlowApiConfig`.
 * @param {object} [options] - Opções para a requisição.
 * @param {object} [options.pathParams] - Parâmetros para substituir na URL (ex: { patientId: '123' }).
 * @param {object} [options.body] - O corpo da requisição para POST/PUT.
 * @returns {Promise<{success: boolean, data: any, error: string|null}>}
 */
export const clinicFlowApiService = async (endpointName, options = {}) => {
  const endpoint = clinicFlowApiConfig.endpoints[endpointName];

  if (!endpoint) {
    const errorMsg = `Endpoint "${endpointName}" não encontrado na configuração.`;
    console.error(errorMsg);
    return { success: false, data: null, error: errorMsg };
  }

  console.warn(`[Mock API Service] Chamando endpoint simulado: ${endpointName}`);

  // Simula uma resposta bem-sucedida com dados vazios ou de exemplo.
  return new Promise(resolve => {
    setTimeout(() => {
        let mockData = null;
        if (endpointName === 'getPatientSummary') {
            mockData = { summary: 'Este é um resumo mockado do paciente.' };
        } else if (endpointName.startsWith('get')) {
            mockData = [];
        } else {
            mockData = { message: 'Operação simulada com sucesso' };
        }
        
        resolve({ success: true, data: mockData, error: null });
    }, 500); // Simula latência de rede
  });
};

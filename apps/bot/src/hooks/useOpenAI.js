
import React, { useCallback } from 'react';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';

// This is a mock function. In a real scenario, you would make a fetch call
// to the OpenAI API with the provided prompt and API key.
const mockOpenAICall = async (apiKey, model, prompt) => {
    console.log("--- OpenAI Mock API Call ---");
    console.log("API Key:", apiKey ? "********" : "Not Provided");
    console.log("Model:", model);
    console.log("Prompt:", prompt);

    if (!apiKey) {
        return Promise.reject(new Error("Chave da API da OpenAI não configurada."));
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate different responses based on prompt
    if (prompt.includes("analise a seguinte conversa")) {
        return {
            choices: [{
                message: {
                    content: JSON.stringify({
                        summary: "O paciente 'Maria Silva' deseja agendar uma consulta e está flexível quanto à data.",
                        sentiment: "positivo",
                        suggested_reply: "Olá Maria! Que ótimo. Temos disponibilidade na próxima semana. Qual dia e período seria melhor para você?",
                        action: "schedule_appointment"
                    })
                }
            }]
        };
    }

    if (prompt.includes("Verifique a disponibilidade")) {
         return {
            choices: [{
                message: {
                    content: JSON.stringify({
                        available_slots: [
                            "2025-11-18T10:00:00",
                            "2025-11-18T11:00:00",
                            "2025-11-19T14:00:00",
                        ],
                        suggestion: "Sugiro agendar para Terça-feira, 18 de Novembro, às 10:00."
                    })
                }
            }]
        };
    }
    
    if (prompt.includes("sugira uma resposta curta e profissional")) {
        return {
            choices: [{
                message: {
                    content: "Olá! Agradecemos seu contato. Nossa equipe irá analisar sua mensagem e retornará em breve."
                }
            }]
        };
    }
    
    // Default chat response
    return {
        choices: [{
            message: {
                content: "Com certeza! Analisando sua solicitação. Com base nos dados, a melhor ação seria entrar em contato proativamente para confirmar o interesse e oferecer um agendamento."
            }
        }]
    };
};

export const useOpenAI = () => {
    const { settings } = useData();
    const { toast } = useToast();

    const getOpenAIResponse = useCallback(async (prompt, isJsonMode = false) => {
        const openaiApiKey = settings?.openaiApiKey;
        const openaiModel = settings?.openaiModel;

        if (!openaiApiKey) {
            toast({
                variant: 'destructive',
                title: 'API Key da OpenAI não configurada',
                description: 'Por favor, insira sua chave da API nas configurações de IA.',
            });
            return null;
        }

        try {
            // In a real implementation, you would use fetch:
            /*
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openaiApiKey}`,
                },
                body: JSON.stringify({
                    model: openaiModel || 'gpt-4',
                    messages: [{ role: 'user', content: prompt }],
                    ...(isJsonMode && { response_format: { type: "json_object" } })
                }),
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.statusText}`);
            }

            const data = await response.json();
            const content = data.choices[0].message.content;
            */
            
            // Using mock function for now
            const data = await mockOpenAICall(openaiApiKey, openaiModel, prompt);
            const content = data.choices[0].message.content;

            if (isJsonMode) {
                return JSON.parse(content);
            }
            return content;

        } catch (error) {
            console.error('Erro ao chamar a API da OpenAI:', error);
            toast({
                variant: 'destructive',
                title: 'Erro na API da OpenAI',
                description: error.message,
            });
            return null;
        }
    }, [settings, toast]);
    
    return { getOpenAIResponse };
};

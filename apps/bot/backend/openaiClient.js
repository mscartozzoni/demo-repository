const OpenAI = require('openai');

// Carrega as variáveis de ambiente do arquivo .env
// Certifique-se de que seu arquivo `backend/.env` tenha a seguinte variável:
// OPENAI_API_KEY=sua_chave_da_openai

const openaiApiKey = process.env.OPENAI_API_KEY;

if (!openaiApiKey) {
  console.warn("AVISO: A variável de ambiente OPENAI_API_KEY não está configurada. As chamadas para a IA não funcionarão.");
}

const openai = new OpenAI({
  apiKey: openaiApiKey,
});

module.exports = openai;

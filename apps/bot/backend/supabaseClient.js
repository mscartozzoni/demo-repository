const { createClient } = require('@supabase/supabase-js');

// Carrega as variáveis de ambiente do arquivo .env
// Certifique-se de que seu arquivo `backend/.env` tenha as seguintes variáveis:
// SUPABASE_URL=SUA_URL_DO_PROJETO
// SUPABASE_SERVICE_KEY=SUPABASE_SERVICE_KEY

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Erro: As variáveis de ambiente SUPABASE_URL e SUPABASE_SERVICE_KEY são obrigatórias.");
  // Impede o servidor de iniciar se as chaves não estiverem configuradas.
  process.exit(1); 
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;

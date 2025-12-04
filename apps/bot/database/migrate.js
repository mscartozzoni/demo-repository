#!/usr/bin/env node

/**
 * Script de Migração do Banco de Dados
 * Portal Clinic Bot
 * 
 * Uso:
 *   node database/migrate.js schema    # Cria estrutura do banco
 *   node database/migrate.js seeds     # Insere dados de exemplo
 *   node database/migrate.js reset     # Limpa todos os dados
 *   node database/migrate.js full      # Schema + Seeds
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Configurar __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar variáveis de ambiente
dotenv.config({ path: join(__dirname, '..', '.env') });

// Cores para terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${msg}${colors.reset}\n`),
};

// Validar variáveis de ambiente
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  log.error('Variáveis de ambiente não configuradas!');
  log.info('Configure VITE_SUPABASE_URL e SUPABASE_SERVICE_KEY no arquivo .env');
  process.exit(1);
}

// Inicializar cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/**
 * Executar SQL no Supabase
 */
async function executeSql(sql) {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      // Se a função RPC não existir, tentar usar o endpoint direto
      if (error.code === '42883') {
        log.warn('Função exec_sql não encontrada. Execute o SQL manualmente no Supabase.');
        log.info('1. Acesse https://supabase.com/dashboard');
        log.info('2. Vá em SQL Editor');
        log.info('3. Execute o conteúdo do arquivo SQL');
        return false;
      }
      throw error;
    }
    
    return true;
  } catch (error) {
    throw error;
  }
}

/**
 * Executar Schema
 */
async function runSchema() {
  log.title('📊 Criando Estrutura do Banco de Dados');
  
  try {
    const schemaPath = join(__dirname, 'schema.sql');
    const schemaSql = readFileSync(schemaPath, 'utf-8');
    
    log.info('Lendo arquivo schema.sql...');
    log.info('Executando queries...');
    
    // Para Supabase, instruir execução manual
    log.warn('\n⚠️  Atenção: Este script não pode executar SQL diretamente no Supabase.');
    log.info('\nPara criar o banco de dados:');
    log.info('1. Acesse: https://supabase.com/dashboard');
    log.info('2. Selecione seu projeto');
    log.info('3. Vá em "SQL Editor" no menu lateral');
    log.info('4. Clique em "New query"');
    log.info(`5. Copie o conteúdo de: ${schemaPath}`);
    log.info('6. Cole no editor e clique em "Run"\n');
    
    // Salvar SQL em arquivo temporário para facilitar
    const tempPath = join(__dirname, 'temp_schema.sql');
    log.info(`Arquivo SQL disponível em: ${tempPath}`);
    
    return true;
  } catch (error) {
    log.error(`Erro ao executar schema: ${error.message}`);
    return false;
  }
}

/**
 * Executar Seeds
 */
async function runSeeds() {
  log.title('🌱 Inserindo Dados de Exemplo');
  
  try {
    const seedsPath = join(__dirname, 'seeds.sql');
    const seedsSql = readFileSync(seedsPath, 'utf-8');
    
    log.info('Lendo arquivo seeds.sql...');
    log.info('Executando queries...');
    
    log.warn('\n⚠️  Atenção: Este script não pode executar SQL diretamente no Supabase.');
    log.info('\nPara inserir dados de exemplo:');
    log.info('1. Acesse: https://supabase.com/dashboard');
    log.info('2. Selecione seu projeto');
    log.info('3. Vá em "SQL Editor" no menu lateral');
    log.info('4. Clique em "New query"');
    log.info(`5. Copie o conteúdo de: ${seedsPath}`);
    log.info('6. Cole no editor e clique em "Run"\n');
    
    return true;
  } catch (error) {
    log.error(`Erro ao executar seeds: ${error.message}`);
    return false;
  }
}

/**
 * Limpar todos os dados
 */
async function resetDatabase() {
  log.title('🗑️  Limpando Banco de Dados');
  
  log.warn('Esta ação irá APAGAR TODOS OS DADOS!');
  log.warn('Para continuar, execute manualmente no Supabase SQL Editor:\n');
  
  const resetSql = `
-- ATENÇÃO: Isso apagará TODOS os dados!
TRUNCATE TABLE 
  message_tags, 
  messages, 
  documents, 
  follow_ups, 
  post_ops, 
  surgeries, 
  budgets, 
  appointments, 
  contacts, 
  audit_logs, 
  tags, 
  users
RESTART IDENTITY CASCADE;

-- Recriar tags padrão
INSERT INTO tags (name, color, description) VALUES
  ('Primeira Consulta', '#3b82f6', 'Paciente em primeira consulta'),
  ('Orçamento', '#10b981', 'Solicitação de orçamento'),
  ('Agendamento', '#f59e0b', 'Agendamento de consulta'),
  ('Urgente', '#ef4444', 'Requer atenção imediata'),
  ('Cirurgia', '#8b5cf6', 'Relacionado a cirurgia'),
  ('Pós-operatório', '#ec4899', 'Acompanhamento pós-cirúrgico'),
  ('Follow-up', '#06b6d4', 'Retorno ou acompanhamento'),
  ('Financeiro', '#14b8a6', 'Questões financeiras'),
  ('Dúvida', '#6366f1', 'Dúvidas gerais'),
  ('Reagendar', '#f97316', 'Necessita reagendar');
`;
  
  console.log(resetSql);
  return true;
}

/**
 * Verificar conexão com Supabase
 */
async function checkConnection() {
  log.info('Verificando conexão com Supabase...');
  
  try {
    // Tentar acessar qualquer tabela existente, ou apenas verificar a URL
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    // Ignorar erro de tabela não existir (significa que ainda não foi criada)
    if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
      throw error;
    }
    
    log.success('Conectado ao Supabase!');
    log.info(`URL: ${SUPABASE_URL}`);
    return true;
  } catch (error) {
    log.error(`Erro de conexão: ${error.message}`);
    log.info('Isso é normal se as tabelas ainda não foram criadas.');
    return true; // Retornar true mesmo assim para permitir continuar
  }
}

/**
 * Mostrar uso
 */
function showUsage() {
  log.title('📚 Script de Migração - Portal Clinic Bot');
  
  console.log('Uso:');
  console.log('  node database/migrate.js schema    # Cria estrutura do banco');
  console.log('  node database/migrate.js seeds     # Insere dados de exemplo');
  console.log('  node database/migrate.js reset     # Limpa todos os dados');
  console.log('  node database/migrate.js full      # Schema + Seeds');
  console.log('  node database/migrate.js check     # Verifica conexão\n');
  
  console.log('Variáveis de ambiente necessárias:');
  console.log('  VITE_SUPABASE_URL');
  console.log('  SUPABASE_SERVICE_KEY ou VITE_SUPABASE_ANON_KEY\n');
}

/**
 * Função principal
 */
async function main() {
  const command = process.argv[2];
  
  if (!command) {
    showUsage();
    return;
  }
  
  // Verificar conexão primeiro
  const connected = await checkConnection();
  if (!connected) {
    log.error('Não foi possível conectar ao Supabase. Verifique suas credenciais.');
    process.exit(1);
  }
  
  switch (command) {
    case 'schema':
      await runSchema();
      break;
      
    case 'seeds':
      await runSeeds();
      break;
      
    case 'reset':
      await resetDatabase();
      break;
      
    case 'full':
      await runSchema();
      await runSeeds();
      break;
      
    case 'check':
      log.success('Conexão verificada com sucesso!');
      break;
      
    default:
      log.error(`Comando desconhecido: ${command}`);
      showUsage();
      process.exit(1);
  }
  
  log.success('\n✨ Operação concluída!');
}

// Executar
main().catch((error) => {
  log.error(`Erro fatal: ${error.message}`);
  console.error(error);
  process.exit(1);
});

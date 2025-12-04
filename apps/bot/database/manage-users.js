#!/usr/bin/env node

/**
 * Script de Gerenciamento de Usuários
 * Portal Clinic Bot
 * 
 * Uso:
 *   node database/manage-users.js setup     # Criar perfis padrão
 *   node database/manage-users.js list      # Listar usuários
 *   node database/manage-users.js clean     # Limpar usuários duplicados
 */

import postgres from 'postgres';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const sql = postgres(process.env.SUPABASE_DB_URL);

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bright: '\x1b[1m',
};

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${msg}${colors.reset}\n`),
};

// Perfis padrão a serem criados
const defaultProfiles = [
  {
    email: 'dr.marcio@marcioplasticsurgery.com',
    full_name: 'Dr. Marcio Scartozzoni',
    role: 'doctor',
    phone: '(11) 99999-9999',
    is_active: true
  },
  {
    email: 'admin@marcioplasticsurgery.com',
    full_name: 'Marcio Scartozzoni',
    role: 'admin',
    phone: '(11) 99999-9999',
    is_active: true
  },
  {
    email: 'recep@marcioplasticsurgery.com',
    full_name: 'Recepcionista',
    role: 'receptionist',
    phone: '(11) 99999-8888',
    is_active: true
  },
  {
    email: 'secretaria@marcioplasticsurgery.com',
    full_name: 'Secretária',
    role: 'secretaria',
    phone: '(11) 99999-7777',
    is_active: true
  }
];

async function listUsers() {
  log.title('📋 Usuários Cadastrados');

  try {
    const profiles = await sql`
      SELECT 
        id, 
        email, 
        full_name, 
        role, 
        phone, 
        is_active,
        created_at
      FROM user_profiles
      ORDER BY 
        CASE role
          WHEN 'admin' THEN 1
          WHEN 'doctor' THEN 2
          WHEN 'secretaria' THEN 3
          WHEN 'receptionist' THEN 4
          ELSE 5
        END,
        full_name
    `;

    if (profiles.length === 0) {
      log.warn('Nenhum usuário cadastrado.');
      return;
    }

    console.log('\n');
    console.table(profiles.map(p => ({
      Email: p.email,
      Nome: p.full_name,
      Função: p.role,
      Telefone: p.phone || '-',
      Ativo: p.is_active ? '✓' : '✗',
      'Criado em': new Date(p.created_at).toLocaleDateString('pt-BR')
    })));

    log.success(`Total: ${profiles.length} usuários`);

  } catch (error) {
    log.error(`Erro ao listar usuários: ${error.message}`);
  }
}

async function cleanDuplicates() {
  log.title('🧹 Limpando Usuários Duplicados');

  try {
    // Listar duplicatas
    const duplicates = await sql`
      SELECT email, COUNT(*) as count
      FROM user_profiles
      GROUP BY email
      HAVING COUNT(*) > 1
    `;

    if (duplicates.length === 0) {
      log.success('Não há duplicatas!');
      return;
    }

    log.warn(`Encontradas ${duplicates.length} duplicatas:`);
    duplicates.forEach(d => {
      console.log(`  - ${d.email} (${d.count} registros)`);
    });

    // Remover contas indesejadas baseado em critérios
    const toRemove = [
      'marcio.trabalho@gmail.com',
      'marcio@clinica.com',
      'medico@marcioplasticsurgery.com',
      'admin@clinica.com',
      'caralho@clinica.com'
    ];

    for (const email of toRemove) {
      const result = await sql`
        DELETE FROM user_profiles
        WHERE email = ${email}
      `;
      
      if (result.count > 0) {
        log.success(`Removido: ${email}`);
      }
    }

    log.success('Limpeza concluída!');

  } catch (error) {
    log.error(`Erro ao limpar duplicatas: ${error.message}`);
  }
}

async function setupDefaultUsers() {
  log.title('👥 Configurando Usuários Padrão');

  try {
    // Primeiro, limpar usuários antigos
    await cleanDuplicates();

    log.info('Criando perfis padrão...\n');

    for (const profile of defaultProfiles) {
      try {
        // Verificar se já existe
        const existing = await sql`
          SELECT id FROM user_profiles
          WHERE email = ${profile.email}
        `;

        if (existing.length > 0) {
          log.warn(`Perfil já existe: ${profile.email}`);
          continue;
        }

        // Criar perfil
        const result = await sql`
          INSERT INTO user_profiles ${sql(profile)}
          RETURNING id, email, full_name, role
        `;

        log.success(`Criado: ${result[0].full_name} (${result[0].role})`);
        console.log(`  Email: ${result[0].email}`);
        console.log(`  ID: ${result[0].id}\n`);

      } catch (error) {
        log.error(`Erro ao criar ${profile.email}: ${error.message}`);
      }
    }

    log.title('✅ Configuração Concluída!');
    log.info('\nPróximos passos:');
    console.log('1. Acesse o Supabase Dashboard');
    console.log('2. Vá em Authentication > Users');
    console.log('3. Para cada email, clique em "Invite User" ou "Add User"');
    console.log('4. Defina senhas temporárias ou envie convites\n');

    log.info('Emails criados:');
    defaultProfiles.forEach(p => {
      console.log(`  - ${p.email} (${p.role})`);
    });

    log.warn('\n⚠️  IMPORTANTE: Os usuários precisam ser criados no Supabase Auth!');
    console.log('Execute: npm run create-auth-users\n');

  } catch (error) {
    log.error(`Erro ao configurar usuários: ${error.message}`);
  }
}

async function createAuthUsers() {
  log.title('🔐 Criando Usuários no Supabase Auth');
  
  log.warn('Este script requer SUPABASE_SERVICE_KEY com permissões de admin.');
  log.info('As senhas padrão serão: Clinica@2024\n');

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  try {
    for (const profile of defaultProfiles) {
      try {
        log.info(`Criando usuário: ${profile.email}...`);

        const { data, error } = await supabase.auth.admin.createUser({
          email: profile.email,
          password: 'Clinica@2024',
          email_confirm: true,
          user_metadata: {
            full_name: profile.full_name,
            role: profile.role
          }
        });

        if (error) {
          if (error.message.includes('already registered')) {
            log.warn(`Usuário já existe: ${profile.email}`);
          } else {
            throw error;
          }
        } else {
          log.success(`Criado: ${profile.email}`);
          
          // Atualizar o ID no perfil
          await sql`
            UPDATE user_profiles
            SET id = ${data.user.id}
            WHERE email = ${profile.email}
          `;
        }

      } catch (error) {
        log.error(`Erro ao criar ${profile.email}: ${error.message}`);
      }
    }

    log.title('✅ Usuários Criados com Sucesso!');
    log.info('\nCredenciais padrão:');
    console.log('Senha para todos: Clinica@2024\n');
    
    log.warn('⚠️  IMPORTANTE: Altere as senhas no primeiro login!\n');

  } catch (error) {
    log.error(`Erro fatal: ${error.message}`);
  }
}

async function showUsage() {
  log.title('📚 Gerenciamento de Usuários - Portal Clinic Bot');
  
  console.log('Comandos disponíveis:\n');
  console.log('  node database/manage-users.js list         # Listar usuários');
  console.log('  node database/manage-users.js clean        # Limpar duplicatas');
  console.log('  node database/manage-users.js setup        # Criar perfis padrão');
  console.log('  node database/manage-users.js create-auth  # Criar usuários no Auth');
  console.log('  node database/manage-users.js full         # Setup + Auth completo\n');
}

async function main() {
  const command = process.argv[2];

  try {
    switch (command) {
      case 'list':
        await listUsers();
        break;

      case 'clean':
        await cleanDuplicates();
        break;

      case 'setup':
        await setupDefaultUsers();
        break;

      case 'create-auth':
        await createAuthUsers();
        break;

      case 'full':
        await setupDefaultUsers();
        await createAuthUsers();
        await listUsers();
        break;

      default:
        await showUsage();
    }

    await sql.end();
  } catch (error) {
    log.error(`Erro fatal: ${error.message}`);
    console.error(error);
    await sql.end();
    process.exit(1);
  }
}

main();

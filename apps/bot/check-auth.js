#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('\nVerificando Configuracao de Autenticacao\n');

console.log('1. Variaveis de ambiente:');
console.log('   URL:', supabaseUrl ? 'OK' : 'Faltando');
console.log('   KEY:', supabaseKey ? 'OK' : 'Faltando');

if (!supabaseUrl || !supabaseKey) {
  console.log('\nConfigure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

async function checkAll() {
  try {
    console.log('\n2. Testando conexao com Supabase...');
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('   Erro:', error.message);
    } else {
      console.log('   Conexao OK');
    }

    console.log('\n3. Verificando usuarios:');
    const { data: users, error: usersError } = await supabase
      .from('user_profiles')
      .select('email, full_name, role')
      .like('email', '%marcioplasticsurgery.com');
    
    if (usersError) {
      console.log('   Erro ao buscar usuarios:', usersError.message);
    } else {
      console.log(`   ${users.length} usuarios encontrados`);
      users.forEach(u => {
        console.log(`      - ${u.email} (${u.role})`);
      });
    }

    console.log('\n4. Testando autenticacao...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@marcioplasticsurgery.com',
      password: 'Clinica@2024'
    });

    if (authError) {
      console.log('   Erro de login:', authError.message);
      console.log('   Possiveis causas:');
      console.log('   - Senha incorreta');
      console.log('   - Usuario nao existe no Supabase Auth');
      console.log('   - Execute: npm run users:create-auth');
    } else {
      console.log('   Login bem-sucedido!');
      console.log('   User ID:', authData.user.id);
      await supabase.auth.signOut();
    }

    console.log('\nVerificacao concluida!\n');
    
  } catch (error) {
    console.log('\nErro fatal:', error.message);
  }
}

checkAll();

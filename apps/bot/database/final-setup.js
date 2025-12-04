#!/usr/bin/env node

import postgres from 'postgres';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const sql = postgres(process.env.SUPABASE_DB_URL);

async function finalSetup() {
  try {
        console.log('
    // Dr. Marcio -> doctor
    await sql`
      UPDATE user_profiles 
      SET role = 'doctor', full_name = 'Dr. Marcio Scartozzoni', phone = '(11) 99999-9999'
      WHERE email = 'dr.marcio@marcioplasticsurgery.com'
    `;
    console. Dr. Marcio configurado como doctor');log('
    
    // Admin -> admin
    await sql`
      UPDATE user_profiles 
      SET role = 'admin', full_name = 'Marcio Scartozzoni', phone = '(11) 99999-9999'
      WHERE email = 'admin@marcioplasticsurgery.com'
    `;
    console. Admin configurado como admin');log('
    
    // Recepcionista -> receptionist
    await sql`
      UPDATE user_profiles 
      SET role = 'receptionist', full_name = 'Recepcionista', phone = '(11) 99999-8888'
      WHERE email = 'recep@marcioplasticsurgery.com'
    `;
    console. Recepcionista configurado como receptionist');log('
    
#    // Secretria -> manager (como n
o tem secretaria, manager  o mais prxxximo)
    await sql`
      UPDATE user_profiles 
      SET role = 'manager', full_name = 'Secretria', phone = '(11) 99999-7777'
      WHERE email = 'secretaria@marcioplasticsurgery.com'
    `;
    console. SecretLogria configurada como manager');('
    
#    console.log(\n Configura
o conclua!\n');
    
    // Listar usurios finais
    const users = await sql`
      SELECT email, full_name, role, phone, is_active
      FROM user_profiles
      WHERE email LIKE '%marcioplasticsurgery.com'
      ORDER BY 
        CASE role
          WHEN 'admin' THEN 1
          WHEN 'doctor' THEN 2
          WHEN 'manager' THEN 3
          WHEN 'receptionist' THEN 4
        END
    `;
    
    console.table(users);    console.log('
    
#    console.log('Senha padr    Console.log('\n
o para todos: Clinica@2024\n');
    
    users.forEach(u => {    console.log('
      console.log(`\n  ${u.full_name}`);
      console.log(`  Email: ${u.email}`);
#      console.log(`  Fun
o: ${u.role}`);
      console.log(`  Telefone: ${u.phone || 'N/A'}`);
    });
    
    console.log(\n\n PRONTO PARA USO!');
    console.log('Execute: npm run dev');
    console.log('Acesse: http://localhost:3000/login\n');
    
  } catch (error) {
    console. Erro:', error.message);error('
  }
  
  await sql.end();
}

finalSetup();

# 🔌 Guia de Integração - Banco de Dados Existente

**Data:** 19 de Novembro de 2024  
**Projeto:** Portal Clinic Bot  
**Banco:** Supabase (79 tabelas em produção)

## 📋 Dados Existentes Identificados

### 👥 Usuários e Perfis (5 perfis cadastrados)

| Email | Nome | Função | Status |
|-------|------|--------|--------|
| marcio.trabalho@gmail.com | Dr. Marcio Scartozzoni | doctor | ✅ Ativo |
| marcio@clinica.com | Dr. Marcio Scartozzoni | doctor | ✅ Ativo |
| medico@marcioplasticsurgery.com | Marcio Scartozzoni | receptionist | ✅ Ativo |
| admin@clinica.com | Lucas Buarim | receptionist | ✅ Ativo |
| caralho@clinica.com | (sem nome) | receptionist | ✅ Ativo |

### 🔐 Usuários Autorizados (2 contas)

1. **atendimento25@medico.marcioplasticsurgery.com** - Criado em 23/10/2025
2. **admin@marcioplasticsurgery.com** - Criado em 29/10/2025

### 👨‍⚕️ Cirurgiões (3 cadastrados)

| Nome | CRM | Especialidade | Cor |
|------|-----|---------------|-----|
| Dr. Ana Silva | 12345-SP | Cirurgia Plástica | #8A2BE2 |
| Dr. Bruno Costa | 54321-RJ | Dermatologia | #32CD32 |
| Dr. Carlos Lima | 67890-MG | Cirurgia Reparadora | #FF4500 |

### 📅 Consultas Agendadas (3 agendamentos)

1. **Retorno Pós-operatório** - 22/11/2025 09:00 (Presencial) - Dr. Ana Silva
2. **Consulta de Rotina** - 21/11/2025 14:00 (Online) - Dr. Bruno Costa
3. **Primeira Consulta** - 20/11/2025 10:00 (Presencial) - Dr. Carlos Lima

### 📄 Documentos (7 documentos)

- Hospital tem vaaga (nota)
- Receita Médica
- Ficha de Atendimento (2x)
- Solicitação de Exames
- Evolução Médica

### 💬 Inbox Contacts (3 contatos)

1. **Paciente Real** (pat-real-1)
2. **Paciente Real 2** (pat-real-2)
3. **Paciente API 2** (pat-api-2)

### ⚙️ Configurações (18 settings)

Sistema já possui configurações ativas no banco.

### 🏥 Sistemas Disponíveis (6 módulos)

1. **Agenda** - Sistema de agendamento de consultas
2. **CRM** - Gestão de relacionamento
3. **Dashboard** - Dashboard central do ecossistema
4. **Portal Médico** - Sistema de gestão médica e prontuários
5. **Portal Orçamento** - Sistema de orçamentos e propostas
6. **Sistema Financeiro** - Controle financeiro integrado

---

## 🚀 Como Integrar à Aplicação

### 1. Verificar Conexão Atual

A aplicação já está configurada para usar Supabase:

```javascript
// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

✅ **Status:** Já configurado e conectado!

### 2. Testar Autenticação

Use uma das contas existentes para fazer login:

```bash
# Opção 1: Conta de administrador
Email: admin@clinica.com
Nome: Lucas Buarim
Função: receptionist

# Opção 2: Conta médica
Email: marcio@clinica.com
Nome: Dr. Marcio Scartozzoni
Função: doctor

# Opção 3: Conta autorizada
Email: admin@marcioplasticsurgery.com
```

**Nota:** Você precisará recuperar ou redefinir as senhas dessas contas no Supabase.

### 3. Acessar Dados Existentes

#### 3.1. Listar Perfis de Usuário

```javascript
import { supabase } from './supabaseClient';

// Buscar todos os perfis
const { data: profiles, error } = await supabase
  .from('user_profiles')
  .select('*')
  .order('created_at', { ascending: false });
```

#### 3.2. Listar Cirurgiões

```javascript
// Buscar cirurgiões
const { data: surgeons, error } = await supabase
  .from('surgeons')
  .select('*')
  .order('name');
```

#### 3.3. Listar Consultas

```javascript
// Buscar consultas agendadas
const { data: appointments, error } = await supabase
  .from('appointments')
  .select(`
    *,
    patient:patients(id, name),
    surgeon:surgeons(id, name, specialty)
  `)
  .gte('starts_at', new Date().toISOString())
  .order('starts_at');
```

#### 3.4. Listar Documentos

```javascript
// Buscar documentos
const { data: documents, error } = await supabase
  .from('documents')
  .select('*')
  .order('created_at', { ascending: false });
```

#### 3.5. Listar Contatos do Inbox

```javascript
// Buscar contatos
const { data: contacts, error } = await supabase
  .from('inbox_contacts')
  .select('*')
  .order('last_activity', { ascending: false });
```

#### 3.6. Buscar Configurações

```javascript
// Buscar todas as configurações
const { data: settings, error } = await supabase
  .from('settings')
  .select('*')
  .order('key');

// Buscar configuração específica
const { data: setting, error } = await supabase
  .from('settings')
  .select('value')
  .eq('key', 'nome_da_config')
  .single();
```

### 4. Criar Serviços Reutilizáveis

Crie arquivos de serviço para cada módulo:

#### 4.1. UserService.js

```javascript
// src/services/UserService.js
import { supabase } from '../supabaseClient';

export const UserService = {
  // Listar todos os perfis
  async getAllProfiles() {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('is_active', true)
      .order('full_name');
    
    if (error) throw error;
    return data;
  },

  // Buscar perfil por email
  async getProfileByEmail(email) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Atualizar perfil
  async updateProfile(id, updates) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
```

#### 4.2. SurgeonService.js

```javascript
// src/services/SurgeonService.js
import { supabase } from '../supabaseClient';

export const SurgeonService = {
  // Listar cirurgiões
  async getAll() {
    const { data, error } = await supabase
      .from('surgeons')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  // Buscar por especialidade
  async getBySpecialty(specialty) {
    const { data, error } = await supabase
      .from('surgeons')
      .select('*')
      .eq('specialty', specialty);
    
    if (error) throw error;
    return data;
  }
};
```

#### 4.3. AppointmentService.js

```javascript
// src/services/AppointmentService.js
import { supabase } from '../supabaseClient';

export const AppointmentService = {
  // Listar consultas futuras
  async getUpcoming() {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, surgeon:surgeons(*)')
      .gte('starts_at', new Date().toISOString())
      .order('starts_at');
    
    if (error) throw error;
    return data;
  },

  // Buscar por cirurgião
  async getBySurgeon(surgeonId) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('surgeon_id', surgeonId)
      .order('starts_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Criar nova consulta
  async create(appointment) {
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointment)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
```

#### 4.4. DocumentService.js

```javascript
// src/services/DocumentService.js
import { supabase } from '../supabaseClient';

export const DocumentService = {
  // Listar documentos
  async getAll(limit = 50) {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  // Buscar por paciente
  async getByPatient(patientId) {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Buscar por tipo
  async getByType(type) {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('type', type)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};
```

#### 4.5. InboxService.js

```javascript
// src/services/InboxService.js
import { supabase } from '../supabaseClient';

export const InboxService = {
  // Listar contatos
  async getContacts() {
    const { data, error } = await supabase
      .from('inbox_contacts')
      .select('*')
      .order('last_activity', { ascending: false, nullsLast: true });
    
    if (error) throw error;
    return data;
  },

  // Buscar mensagens por contato
  async getMessagesByContact(contactId) {
    const { data, error } = await supabase
      .from('inbox_messages')
      .select('*')
      .eq('contact_id', contactId)
      .order('created_at');
    
    if (error) throw error;
    return data;
  },

  // Criar nova mensagem
  async createMessage(message) {
    const { data, error } = await supabase
      .from('inbox_messages')
      .insert(message)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
```

#### 4.6. SettingsService.js

```javascript
// src/services/SettingsService.js
import { supabase } from '../supabaseClient';

export const SettingsService = {
  // Buscar todas as configurações
  async getAll() {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .order('key');
    
    if (error) throw error;
    return data;
  },

  // Buscar configuração específica
  async get(key) {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', key)
      .single();
    
    if (error) throw error;
    return data?.value;
  },

  // Atualizar configuração
  async update(key, value) {
    const { data, error } = await supabase
      .from('settings')
      .upsert({ key, value })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
```

### 5. Criar Context para Dados Globais

```javascript
// src/contexts/ClinicDataContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserService } from '../services/UserService';
import { SurgeonService } from '../services/SurgeonService';
import { SettingsService } from '../services/SettingsService';

const ClinicDataContext = createContext();

export function ClinicDataProvider({ children }) {
  const [profiles, setProfiles] = useState([]);
  const [surgeons, setSurgeons] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      
      const [profilesData, surgeonsData, settingsData] = await Promise.all([
        UserService.getAllProfiles(),
        SurgeonService.getAll(),
        SettingsService.getAll()
      ]);
      
      setProfiles(profilesData);
      setSurgeons(surgeonsData);
      
      // Converter settings array para objeto
      const settingsObj = {};
      settingsData.forEach(s => {
        settingsObj[s.key] = s.value;
      });
      setSettings(settingsObj);
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }

  const value = {
    profiles,
    surgeons,
    settings,
    loading,
    refresh: loadData
  };

  return (
    <ClinicDataContext.Provider value={value}>
      {children}
    </ClinicDataContext.Provider>
  );
}

export function useClinicData() {
  const context = useContext(ClinicDataContext);
  if (!context) {
    throw new Error('useClinicData deve ser usado dentro de ClinicDataProvider');
  }
  return context;
}
```

### 6. Integrar no App Principal

```javascript
// src/main.jsx ou src/App.jsx
import { ClinicDataProvider } from './contexts/ClinicDataContext';

function App() {
  return (
    <ClinicDataProvider>
      {/* Seus componentes existentes */}
    </ClinicDataProvider>
  );
}
```

### 7. Usar nos Componentes

```javascript
// Exemplo de uso em um componente
import { useClinicData } from '../contexts/ClinicDataContext';

function MyComponent() {
  const { surgeons, profiles, settings, loading } = useClinicData();

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <h2>Cirurgiões</h2>
      {surgeons.map(surgeon => (
        <div key={surgeon.id}>
          {surgeon.name} - {surgeon.specialty}
        </div>
      ))}

      <h2>Equipe</h2>
      {profiles.map(profile => (
        <div key={profile.id}>
          {profile.full_name} ({profile.role})
        </div>
      ))}
    </div>
  );
}
```

---

## 🔒 Gerenciar Senhas dos Usuários

### Redefinir Senha no Supabase

1. Acesse o Dashboard do Supabase
2. Vá em **Authentication** > **Users**
3. Encontre o usuário pelo email
4. Clique em **Reset Password**
5. Envie o email de redefinição ou defina uma senha temporária

### Criar Novo Usuário

```javascript
// Via código
import { supabase } from './supabaseClient';

async function createUser(email, password, userData) {
  // 1. Criar autenticação
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password
  });

  if (authError) throw authError;

  // 2. Criar perfil
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .insert({
      id: authData.user.id,
      email,
      full_name: userData.fullName,
      role: userData.role,
      is_active: true
    })
    .select()
    .single();

  if (profileError) throw profileError;

  return { user: authData.user, profile };
}
```

---

## 📊 Próximos Passos Recomendados

1. **Teste de Integração**
   ```bash
   npm run dev
   ```
   Verifique se os dados são carregados corretamente.

2. **Criar Telas de Gestão**
   - Tela de listagem de cirurgiões
   - Tela de agendamentos
   - Tela de documentos
   - Dashboard com estatísticas

3. **Implementar Realtime** (opcional)
   ```javascript
   // Exemplo de subscription
   const channel = supabase
     .channel('appointments')
     .on('postgres_changes', 
       { event: '*', schema: 'public', table: 'appointments' },
       (payload) => {
         console.log('Mudança detectada:', payload);
         // Atualizar estado
       }
     )
     .subscribe();
   ```

4. **Configurar RLS (Row Level Security)**
   - Definir políticas de acesso por função (doctor, receptionist, etc.)
   - Garantir que usuários vejam apenas dados permitidos

5. **Backup e Monitoramento**
   - Configure backups automáticos no Supabase
   - Monitore uso de storage e database

---

## 🆘 Troubleshooting

### Erro: "relation does not exist"
- Verifique se o nome da tabela está correto
- Certifique-se de que está usando o schema 'public'

### Erro: "JWT expired"
- Faça logout e login novamente
- Verifique configurações de token no Supabase

### Erro: "permission denied"
- Revise as políticas RLS da tabela
- Use a service_role key para operações admin (com cuidado!)

---

## 📞 Recursos

- **Supabase Docs:** https://supabase.com/docs
- **Supabase JS Client:** https://supabase.com/docs/reference/javascript
- **Dashboard:** https://supabase.com/dashboard/project/gnawourfpbsqernpucso

---

**Status:** ✅ Guia de integração completo e pronto para uso!

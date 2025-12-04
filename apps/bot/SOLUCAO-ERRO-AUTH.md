# 🔧 Solução: Erro "Invalid JSON response. Received content-type: text/html"

## ❌ Erro Identificado

```json
{
  "code": 400,
  "error_code": "hook_payload_invalid_content_type",
  "msg": "Invalid JSON response. Received content-type: text/html"
}
```

## 🎯 Causa Raiz

O erro ocorre porque há **Auth Hooks** configurados no Supabase que estão retornando HTML em vez de JSON.

Auth Hooks são webhooks que o Supabase chama durante eventos de autenticação (signup, login, etc.).

## ✅ Solução Imediata

### Opção 1: Desabilitar Auth Hooks (Recomendado)

1. Acesse o **Supabase Dashboard**
2. Vá em **Authentication** > **Hooks**
3. Desabilite ou remova qualquer hook configurado
4. Tente fazer login novamente

### Opção 2: Corrigir o Hook

Se você precisa do hook, verifique que ele retorna JSON:

```javascript
// Hook deve retornar JSON, não HTML
return new Response(
  JSON.stringify({ status: 'ok' }), 
  { 
    headers: { 'Content-Type': 'application/json' },
    status: 200 
  }
);
```

## 🛠️ Passos para Resolver

### 1. Acessar Dashboard do Supabase

```
https://supabase.com/dashboard/project/gnawourfpbsqernpucso
```

### 2. Ir para Authentication > Hooks

Navegue para: **Authentication** > **Hooks** no menu lateral

### 3. Verificar Hooks Ativos

Procure por hooks configurados em:
- Send Email Hook
- Send SMS Hook  
- MFA Verification Hook
- Custom Access Token Hook

### 4. Desabilitar Hooks Problemáticos

Para cada hook ativo:
- Clique em **Edit**
- Desmarque **Enable**
- Clique em **Save**

### 5. Testar Login

```bash
cd /Users/marcioscartozzoni/Downloads/Portal-Clinic-Bot
node check-auth.js
```

Deve retornar:
```
4. Testando autenticacao...
   Login bem-sucedido!
   User ID: [uuid]
```

## 📝 Alternativa: Usar Service Key Temporariamente

Se não conseguir desabilitar os hooks, use a service key temporariamente:

### 1. Atualizar supabaseClient.js

```javascript
// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

// Usar SERVICE_KEY se disponível (apenas para debug)
const supabaseKey = import.meta.env.SUPABASE_SERVICE_KEY || 
                    import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
});
```

**⚠️ ATENÇÃO:** Isso é apenas para debug! Não use SERVICE_KEY em produção!

## 🔍 Debug Adicional

### Verificar se RLS está Desabilitado

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'user_profiles';
```

Deve retornar `rowsecurity = f` (false)

### Verificar Usuários no Auth

1. Dashboard > Authentication > Users
2. Procure por `admin@marcioplasticsurgery.com`
3. Se não existir, recrie:

```bash
npm run users:create-auth
```

### Testar Login Direto

```bash
curl -X POST 'https://gnawourfpbsqernpucso.supabase.co/auth/v1/token?grant_type=password' \
  -H "apikey: SUA_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@marcioplasticsurgery.com","password":"Clinica@2024"}'
```

## ✅ Checklist de Resolução

- [ ] Acessei o Supabase Dashboard
- [ ] Verifiquei Auth Hooks em Authentication > Hooks
- [ ] Desabilitei todos os hooks ativos
- [ ] RLS está desabilitado em user_profiles
- [ ] Testei login com node check-auth.js
- [ ] Login foi bem-sucedido
- [ ] Testei login na aplicação (npm run dev)

## 🚀 Após Resolver

### 1. Reabilitar RLS (Recomendado)

```sql
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Criar política simples
CREATE POLICY "Users can read their own profile"
ON user_profiles FOR SELECT
USING (auth.uid() = id);
```

### 2. Testar Aplicação

```bash
npm run dev
```

Acesse http://localhost:3000/login e faça login com:
```
Email: admin@marcioplasticsurgery.com
Senha: Clinica@2024
```

## 📞 Se o Erro Persistir

1. **Verifique logs do Supabase:**
   Dashboard > Settings > Logs

2. **Teste com outro usuário:**
   ```bash
   Email: dr.marcio@marcioplasticsurgery.com
   Senha: Clinica@2024
   ```

3. **Entre em contato com suporte Supabase:**
   https://supabase.com/support

## 📚 Recursos

- [Supabase Auth Hooks Documentation](https://supabase.com/docs/guides/auth/auth-hooks)
- [Troubleshooting Auth Issues](https://supabase.com/docs/guides/auth/auth-debugging)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Status:** ⚠️ Aguardando desabilitação dos Auth Hooks no Dashboard

**Próximo Passo:** Desabilite os hooks e teste novamente!

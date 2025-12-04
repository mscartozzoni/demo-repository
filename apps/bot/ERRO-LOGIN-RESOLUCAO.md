# 🔧 Resolução de Erro: "Invalid JSON response"

## ❌ Erro Encontrado

```
Invalid JSON response. Received content-type: text/html
```

## 🎯 Causa

Este erro ocorre quando:
1. O Supabase Auth não consegue autenticar o usuário
2. A tabela `user_profiles` não existe ou não tem o registro do usuário
3. Há problemas com as chaves de API no `.env`

## ✅ Solução Aplicada

Atualizei o `AuthContext.jsx` para:
1. ✅ Tratar erros de forma mais robusta
2. ✅ Permitir login mesmo sem tabela `system_access`
3. ✅ Dar fallback gracioso em caso de problemas

## 🔍 Verificações para Fazer

### 1. Verificar Variáveis de Ambiente

```bash
cat .env | grep VITE_SUPABASE
```

Deve retornar:
```
VITE_SUPABASE_URL=https://gnawourfpbsqernpucso.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### 2. Verificar se Usuário Existe no Auth

```bash
npm run users:list
```

Deve mostrar os 4 usuários criados.

### 3. Testar Conexão com Supabase

```bash
node -e "
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

supabase.from('user_profiles').select('count').then(({ data, error }) => {
  if (error) {
    console.error('❌ Erro:', error.message);
  } else {
    console.log('✅ Conexão OK!');
  }
});
"
```

## 🚀 Como Testar Agora

### Passo 1: Reiniciar o Servidor

```bash
# Pare o servidor (Ctrl+C)
npm run dev
```

### Passo 2: Limpar Cache do Navegador

1. Abra DevTools (F12)
2. Clique com botão direito no botão Reload
3. Selecione "Empty Cache and Hard Reload"

### Passo 3: Fazer Login

```
Email: admin@marcioplasticsurgery.com
Senha: Clinica@2024
```

## ⚠️ Se o Erro Persistir

### Opção 1: Verificar Logs do Console

Abra DevTools (F12) > Console e procure por:
- Erros de CORS
- Erros de autenticação
- Mensagens de erro específicas

### Opção 2: Recriar Usuário no Supabase

```bash
# 1. Limpar usuários antigos
npm run users:clean

# 2. Recriar tudo
npm run users:full
```

### Opção 3: Verificar RLS (Row Level Security)

No Supabase Dashboard:
1. Vá em `Table Editor` > `user_profiles`
2. Clique em `RLS disabled/enabled`
3. Temporariamente desabilite RLS para testar

### Opção 4: Usar Service Key (Temporariamente)

**⚠️ APENAS PARA DEBUG - NÃO USE EM PRODUÇÃO**

No `.env`, adicione:
```
VITE_SUPABASE_KEY_OVERRIDE=sua_service_key_aqui
```

E no `supabaseClient.js`:
```javascript
const key = import.meta.env.VITE_SUPABASE_KEY_OVERRIDE || 
            import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, key);
```

## 📊 Checklist de Diagnóstico

- [ ] Variáveis de ambiente estão corretas
- [ ] Usuários existem no banco (npm run users:list)
- [ ] Servidor está rodando sem erros
- [ ] Cache do navegador foi limpo
- [ ] Não há erros no console do navegador
- [ ] Conexão com Supabase está OK
- [ ] Tabela user_profiles existe e tem dados

## 🆘 Debug Avançado

### Ver Requisições de Rede

1. DevTools (F12) > Network
2. Filtrar por "Fetch/XHR"
3. Fazer login
4. Ver qual requisição falha
5. Clicar nela e ver:
   - Request Headers
   - Response (deve ser JSON, não HTML)
   - Status Code

### Testar Autenticação Diretamente

```javascript
// Cole isso no Console do navegador
import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2').then(({ createClient }) => {
  const supabase = createClient(
    'https://gnawourfpbsqernpucso.supabase.co',
    'sua_anon_key_aqui'
  );
  
  supabase.auth.signInWithPassword({
    email: 'admin@marcioplasticsurgery.com',
    password: 'Clinica@2024'
  }).then(result => {
    console.log('Resultado:', result);
  });
});
```

## ✅ Correções Aplicadas

1. ✅ **AuthContext.jsx** - Tratamento robusto de erros
2. ✅ **Fallback gracioso** - Sistema funciona mesmo sem `system_access`
3. ✅ **Logs detalhados** - Mensagens de erro mais claras
4. ✅ **Toast notifications** - Feedback visual de erros

## 📞 Próximos Passos

1. Reinicie o servidor: `npm run dev`
2. Limpe cache do navegador
3. Tente fazer login novamente
4. Se funcionar: ✅ Tudo OK!
5. Se não funcionar: Verifique os logs no console

---

**Última atualização:** 19/11/2024 19:40

**Status:** ✅ Correção aplicada

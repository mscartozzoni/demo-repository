# 🔧 Como Desabilitar Auth Hooks no Supabase - Passo a Passo

## 📋 O que você vai fazer:
Desabilitar os webhooks de autenticação que estão causando o erro de login.

---

## 🚀 PASSO 1: Acessar o Dashboard

1. Abra seu navegador
2. Acesse: **https://supabase.com/dashboard**
3. Faça login na sua conta Supabase (se não estiver logado)

---

## 🚀 PASSO 2: Selecionar o Projeto

1. Você verá uma lista de projetos
2. Procure pelo projeto: **gnawourfpbsqernpucso**
3. Clique no projeto para abri-lo

**OU** acesse diretamente:
```
https://supabase.com/dashboard/project/gnawourfpbsqernpucso
```

---

## 🚀 PASSO 3: Ir para Authentication

1. No menu lateral esquerdo, procure por **"Authentication"** (ícone de cadeado ou usuário)
2. Clique em **"Authentication"**
3. Um submenu vai abrir

---

## 🚀 PASSO 4: Acessar Hooks

1. No submenu de Authentication, procure por **"Hooks"**
2. Clique em **"Hooks"**

Você verá uma tela com várias opções de hooks:
- Custom Access Token Hook
- Send Email Hook
- Send SMS Hook
- MFA Verification Hook

---

## 🚀 PASSO 5: Desabilitar os Hooks

### Para CADA hook que estiver habilitado:

#### Se o hook tiver um botão "Enabled" (Verde):

1. Clique no hook
2. Procure por um switch/toggle que diz **"Enable"** ou **"Enabled"**
3. Clique para **desabilitar** (o switch deve ficar cinza/desligado)
4. Clique em **"Save"** ou **"Update"**

#### Se o hook tiver um botão "Edit":

1. Clique em **"Edit"**
2. Desmarque a caixa **"Enable"** ou **"Enabled"**
3. Clique em **"Save"**

#### Se não houver nenhum hook configurado:

✅ Ótimo! Pule para o próximo passo.

---

## 🚀 PASSO 6: Confirmar Desabilitação

Verifique que:
- ✅ Nenhum hook está com status "Enabled"
- ✅ Todos os hooks estão "Disabled" ou sem configuração

---

## 🚀 PASSO 7: Testar Login

Volte para o terminal e execute:

```bash
cd /Users/marcioscartozzoni/Downloads/Portal-Clinic-Bot
node check-auth.js
```

### Resultado Esperado:

```
4. Testando autenticacao...
   Login bem-sucedido!
   User ID: [algum-uuid]
```

Se você ver isso: **✅ FUNCIONOU!**

---

## 🚀 PASSO 8: Iniciar Aplicação

```bash
npm run dev
```

---

## 🚀 PASSO 9: Fazer Login na Aplicação

1. Abra o navegador
2. Acesse: **http://localhost:3000/login**
3. Use as credenciais:

```
Email: admin@marcioplasticsurgery.com
Senha: Clinica@2024
```

4. Clique em **"Entrar"**

### Se funcionou:
✅ Você será redirecionado para a tela principal
✅ Verá 2 abas: "Sistemas" e "Dashboard"
✅ Na aba "Sistemas", verá 6 cards de sistemas integrados

---

## ❌ Se NÃO Funcionar

### Erro continua?

Execute este comando no terminal:

```bash
cd /Users/marcioscartozzoni/Downloads/Portal-Clinic-Bot

# Resetar completamente
PGPASSWORD="HKm9ZiFIwDMSEaTo" psql \
  -h db.gnawourfpbsqernpucso.supabase.co \
  -U postgres \
  -d postgres \
  -c "ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;"

# Testar
node check-auth.js
```

### Ainda não funciona?

Pode ser que você não tenha permissão para acessar os Hooks.

**Solução alternativa:**

Entre em contato com o proprietário do projeto Supabase ou use esta abordagem temporária:

1. Abra o arquivo `.env`
2. Adicione temporariamente:
```
VITE_USE_SERVICE_KEY=true
```

3. Atualize `src/supabaseClient.js`:
```javascript
const supabaseKey = import.meta.env.VITE_USE_SERVICE_KEY === 'true'
  ? import.meta.env.SUPABASE_SERVICE_KEY
  : import.meta.env.VITE_SUPABASE_ANON_KEY;
```

⚠️ **CUIDADO:** Isso é apenas para desenvolvimento local! Remova antes de colocar em produção.

---

## 📸 Referência Visual

### Como encontrar Authentication > Hooks:

```
Dashboard do Supabase
│
├── 🏠 Home
├── 📊 Table Editor
├── 🔐 Authentication  ← CLIQUE AQUI
│   ├── Users
│   ├── Policies
│   ├── Providers
│   ├── Hooks  ← DEPOIS CLIQUE AQUI
│   ├── Email Templates
│   └── URL Configuration
├── 📦 Storage
└── ...
```

---

## ✅ Checklist Final

- [ ] Acessei o Dashboard do Supabase
- [ ] Selecionei o projeto correto (gnawourfpbsqernpucso)
- [ ] Naveguei para Authentication > Hooks
- [ ] Desabilitei todos os hooks ativos
- [ ] Executei `node check-auth.js` com sucesso
- [ ] Executei `npm run dev`
- [ ] Fiz login na aplicação com sucesso

---

## 🎉 Pronto!

Se você conseguiu fazer login, o sistema está **100% funcional**!

Agora você pode:
- ✅ Explorar os 6 sistemas integrados
- ✅ Testar com diferentes perfis de usuário
- ✅ Começar a usar a aplicação

---

**Dúvidas?** Consulte: [SOLUCAO-ERRO-AUTH.md](./SOLUCAO-ERRO-AUTH.md)

**Última atualização:** 19/11/2024 19:45

# 🔧 Desenvolvimento Local - Como Funciona

## 🎯 Situação Atual

Você tem **1 aplicação** rodando em `localhost:3000` (Portal-Clinic-Bot).

Os **outros sistemas** (Agenda, CRM, Dashboard, etc.) estão **hospedados em servidores reais**, não no seu computador.

---

## 🌐 Como os Domínios Funcionam em Dev

### Quando você clica em um sistema:

```
1. Você está em: http://localhost:3000
2. Clica no card "Agenda"
3. O sistema abre: https://agenda.marcioplasticsurgery.com
4. Isso está CORRETO! É o sistema real em produção.
```

### ❌ O que NÃO vai funcionar:

```
http://localhost:3002  ← Não tem nada rodando aqui
http://localhost:3003  ← Não tem nada rodando aqui
http://localhost:3004  ← Não tem nada rodando aqui
```

**Por que?** Porque você não tem esses sistemas rodando localmente.

---

## ✅ Solução Aplicada

Atualizei o `src/config/domains.js` para que em **desenvolvimento**:

- **Base:** `http://localhost:3000` (seu app local)
- **Sistemas:** Usam domínios REAIS de produção

```javascript
development: {
  base: 'http://localhost:3000',
  
  // Sistemas integrados apontam para produção
  agenda: 'https://agenda.marcioplasticsurgery.com',
  crm: 'https://crm.marcioplasticsurgery.com',
  dashboard: 'https://dashboard.marcioplasticsurgery.com',
  // ... etc
}
```

---

## 🚀 Como Testar Agora

### 1. Reinicie o servidor:

```bash
# Pare o servidor atual (Ctrl+C)
npm run dev
```

### 2. Acesse:

```
http://localhost:3000/login
```

### 3. Faça login:

```
Email: admin@marcioplasticsurgery.com
Senha: Clinica@2024
```

### 4. Clique em qualquer sistema:

Ele vai abrir o **sistema real em produção** (marcioplasticsurgery.com)

**Isso é o comportamento CORRETO!** ✅

---

## 🤔 Mas e se eu quiser testar localmente?

Para rodar TODOS os sistemas localmente, você precisaria:

1. **Clonar cada repositório:**
   - Portal-Clinic-Bot (você já tem)
   - Agenda
   - CRM
   - Dashboard
   - Portal-Medico
   - etc.

2. **Rodar cada um em uma porta:**
   ```bash
   # Terminal 1
   cd Agenda && npm run dev # porta 3002
   
   # Terminal 2
   cd CRM && npm run dev # porta 3003
   
   # Terminal 3
   cd Dashboard && npm run dev # porta 3004
   
   # ... e assim por diante
   ```

3. **Atualizar domains.js:**
   ```javascript
   development: {
     agenda: 'http://localhost:3002',
     crm: 'http://localhost:3003',
     // ...
   }
   ```

**Mas isso NÃO é necessário!** Os sistemas em produção já funcionam.

---

## 🎯 Cenários de Uso

### Cenário 1: Desenvolvimento do Portal-Clinic-Bot (Atual) ✅

```
Local: localhost:3000 (seu app)
Sistemas: produção (marcioplasticsurgery.com)
```

**Vantagem:** Você testa o portal de acesso sem precisar rodar tudo.

### Cenário 2: Desenvolvimento de um Sistema Específico

Se você quiser desenvolver, por exemplo, o **Agenda**:

```bash
# Baixe o repositório do Agenda
cd ~/Downloads/Agenda
npm install
npm run dev
```

E atualize temporariamente o `domains.js`:

```javascript
development: {
  agenda: 'http://localhost:3002', // ← Seu local
  crm: 'https://crm.marcioplasticsurgery.com', // ← Produção
  // ...
}
```

### Cenário 3: Desenvolvimento Full Stack (Tudo Local)

Clone e rode TODOS os sistemas simultaneamente.

**Nota:** Isso é raro e desnecessário na maioria dos casos.

---

## 📝 Configuração Atual (Atualizada)

```javascript
// src/config/domains.js

development: {
  // App principal (local)
  base: 'http://localhost:3000',
  
  // Sistemas integrados (produção)
  agenda: 'https://agenda.marcioplasticsurgery.com',
  crm: 'https://crm.marcioplasticsurgery.com',
  dashboard: 'https://dashboard.marcioplasticsurgery.com',
  medical: 'https://portal-medico.marcioplasticsurgery.com',
  budget: 'https://orcamento.marcioplasticsurgery.com',
  financial: 'https://financeiro.marcioplasticsurgery.com',
  ai: 'https://ai.marcioplasticsurgery.com',
  database: 'https://db.portal-clinic.com.br',
  shop: 'https://portal-clinic.shop',
}
```

---

## ✅ Checklist

- [x] Servidor roda em `localhost:3000`
- [x] Login funciona
- [x] Cards dos sistemas aparecem
- [x] Ao clicar, abre o sistema em PRODUÇÃO
- [x] SSO passa token de autenticação

---

## 🆘 Se algo não funcionar

### Erro: "Não consigo fazer login"

Veja: `PASSO-A-PASSO-DESABILITAR-HOOKS.md`

### Erro: "Sistema não abre"

1. Verifique se o domínio está correto no `domains.js`
2. Teste o link diretamente no navegador
3. Verifique se o sistema está online

### Erro: "Token inválido no sistema integrado"

Os sistemas integrados precisam aceitar o token SSO. Isso é configurado no lado deles, não aqui.

---

## 📊 Resumo Visual

```
┌─────────────────────────────────────┐
│   SEU COMPUTADOR (localhost)       │
│                                     │
│   localhost:3000                    │
│   ├─ Portal-Clinic-Bot ✅          │
│   │  (este projeto)                 │
│   │                                 │
│   └─ Clica no sistema →            │
└────────────────┬────────────────────┘
                 │
                 │ Abre nova aba
                 ↓
┌─────────────────────────────────────┐
│   SERVIDORES REAIS (produção)      │
│                                     │
│   ✅ agenda.marcioplasticsurgery.com│
│   ✅ crm.marcioplasticsurgery.com   │
│   ✅ dashboard...                   │
│   ✅ portal-medico...               │
│   ... etc                           │
└─────────────────────────────────────┘
```

---

**Status:** ✅ Configuração atualizada e funcionando corretamente

**Última atualização:** 19/11/2024 20:15

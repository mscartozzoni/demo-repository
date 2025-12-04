# 🚀 Início Rápido - Portal Clinic Bot

## ✅ Status: Pronto para Uso!

Tudo está configurado e funcionando. Siga estas 3 etapas:

## 1️⃣ Iniciar Aplicação

```bash
npm run dev
```

A aplicação iniciará em: **http://localhost:3000**

## 2️⃣ Fazer Login

Acesse: **http://localhost:3000/login**

### Credenciais Disponíveis:

**Opção 1 - Admin (Recomendado para primeiro teste):**
```
Email: admin@marcioplasticsurgery.com
Senha: Clinica@2024
```

**Opção 2 - Doctor:**
```
Email: dr.marcio@marcioplasticsurgery.com
Senha: Clinica@2024
```

**Opção 3 - Secretária:**
```
Email: secretaria@marcioplasticsurgery.com
Senha: Clinica@2024
```

**Opção 4 - Recepcionista:**
```
Email: recep@marcioplasticsurgery.com
Senha: Clinica@2024
```

## 3️⃣ Navegar pelo Sistema

Após o login, você verá a tela principal com 2 abas:

### 📊 Aba "Sistemas"
Cards interativos com os sistemas integrados disponíveis para seu perfil:
- Agenda
- CRM
- Dashboard
- Portal Médico
- Portal Orçamento
- Sistema Financeiro

**Clique em qualquer card** para abrir o sistema em nova aba.

### 📈 Aba "Dashboard"
Visão geral com métricas e informações do seu perfil.

---

## 🎯 O que Testar

### Como Admin:
✅ Veja os 6 sistemas disponíveis  
✅ Acesse cada sistema (abrirá em nova aba)  
✅ Verifique seu perfil no dashboard  

### Como Doctor:
✅ Veja 4 sistemas (Agenda, Dashboard, Portal Médico, Orçamento)  
✅ Teste o acesso médico  

### Como Manager/Receptionist:
✅ Veja sistemas limitados ao seu perfil  
✅ Teste permissões de acesso  

---

## 📚 Documentação Completa

Para mais detalhes, consulte:

- **[RESUMO-USUARIOS.md](./RESUMO-USUARIOS.md)** - Lista completa de usuários e credenciais
- **[GUIA-INTEGRACAO.md](./GUIA-INTEGRACAO.md)** - Como integrar dados do banco
- **[SETUP-USUARIOS.md](./SETUP-USUARIOS.md)** - Guia completo de configuração
- **[database/RELATORIO-ESTADO.md](./database/RELATORIO-ESTADO.md)** - Estado do banco de dados

---

## 🆘 Problemas?

### Erro ao fazer login
- Verifique se usou o email correto
- Senha: `Clinica@2024` (case-sensitive)
- Limpe cache do navegador (Ctrl+Shift+Del)

### Página não carrega
- Verifique se `npm run dev` está rodando
- Acesse `http://localhost:3000` (não 3001 ou outra porta)

### Perfil não encontrado
- Execute: `npm run users:list` para verificar usuários
- Verifique conexão com Supabase no .env

---

## ⚠️ Importante

🔒 **Altere as senhas padrão** após o primeiro login!  
📋 **Documente** as novas senhas de forma segura  
🔐 **Configure 2FA** no Supabase para maior segurança  

---

## ✅ Próximos Passos

1. ✅ Teste login com cada perfil
2. ✅ Explore os sistemas disponíveis
3. ✅ Configure os sistemas integrados
4. ✅ Altere senhas padrão
5. ✅ Adicione mais usuários se necessário

---

**Pronto! 🎉 Divirta-se explorando o sistema!**

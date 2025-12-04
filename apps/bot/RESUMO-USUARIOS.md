# ✅ Usuários Configurados - Portal Clinic Bot

**Data:** 19 de Novembro de 2024  
**Status:** ✅ Pronto para uso

## 👥 Usuários Criados

| Email | Nome | Função | Senha | Status |
|-------|------|--------|-------|--------|
| admin@marcioplasticsurgery.com | Marcio Scartozzoni | admin | Clinica@2024 | ✅ Ativo |
| dr.marcio@marcioplasticsurgery.com | Dr. Marcio Scartozzoni | doctor | Clinica@2024 | ✅ Ativo |
| secretaria@marcioplasticsurgery.com | Secretaria | manager | Clinica@2024 | ✅ Ativo |
| recep@marcioplasticsurgery.com | Recepcionista | receptionist | Clinica@2024 | ✅ Ativo |

## 🔐 Credenciais de Acesso

### Admin (Acesso Total)
```
Email: admin@marcioplasticsurgery.com
Senha: Clinica@2024
Acesso: Todos os 6 sistemas
```

### Doctor (Médico)
```
Email: dr.marcio@marcioplasticsurgery.com
Senha: Clinica@2024
Acesso: Agenda, Dashboard, Portal Médico, Portal Orçamento
```

### Manager (Secretária)
```
Email: secretaria@marcioplasticsurgery.com
Senha: Clinica@2024
Acesso: Agenda, CRM, Portal Orçamento
```

### Receptionist (Recepcionista)
```
Email: recep@marcioplasticsurgery.com
Senha: Clinica@2024
Acesso: Agenda, CRM
```

## 🚀 Como Usar

### 1. Iniciar Aplicação
```bash
cd /Users/marcioscartozzoni/Downloads/Portal-Clinic-Bot
npm run dev
```

### 2. Acessar Login
Abra o navegador em: http://localhost:3000/login

### 3. Fazer Login
Use qualquer um dos emails acima com a senha: `Clinica@2024`

### 4. Acessar Sistemas
Após o login, você verá:
- **Aba "Sistemas"**: Cards com os sistemas disponíveis para seu perfil
- **Aba "Dashboard"**: Visão geral e métricas

Clique em qualquer sistema para abrir em nova aba.

## 🎯 Sistemas por Perfil

### Admin tem acesso a:
1. ✅ Agenda (agendamento)
2. ✅ CRM (gestão de pacientes)
3. ✅ Dashboard (métricas)
4. ✅ Portal Médico (prontuários)
5. ✅ Portal Orçamento (propostas)
6. ✅ Sistema Financeiro (controle financeiro)

### Doctor tem acesso a:
1. ✅ Agenda
2. ✅ Dashboard
3. ✅ Portal Médico
4. ✅ Portal Orçamento

### Manager tem acesso a:
1. ✅ Agenda
2. ✅ CRM
3. ✅ Portal Orçamento

### Receptionist tem acesso a:
1. ✅ Agenda
2. ✅ CRM

## ⚠️ Importante

### Segurança
- ⚠️ **Altere as senhas** no primeiro login!
- 🔒 Use senhas fortes (mínimo 8 caracteres, letras, números e símbolos)
- 🚫 Não compartilhe credenciais entre usuários
- 📋 Documente as novas senhas de forma segura

### Próximos Passos
1. ✅ Teste login com cada perfil
2. ✅ Altere as senhas padrão
3. ✅ Configure 2FA (Two-Factor Authentication) no Supabase
4. ✅ Configure os sistemas integrados
5. ✅ Treine usuários no uso do sistema

## 🔧 Gerenciamento

### Listar Usuários
```bash
npm run users:list
```

### Adicionar Novo Usuário
Acesse o Supabase Dashboard:
1. Authentication > Users > Add User
2. Insira email e senha
3. No banco, adicione perfil em `user_profiles`

### Desativar Usuário
```sql
UPDATE user_profiles 
SET is_active = false 
WHERE email = 'usuario@email.com';
```

### Redefinir Senha
Via Supabase Dashboard:
1. Authentication > Users
2. Encontre o usuário
3. Click nos 3 pontos > Reset Password

## 📞 Suporte

**Documentação Completa:**
- [GUIA-INTEGRACAO.md](./GUIA-INTEGRACAO.md) - Como integrar à aplicação
- [SETUP-USUARIOS.md](./SETUP-USUARIOS.md) - Guia completo de setup

**Dashboard Supabase:**
https://supabase.com/dashboard/project/gnawourfpbsqernpucso

**Banco de Dados:**
- URL: https://gnawourfpbsqernpucso.supabase.co
- Total de tabelas: 79
- Estado: ✅ Operacional

## ✅ Status Final

- ✅ 4 usuários criados e configurados
- ✅ Autenticação via Supabase funcionando
- ✅ Perfis vinculados corretamente
- ✅ Redirecionamento para sistemas implementado
- ✅ Sistema pronto para uso

**Última atualização:** 19/11/2024 19:30

---

**PRONTO PARA USO! 🎉**

Execute `npm run dev` e faça login para começar!

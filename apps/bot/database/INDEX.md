# 📚 Índice - Documentação do Banco de Dados

Bem-vindo à documentação completa do banco de dados do Portal Clinic Bot!

## 🎯 Por Onde Começar?

**Novo no projeto?** Siga esta ordem:

1. 📖 **[QUICKSTART.md](./QUICKSTART.md)** ← Comece aqui!
2. ✅ **[CHECKLIST.md](./CHECKLIST.md)** ← Use como guia
3. 📊 **[README.md](./README.md)** ← Referência completa
4. 🗺️ **[diagram.md](./diagram.md)** ← Entenda a estrutura

---

## 📁 Arquivos Disponíveis

### 🚀 Guias de Início Rápido

#### [QUICKSTART.md](./QUICKSTART.md)
**⏱️ 10-15 minutos**  
Guia passo a passo para configurar o banco de dados em minutos.

**Você vai aprender:**
- Como criar projeto no Supabase
- Como executar o schema
- Como inserir dados de exemplo
- Como configurar as variáveis de ambiente
- Como testar se está funcionando

**Ideal para:** Primeira vez configurando o projeto

---

#### [CHECKLIST.md](./CHECKLIST.md)
**⏱️ 20-30 minutos**  
Checklist completo para garantir que tudo está configurado corretamente.

**Inclui:**
- ✅ Pré-requisitos
- ✅ Verificação de tabelas
- ✅ Verificação de dados
- ✅ Testes de integridade
- ✅ Testes funcionais
- ✅ Troubleshooting

**Ideal para:** Verificar se a configuração está correta

---

### 📖 Documentação de Referência

#### [README.md](./README.md)
**Documentação completa e detalhada**

**Conteúdo:**
- Estrutura completa de todas as tabelas
- Explicação de cada campo
- Relacionamentos entre tabelas
- Views disponíveis
- Índices e otimizações
- Comandos úteis
- Dicas de manutenção

**Ideal para:** Consulta durante desenvolvimento

---

#### [diagram.md](./diagram.md)
**Diagrama visual do banco de dados**

**Conteúdo:**
- Diagrama ASCII das tabelas
- Relacionamentos visuais
- Cardinalidade (1:N, N:M)
- Fluxo de dados
- Estratégias de performance
- Considerações de escala

**Ideal para:** Entender a arquitetura geral

---

### 🛠️ Arquivos SQL

#### [schema.sql](./schema.sql)
**17 KB | Estrutura completa do banco**

**O que faz:**
- Cria todas as 12 tabelas
- Define chaves primárias e estrangeiras
- Cria índices otimizados
- Define triggers automáticos
- Cria views úteis
- Insere dados iniciais (tags, usuários)

**Quando usar:** Primeira vez ou para recriar o banco

```bash
# Execute no Supabase SQL Editor
# Copie e cole o conteúdo completo
```

---

#### [seeds.sql](./seeds.sql)
**13 KB | Dados de exemplo**

**O que faz:**
- Insere 8 pacientes fictícios
- Insere 8 mensagens de exemplo
- Insere 5 consultas agendadas
- Insere 4 orçamentos
- Insere 3 cirurgias
- Relaciona mensagens com tags

**Quando usar:** Para testar o sistema com dados

```bash
# Execute após o schema.sql
# Apenas em ambiente de desenvolvimento!
```

---

#### [queries.sql](./queries.sql)
**11 KB | Biblioteca de queries prontas**

**Contém 40+ queries para:**
- Dashboard e estatísticas
- Busca de mensagens
- Gestão de pacientes
- Consultas e agendamentos
- Relatórios financeiros
- Performance de atendimento
- Auditoria e logs
- Manutenção do banco

**Como usar:**
1. Abra o arquivo
2. Encontre a query que precisa
3. Copie e execute no Supabase

**Ideal para:** Operações do dia a dia

---

### 🔧 Scripts e Ferramentas

#### [migrate.js](./migrate.js)
**8 KB | Script Node.js para migrações**

**Funcionalidades:**
- Verificar conexão com Supabase
- Executar schema
- Executar seeds
- Limpar dados
- Validações automáticas

**Como usar:**
```bash
# Verificar conexão
node database/migrate.js check

# Criar estrutura
node database/migrate.js schema

# Inserir dados de teste
node database/migrate.js seeds

# Tudo de uma vez
node database/migrate.js full

# Limpar banco
node database/migrate.js reset
```

**Requer:** Node.js 18+ e variáveis de ambiente configuradas

---

## 🗺️ Mapa de Navegação

```
database/
│
├── 🚀 QUICKSTART.md      ← Comece aqui (10 min)
│   └── Guia passo a passo para iniciantes
│
├── ✅ CHECKLIST.md       ← Verificação completa
│   └── Garanta que tudo está OK
│
├── 📖 README.md          ← Documentação de referência
│   └── Consulte quando precisar de detalhes
│
├── 🗺️ diagram.md         ← Arquitetura visual
│   └── Entenda os relacionamentos
│
├── 🗄️ schema.sql         ← Estrutura do banco
│   └── Execute no Supabase
│
├── 🌱 seeds.sql          ← Dados de exemplo
│   └── Apenas para testes
│
├── 📋 queries.sql        ← Queries prontas
│   └── Use no dia a dia
│
└── ⚙️ migrate.js         ← Script de migração
    └── Automatize tarefas
```

---

## 🎓 Casos de Uso

### 1️⃣ "Quero configurar o banco pela primeira vez"
1. Leia [QUICKSTART.md](./QUICKSTART.md)
2. Execute [schema.sql](./schema.sql) no Supabase
3. Execute [seeds.sql](./seeds.sql) para dados de teste
4. Use [CHECKLIST.md](./CHECKLIST.md) para verificar

---

### 2️⃣ "Preciso entender a estrutura do banco"
1. Veja o diagrama em [diagram.md](./diagram.md)
2. Leia a documentação em [README.md](./README.md)
3. Explore as queries em [queries.sql](./queries.sql)

---

### 3️⃣ "Como faço para buscar pacientes?"
1. Abra [queries.sql](./queries.sql)
2. Procure por "PACIENTES"
3. Copie a query que precisa
4. Execute no Supabase SQL Editor

---

### 4️⃣ "Quero adicionar uma nova coluna"
1. Leia sobre a tabela em [README.md](./README.md)
2. Crie um arquivo de migração
3. Execute no Supabase
4. Atualize [schema.sql](./schema.sql) para referência

---

### 5️⃣ "Preciso de um relatório específico"
1. Veja exemplos em [queries.sql](./queries.sql)
2. Adapte para sua necessidade
3. Salve a query personalizada

---

### 6️⃣ "Vou fazer deploy em produção"
1. Use [CHECKLIST.md](./CHECKLIST.md) para verificar tudo
2. Execute [schema.sql](./schema.sql) no Supabase de produção
3. **NÃO execute seeds.sql em produção!**
4. Configure backups automáticos
5. Revise políticas de segurança

---

## 📊 Estrutura Resumida

### Tabelas (12 no total)

| Tabela | Registros | Descrição |
|--------|-----------|-----------|
| **users** | ~3 | Atendentes e administradores |
| **contacts** | ~8 | Pacientes da clínica |
| **messages** | ~8 | Conversas recebidas |
| **appointments** | ~5 | Consultas agendadas |
| **budgets** | ~4 | Orçamentos |
| **surgeries** | ~3 | Cirurgias |
| **post_ops** | ~2 | Pós-operatórios |
| **follow_ups** | ~2 | Follow-ups |
| **tags** | 10 | Etiquetas de classificação |
| **message_tags** | ~N | Relacionamento N:M |
| **audit_logs** | ~N | Logs do sistema |
| **documents** | ~3 | Arquivos dos pacientes |

*Números com ~ são de dados de exemplo (seeds.sql)*

---

## 🔗 Links Externos Úteis

- 📚 [Documentação Supabase](https://supabase.com/docs)
- 🎓 [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html)
- 💬 [Supabase Discord](https://discord.supabase.com)
- 🐙 [Repositório do Projeto](https://github.com/seu-usuario/portal-clinic-bot)

---

## 🆘 Precisa de Ajuda?

### Problemas Comuns

**Erro ao executar SQL:**
- Veja a seção "Troubleshooting" em [QUICKSTART.md](./QUICKSTART.md)

**Não entendo um relacionamento:**
- Consulte o diagrama em [diagram.md](./diagram.md)

**Preciso de uma query específica:**
- Procure em [queries.sql](./queries.sql)

**Quero adicionar um campo:**
- Veja exemplos em [schema.sql](./schema.sql)

---

## 📝 Convenções

### Nomenclatura
- **Tabelas:** plural, snake_case (`contacts`, `audit_logs`)
- **Colunas:** singular, snake_case (`full_name`, `patient_id`)
- **PKs:** sempre `id` (UUID)
- **FKs:** `{tabela}_id` (`patient_id`, `user_id`)

### Timestamps
- `created_at`: Data de criação (automático)
- `updated_at`: Data de atualização (trigger automático)

### Status
Sempre em português:
- 'pendente', 'em_andamento', 'resolvido'
- 'agendado', 'confirmado', 'realizado'

---

## 🎯 Próximos Passos

Depois de explorar a documentação:

1. ⚙️ Configure o ambiente seguindo [QUICKSTART.md](./QUICKSTART.md)
2. ✅ Valide tudo com [CHECKLIST.md](./CHECKLIST.md)
3. 🚀 Comece a desenvolver!
4. 📖 Consulte [README.md](./README.md) quando necessário
5. 💡 Use [queries.sql](./queries.sql) no dia a dia

---

## 📊 Estatísticas

```
Total de Arquivos:     9
Total de Linhas:       ~1.500
Tamanho Total:         ~95 KB
Tabelas Documentadas:  12
Queries Prontas:       40+
Tempo de Setup:        10-15 min
```

---

## 🏆 Melhores Práticas

1. **Sempre faça backup** antes de mudanças grandes
2. **Use transactions** para operações críticas
3. **Teste em desenvolvimento** antes de produção
4. **Documente customizações** para a equipe
5. **Monitore performance** regularmente
6. **Revise logs** de auditoria periodicamente

---

## 📅 Versionamento

- **v1.0.0** (Jan 2024) - Versão inicial
  - 12 tabelas
  - 40+ queries prontas
  - Documentação completa

---

## 👥 Contribuindo

Encontrou um erro ou quer melhorar a documentação?

1. Abra uma issue no GitHub
2. Descreva o problema ou sugestão
3. Se possível, sugira uma solução

---

## 📄 Licença

Este projeto está sob licença [MIT](../LICENSE).

---

## 🎉 Pronto para Começar?

**[👉 Clique aqui para começar com o QUICKSTART](./QUICKSTART.md)**

---

*Documentação mantida pela equipe Portal Clinic Bot*  
*Última atualização: Janeiro 2024*  
*Versão: 1.0.0*

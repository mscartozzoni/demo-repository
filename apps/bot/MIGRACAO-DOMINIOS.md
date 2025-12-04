# 🌐 Guia de Migração de Domínios

## 📋 Situação Atual vs Nova Estrutura

### ❌ Domínios Antigos (marcioplasticsurgery.com)
```
agenda.marcioplasticsurgery.com
crm.marcioplasticsurgery.com
dashboard.marcioplasticsurgery.com
portal-medico.marcioplasticsurgery.com
orcamento.marcioplasticsurgery.com
financeiro.marcioplasticsurgery.com
```

### ✅ Novos Domínios (portal-clinic.*)
```
portal-clinic.app              → Aplicação principal
portal-clinic.com.br           → Site principal
portal-clinic.site             → Gestão médica

agenda.portal-clinic.com.br    → Sistema de agenda
crm.portal-clinic.com.br       → CRM
dashboard.portal-clinic.app    → Dashboard
prontuarios.portal-clinic.site → Prontuários e gestão médica
orcamento.portal-clinic.com.br → Orçamentos
financial.portal-clinic.com.br → Financeiro
ai.marcioplasticsurgery.com    → IA (mantém domínio atual)
db.portal-clinic.com.br        → Database admin
portal-clinic.shop             → E-commerce
```

---

## 🎯 Sistema Implementado

### ✅ O que foi criado:

1. **`src/config/domains.js`** - Configuração centralizada
   - Todos os domínios em um único arquivo
   - Suporte a múltiplos ambientes (dev, staging, prod)
   - Aliases para retrocompatibilidade
   - Sistema de fallback automático

2. **Atualizado `SystemRedirect.jsx`**
   - Usa getSystemUrl() para domínios dinâmicos
   - Adiciona 3 novos sistemas (AI, Database, Shop)
   - Total de 9 sistemas integrados

3. **`.env.domains.example`**
   - Template de variáveis de ambiente
   - Documentação de todos os domínios
   - Configurações por ambiente

---

## 🚀 Como Funciona

### Arquivo Único de Configuração

```javascript
// src/config/domains.js

const DOMAIN_CONFIG = {
  production: {
    agenda: 'https://agenda.portal-clinic.com.br',
    crm: 'https://crm.portal-clinic.com.br',
    // ... outros
  }
};

// Usar em qualquer lugar:
import { getSystemUrl } from '@/config/domains';

const agendaUrl = getSystemUrl('agenda');
// Resultado: https://agenda.portal-clinic.com.br
```

### Suporte a Múltiplos Ambientes

```javascript
// Development (localhost)
getSystemUrl('agenda', 'development')
→ http://localhost:3002

// Staging
getSystemUrl('agenda', 'staging')
→ https://agenda-staging.portal-clinic.com.br

// Production
getSystemUrl('agenda', 'production')
→ https://agenda.portal-clinic.com.br
```

### Aliases Automáticos

```javascript
// Domínio legado é automaticamente convertido
resolveLegacyDomain('agenda.marcioplasticsurgery.com')
→ 'agenda.portal-clinic.com.br'
```

---

## 📝 Etapas de Migração

### Fase 1: Preparação (Atual) ✅
- [x] Criar sistema de aliases
- [x] Atualizar componentes para usar configuração centralizada
- [x] Documentar novos domínios
- [x] Manter retrocompatibilidade

### Fase 2: Configuração DNS (A fazer)
- [ ] Registrar domínios portal-clinic.*
- [ ] Configurar DNS para cada subdomínio
- [ ] Apontar para servidores corretos
- [ ] Configurar SSL/TLS

### Fase 3: Deploy (A fazer)
- [ ] Deploy da aplicação principal em portal-clinic.app
- [ ] Deploy de cada sistema nos respectivos subdomínios
- [ ] Configurar redirecionamentos 301 dos domínios antigos
- [ ] Testar todos os links

### Fase 4: Migração Gradual (A fazer)
- [ ] Manter domínios antigos funcionando (redirect 301)
- [ ] Atualizar links externos
- [ ] Comunicar mudança aos usuários
- [ ] Monitorar logs de acesso

### Fase 5: Desativação dos Antigos (Futuro)
- [ ] Após 6 meses, avaliar uso dos domínios antigos
- [ ] Desativar redirecionamentos se não houver mais tráfego

---

## 🛠️ Configuração Atual

### Para Desenvolvimento Local

Em desenvolvimento, o sistema usa os **domínios reais de produção** porque os sistemas não estão rodando localmente. Isso é normal e esperado.

```
http://localhost:3000                          → Base (app principal)
https://agenda.marcioplasticsurgery.com        → Agenda (produção)
https://crm.marcioplasticsurgery.com           → CRM (produção)
...
```

**Por que?** Porque você não tem cada sistema rodando em portas separadas. Os sistemas integrados estão hospedados nos servidores reais.

### Para Staging

1. Defina no `.env`:
```bash
VITE_MODE=staging
```

2. O sistema automaticamente usará:
```
https://agenda-staging.portal-clinic.com.br
https://crm-staging.portal-clinic.com.br
...
```

### Para Produção

1. Defina no `.env`:
```bash
VITE_MODE=production
```

2. O sistema usará os novos domínios:
```
https://agenda.portal-clinic.com.br
https://crm.portal-clinic.com.br
...
```

---

## 🔧 Como Mudar Domínios

### Método 1: Arquivo de Configuração (Recomendado)

Edite apenas `src/config/domains.js`:

```javascript
production: {
  agenda: 'https://novo-dominio-agenda.com',
  crm: 'https://novo-dominio-crm.com',
  // ...
}
```

Pronto! Todos os componentes usarão os novos domínios automaticamente.

### Método 2: Variáveis de Ambiente

Crie um `.env`:

```bash
VITE_AGENDA_URL=https://meu-dominio-custom.com
```

E atualize `domains.js` para ler do env:

```javascript
agenda: import.meta.env.VITE_AGENDA_URL || 'https://agenda.portal-clinic.com.br',
```

---

## 📊 Mapa de Domínios

### Estrutura Hierárquica

```
portal-clinic.*
├── .app (aplicação principal)
│   ├── Base: portal-clinic.app
│   └── Dashboard: dashboard.portal-clinic.app
│
├── .com.br (sistemas operacionais)
│   ├── Agenda: agenda.portal-clinic.com.br
│   ├── CRM: crm.portal-clinic.com.br
│   ├── Orçamentos: orcamento.portal-clinic.com.br
│   ├── Financeiro: financial.portal-clinic.com.br
│   └── Database: db.portal-clinic.com.br
│
├── .site (gestão médica)
│   └── Prontuários: prontuarios.portal-clinic.site
│
└── .shop (e-commerce)
    └── Loja: portal-clinic.shop

Mantidos:
└── marcioplasticsurgery.com
    └── IA: ai.marcioplasticsurgery.com
```

---

## ✅ Vantagens do Sistema Atual

1. **Centralizado** - Mude todos os domínios em um único lugar
2. **Multi-ambiente** - Dev, Staging e Prod separados
3. **Retrocompatível** - Domínios antigos funcionam via aliases
4. **Escalável** - Fácil adicionar novos sistemas
5. **Documentado** - Tudo explicado e comentado
6. **Type-safe** - Com JSDoc para autocomplete
7. **Testável** - Funções puras e independentes

---

## 🆘 Troubleshooting

### Domínio não atualiza

1. Limpe cache do navegador (Ctrl+Shift+Del)
2. Verifique se está usando `getSystemUrl()` no componente
3. Recompile a aplicação: `npm run build`

### URL errada em produção

1. Verifique `VITE_MODE` no `.env`
2. Confirme que `domains.js` tem a config correta
3. Veja logs: `console.log(getSystemUrl('agenda'))`

### Sistema não aparece

1. Adicione o sistema em `DOMAIN_CONFIG`
2. Adicione em `SYSTEM_DOMAINS` se usar alias
3. Importe `getSystemUrl` nos componentes

---

## 📚 Referências

- **Arquivo principal:** `src/config/domains.js`
- **Exemplo de uso:** `src/components/SystemRedirect.jsx`
- **Variáveis de ambiente:** `.env.domains.example`
- **Documentação completa:** Este arquivo

---

## 🎯 Próximos Passos

1. ✅ **Atual:** Sistema de aliases implementado
2. ⏳ **Próximo:** Configurar DNS dos novos domínios
3. ⏳ **Depois:** Deploy em cada subdomínio
4. ⏳ **Futuro:** Migração completa e desativação dos antigos

---

**Status:** ✅ Sistema de aliases implementado e funcionando

**Última atualização:** 19/11/2024 20:05

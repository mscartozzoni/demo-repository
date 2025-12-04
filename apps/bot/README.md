# BotConversa - Painel de Atendimento Inteligente

Bem-vindo ao **BotConversa**, um sistema inteligente e moderno para gerenciamento de conversas e atendimento ao cliente. Este painel foi desenvolvido para otimizar a comunicação e a organização das interações, oferecendo uma experiência de usuário fluida e eficiente.

## ✨ Funcionalidades Principais

*   **Dashboard Intuitivo:** Visão geral das conversas, estatísticas e atividades em tempo real.
*   **Gerenciamento de Conversas:** Atendimento e acompanhamento de mensagens com detalhes do paciente, prioridade e etiquetas.
*   **🔗 Sistema Híbrido:** Integração inteligente entre Google Sheets (chat/logs) e Supabase (dados estruturados).
*   **Gerenciamento de Contatos:** Adicione, visualize e organize os contatos dos seus pacientes.
*   **Sistema de Auditoria:** Para usuários administradores, um painel completo de logs e atividades do sistema.
*   **Temas Claro e Escuro (Dark/Light Mode):** Alterne entre um visual moderno e elegante (escuro) e um design limpo e profissional (claro) para se adaptar às suas preferências.
*   **Notificações em Tempo Real:** Mantenha-se atualizado com as novas mensagens e eventos importantes.
*   **Interface Responsiva:** Design otimizado para diferentes tamanhos de tela, garantindo uma ótima experiência em qualquer dispositivo.
*   **Animações Suaves:** Transições e micro-interações que tornam a navegação mais agradável e intuitiva.

## 🚀 Tecnologias Utilizadas

Este projeto foi construído com as seguintes tecnologias de ponta:

*   **Vite:** Ferramenta de build e servidor de desenvolvimento rápido.
*   **React 18.2.0:** Biblioteca JavaScript para construção de interfaces de usuário.
*   **React Router 6.16.0:** Para navegação e roteamento entre as páginas.
*   **TailwindCSS 3.3.2:** Framework CSS utilitário para estilização rápida e responsiva.
*   **shadcn/ui:** Componentes de UI reutilizáveis e acessíveis, construídos com Radix UI.
*   **Supabase:** Banco de dados PostgreSQL para dados estruturados.
*   **Google Sheets API:** Para armazenamento de chat e logs com análise manual facilitada.
*   **Lucide React 0.292.0:** Biblioteca de ícones moderna e personalizável.
*   **Framer Motion 10.16.4:** Para animações e transições fluidas.
*   **TypeScript:** Para tipagem estática e melhor experiência de desenvolvimento.

---

# 📖 Manual de Integração do Backend

**LEIA COM ATENÇÃO:** Este documento é a fonte da verdade para a construção do backend que servirá este painel.

## 1. Visão Geral da Arquitetura

O **BotConversa** foi projetado para ser o frontend de uma API robusta. Atualmente, ele opera com dados locais (`localStorage`), mas está preparado para ser conectado a um backend real. Para que a integração seja bem-sucedida, a API deve seguir as especificações de endpoints, estruturas de dados (JSON) e autenticação detalhadas abaixo.

## 2. Fluxo de Autenticação (JWT)

A autenticação deve ser centralizada e baseada em JSON Web Tokens (JWT).

1.  **Endpoint de Login:** A API deve expor um endpoint (ex: `POST /api/auth/login`) que recebe `email` e `password`.
2.  **Geração do Token:** Em caso de sucesso, a API retorna um token JWT contendo as informações do usuário (ID, nome, email, `role`, etc.).
3.  **Armazenamento no Frontend:** O painel armazenará este token no `localStorage`.
4.  **Requisições Autenticadas:** Todas as chamadas subsequentes para endpoints protegidos devem incluir o token no cabeçalho `Authorization`: `Authorization: Bearer SEU_TOKEN_JWT`.

**Exemplo de Resposta do Login:**
```json
{
  "token": "SEU_TOKEN_JWT_AQUI",
  "user": {
    "id": "uuid-do-usuario",
    "name": "Nome do Atendente",
    "email": "atendente@email.com",
    "role": "admin" 
  }
}
```

## 3. Estrutura da API (Endpoints Necessários)

A API deve implementar os seguintes endpoints. O frontend já está preparado para consumi-los.

| Método | Endpoint Sugerido            | Descrição                                                                      |
| :----- | :--------------------------- | :----------------------------------------------------------------------------- |
| **POST** | `/webhook/botconversa`     | **Ponto de entrada principal.** Recebe dados do fluxo do bot para criar contatos e mensagens. |
| **POST** | `/api/auth/login`            | Autentica um usuário e retorna um token JWT.                                   |
| **GET**  | `/api/messages`              | Retorna a lista de todas as conversas/mensagens.                               |
| **POST** | `/api/messages`              | Cria uma nova mensagem (usado para respostas de atendentes no painel).         |
| **GET**  | `/api/contacts`              | Retorna a lista de todos os contatos (pacientes).                              |
| **GET**  | `/api/users`                 | Retorna a lista de todos os usuários (atendentes).                             |
| **GET**  | `/api/tags`                  | Retorna a lista de todas as etiquetas de classificação.                        |
| **GET**  | `/api/logs`                  | Retorna os logs de auditoria do sistema.                                       |
| **PUT**  | `/api/messages/{id}`         | Atualiza o status, prioridade ou atendente de uma mensagem.                    |
| **PUT**  | `/api/users/{id}`            | Atualiza os dados de um usuário (atendente).                                   |


## 4. Estrutura dos Dados (JSON)

### Webhook Principal (`POST /webhook/botconversa`)

Este é o endpoint que seu bot (ou sistema de URA) deve chamar para inserir uma nova conversa no painel.

**Corpo da Requisição (Exemplo):**
```json
{
  "patientId": "5511999998888",
  "patientName": "Nome do Paciente",
  "message": "Olá, gostaria de agendar uma consulta.",
  "email": "paciente@email.com",
  "tags": ["Primeira Consulta", "Orçamento"],
  "current_journey_step": "Agendamento Solicitado",
  "priority": "alta",
  "contact_status": "patient"
}
```

## 5. Estrutura do Banco de Dados (PostgreSQL)

Para garantir a compatibilidade, o banco de dados deve seguir a estrutura abaixo. O script SQL completo para criação das tabelas está disponível no painel em **Configurações > Banco de Dados**.

### Tabela: `users` (Atendentes)
| Coluna | Tipo de Dados | Descrição |
| :--- | :--- | :--- |
| `id` | `UUID` | Chave primária. |
| `name` | `VARCHAR(255)` | Nome do atendente. |
| `sector`| `VARCHAR(100)`| Setor do atendente. |
| `role` | `VARCHAR(50)` | "admin" ou "agent". |
| `email` | `VARCHAR(255)`| Email para login. |
| `password_hash`| `VARCHAR(255)`| Hash da senha. |
| `created_at`| `TIMESTAMPTZ`| Data de criação. |

### Tabela: `contacts` (Pacientes)
| Coluna | Tipo de Dados | Descrição |
| :--- | :--- | :--- |
| `id` | `UUID` | Chave primária. |
| `patient_id` | `VARCHAR(255)` | ID único do paciente (telefone, CPF). |
| `name` | `VARCHAR(255)` | Nome do paciente. |
| `last_activity` | `TIMESTAMPTZ` | Data da última interação. |

### Tabela: `messages` (Mensagens)
| Coluna | Tipo de Dados | Descrição |
| :--- | :--- | :--- |
| `id` | `UUID` | Chave primária. |
| `patient_id` | `VARCHAR(255)`| ID do paciente (chave estrangeira de `contacts`).|
| `message` | `TEXT` | Conteúdo da mensagem. |
| `status` | `VARCHAR(100)`| "pendente", "em_andamento", "resolvido". |
| `priority`| `VARCHAR(50)` | "baixa", "media", "alta". |
| `assigned_to_id`| `UUID` | ID do atendente responsável (chave estrangeira de `users`). |
| `created_at` | `TIMESTAMPTZ` | Data de criação. |

---

Documentação do Sistema de Gestão Clínica	

1. Visão Geral				
				
Este documento deve reunir todas as etapas e lógicas para implementar o POrta Clínic e a estrutura de dados no Google Sheets e Apps Script.				
				
Objetivos:				
				
Estrutura de planilha padronizada com aliases mascarados				
				
Backend - sistema de planilhas 							
				
Mecanismos de validação, tratamento de erros e prevenção de falhas				
				
Scripts de criação e população de dados fictícios para testes

2. Estrutura da Planilha				
				
Sistema de tabela / abas = tabela sender{json}, tabela arriver{json}	
				
Abas: criar via criarEstruturaBase()  - resolveByName        entity        name        alias        live records        id				
slug	lowercase, sem espaços			
							
2.1. Alias de Colunas				
				
Todos os cabeçalhos usam aliases para ofuscação e segurança. Definidos em aliasCampos (arquivo Code.gs):				
usar a aba plasceholders para consulta se necessario 				
				
Campo lógico	Alias	Descrição		
patient_id	id01	Identificador único do paciente		
full_name	p02	Nome completo		
phone	p03	Telefone		
email	p04	E-mail		
patients_status	p05	Status do paciente		
pasta_link	d01	Link da pasta no Drive		
appointment_date	a01	Data da consulta		
appointment_type	a02	Tipo de consulta		
appointment_status	a03	Status da consulta		
appointment_link	a04	Link da consulta (Meet, etc.)		
appointment_Obs	a05	Observações da consulta		
budget_id	b01	Identificador do orçamento		
budget_value	b02	Valor total do orçamento		
budget_status	b03	Status do orçamento		
budget_obs	b04	Observações do orçamento		
budget_date	b05	Data do orçamento		
surgery_date	s01	Data da cirurgia		
surgery_type	s02	Tipo de cirurgia		
surgery_hospital	s03	Local/hospital da cirurgia		
surgery_status	s04	Status da cirurgia		
surgery_team	s05	Equipe médica		
postop_date	s06	Data do pós-operatório		
postop_status	s07	Status do pós-operatório		
document_link	d02	Links adicionais (ex: relatórios)

3. Backend (servidor de email)				
				
Arquivo principal: caixa de email				
				
3.1. Funções de Criação e População				
				
criarEstruturaBase()								
				
Cria novas abas com cabeçalhos de aliases				
				
Exibe alerta de sucesso				
				
preencherAbasFicticias()				
				
Popula cada aba com 3 registros de teste				
				
Usa setValues() para inserção em bloco				
				
Gatilho único para testes funcionais

3.2. Funções de Busca				
				
Cada função lê a aba correspondente, identifica índices pelo indexOf(alias), e retorna array de objetos:				
				
buscarPacientes() → retorna { patient_id, full_name, phone, email, patients_status, pasta_link }				
				
buscarConsultas() → retorna { patient_id, appointment_date, appointment_type, appointment_status, appointment_link, appointment_Obs }				
				
buscarOrcamentos() → retorna { budget_id, patient_id, budget_value, budget_status, budget_obs, budget_date }				
				
buscarCirurgias() → retorna { patient_id, surgery_date, surgery_type, surgery_hospital, surgery_status, surgery_team }				
				
buscarPosOp() → retorna { patient_id, postop_date, postop_status }				
				
buscarFollowUp() → retorna { patient_id, appointment_date, appointment_status, appointment_Obs }				
				
Cada função verifica falta de aba e retorna array vazio para prevenir quebras.				
				
4. Frontend 				
				
Seis aetores: Identificação, Consulta, Orçamento, Cirurgia, Pós-Operatório, Follow-Up				
				
Campo de busca por nome ou patientId (caso-insensitivo)				
				
Variáveis de controle para carregamento (consultasCarregadas, etc.)				
				
Funções mostrarX() que filtram arrays pelo patientId e geram HTML dinâmico				
				
Tratamento de erros e mensagens amigáveis:				
				
"Carregando..."				
				
"Nenhuma consulta./orçamento/..." se não houver registros				
				
Fallback '-' para campos vazios

5. Instruções de Uso				
				
Garanta que a planilha de testes esteja no Drive Compartilhado e com ID correto.				
				
No Apps Script:				
				
Salve Code.gs e demais arquivos				
				
Execute criarEstruturaBase() (estrutura vazia)				
				
Execute preencherAbasFicticias() (dados mock)				
				
Em Extensões > Apps Script > Implantar como app da web:				
				
Executar como: Você mesmo				
				
Quem tem acesso: Qualquer pessoa com link (ou domínio específico)				
				
Copie o link e abra o painel para teste.				
				
Pesquise pacientes, navegue nas abas e valide dados.

6. Boas Práticas e Prevenções				
				
USAR ZAP / ZAPIER / WEBHOKK-ZAP

Criar os ficheiros em json 

## 🚀 Como Rodar o Projeto Localmente

### Pré-requisitos
- Node.js (versão 20 ou superior)
- npm

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Integração Híbrida (Opcional)
```bash
chmod +x scripts/setup-hybrid.sh
./scripts/setup-hybrid.sh
```

### 3. Rodar o Servidor de Desenvolvimento
```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`.

---

## 🔗 Sistema Híbrido: Google Sheets + Supabase

O Portal Clinic Bot utiliza uma **arquitetura híbrida inovadora** que combina:

- **📊 Google Sheets:** Para mensagens de chat, logs e análises manuais
- **🗄️ Supabase:** Para dados estruturados como pacientes, agendamentos e orçamentos

### 🎯 Vantagens da Arquitetura Híbrida

✅ **Análise Manual Facilitada:** Gestores podem analisar conversas em planilhas familiares  
✅ **Performance Otimizada:** Consultas estruturadas rápidas no Supabase  
✅ **Backup Distribuído:** Dados críticos em duas plataformas diferentes  
✅ **Flexibilidade:** Cada tipo de dado na plataforma mais adequada  

### 🚀 Setup Rápido da Integração

```bash
# Executar script de configuração automática
chmod +x scripts/setup-hybrid.sh
./scripts/setup-hybrid.sh
```

### 📋 Configuração Manual

1. **Google Sheets:**
   - Crie uma Service Account no Google Cloud Console
   - Configure as variáveis no .env:
     ```env
     VITE_GOOGLE_SHEET_ID=sua_planilha_id
     VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL=email@projeto.iam.gserviceaccount.com
     VITE_GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
     ```

2. **Supabase:**
   - Configure as variáveis no .env:
     ```env
     VITE_SUPABASE_URL=https://seu-projeto.supabase.co
     VITE_SUPABASE_ANON_KEY=sua_chave_anonima
     ```

3. **Testar Integração:**
   - Acesse `Configurações > Sistema Híbrido`
   - Verifique o status das conexões
   - Use a aba "Demo da API" para testar

📚 **Documentação completa:** [`HYBRID-INTEGRATION.md`](./HYBRID-INTEGRATION.md)
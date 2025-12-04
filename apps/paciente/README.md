# Sistema Médico - Portal Secretaria

Bem-vindo ao repositório do Sistema Médico - Portal Secretaria! Este projeto é uma aplicação web desenvolvida com React e Vite, projetada para auxiliar na gestão de clínicas e consultórios, com foco nas operações de secretaria.

## Visão Geral do Sistema

Este sistema modular oferece funcionalidades para:
- **Gestão de Pacientes**: Cadastro, consulta e acompanhamento de pacientes.
- **Agenda**: Agendamento e gerenciamento de consultas e procedimentos.
- **Jornada do Paciente**: Acompanhamento do paciente através de diferentes estágios do tratamento.
- **Mensagens**: Comunicação interna e externa.
- **Prazos**: Gerenciamento de tarefas e lembretes.
- **Protocolos**: Acesso a documentos e procedimentos padronizados.
- **Contatos**: Gerenciamento de contatos diversos.

## Configuração do Ambiente

Para rodar o projeto localmente, siga os passos abaixo:

### 1. Pré-requisitos

Certifique-se de ter o Node.js (versão 20 ou superior) e o npm instalados em sua máquina.

### 2. Instalação das Dependências

Navegue até a raiz do projeto no terminal e execute:

```bash
npm install
```

### 3. Configuração das Variáveis de Ambiente

Este projeto utiliza um arquivo `.env` para gerenciar variáveis de ambiente sensíveis, como credenciais de banco de dados e chaves de API.

Crie um arquivo chamado `.env` na raiz do projeto (se ele ainda não existir) e preencha-o com as suas credenciais. Um exemplo de estrutura pode ser:

```
DB_HOST=seu_host_do_banco
DB_PORT=3306
DB_NAME=seu_nome_do_banco
DB_USER=seu_usuario_do_banco
DB_PASSWORD="sua_senha_do_banco"
JWT_SECRET=sua_chave_secreta_jwt
API_SECRET_KEY=sua_chave_secreta_da_api
EDGE_FUNCTION_KEY=sua_chave_de_funcao_edge
```

**Importante**: O arquivo `.env` não deve ser versionado no controle de código (Git). Ele já está incluído no `.gitignore` para sua segurança.

### 4. Configuração do Backend (API PHP)

Este projeto se comunica com uma API PHP para persistência de dados. A API está localizada nos arquivos `api.php` e `config.php` na raiz do projeto.

- **`config.php`**: Este arquivo é responsável por carregar as variáveis do `.env` e definir as constantes de conexão com o banco de dados e chaves de segurança. **Não edite este arquivo diretamente**, ele lê as configurações do `.env`.
- **`api.php`**: Contém a lógica principal da API, incluindo roteamento, conexão com o banco de dados e manipulação de requisições.

Certifique-se de que seu ambiente de hospedagem (Hostinger) esteja configurado para servir arquivos PHP e que o banco de dados esteja acessível com as credenciais fornecidas no `.env`.

### 5. Proteção com `.htaccess`

O arquivo `.htaccess` na raiz do projeto é crucial para a segurança e o correto funcionamento da aplicação. Ele:
- Protege arquivos sensíveis (`.env`, `config.php`, `api.php`) de acesso direto via navegador.
- Configura o roteamento para a aplicação React (SPA - Single Page Application).
- Define cabeçalhos CORS e de segurança.

**Não altere o `.htaccess` a menos que saiba exatamente o que está fazendo.**

### 6. Rodando o Projeto

Após instalar as dependências e configurar o `.env`, você pode iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

Isso abrirá a aplicação no seu navegador, geralmente em `http://localhost:5173`.

### 7. Build para Produção

Para gerar uma versão otimizada para produção, execute:

```bash
npm run build
```

Os arquivos de produção serão gerados na pasta `dist/`.

## Estrutura do Projeto

- `public/`: Arquivos estáticos.
- `src/`: Código fonte da aplicação React.
  - `assets/`: Imagens, ícones, etc.
  - `components/`: Componentes reutilizáveis da UI.
  - `contexts/`: Contextos React para gerenciamento de estado global (ex: `ApiContext`, `NotificationContext`).
  - `hooks/`: Hooks personalizados.
  - `lib/`: Funções utilitárias.
  - `pages/`: Componentes de página (rotas).
  - `App.jsx`: Componente principal da aplicação e roteamento.
  - `main.jsx`: Ponto de entrada da aplicação.
- `api.php`: Lógica principal da API PHP.
- `config.php`: Configurações da API PHP (lê do `.env`).
- `.env`: Variáveis de ambiente (não versionado).
- `.htaccess`: Configurações do servidor web.
- `package.json`: Dependências e scripts do projeto.
- `tailwind.config.js`: Configuração do Tailwind CSS.
- `vite.config.js`: Configuração do Vite.

## Lógicas da API

A API PHP (`api.php`) é o coração do backend. Ela é responsável por:
- **Autenticação**: Validação de tokens JWT para acesso seguro.
- **Autorização**: Verificação de permissões baseadas no tipo de usuário.
- **Conexão com o Banco de Dados**: Gerencia a conexão com o MySQL.
- **Roteamento**: Direciona as requisições para os módulos corretos (pacientes, agendamentos, etc.).
- **Log de Auditoria**: Registra ações importantes no banco de dados.

**Endpoints Principais (Exemplos):**
- `/api/health`: Verifica o status da API e do banco de dados.
- `/api/schema`: Lista as tabelas do banco de dados (requer autenticação).
- `/api/patients`: Gerencia operações CRUD para pacientes.
- `/api/appointments`: Gerencia operações CRUD para agendamentos.

**Para mais detalhes sobre a implementação de cada módulo, consulte o código fonte em `api.php`.**

## Contribuição

[Instruções sobre como contribuir para o projeto, se aplicável]

## Licença

[Informações sobre a licença do projeto]

---

**Desenvolvido com ❤️ por [Seu Nome/Equipe]**


LEIA Orientações e Informações direta do Portal Admin com as informações de integração

# Portal Admin Clínica - Manual do Desenvolvedor

## 1. Visão Geral

Este documento serve como um guia técnico completo para o desenvolvimento, manutenção e integração do Portal Admin da Clínica. Ele foi construído com as mais modernas tecnologias de frontend para garantir uma experiência de usuário fluida, reativa e visualmente impactante.

O portal centraliza a gestão de usuários, agendamentos, permissões, configurações, documentos e integrações com outros sistemas satélites (Portal do Médico, Portal da Secretária, etc.).

---

## 2. Guia para Desenvolvedores de Portais Satélites (Médico, Secretária, etc.)

**Esta é a seção mais importante para equipes externas.** Para garantir uma integração perfeita, siga os passos abaixo:

1.  **Leia este `README.md` por completo.** Ele é a fonte única da verdade sobre a arquitetura de dados e autenticação.
2.  **Siga a Arquitetura de API:** A seção `Guia de Integração` abaixo detalha os endpoints e as estruturas de dados que o backend central deve fornecer. Seu portal deve consumir esses mesmos endpoints.
3.  **Implemente o Fluxo de Autenticação JWT:** A seção `Fluxo de Autenticação` explica como seu portal deve se integrar ao sistema de login centralizado. **Este é um passo crítico.**
4.  **Utilize os Componentes como Referência:** Sinta-se à vontade para usar a estrutura de componentes deste projeto como inspiração para construir uma UI consistente em todo o ecossistema.

---

## 3. Tecnologias Aplicadas

A seleção de tecnologias foi feita para garantir performance, escalabilidade e uma excelente experiência de desenvolvimento.

| Tecnologia | Versão | Propósito e Observações |
| :--- | :--- | :--- |
| **Vite** | `~4.4.5` | Build tool e servidor de desenvolvimento extremamente rápido. Proporciona Hot Module Replacement (HMR) instantâneo, agilizando o desenvolvimento. |
| **React** | `^18.2.0` | Biblioteca principal para a construção da interface de usuário. Utilizamos hooks como `useState`, `useEffect`, `useContext`, `useMemo` e `useCallback` para gerenciar estado e otimizar performance. |
| **React Router DOM** | `^6.16.0` | Para roteamento e navegação entre as páginas da aplicação. O hook `useLocation` foi usado no componente `Layout` para animar as transições de página. |
| **TailwindCSS** | `^3.3.3` | Framework CSS utility-first para estilização rápida e responsiva. Permite criar designs complexos diretamente no JSX sem sair do contexto. |
| **shadcn/ui** | N/A | Coleção de componentes de UI reusáveis, acessíveis e customizáveis, construídos sobre Radix UI e TailwindCSS. **Importante:** Cada componente foi criado manualmente no projeto para total controle. |
| **Framer Motion** | `^10.16.4` | Biblioteca de animação para React. Usada extensivamente para criar transições de página, animações de entrada de componentes e microinterações, tornando a UI mais viva e intuitiva. |
| **Lucide React** | `^0.285.0` | Pacote de ícones SVG limpos, consistentes e otimizados. |
| **react-helmet-async** | `^2.0.5` | Para gerenciar o `<head>` do documento, permitindo a definição de `títulos` e `meta tags` de SEO para cada página. |
| **date-fns** | `^2.30.0` | Biblioteca moderna para manipulação de datas em JavaScript, usada para formatar datas e horas em agendamentos e logs. |
| **React Dropzone** | `^14.2.3` | Hook para criar uma área de arrastar e soltar (drag'n'drop) para upload de arquivos. |
| **jwt-decode** | `^4.0.0` | Biblioteca para decodificar tokens JWT no lado do cliente de forma segura. |

---

## 4. Guia de Integração com Portais Satélites

Para que os portais satélites (Médico, Secretária, Paciente, etc.) se comuniquem de forma eficaz com este painel administrativo, eles devem seguir a arquitetura de API e a estrutura de dados definidas abaixo.

### 4.1. Fluxo de Autenticação (JWT via Supabase)

A autenticação é centralizada no `portal.marcioplasticsurgery.com`, que utiliza o sistema de Auth do Supabase.

1.  **Redirecionamento para Login:** O seu portal **NÃO DEVE** ter uma tela de login própria. Em vez disso, ao detectar um usuário não autenticado, ele deve redirecioná-lo para o portal central, passando a URL de callback:
    `https://portal.marcioplasticsurgery.com?redirectTo=URL_DE_CALLBACK_DO_SEU_PORTAL`
2.  **Recebimento do Token:** Após o login bem-sucedido, o portal central redirecionará o usuário de volta para a `URL_DE_CALLBACK_DO_SEU_PORTAL`, incluindo o token JWT na URL (ex: `.../callback#access_token=SEU_TOKEN_JWT`).
3.  **Armazenamento e Decodificação:** Sua aplicação deve capturar este token, armazená-lo no `localStorage` e usar a biblioteca `jwt-decode` para extrair as informações do usuário (ID, nome, email, role, permissões).
4.  **Requisições Autenticadas:** Todas as chamadas subsequentes para a API devem incluir o token no cabeçalho `Authorization`:
    `Authorization: Bearer SEU_TOKEN_JWT`

### 4.2. Estrutura de API e Endpoints do Backend

Para que o portal funcione corretamente, o backend (API PHP) deve implementar os seguintes endpoints.

| Módulo | Método | Rota (Endpoint) | Descrição |
| :--- | :--- | :--- | :--- |
| **Saúde** | `GET` | `/api/health` | Verifica a saúde da API e a conexão com o banco. |
| | `GET` | `/api/schema` | (Opcional, protegido) Lista as tabelas do banco de dados. |
| **Pacientes** | `GET` | `/api/patients` | Lista todos os pacientes com paginação e busca (`?search=...`). |
| | `GET` | `/api/patients/{id}` | Busca os detalhes de um paciente específico. |
| | `POST` | `/api/patients` | Cria um novo paciente. |
| | `PUT` | `/api/patients/{id}` | Atualiza os dados de um paciente. |
| | `DELETE`| `/api/patients/{id}` | Remove um paciente (ou inativa). |
| **Agenda** | `GET` | `/api/appointments` | Lista agendamentos (`?date=YYYY-MM-DD` ou `?month=...`). |
| | `POST` | `/api/appointments` | Cria um novo agendamento. |
| | `PUT` | `/api/appointments/{id}`| Atualiza um agendamento. |
| | `DELETE`| `/api/appointments/{id}`| Cancela um agendamento. |
| **Jornada** | `GET` | `/api/journeys` | Lista todas as jornadas ativas. |
| | `GET` | `/api/patients/{id}/journey`| Busca a jornada de um paciente específico. |
| | `PUT` | `/api/journeys/{journeyId}/stages/{stageId}` | Atualiza o status/dados de uma etapa da jornada. |
| **Contatos** | `GET` | `/api/contacts` | Lista todos os contatos. |
| | `POST` | `/api/contacts` | Cria um novo contato. |
| | `POST` | `/api/contacts/{id}/convert` | Converte um contato em um paciente. |
| **Prazos** | `GET` | `/api/tasks` | Lista todas as tarefas/prazos. |
| | `POST` | `/api/tasks` | Cria uma nova tarefa. |
| | `PUT` | `/api/tasks/{id}` | Atualiza uma tarefa (ex: marcar como concluída). |
| **Logs** | `GET` | `/api/logs` | Lista os logs de auditoria recentes (`?limit=...`). |

### 4.3. Estrutura de Tabelas (Banco de Dados)

O backend que servirá a este painel deve ter tabelas (ou coleções) que correspondam às seguintes estruturas.

#### Tabela: `users` (Usuários do Sistema)
Responsável pela autenticação e permissões. Gerenciada pelo Portal Admin.

| Coluna | Tipo de Dados | Descrição | Exemplo |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` / `string` | Chave primária única. | `"user_123"` |
| `name` | `string` | Nome completo do usuário. | `"Dr. João Silva"` |
| `email` | `string` | Endereço de email (usado para login). | `"joao.silva@clinica.com"` |
| `role` | `string` | Nome da função (e.g., "medico", "secretaria"). | `"secretaria"` |
| `avatar` | `string` (URL) | URL da imagem de perfil. | `"https://.../avatar.png"` |
| `status` | `enum('active', 'inactive')` | Status da conta do usuário. | `"active"` |
| `permissions` | `JSON` ou `TEXT` | Lista de permissões. | `["read:patient", "write:schedule"]`|
| `created_at` | `timestamp` | Data de criação. | `CURRENT_TIMESTAMP` |
| `last_login` | `timestamp` | Data do último login. | `"2025-08-26T14:30:00Z"` |

#### Tabela: `patients` (Pacientes)
Coração da operação da secretaria.

| Coluna | Tipo de Dados | Descrição | Exemplo |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` / `string` | Chave primária. | `"pat_abc"` |
| `name` | `string` | Nome completo do paciente. | `"Maria Souza"` |
| `birth_date` | `date` | Data de nascimento. | `"1990-05-15"` |
| `cpf` | `string` | CPF do paciente. | `"123.456.789-00"` |
| `phone` | `string` | Telefone de contato. | `"(11) 98765-4321"` |
| `email` | `string` | Email do paciente. | `"maria.s@email.com"` |
| `address` | `JSON` ou `TEXT`| Endereço completo. | `{"street": "Rua...", "city": "..."}` |
| `created_at` | `timestamp` | Data de cadastro. | `CURRENT_TIMESTAMP` |
| `user_id` | `UUID` / `string` | Chave estrangeira para `users` (se o paciente puder logar). | `NULL` |

#### Tabela: `appointments` (Agendamentos)

| Coluna | Tipo de Dados | Descrição | Exemplo |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` / `string` | Chave primária. | `"appt_456"` |
| `patient_id` | `UUID` / `string` | Chave estrangeira para `patients`. | `"pat_abc"` |
| `professional_id`| `UUID` / `string` | Chave estrangeira para `users` (médico). | `"user_123"` |
| `start_time` | `datetime` | Data e hora de início. | `"2025-09-10 14:00:00"` |
| `end_time` | `datetime` | Data e hora de término. | `"2025-09-10 14:30:00"` |
| `type` | `string` | "Consulta", "Cirurgia", "Retorno". | `"Consulta"` |
| `status` | `enum(...)` | "confirmed", "cancelled", "completed". | `"confirmed"` |
| `notes` | `TEXT` | Observações da secretaria sobre o agendamento. | `"Paciente pediu para confirmar 1 dia antes."` |

#### Tabela: `patient_journeys` (Jornada do Paciente)

| Coluna | Tipo de Dados | Descrição | Exemplo |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` / `string` | Chave primária. | `"jny_def"` |
| `patient_id` | `UUID` / `string` | Chave estrangeira para `patients`. | `"pat_abc"` |
| `current_stage`| `string` | Nome da etapa atual. | `"Triagem"` |
| `stages_data`| `JSON` | Dados de cada etapa (checklist, datas, etc.). | `{"Triagem": {"completed": true, "date": "..."}}` |
| `status` | `enum(...)` | "active", "completed", "paused". | `"active"` |
| `updated_at`| `timestamp` | Última atualização na jornada. | `CURRENT_TIMESTAMP` |

#### Tabela: `logs` (Trilha de Auditoria)

| Coluna | Tipo de Dados | Descrição | Exemplo |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` (auto_increment) | Chave primária. | `101` |
| `user_id` | `UUID` / `string` | Quem realizou a ação (de `users`). | `"user_xyz"` |
| `action` | `string` | Descrição da ação. | `"create_patient"` |
| `details` | `JSON` ou `TEXT`| Detalhes da ação. | `{"patient_id": "pat_abc", "name": "Maria Souza"}` |
| `timestamp`| `timestamp` | Quando a ação ocorreu. | `CURRENT_TIMESTAMP` |

### 4.4. Notificações

O sistema de notificações é reativo. Para que o "sininho" exiba novas notificações em tempo real, o backend deve, idealmente, fornecer um mecanismo de push (como WebSockets ou Server-Sent Events). Alternativamente, a aplicação pode fazer polling a um endpoint como `GET /api/notifications`.

**Estrutura da Notificação:**

```json
{
  "id": "notif_abc",
  "title": "Novo Paciente Cadastrado",
  "description": "Maria Souza foi adicionada ao sistema.",
  "type": "info",
  "timestamp": "2025-08-26T15:00:00Z",
  "read": false,
  "link": "/patients/pat_abc" 
}
```

---

## 5. Próximos Passos e Expansão

1.  **Conectar ao Backend:** Substituir as chamadas de mock/`localStorage` nos Contextos React (`ApiContext.jsx`) por chamadas `fetch` para a API real, seguindo a estrutura de endpoints definida acima.
2.  **Implementar Autenticação Real:** O `AuthContext.jsx` já está preparado para o fluxo de autenticação JWT descrito acima. A página `Callback.jsx` precisa apenas que o portal principal redirecione o token corretamente.
3.  **Expandir Funcionalidades:** Utilizar a base sólida e os componentes reutilizáveis para adicionar novas telas e funcionalidades conforme a necessidade da clínica.

Este manual garante que qualquer desenvolvedor possa rapidamente entender a arquitetura do projeto e contribuir de forma produtiva.